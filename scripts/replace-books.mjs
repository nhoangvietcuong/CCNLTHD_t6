import { readFileSync } from 'node:fs';
import { loadCloudTestEnv } from './cloud-test-config.mjs';
import { assertBookSeedTarget } from './books-seed-core.mjs';
import { parseCoverOptions, validateCoverMap } from './book-cover-sync-core.mjs';
import { assertCoverServiceAccount, checkCoverImage } from './cover-sync-runtime.mjs';
import { createCoverContext, coverStep, safeCoverFailure, CoverDiagnosticError } from './cover-sync-diagnostics.mjs';

const context=createCoverContext();
async function main(){
 const options=parseCoverOptions(process.argv.slice(2));
 if(options.help){console.log('npm run replace:books -- --project nextbooks-dev --dry-run [--check-existing]\nnpm run replace:books -- --project nextbooks-dev --apply\nThay 16 sách thiếu bìa. Không đổi giá/stock/category, không xóa/tạo document hoặc sửa orders.');return;}
 const map=JSON.parse(readFileSync(new URL('../data/book-replacements.json',import.meta.url),'utf8'));
 validateCoverMap(map);
 if(map.books.length!==16||map.books.some(b=>!b.imageChecked||b.verificationStatus!=='verified'))throw new CoverDiagnosticError('REPLACEMENT_IMAGES_UNVERIFIED','validation');
 let app,db;
 try{
  let snapshots;
  if(options.apply||options.inspect){
   coverStep(context,'configuration','load-development-config');
   const {project,env}=loadCloudTestEnv(options.project);assertBookSeedTarget(options.project,env,project);assertCoverServiceAccount(project,env.FIREBASE_ADMIN_CLIENT_EMAIL);
   delete process.env.FIRESTORE_EMULATOR_HOST;
   coverStep(context,'admin-init','initialize-development-admin');
   const {initializeApp,cert}=await import('firebase-admin/app');const {getFirestore}=await import('firebase-admin/firestore');
   app=initializeApp({projectId:project,credential:cert({projectId:project,clientEmail:env.FIREBASE_ADMIN_CLIENT_EMAIL,privateKey:env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g,'\n')})},'replace-books');
   db=getFirestore(app,'(default)');assertBookSeedTarget(options.project,env,db.projectId,db.databaseId);
   coverStep(context,'read','read-existing-products');
   snapshots=(await db.getAll(...map.books.map(b=>db.collection('products').doc(b.productId)))).map(d=>({id:d.id,exists:d.exists,data:d.exists?d.data():{},updateTime:d.updateTime}));
  }else{
   const audit=JSON.parse(readFileSync(new URL('../data/book-products-audit.json',import.meta.url),'utf8'));
   snapshots=audit.products.map(({productId,...data})=>({id:productId,exists:true,data}));
  }
  const updates=[];
  coverStep(context,'plan','compare-old-or-already-replaced-identity');
  for(const book of map.books){
   context.documentId=book.productId;
   const snapshot=snapshots.find(s=>s.id===book.productId);
   if(!snapshot?.exists)throw new CoverDiagnosticError('REPLACEMENT_DOCUMENT_MISSING','document');
   const old=snapshot.data.name===book.oldTitle&&snapshot.data.author===book.oldAuthor;
   const current=snapshot.data.name===book.title&&snapshot.data.author===book.author;
   if(!old&&!current)throw new CoverDiagnosticError('REPLACEMENT_IDENTITY_CONFLICT','validation');
   const patch={name:book.title,author:book.author,imageUrl:book.imageUrl,
    description:`Sách “${book.title}” — ${book.author}. Ấn bản: ${book.edition}. Dữ liệu development: giá, tồn kho và nhận xét dùng để thử nghiệm.`,
    coverMetadata:{isbn:book.isbn,edition:book.edition,source:book.source,sourceUrl:book.sourceUrl,verifiedAt:book.checkedAt}};
   if(current&&snapshot.data.imageUrl===patch.imageUrl&&Object.entries(patch.coverMetadata).every(([key,value])=>snapshot.data.coverMetadata?.[key]===value))continue;
   updates.push({id:book.productId,patch,updateTime:snapshot.updateTime});
   console.log(`${book.oldTitle} -> ${book.title}`);
  }
  context.plannedIds=updates.map(u=>u.id);context.documentId=null;
  console.log({mode:options.apply?'APPLY':'DRY-RUN',project:'nextbooks-dev',database:'(default)',plannedUpdates:updates.length,skipped:16-updates.length});
  if(!options.apply){console.log('updated=0; KHÔNG ghi Cloud.');return;}
  for(const item of updates){coverStep(context,'image-check','verify-replacement-cover',item.id);await checkCoverImage(item.patch.imageUrl);}
  coverStep(context,'prepare','prepare-replacement-only-batch');
  if(updates.length){
   const batch=db.batch();for(const item of updates){if(!item.updateTime)throw new CoverDiagnosticError('MISSING_PRECONDITION','validation');batch.update(db.collection('products').doc(item.id),item.patch,{lastUpdateTime:item.updateTime});}
   coverStep(context,'commit','atomic-replacement-batch');context.writeState='committing';await batch.commit();
  }
  context.writeState='committed';context.confirmedUpdatedIds=[...context.plannedIds];console.log({updated:updates.length,updatedIds:context.confirmedUpdatedIds});
  coverStep(context,'verify','read-back-replaced-products');
  const reread=updates.length?await db.getAll(...updates.map(u=>db.collection('products').doc(u.id))):[];
  const mismatch=reread.filter((d,i)=>!d.exists||['name','author','imageUrl'].some(k=>d.data()[k]!==updates[i].patch[k]));
  if(mismatch.length)throw new CoverDiagnosticError('READ_BACK_MISMATCH','verification');
  console.log({verified:true,checked:reread.length,created:0,deleted:0});
 }finally{if(db)await db.terminate().catch(()=>{});if(app){const {deleteApp}=await import('firebase-admin/app');await deleteApp(app).catch(()=>{});}}
}
await main().catch(error=>{console.error(safeCoverFailure(error,context));process.exitCode=1;});

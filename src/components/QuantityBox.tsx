"use client";

import { useState } from "react";

export default function QuantityBox() {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex items-center gap-3">
      <button 
        type="button"
        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition hover:bg-slate-100"
      >
        -
      </button>
      <span className="min-w-6 text-center text-sm font-semibold text-slate-900">
        {quantity}
      </span>
      <button 
        type="button"
        onClick={() => setQuantity((q) => q + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 text-slate-600 transition hover:bg-slate-100"
      >
        +
      </button>
    </div>
  );
}
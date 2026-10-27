"use client";

import React from "react";

export function coverCandidates(imageUrl: string, slug: string): string[] {
  const local = /^[-a-z0-9]+$/.test(slug) ? `/books/${slug}.jpg` : "";
  let safe = "";
  if (imageUrl.startsWith("/") && !imageUrl.startsWith("//") && !imageUrl.includes("\\")) safe = imageUrl;
  else {
    try {
      const url = new URL(imageUrl);
      if (url.protocol === "https:" && !url.username && !url.password) safe = url.href;
    } catch { /* Invalid URLs fall through to the local asset/placeholder. */ }
  }
  // The previous SVGs are demo artwork, not verified publication covers.
  return [...new Set([safe.startsWith("/demo-covers/") || safe === "/placeholder.svg" ? "" : safe, local, "/placeholder.svg"].filter(Boolean))];
}

export function BookCover({ imageUrl, slug, name, eager = false }: {
  imageUrl: string; slug: string; name: string; eager?: boolean;
}) {
  const [failed, setFailed] = React.useState<string[]>([]);
  const candidates = coverCandidates(imageUrl, slug);
  const source = candidates.find((url) => !failed.includes(url));
  return (
    <div className="relative mx-auto flex aspect-[2/3] h-full max-w-full items-center justify-center">
      {source ? (
        // Arbitrary authorized cover URLs are displayed directly, without a server image proxy.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={source} src={source} alt={name} loading={eager ? "eager" : "lazy"}
          ref={(element) => {
            // Recover errors that finished before React attached the onError handler.
            if (element?.complete && element.naturalWidth === 0) {
              setFailed((urls) => urls.includes(source) ? urls : [...urls, source]);
            }
          }}
          referrerPolicy="no-referrer" onError={() => setFailed((urls) => [...urls, source])}
          className="h-full w-full object-contain" />
      ) : <span className="p-3 text-center text-xs text-gray-600">Chưa có ảnh bìa: {name}</span>}
    </div>
  );
}

"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// Reads the URL query (?seva=, ?amount=) inside its own tiny Suspense
// boundary and hands it to the page through `onChange`.
//
// Calling useSearchParams() directly in a page component makes Next.js skip
// server rendering for everything up to the nearest Suspense boundary, so
// search engines got only a short fallback instead of the seva page. With
// this watcher only an empty node is client-rendered; the page itself is
// fully server-rendered and receives the params right after hydration.
function Reader({ onChange }: { onChange: (params: URLSearchParams) => void }) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  useEffect(() => {
    onChange(new URLSearchParams(query));
  }, [query, onChange]);
  return null;
}

export default function SearchParamsWatcher({ onChange }: { onChange: (params: URLSearchParams) => void }) {
  return (
    <Suspense fallback={null}>
      <Reader onChange={onChange} />
    </Suspense>
  );
}

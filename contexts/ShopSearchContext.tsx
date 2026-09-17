"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Shared product-search state between the shop navbar (app/shop/layout.tsx)
// and the catalog grid (app/shop/page.tsx). The grid filters live as the
// devotee types in the navbar search box; on other pages the same query is
// what gets carried into /shop?search=... on submit.
interface ShopSearchValue {
  query: string;
  setQuery: (q: string) => void;
}

const ShopSearchContext = createContext<ShopSearchValue>({
  query: "",
  setQuery: () => {},
});

export function ShopSearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");
  return (
    <ShopSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </ShopSearchContext.Provider>
  );
}

export function useShopSearch() {
  return useContext(ShopSearchContext);
}
"use client";

import { useState, useEffect } from "react";

export function useHydratedStore<T, U>(
  useStore: {
    <V>(selector: (state: T) => V): V;
    getState: () => T;
  },
  selector: (state: T) => U
): U | undefined {
  const result = useStore(selector);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? result : undefined;
}



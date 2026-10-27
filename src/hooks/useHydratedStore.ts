"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

export function useHydratedStore<T, U>(
  useStore: {
    <V>(selector: (state: T) => V): V;
    getState: () => T;
  },
  selector: (state: T) => U
): U | undefined {
  const result = useStore(selector);
  const isHydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);

  return isHydrated ? result : undefined;
}



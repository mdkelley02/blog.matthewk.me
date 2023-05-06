import React, { useState, useEffect } from "react";

export const StorageKeys = {
  Theme: "APP_THEME",
  Articles: "ARTICLES",
} as const;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  parser?: (value: string) => T
): [T, (value: T) => void] {
  const unmarshal = React.useMemo(() => parser ?? JSON.parse, [parser]);
  const [value, setValue] = useState<T>(() => {
    const item = localStorage.getItem(key);
    return item ? unmarshal(item) : initialValue;
  });

  useEffect(
    () => localStorage.setItem(key, JSON.stringify(value)),
    [key, value]
  );

  return [value, setValue];
}

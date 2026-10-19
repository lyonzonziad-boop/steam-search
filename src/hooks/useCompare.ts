import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sf_compare_list";
const MAX_COMPARE = 4;

export interface CompareStub {
  appid: number;
  name: string;
  headerImage: string;
}

function load(): CompareStub[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function save(list: CompareStub[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function useCompare() {
  const [list, setList] = useState<CompareStub[]>(() => load());

  useEffect(() => {
    save(list);
  }, [list]);

  const add = useCallback((game: CompareStub) => {
    setList((prev) => {
      if (prev.some((g) => g.appid === game.appid)) return prev;
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, game];
    });
  }, []);

  const remove = useCallback((appid: number) => {
    setList((prev) => prev.filter((g) => g.appid !== appid));
  }, []);

  const toggle = useCallback((game: CompareStub) => {
    setList((prev) => {
      if (prev.some((g) => g.appid === game.appid)) {
        return prev.filter((g) => g.appid !== game.appid);
      }
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, game];
    });
  }, []);

  const clear = useCallback(() => setList([]), []);

  const isFull = list.length >= MAX_COMPARE;
  const has = useCallback((appid: number) => list.some((g) => g.appid === appid), [list]);

  return { list, add, remove, toggle, clear, isFull, has, max: MAX_COMPARE };
}

import { useCallback, useEffect, useState } from "react";

const KEY = "mansetle-saved";
const SUB_KEY = "mansetle-subscribed";
const LEGACY_KEY = "buletin-saved";
const LEGACY_SUB_KEY = "buletin-subscribed";

function readIds(): string[] {
  try {
    const current = localStorage.getItem(KEY);
    const raw = current ?? localStorage.getItem(LEGACY_KEY);
    if (!current && raw) localStorage.setItem(KEY, raw);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function useSaved() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(readIds());
  }, []);

  const toggle = useCallback((slug: string) => {
    setIds((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem(KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const has = useCallback((slug: string) => ids.includes(slug), [ids]);

  return { ids, has, toggle };
}

export function useSubscribe() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SUB_KEY) ?? localStorage.getItem(LEGACY_SUB_KEY);
    if (stored) {
      localStorage.setItem(SUB_KEY, stored);
      setEmail(stored);
      setDone(true);
    }
  }, []);

  const submit = (value: string) => {
    const next = value.trim();
    if (!next || !next.includes("@")) return false;
    localStorage.setItem(SUB_KEY, next);
    setEmail(next);
    setDone(true);
    return true;
  };

  return { email, done, submit, setDone };
}

import { useState, useEffect, useCallback } from "react";

/** Fréquence d'affichage du récap quotidien. */
export type RecapFrequency = "once_per_day" | "every_open";

const DEFAULT: RecapFrequency = "once_per_day";
const key = (email: string) => `stocks:daily-recap:freq:${email}`;

export function getRecapFrequency(email: string): RecapFrequency {
  try {
    const v = localStorage.getItem(key(email));
    return v === "every_open" || v === "once_per_day" ? v : DEFAULT;
  } catch {
    return DEFAULT;
  }
}

export function setRecapFrequency(email: string, value: RecapFrequency) {
  try {
    localStorage.setItem(key(email), value);
  } catch {
    /* ignore */
  }
}

/** Hook réactif pour lire/écrire la préférence de fréquence du récap. */
export function useRecapFrequency(email: string): [RecapFrequency, (v: RecapFrequency) => void] {
  const [freq, setFreq] = useState<RecapFrequency>(() => getRecapFrequency(email));

  useEffect(() => {
    setFreq(getRecapFrequency(email));
  }, [email]);

  const update = useCallback(
    (v: RecapFrequency) => {
      setRecapFrequency(email, v);
      setFreq(v);
    },
    [email],
  );

  return [freq, update];
}

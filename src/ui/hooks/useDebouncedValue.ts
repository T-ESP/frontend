import { useEffect, useState } from 'react';

/**
 * Retarde la propagation d'une valeur tant qu'elle continue de changer.
 * Utilisé pour ne pas déclencher une requête serveur à chaque frappe.
 */
export function useDebouncedValue<T>(value: T, delayMs = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

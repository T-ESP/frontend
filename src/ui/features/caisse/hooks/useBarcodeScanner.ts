import { useEffect, useRef } from "react";

/**
 * Repli pour la saisie MANUELLE : si le poste est en AZERTY et la scannette en
 * QWERTY, la rangée des chiffres sort en symboles (1→&, 2→é, …). On remappe.
 * (Le scan matériel, lui, passe par les touches physiques `event.code` ci-dessous
 * et est donc déjà indépendant du layout.)
 */
const AZERTY_TO_DIGIT: Record<string, string> = {
  "&": "1", "é": "2", '"': "3", "'": "4", "(": "5",
  "-": "6", "è": "7", "_": "8", "ç": "9", "à": "0",
};

export function normalizeScan(raw: string): string {
  return raw
    .split("")
    .map((c) => AZERTY_TO_DIGIT[c] ?? c)
    .join("");
}

/**
 * Capture une scannette code-barres USB (HID clavier) de façon **indépendante du
 * layout clavier** (fonctionne en QWERTY/US comme en AZERTY/FR).
 *
 * Astuce : on lit `event.code` (la touche PHYSIQUE : "Digit5", "Numpad5", …) et non
 * `event.key` (le caractère, qui dépend du layout du poste). Les chiffres d'un
 * code-barres sont donc toujours corrects, quel que soit le clavier système.
 *
 * On distingue un scan (frappe très rapide) d'une saisie humaine via le délai entre
 * deux touches. Sur Entrée, si le tampon est assez long, on déclenche `onScan`.
 */
export function useBarcodeScanner(
  onScan: (code: string) => void,
  options: { enabled?: boolean; minLength?: number } = {}
) {
  const { enabled = true, minLength = 3 } = options;
  const bufferRef = useRef<string>("");
  const lastTimeRef = useRef<number>(0);
  const SCAN_CHAR_DELAY = 80; // ms max entre 2 frappes pour rester un "scan"

  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isScanField = target?.getAttribute?.("data-scan-input") === "true";
      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      // On capture globalement + dans le champ de scan dédié, mais pas dans les
      // autres champs (recherche client, formulaires…).
      if (isEditable && !isScanField) return;

      const now = Date.now();
      const elapsed = now - lastTimeRef.current;

      if (e.key === "Enter" || e.code === "NumpadEnter") {
        const code = bufferRef.current.trim();
        bufferRef.current = "";
        // Frappe rapide + tampon suffisant = scan → on gère et on empêche la
        // soumission du formulaire. Sinon (saisie lente) on laisse le formulaire.
        if (code.length >= minLength) {
          e.preventDefault();
          onScanRef.current(code);
        }
        return;
      }

      // Touche physique chiffre (indépendant du layout) sinon caractère brut
      let ch: string | null = null;
      const physicalDigit = e.code.match(/^(?:Digit|Numpad)(\d)$/);
      if (physicalDigit) {
        ch = physicalDigit[1];
      } else if (e.key.length === 1) {
        ch = e.key;
      }
      if (ch === null) return;

      if (elapsed > SCAN_CHAR_DELAY) {
        bufferRef.current = "";
      }
      bufferRef.current += ch;
      lastTimeRef.current = now;
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, minLength]);
}

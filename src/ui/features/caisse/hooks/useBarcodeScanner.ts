import { useEffect, useRef } from "react";

/**
 * Corrige les codes-barres scannés quand la scannette est en layout US (QWERTY)
 * alors que le poste est en AZERTY : la rangée des chiffres sort alors en symboles
 * (1→&, 2→é, 3→", 4→', 5→(, 6→-, 7→è, 8→_, 9→ç, 0→à). On remappe vers les chiffres.
 * Les codes déjà corrects (chiffres) sont laissés tels quels.
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
 * Capture les frappes d'une scannette code-barres USB (HID clavier) en tant que
 * FALLBACK global : quand aucun champ de saisie n'a le focus. Le cas nominal (champ
 * de scan focus) est géré par le formulaire de la page. La scannette "tape" le code
 * très vite puis envoie Entrée ; on distingue scan vs frappe humaine via la vitesse.
 *
 * @param onScan  callback appelé avec le code-barres (déjà normalisé) sur un scan
 * @param options.enabled  active/désactive l'écoute globale
 * @param options.minLength longueur minimale d'un code valide
 */
export function useBarcodeScanner(
  onScan: (code: string) => void,
  options: { enabled?: boolean; minLength?: number } = {}
) {
  const { enabled = true, minLength = 3 } = options;
  const bufferRef = useRef<string>("");
  const lastTimeRef = useRef<number>(0);
  // Délai max (ms) entre deux frappes pour les considérer comme un scan
  const SCAN_CHAR_DELAY = 80;

  const onScanRef = useRef(onScan);
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Fallback uniquement : si un champ a le focus (dont le champ de scan),
      // c'est le formulaire de la page qui gère — on n'interfère pas.
      const target = e.target as HTMLElement | null;
      const isEditable =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (isEditable) return;

      const now = Date.now();
      const elapsed = now - lastTimeRef.current;

      if (e.key === "Enter") {
        const code = normalizeScan(bufferRef.current.trim());
        bufferRef.current = "";
        if (code.length >= minLength) {
          e.preventDefault();
          onScanRef.current(code);
        }
        return;
      }

      if (e.key.length === 1) {
        if (elapsed > SCAN_CHAR_DELAY) {
          bufferRef.current = "";
        }
        bufferRef.current += e.key;
        lastTimeRef.current = now;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, minLength]);
}

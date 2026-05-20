import { useState, useEffect } from "react";
import { FiSave, FiRefreshCw } from "react-icons/fi";
import { loyaltyService } from "@/infrastructure/api/services/loyaltyService";
import type { LoyaltyConfig } from "@/domain/models/Loyalty";
import PageLayout from "@/ui/components/layouts/PageLayout";

export default function LoyaltyPage() {
  const [config, setConfig] = useState<LoyaltyConfig>({
    euros_per_point: 10,
    points_required: 100,
    discount_percent: 5,
  });
  const [draft, setDraft] = useState<LoyaltyConfig>(config);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const load = () => {
    setLoading(true);
    setBackendUnavailable(false);
    setError(null);
    loyaltyService
      .getConfig()
      .then((c) => { setConfig(c); setDraft(c); })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "";
        // Network failure = truly unreachable; any HTTP response means it's running
        if (msg.includes("Failed to fetch") || msg.includes("timeout") || msg.includes("NetworkError")) {
          setBackendUnavailable(true);
        } else {
          setError(msg || "Erreur lors du chargement de la configuration.");
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await loyaltyService.updateConfig({
        euros_per_point: draft.euros_per_point,
        points_required: draft.points_required,
        discount_percent: draft.discount_percent,
      });
      setConfig(updated);
      setDraft(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const setField = (field: keyof Omit<LoyaltyConfig, "id">, raw: string) => {
    const n = parseFloat(raw);
    if (!isNaN(n) && n >= 0) setDraft((p) => ({ ...p, [field]: n }));
  };

  const ptsPerEuro = draft.euros_per_point > 0
    ? (1 / draft.euros_per_point).toFixed(3)
    : "0";

  const exampleSpend = 85;
  const examplePts = draft.euros_per_point > 0
    ? Math.floor(exampleSpend / draft.euros_per_point)
    : 0;
  const ordersToRedeem = draft.euros_per_point > 0 && draft.points_required > 0
    ? Math.ceil((draft.points_required * draft.euros_per_point) / exampleSpend)
    : 0;

  const isDirty =
    draft.euros_per_point !== config.euros_per_point ||
    draft.points_required !== config.points_required ||
    draft.discount_percent !== config.discount_percent;

  return (
    <PageLayout
      title="Programme de fidélité"
      subtitle="Configurez les règles d'attribution et de remise des points de fidélité"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
          <button
            onClick={handleSave}
            disabled={saving || loading || !isDirty}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FiSave className="w-4 h-4" />
            {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
          </button>
        </div>
      }
    >
      {backendUnavailable && (
        <div className="px-4 py-3 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-xl">
          Backend non disponible — valeurs par défaut affichées. La configuration sera créée lors du premier enregistrement.
        </div>
      )}
      {error && (
        <div className="px-4 py-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl">
          {error}
        </div>
      )}

      {/* Stat cards — current live values */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="p-6 bg-white border border-gray-200 rounded-2xl">
          <p className="text-[13px] font-medium text-gray-500">Euros par point</p>
          <p className="mt-3 text-3xl font-bold text-gray-900 tabular-nums">
            {loading ? "—" : config.euros_per_point}
            <span className="text-base font-semibold text-gray-400 ml-1">€ / pt</span>
          </p>
          <p className="mt-2 text-[13px] text-gray-500">
            {loading ? "" : `Soit ${(1 / config.euros_per_point).toFixed(3)} pt par euro dépensé`}
          </p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl">
          <p className="text-[13px] font-medium text-gray-500">Points pour remise</p>
          <p className="mt-3 text-3xl font-bold text-gray-900 tabular-nums">
            {loading ? "—" : config.points_required}
            <span className="text-base font-semibold text-gray-400 ml-1">pts</span>
          </p>
          <p className="mt-2 text-[13px] text-gray-500">
            {loading ? "" : `Soit ${(config.points_required * config.euros_per_point).toLocaleString("fr-FR")} € dépensés`}
          </p>
        </div>

        <div className="p-6 bg-white border border-gray-200 rounded-2xl">
          <p className="text-[13px] font-medium text-gray-500">Remise accordée</p>
          <p className="mt-3 text-3xl font-bold text-gray-900 tabular-nums">
            {loading ? "—" : config.discount_percent}
            <span className="text-base font-semibold text-gray-400 ml-1">%</span>
          </p>
          <p className="mt-2 text-[13px] text-gray-500">
            À la prochaine commande du client
          </p>
        </div>
      </div>

      {/* Configuration form */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-900">Modifier la configuration</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">Les modifications s'appliquent aux nouvelles commandes uniquement</p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-10 text-gray-400 text-sm">
              Chargement…
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-gray-700">
                  Euros par point
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0.1"
                    step="1"
                    value={draft.euros_per_point}
                    onChange={(e) => setField("euros_per_point", e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 font-medium pointer-events-none">€</span>
                </div>
                <p className="text-[12px] text-gray-400">
                  1 point = {draft.euros_per_point} € dépensés ({ptsPerEuro} pt/€)
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-gray-700">
                  Points requis pour remise
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    step="10"
                    value={draft.points_required}
                    onChange={(e) => setField("points_required", e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 font-medium pointer-events-none">pts</span>
                </div>
                <p className="text-[12px] text-gray-400">
                  Seuil de déclenchement de la remise
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[13px] font-semibold text-gray-700">
                  Pourcentage de remise
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={draft.discount_percent}
                    onChange={(e) => setField("discount_percent", e.target.value)}
                    className="w-full px-4 py-2.5 pr-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 font-medium pointer-events-none">%</span>
                </div>
                <p className="text-[12px] text-gray-400">
                  Remise appliquée à la prochaine commande
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* How it works — live simulation */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-semibold text-gray-900">Comment ça fonctionne</h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Simulation avec une commande type de <strong>{exampleSpend} €</strong>
          </p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-px md:grid-cols-3 bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
            {/* Step 1 */}
            <div className="bg-white px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                <p className="text-[13px] font-semibold text-gray-900">Achat → Points gagnés</p>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                À chaque commande, le client gagne automatiquement :<br />
                <code className="text-gray-900 font-mono text-[12px] bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
                  ⌊{exampleSpend} ÷ {draft.euros_per_point}⌋ = <strong>{examplePts} pts</strong>
                </code>
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                <p className="text-[13px] font-semibold text-gray-900">Accumulation</p>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Le client doit atteindre <strong className="text-gray-900">{draft.points_required} pts</strong> pour déclencher une remise.
                {examplePts > 0
                  ? ` Avec des commandes à ${exampleSpend} €, il y arrivera en ${ordersToRedeem} commande${ordersToRedeem > 1 ? "s" : ""}.`
                  : ""}
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white px-6 py-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-6 h-6 rounded-full bg-gray-900 text-white text-[11px] font-bold flex items-center justify-center shrink-0">3</span>
                <p className="text-[13px] font-semibold text-gray-900">Remise appliquée</p>
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed">
                Dès le seuil atteint, le client reçoit <strong className="text-gray-900">{draft.discount_percent} %</strong> de remise sur sa prochaine commande. Les points sont réinitialisés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

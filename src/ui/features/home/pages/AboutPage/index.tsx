import { Target, Eye, HeartHandshake, Sparkles } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "../HomePage/landingMotion";
import { MarketingLayout } from "../../components/MarketingLayout";
import { Eyebrow } from "../../components/marketingUI";
import { FinalCTA } from "../HomePage/FinalCTA";

/* ============================================================
 * PAGE « À propos » — style premium violet, theme-aware (--lp-*).
 * Réutilise le hero de page (glow), les cartes glass et FinalCTA.
 * ============================================================ */

const STATS = [
  { value: "2024", label: "Année de création" },
  { value: "+30 %", label: "Ruptures évitées en moyenne" },
  { value: "5 min", label: "Pour être opérationnel" },
  { value: "100 %", label: "Données qui restent les vôtres" },
];

const VALUES = [
  { Icon: Target, title: "Utile avant tout", body: "Chaque fonctionnalité doit faire gagner du temps ou de l'argent. Pas de gadget, pas de bruit." },
  { Icon: Eye, title: "Transparence", body: "Nos recommandations IA sont explicables. Vous comprenez le « pourquoi » avant de décider." },
  { Icon: HeartHandshake, title: "Proximité", body: "On construit StockS avec les commerçants, à l'écoute du terrain et de leurs vraies contraintes." },
  { Icon: Sparkles, title: "Exigence", body: "Une interface soignée et rapide, parce que piloter son stock ne devrait jamais être pénible." },
];

export default function AboutPage() {
  return (
    <MarketingLayout>
      {/* ===== Hero de page (glow violet discret derrière le titre) ===== */}
      <section className="relative isolate overflow-hidden">
        {/* Glow radial doux, centré en haut. */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[760px] max-w-[120vw] -translate-x-1/2 -translate-y-1/3 rounded-full blur-[120px]"
          style={{ background: "radial-gradient(closest-side, rgba(var(--lp-glow),0.28) 0%, rgba(var(--lp-glow),0.08) 50%, transparent 80%)" }}
        />
        <div className="relative mx-auto max-w-[860px] px-6 pb-12 pt-32 text-center sm:px-8 sm:pt-40">
          <Reveal>
            <div className="mb-4 flex justify-center">
              <Eyebrow>Notre raison d'être</Eyebrow>
            </div>
            <h1 className="text-balance text-4xl font-bold leading-[1.07] tracking-tight text-[var(--lp-text)] sm:text-6xl">
              On rend le pilotage des stocks{" "}
              <span className="text-[var(--lp-accent)]">simple et intelligent</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-[620px] text-pretty text-base leading-[1.62] text-[var(--lp-text-2)] sm:text-lg">
              StockS est né d'un constat simple : trop de commerçants perdent des ventes par
              rupture, ou immobilisent leur trésorerie en surstock — faute d'outils clairs.
              Notre mission est de mettre l'intelligence de la donnée à la portée de tous.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ===== Stats ===== */}
      <section
        className="border-y py-12 lg:py-16"
        style={{ borderColor: "rgba(var(--lp-border))", background: "var(--lp-bg-2)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
          <RevealGroup className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((s) => (
              <RevealItem key={s.label} className="text-center">
                <p className="font-mono text-3xl font-bold text-[var(--lp-text)] sm:text-4xl">{s.value}</p>
                <p className="mt-2 text-[13px] text-[var(--lp-text-2)]">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== Story ===== */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[820px] px-6 sm:px-8">
          <Reveal>
            <Eyebrow>Notre histoire</Eyebrow>
            <h2 className="text-balance text-[28px] font-bold leading-[1.12] tracking-tight text-[var(--lp-text)] sm:text-[36px]">
              De la frustration à la solution
            </h2>
            <div className="mt-6 space-y-4 text-base leading-[1.7] text-[var(--lp-text-2)]">
              <p>
                Gérer un stock à l'instinct ou dans un tableur, c'est passer son temps à éteindre
                des incendies : ruptures découvertes trop tard, commandes « au feeling », données
                éparpillées entre la caisse, les fournisseurs et les fichiers.
              </p>
              <p>
                Nous avons construit StockS pour réunir tout ça au même endroit et laisser l'IA
                faire le travail d'analyse : anticiper la demande, alerter avant la rupture et
                mettre en lumière les produits qui comptent vraiment.
              </p>
              <p>
                Le résultat : des décisions prises sur des données, pas à l'aveugle — et du temps
                rendu à ce qui compte, votre activité.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== Valeurs ===== */}
      <section
        className="border-y py-20 lg:py-28"
        style={{ borderColor: "rgba(var(--lp-border))", background: "var(--lp-bg-2)" }}
      >
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
          <Reveal className="max-w-[720px]">
            <Eyebrow>Ce qui nous guide</Eyebrow>
            <h2 className="text-balance text-[28px] font-bold leading-[1.12] tracking-tight text-[var(--lp-text)] sm:text-[36px]">
              Nos valeurs
            </h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2">
            {VALUES.map((v) => (
              <RevealItem
                key={v.title}
                className="rounded-xl border border-[rgba(var(--lp-border))] bg-[var(--lp-card)] p-6 transition-colors"
              >
                <span
                  className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg text-[var(--lp-accent)]"
                  style={{ background: "rgba(var(--lp-accent-rgb),0.12)" }}
                >
                  <v.Icon className="h-5 w-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold text-[var(--lp-text)]">{v.title}</h3>
                <p className="text-[14px] leading-[1.6] text-[var(--lp-text-2)]">{v.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ===== CTA final (réutilisé) ===== */}
      <FinalCTA />
    </MarketingLayout>
  );
}

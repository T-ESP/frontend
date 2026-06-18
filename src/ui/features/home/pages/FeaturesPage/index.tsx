import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "../HomePage/landingMotion";
import { MarketingLayout } from "../../components/MarketingLayout";
import { Eyebrow } from "../../components/marketingUI";
import { FEATURES } from "../../components/marketingData";

const DEEP_DIVE = [
  {
    eyebrow: "Anticiper",
    title: "Des prévisions qui commandent juste",
    body: "L'IA apprend de votre historique de ventes et de la saisonnalité pour estimer la demande produit par produit. Vous voyez quoi commander, en quelle quantité et quand — sans surstock inutile.",
    points: ["Demande estimée par produit", "Quantité de réappro suggérée", "Détection de saisonnalité"],
  },
  {
    eyebrow: "Réagir",
    title: "Des alertes avant qu'il ne soit trop tard",
    body: "Ruptures imminentes, anomalies de prix ou de ventes : StockS vous prévient au bon moment, avec le contexte et l'action recommandée déjà calculés.",
    points: ["Alertes de rupture en amont", "Anomalies de prix et de ventes", "Historique par produit"],
  },
  {
    eyebrow: "Décider",
    title: "Chaque produit, sa fiche de performance",
    body: "Rotation, marge, valeur immobilisée, scoring : les KPIs produits transforment vos données brutes en décisions claires, accessibles en un clic depuis l'inventaire.",
    points: ["Scoring et rotation", "Marge et valeur de stock", "Comparaison entre produits"],
  },
];

export default function FeaturesPage() {
  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background" style={{ background: "radial-gradient(circle at 50% -10%, color-mix(in oklab, var(--primary) 10%, var(--background)) 0%, var(--background) 55%)" }}>
        <div className="relative mx-auto max-w-[860px] px-6 pt-20 pb-12 text-center sm:px-8">
          <Reveal>
            <div className="mb-4 flex justify-center">
              <Eyebrow>Fonctionnalités</Eyebrow>
            </div>
            <h1 className="text-balance text-[34px] font-bold leading-[1.07] tracking-[-0.025em] text-foreground sm:text-5xl">
              Tout pour piloter votre stock, <span className="text-primary">au même endroit</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[600px] text-[16px] leading-[1.62] text-muted-foreground sm:text-[18px]">
              De la prévision de demande aux KPIs produits, StockS réunit les outils qui font gagner
              du temps et de la marge — sans complexité.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Feature grid */}
      <section className="py-16 lg:py-24 border-y border-border bg-secondary">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <RevealItem key={f.title} className="p-6 border rounded-xl border-border bg-card transition-colors hover:border-primary/40">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <f.Icon className="w-5 h-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-[14px] leading-[1.6] text-muted-foreground">{f.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Deep dive — alternating */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[1080px] space-y-16 px-6 sm:px-8 lg:space-y-24">
          {DEEP_DIVE.map((d, i) => (
            <Reveal key={d.title}>
              <div className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <Eyebrow>{d.eyebrow}</Eyebrow>
                  <h2 className="text-balance text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[30px]">
                    {d.title}
                  </h2>
                  <p className="mt-4 text-[15px] leading-[1.65] text-muted-foreground">{d.body}</p>
                  <ul className="mt-6 space-y-2.5">
                    {d.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-[14px] text-foreground">
                        <Check className="w-4 h-4 shrink-0 text-primary" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border rounded-2xl border-border bg-card p-8 lg:p-10">
                  <div className="space-y-3">
                    {[72, 54, 88, 40].map((w, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary/60" />
                        <span className="h-2.5 rounded-full bg-foreground/10" style={{ width: `${w}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {["Demande", "Stock", "Marge"].map((k) => (
                      <div key={k} className="rounded-lg border border-border bg-foreground/[0.03] px-3 py-2.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{k}</p>
                        <p className="mt-1 font-mono text-sm font-bold text-foreground">●●●</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 border-t border-border bg-secondary">
        <div className="mx-auto max-w-[820px] px-6 text-center sm:px-8">
          <Reveal>
            <h2 className="text-balance text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[34px]">
              Prêt à voir StockS en action ?
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-[16px] leading-[1.55] text-muted-foreground">
              Démarrez gratuitement, sans carte bancaire, et configurez votre stock en quelques minutes.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Commencer gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/tarifs" className="inline-flex items-center rounded-lg border border-border bg-foreground/[0.04] px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10">
                Voir les tarifs
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingLayout>
  );
}

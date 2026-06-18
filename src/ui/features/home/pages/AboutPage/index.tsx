import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, HeartHandshake, Sparkles } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "../HomePage/landingMotion";
import { MarketingLayout } from "../../components/MarketingLayout";
import { Eyebrow } from "../../components/marketingUI";

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
      {/* Hero */}
      <section className="relative overflow-hidden bg-background" style={{ background: "radial-gradient(circle at 50% -10%, color-mix(in oklab, var(--primary) 10%, var(--background)) 0%, var(--background) 55%)" }}>
        <div className="relative mx-auto max-w-[860px] px-6 pt-20 pb-12 text-center sm:px-8">
          <Reveal>
            <div className="mb-4 flex justify-center">
              <Eyebrow>Notre raison d'être</Eyebrow>
            </div>
            <h1 className="text-balance text-[34px] font-bold leading-[1.07] tracking-[-0.025em] text-foreground sm:text-5xl">
              On rend le pilotage des stocks <span className="text-primary">simple et intelligent</span>.
            </h1>
            <p className="mx-auto mt-6 max-w-[620px] text-pretty text-[16px] leading-[1.62] text-muted-foreground sm:text-[18px]">
              StockS est né d'un constat simple : trop de commerçants perdent des ventes par
              rupture, ou immobilisent leur trésorerie en surstock — faute d'outils clairs.
              Notre mission est de mettre l'intelligence de la donnée à la portée de tous.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 lg:py-16 border-y border-border bg-secondary">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
          <RevealGroup className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {STATS.map((s) => (
              <RevealItem key={s.label} className="text-center">
                <p className="font-mono text-3xl font-bold text-foreground sm:text-4xl">{s.value}</p>
                <p className="mt-2 text-[13px] text-muted-foreground">{s.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[820px] px-6 sm:px-8">
          <Reveal>
            <Eyebrow>Notre histoire</Eyebrow>
            <h2 className="text-balance text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[36px]">
              De la frustration à la solution
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.7] text-muted-foreground">
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

      {/* Values */}
      <section className="py-20 lg:py-28 border-y border-border bg-secondary">
        <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
          <Reveal className="max-w-[720px]">
            <Eyebrow>Ce qui nous guide</Eyebrow>
            <h2 className="text-balance text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[36px]">
              Nos valeurs
            </h2>
          </Reveal>
          <RevealGroup className="grid gap-5 mt-12 sm:grid-cols-2">
            {VALUES.map((v) => (
              <RevealItem key={v.title} className="p-6 border rounded-xl border-border bg-card transition-colors hover:border-primary/40">
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <v.Icon className="w-5 h-5" />
                </span>
                <h3 className="mb-2 text-base font-semibold text-foreground">{v.title}</h3>
                <p className="text-[14px] leading-[1.6] text-muted-foreground">{v.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-[820px] px-6 text-center sm:px-8">
          <Reveal>
            <h2 className="text-balance text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[34px]">
              Envie de reprendre le contrôle ?
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-[16px] leading-[1.55] text-muted-foreground">
              Essayez StockS gratuitement, sans carte bancaire.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Commencer gratuitement
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center rounded-lg border border-border bg-foreground/[0.04] px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10">
                Nous contacter
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingLayout>
  );
}

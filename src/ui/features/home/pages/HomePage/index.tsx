import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingDown,
  PackageX,
  Boxes,
  ArrowRight,
  Check,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem, DrawUnderline } from "./landingMotion";
import { MarketingLayout } from "../../components/MarketingLayout";
import { Eyebrow } from "../../components/marketingUI";
import { FEATURES } from "../../components/marketingData";

/* ============================================================
 * Landing page « dark éditorial » — structure inspirée de la LP
 * bakerprod, adaptée à StockS, en palette Terminal (navy/emerald).
 * ============================================================ */

/* Mockup stylisé d'un dashboard StockS. */
function AppMockup() {
  const bars = [42, 55, 48, 63, 58, 72, 68, 84];
  const nav = [
    { label: "Dashboard", active: true },
    { label: "Inventaire", active: false },
    { label: "Ventes", active: false },
    { label: "Alertes", active: false },
  ];
  return (
    <div className="relative mx-auto mt-16 max-w-[960px]">
      <div className="relative overflow-hidden border shadow-2xl rounded-xl border-border bg-card">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-border bg-secondary px-5 py-3">
          <span className="w-3 h-3 rounded-full bg-foreground/10" />
          <span className="w-3 h-3 rounded-full bg-foreground/10" />
          <span className="w-3 h-3 rounded-full bg-foreground/10" />
          <span className="ml-3 font-mono text-xs text-muted-foreground/70">StockS — Dashboard · temps réel</span>
          <span className="flex items-center gap-1.5 ml-auto text-[11px] font-medium text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" /> En direct
          </span>
        </div>

        <div className="grid grid-cols-[1fr] sm:grid-cols-[180px_1fr] min-h-[340px]">
          {/* Sidebar */}
          <div className="flex-col hidden gap-1 p-3 border-r border-border bg-secondary sm:flex">
            {nav.map((n) => (
              <div
                key={n.label}
                className={`rounded-md px-3 py-2 text-[13px] ${
                  n.active ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground/70"
                }`}
              >
                {n.label}
              </div>
            ))}
          </div>

          {/* Main */}
          <div className="p-5">
            {/* KPI strip */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "CA", value: "84 200 €" },
                { label: "Commandes", value: "1 284" },
                { label: "Stock faible", value: "7" },
              ].map((k) => (
                <div key={k.label} className="px-3 py-2.5 border rounded-md border-border bg-foreground/[0.03]">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">{k.label}</p>
                  <p className="mt-1 font-mono text-base font-bold text-foreground">{k.value}</p>
                </div>
              ))}
            </div>
            {/* Chart */}
            <div className="p-4 border rounded-md border-border bg-foreground/[0.03]">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3">Chiffre d'affaires · 30j</p>
              <div className="flex items-end gap-2 h-28">
                {bars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating card — valeur du stock */}
      <div className="absolute hidden -right-6 top-28 w-52 rounded-lg border border-border bg-card px-4 py-3.5 shadow-xl lg:block">
        <div className="flex items-center gap-2 mb-2">
          <span className="flex items-center justify-center w-7 h-7 rounded-md bg-primary/10 text-primary">
            <Boxes className="w-4 h-4" />
          </span>
          <span className="text-[13px] font-semibold text-foreground">Valeur du stock</span>
        </div>
        <div className="font-mono text-2xl font-bold text-foreground">128 400 €</div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-foreground/10">
          <div className="h-full rounded-full bg-primary" style={{ width: "62%" }} />
        </div>
      </div>

      {/* Floating chip — alertes */}
      <div className="absolute items-center hidden gap-3 -left-7 top-52 rounded-lg border border-border bg-card px-4 py-3 shadow-xl lg:flex">
        <span className="flex items-center justify-center rounded-md w-9 h-9 bg-primary/10 text-primary">
          <ShieldCheck className="w-5 h-5" />
        </span>
        <div>
          <div className="text-[14px] font-semibold text-foreground">0 rupture</div>
          <div className="text-[11px] text-muted-foreground/70">grâce aux prévisions IA</div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-background" style={{ background: "radial-gradient(circle at 50% -10%, color-mix(in oklab, var(--primary) 10%, var(--background)) 0%, var(--background) 55%)" }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.4]"
        style={{ backgroundImage: "radial-gradient(color-mix(in oklab, var(--foreground) 7%, transparent) 1px, transparent 1px)", backgroundSize: "30px 30px" }}
      />
      <div className="relative mx-auto max-w-[1180px] px-6 pt-16 sm:px-8 sm:pt-20">
        <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[1.4px] text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Intelligence des stocks par l'IA
          </div>

          <h1 className="text-balance text-[34px] font-bold leading-[1.07] tracking-[-0.025em] text-foreground sm:text-5xl lg:text-[56px]">
            Ne soyez plus jamais en rupture.
            <br />
            <span className="relative inline-block text-primary">
              Ni en surstock.
              <DrawUnderline className="absolute -bottom-1 left-0 right-0 block h-[10px] rounded bg-primary/30" />
            </span>
          </h1>

          <p className="mt-7 max-w-[640px] text-pretty text-[16px] leading-[1.62] text-muted-foreground sm:text-[18px]">
            StockS pilote votre inventaire avec l'IA : prévisions de demande, alertes de
            réapprovisionnement et KPIs produits en temps réel. Vous décidez sur des données,
            plus à l'instinct.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-colors hover:bg-primary/90"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg border border-border bg-foreground/[0.04] px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10"
            >
              Se connecter
            </Link>
          </div>

          <p className="mt-5 flex items-center gap-2 text-[13px] text-muted-foreground/70">
            <Check className="w-4 h-4 text-primary" />
            Sans carte bancaire · Mise en route en quelques minutes
          </p>
        </div>

        <Reveal delay={0.15} y={28}>
          <AppMockup />
        </Reveal>
      </div>
    </section>
  );
}

const PROBLEMS = [
  {
    Icon: PackageX,
    title: "Les ruptures coûtent des ventes",
    body: "Un produit en rupture, c'est une vente perdue — et souvent un client qui part chez le concurrent. Sans visibilité, vous découvrez les ruptures trop tard.",
  },
  {
    Icon: Boxes,
    title: "Le surstock immobilise votre trésorerie",
    body: "Commander « pour être tranquille », c'est de l'argent qui dort en rayon, des produits qui périment et de la marge qui s'évapore.",
  },
  {
    Icon: TrendingDown,
    title: "Les données sont éparpillées",
    body: "Ventes, stock, fournisseurs, prix : tout vit dans des fichiers séparés. Impossible de décider vite quand l'info est partout et nulle part.",
  },
];

function ProblemSection() {
  return (
    <section id="probleme" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <Reveal className="max-w-[720px]">
          <Eyebrow accent="rose">Le vrai coût de l'à-peu-près</Eyebrow>
          <h2 className="text-balance text-[30px] font-bold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[40px]">
            Gérer son stock à l'instinct vous fait perdre de l'argent
          </h2>
        </Reveal>
        <RevealGroup className="grid gap-5 mt-12 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <RevealItem key={p.title} className="p-7 border rounded-xl border-border bg-card">
              <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
                <p.Icon className="w-6 h-6" />
              </span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{p.title}</h3>
              <p className="text-[15px] leading-[1.6] text-muted-foreground">{p.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-28 border-y border-border bg-secondary">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <Reveal className="max-w-[720px]">
          <Eyebrow>Tout au même endroit</Eyebrow>
          <h2 className="text-balance text-[30px] font-bold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[40px]">
            Le poste de pilotage de votre stock
          </h2>
        </Reveal>
        <RevealGroup className="grid gap-5 mt-12 sm:grid-cols-2 lg:grid-cols-3">
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
  );
}

const STEPS = [
  { n: "1", title: "Connectez vos données", body: "Importez votre catalogue et votre historique de ventes en quelques minutes." },
  { n: "2", title: "L'IA analyse", body: "Demande prévue, risques de rupture, surstock : tout est calculé en continu." },
  { n: "3", title: "Vous décidez", body: "Alertes claires et quantités suggérées : il ne reste qu'à valider la commande." },
];

function HowItWorks() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <Reveal className="mb-12 text-center">
          <Eyebrow>En 3 étapes</Eyebrow>
          <h2 className="text-[30px] font-bold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[40px]">
            Opérationnel le jour même
          </h2>
        </Reveal>
        <RevealGroup className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <RevealItem key={s.n} className="relative p-7 border rounded-xl border-border bg-card">
              <span className="flex items-center justify-center w-10 h-10 mb-4 font-mono text-lg font-bold rounded-lg bg-primary text-primary-foreground">
                {s.n}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="text-[15px] leading-[1.6] text-muted-foreground">{s.body}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

const PLANS = [
  {
    name: "Starter",
    price: "0 €",
    period: "/ mois",
    desc: "Pour démarrer et tester l'essentiel.",
    features: ["Jusqu'à 100 produits", "Alertes de stock", "Tableau de bord", "1 utilisateur"],
    cta: "Commencer",
    highlight: false,
  },
  {
    name: "Pro",
    price: "29 €",
    period: "/ mois",
    desc: "Pour piloter sérieusement votre stock.",
    features: ["Produits illimités", "Prévisions IA", "KPIs produits avancés", "Multi-fournisseurs", "5 utilisateurs"],
    cta: "Essai gratuit",
    highlight: true,
  },
  {
    name: "Business",
    price: "Sur devis",
    period: "",
    desc: "Pour les équipes et multi-points de vente.",
    features: ["Tout Pro", "Utilisateurs illimités", "Accès API", "Support prioritaire"],
    cta: "Nous contacter",
    highlight: false,
  },
];

function PricingSection() {
  return (
    <section id="tarifs" className="py-20 lg:py-28 border-y border-border bg-secondary">
      <div className="mx-auto max-w-[1180px] px-6 sm:px-8">
        <Reveal className="mb-12 text-center">
          <Eyebrow>Tarifs</Eyebrow>
          <h2 className="text-[30px] font-bold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[40px]">
            Un prix simple, sans engagement
          </h2>
        </Reveal>
        <RevealGroup className="grid max-w-5xl gap-5 mx-auto md:grid-cols-3">
          {PLANS.map((p) => (
            <RevealItem
              key={p.name}
              className={`flex flex-col rounded-xl border p-7 ${
                p.highlight ? "border-primary/40 bg-primary/[0.06] ring-1 ring-primary/20" : "border-border bg-card"
              }`}
            >
              {p.highlight && (
                <span className="self-start mb-3 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-full bg-primary text-primary-foreground">
                  Populaire
                </span>
              )}
              <h3 className="text-lg font-semibold text-foreground">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="flex items-end gap-1 mt-5">
                <span className="font-mono text-4xl font-bold text-foreground">{p.price}</span>
                <span className="mb-1 text-sm text-muted-foreground/70">{p.period}</span>
              </div>
              <ul className="flex-1 mt-6 space-y-3">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[14px] text-muted-foreground">
                    <Check className="w-4 h-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/login"
                className={`mt-7 inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border bg-foreground/[0.04] text-foreground hover:bg-foreground/10"
                }`}
              >
                {p.cta}
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

const FAQ = [
  { q: "Dois-je changer ma façon de travailler ?", a: "Non. StockS s'adapte à votre catalogue et à vos habitudes. Vous importez vos produits, l'application gère l'analyse." },
  { q: "Les prévisions sont-elles fiables sans gros historique ?", a: "L'IA commence à être utile dès les premières semaines et s'affine avec vos ventes. Plus elle voit de données, plus elle est précise." },
  { q: "Puis-je connecter mes outils existants ?", a: "L'offre Business inclut un accès API pour brancher StockS à vos systèmes (caisse, e-commerce, ERP)." },
  { q: "Mes données sont-elles en sécurité ?", a: "Vos données sont privées et ne servent qu'à vos analyses. Vous gardez le contrôle et pouvez exporter à tout moment." },
  { q: "Puis-je changer d'offre ou résilier ?", a: "Oui, à tout moment et sans engagement. Vous montez ou descendez d'offre quand vous le souhaitez." },
];

function FaqSection() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="py-20 lg:py-28">
      <div className="mx-auto max-w-[820px] px-6 sm:px-8">
        <Reveal className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[1.4px] text-primary">
            <span className="h-px w-[22px] bg-primary/40" />
            Questions fréquentes
            <span className="h-px w-[22px] bg-primary/40" />
          </div>
          <h2 className="text-[28px] font-bold leading-[1.12] tracking-[-0.02em] text-foreground sm:text-[38px]">On vous répond</h2>
        </Reveal>

        <Reveal className="px-7 border rounded-xl border-border bg-card">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className={i < FAQ.length - 1 ? "border-b border-border" : ""}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex items-center justify-between w-full gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-[16px] font-medium text-foreground">{item.q}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 text-primary transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <div className="overflow-hidden transition-all duration-300 ease-out" style={{ maxHeight: isOpen ? 220 : 0, opacity: isOpen ? 1 : 0 }}>
                  <p className="pb-5 text-[15px] leading-[1.65] text-muted-foreground">{item.a}</p>
                </div>
              </div>
            );
          })}
        </Reveal>

        {/* CTA final */}
        <Reveal className="relative mt-16 overflow-hidden border rounded-2xl border-primary/20 px-8 py-14 text-center">
          <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 0%, color-mix(in oklab, var(--primary) 14%, var(--card)) 0%, var(--card) 60%)" }} />
          <div
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{ backgroundImage: "radial-gradient(color-mix(in oklab, var(--primary) 16%, transparent) 1px, transparent 1px)", backgroundSize: "24px 24px" }}
          />
          <div className="relative">
            <h2 className="text-balance text-[26px] font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-[34px]">
              Reprenez le contrôle de votre stock
            </h2>
            <p className="mx-auto mt-4 max-w-[460px] text-[16px] leading-[1.55] text-muted-foreground">
              Ne laissez plus les ruptures ou le surstock grignoter votre marge.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                Commencer gratuitement
              </Link>
              <Link to="/login" className="inline-flex items-center rounded-lg border border-border bg-foreground/[0.04] px-6 py-3.5 text-[15px] font-medium text-foreground transition-colors hover:bg-foreground/10">
                Se connecter
              </Link>
            </div>
            <p className="mt-5 text-[13px] text-muted-foreground/70">Sans carte bancaire · Configuration en quelques minutes</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      <ProblemSection />
      <FeaturesSection />
      <HowItWorks />
      <PricingSection />
      <FaqSection />
    </MarketingLayout>
  );
}

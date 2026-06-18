import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, MessageSquare, LifeBuoy, Check, Send } from "lucide-react";
import { Reveal } from "../HomePage/landingMotion";
import { MarketingLayout } from "../../components/MarketingLayout";
import { Eyebrow } from "../../components/marketingUI";

const inputClass =
  "w-full rounded-lg border border-border bg-foreground/[0.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20";
const labelClass = "block text-[13px] font-medium text-foreground mb-1.5";

const CHANNELS = [
  { Icon: Mail, title: "E-mail", body: "contact@stocks-app.fr", note: "Réponse sous 24 h ouvrées" },
  { Icon: LifeBuoy, title: "Support", body: "support@stocks-app.fr", note: "Pour les clients existants" },
  { Icon: MessageSquare, title: "Avant-vente", body: "Une question sur l'offre ?", note: "On vous rappelle volontiers" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const isValid =
    form.name.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.message.trim().length >= 10;

  const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    // Visuel uniquement — aucun appel réseau.
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <MarketingLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-background" style={{ background: "radial-gradient(circle at 50% -10%, color-mix(in oklab, var(--primary) 10%, var(--background)) 0%, var(--background) 55%)" }}>
        <div className="relative mx-auto max-w-[860px] px-6 pt-20 pb-10 text-center sm:px-8">
          <Reveal>
            <div className="mb-4 flex justify-center">
              <Eyebrow>On vous écoute</Eyebrow>
            </div>
            <h1 className="text-balance text-[34px] font-bold leading-[1.07] tracking-[-0.025em] text-foreground sm:text-5xl">
              Parlons de votre stock
            </h1>
            <p className="mx-auto mt-5 max-w-[560px] text-[16px] leading-[1.6] text-muted-foreground sm:text-[18px]">
              Une question, une démo, un projet ? Écrivez-nous et nous reviendrons vers vous rapidement.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form + channels */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1080px] gap-8 px-6 sm:px-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <Reveal className="p-6 border rounded-2xl border-border bg-card sm:p-8">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="w-7 h-7" />
                </span>
                <h2 className="mt-5 text-xl font-semibold text-foreground">Message envoyé !</h2>
                <p className="mt-2 max-w-sm text-[14px] text-muted-foreground">
                  Merci de nous avoir contactés. Notre équipe vous répondra sous 24 h ouvrées.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 inline-flex items-center rounded-lg border border-border bg-foreground/[0.04] px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground/10"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelClass}>Nom <span className="text-rose-400">*</span></label>
                    <input id="name" type="text" value={form.name} onChange={set("name")} placeholder="Votre nom" className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>E-mail <span className="text-rose-400">*</span></label>
                    <input id="email" type="email" value={form.email} onChange={set("email")} placeholder="vous@entreprise.fr" className={inputClass} />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className={labelClass}>Sujet</label>
                  <input id="subject" type="text" value={form.subject} onChange={set("subject")} placeholder="Démo, tarifs, question…" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="message" className={labelClass}>Message <span className="text-rose-400">*</span></label>
                  <textarea id="message" rows={5} value={form.message} onChange={set("message")} placeholder="Décrivez votre besoin en quelques lignes…" className={`${inputClass} resize-y`} />
                  <p className="mt-1.5 text-[12px] text-muted-foreground/70">Au moins 10 caractères.</p>
                </div>
                <button
                  type="submit"
                  disabled={!isValid}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed sm:w-auto"
                >
                  <Send className="w-4 h-4" />
                  Envoyer le message
                </button>
              </form>
            )}
          </Reveal>

          {/* Channels */}
          <Reveal delay={0.1} className="space-y-4">
            {CHANNELS.map((c) => (
              <div key={c.title} className="p-5 border rounded-xl border-border bg-card">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <c.Icon className="w-5 h-5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-foreground">{c.title}</p>
                    <p className="text-[14px] text-muted-foreground">{c.body}</p>
                  </div>
                </div>
                <p className="mt-3 text-[12px] text-muted-foreground/70">{c.note}</p>
              </div>
            ))}
            <div className="p-5 border rounded-xl border-border bg-secondary">
              <p className="text-[13px] font-semibold text-foreground">Besoin d'une réponse tout de suite ?</p>
              <p className="mt-1 text-[13px] text-muted-foreground">
                Consultez notre <Link to="/#faq" className="text-primary hover:underline">FAQ</Link> ou découvrez{" "}
                <Link to="/fonctionnalites" className="text-primary hover:underline">les fonctionnalités</Link>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingLayout>
  );
}

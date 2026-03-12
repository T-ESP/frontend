import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Send, Building2, Mail, User, Phone, MessageSquare } from "lucide-react";

type FormState = {
  name: string;
  email: string;
  company: string;
  phone: string;
  message: string;
  optIn: boolean;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  phone: "",
  message: "",
  optIn: false,
};

function InputField({
  icon,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}: {
  icon: React.ReactNode;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-purple-300/60 uppercase tracking-[0.16em]">
        {label} {required && <span className="text-purple-400">*</span>}
      </label>
      <div
        className="relative flex items-center rounded-xl overflow-hidden transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: focused
            ? "1px solid rgba(157,123,221,0.55)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(123,95,162,0.12)" : "none",
        }}
      >
        <span className="pl-3.5 text-purple-300/40 shrink-0">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          required={required}
          className="w-full bg-transparent px-3 py-3 text-sm text-white placeholder-purple-300/30 outline-none"
        />
      </div>
    </div>
  );
}

function TextareaField({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-purple-300/60 uppercase tracking-[0.16em]">
        {label}
      </label>
      <div
        className="relative rounded-xl overflow-hidden transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: focused
            ? "1px solid rgba(157,123,221,0.55)"
            : "1px solid rgba(255,255,255,0.08)",
          boxShadow: focused ? "0 0 0 3px rgba(123,95,162,0.12)" : "none",
        }}
      >
        <div className="pt-3 px-3.5 text-purple-300/40">
          <MessageSquare size={15} />
        </div>
        <textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={3}
          className="w-full bg-transparent px-3.5 pb-3 pt-1 text-sm text-white placeholder-purple-300/30 outline-none resize-none"
        />
      </div>
    </div>
  );
}

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (field: keyof FormState) => (value: string | boolean) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async (no real email)
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="relative py-24 px-6 md:px-16"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      {/* Section glow */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(123,95,162,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 pl-2 pr-5 py-1.5 rounded-full mb-6"
            style={{
              background: "rgba(123,95,162,0.10)",
              border: "1px solid rgba(123,95,162,0.22)",
            }}
          >
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)" }}
            >
              <Send size={10} className="text-white" />
            </div>
            <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wide">
              Demande de démo
            </span>
          </div>

          <h2
            className="text-[clamp(2rem,5vw,3.5rem)] font-[900] text-white leading-[1.05] tracking-[-0.03em] mb-4"
          >
            Intéressé ? Parlons-en.
          </h2>
          <p className="text-purple-200/55 text-lg max-w-xl mx-auto font-light leading-relaxed">
            Remplissez ce formulaire et nous vous recontactons sous 24h pour vous présenter la plateforme.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            boxShadow:
              "0 40px 80px -20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Inner glow top edge */}
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background:
                "linear-gradient(90deg, transparent 10%, rgba(157,123,221,0.4) 50%, transparent 90%)",
            }}
          />

          <div className="grid md:grid-cols-5 gap-0">
            {/* Left info panel */}
            <div
              className="md:col-span-2 p-8 md:p-10 flex flex-col justify-between md:border-r md:border-white/[0.06]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(123,95,162,0.12) 0%, rgba(123,95,162,0.04) 100%)",
              }}
            >
              <div>
                <h3 className="text-xl font-[800] text-white mb-3">
                  Une démo personnalisée
                </h3>
                <p className="text-sm text-purple-200/55 font-light leading-relaxed mb-8">
                  Découvrez comment Stocks s'adapte à votre activité avec une démo guidée par notre équipe.
                </p>

                {[
                  { emoji: "⚡", text: "Réponse sous 24h" },
                  { emoji: "🎯", text: "Démo adaptée à vos besoins" },
                  { emoji: "🔒", text: "Aucun engagement" },
                  { emoji: "🇫🇷", text: "Équipe française" },
                ].map(({ emoji, text }) => (
                  <div key={text} className="flex items-center gap-3 mb-4">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base"
                      style={{
                        background: "rgba(123,95,162,0.18)",
                        border: "1px solid rgba(123,95,162,0.22)",
                      }}
                    >
                      {emoji}
                    </div>
                    <span className="text-sm text-purple-200/70 font-medium">{text}</span>
                  </div>
                ))}
              </div>

              <div
                className="mt-8 p-4 rounded-2xl"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-[13px] text-purple-200/50 font-light italic leading-relaxed">
                  "Depuis qu'on utilise Stocks, on ne manque plus jamais un réassort. Un vrai gain de temps."
                </p>
                <p className="text-[11px] font-bold text-purple-400/60 mt-2 uppercase tracking-wide">
                  — Marie L., gérante de boutique
                </p>
              </div>
            </div>

            {/* Right form */}
            <div className="md:col-span-3 p-8 md:p-10">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full flex flex-col items-center justify-center text-center py-10"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                      style={{
                        background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)",
                        boxShadow: "0 8px 32px rgba(123,95,162,0.45)",
                      }}
                    >
                      <CheckCircle size={28} className="text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-[800] text-white mb-3">
                      Demande envoyée !
                    </h3>
                    <p className="text-purple-200/55 text-sm font-light leading-relaxed max-w-xs">
                      Merci pour votre intérêt. Notre équipe vous recontactera sous 24h pour planifier votre démo.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm(initialState); }}
                      className="mt-8 text-xs font-bold text-purple-400/60 hover:text-purple-300 transition-colors"
                    >
                      Envoyer une autre demande
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-5"
                  >
                    <div className="grid sm:grid-cols-2 gap-5">
                      <InputField
                        icon={<User size={15} />}
                        label="Nom complet"
                        placeholder="Jean Dupont"
                        value={form.name}
                        onChange={set("name")}
                        required
                      />
                      <InputField
                        icon={<Mail size={15} />}
                        label="Email professionnel"
                        type="email"
                        placeholder="jean@entreprise.fr"
                        value={form.email}
                        onChange={set("email")}
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <InputField
                        icon={<Building2 size={15} />}
                        label="Entreprise"
                        placeholder="Nom de votre société"
                        value={form.company}
                        onChange={set("company")}
                      />
                      <InputField
                        icon={<Phone size={15} />}
                        label="Téléphone"
                        type="tel"
                        placeholder="+33 6 00 00 00 00"
                        value={form.phone}
                        onChange={set("phone")}
                      />
                    </div>

                    <TextareaField
                      label="Votre besoin (optionnel)"
                      placeholder="Décrivez votre activité et ce que vous cherchez à améliorer..."
                      value={form.message}
                      onChange={set("message")}
                    />

                    {/* Opt-in checkbox */}
                    <label className="flex items-start gap-3 cursor-pointer group mt-1">
                      <div className="relative shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          checked={form.optIn}
                          onChange={(e) => set("optIn")(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className="w-4.5 h-4.5 w-[18px] h-[18px] rounded-[5px] flex items-center justify-center transition-all duration-200"
                          style={{
                            background: form.optIn
                              ? "linear-gradient(135deg,#7b5fa2,#9d7bdd)"
                              : "rgba(255,255,255,0.05)",
                            border: form.optIn
                              ? "1px solid rgba(157,123,221,0.6)"
                              : "1px solid rgba(255,255,255,0.12)",
                            boxShadow: form.optIn
                              ? "0 0 0 3px rgba(123,95,162,0.18)"
                              : "none",
                          }}
                        >
                          {form.optIn && (
                            <motion.svg
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              width="10"
                              height="8"
                              viewBox="0 0 10 8"
                              fill="none"
                            >
                              <path
                                d="M1 4L3.5 6.5L9 1"
                                stroke="white"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          )}
                        </div>
                      </div>
                      <span className="text-[12px] text-purple-200/50 font-light leading-relaxed group-hover:text-purple-200/70 transition-colors">
                        J'accepte de recevoir des informations sur les nouveautés, offres et conseils de Stocks. Vous pouvez vous désabonner à tout moment.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="relative mt-2 flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 disabled:opacity-70"
                      style={{
                        background: "linear-gradient(135deg,#7b5fa2,#9d7bdd)",
                        boxShadow: "0 6px 28px rgba(123,95,162,0.40), inset 0 1px 0 rgba(255,255,255,0.18)",
                      }}
                      onMouseEnter={(e) => {
                        if (!loading) {
                          (e.currentTarget as HTMLButtonElement).style.boxShadow =
                            "0 14px 44px rgba(123,95,162,0.55), inset 0 1px 0 rgba(255,255,255,0.18)";
                          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                          "0 6px 28px rgba(123,95,162,0.40), inset 0 1px 0 rgba(255,255,255,0.18)";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                      }}
                    >
                      {loading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                      ) : (
                        <>
                          <Send size={15} />
                          Demander ma démo gratuite
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-purple-300/35 text-center font-light">
                      Aucun engagement · Données protégées · Hébergement France 🇫🇷
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

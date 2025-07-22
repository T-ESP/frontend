const palette = [
  "primary",
  "primary-hover",
  "primary-soft",
  "bg",
  "surface",
  "neutral-900",
  "neutral-700",
  "border",
  "success",
  "success-bg",
  "warning",
  "warning-bg",
  "error",
  "error-bg",
  "info",
  "info-bg",
];

export default function PlaygroundPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Playground – Palette & Composants</h1>
      <section>
        <h2 className="text-lg font-semibold mb-4">Palette de couleurs</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {palette.map((color) => (
            <div
              key={color}
              className={`rounded-lg border border-border h-20 flex flex-col items-center justify-center
                ${color.startsWith("bg") || color.endsWith("bg") || color === "surface" ? `bg-${color}` : ""}
                ${color.startsWith("primary") || color === "success" || color === "warning" || color === "error" || color === "info" || color.startsWith("neutral") ? `bg-${color}` : ""}
              `}
            >
              <span className={`text-xs ${color === "primary-soft" ? "text-primary" : "text-neutral-900"}`}>
                {color}
              </span>
              <span className={`text-xs opacity-60`}>class: bg-{color}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Boutons (à adapter selon ton design system)</h2>
        <div className="flex gap-4 flex-wrap">
          <button className="bg-primary text-white px-4 py-2 rounded">Primary</button>
          <button className="bg-success text-white px-4 py-2 rounded">Success</button>
          <button className="bg-warning text-white px-4 py-2 rounded">Warning</button>
          <button className="bg-error text-white px-4 py-2 rounded">Error</button>
        </div>
      </section>

      {/* Ajoute ici les autres composants à tester */}
    </div>
  );
}

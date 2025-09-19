import { SimpleModal } from "@/components/ui/SimpleModal";
import { useState } from "react";

export function HomePage() {
  const [isModal1Open, setIsModal1Open] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);
  const [isModal4Open, setIsModal4Open] = useState(false);

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-bold text-center mb-8"
          style={{ color: "var(--color-neutral-900)" }}
        >
          Modal Simple - Démo
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setIsModal1Open(true)}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="p-4 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Modal avec titre seulement
          </button>

          <button
            onClick={() => setIsModal2Open(true)}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="p-4 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Modal avec titre + sous-titre
          </button>

          <button
            onClick={() => setIsModal3Open(true)}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="p-4 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Modal avec boutons
          </button>

          <button
            onClick={() => setIsModal4Open(true)}
            style={{ backgroundColor: "var(--color-primary)" }}
            className="p-4 text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Modal complète
          </button>
        </div>
      </div>

      {/* Modal 1 */}
      <SimpleModal
        isOpen={isModal1Open}
        onClose={() => setIsModal1Open(false)}
        title="Modal Simple"
      >
        <p style={{ color: "var(--color-neutral-700)" }}>
          Ceci est une modal simple avec seulement un titre.
        </p>
      </SimpleModal>

      {/* Modal 2 */}
      <SimpleModal
        isOpen={isModal2Open}
        onClose={() => setIsModal2Open(false)}
        title="Confirmer l'action"
        subtitle="Cette action ne peut pas être annulée"
      >
        <p style={{ color: "var(--color-neutral-700)" }}>
          Modal avec titre et sous-titre. Parfait pour les confirmations.
        </p>
      </SimpleModal>

      {/* Modal 3 */}



      {/* Modal 4 */}
      <SimpleModal
        isOpen={isModal4Open}
        onClose={() => setIsModal4Open(false)}
        title="Créer un nouveau projet"
        subtitle="Remplissez les informations ci-dessous"
        size="lg"
        cancelText="Annuler"
        acceptText="Créer"
        onAccept={() => {
          alert("Projet créé !");
          setIsModal4Open(false);
        }}
      >
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nom du projet"
            className="w-full px-3 py-2 border rounded-md"
          />
          <textarea
            placeholder="Description..."
            rows={3}
            className="w-full px-3 py-2 border rounded-md resize-none"
          />
        </div>
      </SimpleModal>
    </div>
  );
}

export default HomePage;

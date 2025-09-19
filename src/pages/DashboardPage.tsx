import ComponentsChoiceModal from "@/components/dashboard/modal/ComponentsChoiceModal";
import { SimpleModal } from "@/components/ui/SimpleModal";
import { useToast } from "@/components/ui/Toast";
import { getRectangle } from "@/features/dashboard/utils/grid";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { addToast } = useToast();

  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [selection, setSelection] = useState<number[]>([]);
  const [isComponentsModalOpen, setIsComponentsModalOpen] = useState(false);
  const [previewSelection, setPreviewSelection] = useState<number[]>([]);


  function handleMouseDown(index: number) {
    setStart(index);
    setSelection([]);
  }

  function handleMouseUp(index: number) {
    if (start !== null) {
      const selected = getRectangle(start, index, 9);
      setSelection(selected);
      setPreviewSelection([]);
      setStart(null);
    }
  }

  function handleMouseMove(index: number) {
    if (start !== null) {
      const preview = getRectangle(start, index, 12);
      setPreviewSelection(preview);
    }
  }

  useEffect(() => {
    if (selection.length > 0) {
      addToast(
        "Composant ajouté",
        "Votre composant a été ajouté avec succès.",
        "success"
      );
      setIsComponentsModalOpen(true);
    }
  }, [selection]);

  return (
    <div className="w-full h-auto md:h-screen">
      <div className="grid grid-cols-12 grid-rows-12 w-full h-full">
        {Array.from({ length: 144 }).map((_, i) => {
          const isPreview = previewSelection.includes(i);
          const isSelected = selection.includes(i);

          return (
            <div
              key={i}
              className={`
              flex items-center justify-center text-sm
              border border-gray-300
              ${isSelected ? "bg-blue-500 text-white" : ""}
              ${!isSelected && isPreview ? "bg-blue-200" : "bg-gray-200 text-gray-600"}
            `}
              onMouseDown={() => handleMouseDown(i)}
              onMouseUp={() => handleMouseUp(i)}
              onMouseMove={() => handleMouseMove(i)}
            >
              {/* {i + 1} */}
            </div>
          );
        })}
      </div>

      <SimpleModal
        isOpen={isComponentsModalOpen}
        onClose={() => setIsComponentsModalOpen(false)}
        title="Choix des composants"
        subtitle="Choisissez les composants à ajouter"
        cancelText="Annuler"
        acceptText="Ajouter"
      />

    </div>
  );
}

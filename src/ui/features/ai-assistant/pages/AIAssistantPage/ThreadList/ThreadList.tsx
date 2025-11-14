import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import botAvatar from "@/assets/images/BOT.png";
import type { ChatThread } from "@/ui/features/ai-assistant/types";

type ThreadListProps = {
  threads: ChatThread[];
  activeThreadId: string;
  onSelect: (threadId: string) => void;
  onNew: () => void;
  openMenuThreadId: string | null;
  setOpenMenuThreadId: (threadId: string | null) => void;
  onRename: (threadId: string) => void;
  onDelete: (threadId: string) => void;
};

export function ThreadList(props: ThreadListProps) {
  const { threads, activeThreadId, onSelect, onNew, openMenuThreadId, setOpenMenuThreadId, onRename, onDelete } = props;
  const listRef = useRef<HTMLUListElement | null>(null);

  // Fermer le menu au clic en dehors ou sur ESC
  useEffect(() => {
    function onDocPointerDown(e: PointerEvent) {
      if (!openMenuThreadId) return;
      const openLi = document.getElementById(`thread-li-${openMenuThreadId}`);
      if (openLi && openLi.contains(e.target as Node)) return;
      setOpenMenuThreadId(null);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && openMenuThreadId) setOpenMenuThreadId(null);
    }
    document.addEventListener("pointerdown", onDocPointerDown, true);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown, true);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openMenuThreadId, setOpenMenuThreadId]);

  return (
    <aside className="flex flex-col w-80 border-r border-gray-200">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Conversations</h2>
        <button
          type="button"
          onClick={onNew}
          className="inline-flex gap-1 items-center px-2 py-1 text-sm text-white rounded-md bg-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          Nouveau
        </button>
      </div>

      <div className="overflow-y-auto flex-1">
        <ul ref={listRef} className="relative divide-y divide-gray-100">
          {threads.map((t) => (
            <li
              key={t.id}
              id={`thread-li-${t.id}`}
              className={`relative group ${activeThreadId === t.id ? "bg-primary-soft/40" : ""} ${openMenuThreadId === t.id ? "z-50" : "z-0"
                }`}
            >
              <button
                type="button"
                onClick={() => onSelect(t.id)}
                className="flex gap-3 items-center px-4 py-3 w-full text-left hover:bg-primary-soft/50"
              >
                <img src={t.avatar ?? botAvatar} alt="Avatar" className="object-cover w-9 h-9 rounded-full" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-500 truncate">{t.lastMessagePreview}</p>
                </div>
              </button>
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <button
                  type="button"
                  onClick={() => setOpenMenuThreadId(openMenuThreadId === t.id ? null : t.id)}
                  className="flex justify-center items-center w-8 h-8 text-gray-600 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100"
                  aria-label="Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {openMenuThreadId === t.id && (
                  <div className="absolute right-0 z-50 mt-2 w-40 bg-white rounded-md border border-gray-200 shadow-sm">
                    <button
                      type="button"
                      onClick={() => onRename(t.id)}
                      className="flex gap-2 items-center px-3 py-2 w-full text-sm hover:bg-gray-50"
                    >
                      <Pencil className="w-4 h-4" /> Renommer
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(t.id)}
                      className="flex gap-2 items-center px-3 py-2 w-full text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}


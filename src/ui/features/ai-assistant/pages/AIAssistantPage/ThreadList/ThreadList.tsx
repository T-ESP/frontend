import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";
import botAvatar from "@/assets/images/BOT.png";
import type { ChatThread } from "@/ui/features/ai-assistant/types";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
    <aside className="flex flex-col border-r border-gray-200 w-80">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">{t('ai_assistant.conversations', 'Conversations')}</h2>
        <button
          type="button"
          onClick={onNew}
          className="inline-flex items-center gap-1 px-2 py-1 text-sm text-white rounded-md bg-primary hover:opacity-90"
        >
          <Plus className="w-4 h-4" />
          {t('ai_assistant.new_chat', 'Nouveau')}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul ref={listRef} className="relative divide-y divide-gray-100">
          {threads.map((t_item) => (
            <li
              key={t_item.id}
              id={`thread-li-${t_item.id}`}
              className={`relative group ${activeThreadId === t_item.id ? "bg-primary-soft/40" : ""} ${openMenuThreadId === t_item.id ? "z-50" : "z-0"
                }`}
            >
              <button
                type="button"
                onClick={() => onSelect(t_item.id)}
                className="flex items-center w-full gap-3 px-4 py-3 text-left hover:bg-primary-soft/50"
              >
                <img src={t_item.avatar ?? botAvatar} alt="Avatar" className="object-cover rounded-full w-9 h-9" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{t_item.title}</p>
                  <p className="text-xs text-gray-500 truncate">{t_item.lastMessagePreview}</p>
                </div>
              </button>
              <div className="absolute -translate-y-1/2 right-2 top-1/2">
                <button
                  type="button"
                  onClick={() => setOpenMenuThreadId(openMenuThreadId === t_item.id ? null : t_item.id)}
                  className="flex items-center justify-center w-8 h-8 text-gray-600 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-100"
                  aria-label="Options"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                {openMenuThreadId === t_item.id && (
                  <div className="absolute right-0 z-50 w-40 mt-2 bg-white border border-gray-200 rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={() => onRename(t_item.id)}
                      className="flex items-center w-full gap-2 px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      <Pencil className="w-4 h-4" /> {t('ai_assistant.rename', 'Renommer')}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(t_item.id)}
                      className="flex items-center w-full gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> {t('ai_assistant.delete', 'Supprimer')}
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


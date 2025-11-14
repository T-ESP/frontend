import botAvatar from "@/assets/images/BOT.png";

export function ChatHeader() {
  return (
    <div className="flex justify-between items-center px-4 h-14 border-b border-gray-200">
      <div className="flex gap-2 items-center">
        <img src={botAvatar} alt="Avatar" className="object-cover w-8 h-8 rounded-full" />
        <div>
          <p className="text-sm font-semibold text-gray-900">Assistant IA</p>
          <p className="text-xs text-gray-500">En ligne</p>
        </div>
      </div>
    </div>
  );
}


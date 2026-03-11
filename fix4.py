import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

replacements = [
    ('className="rounded-[2.4rem] p-8 border border-white/10 space-y-5"', 'className="rounded-[2.4rem] p-8 border border-gray-100 space-y-5"'),
    ('className="flex items-center justify-between pb-4 border-b border-white/10"', 'className="flex items-center justify-between pb-4 border-b border-gray-100"'),
    ('className="text-sm font-bold text-white">Assistant Stocks IA</p>', 'className="text-sm font-bold text-gray-900">Assistant Stocks IA</p>'),
    ('className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">IA Gen-2</div>', 'className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">IA Gen-2</div>'),
    ('text-gray-200 font-light rounded-tl-none border border-white/10', 'text-gray-700 font-light rounded-tl-none border border-gray-100'),
    ('className="flex items-center gap-1.5 px-4 py-3 rounded-full border border-white/10 bg-[#120b29]/5"', 'className="flex items-center gap-1.5 px-4 py-3 rounded-full border border-gray-100 bg-gray-50"'),
    ('className="flex items-center gap-3 mt-2 bg-[#120b29]/5 rounded-2xl px-4 py-3 border border-white/10"', 'className="flex items-center gap-3 mt-2 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100"'),
    ('className="flex-1 bg-transparent text-sm text-purple-300/50 outline-none placeholder:text-gray-300 cursor-default font-light"', 'className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400 cursor-default font-light"'),
    # Restore user bubble background
    ('bg-gray-900 text-white font-medium rounded-tr-none', 'bg-[#7b5fa2] text-white font-medium rounded-tr-none'),
]

replace_in_file('src/ui/features/home/pages/HomePage/AISection.tsx', replacements)

print("Restored white AI Section cards")

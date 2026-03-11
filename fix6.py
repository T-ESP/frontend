import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

replacements = [
    # glass-card CSS
    ('background: rgba(30, 22, 50, 0.4);', 'background: rgba(255,255,255,0.74);'),
    ('border: 1px solid rgba(255,255,255,0.08);', 'border: 1px solid rgba(255,255,255,0.86);'),
    
    # Dashboard Card
    ('className="card-edge relative bg-[#120b29] rounded-[2.4rem] border border-white/10 p-7"', 'className="card-edge relative bg-white rounded-[2.4rem] border border-gray-100 p-7"'),
    
    # Text strings inside Float Left
    ('<p className="text-[9px] font-bold text-purple-200/80 mb-2.5 flex items-center gap-1.5 uppercase tracking-[0.14em]">', '<p className="text-[9px] font-bold text-gray-400 mb-2.5 flex items-center gap-1.5 uppercase tracking-[0.14em]">'),
    
    # Text strings inside Float Right
    ('<p className="text-[12px] font-extrabold text-white mb-0.5">Assistant IA</p>', '<p className="text-[12px] font-extrabold text-gray-800 mb-0.5">Assistant IA</p>'),
    ('<p className="text-[11px] text-purple-100 leading-relaxed">', '<p className="text-[11px] text-gray-500 leading-relaxed">'),
    
    # Float Side is already handled because of purple-100 in previous rule
    
    # Main card inner
    ('<p className="text-[10px] font-bold text-purple-200/80 uppercase tracking-[0.18em] mb-1">Tableau de bord</p>', '<p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.18em] mb-1">Tableau de bord</p>'),
    ('<h3 className="text-[1.1rem] font-[900] text-white tracking-tight">Vue d\'ensemble</h3>', '<h3 className="text-[1.1rem] font-[900] text-gray-900 tracking-tight">Vue d\'ensemble</h3>'),
    
    # Revenue
    ('<p className="text-[10px] text-purple-200/80 font-bold uppercase tracking-widest">CA Mensuel</p>', '<p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CA Mensuel</p>'),
    ('<p className="text-[1.6rem] font-[900] text-white tabular-nums leading-none">', '<p className="text-[1.6rem] font-[900] text-gray-900 tabular-nums leading-none">'),
    
    # Stats Inner Cards
    ('className="rounded-[1.1rem] px-4 py-3.5 border border-white/10 bg-white/5"', 'className="rounded-[1.1rem] px-4 py-3.5 border border-gray-100 bg-gray-50/60"'),
    ('<p className="text-[9px] text-purple-200/80 font-bold uppercase tracking-widest">{l}</p>', '<p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{l}</p>'),
    ('<p className="text-[1.2rem] font-[900] text-white tabular-nums leading-none mb-1">', '<p className="text-[1.2rem] font-[900] text-gray-900 tabular-nums leading-none mb-1">'),
    
    # Bar Chart Inner Card
    ('className="rounded-[1.1rem] p-4 border border-white/10 bg-white/5"', 'className="rounded-[1.1rem] p-4 border border-gray-100 bg-gray-50/60"'),
    ('<p className="text-[9px] font-bold text-purple-200/80 uppercase tracking-widest">Activité — 13 semaines</p>', '<p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Activité — 13 semaines</p>'),
]

replace_in_file('src/ui/features/home/pages/HomePage/Hero.tsx', replacements)

print("Restored white dashboard cards")

import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

replacements = [
    # Preview stats
    ('bg: "rgba(123,95,162,0.06)", border: "rgba(123,95,162,0.12)"', 'bg: "rgba(255,255,255,0.85)", border: "rgba(255,255,255,1)"'),
    ('bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.14)"', 'bg: "rgba(255,255,255,0.85)", border: "rgba(255,255,255,1)"'),
    ('bg: "rgba(59,130,246,0.06)", border: "rgba(59,130,246,0.12)"', 'bg: "rgba(255,255,255,0.85)", border: "rgba(255,255,255,1)"'),
    ('bg: "rgba(249,115,22,0.06)", border: "rgba(249,115,22,0.12)"', 'bg: "rgba(255,255,255,0.85)", border: "rgba(255,255,255,1)"'),
    
    # Inner text
    ('className="text-[1.8rem] font-[900] text-white tracking-tight leading-none mb-2"', 'className="text-[1.8rem] font-[900] text-gray-900 tracking-tight leading-none mb-2"'),
    ('className="text-xs text-purple-300/50 font-light leading-snug"', 'className="text-xs text-gray-500 font-light leading-snug"'),
]

replace_in_file('src/ui/features/home/pages/HomePage/Preview.tsx', replacements)

print("Restored white preview cards")

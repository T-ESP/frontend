import os
import glob

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

folder = "src/ui/features/home/pages/HomePage"
files = glob.glob(f"{folder}/*.tsx")

replacements = [
    # GlobalBackground in index.tsx
    ("rgba(123,95,162,0.08)", "rgba(123,95,162,0.15)"),
    ("rgba(176,142,224,0.05)", "rgba(176,142,224,0.1)"),
    ("#fafafc", "#0c071e"),
    ("radial-gradient(rgba(123,95,162,0.2) 1px", "radial-gradient(rgba(162,157,186,0.1) 1px"),
    
    # Hero.tsx glass styles
    ("background: rgba(255,255,255,0.78);", "background: rgba(20, 15, 34, 0.4); border: 1px solid rgba(255,255,255,0.08); color: white;"),
    ("border: 1px solid rgba(255,255,255,0.9);", "/* border: 1px solid rgba(255,255,255,0.08); */"),
    ("background: rgba(255,255,255,0.74);", "background: rgba(30, 22, 50, 0.4);"),
    ("border: 1px solid rgba(255,255,255,0.86);", "border: 1px solid rgba(255,255,255,0.08);"),
    ("background: rgba(255,255,255,0.9);", "background: rgba(255,255,255,0.1); color: white;"),
    ("border: 1px solid rgba(0,0,0,0.07);", "border: 1px solid rgba(255,255,255,0.12);"),
    ("box-shadow: 0 10px 30px rgba(0,0,0,0.07);", "box-shadow: 0 10px 30px rgba(0,0,0,0.5);"),
    ("filter: blur(24px) saturate(180%);", "filter: blur(24px) saturate(180%);"),
    
    # Features.tsx glass styles
    ("background: rgba(255, 255, 255, 0.5);", "background: rgba(30, 22, 50, 0.4); border: 1px solid rgba(255,255,255,0.08);"),
    ("border: 1px solid rgba(255, 255, 255, 0.7);", "/* border */"),
    ("background: rgba(255, 255, 255, 0.85);", "background: rgba(40, 30, 65, 0.5);"),
    ("border: 1px solid rgba(255, 255, 255, 0.9);", "border: 1px solid rgba(255, 255, 255, 0.15);"),
    ("box-shadow: 0 4px 32px rgba(0, 0, 0, 0.02);", "box-shadow: 0 4px 32px rgba(0, 0, 0, 0.5);"),
    ("box-shadow: 0 20px 60px rgba(123, 95, 162, 0.12);", "box-shadow: 0 20px 60px rgba(123, 95, 162, 0.4);"),

    # Common replacements just in case
    ("text-gray-900", "text-white"),
    ("text-gray-800", "text-gray-100"),
    ("text-gray-700", "text-gray-200"),
    ("text-gray-500", "text-[#a29dba]"),
    ("text-gray-400", "text-[#a29dba]/70"),
    ("bg-white", "bg-[#120b29]"),
    ("bg-[#120b29]/95", "bg-[#120b29]"), 
]

for file in files:
    replace_in_file(file, replacements)

print("Done replacing.")

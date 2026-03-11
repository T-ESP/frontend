import os

def replace_in_file(filepath, replacements):
    with open(filepath, 'r') as f:
        content = f.read()
    
    for old, new in replacements:
        content = content.replace(old, new)
        
    with open(filepath, 'w') as f:
        f.write(content)

hero_r = [
    ('bg-[#120b29]/5/60', 'bg-white/5'),
    ('text-purple-300/50 text-lg', 'text-purple-100/90 text-lg'),
    ('text-purple-300/50', 'text-purple-200/80'),
    ('text-purple-200/60', 'text-purple-100'),
    ('linear-gradient(120deg, #7b5fa2 0%, #7b5fa2 50%, #7b5fa2 100%)', 'linear-gradient(120deg, #a480d1 0%, #ffffff 50%, #a480d1 100%)'),
    ('text-gray-100', 'text-white'),
]

feat_r = [
    ('text-gray-100', 'text-white'),
    ('text-[#a29dba]', 'text-purple-100/90'),
    ('text-[#a29dba]/70', 'text-purple-200/80'),
    ('bg-[#120b29]', 'bg-white/5'),
]

testi_r = [
    ('bg-white', 'bg-white/5'),
    ('text-gray-900', 'text-white'),
    ('text-gray-700', 'text-purple-100/90'),
    ('text-gray-500', 'text-purple-200/80'),
    ('border-gray-200', 'border-white/10'),
    ('border-gray-100', 'border-white/10')
]

ai_r = [
    ('bg-gray-50', 'bg-white/5'),
    ('bg-white', 'bg-white/5'),
    ('text-gray-900', 'text-white'),
    ('text-gray-800', 'text-white'),
    ('text-gray-700', 'text-purple-100/90'),
    ('text-gray-500', 'text-purple-200/80'),
    ('text-gray-400', 'text-white/40'),
    ('border-gray-200', 'border-white/10'),
    ('border-gray-100', 'border-white/10'),
    ('ring-gray-100', 'ring-white/10')
]


replace_in_file('src/ui/features/home/pages/HomePage/Hero.tsx', hero_r)
replace_in_file('src/ui/features/home/pages/HomePage/Features.tsx', feat_r)
replace_in_file('src/ui/features/home/pages/HomePage/Testimonials.tsx', testi_r)
replace_in_file('src/ui/features/home/pages/HomePage/AISection.tsx', ai_r)

print("Done fixing contrast")

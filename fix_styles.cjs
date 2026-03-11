const fs = require('fs');
const glob = require('glob');

const replaceInFile = (file, replacements) => {
    let content = fs.readFileSync(file, 'utf8');
    for (const [old, newVal] of replacements) {
        content = content.split(old).join(newVal);
    }
    fs.writeFileSync(file, content);
};

const heroReplacements = [
    // Fix invalid tailwind
    ['bg-[#120b29]/5/60', 'bg-white/5'],
    // Fix dim text
    ['text-purple-300/50 text-lg', 'text-purple-100/90 text-lg'],
    ['text-purple-300/50', 'text-purple-200/80'],
    ['text-purple-200/60', 'text-purple-100'],
    // Fix gradient text to be more bright and purple
    ['linear-gradient(120deg, #7b5fa2 0%, #7b5fa2 50%, #7b5fa2 100%)', 'linear-gradient(120deg, #a480d1 0%, #ffffff 50%, #a480d1 100%)'],
    // Fix glass text contrast
    ['text-gray-100', 'text-white'],
];

const featuresReplacements = [
    ['text-gray-100', 'text-white'],
    ['text-[#a29dba]', 'text-purple-100/90'],
    ['text-[#a29dba]/70', 'text-purple-200/80'],
    ['bg-[#120b29]', 'bg-white/5'],
    // Also the features visuals might need tweaks but let's see.
];

replaceInFile('src/ui/features/home/pages/HomePage/Hero.tsx', heroReplacements);
replaceInFile('src/ui/features/home/pages/HomePage/Features.tsx', featuresReplacements);

console.log('Styles fixed');

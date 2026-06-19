const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'figma-selection.json');
if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    process.exit(1);
}

const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function findFrames(node, depth = 0) {
    if (!node) return;
    if (node.type === 'FRAME') {
        console.log(`${'  '.repeat(depth)}- FRAME: "${node.name}" (id: ${node.id}, children: ${node.children ? node.children.length : 0})`);
    }
    if (node.children && Array.isArray(node.children)) {
        node.children.forEach(child => findFrames(child, depth + 1));
    }
}

if (Array.isArray(data)) {
    data.forEach((node, index) => {
        console.log(`Root selection item ${index}:`);
        findFrames(node);
    });
} else {
    findFrames(data);
}


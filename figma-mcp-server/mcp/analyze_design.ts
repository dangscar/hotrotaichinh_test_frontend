import * as fs from "fs";
import * as path from "path";

const fileContent = fs.readFileSync(path.join("d:", "DVC_CNTT", "figma-selection.json"), "utf-8");
const selection = JSON.parse(fileContent);

let output = "";
function summarizeNode(node: any, depth: number = 0) {
    const indent = "  ".repeat(depth);
    const fills = node.fills ? node.fills.map((f: any) => f.type + (f.color ? `(${Math.round(f.color.r*255)},${Math.round(f.color.g*255)},${Math.round(f.color.b*255)})` : '')).join(', ') : 'none';
    const textInfo = node.type === 'TEXT' ? ` "${node.characters.replace(/\n/g, '\\n')}"` : '';
    output += `${indent}- [${node.type}] ${node.name} (id: ${node.id}, x: ${node.x}, y: ${node.y}, w: ${node.width}, h: ${node.height}, fills: ${fills})${textInfo}\n`;
    
    if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
            summarizeNode(child, depth + 1);
        }
    }
}

if (selection && selection.length > 0) {
    output += "DESIGN HIERARCHY SUMMARY:\n";
    summarizeNode(selection[0]);
    fs.writeFileSync(path.join("d:", "DVC_CNTT", "design-summary.txt"), output, "utf-8");
    console.log("Success! Summary written to d:\\DVC_CNTT\\design-summary.txt");
} else {
    console.log("Empty selection");
}

import { TaskManager } from "./src/task-manager.js";
import { SocketManager } from "./src/socket-manager.js";
import { Orchestrator } from "./src/orchestrator.js";
import { Server } from "socket.io";
import http from "http";
import * as fs from "fs";
import * as path from "path";

const targetFrames = [
    { id: "163:2", name: "Chi tiết hồ sơ" },
    { id: "208:188", name: "Hoàn thành" },
    { id: "184:744", name: "Trang chủ" },
    { id: "172:469", name: "Tra cứu" },
    { id: "203:39", name: "TT SInh viên_update" }
];

async function run() {
    const httpServer = http.createServer();
    const socketServer = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "OPTIONS"],
            allowedHeaders: ["*"],
            credentials: false
        },
        transports: ['polling', 'websocket'],
        allowUpgrades: true,
        cookie: false,
        serveClient: false,
        pingTimeout: 60000,
        pingInterval: 25000
    });

    const taskManager = new TaskManager();
    const socketManager = new SocketManager(socketServer);
    const orchestrator = new Orchestrator(socketManager, taskManager);

    httpServer.listen(38450, () => {
        console.log("Socket.IO server listening on http://localhost:38450");
        console.log("Waiting for Figma plugin to connect...");
    });

    socketServer.on('connection', async (socket) => {
        console.log("Figma plugin connected! Fetching all target frames...");
        await new Promise(r => setTimeout(r, 1000));
        try {
            // Recursive function to load complete nodes
            async function fetchNodeDeep(nodeId: string): Promise<any> {
                console.log(`Fetching node details for: ${nodeId}`);
                const nodeResult: any = await taskManager.runTask("get-node-info", { id: nodeId });
                if (nodeResult.isError) {
                    console.error(`Error fetching node ${nodeId}:`, nodeResult.content);
                    return { id: nodeId, error: nodeResult.content };
                }

                const node = typeof nodeResult.content === 'string' ? JSON.parse(nodeResult.content) : nodeResult.content;
                
                // If this node has children, fetch their details recursively
                if (node.children && Array.isArray(node.children)) {
                    const fullChildren = [];
                    for (const child of node.children) {
                        const fullChild = await fetchNodeDeep(child.id);
                        fullChildren.push(fullChild);
                    }
                    node.children = fullChildren;
                }
                
                return node;
            }

            const results: any[] = [];
            for (const target of targetFrames) {
                console.log(`\n--- Starting fetch for frame: "${target.name}" (${target.id}) ---`);
                const fullNode = await fetchNodeDeep(target.id);
                results.push(fullNode);
            }

            const outputPath = path.join("d:", "DVC_CNTT", "figma-remaining-screens.json");
            fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), "utf-8");
            console.log(`\nSuccess! Saved remaining screens to: ${outputPath}`);

            // Also output summaries to a text file for easy reading
            let summaryText = "REMAINING SCREENS DESIGN HIERARCHY SUMMARY:\n\n";
            function summarizeNode(node: any, depth: number = 0) {
                const indent = "  ".repeat(depth);
                const fills = node.fills ? node.fills.map((f: any) => f.type + (f.color ? `(${Math.round(f.color.r*255)},${Math.round(f.color.g*255)},${Math.round(f.color.b*255)})` : '')).join(', ') : 'none';
                const textInfo = node.type === 'TEXT' ? ` "${node.characters.replace(/\n/g, '\\n')}"` : '';
                summaryText += `${indent}- [${node.type}] ${node.name} (id: ${node.id}, x: ${node.x}, y: ${node.y}, w: ${node.width}, h: ${node.height}, fills: ${fills})${textInfo}\n`;
                
                if (node.children && Array.isArray(node.children)) {
                    for (const child of node.children) {
                        summarizeNode(child, depth + 1);
                    }
                }
            }

            results.forEach(root => {
                summarizeNode(root, 0);
                summaryText += "\n" + "=".repeat(80) + "\n\n";
            });

            fs.writeFileSync(path.join("d:", "DVC_CNTT", "remaining-screens-summary.txt"), summaryText, "utf-8");
            console.log("Saved summary text file to d:\\DVC_CNTT\\remaining-screens-summary.txt");

            setTimeout(() => {
                process.exit(0);
            }, 1000);
        } catch (e) {
            console.error("Error fetching target frames:", e);
            process.exit(1);
        }
    });
}

run();

import { TaskManager } from "./src/task-manager.js";
import { SocketManager } from "./src/socket-manager.js";
import { Orchestrator } from "./src/orchestrator.js";
import { Server } from "socket.io";
import http from "http";
import * as fs from "fs";
import * as path from "path";

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
        console.log("Figma plugin connected! Fetching selection...");
        await new Promise(r => setTimeout(r, 1000));
        try {
            // 1. Get initial selection
            const selectionResult: any = await taskManager.runTask("get-selection", {});
            console.log("Selection result:", selectionResult);

            if (selectionResult.isError) {
                throw new Error("Failed to get selection: " + JSON.stringify(selectionResult.content));
            }

            const roots = selectionResult.content;
            if (!roots || roots.length === 0) {
                console.log("No nodes selected in Figma! Please select a frame/design element.");
                process.exit(0);
            }

            console.log(`Found ${roots.length} root selected nodes. Fetching full details recursively...`);

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

            const fullSelection = [];
            for (const rootNode of roots) {
                const fullNode = await fetchNodeDeep(rootNode.id);
                fullSelection.push(fullNode);
            }

            // Save selection to file
            const outputPath = path.join("d:", "DVC_CNTT", "figma-selection.json");
            fs.writeFileSync(outputPath, JSON.stringify(fullSelection, null, 2), "utf-8");
            console.log(`Success! Full selection design tree saved to: ${outputPath}`);
            
            setTimeout(() => {
                process.exit(0);
            }, 1000);
        } catch (e) {
            console.error("Error fetching full selection:", e);
            process.exit(1);
        }
    });
}

run();

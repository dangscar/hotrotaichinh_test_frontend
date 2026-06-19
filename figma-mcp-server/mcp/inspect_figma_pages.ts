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
        console.log("Figma plugin connected! Fetching pages...");
        await new Promise(r => setTimeout(r, 1000));
        try {
            const pagesResult: any = await taskManager.runTask("get-pages", {});
            
            if (pagesResult.isError) {
                throw new Error("Failed to get pages: " + JSON.stringify(pagesResult.content));
            }

            const pages = pagesResult.content;
            const parsedPages = pages.map((p: string) => JSON.parse(p));
            
            fs.writeFileSync(
                path.join("d:", "DVC_CNTT", "figma-pages-list.json"),
                JSON.stringify(parsedPages, null, 2),
                "utf-8"
            );

            console.log("\n================ PAGES AND TOP-LEVEL NODES ================");
            parsedPages.forEach((page: any) => {
                console.log(`Page: "${page.name}" (id: ${page.id})`);
                if (page.nodes && Array.isArray(page.nodes)) {
                    page.nodes.forEach((nodeStr: any) => {
                        const child = typeof nodeStr === 'string' ? JSON.parse(nodeStr) : nodeStr;
                        console.log(`  - ${child.type}: "${child.name}" (id: ${child.id})`);
                    });
                }
            });
            console.log("=========================================================\n");

            setTimeout(() => {
                process.exit(0);
            }, 1000);
        } catch (e) {
            console.error("Error fetching pages:", e);
            process.exit(1);
        }
    });
}

run();

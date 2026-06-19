import { TaskManager } from "./src/task-manager.js";
import { SocketManager } from "./src/socket-manager.js";
import { Orchestrator } from "./src/orchestrator.js";
import { Server } from "socket.io";
import http from "http";

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
        console.log("Figma plugin connected! Running tasks in 1 second...");
        await new Promise(r => setTimeout(r, 1000));
        try {
            console.log("Creating rectangle...");
            const rectResult: any = await taskManager.runTask("create-rectangle", {
                x: 100,
                y: 100,
                width: 200,
                height: 200,
                name: "Yellow Circle"
            });
            
            console.log("Created node raw result:", rectResult);
            if (rectResult.isError) {
                throw new Error("Failed to create rectangle: " + JSON.stringify(rectResult.content));
            }

            const rectObj = JSON.parse(rectResult.content);
            const nodeId = rectObj.id;
            console.log("Node ID is:", nodeId);

            console.log("Setting corner radius to 100...");
            const radiusResult: any = await taskManager.runTask("set-corner-radius", {
                id: nodeId,
                cornerRadius: 100
            });
            console.log("Radius result:", radiusResult);

            console.log("Setting fill color to yellow...");
            const fillResult: any = await taskManager.runTask("set-fill-color", {
                id: nodeId,
                color: "#FFFF00FF"
            });
            console.log("Fill result:", fillResult);

            console.log("Success! Yellow circle drawn in Figma.");
            setTimeout(() => {
                process.exit(0);
            }, 1000);
        } catch (e) {
            console.error("Error drawing yellow circle:", e);
            process.exit(1);
        }
    });
}

run();

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import * as fs from "fs";
import * as path from "path";

async function run() {
    const transport = new StreamableHTTPClientTransport(new URL("http://localhost:38450/mcp"));
    const client = new Client({
        name: "test-client",
        version: "1.0.0"
    }, {
        capabilities: {}
    });

    console.log("Connecting to Figma MCP server at http://localhost:38450/mcp ...");
    await client.connect(transport);
    console.log("Connected!");

    try {
        console.log("Fetching selection...");
        const selectionResult = await client.callTool({
            name: "get-selection",
            arguments: {}
        });

        const contentText = (selectionResult.content[0] as any).text;
        const selectionObj = JSON.parse(contentText);
        
        if (selectionObj.isError) {
            throw new Error("Failed to get selection: " + JSON.stringify(selectionObj.content));
        }

        const roots = selectionObj.content;
        if (!roots || roots.length === 0) {
            console.log("No nodes selected in Figma! Please select a frame/design element.");
            process.exit(0);
        }

        console.log(`Found ${roots.length} root selected nodes. Fetching details recursively...`);

        async function fetchNodeDeep(nodeId: string): Promise<any> {
            console.log(`Fetching node details for: ${nodeId}`);
            const nodeResult = await client.callTool({
                name: "get-node-info",
                arguments: { id: nodeId }
            });

            const nodeObj = JSON.parse((nodeResult.content[0] as any).text);
            if (nodeObj.isError) {
                console.error(`Error fetching node ${nodeId}:`, nodeObj.content);
                return { id: nodeId, error: nodeObj.content };
            }

            const node = typeof nodeObj.content === 'string' ? JSON.parse(nodeObj.content) : nodeObj.content;

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

        const outputPath = path.join("d:", "DVC_CNTT", "figma-selection.json");
        fs.writeFileSync(outputPath, JSON.stringify(fullSelection, null, 2), "utf-8");
        console.log(`Success! Full selection design tree saved to: ${outputPath}`);

        process.exit(0);
    } catch (e) {
        console.error("Error fetching full selection:", e);
        process.exit(1);
    }
}

run();

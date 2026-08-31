import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";
import { setupWSConnection } from "y-websocket/bin/utils";

if (process.env.NODE_ENV !== "production") {
    dotenv.config({ path: ".env.local" });
}

async function main() {
    const { auth } = await import("../lib/auth/auth");
    const { prisma } = await import("../lib/prisma");

    const PORT = Number(process.env.PORT || process.env.WS_PORT || 1234);

    const server = http.createServer();
    const wss = new WebSocketServer({ noServer: true });

    server.on("upgrade", async (request, socket, head) => {
        try {
            const url = new URL(
                request.url ?? "",
                `http://${request.headers.host}`
            );

            const projectId = url.pathname.slice(1);

            if (!projectId) {
                socket.write("HTTP/1.1 400 Bad Request\r\n\r\n");
                socket.destroy();
                return;
            }

            const session = await auth.api.getSession({
                headers: new Headers({
                    cookie: request.headers.cookie ?? "",
                }),
            });

            if (!session?.user) {
                socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
                socket.destroy();
                return;
            }

            const membership = await prisma.projectMember.findUnique({
                where: {
                    projectId_userId: {
                        projectId,
                        userId: session.user.id,
                    },
                },
            });

            if (!membership) {
                socket.write("HTTP/1.1 403 Forbidden\r\n\r\n");
                socket.destroy();
                return;
            }

            wss.handleUpgrade(request, socket, head, (ws) => {
                setupWSConnection(ws, request, {
                    docName: projectId,
                    gc: true,
                });
            });
        } catch (err) {
            console.error("WS upgrade error:", err);
            socket.destroy();
        }
    });

    server.listen(PORT, "0.0.0.0", () => {
        console.log(`SyncCode WebSocket server listening on port ${PORT}`);
    });
}

main().catch((err) => {
    console.error("Failed to start WebSocket server:", err);
    process.exit(1);
});
// app/api/retros/[slug]/ws/route.ts
import { WebSocketServer } from 'ws';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic'; // Ensure this route is dynamic

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  if (req.headers.get('upgrade') !== 'websocket') {
    return new NextResponse('Expected WebSocket upgrade', { status: 426 });
  }

  // Next.js doesn't directly support WebSocket upgrades in API routes,
  // so we need to use a different approach
  return new NextResponse(null, {
    status: 101, // Switching Protocols
    headers: {
      Upgrade: 'websocket',
      Connection: 'Upgrade',
    },
  });
}

// Alternative implementation using a separate WebSocket server
// This would typically be in a separate file (e.g., lib/websocket.ts)
class RetroWebSocketServer {
  private static instance: RetroWebSocketServer;
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket> = new Map();

  private constructor(port: number = 3001) {
    this.wss = new WebSocketServer({ port });
    this.setupConnectionHandlers();
  }

  public static getInstance(): RetroWebSocketServer {
    if (!RetroWebSocketServer.instance) {
      RetroWebSocketServer.instance = new RetroWebSocketServer();
    }
    return RetroWebSocketServer.instance;
  }

  private setupConnectionHandlers() {
    this.wss.on('connection', async (ws: any, req: any) => {
      const session = await getServerSession({});
      const username = session?.user?.name || 'Anonymous';
      const clientId = crypto.randomUUID();

      this.clients.set(clientId, ws);

      ws.on('message', async (message: string) => {
        try {
          const data = JSON.parse(message);

          if (data.type === 'note_added') {
            const broadcastMsg = JSON.stringify({
              type: 'note_added',
              username,
              content: data.content,
              note: data.note,
              updatedAt: new Date().toISOString(),
            });

            this.clients.forEach((client, id) => {
              if (id !== clientId && client.readyState === ws.OPEN) {
                client.send(broadcastMsg);
              }
            });
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
      });

      ws.on('error', (error: any) => {
        console.error('WebSocket error:', error);
        this.clients.delete(clientId);
      });
    });
  }
}

// Initialize the WebSocket server when this module is loaded
const webSocketServer = RetroWebSocketServer.getInstance();

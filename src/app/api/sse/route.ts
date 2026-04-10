import { subscribe } from "@/lib/sse";

export const dynamic = "force-dynamic";

/**
 * SSE endpoint.  Clients connect: GET /api/sse?channels=notifications,companies
 * The response is a long-lived text/event-stream.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const channelList = (searchParams.get("channels") || "notifications").split(",").filter(Boolean);

  const encoder = new TextEncoder();
  let closed = false;
  const unsubscribes: (() => void)[] = [];

  const stream = new ReadableStream({
    start(controller) {
      // Send initial heartbeat so the connection isn't treated as empty
      controller.enqueue(encoder.encode(": connected\n\n"));

      for (const channel of channelList) {
        const unsub = subscribe(channel, (payload: string) => {
          if (closed) return;
          try {
            controller.enqueue(encoder.encode(`event: ${channel}\ndata: ${payload}\n\n`));
          } catch {
            closed = true;
          }
        });
        unsubscribes.push(unsub);
      }

      // Heartbeat every 30s to keep the connection alive
      const heartbeat = setInterval(() => {
        if (closed) { clearInterval(heartbeat); return; }
        try {
          controller.enqueue(encoder.encode(": heartbeat\n\n"));
        } catch {
          closed = true;
          clearInterval(heartbeat);
        }
      }, 30_000);
    },
    cancel() {
      closed = true;
      for (const unsub of unsubscribes) unsub();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

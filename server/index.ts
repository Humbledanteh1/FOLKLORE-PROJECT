import express, { NextFunction, Request, Response } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { AGENT_IDS, AgentId } from "./agents/contracts";
import { processClientNeed } from "./agents/orchestrator";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 30;
const requestWindows = new Map<string, { startedAt: number; count: number }>();

function rateLimit(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  const key = req.ip ?? "anonymous";
  const current = requestWindows.get(key);
  if (!current || now - current.startedAt > RATE_WINDOW_MS) {
    requestWindows.set(key, { startedAt: now, count: 1 });
    return next();
  }
  current.count += 1;
  if (current.count > RATE_LIMIT) {
    return res.status(429).json({ error: "Too many requests. Try again shortly." });
  }
  return next();
}

function isAgentId(value: unknown): value is AgentId {
  return typeof value === "string" && AGENT_IDS.includes(value as AgentId);
}

async function startServer() {
  const app = express();
  const server = createServer(app);

  app.disable("x-powered-by");
  app.use(express.json({ limit: "16kb", strict: true }));
  app.use((_, res, next) => {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "no-referrer");
    next();
  });

  app.get("/api/privacy/health", (_req, res) => {
    res.json({
      ok: true,
      service: "folklore-privacy-gateway",
      policy: "raw client data is never forwarded to downstream agents",
      agents: AGENT_IDS,
    });
  });

  app.post("/api/privacy/needs", rateLimit, (req, res) => {
    const body = req.body as Record<string, unknown>;
    if (!body || typeof body.request !== "string" || body.request.length > 8_000) {
      return res.status(400).json({ error: "request must be a non-empty string under 8,000 characters" });
    }
    if (body.requestedAgent !== undefined && !isAgentId(body.requestedAgent)) {
      return res.status(400).json({ error: "requestedAgent must name a supported agent" });
    }
    if (body.clientReference !== undefined && (typeof body.clientReference !== "string" || body.clientReference.length > 256)) {
      return res.status(400).json({ error: "clientReference must be a short string" });
    }

    const result = processClientNeed({
      request: body.request,
      clientReference: typeof body.clientReference === "string" ? body.clientReference : undefined,
      requestedAgent: isAgentId(body.requestedAgent) ? body.requestedAgent : undefined,
    });

    console.info(JSON.stringify({
      event: "privacy_gateway_decision",
      requestId: result.requestId,
      status: result.status,
      risk: result.decision.risk,
      redactionTypes: result.redactions.map((item) => item.label),
      recipients: result.audit.recipients,
      rawClientDataForwarded: false,
    }));

    return res.status(200).json(result);
  });

  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");
  app.use(express.static(staticPath));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);

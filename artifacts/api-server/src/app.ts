import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const buildAllowedOrigins = (): Set<string> => {
  const origins = new Set<string>();

  const replitDomains = process.env.REPLIT_DOMAINS?.split(",") ?? [];
  for (const domain of replitDomains) {
    const trimmed = domain.trim();
    if (trimmed) origins.add(`https://${trimmed}`);
  }

  const devDomain = process.env.REPLIT_DEV_DOMAIN?.trim();
  if (devDomain) origins.add(`https://${devDomain}`);

  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:80");
    origins.add("http://localhost:3000");
    origins.add("http://localhost:5173");
  }

  return origins;
};

const allowedOrigins = buildAllowedOrigins();
logger.info({ origins: [...allowedOrigins] }, "CORS allowed origins");

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }
      if (allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        logger.warn({ origin }, "CORS rejected origin");
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api", router);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (err.message === "Not allowed by CORS") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  logger.error({ err }, "Unhandled error");
  res.status(500).json({ error: "Internal server error" });
});

export default app;

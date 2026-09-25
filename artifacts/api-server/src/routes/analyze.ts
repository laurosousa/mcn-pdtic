import { Router, type Request } from "express";
import { timingSafeEqual } from "crypto";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { logger } from "../lib/logger";

const router = Router();

interface RequirementInput {
  id: string;
  dimension: string;
  description: string;
  normativeSource: string;
  classification: string;
}

interface AnalysisSuggestion {
  id: string;
  compliance: "Atendido" | "Parcialmente Atendido" | "Não Atendido";
  reasoning: string;
  confidence: "alta" | "média" | "baixa";
}

const DIMENSION_BATCHES = ["Normativa", "Estratégica", "Operacional", "Governança"];

// ---------------------------------------------------------------------------
// Server-held API key — never distributed to browser clients.
// Set ANALYZE_API_KEY as a Replit secret (never in VCS).
// In development, a warning is logged and a dev-only fallback is used.
// In production, missing key rejects all requests immediately.
// ---------------------------------------------------------------------------
const DEV_FALLBACK_KEY = "dev-only-insecure-key-do-not-use-in-production";

function getAnalyzeApiKey(): string | null {
  const key = process.env["ANALYZE_API_KEY"];
  if (!key) {
    if (process.env["NODE_ENV"] !== "production") {
      logger.warn("ANALYZE_API_KEY is not set — using dev-only fallback. Set the secret before production.");
      return DEV_FALLBACK_KEY;
    }
    return null;
  }
  return key;
}

function isValidApiKey(provided: string): boolean {
  const expected = getAnalyzeApiKey();
  if (!expected) return false;
  if (provided.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Rate limiting — sliding window, per IP.
// Max 10 analysis requests per 10 minutes per source IP.
// ---------------------------------------------------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 10;

const rateLimitStore = new Map<string, number[]>();

function getClientIp(req: Request): string {
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;

  const timestamps = (rateLimitStore.get(ip) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= RATE_LIMIT_MAX) return true;

  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return false;
}

setInterval(() => {
  const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
  for (const [ip, timestamps] of rateLimitStore.entries()) {
    if (timestamps.every((t) => t <= cutoff)) rateLimitStore.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS);

// ---------------------------------------------------------------------------
// Concurrency limit — max simultaneous in-flight analysis requests globally.
// ---------------------------------------------------------------------------
const MAX_CONCURRENT = 3;
let activeConcurrent = 0;

// ---------------------------------------------------------------------------
// Route
// ---------------------------------------------------------------------------
router.post("/analyze-pdtic", async (req, res) => {
  const authHeader = req.headers["authorization"] ?? "";
  const providedKey = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!providedKey || !isValidApiKey(providedKey)) {
    req.log.warn({ ip: req.ip }, "Unauthorized access attempt to /analyze-pdtic");
    res.status(401).json({ error: "Não autorizado." });
    return;
  }

  const ip = getClientIp(req);

  if (isRateLimited(ip)) {
    req.log.warn({ ip }, "Rate limit exceeded for /analyze-pdtic");
    res.status(429).json({ error: "Muitas requisições. Tente novamente em alguns minutos." });
    return;
  }

  if (activeConcurrent >= MAX_CONCURRENT) {
    req.log.warn({ activeConcurrent }, "Concurrency limit exceeded for /analyze-pdtic");
    res.status(503).json({ error: "Serviço temporariamente sobrecarregado. Tente novamente em instantes." });
    return;
  }

  const { pdticText, requirements } = req.body as {
    pdticText: string;
    requirements: RequirementInput[];
  };

  if (!pdticText || typeof pdticText !== "string" || pdticText.trim().length < 100) {
    res.status(400).json({ error: "Texto do PDTIC inválido ou muito curto." });
    return;
  }

  if (!requirements || !Array.isArray(requirements) || requirements.length === 0) {
    res.status(400).json({ error: "Lista de requisitos inválida." });
    return;
  }

  // SSE setup
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const sendEvent = (data: object) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const abortController = new AbortController();
  let clientDisconnected = false;

  req.on("close", () => {
    clientDisconnected = true;
    abortController.abort();
    req.log.info({ ip }, "Client disconnected — aborting analysis");
  });

  activeConcurrent++;
  const allSuggestions: AnalysisSuggestion[] = [];

  try {
    const truncatedText = pdticText.slice(0, 80000);

    for (const dimension of DIMENSION_BATCHES) {
      if (clientDisconnected) break;

      const dimReqs = requirements.filter((r) => r.dimension === dimension);
      if (dimReqs.length === 0) continue;

      sendEvent({ type: "progress", dimension, status: "analyzing" });

      const reqsJson = dimReqs
        .map(
          (r) =>
            `ID: ${r.id}\nClassificação: ${r.classification}\nRequisito: ${r.description}\nNormativa: ${r.normativeSource}`
        )
        .join("\n\n");

      const prompt = `Você é um auditor especialista em avaliação de conformidade de Planos Diretores de Tecnologia da Informação e Comunicação (PDTICs) de Instituições Federais de Ensino Superior (IFES) brasileiras.

Analise o texto do PDTIC abaixo e avalie cada requisito da Dimensão ${dimension} da Matriz de Conformidade Normativa (MCN-PDTIC).

Para cada requisito, retorne:
- "compliance": um dos três valores exatos: "Atendido", "Parcialmente Atendido" ou "Não Atendido"
  - "Atendido": o elemento está presente, completo e verificável no texto do PDTIC
  - "Parcialmente Atendido": o elemento está presente mas incompleto, superficial ou com lacunas relevantes
  - "Não Atendido": o elemento está ausente, inconsistente ou não verificável no texto
- "reasoning": justificativa objetiva em português (máximo 2 frases), referenciando trecho ou ausência no PDTIC
- "confidence": "alta" (evidência clara no texto), "média" (evidência indireta ou parcial) ou "baixa" (incerteza pela falta de informação suficiente no texto)

Retorne APENAS um objeto JSON válido com os IDs dos requisitos como chaves. Exemplo:
{
  "N01": {"compliance": "Atendido", "reasoning": "O PDTIC referencia explicitamente a IN SGD/ME 01/2019 na seção 1.1.", "confidence": "alta"},
  "N02": {"compliance": "Parcialmente Atendido", "reasoning": "Há menção à IN 94/2022 mas sem atendimento a todos os elementos obrigatórios.", "confidence": "média"}
}

TEXTO DO PDTIC (pode estar truncado para análise):
---
${truncatedText}
---

REQUISITOS DA DIMENSÃO ${dimension.toUpperCase()} A AVALIAR:
${reqsJson}

Retorne SOMENTE o JSON, sem texto adicional, markdown ou explicações.`;

      try {
        const message = await anthropic.messages.create(
          {
            model: "claude-sonnet-4-6",
            max_tokens: 8192,
            messages: [{ role: "user", content: prompt }],
          },
          { signal: abortController.signal },
        );

        if (clientDisconnected) break;

        const block = message.content[0];
        if (block.type !== "text") {
          sendEvent({ type: "dimension_error", dimension, error: "Resposta inválida da IA" });
          continue;
        }

        let parsed: Record<string, { compliance: string; reasoning: string; confidence: string }>;
        try {
          const jsonText = block.text.trim().replace(/^```json?\n?/, "").replace(/\n?```$/, "");
          parsed = JSON.parse(jsonText);
        } catch {
          logger.error({ dimension, raw: block.text.slice(0, 200) }, "Failed to parse AI response");
          sendEvent({ type: "dimension_error", dimension, error: "Falha ao processar resposta da IA" });
          continue;
        }

        const dimSuggestions: AnalysisSuggestion[] = dimReqs
          .filter((r) => parsed[r.id])
          .map((r) => ({
            id: r.id,
            compliance: parsed[r.id].compliance as AnalysisSuggestion["compliance"],
            reasoning: parsed[r.id].reasoning || "",
            confidence: (parsed[r.id].confidence || "baixa") as AnalysisSuggestion["confidence"],
          }));

        allSuggestions.push(...dimSuggestions);
        sendEvent({ type: "dimension_done", dimension, suggestions: dimSuggestions });
      } catch (err) {
        if (clientDisconnected) break;
        logger.error({ err, dimension }, "Error analyzing dimension");
        sendEvent({ type: "dimension_error", dimension, error: "Erro ao chamar a IA para esta dimensão" });
      }
    }

    if (!clientDisconnected) {
      sendEvent({ type: "done", total: allSuggestions.length });
    }
  } catch (err) {
    if (!clientDisconnected) {
      logger.error({ err }, "Error in analyze-pdtic");
      sendEvent({ type: "error", error: "Erro interno ao processar a análise." });
    }
  } finally {
    activeConcurrent--;
    res.end();
  }
});

export default router;

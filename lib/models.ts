import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { LanguageModel } from "ai";

// Models route through the Vercel AI Gateway by default (plain "provider/model"
// strings). If GOOGLE_GENERATIVE_AI_API_KEY is set (free at aistudio.google.com),
// google/* models call Google directly — bypassing gateway free-tier rate limits.
export function resolveModel(id: string): LanguageModel {
  if (id.startsWith("google/") && process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return createGoogleGenerativeAI()(id.slice("google/".length));
  }
  return id;
}

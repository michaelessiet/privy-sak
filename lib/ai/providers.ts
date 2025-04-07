import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { isTestEnvironment } from "../constants";
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from "./models.test";

const openai = createOpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        "chat-model": chatModel,
        "chat-model-reasoning": reasoningModel,
        "title-model": titleModel,
        "artifact-model": artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        "chat-model": openai("gpt-4o"),
        "chat-model-reasoning": wrapLanguageModel({
          model: openai("o3-mini"),
          middleware: extractReasoningMiddleware({ tagName: "think" }),
        }),
        "title-model": openai("gpt-4o"),
        "artifact-model": openai("gpt-4"),
      },
      imageModels: {
        "small-model": openai.image("dall-e-3"),
      },
    });

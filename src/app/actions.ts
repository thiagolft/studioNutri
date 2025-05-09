"use server";
import { generateRecipeOrTip, type GenerateRecipeOrTipInput, type GenerateRecipeOrTipOutput } from "@/ai/flows/generate-recipe-or-tip";

interface ActionResult {
  data?: GenerateRecipeOrTipOutput;
  error?: string;
}

export async function handleSearchQuery(query: string): Promise<ActionResult> {
  if (!query || query.trim().length < 3) {
    return { error: "A busca deve ter pelo menos 3 caracteres." };
  }

  try {
    const input: GenerateRecipeOrTipInput = { query };
    const result = await generateRecipeOrTip(input);
    return { data: result };
  } catch (e: any) {
    console.error("Error in handleSearchQuery:", e);
    // It's good practice to not expose raw error messages to the client if they might contain sensitive info.
    // For this AI flow, the message should generally be safe.
    return { error: e.message || "Falha ao gerar conteúdo. Por favor, tente novamente." };
  }
}

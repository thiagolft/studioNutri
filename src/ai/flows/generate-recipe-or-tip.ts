'use server';

/**
 * @fileOverview An AI agent that generates recipes or nutritional tips based on user search queries.
 *
 * - generateRecipeOrTip - A function that handles the generation of recipes or nutritional tips.
 * - GenerateRecipeOrTipInput - The input type for the generateRecipeOrTip function.
 * - GenerateRecipeOrTipOutput - The return type for the generateRecipeOrTip function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRecipeOrTipInputSchema = z.object({
  query: z.string().describe('The user query for a recipe or nutritional tip.'),
});

export type GenerateRecipeOrTipInput = z.infer<typeof GenerateRecipeOrTipInputSchema>;

const GenerateRecipeOrTipOutputSchema = z.object({
  title: z.string().describe('The title of the generated recipe or nutritional tip.'),
  content: z.string().describe('The generated recipe or nutritional tip content.'),
  isRecipe: z.boolean().describe('Whether the generated content is a recipe or a nutritional tip.'),
  ingredients: z.string().optional().describe('A list of the ingredients required for the recipe, if applicable.'),
  instructions: z.string().optional().describe('The step by step instructions if the content is a recipe.'),
  nutritionalInformation: z.string().optional().describe('Nutritional information about the recipe or tip, if available.'),
});

export type GenerateRecipeOrTipOutput = z.infer<typeof GenerateRecipeOrTipOutputSchema>;

export async function generateRecipeOrTip(input: GenerateRecipeOrTipInput): Promise<GenerateRecipeOrTipOutput> {
  return generateRecipeOrTipFlow(input);
}

const generateRecipeOrTipPrompt = ai.definePrompt({
  name: 'generateRecipeOrTipPrompt',
  input: {schema: GenerateRecipeOrTipInputSchema},
  output: {schema: GenerateRecipeOrTipOutputSchema},
  prompt: `Você é um nutricionista especializado em gerar receitas e dicas de nutrição.

  O usuário irá fornecer uma consulta sobre culinária saudável ou dúvidas sobre nutrição. Gere uma receita relevante ou uma dica nutricional pertinente à consulta do usuário.

  Gere a resposta em português do Brasil.

  Se a resposta for uma receita, inclua os ingredientes e o modo de preparo. Se for uma dica nutricional, inclua um texto conciso e informativo.

  Consulta do usuário: {{{query}}}

  Formato de saída:
  {
  "title": "Título da Receita/Dica",
  "content": "Receita ou Dica",
  "isRecipe": true/false,
  "ingredients": "Lista de ingredientes (apenas para receitas)",
  "instructions": "Modo de preparo (apenas para receitas)",
  "nutritionalInformation": "Informações nutricionais (opcional)"
  }
  `,
});

const generateRecipeOrTipFlow = ai.defineFlow(
  {
    name: 'generateRecipeOrTipFlow',
    inputSchema: GenerateRecipeOrTipInputSchema,
    outputSchema: GenerateRecipeOrTipOutputSchema,
  },
  async input => {
    const {output} = await generateRecipeOrTipPrompt(input);
    return output!;
  }
);

"use client";

import type { GenerateRecipeOrTipOutput } from '@/ai/flows/generate-recipe-or-tip';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from './copy-button';
import { DownloadPdfButton } from './download-pdf-button';
import { Separator } from '@/components/ui/separator';

interface ResultsDisplayProps {
  result: GenerateRecipeOrTipOutput;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  // Prepare a single string for copy and simplified PDF generation
  let fullTextContent = `Título: ${result.title}\n\n`;

  if (result.isRecipe) {
    if (result.ingredients) {
      fullTextContent += `Ingredientes:\n${result.ingredients}\n\n`;
    }
    if (result.instructions) {
      fullTextContent += `Modo de Preparo:\n${result.instructions}\n\n`;
    }
  } else {
    fullTextContent += `Dica Nutricional:\n${result.content}\n\n`;
  }

  if (result.nutritionalInformation) {
    fullTextContent += `Informações Nutricionais:\n${result.nutritionalInformation}`;
  }
  fullTextContent = fullTextContent.trim();


  return (
    <Card className="w-full max-w-2xl shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-primary">{result.title}</CardTitle>
        {result.isRecipe && <CardDescription>Uma deliciosa receita para você!</CardDescription>}
        {!result.isRecipe && <CardDescription>Uma dica valiosa para sua saúde!</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-6 text-card-foreground">
        {result.isRecipe ? (
          <>
            {result.ingredients && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Ingredientes:</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{result.ingredients}</p>
              </div>
            )}
            {result.instructions && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Modo de Preparo:</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{result.instructions}</p>
              </div>
            )}
          </>
        ) : (
          <div>
            <h3 className="text-lg font-semibold mb-2">Dica Nutricional:</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-line">{result.content}</p>
          </div>
        )}
        {result.nutritionalInformation && (
          <>
            <Separator className="my-4" />
            <div>
              <h3 className="text-lg font-semibold mb-2">Informações Nutricionais:</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{result.nutritionalInformation}</p>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
        <CopyButton textToCopy={fullTextContent} />
        <DownloadPdfButton content={result} />
      </CardFooter>
    </Card>
  );
}

"use client";

import { useState } from 'react';
import Image from 'next/image';
import { SearchForm } from '@/components/search-form';
import { ResultsDisplay } from '@/components/results-display';
import type { GenerateRecipeOrTipOutput } from '@/ai/flows/generate-recipe-or-tip';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Utensils, AlertTriangleIcon } from "lucide-react";

export default function HomePage() {
  const [searchResult, setSearchResult] = useState<GenerateRecipeOrTipOutput | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 md:p-10 bg-background text-foreground">
      <header className="my-8 text-center max-w-3xl w-full">
        <Image 
            src="https://picsum.photos/seed/nutriai/120/120" 
            alt="Logo NutriAI Recipes"
            width={100}
            height={100}
            className="mx-auto mb-4 rounded-full shadow-lg border-2 border-primary"
            data-ai-hint="nutritionist healthy food"
            priority
        />
        <h1 className="text-3xl sm:text-4xl font-bold text-primary tracking-tight">
          Receitas e Dicas da Nutricionista Isadora Amin
        </h1>
        <p className="text-muted-foreground mt-3 text-base sm:text-lg">
          Sua fonte de inspiração para uma vida mais saudável. Busque por receitas e dicas de nutrição personalizadas.
        </p>
      </header>

      <div className="w-full max-w-xl mb-10">
        <SearchForm
          onSearchResult={(data) => {
            setSearchResult(data);
            setSearchError(null); // Clear previous errors on new result
          }}
          onSearchError={(error) => {
            setSearchError(error);
            setSearchResult(null); // Clear previous results on new error
          }}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      </div>

      {isLoading && (
         <div className="flex flex-col items-center justify-center text-muted-foreground mt-8 p-6 w-full max-w-2xl">
            <svg aria-hidden="true" className="w-10 h-10 mb-3 text-primary animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5424 39.6781 93.9676 39.0409Z" fill="hsl(var(--accent))"/>
            </svg>
            <p className="text-lg">Buscando... Aguarde um momento.</p>
         </div>
      )}

      {searchError && !isLoading && (
        <Alert variant="destructive" className="w-full max-w-2xl mb-8 animate-in fade-in-0 zoom-in-95">
          <AlertTriangleIcon className="h-5 w-5" />
          <AlertTitle>Erro na Busca</AlertTitle>
          <AlertDescription>{searchError}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !searchResult && !searchError && (
        <div className="text-center text-muted-foreground mt-8 p-8 border-2 border-dashed border-muted rounded-lg max-w-2xl w-full bg-card/50">
          <Utensils className="mx-auto mb-4 h-12 w-12 opacity-70 text-primary" strokeWidth="1.5" />
          <p className="text-xl font-medium mb-2">Pronto para descobrir algo novo?</p>
          <p className="text-sm">Digite sua busca acima para encontrar receitas deliciosas e dicas nutricionais personalizadas.</p>
        </div>
      )}
      
      {searchResult && !isLoading && (
        <div className="w-full mt-8 flex justify-center animate-in fade-in-0 zoom-in-95">
          <ResultsDisplay result={searchResult} />
        </div>
      )}
    </main>
  );
}

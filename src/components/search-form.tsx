"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Search } from 'lucide-react';
import type { GenerateRecipeOrTipOutput } from '@/ai/flows/generate-recipe-or-tip';
import { handleSearchQuery } from '@/app/actions';

const searchSchema = z.object({
  query: z.string().min(3, { message: "A busca deve ter pelo menos 3 caracteres." }),
});
type SearchFormInput = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSearchResult: (data: GenerateRecipeOrTipOutput | null) => void;
  onSearchError: (error: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  isLoading: boolean;
}

export function SearchForm({ onSearchResult, onSearchError, setIsLoading, isLoading }: SearchFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SearchFormInput>({
    resolver: zodResolver(searchSchema),
  });

  const onSubmit: SubmitHandler<SearchFormInput> = async (data) => {
    setIsLoading(true);
    onSearchResult(null);
    onSearchError(null);
    
    const result = await handleSearchQuery(data.query);

    if (result.data) {
      onSearchResult(result.data);
    } else if (result.error) {
      onSearchError(result.error);
    } else {
      // This case should ideally not be reached if the server action always returns data or error.
      onSearchError("Ocorreu um erro desconhecido ao processar sua busca.");
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-2">
      <div className="flex flex-col sm:flex-row gap-2 items-start">
        <div className="flex-grow w-full sm:w-auto space-y-1">
            <Input
              type="text"
              placeholder="Buscar receitas ou dicas de nutrição..."
              {...register("query")}
              className={`w-full ${errors.query ? 'border-destructive focus-visible:ring-destructive' : ''}`}
              aria-invalid={errors.query ? "true" : "false"}
              aria-label="Campo de busca por receitas e dicas"
            />
            {errors.query && <p className="text-sm text-destructive px-1">{errors.query.message}</p>}
        </div>
        <Button 
            type="submit" 
            disabled={isLoading} 
            className="bg-accent hover:bg-accent/90 text-accent-foreground shrink-0 h-10 w-full sm:w-auto"
            aria-label="Buscar"
        >
          {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
          <span className="ml-2">Buscar</span>
        </Button>
      </div>
    </form>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ClipboardType } from "lucide-react"; // Changed from ClipboardText

interface CopyButtonProps {
  textToCopy: string;
}

export function CopyButton({ textToCopy }: CopyButtonProps) {
  const { toast } = useToast();

  const handleCopy = async () => {
    if (!navigator.clipboard) {
      toast({
        title: "Navegador não suportado",
        description: "A funcionalidade de copiar não é suportada pelo seu navegador.",
        variant: "destructive",
      });
      return;
    }
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast({
        title: "Copiado!",
        description: "O conteúdo foi copiado para a área de transferência.",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Não foi possível copiar o conteúdo. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button variant="outline" onClick={handleCopy} aria-label="Copiar texto">
      <ClipboardType className="mr-2 h-4 w-4" />
      Copiar
    </Button>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { FileDown } from "lucide-react";
import jsPDF from 'jspdf';
import type { GenerateRecipeOrTipOutput } from '@/ai/flows/generate-recipe-or-tip';

interface DownloadPdfButtonProps {
  content: GenerateRecipeOrTipOutput;
}

export function DownloadPdfButton({ content }: DownloadPdfButtonProps) {
  const { toast } = useToast();

  const handleDownload = () => {
    try {
      const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
      });
      
      // It's good practice to embed a font that supports all characters.
      // jsPDF's standard fonts might not support all pt-BR characters perfectly.
      // For this example, we'll proceed with standard fonts.
      // Example: doc.setFont("Helvetica", "sans-serif"); // jsPDF uses helvetica by default
      // For full UTF-8, you'd typically add a font file (e.g., .ttf)
      // and use doc.addFileToVFS and doc.addFont.

      const pageHeight = doc.internal.pageSize.height;
      const pageWidth = doc.internal.pageSize.width;
      let yPosition = 20;
      const margin = 15;
      const lineHeight = 7; // Approximate line height in mm for 12pt font
      const availableWidth = pageWidth - 2 * margin;

      const addTextWithWrap = (text: string, x: number, currentY: number, options?: any): number => {
        let localY = currentY;
        if (localY > pageHeight - margin - lineHeight) { // Check if new page is needed
          doc.addPage();
          localY = margin;
        }
        const lines = doc.splitTextToSize(text, availableWidth);
        doc.text(lines, x, localY, options);
        return localY + (lines.length * lineHeight);
      };
      
      doc.setFontSize(18);
      yPosition = addTextWithWrap(content.title, margin, yPosition);
      yPosition += lineHeight; 

      doc.setFontSize(12);

      if (content.isRecipe) {
        if (content.ingredients) {
          doc.setFont(undefined, 'bold');
          yPosition = addTextWithWrap("Ingredientes:", margin, yPosition);
          doc.setFont(undefined, 'normal');
          yPosition = addTextWithWrap(content.ingredients, margin, yPosition);
          yPosition += lineHeight / 2;
        }
        if (content.instructions) {
          doc.setFont(undefined, 'bold');
          yPosition = addTextWithWrap("Modo de Preparo:", margin, yPosition);
          doc.setFont(undefined, 'normal');
          yPosition = addTextWithWrap(content.instructions, margin, yPosition);
          yPosition += lineHeight / 2;
        }
      } else {
        doc.setFont(undefined, 'bold');
        yPosition = addTextWithWrap("Dica Nutricional:", margin, yPosition);
        doc.setFont(undefined, 'normal');
        yPosition = addTextWithWrap(content.content, margin, yPosition);
        yPosition += lineHeight / 2;
      }

      if (content.nutritionalInformation) {
        doc.setFont(undefined, 'bold');
        yPosition = addTextWithWrap("Informações Nutricionais:", margin, yPosition);
        doc.setFont(undefined, 'normal');
        addTextWithWrap(content.nutritionalInformation, margin, yPosition);
      }
      
      doc.save(`${content.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`);
      toast({
        title: "Download Iniciado",
        description: "O PDF está sendo preparado para download.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Failed to generate PDF: ", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Não foi possível gerar o PDF. Tente novamente.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <Button 
        variant="outline" 
        onClick={handleDownload} 
        className="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        aria-label="Baixar conteúdo em PDF"
    >
      <FileDown className="mr-2 h-4 w-4" />
      Baixar PDF
    </Button>
  );
}

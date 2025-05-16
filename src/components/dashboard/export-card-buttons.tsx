
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, Image, FilePdf, Save } from "lucide-react";
import { toast } from "sonner";

interface ExportCardButtonsProps {
  cardId: string;
  title?: string;
}

export function ExportCardButtons({ cardId, title = "Insight" }: ExportCardButtonsProps) {
  const downloadAsJPEG = async () => {
    const element = document.getElementById(cardId);
    if (!element) {
      toast.error("Could not find the card to export");
      return;
    }

    try {
      toast.info("Preparing JPEG export...");
      
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2, // Higher scale for better quality
      });
      
      const dataUrl = canvas.toDataURL("image/jpeg", 1.0);
      const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.jpg`;
      
      // Create download link
      const link = document.createElement("a");
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("JPEG downloaded successfully");
    } catch (error) {
      console.error("Error generating JPEG:", error);
      toast.error("Failed to export as JPEG");
    }
  };

  const downloadAsPDF = async () => {
    const element = document.getElementById(cardId);
    if (!element) {
      toast.error("Could not find the card to export");
      return;
    }

    try {
      toast.info("Preparing PDF export...");
      
      const canvas = await html2canvas(element, {
        backgroundColor: "#1e1e1e", // Dark background to match theme
        scale: 2, // Higher scale for better quality
      });
      
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
      });
      
      // Calculate dimensions to fit the image properly in the PDF
      const imgWidth = 280;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, "JPEG", 10, 10, imgWidth, imgHeight);
      
      const fileName = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().slice(0, 10)}.pdf`;
      pdf.save(fileName);
      
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to export as PDF");
    }
  };

  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 bg-transparent border-gray-700 hover:bg-gray-800"
        onClick={downloadAsJPEG}
        title="Download as JPEG"
      >
        <Image className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:inline-block">JPEG</span>
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1 bg-transparent border-gray-700 hover:bg-gray-800"
        onClick={downloadAsPDF}
        title="Download as PDF"
      >
        <FilePdf className="h-4 w-4" />
        <span className="sr-only md:not-sr-only md:inline-block">PDF</span>
      </Button>
    </div>
  );
}

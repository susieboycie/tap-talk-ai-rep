
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Function to get PDF files from public directory
const getPdfFiles = async () => {
  try {
    // This assumes your PDFs are in the public directory
    const response = await fetch('/api/pdfs');
    const files = await response.json();
    return files.map((file: string) => ({
      id: file.replace('.pdf', ''),
      label: file.replace('.pdf', '').split('-').join(' '),
      path: `/${file}`
    }));
  } catch (error) {
    console.error('Error fetching PDF files:', error);
    return [];
  }
};

export function DocumentViewer() {
  const [documents, setDocuments] = useState<Array<{ id: string; label: string; path: string }>>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>('');

  useEffect(() => {
    const loadDocuments = async () => {
      const pdfFiles = await getPdfFiles();
      setDocuments(pdfFiles);
      if (pdfFiles.length > 0) {
        setSelectedDoc(pdfFiles[0].path);
      }
    };

    loadDocuments();
  }, []);

  return (
    <Card className="w-full bg-repgpt-700 border-repgpt-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          📄 View Support Documents
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={selectedDoc}
          onValueChange={setSelectedDoc}
        >
          <SelectTrigger className="w-full border-repgpt-600 bg-repgpt-700 text-white">
            <SelectValue placeholder="Choose document" />
          </SelectTrigger>
          <SelectContent className="border-repgpt-600 bg-repgpt-700 text-white">
            {documents.map((doc) => (
              <SelectItem key={doc.id} value={doc.path}>
                {doc.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="w-full h-[600px] rounded-lg overflow-hidden border border-repgpt-600 bg-repgpt-800">
          {selectedDoc && (
            <iframe
              src={selectedDoc}
              className="w-full h-full"
              title="Document Viewer"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

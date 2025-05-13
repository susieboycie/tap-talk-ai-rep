
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, FileText, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NotesAndActionsProps {
  outletName: string | null;
  onStartAIChat: (prompt: string) => void;
}

export function NotesAndActions({ outletName, onStartAIChat }: NotesAndActionsProps) {
  const [notes, setNotes] = useState<string>("");
  const [emailDraft, setEmailDraft] = useState<string>("");
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const { toast } = useToast();

  // Function to save notes
  const handleSaveNotes = () => {
    if (!notes.trim()) {
      toast({
        title: "Error",
        description: "Notes cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would save to a database
    // For now, we'll just show a toast notification
    toast({
      title: "Notes Saved",
      description: "Your notes have been saved successfully",
    });
  };

  // Function to generate email using RepGPT
  const handleGenerateEmail = () => {
    if (!outletName) {
      toast({
        title: "Error",
        description: "Please select an outlet first",
        variant: "destructive",
      });
      return;
    }

    let prompt = "";
    
    if (notes.trim()) {
      prompt = `Based on these visit notes: "${notes}", please help me draft a follow-up email to ${outletName} that summarizes my visit and outlines next steps. The email should be professional but friendly and highlight any important points from my notes.`;
    } else {
      prompt = `Please help me draft a follow-up email to ${outletName} after my visit. The email should be professional but friendly and include a thank you for their time, a brief summary of what we discussed, and suggest next steps for our partnership.`;
    }

    onStartAIChat(prompt);
  };

  return (
    <Card className="border-repgpt-700 bg-repgpt-800 mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-white flex items-center">
          <FileText className="mr-2 h-5 w-5" />
          Notes & Actions
          {outletName && <span className="text-gray-400 text-sm ml-2">for {outletName}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="notes" className="border-repgpt-700">
            <AccordionTrigger className="text-white hover:text-repgpt-400 py-2">
              <div className="flex items-center">
                <Pencil className="mr-2 h-4 w-4" />
                Visit Notes
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <Textarea 
                  placeholder="Enter notes from your visit..."
                  className="bg-repgpt-700 border-repgpt-600 text-white min-h-[120px] resize-none"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSaveNotes} 
                    className="bg-repgpt-400 hover:bg-repgpt-500 text-white"
                  >
                    Save Notes
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="email" className="border-repgpt-700">
            <AccordionTrigger className="text-white hover:text-repgpt-400 py-2">
              <div className="flex items-center">
                <MessageSquare className="mr-2 h-4 w-4" />
                AI Email Assistant
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <p className="text-gray-300 text-sm">
                  Let RepGPT help you draft a professional follow-up email based on your visit notes. 
                  The AI assistant will analyze your notes and create a tailored email for {outletName || "this outlet"}.
                </p>
                <div className="flex justify-end">
                  <Button 
                    onClick={handleGenerateEmail} 
                    className="bg-repgpt-400 hover:bg-repgpt-500 text-white"
                    disabled={isGeneratingEmail}
                  >
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Generate Email with RepGPT
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}

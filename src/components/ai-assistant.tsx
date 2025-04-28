
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";
import { usePersonaDetails } from "@/hooks/use-persona-details";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOutlet?: string | null;
  selectedPersona?: string | null;
  initialMessage?: string | null;
}

export function AIAssistant({ 
  isOpen, 
  onClose, 
  selectedOutlet = null, 
  selectedPersona = null,
  initialMessage = null
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { personaDetails } = usePersonaDetails(
    selectedOutlet && !selectedPersona ? selectedOutlet : null
  );

  const effectivePersona = selectedPersona || (personaDetails?.name || null);

  useEffect(() => {
    const greeting = "I am RepGPT - your personalised AI driven sales assistant! I can help by providing you with relevant Outlet specific insights, tailored talking points for activation plans, and smart suggestions that help you make every conversation count.";
    
    setMessages([{ role: "assistant", content: greeting }]);
    
    if (initialMessage) {
      setTimeout(() => {
        handleUserMessage(initialMessage);
      }, 500);
    }
  }, [selectedOutlet, effectivePersona, initialMessage, personaDetails]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleUserMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: message }]);
    setInput("");
    setIsLoading(true);

    try {
      const outletContext = selectedOutlet ? 
        `Current outlet: ${selectedOutlet}. ${personaDetails?.goals ? `Their goals: ${personaDetails.goals}.` : ''} ${personaDetails?.pain_points ? `Their pain points: ${personaDetails.pain_points}.` : ''}` : 
        null;

      const personaContext = effectivePersona ? 
        `The outlet corresponds to a "${effectivePersona}" persona type.` : 
        null;

      const { data, error } = await supabase.functions.invoke('chat-with-repgpt', {
        body: {
          message,
          outletContext,
          personaContext
        }
      });

      if (error) {
        console.error('Error calling RepGPT function:', error);
        throw new Error(`Error calling RepGPT: ${error.message}`);
      }

      if (data?.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error('No reply received from RepGPT');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Communication Error",
        description: "There was a problem connecting to RepGPT. Please try again later.",
        variant: "destructive"
      });
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I apologize, but I'm having trouble connecting to my knowledge base at the moment. Please try again in a few moments." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="border border-repgpt-700 bg-repgpt-800 shadow-lg">
        <CardHeader className="bg-repgpt-700 flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            RepGPT Assistant {selectedOutlet && `| ${selectedOutlet}`}
            {effectivePersona && ` | ${effectivePersona}`}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-repgpt-600">
            ×
          </Button>
        </CardHeader>
        <CardContent className="p-4 h-80 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user"
                      ? "bg-repgpt-400 text-white"
                      : "bg-repgpt-700 text-white"
                  }`}
                >
                  {message.content.split('\n').map((line, i) => (
                    <div key={i}>{line || <br />}</div>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-repgpt-700 text-white rounded-lg px-4 py-2">
                  Thinking...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardFooter className="border-t border-repgpt-700 p-4">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Ask RepGPT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && !isLoading && handleUserMessage(input)}
              className="flex-1 border-repgpt-600 bg-repgpt-700 text-white"
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={() => handleUserMessage(input)}
              className="bg-repgpt-400 hover:bg-repgpt-500"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

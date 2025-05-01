
import { useState, useRef, useEffect } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOutlet } from "@/contexts/outlet-context";
import { usePersonaDetails } from "@/hooks/use-persona-details";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AskRepGPT = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { selectedOutlet } = useOutlet();
  const { personaDetails } = usePersonaDetails(selectedOutlet);

  // Add initial assistant message when component loads
  useEffect(() => {
    const welcomeMessage = "Hello! I am RepGPT - your personalised AI driven sales assistant! How can I help you today?";
    setMessages([{ role: "assistant", content: welcomeMessage }]);
  }, []);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: "user", content: input }]);
    const userMessage = input;
    setInput("");
    setIsLoading(true);

    try {
      const outletContext = selectedOutlet ? 
        `Current outlet: ${selectedOutlet}. ${personaDetails?.goals ? `Their goals: ${personaDetails.goals}.` : ''} ${personaDetails?.pain_points ? `Their pain points: ${personaDetails.pain_points}.` : ''}` : 
        null;

      const personaContext = personaDetails ? 
        `The outlet corresponds to a "${personaDetails.name}" persona type.` : 
        null;

      const { data, error } = await supabase.functions.invoke('chat-with-repgpt', {
        body: {
          message: userMessage,
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <DashboardShell>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
              <MessageSquare className="mr-2 h-8 w-8 text-repgpt-400" />
              Ask RepGPT
            </h1>
            <p className="text-gray-400">
              Your AI-powered sales assistant with personalized insights and recommendations
            </p>
          </div>
        </div>

        {/* Chat messages area */}
        <div className="flex-1 overflow-y-auto mb-4 bg-repgpt-900/50 rounded-lg border border-repgpt-700 p-4">
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
        </div>

        {/* Input area */}
        <div className="border-t border-repgpt-700 pt-4">
          <div className="flex gap-3">
            <Textarea
              placeholder="Ask RepGPT..."
              className="flex-1 h-16 resize-none border-repgpt-600 bg-repgpt-700/50 text-white"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading}
            />
            <Button
              className="self-end bg-repgpt-400 hover:bg-repgpt-500"
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Context information */}
        {selectedOutlet && personaDetails && (
          <Card className="mt-4 bg-repgpt-800 border-repgpt-700">
            <CardContent className="pt-4">
              <div className="flex flex-wrap gap-2 text-xs text-gray-400">
                <div className="flex items-center">
                  <span className="font-semibold">Current outlet:</span>
                  <span className="ml-1">{selectedOutlet}</span>
                </div>
                <Separator orientation="vertical" className="h-4 bg-repgpt-600" />
                <div className="flex items-center">
                  <span className="font-semibold">Persona:</span>
                  <span className="ml-1">{personaDetails.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
};

export default AskRepGPT;

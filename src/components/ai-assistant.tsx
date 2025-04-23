
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send } from "lucide-react";

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

  // Initialize with context-aware greeting when the outlet or persona changes
  useEffect(() => {
    let greeting = "Hello! I'm your RepGPT AI assistant. How can I help you with your sales activities today?";
    
    if (selectedOutlet) {
      greeting = `Hello! I'm your RepGPT AI assistant for ${selectedOutlet}. How can I help you today?`;
      
      if (selectedPersona) {
        greeting += ` I see you're working with a ${selectedPersona.toLowerCase()} style outlet.`;
      }
    }
    
    setMessages([{ role: "assistant", content: greeting }]);
    
    // If there's an initial message, simulate the user sending it
    if (initialMessage) {
      setTimeout(() => {
        handleUserMessage(initialMessage);
      }, 500);
    }
  }, [selectedOutlet, selectedPersona, initialMessage]);

  const handleUserMessage = (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      let response = "I'm processing your request...";
      
      // Context-aware responses
      if (selectedOutlet) {
        if (message.toLowerCase().includes("volume") || message.toLowerCase().includes("contract")) {
          response = `Based on ${selectedOutlet}'s data, I can help with volume forecasting. Would you like to see their current contract status or simulate new volume targets?`;
        } else if (message.toLowerCase().includes("tap") || message.toLowerCase().includes("draught")) {
          response = `${selectedOutlet} currently has 8 taps, with 3 Diageo products installed. Would you like to see detailed tap usage stats or opportunities for new installations?`;
        } else if (message.toLowerCase().includes("pitch") || message.toLowerCase().includes("sell")) {
          response = `For ${selectedOutlet}, I recommend focusing on seasonal promotions based on their recent sales trends. Their top 3 sellers are Guinness, Smirnoff, and Captain Morgan.`;
        } else {
          response = `I understand you're asking about ${message} for ${selectedOutlet}. How can I provide more specific assistance?`;
        }
        
        // Persona-specific adjustments
        if (selectedPersona === "The Entrepreneur") {
          response += " Since they're entrepreneurial, emphasizing innovation and growth opportunities would resonate well.";
        } else if (selectedPersona === "The Loyalist") {
          response += " As a loyal partner, highlighting relationship value and consistency in your approach would be effective.";
        }
      } else {
        if (message.toLowerCase().includes("volume scenarios")) {
          response = "I've pulled up the volume scenarios. Would you like to see the impact of a 10% increase in keg volume or explore different discount options?";
        } else if (message.toLowerCase().includes("tap")) {
          response = "The current tap utilization across your accounts is at 80%. There are several venues with taps available for new products. Would you like to see specific recommendations?";
        } else if (message.toLowerCase().includes("trade terms")) {
          response = "I've found several active trade terms agreements ending in the next 45 days. Would you like me to prepare renewal options?";
        } else {
          response = `I understand you're asking about ${message}. How can I assist further with this?`;
        }
      }

      // Add follow-up suggestions
      response += "\n\nWould you also like to know about:";
      response += "\n- Recent sales trends";
      response += "\n- Competing products in this outlet";
      response += "\n- Upcoming promotional opportunities";

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 1000);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    handleUserMessage(input);
    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="border border-repgpt-700 bg-repgpt-800 shadow-lg">
        <CardHeader className="bg-repgpt-700 flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            RepGPT Assistant {selectedOutlet && `| ${selectedOutlet}`}
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
          </div>
        </CardContent>
        <CardFooter className="border-t border-repgpt-700 p-4">
          <div className="flex w-full gap-2">
            <Input
              placeholder="Ask RepGPT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              className="flex-1 border-repgpt-600 bg-repgpt-700 text-white"
            />
            <Button size="icon" onClick={handleSend} className="bg-repgpt-400 hover:bg-repgpt-500">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

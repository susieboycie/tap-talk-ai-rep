
import { useState } from "react";
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
}

export function AIAssistant({ isOpen, onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your RepGPT AI assistant. How can I help you with your sales activities today?"
    }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [
      ...prev,
      { role: "user", content: input }
    ]);

    // Simulate AI response
    setTimeout(() => {
      let response = "I'm processing your request...";

      if (input.toLowerCase().includes("volume scenarios")) {
        response = "I've pulled up the volume scenarios for this customer. Would you like to see the impact of a 10% increase in keg volume or explore different discount options?";
      } else if (input.toLowerCase().includes("tap")) {
        response = "The current tap utilization for this venue is at 80%. There are 2 taps available for new products. Would you like to see recommended products for these taps?";
      } else if (input.toLowerCase().includes("trade terms")) {
        response = "I've found the current trade terms for this customer. They have a volume rebate agreement ending in 45 days. Would you like me to prepare renewal options?";
      } else {
        response = "I understand you're asking about " + input + ". How can I assist further with this?";
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response }
      ]);
    }, 1000);

    setInput("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-96 z-50">
      <Card className="border border-repgpt-700 bg-repgpt-800 shadow-lg">
        <CardHeader className="bg-repgpt-700 flex flex-row items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <MessageSquare className="mr-2 h-5 w-5" />
            RepGPT Assistant
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
                  {message.content}
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


import { useState, useRef, useEffect } from "react";
import { DashboardShell } from "@/components/ui/dashboard-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, UserCircle, Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOutlet } from "@/contexts/outlet-context";
import { usePersonaDetails } from "@/hooks/use-persona-details";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ConversationStartersGrid } from "@/components/dashboard/conversation-starters-grid";
import { AIMessage } from "@/components/repgpt/ai-message";
import { UserMessage } from "@/components/repgpt/user-message";
import { ChatHeader } from "@/components/repgpt/chat-header";
import { ChatInput } from "@/components/repgpt/chat-input";
import { ChatEmptyState } from "@/components/repgpt/chat-empty-state";
import { ChatContext } from "@/components/repgpt/chat-context";

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
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const welcomeMessage = "Hello! I am RepGPT - your personalised AI driven sales assistant! How can I help you today?";
    setMessages([{ role: "assistant", content: welcomeMessage }]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
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

  const handleConversationStart = (prompt: string) => {
    setInput(prompt);
    // Auto-focus the input field after setting the prompt
    if (document.getElementById('chat-input')) {
      (document.getElementById('chat-input') as HTMLTextAreaElement).focus();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <DashboardShell>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <ChatHeader selectedOutlet={selectedOutlet} personaName={personaDetails?.name} />
        
        <div className="flex flex-1 gap-4 overflow-hidden">
          {/* Chat Container */}
          <Card className="flex-1 flex flex-col bg-repgpt-900/50 border-repgpt-700 overflow-hidden">
            <CardContent className="p-0 flex flex-col flex-1">
              {/* Chat Messages Area */}
              <div 
                className="flex-1 overflow-y-auto p-3 space-y-3"
                ref={chatContainerRef}
              >
                {!hasMessages && <ChatEmptyState />}
                
                {messages.map((message, index) => (
                  message.role === "user" ? (
                    <UserMessage key={index} content={message.content} />
                  ) : (
                    <AIMessage key={index} content={message.content} />
                  )
                ))}
                
                {isLoading && (
                  <div className="flex items-center gap-2 animate-pulse pl-2 text-gray-400 text-sm">
                    <Bot className="h-4 w-4 text-repgpt-400" />
                    <span>Thinking...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Chat Input */}
              <ChatInput 
                value={input}
                onChange={setInput}
                onSend={handleSendMessage}
                onKeyPress={handleKeyPress}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
          
          {/* Sidebar */}
          <div className="w-80 flex flex-col gap-4 hidden lg:flex">
            {/* Conversation Starters */}
            <Card className="bg-repgpt-800 border-repgpt-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-lg">Conversation Starters</CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="grid grid-cols-1 gap-4">
                  <ConversationStartersGrid
                    selectedOutlet={selectedOutlet}
                    onConversationStart={handleConversationStart}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Context Information */}
            {selectedOutlet && personaDetails && (
              <ChatContext 
                outletName={selectedOutlet} 
                personaDetails={personaDetails} 
              />
            )}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default AskRepGPT;

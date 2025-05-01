
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
}

export function ChatInput({ value, onChange, onSend, onKeyPress, isLoading }: ChatInputProps) {
  return (
    <div className="border-t border-repgpt-700 p-4 bg-repgpt-800/50">
      <div className="flex gap-3">
        <Textarea
          id="chat-input"
          placeholder="Ask RepGPT..."
          className="flex-1 h-16 resize-none border-repgpt-600 bg-repgpt-700/50 text-white focus:border-repgpt-400 focus:ring-repgpt-400/20"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyPress}
          disabled={isLoading}
        />
        <Button
          className="self-end bg-repgpt-400 hover:bg-repgpt-500 transition-colors"
          size="icon"
          onClick={onSend}
          disabled={isLoading || !value.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

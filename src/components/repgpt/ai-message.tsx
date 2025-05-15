
import { Bot, Copy, CheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface AIMessageProps {
  content: string;
}

export function AIMessage({ content }: AIMessageProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setHasCopied(true);
      
      toast({
        title: "Copied!",
        description: "Response copied to clipboard",
      });
      
      // Reset copy confirmation icon after 2 seconds
      setTimeout(() => {
        setHasCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-start gap-2 group relative">
      <div className="w-6 h-6 bg-repgpt-700 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-repgpt-400" />
      </div>
      <div className="bg-repgpt-700 text-white rounded-lg px-3 py-2 max-w-[80%] text-sm relative">
        {content.split('\n').map((line, i) => (
          <div key={i}>{line || <br />}</div>
        ))}
        
        <button
          onClick={copyToClipboard}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-repgpt-600 hover:bg-repgpt-500 rounded"
          title="Copy to clipboard"
        >
          {hasCopied ? (
            <CheckCheck className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-repgpt-400" />
          )}
        </button>
      </div>
    </div>
  );
}

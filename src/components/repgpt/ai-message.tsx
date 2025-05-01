
import { Bot } from "lucide-react";

interface AIMessageProps {
  content: string;
}

export function AIMessage({ content }: AIMessageProps) {
  return (
    <div className="flex items-start gap-2">
      <div className="w-6 h-6 bg-repgpt-700 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-4 w-4 text-repgpt-400" />
      </div>
      <div className="bg-repgpt-700 text-white rounded-lg px-3 py-2 max-w-[80%] text-sm">
        {content.split('\n').map((line, i) => (
          <div key={i}>{line || <br />}</div>
        ))}
      </div>
    </div>
  );
}

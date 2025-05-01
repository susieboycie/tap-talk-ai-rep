
import { Bot } from "lucide-react";

interface AIMessageProps {
  content: string;
}

export function AIMessage({ content }: AIMessageProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 bg-repgpt-700 rounded-full flex items-center justify-center flex-shrink-0">
        <Bot className="h-6 w-6 text-repgpt-400" />
      </div>
      <div className="bg-repgpt-700 text-white rounded-lg px-4 py-2 max-w-[80%]">
        {content.split('\n').map((line, i) => (
          <div key={i}>{line || <br />}</div>
        ))}
      </div>
    </div>
  );
}


import { UserCircle } from "lucide-react";

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  return (
    <div className="flex items-start justify-end gap-3">
      <div className="bg-repgpt-400 text-white rounded-lg px-4 py-2 max-w-[80%]">
        {content.split('\n').map((line, i) => (
          <div key={i}>{line || <br />}</div>
        ))}
      </div>
      <div className="w-8 h-8 bg-repgpt-400 rounded-full flex items-center justify-center flex-shrink-0">
        <UserCircle className="h-6 w-6 text-white" />
      </div>
    </div>
  );
}

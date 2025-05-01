
import { MessageCircle } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="w-12 h-12 bg-repgpt-700/50 rounded-full flex items-center justify-center mb-3">
        <MessageCircle className="h-6 w-6 text-repgpt-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-1">Start a conversation with RepGPT</h3>
      <p className="text-gray-400 max-w-md text-sm">
        Ask questions about your outlets, get personalized insights, or select from the conversation starters to begin.
      </p>
    </div>
  );
}

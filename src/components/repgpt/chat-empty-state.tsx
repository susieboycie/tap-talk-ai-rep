
import { MessageCircle } from "lucide-react";

export function ChatEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-6">
      <div className="w-16 h-16 bg-repgpt-700/50 rounded-full flex items-center justify-center mb-4">
        <MessageCircle className="h-8 w-8 text-repgpt-400" />
      </div>
      <h3 className="text-xl font-medium text-white mb-2">Start a conversation with RepGPT</h3>
      <p className="text-gray-400 max-w-md">
        Ask questions about your outlets, get personalized insights, or select from the conversation starters to begin.
      </p>
    </div>
  );
}

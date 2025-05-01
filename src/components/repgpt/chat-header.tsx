
import { MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ChatHeaderProps {
  selectedOutlet: string | null;
  personaName?: string | null;
}

export function ChatHeader({ selectedOutlet, personaName }: ChatHeaderProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center">
            <MessageCircle className="mr-2 h-8 w-8 text-repgpt-400" />
            Ask RepGPT
          </h1>
          <p className="text-gray-400">
            Your AI-powered sales assistant with personalized insights and recommendations
          </p>
        </div>
      </div>
      
      {selectedOutlet && (
        <Card className="mt-4 bg-repgpt-800 border-repgpt-700">
          <CardContent className="py-2 px-4 flex items-center text-sm">
            <div className="flex flex-wrap gap-2 text-gray-300">
              <span>Currently analyzing:</span>
              <span className="font-medium text-white">{selectedOutlet}</span>
              {personaName && (
                <>
                  <span className="text-repgpt-400">•</span>
                  <span className="font-medium text-repgpt-300">{personaName}</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

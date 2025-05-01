
import { ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface ConversationStarterProps {
  icon: ReactNode;
  title: string;
  description: string;
  examples: string[];
  color: string;
  onClick: (example: string) => void;
}

export function ConversationStarter({
  icon,
  title,
  description,
  examples,
  color,
  onClick
}: ConversationStarterProps) {
  const location = useLocation();
  const isAskRepGPTPage = location.pathname === "/ask-repgpt";
  
  // Compact version for AskRepGPT page
  if (isAskRepGPTPage) {
    return (
      <div className={`rounded-lg bg-repgpt-800 border ${color} p-3 flex flex-col h-full`}>
        <div className="flex items-center gap-1 mb-1">
          {icon}
          <h3 className="text-sm font-semibold text-white">{title}</h3>
        </div>
        <div className="flex flex-col gap-1 mt-1">
          {examples.map((example, i) => (
            <Button 
              key={i}
              variant="ghost" 
              size="sm"
              className="justify-start text-left text-xs text-gray-300 hover:text-white hover:bg-repgpt-700 truncate h-7 px-2 py-1"
              onClick={() => onClick(example)}
            >
              "{example}"
            </Button>
          ))}
        </div>
      </div>
    );
  }
  
  // Original version for other pages
  return (
    <div className={`rounded-lg bg-repgpt-800 border-2 ${color} p-4 flex flex-col h-full`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm text-gray-300 mb-4">{description}</p>
      <div className="flex flex-col gap-2 mt-auto">
        {examples.map((example, i) => (
          <Button 
            key={i}
            variant="ghost" 
            className="justify-start text-left text-xs text-gray-300 hover:text-white hover:bg-repgpt-700 truncate"
            onClick={() => onClick(example)}
          >
            "{example}"
          </Button>
        ))}
      </div>
    </div>
  );
}

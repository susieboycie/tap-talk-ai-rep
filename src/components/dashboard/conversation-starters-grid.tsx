import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface ConversationStarterProps {
  icon: string;
  title: string;
  description: string;
  active: boolean;
  onClick: () => void;
}

function ConversationStarter({ icon, title, description, active, onClick }: ConversationStarterProps) {
  const IconComponent = icon === "ClipboardList" ? "ClipboardList" : "default"; // Replace "default" with a fallback icon if needed

  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start p-4 rounded-lg border ${
        active ? "border-primary bg-primary/10" : "border-muted"
      } hover:bg-accent hover:border-accent transition-colors`}
    >
      <div className="mb-2">
        {IconComponent === "ClipboardList" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <rect width="8" height="6" x="2" y="2" rx="1" ry="1" />
            <path d="M2 10h8" />
            <rect width="8" height="6" x="2" y="14" rx="1" ry="1" />
            <path d="M14 4v16" />
            <path d="M18 7h-4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
        )}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </button>
  );
}

export default function ConversationStartersGrid() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  // Update with new path check
  const isNotesToActionsPage = currentPath === "/notes-to-actions";
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <ConversationStarter
        icon="Circle"
        title="Overview"
        description="Get a high-level overview of your account"
        active={currentPath === "/"}
        onClick={() => navigate('/')}
      />
      
      <ConversationStarter
        icon="Circle"
        title="Activations"
        description="View and manage your activations"
        active={currentPath === "/activations"}
        onClick={() => navigate('/activations')}
      />

      <ConversationStarter
        icon="Circle"
        title="Insights"
        description="Explore insights and analytics"
        active={currentPath === "/insights"}
        onClick={() => navigate('/insights')}
      />

      <ConversationStarter
        icon="Circle"
        title="Partnerships"
        description="Manage your partnerships"
        active={currentPath === "/partnerships"}
        onClick={() => navigate('/partnerships')}
      />

      <ConversationStarter
        icon="Circle"
        title="Quality"
        description="Assess the quality of your products"
        active={currentPath === "/quality"}
        onClick={() => navigate('/quality')}
      />

      <ConversationStarter
        icon="Circle"
        title="Trade Terms"
        description="Manage trade terms"
        active={currentPath === "/trade-terms"}
        onClick={() => navigate('/trade-terms')}
      />

      <ConversationStarter
        icon="Circle"
        title="Ask RepGPT"
        description="Get answers from RepGPT"
        active={currentPath === "/ask-repgpt"}
        onClick={() => navigate('/ask-repgpt')}
      />
      
      <ConversationStarter
        icon="ClipboardList"
        title="Notes to Actions"
        description="Convert your notes into actionable tasks"
        active={isNotesToActionsPage}
        onClick={() => navigate('/notes-to-actions')}
      />
    </div>
  );
}

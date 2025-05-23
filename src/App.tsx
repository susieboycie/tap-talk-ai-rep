
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { OutletProvider } from "@/contexts/outlet-context";
import { RepProvider } from "@/contexts/rep-context";
import { AppLayout } from "@/components/layout/app-layout";
import { ProtectedRoute } from "@/components/protected-route";

import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Activations from "./pages/Activations";
import Insights from "./pages/Insights";
import Partnerships from "./pages/Partnerships";
import Quality from "./pages/Quality";
import NotFound from "./pages/NotFound";
import TradeTerms from "./pages/TradeTerms";
import AskRepGPT from "./pages/AskRepGPT";
import NotesToActions from "./pages/NotesToActions";
import Actions from "./pages/Actions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <OutletProvider>
        <RepProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/" element={<Overview />} />
                    <Route path="/activations" element={<Activations />} />
                    <Route path="/insights" element={<Insights />} />
                    <Route path="/partnerships" element={<Partnerships />} />
                    <Route path="/quality" element={<Quality />} />
                    <Route path="/trade-terms" element={<TradeTerms />} />
                    <Route path="/ask-repgpt" element={<AskRepGPT />} />
                    <Route path="/notes-to-actions" element={<NotesToActions />} />
                    <Route path="/actions" element={<Actions />} />
                  </Route>
                </Route>
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </RepProvider>
      </OutletProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

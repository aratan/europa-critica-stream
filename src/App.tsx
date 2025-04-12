import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "@/context/WalletContext";
import Index from "./pages/Index";
import Channels from "./pages/Channels";
import NotFound from "./pages/NotFound";

// For MetaMask integration
import { useEffect } from "react";

const queryClient = new QueryClient();

const App = () => {
  // Add Web3 script for MetaMask integration
  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadWeb3();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <WalletProvider>
          <BrowserRouter basename={import.meta.env.BASE_URL || "/"}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/channels" element={<Channels />} />
              {/* Additional routes would go here */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

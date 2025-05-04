
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LanguageSelection from "./pages/LanguageSelection";
import Home from "./pages/Home";
import SiteInfo from "./pages/SiteInfo";
import Chatbot from "./pages/Chatbot";
import MapSearch from "./pages/MapSearch";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LanguageSelection />} />
          <Route path="/home" element={<Home />} />
          <Route path="/site/:id" element={<SiteInfo />} />
          <Route path="/chat/:id" element={<Chatbot />} />
          <Route path="/map" element={<MapSearch />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

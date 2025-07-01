
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Posts from "./pages/Posts";
import Calendar from "./pages/Calendar";
import Profiles from "./pages/Profiles";
import GeneralInfo from "./pages/GeneralInfo";
import Launches from "./pages/Launches";
import LaunchDetail from "./pages/LaunchDetail";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<GeneralInfo />} />
            <Route path="publicaciones" element={<Posts />} />
            <Route path="calendario" element={<Calendar />} />
            <Route path="perfiles" element={<Profiles />} />
            <Route path="lanzamientos" element={<Launches />} />
            <Route path="lanzamientos/:id" element={<LaunchDetail />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

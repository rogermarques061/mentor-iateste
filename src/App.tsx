import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PlatformProvider } from "@/contexts/PlatformContext";
import { ProductsProvider } from "@/contexts/ProductsContext";
import { AppLayout } from "@/components/layout/AppLayout";
import StudentHome from "./pages/StudentHome";
import MyCourses from "./pages/MyCourses";
import LessonPlayer from "./pages/LessonPlayer";
import Evolution from "./pages/Evolution";
import Achievements from "./pages/Achievements";
import Ranking from "./pages/Ranking";
import MentorDashboard from "./pages/MentorDashboard";
import MentorStudents from "./pages/MentorStudents";
import MentorStudentProfile from "./pages/MentorStudentProfile";
import MentorAI from "./pages/MentorAI";
import MentorContent from "./pages/MentorContent";
import MentorGamification from "./pages/MentorGamification";
import MentorReports from "./pages/MentorReports";
import MentorSettings from "./pages/MentorSettings";
import MentorProducts from "./pages/MentorProducts";
import MentorSales from "./pages/MentorSales";
import MentorFinancial from "./pages/MentorFinancial";
import MentorCheckout from "./pages/MentorCheckout";
import ProductSalesPage from "./pages/ProductSalesPage";
import CheckoutPage from "./pages/CheckoutPage";
import PurchaseSuccess from "./pages/PurchaseSuccess";
import NotFound from "./pages/NotFound";
import { CustomCursor } from "./components/effects/CustomCursor";
import { BackgroundOrbs } from "./components/effects/BackgroundOrbs";
import { WaveCanvas } from "./components/effects/WaveCanvas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <PlatformProvider>
      <ProductsProvider>
      <TooltipProvider>
        <CustomCursor />
        <BackgroundOrbs />
        <WaveCanvas />
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><StudentHome /></AppLayout>} />
            <Route path="/courses" element={<AppLayout><MyCourses /></AppLayout>} />
            <Route path="/player" element={<AppLayout><LessonPlayer /></AppLayout>} />
            <Route path="/evolution" element={<AppLayout><Evolution /></AppLayout>} />
            <Route path="/achievements" element={<AppLayout><Achievements /></AppLayout>} />
            <Route path="/ranking" element={<AppLayout><Ranking /></AppLayout>} />
            <Route path="/mentor" element={<AppLayout><MentorDashboard /></AppLayout>} />
            <Route path="/mentor/students" element={<AppLayout><MentorStudents /></AppLayout>} />
            <Route path="/mentor/students/:id" element={<AppLayout><MentorStudentProfile /></AppLayout>} />
            <Route path="/mentor/ai" element={<AppLayout><MentorAI /></AppLayout>} />
            <Route path="/mentor/content" element={<AppLayout><MentorContent /></AppLayout>} />
            <Route path="/mentor/gamification" element={<AppLayout><MentorGamification /></AppLayout>} />
            <Route path="/mentor/reports" element={<AppLayout><MentorReports /></AppLayout>} />
            <Route path="/mentor/settings" element={<AppLayout><MentorSettings /></AppLayout>} />
            <Route path="/mentor/products" element={<AppLayout><MentorProducts /></AppLayout>} />
            <Route path="/mentor/sales" element={<AppLayout><MentorSales /></AppLayout>} />
            <Route path="/mentor/financial" element={<AppLayout><MentorFinancial /></AppLayout>} />
            <Route path="/mentor/checkout" element={<AppLayout><MentorCheckout /></AppLayout>} />
            <Route path="/p/:slug" element={<ProductSalesPage />} />
            <Route path="/checkout/:slug" element={<CheckoutPage />} />
            <Route path="/obrigado/:id" element={<PurchaseSuccess />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </ProductsProvider>
    </PlatformProvider>
  </QueryClientProvider>
);

export default App;

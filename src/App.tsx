import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

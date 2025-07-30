import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import PomodoroTimer from "./components/PomodoroTimer";

const App = () => (
  <TooltipProvider>
    <Sonner />
    <PomodoroTimer />
  </TooltipProvider>
);

export default App;

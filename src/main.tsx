import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import App from "./App.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import { ThemeProvider } from "./shared/theme/ThemeProvider";
import "./index.css";
import "./shared/i18n/config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
);

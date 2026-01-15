import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import App from "./App.tsx";
import ErrorBoundary from "./ErrorBoundary.tsx";
import "./index.css";
import "./shared/i18n/config";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </MantineProvider>
  </StrictMode>,
);

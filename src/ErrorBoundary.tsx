import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Box, Title, Text, Code } from "@mantine/core";
import { Button, Card } from "./shared/components";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorBoundaryFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorBoundaryFallback = ({ error }: { error?: Error }) => {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <Card noPadding style={{ maxWidth: 512, width: "100%" }}>
        <Box
          p="xl"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <AlertTriangle
            style={{
              width: 64,
              height: 64,
              color: "var(--mantine-color-red-6)",
              marginBottom: "1rem",
            }}
          />
          <Title order={2} size="1.5rem" mb="sm">
            Something went wrong
          </Title>
          <Text c="dimmed" mb="xl">
            An unexpected error occurred. Please try reloading the page.
          </Text>

          {error && (
            <Box
              style={{
                width: "100%",
                textAlign: "left",
                background: "var(--mantine-color-gray-1)",
                padding: "1rem",
                borderRadius: 8,
                marginBottom: "1.5rem",
                overflow: "auto",
                maxHeight: 192,
              }}
            >
              <Code
                style={{
                  fontSize: "0.75rem",
                  whiteSpace: "pre-wrap",
                  color: "var(--mantine-color-red-6)",
                }}
              >
                {error.toString()}
              </Code>
            </Box>
          )}

          <Button
            variant="filled"
            onClick={() => window.location.reload()}
            leftSection={<RefreshCcw size={16} />}
          >
            Reload Page
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default ErrorBoundary;

import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

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
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg items-center gap-4 p-6 text-center sm:p-8">
        <AlertTriangle className="size-16 text-destructive" />
        <h2 className="text-2xl font-semibold text-foreground">
          Something went wrong
        </h2>
        <p className="text-muted-foreground">
          An unexpected error occurred. Please try reloading the page.
        </p>

        {error && (
          <pre className="max-h-48 w-full overflow-auto rounded-lg bg-muted p-4 text-left text-xs whitespace-pre-wrap text-destructive">
            <code>{error.toString()}</code>
          </pre>
        )}

        <Button onClick={() => window.location.reload()}>
          <RefreshCcw className="size-4" />
          Reload Page
        </Button>
      </Card>
    </div>
  );
};

export default ErrorBoundary;

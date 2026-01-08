import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

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
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl max-w-lg w-full">
        <div className="card-body items-center text-center">
          <AlertTriangle className="w-16 h-16 text-error mb-4" />
          <h2 className="card-title text-2xl mb-2">Something went wrong</h2>
          <p className="text-base-content/70 mb-6">
            An unexpected error occurred. Please try reloading the page.
          </p>

          {error && (
            <div className="w-full text-left bg-base-300 p-4 rounded-lg mb-6 overflow-auto max-h-48">
              <code className="text-xs font-mono whitespace-pre-wrap text-error">
                {error.toString()}
              </code>
            </div>
          )}

          <div className="card-actions">
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Reload Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundary;

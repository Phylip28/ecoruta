import { Component, type ErrorInfo, type ReactNode } from "react";
import { OctagonAlert } from "lucide-react";

type Props = { children: ReactNode };
type State = { err: Error | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { err: null };

  static getDerivedStateFromError(err: Error): State {
    return { err };
  }

  override componentDidCatch(err: Error, _info: ErrorInfo) {
    console.error(err);
  }

  override render() {
    if (this.state.err) {
      return (
        <div className="min-h-screen bg-eco-gray-50 px-4 py-12 font-sans text-body text-eco-gray-800">
          <div className="mx-auto max-w-lg rounded-eco-lg border border-eco-danger/30 bg-eco-white p-6 shadow-eco-md">
            <div className="mb-3 flex items-center gap-2 text-eco-danger">
              <OctagonAlert className="h-5 w-5" aria-hidden />
              <h1 className="font-display text-h3">Algo salió mal en el panel</h1>
            </div>
            <p className="text-body-sm text-eco-gray-600">Recargá la página. Si vuelve a ocurrir, comprobá la consola o el build.</p>
            <p className="mt-2 font-mono text-caption text-eco-gray-500 break-all">{this.state.err.message}</p>
            <button
              type="button"
              onClick={() => {
                this.setState({ err: null });
                window.location.href = "/";
              }}
              className="mt-4 rounded-eco-md bg-eco-teal px-4 py-2 font-sans text-label text-eco-white"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

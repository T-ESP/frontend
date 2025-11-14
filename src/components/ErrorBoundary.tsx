import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur non gérée:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-linear-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl font-bold">
                !
              </div>
              <div>
                <h1 className="text-3xl font-bold text-red-600">
                  Une erreur s'est produite
                </h1>
                <p className="text-gray-600 mt-1">
                  L'application a rencontré une erreur inattendue
                </p>
              </div>
            </div>

            {/* Message d'erreur */}
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
              <h2 className="font-bold text-red-800 mb-2">Message d'erreur :</h2>
              <p className="text-red-700 font-mono text-sm">
                {this.state.error?.toString()}
              </p>
            </div>

            {/* Stack trace */}
            {this.state.errorInfo && (
              <div className="bg-gray-50 border border-gray-300 rounded p-4 mb-6 max-h-96 overflow-auto">
                <h2 className="font-bold text-gray-800 mb-2">Stack trace :</h2>
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Stack de l'erreur complète */}
            {this.state.error?.stack && (
              <details className="mb-6">
                <summary className="cursor-pointer font-semibold text-gray-700 hover:text-gray-900 mb-2">
                  Voir le stack complet
                </summary>
                <div className="bg-gray-900 text-green-400 rounded p-4 max-h-96 overflow-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={this.handleReload}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Recharger l'application
              </button>
              <button
                onClick={() => window.history.back()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Retour
              </button>
            </div>

            {/* Informations de développement */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                💡 <strong>En développement :</strong> Vérifiez la console pour plus de détails.
                Cette page ne s'affichera pas en production si vous configurez un error boundary approprié.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


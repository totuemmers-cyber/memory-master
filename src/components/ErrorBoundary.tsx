import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: 32,
          background: '#0f172a',
          color: '#ef4444',
          minHeight: '100vh',
          fontFamily: 'monospace',
        }}>
          <h1 style={{ color: '#f59e0b', fontSize: 18, marginBottom: 16 }}>Memory Master - Error</h1>
          <p style={{ marginBottom: 8 }}>{this.state.error?.message}</p>
          <pre style={{
            background: '#1e293b',
            padding: 16,
            overflow: 'auto',
            fontSize: 12,
            color: '#e2e8f0',
            whiteSpace: 'pre-wrap',
          }}>
            {this.state.error?.stack}
          </pre>
          {this.state.errorInfo?.componentStack && (
            <pre style={{
              background: '#1e293b',
              padding: 16,
              marginTop: 8,
              overflow: 'auto',
              fontSize: 12,
              color: '#94a3b8',
              whiteSpace: 'pre-wrap',
            }}>
              {this.state.errorInfo.componentStack}
            </pre>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null, errorInfo: null });
            }}
            style={{
              marginTop: 16,
              padding: '8px 16px',
              background: '#f59e0b',
              color: '#0f172a',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            Retry
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('memory-master-state');
              window.location.reload();
            }}
            style={{
              marginTop: 16,
              marginLeft: 8,
              padding: '8px 16px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'monospace',
              fontWeight: 'bold',
            }}
          >
            Reset Save & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

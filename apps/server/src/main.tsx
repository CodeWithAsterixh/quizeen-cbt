import React, { Component, ErrorInfo, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './ui/App';
import './styles/server.css';

interface Props { children: ReactNode; }
interface State { hasError: boolean; error: string; }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: '' };
  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, error: err.message };
  }
  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error('Server UI error:', err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#dc2626', fontFamily: 'sans-serif' }}>
          <h3>Server Window Error</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>{this.state.error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            Reload Window
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);


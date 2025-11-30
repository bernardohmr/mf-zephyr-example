import './App.css';
import React, { Suspense, Component, ErrorInfo, ReactNode } from 'react';

// The remote component provided by federation_provider
const ProviderButton = React.lazy(() => import('federation_provider/button'));

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="content">
          <h1>Hello, I am the consumer app</h1>
          <h2>Error loading remote:</h2>
          <pre style={{ color: 'red', whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const App = () => {
  return (
    <ErrorBoundary>
      <div className="content">
        <h1>Hello, I am the consumer app</h1>
        <div>
          <Suspense fallback={<div>Loading remote component...</div>}>
            <ProviderButton />
          </Suspense>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default App;

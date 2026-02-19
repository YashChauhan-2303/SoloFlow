import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // You can log error to an external service here
    this.setState({ error, info });
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
          <div className="max-w-2xl w-full bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-3">Something went wrong</h2>
            <p className="text-sm text-gray-700 mb-4">An unexpected error occurred in the application.</p>
            <details className="whitespace-pre-wrap text-xs bg-gray-100 p-3 rounded mb-4">
              <summary className="cursor-pointer font-medium text-gray-800">Error Details</summary>
              {this.state.error && this.state.error.toString()}
              {this.state.info && this.state.info.componentStack}
            </details>            
            <div className="flex gap-3">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={() => window.location.reload()}
              >
                Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

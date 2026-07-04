import { Component } from "react";

// Class components remain the only way to catch render errors in React,
// even in React 19 — this keeps a crash in one part of the gallery from
// taking down the whole page.
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    if (import.meta.env.DEV) {
      console.error("Gallery crashed:", error, info);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-md px-4 py-24 text-center">
          <h2 className="text-lg font-semibold text-neutral-900">Something went wrong</h2>
          <p className="mt-2 text-sm text-neutral-500">
            The gallery hit an unexpected error. Please try again.
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="mt-4 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

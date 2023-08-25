import type { ErrorInfo, ReactElement } from 'react';
import { Component } from 'react';
import { todoEventBus } from '../util/event-bus';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}
interface ErrorBoundaryProps {
  children: ReactElement;
}

/**
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: Readonly<ErrorBoundaryProps>) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  /** Lets display an error message instead of clearing the UI */
  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    const message = error instanceof Error ? error.message : 'An error occured';

    // Update state so the next render will show the fallback UI.
    return { hasError: true, message };
  }

  componentDidCatch(error: unknown, info: ErrorInfo): void {
    const message = error instanceof Error ? error.message : 'An error occured';
    // Publish event to keep track
    todoEventBus.publish('error', {
      emitAt: new Date(),
      message,
      data: { error, info },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h3>Something went wrong...</h3>
          <p>{this.state.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

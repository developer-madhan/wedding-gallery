import { useCallback, useState } from "react";

import Gallery from "./components/Gallery";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  // Bumping this key forces a clean remount of the whole gallery subtree
  // when someone recovers from a crash via the error boundary.
  const [resetKey, setResetKey] = useState(0);
  const handleRetry = useCallback(() => setResetKey((key) => key + 1), []);

  return (
    <ErrorBoundary key={resetKey} onRetry={handleRetry}>
      <Gallery />
    </ErrorBoundary>
  );
}

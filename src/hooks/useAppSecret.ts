import { useState, useCallback } from "react";

/**
 * Manages app_secret prompt flow.
 * Secret is NEVER stored — user is asked every time.
 */
export function useAppSecret() {
  const [prompt, setPrompt] = useState(false);
  const [resolver, setResolver] = useState<((s: string | null) => void) | null>(null);

  /**
   * Opens the secret modal and returns a Promise that resolves with the
   * entered secret, or null if the user cancels.
   */
  const getSecret = useCallback((): Promise<string | null> => {
    return new Promise((resolve) => {
      setPrompt(true);
      // Store resolver via function form to avoid setState treating it as an updater
      setResolver(() => resolve);
    });
  }, []);

  const submitPrompt = useCallback(
    (s: string) => {
      setPrompt(false);
      resolver?.(s.trim() || null);
      setResolver(null);
    },
    [resolver],
  );

  const cancelPrompt = useCallback(() => {
    setPrompt(false);
    resolver?.(null);
    setResolver(null);
  }, [resolver]);

  return { prompt, getSecret, submitPrompt, cancelPrompt };
}

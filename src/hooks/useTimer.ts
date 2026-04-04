import { useState, useRef, useCallback, useEffect } from 'react';

interface UseTimerOptions {
  durationMs: number;
  onComplete: () => void;
  onTick?: (remainingMs: number) => void;
  tickIntervalMs?: number;
}

export function useTimer({ durationMs, onComplete, onTick }: UseTimerOptions) {
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(0);
  const pausedAtRef = useRef(0);
  const rafRef = useRef<number>(0);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const tick = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current;
    const remaining = Math.max(0, durationMs - elapsed);
    setRemainingMs(remaining);
    onTick?.(remaining);

    if (remaining <= 0 && !completedRef.current) {
      completedRef.current = true;
      setIsRunning(false);
      onCompleteRef.current();
      return;
    }

    rafRef.current = requestAnimationFrame(tick);
  }, [durationMs, onTick]);

  const start = useCallback(() => {
    completedRef.current = false;
    startTimeRef.current = performance.now();
    setIsRunning(true);
    setRemainingMs(durationMs);
    rafRef.current = requestAnimationFrame(tick);
  }, [durationMs, tick]);

  const pause = useCallback(() => {
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
    pausedAtRef.current = performance.now() - startTimeRef.current;
  }, []);

  const resume = useCallback(() => {
    startTimeRef.current = performance.now() - pausedAtRef.current;
    setIsRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const reset = useCallback(() => {
    setIsRunning(false);
    cancelAnimationFrame(rafRef.current);
    completedRef.current = false;
    setRemainingMs(durationMs);
  }, [durationMs]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return { remainingMs, isRunning, start, pause, resume, reset };
}

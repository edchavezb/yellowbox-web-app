import { useEffect, useRef } from 'react';

type DebouncedCallback<T extends any[]> = (...args: T) => void;

const useDebounce = <T extends any[]>(
  callback: DebouncedCallback<T>,
  delay: number
): DebouncedCallback<T> => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedCallback: DebouncedCallback<T> = (...args: T) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedCallback;
};

export default useDebounce;
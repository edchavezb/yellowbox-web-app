import { useEffect, useRef } from 'react';

type DebouncedCallback<T extends any[], U> = (...args: T) => Promise<U>;

const useDebounce = <T extends any[], U>(
  callback: DebouncedCallback<T, U>,
  delay: number
): DebouncedCallback<T, U> => {
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const debouncedCallback = (...args: T) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    return new Promise<U>((resolve) => {
      timerRef.current = setTimeout(() => {
        const result = callback(...args);
        resolve(result);
      }, delay);
    });
  };

  return debouncedCallback;
};

export default useDebounce;
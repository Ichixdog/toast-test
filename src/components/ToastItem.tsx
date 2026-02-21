import React, { useEffect, useRef } from 'react';
import type { Toast } from '../types/types';

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
  registerExtend: (fn: () => void) => void;
}

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onRemove, registerExtend }) => {
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(toast.duration ?? 3000);

  const startTimer = () => {
    startTimeRef.current = Date.now();
    timerRef.current = window.setTimeout(() => {
      onRemove(toast.id);
    }, remainingRef.current);
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      remainingRef.current -= Date.now() - startTimeRef.current;
    }
  };

  const extendTimer = (extra = 3000) => {
    remainingRef.current += extra;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      startTimer();
    }
  };

  useEffect(() => {
    registerExtend(extendTimer);
  }, []);

  useEffect(() => {
    remainingRef.current = toast.duration ?? 3000;
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      className={`toast toast-${toast.type}`}
      onMouseEnter={pauseTimer}
      onMouseLeave={startTimer}
    >
      <span>{toast.message}</span>
      <button onClick={() => onRemove(toast.id)}>x</button>
    </div>
  );
};
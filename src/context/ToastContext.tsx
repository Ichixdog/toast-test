import React, { createContext, useCallback, useContext, useState, type ReactNode, useRef } from 'react';
import type { Toast } from '../types/types';
import { ToastItem } from '../components/ToastItem';

type ToastContextType = {
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersMap = useRef<Map<string, () => void>>(new Map());

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const duration = toast.duration ?? 3000;

    setToasts(prev => {
      const existing = prev.find(
        t => t.message === toast.message && t.type === toast.type
      );

      if (existing) {
        timersMap.current.get(existing.id)?.();
        return prev;
      }

      const id = crypto.randomUUID();
      const newToast: Toast = { ...toast, id, duration };
      return [newToast, ...prev];
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    timersMap.current.delete(id);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}

      <div className="toast-container">
        {toasts.map(toast => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
            registerExtend={(fn: () => void) => timersMap.current.set(toast.id, fn)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};
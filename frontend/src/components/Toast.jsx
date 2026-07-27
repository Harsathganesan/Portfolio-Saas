import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              className={`pointer-events-auto flex items-center p-4 rounded-xl shadow-2xl border backdrop-blur-md min-w-[280px] max-w-md ${
                t.type === 'success'
                  ? 'bg-slate-900/90 border-emerald-500/30 text-emerald-300'
                  : t.type === 'error'
                  ? 'bg-slate-900/90 border-rose-500/30 text-rose-300'
                  : 'bg-slate-900/90 border-indigo-500/30 text-indigo-300'
              }`}
            >
              <div className="mr-3 flex-shrink-0">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                {t.type === 'error' && <XCircle className="w-5 h-5 text-rose-400" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-indigo-400" />}
              </div>
              <p className="text-sm font-medium flex-1 text-slate-100">{t.message}</p>
              <button
                onClick={() => removeToast(t.id)}
                className="ml-3 text-slate-400 hover:text-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

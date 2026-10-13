import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  isOpen: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          transition={{ duration: 0.2 }}
          className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border text-sm font-medium backdrop-blur-md ${
            type === 'error'
              ? 'bg-red-500 text-white border-red-400'
              : type === 'warning'
              ? 'bg-amber-500 text-white border-amber-400'
              : type === 'info'
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-white text-slate-800 border-slate-200 shadow-indigo-500/10'
          }`}
        >
          {type === 'error' && <AlertCircle className="w-5 h-5 shrink-0" />}
          {type === 'warning' && <AlertTriangle className="w-5 h-5 shrink-0" />}
          {type === 'info' && <Info className="w-5 h-5 shrink-0" />}
          {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
          <span className="pr-1">{message}</span>
          <button
            onClick={onClose}
            className="p-1 hover:opacity-75 transition-opacity rounded-full ml-auto"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

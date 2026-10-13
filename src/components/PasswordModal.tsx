import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, X, ShieldAlert } from 'lucide-react';

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ksgenius') {
      setError(false);
      setPassword('');
      onSuccess();
    } else {
      setError(true);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 relative overflow-hidden"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#6C63FF]">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Akses Monitoring</h3>
                  <p className="text-xs text-slate-500">Khusus Kepala Sekolah & Pengawas</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Password Kepala Sekolah
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="Masukkan password..."
                  autoFocus
                  className={`w-full px-4 py-3.5 rounded-2xl border bg-slate-50 text-slate-800 text-sm focus:outline-none transition-all ${
                    error
                      ? 'border-red-500 focus:ring-4 focus:ring-red-500/10'
                      : 'border-slate-200 focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10'
                  }`}
                />
                {error && (
                  <p className="flex items-center gap-1.5 text-xs text-red-500 font-medium mt-2">
                    <ShieldAlert className="w-4 h-4" />
                    Password salah! (Petunjuk: ksgenius)
                  </p>
                )}
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3 text-xs text-amber-800 leading-relaxed">
                💡 Masukkan kata sandi <strong>ksgenius</strong> untuk membuka dashboard analitik supervisi, kurva radar guru, dan monitoring aktivitas sekolah.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white font-semibold text-sm shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity"
                >
                  Buka Monitoring
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

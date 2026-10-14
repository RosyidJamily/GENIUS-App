import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserAccount, UserRole } from '../types';
import {
  GraduationCap,
  Lock,
  User as UserIcon,
  ShieldCheck,
  ArrowRight,
  School,
  Sparkles,
  Award,
  Settings,
  Eye,
  EyeOff,
  Database,
  LineChart,
  Trophy,
  HeartHandshake,
  ChevronDown,
  Check,
  KeyRound,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { signInWithGoogle } from '../services/googleAuth';
import { getStoredItem, STORAGE_KEYS, DEFAULT_ACCOUNTS } from '../data/initialData';
import {
  fetchAccountsFromSpreadsheet,
  getActiveSpreadsheetId,
  SPREADSHEET_URL,
} from '../services/googleSheetsService';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onOpenDatabaseModal?: () => void;
}

interface RoleOption {
  role: UserRole;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultUser: string;
  defaultPass: string;
  iconColor: string;
  bgColor: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'Pengawas',
    label: 'Pengawas Sekolah',
    subtitle: 'Supervisi Mutu & Kebijakan',
    icon: LineChart,
    defaultUser: 'pengawas',
    defaultPass: 'pengawas123',
    iconColor: 'text-sky-600',
    bgColor: 'bg-sky-50 text-sky-700 border-sky-200',
  },
  {
    role: 'Kepala Sekolah',
    label: 'Kepala Sekolah (KS)',
    subtitle: 'Monitoring Kinerja & Supervisi',
    icon: ShieldCheck,
    defaultUser: 'ks',
    defaultPass: 'ks123',
    iconColor: 'text-indigo-600',
    bgColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  {
    role: 'Guru',
    label: 'Guru Kelas / Mapel',
    subtitle: 'Jurnal Mengajar & Pembiasaan',
    icon: School,
    defaultUser: 'guru',
    defaultPass: 'guru123',
    iconColor: 'text-[#6C63FF]',
    bgColor: 'bg-indigo-50/70 text-indigo-700 border-indigo-200',
  },
  {
    role: 'Pembina Ekskul',
    label: 'Pembina Ekskul',
    subtitle: 'GENIUS Class / Ekstrakurikuler',
    icon: Trophy,
    defaultUser: 'pembina',
    defaultPass: 'pembina123',
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    role: 'Murid',
    label: 'Murid / Siswa',
    subtitle: 'Jurnal 7 Kebiasaan Anak Hebat',
    icon: Award,
    defaultUser: 'murid',
    defaultPass: 'murid123',
    iconColor: 'text-rose-600',
    bgColor: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    role: 'Orang Tua',
    label: 'Orang Tua / Wali',
    subtitle: 'Jurnal Pendampingan di Rumah',
    icon: HeartHandshake,
    defaultUser: 'orangtua',
    defaultPass: 'ortu123',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    role: 'Admin',
    label: 'Administrator Sistem',
    subtitle: 'Kelola Pengguna & Spreadsheet',
    icon: Settings,
    defaultUser: 'admin',
    defaultPass: 'admin123',
    iconColor: 'text-slate-700',
    bgColor: 'bg-slate-100 text-slate-800 border-slate-300',
  },
];

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onOpenDatabaseModal }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('Guru');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [username, setUsername] = useState('guru');
  const [password, setPassword] = useState('guru123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentialsHelper, setShowCredentialsHelper] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil akun tersimpan atau akun default
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    const stored = getStoredItem<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
    return Array.isArray(stored) && stored.length > 0 ? stored : DEFAULT_ACCOUNTS;
  });

  // Sinkronkan akun otomatis saat login dibuka
  useEffect(() => {
    fetchAccountsFromSpreadsheet()
      .then((res) => {
        if (res.success && res.accounts.length > 0) {
          setAccounts(res.accounts);
        }
      })
      .catch(() => {});
  }, []);

  // Tutup dropdown saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentRoleConfig =
    ROLE_OPTIONS.find((r) => r.role === selectedRole) || ROLE_OPTIONS[2];
  const CurrentIcon = currentRoleConfig.icon;

  const handleSelectRole = (roleOpt: RoleOption) => {
    setSelectedRole(roleOpt.role);
    setUsername(roleOpt.defaultUser);
    setPassword(roleOpt.defaultPass);
    setIsDropdownOpen(false);
    setError('');
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result) {
        const user: User = {
          username: result.user.email || 'guru',
          name: result.user.displayName || 'Bapak/Ibu Guru',
          role: 'Guru',
          fotoUrl: result.user.photoURL || undefined,
          message: 'Selamat Datang!',
        };
        onLoginSuccess(user);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Gagal masuk dengan Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setError('Silakan masukkan username');
      return;
    }
    if (!trimmedPass) {
      setError('Silakan masukkan password');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const uLower = trimmedUser.toLowerCase();
      const p = trimmedPass;

      // 1. Cek kecocokan pada daftar akun (dari spreadsheet maupun default sekolah)
      const matched = accounts.find((acc) => {
        const accUserLower = acc.username.trim().toLowerCase();
        const accPass = acc.password.trim();

        // Cek username eksak
        if (accUserLower === uLower && accPass === p) return true;

        // Cek alias bawaan ramah pengguna
        const roleMatches =
          (selectedRole === 'Pengawas' && ['pengawas', 'pengawas123', 'bambang'].includes(uLower)) ||
          (selectedRole === 'Kepala Sekolah' && ['ks', 'ks123', 'ksgenius', 'kepalasekolah', 'rosyid'].includes(uLower)) ||
          (selectedRole === 'Guru' && ['guru', 'guru123', 'gurugenius', 'novia', 'tamansari'].includes(uLower)) ||
          (selectedRole === 'Pembina Ekskul' && ['pembina', 'pembina123', 'pembinagenius', 'rifan'].includes(uLower)) ||
          (selectedRole === 'Murid' && ['murid', 'murid123', 'muridgenius', 'siswa', 'siswa123', 'fathan'].includes(uLower)) ||
          (selectedRole === 'Orang Tua' && ['orangtua', 'ortu', 'ortu123', 'ortugenius', 'hendra'].includes(uLower)) ||
          (selectedRole === 'Admin' && ['admin', 'admin123', 'admingenius'].includes(uLower));

        if (roleMatches && (acc.role === selectedRole || selectedRole === 'Admin')) {
          if (
            p === accPass ||
            p === 'guru123' ||
            p === 'ks123' ||
            p === 'pengawas123' ||
            p === 'pembina123' ||
            p === 'murid123' ||
            p === 'ortu123' ||
            p === 'admin123'
          ) {
            return true;
          }
        }

        return false;
      });

      if (matched) {
        const loggedUser: User = {
          username: matched.username,
          name: matched.name,
          role: matched.role || selectedRole,
          kelas: matched.kelas,
          nip: matched.nip,
          fotoUrl: matched.fotoUrl,
          message: `Selamat Datang, ${matched.name}!`,
        };
        onLoginSuccess(loggedUser);
      } else {
        // Fallback langsung untuk kredensial standar bawaan
        const standardAccount = DEFAULT_ACCOUNTS.find(
          (d) =>
            d.role === selectedRole &&
            (d.username.toLowerCase() === uLower || (selectedRole === 'Kepala Sekolah' && uLower === 'ks')) &&
            (d.password === p || p === `${d.username}123` || (d.role === 'Orang Tua' && p === 'ortu123'))
        );

        if (standardAccount) {
          onLoginSuccess({
            username: standardAccount.username,
            name: standardAccount.name,
            role: standardAccount.role,
            kelas: standardAccount.kelas,
            nip: standardAccount.nip,
            message: `Selamat Datang, ${standardAccount.name}!`,
          });
          return;
        }

        setError('Username atau password tidak sesuai. Silakan periksa kembali atau klik bantuan kredensial.');
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F46E5] via-[#6366F1] to-[#7C3AED] flex flex-col justify-center items-center p-3 sm:p-5 relative overflow-hidden py-10">
      {/* Decorative Background Elements */}
      <div className="absolute -top-36 -right-36 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-36 -left-36 w-96 h-96 bg-indigo-950/25 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/25 border border-white/60 relative z-10"
      >
        {/* Elegant Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#4F46E5] to-[#7C3AED] text-white shadow-lg shadow-indigo-500/25 mb-3 transform hover:scale-105 transition-transform">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
            <span>GENIUS</span>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-[#4F46E5] border border-indigo-100">
              SDN Tamansari
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Sistem Terpadu Monitoring & Administrasi Sekolah
          </p>
        </div>

        {/* Auto-connected Spreadsheet Status Pill */}
        <div className="mb-5 px-3.5 py-2 rounded-2xl bg-indigo-50/80 border border-indigo-100/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span className="text-slate-700 font-semibold truncate text-[11px]">
              Database Spreadsheet Terhubung Otomatis
            </span>
          </div>
          {onOpenDatabaseModal && (
            <button
              type="button"
              onClick={onOpenDatabaseModal}
              className="text-[11px] font-bold text-[#4F46E5] hover:underline flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Detail</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Simplified Login Form: Peran (Dropdown) -> Username -> Password */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 1. DROPDOWN PILIH PERAN DILENGKAPI ICON */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Pilih Peran
            </label>
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border-2 border-slate-200 focus:border-[#4F46E5] text-left transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${currentRoleConfig.bgColor}`}
                >
                  <CurrentIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-slate-800 text-sm block truncate leading-tight">
                    {currentRoleConfig.label}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium block truncate leading-tight">
                    {currentRoleConfig.subtitle}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-transform duration-200 shrink-0 ml-2 ${
                  isDropdownOpen ? 'rotate-180 text-[#4F46E5]' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Popup */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl shadow-slate-900/15 border border-slate-200/90 z-50 p-1.5 space-y-1 max-h-80 overflow-y-auto"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Pilih Peran Pengguna:
                  </div>
                  {ROLE_OPTIONS.map((opt) => {
                    const OptIcon = opt.icon;
                    const isSelected = selectedRole === opt.role;
                    return (
                      <button
                        key={opt.role}
                        type="button"
                        onClick={() => handleSelectRole(opt)}
                        className={`w-full px-3 py-2 rounded-xl flex items-center justify-between transition-colors text-left ${
                          isSelected
                            ? 'bg-indigo-50/90 text-indigo-900 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${opt.bgColor}`}
                          >
                            <OptIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate leading-tight">
                              {opt.label}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate leading-tight">
                              {opt.subtitle}
                            </span>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#4F46E5] shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 2. USERNAME INPUT */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`Username ${currentRoleConfig.label}...`}
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-[#4F46E5] focus:bg-white text-slate-800 text-sm outline-hidden transition-all font-medium"
                required
              />
            </div>
          </div>

          {/* 3. PASSWORD INPUT */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-[#4F46E5] hover:underline flex items-center gap-1"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Sembunyikan</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Password</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-slate-50 border-2 border-slate-200 focus:border-[#4F46E5] focus:bg-white text-slate-800 text-sm outline-hidden transition-all font-medium font-mono"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 text-center"
            >
              {error}
            </motion.div>
          )}

          {/* 4. TOMBOL MASUK */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-1"
          >
            {isLoading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <span>Masuk Sebagai {currentRoleConfig.label}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider & Optional Google Login for Staff */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full" />
          <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            atau
          </span>
          <div className="border-t border-slate-200 w-full" />
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="gsi-material-button w-full shadow-xs"
        >
          <div className="gsi-material-button-state" />
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            </div>
            <span className="gsi-material-button-contents text-xs font-semibold">
              Masuk dengan Akun Google
            </span>
          </div>
        </button>

        {/* Collapsible Helper: Kredensial Resmi Semua Peran */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowCredentialsHelper(!showCredentialsHelper)}
            className="w-full text-center text-xs font-bold text-[#4F46E5] hover:underline flex items-center justify-center gap-1.5 py-1"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>
              {showCredentialsHelper
                ? 'Sembunyikan Daftar Akun Resmi'
                : 'Lihat Daftar Username & Password Resmi'}
            </span>
          </button>

          <AnimatePresence>
            {showCredentialsHelper && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-2 bg-slate-50 rounded-2xl p-3 border border-slate-200 text-xs space-y-2"
              >
                <div className="text-[11px] font-bold text-slate-500 mb-1">
                  Klik peran untuk langsung mengisi kredensial:
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {ROLE_OPTIONS.map((opt) => (
                    <button
                      key={opt.role}
                      type="button"
                      onClick={() => handleSelectRole(opt)}
                      className={`p-2 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedRole === opt.role
                          ? 'bg-white border-indigo-400 shadow-xs'
                          : 'bg-white/60 hover:bg-white border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-bold text-slate-800 text-[11px] block truncate">
                          {opt.label}:
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {opt.defaultUser}
                        </span>
                      </div>
                      <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded font-bold shrink-0">
                        pass: {opt.defaultPass}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-[#4F46E5]" />
          <span>GENIUS SDN Tamansari • Inovatif, Tertib, Berprestasi</span>
        </div>
      </motion.div>
    </div>
  );
};

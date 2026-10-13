import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
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
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';
import { signInWithGoogle } from '../services/googleAuth';
import { getStoredItem, STORAGE_KEYS } from '../data/initialData';
import {
  fetchAccountsFromSpreadsheet,
  isAppsScriptConfigured,
} from '../services/googleSheetsService';
import { SpreadsheetStatusIndicator } from '../components/SpreadsheetStatusIndicator';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
  onOpenDatabaseModal?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onOpenDatabaseModal }) => {
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>('Guru');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string>('');

  const [syncedAccounts, setSyncedAccounts] = useState<UserAccount[]>(() =>
    getStoredItem<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, [])
  );

  // Otomatis sinkronkan akun dari spreadsheet saat halaman dibuka
  useEffect(() => {
    if (isAppsScriptConfigured()) {
      setIsSyncing(true);
      fetchAccountsFromSpreadsheet()
        .then((res) => {
          if (res.success && res.accounts.length > 0) {
            setSyncedAccounts(res.accounts);
            setSyncNotice(`Tersinkron ${res.accounts.length} akun resmi dari spreadsheet`);
          }
        })
        .catch(() => {})
        .finally(() => setIsSyncing(false));
    }
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setError('');
    setSyncNotice('');
    try {
      const res = await fetchAccountsFromSpreadsheet(true);
      if (res.success) {
        setSyncedAccounts(res.accounts);
        setSyncNotice(`Berhasil memuat ${res.accounts.length} akun dari sheet "Akun Pengguna"`);
      } else {
        setError(res.message || 'Gagal memuat akun dari spreadsheet');
      }
    } catch (err: any) {
      setError(err?.message || 'Gagal menghubungi Google Apps Script');
    } finally {
      setIsSyncing(false);
    }
  };

  const roleConfigs: Record<
    UserRole,
    {
      title: string;
      shortTitle: string;
      icon: any;
      desc: string;
      color: string;
      placeholderUser: string;
    }
  > = {
    Pengawas: {
      title: 'Pengawas Sekolah',
      shortTitle: 'Pengawas',
      icon: LineChart,
      desc: 'Supervisi Pengawas & Monitoring Mutu',
      color: 'text-sky-600 bg-sky-50 border-sky-200',
      placeholderUser: 'Username Pengawas...',
    },
    'Kepala Sekolah': {
      title: 'Kepala Sekolah (KS)',
      shortTitle: 'KS',
      icon: ShieldCheck,
      desc: 'Supervisi Guru & Monitoring Kinerja',
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      placeholderUser: 'Username Kepala Sekolah...',
    },
    Guru: {
      title: 'Guru Kelas / Mapel',
      shortTitle: 'Guru',
      icon: School,
      desc: 'Jurnal Mengajar, Pembiasaan & Administrasi',
      color: 'text-[#6C63FF] bg-indigo-50/70 border-indigo-200',
      placeholderUser: 'Username Guru...',
    },
    'Pembina Ekskul': {
      title: 'Pembina Ekskul',
      shortTitle: 'Pembina',
      icon: Trophy,
      desc: 'GENIUS Class (Ekstrakurikuler)',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      placeholderUser: 'Username Pembina Ekskul...',
    },
    Murid: {
      title: 'Murid / Siswa',
      shortTitle: 'Murid',
      icon: Award,
      desc: 'Jurnal 7 Kebiasaan Anak Hebat',
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      placeholderUser: 'Username atau NISN Siswa...',
    },
    'Orang Tua': {
      title: 'Orang Tua / Wali',
      shortTitle: 'Orang Tua',
      icon: HeartHandshake,
      desc: 'Jurnal Pendampingan Siswa di Rumah',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      placeholderUser: 'Username Orang Tua / Wali...',
    },
    Admin: {
      title: 'Administrator',
      shortTitle: 'Admin',
      icon: Settings,
      desc: 'Kelola Pengguna & Database Spreadsheet',
      color: 'text-slate-700 bg-slate-100 border-slate-300',
      placeholderUser: 'Username Admin...',
    },
  };

  const handleSelectRoleTab = (role: UserRole) => {
    setSelectedRoleTab(role);
    setError('');
  };

  // Akun terdaftar di spreadsheet untuk peran yang sedang dipilih
  const availableAccountsForRole = syncedAccounts.filter(
    (acc) => acc.role.toLowerCase() === selectedRoleTab.toLowerCase()
  );

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

    try {
      let accounts = syncedAccounts;
      if (accounts.length === 0) {
        accounts = getStoredItem<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, []);
      }

      // Jika akun lokal masih kosong, coba fetch live dari spreadsheet
      if (accounts.length === 0 && isAppsScriptConfigured()) {
        const res = await fetchAccountsFromSpreadsheet(true);
        if (res.success && res.accounts.length > 0) {
          accounts = res.accounts;
          setSyncedAccounts(res.accounts);
        }
      }

      const uLower = trimmedUser.toLowerCase();
      const matched = accounts.find((acc) => {
        return acc.username.trim().toLowerCase() === uLower && acc.password === trimmedPass;
      });

      if (matched) {
        const loggedUser: User = {
          username: matched.username,
          name: matched.name,
          role: matched.role,
          kelas: matched.kelas,
          nip: matched.nip,
          fotoUrl: matched.fotoUrl,
          message: `Selamat Datang, ${matched.name}!`,
        };
        onLoginSuccess(loggedUser);
      } else {
        if (accounts.length === 0) {
          setError(
            'Belum ada akun pengguna yang terdaftar di spreadsheet. Silakan isi data di sheet "Akun Pengguna" pada spreadsheet lalu klik "Sinkronkan Akun".'
          );
        } else {
          setError(
            'Username atau password tidak cocok dengan data di spreadsheet ("Akun Pengguna"). Pastikan ejaan huruf besar/kecil tepat.'
          );
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat memvalidasi akun');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5651D9] via-[#6C63FF] to-[#8A85FF] flex flex-col justify-center items-center p-3 sm:p-4 relative overflow-hidden py-8">
      {/* Background Decorative Blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-950/20 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-lg bg-white rounded-3xl p-5 sm:p-8 shadow-2xl shadow-indigo-950/30 border border-white/50 relative z-10"
      >
        {/* App Logo & Title */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-3xl bg-gradient-to-tr from-[#6C63FF] to-[#8A85FF] text-white shadow-xl shadow-indigo-500/30 mb-2 transform hover:rotate-6 transition-transform">
            <GraduationCap className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
            <span>GENIUS</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-[#6C63FF] border border-indigo-100">
              SDN Tamansari
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 font-medium">
            Multi Role & Multi User • Berbasis Database Google Spreadsheet
          </p>
        </div>

        {/* Indikator Status Database Spreadsheet */}
        <div className="mb-4">
          <SpreadsheetStatusIndicator
            variant="login"
            onOpenSettings={onOpenDatabaseModal}
          />
        </div>

        {/* Banner Sinkronisasi Akun Spreadsheet (Tanpa Akun Dummy) */}
        <div className="mb-4 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-white shadow-xs flex items-center justify-center text-[#6C63FF] shrink-0">
              <Users className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>Database Akun: Sheet "Akun Pengguna"</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {syncedAccounts.length > 0
                  ? `${syncedAccounts.length} akun aktif terdaftar di spreadsheet`
                  : 'Belum ada akun, sinkronkan dari spreadsheet'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-indigo-600 hover:text-white text-[#6C63FF] border border-indigo-200 text-[11px] font-bold transition-all shadow-xs flex items-center gap-1.5 shrink-0 active:scale-95 disabled:opacity-50"
            title="Tarik data akun terbaru dari Google Spreadsheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Sinkron...' : 'Sinkronkan'}</span>
          </button>
        </div>

        {syncNotice && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-3 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{syncNotice}</span>
          </motion.div>
        )}

        {/* 6 Role Selection Grid */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
              Pilih Peran Masuk:
            </label>
            <button
              type="button"
              onClick={() => handleSelectRoleTab('Admin')}
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-md transition-colors ${
                selectedRoleTab === 'Admin'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 bg-slate-100'
              }`}
            >
              Mode Admin
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-1.5 bg-slate-100/90 rounded-2xl">
            {(
              [
                'Pengawas',
                'Kepala Sekolah',
                'Guru',
                'Pembina Ekskul',
                'Murid',
                'Orang Tua',
              ] as UserRole[]
            ).map((role) => {
              const cfg = roleConfigs[role];
              const Icon = cfg.icon;
              const isSelected = selectedRoleTab === role;
              const countForRole = syncedAccounts.filter(
                (a) => a.role.toLowerCase() === role.toLowerCase()
              ).length;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSelectRoleTab(role)}
                  className={`flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-md shadow-slate-200/80 border-2 border-indigo-500/80 scale-[1.02]'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-[#6C63FF] to-[#8A85FF] text-white shadow-xs'
                        : 'bg-slate-200/80 text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-extrabold block truncate leading-tight">
                      {cfg.shortTitle}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold block truncate leading-tight">
                      {countForRole > 0 ? `${countForRole} akun` : 'Siap input'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Info Active Role */}
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
            <span className="font-semibold text-slate-600 truncate">
              {roleConfigs[selectedRoleTab].desc}
            </span>
            <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-1">
              Data spreadsheet
            </span>
          </div>

          {/* User Suggestions (jika akun sudah tersinkron dari spreadsheet) */}
          {availableAccountsForRole.length > 0 && (
            <div className="mt-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[10px] font-bold text-slate-500 block mb-1">
                Akun Terdaftar di Spreadsheet ({availableAccountsForRole.length}):
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {availableAccountsForRole.map((acc) => (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => setUsername(acc.username)}
                    className={`text-[10px] px-2 py-1 rounded-lg border font-semibold transition-all ${
                      username === acc.username
                        ? 'bg-[#6C63FF] text-white border-[#6C63FF]'
                        : 'bg-white hover:bg-indigo-50 text-slate-700 border-slate-200'
                    }`}
                    title={`Klik untuk mengisi username: ${acc.name}`}
                  >
                    {acc.name.split(' ')[0]} ({acc.username})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={roleConfigs[selectedRoleTab].placeholderUser}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all font-medium"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] font-semibold text-[#6C63FF] hover:underline flex items-center gap-1"
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
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password akun..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all font-medium font-mono"
                required
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-600 flex items-start gap-2"
            >
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Memverifikasi akun...</span>
            ) : (
              <>
                <span>Masuk Sebagai {roleConfigs[selectedRoleTab].title}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider & Optional Google Login for Staff */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-slate-200 w-full"></div>
          <span className="bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            atau
          </span>
          <div className="border-t border-slate-200 w-full"></div>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="gsi-material-button w-full shadow-xs"
        >
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents text-xs font-semibold">
              {isLoading ? 'Menghubungkan...' : 'Masuk dengan Akun Google (Guru)'}
            </span>
          </div>
        </button>

        {/* Footer Note */}
        <div className="mt-4 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#6C63FF]" />
          <span>SDN Tamansari • Solusi Terpadu Monitoring Sekolah</span>
        </div>

        {onOpenDatabaseModal && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={onOpenDatabaseModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-[11px] font-bold transition-all border border-slate-200/80"
            >
              <Database className="w-3.5 h-3.5 text-[#6C63FF]" />
              <span>Pengaturan Database Spreadsheet & Netlify</span>
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

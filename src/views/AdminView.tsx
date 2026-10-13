import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserAccount, UserRole, ActivityItem } from '../types';
import {
  ShieldCheck,
  Users,
  KeyRound,
  Edit2,
  Plus,
  CheckCircle2,
  Trash2,
  RefreshCw,
  School,
  Award,
  Settings,
  Lock,
  ArrowLeft,
  Database,
  Download,
  AlertTriangle,
  Trophy,
  HeartHandshake,
  LineChart,
} from 'lucide-react';
import { getStoredItem, setStoredItem, STORAGE_KEYS } from '../data/initialData';
import {
  fetchAccountsFromSpreadsheet,
  saveAccountToSpreadsheet,
  updateAccountPasswordInSpreadsheet,
  deleteAccountFromSpreadsheet,
  isAppsScriptConfigured,
} from '../services/googleSheetsService';

interface AdminViewProps {
  onBack: () => void;
  onNavigateToTab: (tab: string) => void;
  onNotify?: (msg: string, type: 'info' | 'success' | 'warning' | 'error') => void;
  onOpenDatabaseModal?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onBack,
  onNavigateToTab,
  onNotify,
  onOpenDatabaseModal,
}) => {
  const [accounts, setAccounts] = useState<UserAccount[]>(() =>
    getStoredItem<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, [])
  );

  const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // New account form
  const [newRole, setNewRole] = useState<UserRole>('Guru');
  const [newUsername, setNewUsername] = useState('');
  const [newName, setNewName] = useState('');
  const [newAccountPass, setNewAccountPass] = useState('');
  const [newKelas, setNewKelas] = useState('');
  const [newDeskripsi, setNewDeskripsi] = useState('');

  const handleSyncFromSpreadsheet = async () => {
    setIsSyncing(true);
    try {
      const res = await fetchAccountsFromSpreadsheet(true);
      if (res.success) {
        setAccounts(res.accounts);
        onNotify?.(
          `Berhasil menyinkronkan ${res.accounts.length} akun resmi dari Google Spreadsheet!`,
          'success'
        );
      } else {
        onNotify?.(res.message || 'Gagal memuat akun dari spreadsheet', 'warning');
      }
    } catch (err: any) {
      onNotify?.(err?.message || 'Gagal terhubung ke Google Apps Script', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSavePassword = async (username: string) => {
    if (!newPassword.trim()) {
      onNotify?.('Password baru tidak boleh kosong', 'warning');
      return;
    }

    const updated = accounts.map((acc) =>
      acc.username === username ? { ...acc, password: newPassword.trim() } : acc
    );
    setAccounts(updated);
    setStoredItem(STORAGE_KEYS.ACCOUNTS, updated);
    setEditingAccount(null);
    setNewPassword('');

    if (isAppsScriptConfigured()) {
      updateAccountPasswordInSpreadsheet(username, newPassword.trim()).then((ok) => {
        if (ok) {
          onNotify?.(`Password akun ${username} berhasil diperbarui di Spreadsheet!`, 'success');
        } else {
          onNotify?.(`Password lokal diperbarui (Gagal sinkron ke Spreadsheet)`, 'warning');
        }
      });
    } else {
      onNotify?.(`Password akun ${username} berhasil diperbarui!`, 'success');
    }
  };

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newAccountPass.trim() || !newName.trim()) {
      onNotify?.('Lengkapi username, nama, dan password akun', 'warning');
      return;
    }

    if (accounts.some((a) => a.username.toLowerCase() === newUsername.trim().toLowerCase())) {
      onNotify?.('Username sudah digunakan, pilih username lain', 'warning');
      return;
    }

    const created: UserAccount = {
      username: newUsername.trim().toLowerCase(),
      password: newAccountPass.trim(),
      name: newName.trim(),
      role: newRole,
      kelas: newKelas.trim() || undefined,
      deskripsi: newDeskripsi.trim() || `Akun ${newRole}`,
    };

    const updated = [...accounts, created];
    setAccounts(updated);
    setStoredItem(STORAGE_KEYS.ACCOUNTS, updated);

    setIsAddModalOpen(false);
    setNewUsername('');
    setNewAccountPass('');
    setNewName('');
    setNewKelas('');
    setNewDeskripsi('');

    if (isAppsScriptConfigured()) {
      saveAccountToSpreadsheet(created).then((ok) => {
        if (ok) {
          onNotify?.(`Akun baru (${created.name}) berhasil disimpan ke sheet "Akun Pengguna"!`, 'success');
        } else {
          onNotify?.(`Akun tersimpan lokal (Gagal menulis ke spreadsheet)`, 'warning');
        }
      });
    } else {
      onNotify?.(`Akun baru (${created.name}) berhasil ditambahkan!`, 'success');
    }
  };

  const handleDeleteAccount = (username: string) => {
    if (window.confirm(`Yakin ingin menghapus akun ${username}?`)) {
      const updated = accounts.filter((a) => a.username !== username);
      setAccounts(updated);
      setStoredItem(STORAGE_KEYS.ACCOUNTS, updated);

      if (isAppsScriptConfigured()) {
        deleteAccountFromSpreadsheet(username).then((ok) => {
          if (ok) {
            onNotify?.(`Akun ${username} telah dihapus dari Google Spreadsheet!`, 'info');
          } else {
            onNotify?.(`Akun ${username} dihapus lokal (Gagal sinkron ke sheet)`, 'warning');
          }
        });
      } else {
        onNotify?.(`Akun ${username} telah dihapus`, 'info');
      }
    }
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Pengawas':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Kepala Sekolah':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Guru':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Pembina Ekskul':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Murid':
        return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Orang Tua':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Admin':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-teal-900/10">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-all mb-3 text-white backdrop-blur-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Home</span>
          </button>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manajemen Sistem & Pengguna
            </h2>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider">
              Admin
            </span>
          </div>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-xl">
            Kelola kata sandi akun masing-masing peran (Kepala Sekolah, Guru, Murid, Admin), tambah pengguna baru, serta akses penuh ke seluruh modul GENIUS.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-950/20"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
          {onOpenDatabaseModal && (
            <button
              onClick={onOpenDatabaseModal}
              className="px-3.5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/25 shadow-xs"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Spreadsheet & Netlify</span>
            </button>
          )}
          <button
            onClick={handleSyncFromSpreadsheet}
            disabled={isSyncing}
            className="px-3.5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/25 disabled:opacity-50"
            title="Tarik seluruh data akun resmi dari sheet Akun Pengguna"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan dari Spreadsheet'}</span>
          </button>
        </div>
      </div>

      {/* Role Shortcut Quick Links */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Database className="w-4 h-4 text-emerald-600" />
          <span>Akses Langsung Halaman Sesuai Hak Peran</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {/* 1. Pengawas */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 hover:border-sky-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                  <LineChart className="w-4 h-4 text-sky-600" />
                  Pengawas Pembina
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-sky-700 border border-sky-200">
                  pengawas
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Supervisi manajerial, mutu akademik sekolah & instrumen pembinaan berkala.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToTab('supervisi-pengawas')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-all text-center"
              >
                Supervisi Pengawas
              </button>
              <button
                onClick={() => onNavigateToTab('monitoring')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-sky-100 text-sky-800 text-xs font-bold hover:bg-sky-200 transition-all text-center"
              >
                Monitoring
              </button>
            </div>
          </div>

          {/* 2. Kepala Sekolah */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 hover:border-purple-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-purple-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Kepala Sekolah
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-purple-700 border border-purple-200">
                  ksgenius
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Monitoring kinerja sekolah, rekapitulasi data, kurva guru, dan supervisi akademik.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToTab('monitoring')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-all text-center"
              >
                Monitoring
              </button>
              <button
                onClick={() => onNavigateToTab('supervisi')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-purple-100 text-purple-800 text-xs font-bold hover:bg-purple-200 transition-all text-center"
              >
                Supervisi
              </button>
            </div>
          </div>

          {/* 3. Guru */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                  <School className="w-4 h-4" />
                  Guru / Pendidik
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-200">
                  guru
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Jurnal Mengajar harian, presensi pembiasaan pagi, ekstra GENIUS Class & kombel.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => onNavigateToTab('jurnal')}
                className="py-1.5 px-2 rounded-xl bg-[#6C63FF] text-white text-[11px] font-bold hover:bg-indigo-700 transition-all text-center"
              >
                Jurnal
              </button>
              <button
                onClick={() => onNavigateToTab('pembiasaan')}
                className="py-1.5 px-2 rounded-xl bg-indigo-100 text-indigo-800 text-[11px] font-bold hover:bg-indigo-200 transition-all text-center"
              >
                Pembiasaan
              </button>
            </div>
          </div>

          {/* 4. Pembina Ekskul */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 hover:border-amber-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  Pembina Ekskul
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-amber-800 border border-amber-200">
                  pembina
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                GENIUS Class (Pramuka, Tari, Silat, Futsal, OSN) & buku perkembangan bakat siswa.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToTab('genius-class')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-all text-center shadow-xs"
              >
                GENIUS Class
              </button>
              <button
                onClick={() => onNavigateToTab('administrasi')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold hover:bg-amber-200 transition-all text-center"
              >
                Buku Siswa
              </button>
            </div>
          </div>

          {/* 5. Murid */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 hover:border-rose-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Murid / Siswa
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-rose-700 border border-rose-200">
                  murid
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Jurnal 7 Kebiasaan Anak Hebat Indonesia & pembiasaan pagi sekolah.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToTab('seven-habits')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600 transition-all text-center shadow-xs"
              >
                7 Habits
              </button>
              <button
                onClick={() => onNavigateToTab('pembiasaan')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-rose-100 text-rose-800 text-xs font-bold hover:bg-rose-200 transition-all text-center"
              >
                Pembiasaan
              </button>
            </div>
          </div>

          {/* 6. Orang Tua */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  Orang Tua / Wali
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-emerald-800 border border-emerald-200">
                  orangtua
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Pendampingan 7 kebiasaan di rumah, jam tidur, gizi anak, dan paraf wali murid.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigateToTab('jurnal-orangtua')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all text-center shadow-xs"
              >
                Jurnal Ortu
              </button>
              <button
                onClick={() => onNavigateToTab('seven-habits')}
                className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold hover:bg-emerald-200 transition-all text-center"
              >
                7 Habits
              </button>
            </div>
          </div>

          {/* 7. Admin */}
          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Settings className="w-4 h-4 text-slate-600" />
                  Admin Profil
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                  admin
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Profil resmi SDN Tamansari, video panduan guru, dan backup database.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('profil')}
              className="w-full py-1.5 px-3 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 transition-all text-center"
            >
              Buka Profil Sekolah
            </button>
          </div>
        </div>
      </div>

      {/* Accounts & Passwords Table Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-emerald-600" />
              <span>Daftar Akun Pengguna & Kata Sandi Masing-Masing</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap peran memiliki kata sandi mandiri yang dapat disesuaikan sewaktu-waktu.
            </p>
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Total Terdaftar: <strong>{accounts.length} Akun</strong>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-3 px-3">Peran / Role</th>
                <th className="py-3 px-3">Nama Lengkap</th>
                <th className="py-3 px-3">Username</th>
                <th className="py-3 px-3">Password Saat Ini</th>
                <th className="py-3 px-3">Hak Akses / Deskripsi</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {accounts.map((acc) => {
                const isEditing = editingAccount?.username === acc.username;
                return (
                  <tr key={acc.username} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${getRoleBadge(
                          acc.role
                        )}`}
                      >
                        {acc.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-slate-800">{acc.name}</div>
                      {acc.nip && (
                        <div className="text-[10px] text-slate-400 font-mono">NIP: {acc.nip}</div>
                      )}
                      {acc.kelas && (
                        <div className="text-[10px] text-indigo-600 font-medium">Kelas: {acc.kelas}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-800">
                      {acc.username}
                    </td>
                    <td className="py-3.5 px-3">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Password baru..."
                            autoFocus
                            className="px-2.5 py-1 text-xs rounded-lg border border-emerald-500 focus:outline-none font-mono w-32"
                          />
                          <button
                            onClick={() => handleSavePassword(acc.username)}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                            title="Simpan Password"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingAccount(null);
                              setNewPassword('');
                            }}
                            className="p-1.5 bg-slate-200 text-slate-600 rounded-lg hover:bg-slate-300"
                            title="Batal"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px]">
                            {acc.password}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 text-[11px] max-w-xs">
                      {acc.deskripsi}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditingAccount(acc);
                            setNewPassword(acc.password);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-[#6C63FF] hover:bg-indigo-100 text-[11px] font-bold flex items-center gap-1 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Ubah Password</span>
                        </button>
                        {!['ksgenius', 'guru', 'murid', 'admin'].includes(acc.username) && (
                          <button
                            onClick={() => handleDeleteAccount(acc.username)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                            title="Hapus Akun"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Akun Baru */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-600" />
                  <span>Tambah Pengguna Baru</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddAccount} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Peran Akun</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-medium"
                  >
                    <option value="Pengawas">Pengawas Pembina Sekolah</option>
                    <option value="Kepala Sekolah">Kepala Sekolah (KS)</option>
                    <option value="Guru">Guru Kelas / Mapel</option>
                    <option value="Pembina Ekskul">Pembina Ekstrakurikuler</option>
                    <option value="Murid">Murid / Siswa</option>
                    <option value="Orang Tua">Orang Tua / Wali Murid</option>
                    <option value="Admin">Administrator Sistem</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Contoh: Budi Santoso, S.Pd / Ahmad Faiz"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Username Login</label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      placeholder="Username..."
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Password</label>
                    <input
                      type="text"
                      value={newAccountPass}
                      onChange={(e) => setNewAccountPass(e.target.value)}
                      placeholder="Password..."
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-mono"
                    />
                  </div>
                </div>

                {(newRole === 'Guru' || newRole === 'Murid') && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kelas (Opsional)</label>
                    <input
                      type="text"
                      value={newKelas}
                      onChange={(e) => setNewKelas(e.target.value)}
                      placeholder="Contoh: 4A, 5, dsb"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Keterangan / Deskripsi</label>
                  <input
                    type="text"
                    value={newDeskripsi}
                    onChange={(e) => setNewDeskripsi(e.target.value)}
                    placeholder="Contoh: Wali Kelas 3B / Siswa Berprestasi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800"
                  />
                </div>

                <div className="flex gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-500/20"
                  >
                    Simpan Akun
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

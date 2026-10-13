import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ClipboardCheck,
  GraduationCap,
  CalendarCheck,
  Trophy,
  Users,
  FolderKanban,
  Award,
  LineChart,
  KeyRound,
  HeartHandshake,
  ShieldCheck,
  X,
} from 'lucide-react';
import { UserRole } from '../types';

interface QuickMenuModalProps {
  isOpen: boolean;
  role?: UserRole;
  onClose: () => void;
  onSelectTab: (tabId: string) => void;
}

export const QuickMenuModal: React.FC<QuickMenuModalProps> = ({
  isOpen,
  role = 'Guru',
  onClose,
  onSelectTab,
}) => {
  const allMenuItems = [
    {
      id: 'monitoring',
      tab: 'monitoring',
      label: 'Monitoring Sekolah',
      description: 'Analitik, rekap semua fitur & kurva radar mutu sekolah',
      icon: LineChart,
      color: 'from-purple-600 to-indigo-700',
      roles: ['Pengawas', 'Kepala Sekolah', 'Admin'],
    },
    {
      id: 'supervisi-pengawas',
      tab: 'supervisi-pengawas',
      label: 'Supervisi Pengawas',
      description: 'Instrumen pembinaan manajerial KS & akademik guru',
      icon: ShieldCheck,
      color: 'from-sky-600 to-blue-700',
      roles: ['Pengawas', 'Kepala Sekolah', 'Admin'],
    },
    {
      id: 'supervisi',
      tab: 'supervisi',
      label: 'Supervisi Guru',
      description: 'Instrumen Pra, Observasi & Pasca, Jadwal Supervisi',
      icon: ClipboardCheck,
      color: 'from-amber-500 to-orange-500',
      roles: ['Kepala Sekolah', 'Pengawas', 'Admin'],
    },
    {
      id: 'jurnal',
      tab: 'jurnal',
      label: 'Jurnal Mengajar',
      description: 'Catatan harian mapel & absensi siswa (Batas 12 Siang)',
      icon: GraduationCap,
      color: 'from-[#6C63FF] to-[#8A85FF]',
      roles: ['Guru', 'Orang Tua', 'Admin'],
    },
    {
      id: 'jurnal-orangtua',
      tab: 'jurnal-orangtua',
      label: 'Jurnal Orang Tua',
      description: 'Pendampingan 7 kebiasaan di rumah & catatan wali kelas',
      icon: HeartHandshake,
      color: 'from-emerald-600 to-teal-700',
      roles: ['Orang Tua', 'Admin'],
    },
    {
      id: 'seven-habits',
      tab: 'seven-habits',
      label: 'Seven Habits',
      description: 'Jurnal 7 Kebiasaan Anak Hebat Indonesia',
      icon: Award,
      color: 'from-amber-500 to-rose-500',
      roles: ['Murid', 'Orang Tua', 'Guru', 'Admin'],
    },
    {
      id: 'genius-class',
      tab: 'genius-class',
      label: 'GENIUS Class (Ekstrakurikuler)',
      description: 'Pramuka, Silat, Tari, Futsal, Drumband, MIPAS OSN, Art, Sport',
      icon: Trophy,
      color: 'from-pink-500 to-rose-500',
      roles: ['Pembina Ekskul', 'Guru', 'Murid', 'Admin'],
    },
    {
      id: 'pembiasaan',
      tab: 'pembiasaan',
      label: 'Jurnal Pembiasaan',
      description: 'Upacara, Senam, Literasi, Numerasi, PAHALA',
      icon: CalendarCheck,
      color: 'from-emerald-500 to-teal-500',
      roles: ['Guru', 'Pembina Ekskul', 'Murid', 'Admin'],
    },
    {
      id: 'kombel',
      tab: 'kombel',
      label: 'Kombel GENIUS',
      description: 'Komunitas belajar & berbagi praktik baik guru',
      icon: Users,
      color: 'from-violet-500 to-purple-600',
      roles: ['Guru', 'Kepala Sekolah', 'Admin'],
    },
    {
      id: 'administrasi',
      tab: 'administrasi',
      label: 'Administrasi & Prestasi',
      description: 'Buku Kejadian, Kunjungan, Inventaris, Perkembangan Siswa',
      icon: FolderKanban,
      color: 'from-cyan-500 to-blue-600',
      roles: ['Guru', 'Pembina Ekskul', 'Kepala Sekolah', 'Admin'],
    },
    {
      id: 'admin',
      tab: 'admin',
      label: 'Kelola Pengguna',
      description: 'Atur password dan akun pengguna masing-masing peran',
      icon: KeyRound,
      color: 'from-emerald-600 to-teal-700',
      roles: ['Admin'],
    },
  ];

  const menuItems = allMenuItems.filter((item) => item.roles.includes(role));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-slate-100 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Menu Cepat ({role})</h3>
                <p className="text-xs text-slate-500">Pilih formulir atau modul kegiatan yang dituju</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.tab);
                      onClose();
                    }}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-[#6C63FF]/30 hover:shadow-lg hover:shadow-indigo-500/5 text-left transition-all group"
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${item.color} text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-[#6C63FF] transition-colors truncate">
                        {item.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

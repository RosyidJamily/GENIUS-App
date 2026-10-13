import React from 'react';
import { motion } from 'motion/react';
import { User, ActivityItem, TrafficStats } from '../types';
import { JournalDeadlineAlertBanner } from '../components/JournalDeadlineAlertBanner';
import {
  CalendarDays,
  CalendarRange,
  CalendarCheck2,
  Globe2,
  LineChart,
  ClipboardCheck,
  GraduationCap,
  CalendarCheck,
  Trophy,
  Users,
  FolderKanban,
  Clock,
  Trash2,
  LogOut,
  Sparkles,
  Flame,
  Award,
  KeyRound,
  ShieldCheck,
  Sunrise,
  Heart,
  Activity,
  Apple,
  BookOpen,
  Users2,
  Moon,
  CheckCircle2,
  ArrowRight,
  School,
  Settings,
  HeartHandshake,
} from 'lucide-react';
import { SpreadsheetStatusIndicator } from '../components/SpreadsheetStatusIndicator';

interface DashboardViewProps {
  user: User | null;
  traffic: TrafficStats;
  activities: ActivityItem[];
  onSelectTab: (tab: string) => void;
  onOpenMonitoring: () => void;
  onDeleteActivity: (id: string) => void;
  onClearAllActivities: () => void;
  onLogout: () => void;
  onNotify?: (msg: string, type: 'info' | 'success' | 'warning') => void;
  onOpenDatabaseModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  traffic,
  activities,
  onSelectTab,
  onOpenMonitoring,
  onDeleteActivity,
  onClearAllActivities,
  onLogout,
  onNotify,
  onOpenDatabaseModal,
}) => {
  const role = user?.role || 'Guru';

  // Role-specific action items
  const getRoleActions = () => {
    if (role === 'Pengawas') {
      return [
        {
          id: 'monitoring',
          label: 'Monitoring Mutu Sekolah',
          sub: 'Analitik Ketercapaian Jurnal, Presensi & Radar Guru',
          icon: LineChart,
          color: 'from-sky-600 to-blue-700',
          badge: 'Pengawas',
          action: onOpenMonitoring,
        },
        {
          id: 'supervisi-pengawas',
          label: 'Supervisi Pengawas',
          sub: 'Catatan Pembinaan KS, Guru & Rekomendasi Mutu',
          icon: ClipboardCheck,
          color: 'from-indigo-600 to-blue-600',
          badge: 'Manajerial',
          action: () => onSelectTab('supervisi-pengawas'),
        },
        {
          id: 'supervisi',
          label: 'Jadwal Supervisi Akademik',
          sub: 'Pantau Jadwal & Pelaksanaan Supervisi Guru',
          icon: CalendarCheck,
          color: 'from-amber-500 to-orange-600',
          badge: 'Jadwal',
          action: () => onSelectTab('supervisi'),
        },
        {
          id: 'profil',
          label: 'Profil SDN Tamansari',
          sub: 'Data Lembaga, Visi Misi, Guru & Rombel',
          icon: School,
          color: 'from-emerald-600 to-teal-700',
          badge: 'Lembaga',
          action: () => onSelectTab('profil'),
        },
      ];
    }

    if (role === 'Kepala Sekolah') {
      return [
        {
          id: 'monitoring',
          label: 'Monitoring Sekolah Terpadu',
          sub: 'Analitik, Rekap Semua Fitur & Radar Guru',
          icon: LineChart,
          color: 'from-purple-600 to-indigo-700',
          badge: 'Pimpinan',
          action: onOpenMonitoring,
        },
        {
          id: 'supervisi',
          label: 'Supervisi Akademik Guru',
          sub: 'Pra-Observasi, Observasi, Pasca & Jadwal',
          icon: ClipboardCheck,
          color: 'from-amber-500 to-orange-600',
          badge: 'Akademik',
          action: () => onSelectTab('supervisi'),
        },
        {
          id: 'supervisi-pengawas',
          label: 'Hasil Supervisi Pengawas',
          sub: 'Rekomendasi & Tindak Lanjut dari Pengawas Pembina',
          icon: ShieldCheck,
          color: 'from-blue-600 to-cyan-600',
          badge: 'Mutu',
          action: () => onSelectTab('supervisi-pengawas'),
        },
        {
          id: 'administrasi',
          label: 'Sarpras & Administrasi',
          sub: 'Inventaris Barang, Buku Tamu & Kejadian',
          icon: FolderKanban,
          color: 'from-cyan-500 to-blue-600',
          badge: 'Sarpras',
          action: () => onSelectTab('administrasi'),
        },
      ];
    }

    if (role === 'Guru') {
      return [
        {
          id: 'jurnal',
          label: 'Jurnal Mengajar',
          sub: 'Catatan Mapel, Absensi & Batas Jam 12 Siang',
          icon: GraduationCap,
          color: 'from-[#6C63FF] to-[#8A85FF]',
          badge: 'Wajib Harian',
          action: () => onSelectTab('jurnal'),
        },
        {
          id: 'pembiasaan',
          label: 'Pembiasaan Pagi',
          sub: 'Upacara, Senam, Literasi, Numerasi, PAHALA',
          icon: CalendarCheck,
          color: 'from-emerald-500 to-teal-600',
          badge: 'Karakter',
          action: () => onSelectTab('pembiasaan'),
        },
        {
          id: 'seven-habits',
          label: 'Seven Habits Kelas',
          sub: 'Jurnal 7 Kebiasaan Anak Hebat Indonesia',
          icon: Award,
          color: 'from-amber-500 to-rose-600',
          badge: 'Karakter',
          action: () => onSelectTab('seven-habits'),
        },
        {
          id: 'genius-class',
          label: 'GENIUS Class',
          sub: 'Ekstrakurikuler: MIPAS OSN, Pramuka, Drumband',
          icon: Trophy,
          color: 'from-pink-500 to-rose-600',
          badge: 'Ekstrakurikuler',
          action: () => onSelectTab('genius-class'),
        },
        {
          id: 'kombel',
          label: 'Kombel GENIUS',
          sub: 'Komunitas Belajar Guru & Berbagi Praktik Baik',
          icon: Users,
          color: 'from-purple-500 to-violet-700',
          badge: 'Kolaborasi',
          action: () => onSelectTab('kombel'),
        },
        {
          id: 'administrasi',
          label: 'Administrasi Kelas',
          sub: 'Buku Kejadian, Kunjungan, Inventaris, & Siswa',
          icon: FolderKanban,
          color: 'from-cyan-500 to-blue-600',
          badge: '4 Buku',
          action: () => onSelectTab('administrasi'),
        },
      ];
    }

    if (role === 'Pembina Ekskul') {
      return [
        {
          id: 'genius-class',
          label: 'GENIUS Class (Jurnal Ekskul)',
          sub: 'Catat Latihan, Silabus OSN, Materi & Presensi Anggota',
          icon: Trophy,
          color: 'from-amber-500 to-orange-600',
          badge: 'Utama Ekskul',
          action: () => onSelectTab('genius-class'),
        },
        {
          id: 'administrasi',
          label: 'Perkembangan Bakat Siswa',
          sub: 'Buku Perkembangan, Prestasi & Portofolio Siswa',
          icon: FolderKanban,
          color: 'from-pink-500 to-rose-600',
          badge: 'Prestasi',
          action: () => onSelectTab('administrasi'),
        },
        {
          id: 'pembiasaan',
          label: 'Jurnal Pembiasaan Sekolah',
          sub: 'Senam Anak Hebat, Baris Berbaris, & Kedisiplinan',
          icon: CalendarCheck,
          color: 'from-emerald-500 to-teal-600',
          badge: 'Disiplin',
          action: () => onSelectTab('pembiasaan'),
        },
        {
          id: 'profil',
          label: 'Profil Program Ekstra',
          sub: 'Daftar 20 Program Ekstrakurikuler SDN Tamansari',
          icon: School,
          color: 'from-blue-500 to-indigo-600',
          badge: 'Ekskul',
          action: () => onSelectTab('profil'),
        },
      ];
    }

    if (role === 'Murid') {
      return [
        {
          id: 'seven-habits',
          label: 'Seven Habits (Anak Hebat)',
          sub: 'Check-in Mandiri 7 Kebiasaan Anak Hebat Indonesia',
          icon: Award,
          color: 'from-amber-500 to-rose-600',
          badge: 'Karakter Siswa',
          action: () => onSelectTab('seven-habits'),
        },
        {
          id: 'genius-class',
          label: 'Kegiatan Ekstrakurikuler',
          sub: 'Lihat Catatan Kegiatan Klub & Ekstra yang Diikuti',
          icon: Trophy,
          color: 'from-pink-500 to-purple-600',
          badge: 'Ekskul Saya',
          action: () => onSelectTab('genius-class'),
        },
        {
          id: 'pembiasaan',
          label: 'Pembiasaan Pagi',
          sub: 'Upacara, Senam, Literasi, Numerasi & PAHALA',
          icon: CalendarCheck,
          color: 'from-emerald-500 to-teal-600',
          badge: 'Pagi Hari',
          action: () => onSelectTab('pembiasaan'),
        },
        {
          id: 'profil',
          label: 'Profil SDN Tamansari',
          sub: 'Visi Misi Sekolah & Bintang Prestasi',
          icon: School,
          color: 'from-indigo-500 to-blue-600',
          badge: 'Sekolah',
          action: () => onSelectTab('profil'),
        },
      ];
    }

    if (role === 'Orang Tua') {
      return [
        {
          id: 'jurnal-orangtua',
          label: 'Jurnal Pendampingan Rumah',
          sub: 'Isi Jurnal 7 Kebiasaan Anak di Rumah & Pesan Guru',
          icon: HeartHandshake,
          color: 'from-emerald-600 to-teal-700',
          badge: 'Orang Tua',
          action: () => onSelectTab('jurnal-orangtua'),
        },
        {
          id: 'seven-habits',
          label: 'Pantau Seven Habits Anak',
          sub: 'Lihat Rekap 7 Kebiasaan Anak Hebat Kelas 4A',
          icon: Award,
          color: 'from-amber-500 to-rose-600',
          badge: 'Karakter',
          action: () => onSelectTab('seven-habits'),
        },
        {
          id: 'jurnal',
          label: 'Pantau Jurnal Mengajar',
          sub: 'Cek Catatan Materi Pelajaran & Presensi Anak',
          icon: GraduationCap,
          color: 'from-[#6C63FF] to-[#8A85FF]',
          badge: 'Pembelajaran',
          action: () => onSelectTab('jurnal'),
        },
        {
          id: 'profil',
          label: 'Layanan & Profil Sekolah',
          sub: 'Kontak Sekolah, Guru Wali Kelas & Kegiatan',
          icon: School,
          color: 'from-cyan-600 to-blue-700',
          badge: 'Sekolah',
          action: () => onSelectTab('profil'),
        },
      ];
    }

    // Admin role gets full system access
    return [
      {
        id: 'admin',
        label: 'Kelola Pengguna & Password',
        sub: 'Atur Password Pengawas, KS, Guru, Pembina, Murid, Ortu',
        icon: KeyRound,
        color: 'from-emerald-600 to-teal-700',
        badge: 'Master Admin',
        action: () => onSelectTab('admin'),
      },
      {
        id: 'monitoring',
        label: 'Monitoring & Rekap Semua Fitur',
        sub: 'Ekspor Excel, Word, PDF & Analisis',
        icon: LineChart,
        color: 'from-purple-600 to-indigo-700',
        badge: 'Penuh',
        action: onOpenMonitoring,
      },
      {
        id: 'supervisi',
        label: 'Supervisi Guru',
        sub: 'Pra, Observasi, Pasca & Jadwal',
        icon: ClipboardCheck,
        color: 'from-amber-500 to-orange-600',
        badge: 'Akademik',
        action: () => onSelectTab('supervisi'),
      },
      {
        id: 'supervisi-pengawas',
        label: 'Supervisi Pengawas',
        sub: 'Catatan Pembinaan & Rekomendasi Mutu Sekolah',
        icon: ShieldCheck,
        color: 'from-blue-600 to-indigo-600',
        badge: 'Pengawas',
        action: () => onSelectTab('supervisi-pengawas'),
      },
      {
        id: 'jurnal-orangtua',
        label: 'Rekap Jurnal Orang Tua',
        sub: 'Monitoring Pendampingan Karakter di Rumah',
        icon: HeartHandshake,
        color: 'from-teal-600 to-emerald-700',
        badge: 'Orang Tua',
        action: () => onSelectTab('jurnal-orangtua'),
      },
      {
        id: 'jurnal',
        label: 'Jurnal Mengajar Guru',
        sub: 'Review Pengisian Jurnal & Batas Jam 12 Siang',
        icon: GraduationCap,
        color: 'from-[#6C63FF] to-[#8A85FF]',
        badge: 'Pembelajaran',
        action: () => onSelectTab('jurnal'),
      },
      {
        id: 'seven-habits',
        label: 'Seven Habits (Murid)',
        sub: 'Jurnal 7 Kebiasaan Anak Hebat Indonesia',
        icon: Award,
        color: 'from-amber-500 to-rose-600',
        badge: 'Karakter Siswa',
        action: () => onSelectTab('seven-habits'),
      },
      {
        id: 'genius-class',
        label: 'GENIUS Class (Ekskul)',
        sub: 'MIPAS OSN, Pramuka, Drumband, Seni, Olahraga',
        icon: Trophy,
        color: 'from-pink-500 to-rose-600',
        badge: 'Ekstrakurikuler',
        action: () => onSelectTab('genius-class'),
      },
    ];
  };

  const quickActions = getRoleActions();

  // Habit list details for Murid display
  const sevenHabitsList = [
    {
      num: 1,
      title: 'Bangun Pagi',
      desc: 'Melatih disiplin dan menghargai waktu sejak dini.',
      icon: Sunrise,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
    {
      num: 2,
      title: 'Beribadah',
      desc: 'Membangun fondasi spiritual dan nilai moral yang kuat.',
      icon: Heart,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      num: 3,
      title: 'Berolahraga',
      desc: 'Menjaga kebugaran tubuh serta kesehatan mental.',
      icon: Activity,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    },
    {
      num: 4,
      title: 'Makan Sehat dan Bergizi',
      desc: 'Memenuhi nutrisi seimbang untuk tumbuh kembang optimal.',
      icon: Apple,
      color: 'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      num: 5,
      title: 'Gemar Belajar',
      desc: 'Menumbuhkan rasa ingin tahu dan semangat sepanjang hayat.',
      icon: BookOpen,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      num: 6,
      title: 'Bermasyarakat',
      desc: 'Belajar bergotong royong dan peduli kepada sesama.',
      icon: Users2,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      num: 7,
      title: 'Tidur Cepat',
      desc: 'Memulihkan energi agar tubuh kembali bugar esok hari.',
      icon: Moon,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner based on Role */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden rounded-3xl text-white p-6 sm:p-8 shadow-xl ${
          role === 'Pengawas'
            ? 'bg-gradient-to-r from-sky-700 via-blue-800 to-indigo-900 shadow-sky-950/20'
            : role === 'Kepala Sekolah'
            ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-900 shadow-purple-950/20'
            : role === 'Pembina Ekskul'
            ? 'bg-gradient-to-r from-amber-600 via-orange-600 to-rose-700 shadow-orange-950/20'
            : role === 'Murid'
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 shadow-orange-950/20'
            : role === 'Orang Tua'
            ? 'bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 shadow-emerald-950/20'
            : role === 'Admin'
            ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-800 shadow-teal-950/20'
            : 'bg-gradient-to-r from-[#6C63FF] via-[#7F77FF] to-[#5651D9] shadow-indigo-900/10'
        }`}
      >
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold backdrop-blur-xs mb-2.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {role === 'Pengawas'
                  ? 'Portal Pengawas Pembina Sekolah • SDN Tamansari'
                  : role === 'Kepala Sekolah'
                  ? 'Portal Pimpinan & Supervisi • SDN Tamansari'
                  : role === 'Pembina Ekskul'
                  ? 'Portal Pembina Ekstrakurikuler • GENIUS Class'
                  : role === 'Murid'
                  ? 'Portal Anak Hebat Indonesia • SDN Tamansari'
                  : role === 'Orang Tua'
                  ? 'Portal Orang Tua / Wali Murid • Pendampingan Karakter'
                  : role === 'Admin'
                  ? 'Portal Administrasi Sistem • SDN Tamansari'
                  : 'Portal Pendidik Hebat • SDN Tamansari'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {user?.name || 'Pengguna GENIUS'}!
            </h2>
            <p className="text-white/90 text-xs sm:text-sm mt-1.5 max-w-xl font-normal leading-relaxed">
              {role === 'Pengawas'
                ? 'Lakukan monitoring ketercapaian mutu sekolah, supervisi manajerial kepala sekolah dan akademik guru, serta berikan rekomendasi pembinaan.'
                : role === 'Kepala Sekolah'
                ? 'Pantau mutu pembelajaran harian, evaluasi kurva kompetensi guru, dan laksanakan supervisi akademik terstruktur.'
                : role === 'Pembina Ekskul'
                ? 'Kelola kegiatan ekstrakurikuler (GENIUS Class), catat materi silabus, presensi anggota, serta pantau bakat dan prestasi siswa.'
                : role === 'Murid'
                ? 'Mari catat pembiasaan 7 Kebiasaan Anak Hebat Indonesia setiap hari untuk menjadi generasi cerdas, berkarakter, dan berprestasi!'
                : role === 'Orang Tua'
                ? 'Dampingi dan pantau 7 kebiasaan ananda di rumah (bangun subuh, sholat/ibadah, sarapan bergizi, belajar mandiri, & tidur teratur) serta jalin komunikasi dengan wali kelas.'
                : role === 'Admin'
                ? 'Kelola kata sandi akun masing-masing peran, pantau seluruh modul, dan unduh rekap data komprehensif.'
                : 'Catat jurnal pembelajaran harian sebelum jam 12:00 siang, isi presensi pembiasaan, serta kelola administrasi kelas dengan tertib.'}
            </p>

            <div className="mt-3 flex items-center gap-2">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white uppercase tracking-wider">
                Peran: {role}
              </span>
              {user?.kelas && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/15 text-white">
                  Kelas {user.kelas.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {role === 'Admin' && (
              <button
                onClick={() => onSelectTab('admin')}
                className="px-3.5 py-2.5 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 active:scale-95 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Kelola Password</span>
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold transition-all flex items-center gap-2 backdrop-blur-xs border border-white/20"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </div>

        {/* Decorative circle shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-16 right-32 w-40 h-40 rounded-full bg-white/10 blur-lg pointer-events-none" />
      </motion.div>

      {/* Teacher or Headmaster/Admin: Deadline Alert Banner */}
      {(role === 'Guru' || role === 'Kepala Sekolah' || role === 'Admin') && (
        <JournalDeadlineAlertBanner
          user={user}
          onGoToJournal={() => onSelectTab('jurnal')}
          onGoToMonitoring={onOpenMonitoring}
          onNotify={onNotify}
        />
      )}

      {/* Indikator Real-time Database Spreadsheet */}
      <SpreadsheetStatusIndicator
        variant="card"
        onOpenSettings={onOpenDatabaseModal}
      />

      {/* Main Quick Actions Menu Grid (Separated for each Role) */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#6C63FF]" />
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              {role === 'Kepala Sekolah'
                ? 'Menu Utama Kepala Sekolah'
                : role === 'Murid'
                ? 'Menu Utama Siswa'
                : role === 'Admin'
                ? 'Menu Master Administrator'
                : 'Menu Utama Guru'}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {quickActions.length} Menu Tersedia
          </span>
        </div>

        <div
          className={`grid gap-3.5 ${
            role === 'Murid'
              ? 'grid-cols-1'
              : role === 'Kepala Sekolah'
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <motion.button
                key={action.id}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={action.action}
                className={`bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 text-left transition-all flex flex-col justify-between group relative overflow-hidden ${
                  role === 'Murid' ? 'h-36 sm:h-32' : 'h-40'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${action.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {action.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                      {action.badge}
                    </span>
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-[#6C63FF] transition-colors line-clamp-1">
                    {action.label}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium line-clamp-1 mt-0.5">
                    {action.sub}
                  </p>
                </div>
                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-[#6C63FF] font-bold">Buka →</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* SPECIAL SECTION FOR MURID: Interactive 7 Kebiasaan Anak Hebat Indonesia */}
      {role === 'Murid' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-2">
                <Award className="w-3.5 h-3.5" />
                <span>Seven Habits • Generasi Unggul Indonesia</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-800">
                7 Kebiasaan Anak Hebat Indonesia
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Biasakan setiap hari sejak dini untuk masa depan yang gemilang di SDN Tamansari.
              </p>
            </div>
            <button
              onClick={() => onSelectTab('seven-habits')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>Isi Jurnal Seven Habits Sekarang</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {sevenHabitsList.map((habit) => {
              const HabitIcon = habit.icon;
              return (
                <div
                  key={habit.num}
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-amber-200 hover:shadow-md transition-all flex items-start gap-3.5 group"
                >
                  <div
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${habit.color}`}
                  >
                    <HabitIcon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700 font-mono">
                        #{habit.num}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm group-hover:text-amber-600 transition-colors">
                        {habit.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">
                      {habit.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-200/60 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌟</span>
              <div>
                <h5 className="font-bold text-xs sm:text-sm text-slate-800">
                  Target Bintang Kebiasaan Hari Ini
                </h5>
                <p className="text-[11px] text-slate-600">
                  Lakukan 7 kebiasaan di atas dan dapatkan bintang apresiasi dari Bapak/Ibu Guru!
                </p>
              </div>
            </div>
            <button
              onClick={() => onSelectTab('seven-habits')}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 underline underline-offset-4"
            >
              <span>Buka Formulir Jurnal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Visitor Traffic Stats for School Community */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Globe2 className="w-4 h-4 text-[#6C63FF]" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Statistik Kunjungan Portal Sekolah
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-indigo-600 mb-2">
              <div className="p-2 rounded-xl bg-indigo-50">
                <CalendarDays className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Hari Ini</span>
            </div>
            <p className="text-2xl font-black text-slate-800">{traffic.todayVisits}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Aktivitas harian</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <div className="p-2 rounded-xl bg-purple-50">
                <CalendarRange className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Minggu Ini</span>
            </div>
            <p className="text-2xl font-black text-slate-800">{traffic.weekVisits}</p>
            <span className="text-[11px] text-purple-600 font-medium">Kunjungan mingguan</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <div className="p-2 rounded-xl bg-amber-50">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Bulan Ini</span>
            </div>
            <p className="text-2xl font-black text-slate-800">{traffic.monthVisits}</p>
            <span className="text-[11px] text-amber-600 font-medium">Rekap bulanan</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-emerald-600 mb-2">
              <div className="p-2 rounded-xl bg-emerald-50">
                <Globe2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-500">Total Kunjungan</span>
            </div>
            <p className="text-2xl font-black text-slate-800">{traffic.totalVisits}</p>
            <span className="text-[11px] text-slate-400 font-medium">SDN Tamansari</span>
          </div>
        </div>
      </div>

      {/* Recent Activities Section (Filtered/Relevant for User) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 text-[#6C63FF]">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Aktivitas Terkini Sekolah</h3>
              <p className="text-xs text-slate-400">Riwayat pengisian dan kegiatan terbaru</p>
            </div>
          </div>

          {(role === 'Kepala Sekolah' || role === 'Admin') && activities.length > 0 && (
            <button
              onClick={onClearAllActivities}
              className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
          )}
        </div>

        {activities.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            Belum ada aktivitas tercatat hari ini.
          </div>
        ) : (
          <div className="space-y-3">
            {activities.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-400 font-semibold">{act.time}</span>
                  <div>
                    <span className="font-bold text-slate-800">{act.activity}</span>
                    <span className="text-slate-500 ml-2">{act.detail}</span>
                    <span className="text-indigo-600 font-medium ml-2">• {act.user}</span>
                  </div>
                </div>
                {(role === 'Kepala Sekolah' || role === 'Admin') && (
                  <button
                    onClick={() => onDeleteActivity(act.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                    title="Hapus aktivitas"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { GURU_LIST } from '../data/initialData';
import { ActivityItem, SupervisiData } from '../types';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  ArrowLeft,
  LineChart as ChartIcon,
  RefreshCw,
  ClipboardCheck,
  GraduationCap,
  CalendarCheck,
  Trophy,
  Users,
  FolderKanban,
  UserCheck,
  Sparkles,
  Award,
  BookOpen,
  FileSpreadsheet,
  FileText,
  FileDown,
  ArrowRight,
  AlertTriangle,
  Clock,
  UserX,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { RekapMonitoringSection } from '../components/RekapMonitoringSection';
import { checkTodayJournalStatus } from '../services/journalReminderService';

interface MonitoringViewProps {
  onBack: () => void;
  activities: ActivityItem[];
  supervisions: SupervisiData[];
  onRefresh: () => void;
  onNotify?: (message: string, type: 'success' | 'info') => void;
}

export const MonitoringView: React.FC<MonitoringViewProps> = ({
  onBack,
  activities,
  supervisions,
  onRefresh,
  onNotify,
}) => {
  const [viewMode, setViewMode] = useState<'monitoring' | 'rekap'>('monitoring');
  const [period, setPeriod] = useState<'harian' | 'mingguan' | 'bulanan' | 'tahunan'>('harian');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // Status Jurnal Mengajar Hari Ini (Batas Maksimal Jam 12 Siang)
  const journalStatus = useMemo(() => {
    return checkTodayJournalStatus({ name: 'Kepala Sekolah', role: 'Kepala Sekolah', username: 'ks' });
  }, [activities, isRefreshing]);

  const handleBroadcastWaReminder = () => {
    if (journalStatus.unsubmittedTeachers.length === 0) return;
    const text = encodeURIComponent(
      `*PEMBERITAHUAN RESMI KEPALA SEKOLAH - SDN TAMANSARI*\n\n` +
      `Bapak/Ibu Guru yang kami hormati,\n` +
      `Mengingatkan kembali batas waktu pengisian *Jurnal Mengajar Harian* maksimal adalah *pukul 12:00 siang*.\n\n` +
      `Mohon bagi yang belum melengkapi jurnal mengajar & presensi siswa hari ini (${journalStatus.todayFormatted}) untuk segera mengisi melalui GENIUS App.\n\n` +
      `Terima kasih.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Filter activities by period & teacher
  const filteredActivities = useMemo(() => {
    const now = new Date();
    let startDate: Date;

    if (period === 'harian') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'mingguan') {
      startDate = new Date(now);
      startDate.setDate(now.getDate() - now.getDay());
      startDate.setHours(0, 0, 0, 0);
    } else if (period === 'bulanan') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    return activities.filter((act) => {
      const actDate = new Date(act.timestamp);
      const isPeriodMatch = actDate >= startDate;
      const isTeacherMatch = selectedTeacher === 'all' || act.user.includes(selectedTeacher);
      return isPeriodMatch && isTeacherMatch;
    });
  }, [activities, period, selectedTeacher]);

  // Aggregated Counts
  const counts = useMemo(() => {
    const res = {
      supervisi: 0,
      jurnal: 0,
      pembiasaan: 0,
      sevenHabits: 0,
      geniusClass: 0,
      kombel: 0,
      administrasi: 0,
    };

    filteredActivities.forEach((act) => {
      if (act.type === 'supervisi') res.supervisi++;
      else if (act.type === 'jurnal') res.jurnal++;
      else if (act.type === 'pembiasaan') res.pembiasaan++;
      else if (act.type === 'seven-habits') res.sevenHabits++;
      else if (act.type === 'genius-class') res.geniusClass++;
      else if (act.type === 'kombel') res.kombel++;
      else res.administrasi++;
    });

    return res;
  }, [filteredActivities]);

  // Pra Observasi Radar Data Calculation
  const praRadarData = useMemo(() => {
    const indicators = [
      { key: 'Modul Ajar', label: 'Modul Ajar' },
      { key: 'Materi', label: 'Materi' },
      { key: 'Media/bahan ajar', label: 'Media Ajar' },
      { key: 'LKPD', label: 'LKPD' },
      { key: 'Kisi-kisi soal', label: 'Kisi Soal' },
      { key: 'Soal/instrumen penilaian', label: 'Instrumen' },
      { key: 'Rubrik penskoran', label: 'Rubrik' },
      { key: 'Lembar analisis penilaian', label: 'Analisis' },
      { key: 'Program remidi & pengayaan', label: 'Remidi' },
    ];

    const targetSupervisions = supervisions.filter(
      (s) => (selectedTeacher === 'all' || s.guru === selectedTeacher) && s.praObservasi?.items
    );

    if (targetSupervisions.length === 0) {
      return indicators.map((ind) => ({ subject: ind.label, score: 3.5, fullMark: 4 }));
    }

    return indicators.map((ind) => {
      let sum = 0;
      let count = 0;
      targetSupervisions.forEach((s) => {
        const item = s.praObservasi?.items.find((i) => i.indicator.includes(ind.key));
        if (item) {
          sum += item.score;
          count++;
        }
      });
      const avg = count > 0 ? Number((sum / count).toFixed(1)) : 3.5;
      return {
        subject: ind.label,
        score: avg,
        fullMark: 4,
      };
    });
  }, [supervisions, selectedTeacher]);

  // Observasi Radar Data Calculation
  const obsRadarData = useMemo(() => {
    const indicators = [
      { key: 'tujuan', label: 'Tujuan Belajar' },
      { key: 'apersepsi', label: 'Apersepsi' },
      { key: 'materi', label: 'Penguasaan Materi' },
      { key: 'metode', label: 'Variasi Metode' },
      { key: 'media', label: 'Media/Sumber' },
      { key: 'aktif', label: 'Keaktifan Siswa' },
      { key: 'waktu', label: 'Manajemen Waktu' },
      { key: 'proses', label: 'Penilaian Proses' },
      { key: 'umpan', label: 'Umpan Balik' },
      { key: 'penutupan', label: 'Refleksi/Penutup' },
    ];

    const targetSupervisions = supervisions.filter(
      (s) => (selectedTeacher === 'all' || s.guru === selectedTeacher) && s.observasi?.items
    );

    if (targetSupervisions.length === 0) {
      return indicators.map((ind) => ({ subject: ind.label, score: 3.7, fullMark: 4 }));
    }

    return indicators.map((ind, idx) => {
      let sum = 0;
      let count = 0;
      targetSupervisions.forEach((s) => {
        const item = s.observasi?.items[idx];
        if (item) {
          sum += item.score;
          count++;
        }
      });
      const avg = count > 0 ? Number((sum / count).toFixed(1)) : 3.8;
      return {
        subject: ind.label,
        score: avg,
        fullMark: 4,
      };
    });
  }, [supervisions, selectedTeacher]);

  // Distribution chart data
  const distributionData = [
    { name: 'Supervisi', total: counts.supervisi, fill: '#FF9500' },
    { name: 'Jurnal', total: counts.jurnal, fill: '#6C63FF' },
    { name: 'Pembiasaan', total: counts.pembiasaan, fill: '#10B981' },
    { name: 'Seven Habits', total: counts.sevenHabits, fill: '#F59E0B' },
    { name: 'GENIUS Class', total: counts.geniusClass, fill: '#EC4899' },
    { name: 'Kombel', total: counts.kombel, fill: '#8B5CF6' },
    { name: 'Administrasi', total: counts.administrasi, fill: '#06B6D4' },
  ];

  // Daily timeline data
  const dailyTimelineData = useMemo(() => {
    const map = new Map<string, number>();
    const now = new Date();
    // generate past 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const key = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      map.set(key, 0);
    }

    activities.forEach((act) => {
      const actD = new Date(act.timestamp);
      const key = actD.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
      if (map.has(key)) {
        map.set(key, (map.get(key) || 0) + 1);
      }
    });

    return Array.from(map.entries()).map(([day, total]) => ({ day, total }));
  }, [activities]);

  // Teacher recommendations
  const recommendations = useMemo(() => {
    const list: { guru: string; date: string; rekomendasi: string; hasil: string }[] = [];
    supervisions.forEach((s) => {
      if (selectedTeacher === 'all' || s.guru === selectedTeacher) {
        list.push({
          guru: s.guru,
          date: s.date,
          rekomendasi: s.tindakLanjut || 'Tingkatkan asesmen formatif',
          hasil: s.hasil || 'Baik',
        });
      }
    });
    return list.slice(0, 6);
  }, [supervisions, selectedTeacher]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-xs w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        {/* View Switcher: Monitoring vs Rekap */}
        <div className="flex p-1 bg-white border border-slate-200/80 rounded-2xl shadow-xs">
          <button
            onClick={() => setViewMode('monitoring')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'monitoring'
                ? 'bg-[#6C63FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ChartIcon className="w-3.5 h-3.5" />
            <span>Grafik & Radar</span>
          </button>
          <button
            onClick={() => setViewMode('rekap')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              viewMode === 'rekap'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
            <span>Rekap & Unduh Semua Fitur</span>
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          {viewMode === 'monitoring' ? (
            <button
              onClick={() => setViewMode('rekap')}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all active:scale-95"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Menu Rekap & Unduh</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('monitoring')}
              className="px-4 py-2 rounded-2xl bg-[#6C63FF] hover:bg-[#5952d4] text-white font-bold text-xs shadow-xs flex items-center gap-2 transition-all active:scale-95"
            >
              <ChartIcon className="w-3.5 h-3.5" />
              <span>Lihat Grafik</span>
            </button>
          )}

          <button
            onClick={handleRefreshClick}
            className="p-2.5 rounded-2xl bg-white border border-slate-200 hover:border-[#6C63FF] text-[#6C63FF] font-bold text-xs transition-all flex items-center gap-2 shadow-xs"
            title="Segarkan Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {viewMode === 'rekap' ? (
        <RekapMonitoringSection onNotify={onNotify} />
      ) : (
        <>
          {/* Quick Rekap Shortcut Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight">
                  Rekapitulasi Laporan Semua Fitur (Excel, Word, PDF)
                </h4>
                <p className="text-xs text-emerald-100 font-normal mt-0.5">
                  Unduh seluruh hasil input Jurnal Mengajar, Supervisi, Pembiasaan, OSN 2026, Kombel, dan Administrasi secara instan.
                </p>
              </div>
            </div>
            <button
              onClick={() => setViewMode('rekap')}
              className="px-4 py-2 rounded-2xl bg-white text-emerald-800 font-extrabold text-xs shadow-sm hover:bg-emerald-50 active:scale-95 transition-all shrink-0 flex items-center gap-1.5"
            >
              <span>Buka Menu Rekap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Pemantauan Kepatuhan Jurnal Mengajar Hari Ini (Deadline Pukul 12:00 Siang) */}
          <div className={`rounded-3xl p-5 sm:p-6 border transition-all shadow-md ${
            journalStatus.unsubmittedTeachers.length === 0
              ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border-emerald-200'
              : journalStatus.isPast12
              ? 'bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-white border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-gradient-to-r from-indigo-500/10 via-blue-500/5 to-white border-indigo-200'
          }`}>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  journalStatus.unsubmittedTeachers.length === 0
                    ? 'bg-emerald-500 text-white'
                    : journalStatus.isPast12
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-indigo-600 text-white'
                }`}>
                  {journalStatus.unsubmittedTeachers.length === 0 ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : journalStatus.isPast12 ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <Clock className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      journalStatus.unsubmittedTeachers.length === 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : journalStatus.isPast12
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}>
                      {journalStatus.unsubmittedTeachers.length === 0
                        ? 'Semua Guru Sudah Mengisi'
                        : journalStatus.isPast12
                        ? '⚠️ Melewati Pukul 12:00 Siang'
                        : 'Menjelang Batas Pukul 12:00 Siang'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      Batas Harian: 12:00 WIB • {journalStatus.todayFormatted}
                    </span>
                  </div>

                  <h3 className={`text-base font-black tracking-tight ${
                    journalStatus.unsubmittedTeachers.length === 0
                      ? 'text-emerald-950'
                      : journalStatus.isPast12
                      ? 'text-rose-950'
                      : 'text-indigo-950'
                  }`}>
                    {journalStatus.unsubmittedTeachers.length === 0
                      ? '100% Guru Telah Mengisi Jurnal Mengajar Hari Ini'
                      : journalStatus.isPast12
                      ? `Peringatan: ${journalStatus.unsubmittedTeachers.length} Guru Belum Mengisi Jurnal Mengajar Lewat Jam 12 Siang`
                      : `Monitoring Pengisian Jurnal Hari Ini: ${journalStatus.submittedTeachers.length}/${journalStatus.totalTeachers} Guru`}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                    {journalStatus.isPast12 && journalStatus.unsubmittedTeachers.length > 0 ? (
                      <>
                        Waktu telah melewati batas pukul 12:00 siang. Guru berikut belum menginput jurnal pembelajaran & presensi siswa hari ini:
                      </>
                    ) : (
                      <>
                        Rekap kepatuhan guru SDN Tamansari mengisi jurnal mengajar dan kehadiran siswa sebelum batas waktu maksimal pukul 12:00 siang.
                      </>
                    )}
                  </p>

                  {/* List guru yang belum mengisi */}
                  {journalStatus.unsubmittedTeachers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {journalStatus.unsubmittedTeachers.map((g) => (
                        <span
                          key={g}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white border border-rose-200 text-rose-700 font-bold text-[11px] shadow-2xs"
                        >
                          <UserX className="w-3 h-3 text-rose-500" />
                          <span>{g}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              {journalStatus.unsubmittedTeachers.length > 0 && (
                <div className="flex items-center gap-2 shrink-0 self-start lg:self-auto">
                  <button
                    onClick={handleBroadcastWaReminder}
                    className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs shadow-md shadow-emerald-900/10 flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Ingatkan via WA ({journalStatus.unsubmittedTeachers.length} Guru)</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Main Title Card */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-indigo-900/5"
          >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ChartIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-800 tracking-tight">
                  Monitoring Kepala Sekolah
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-[#6C63FF] text-[10px] font-bold">
                  SDN Tamansari
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pemantauan capaian kinerja guru, supervisi kurikulum, dan rekapitulasi sekolah
              </p>
            </div>
          </div>

          {/* Filters: Period & Teacher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Period Tabs */}
            <div className="flex p-1 bg-slate-100 rounded-2xl">
              {(['harian', 'mingguan', 'bulanan', 'tahunan'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                    period === p
                      ? 'bg-white text-[#6C63FF] shadow-xs'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Teacher filter */}
            <div className="relative">
              <select
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                className="w-full sm:w-48 px-3.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6C63FF]"
              >
                <option value="all">Semua Guru (11 Guru)</option>
                {GURU_LIST.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Counter Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-6">
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center mx-auto mb-2">
              <ClipboardCheck className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-amber-700">{counts.supervisi}</p>
            <span className="text-[11px] font-bold text-amber-900/70">Supervisi</span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-[#6C63FF] text-white flex items-center justify-center mx-auto mb-2">
              <GraduationCap className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-[#6C63FF]">{counts.jurnal}</p>
            <span className="text-[11px] font-bold text-indigo-900/70">Jurnal Mengajar</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center mx-auto mb-2">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-emerald-700">{counts.pembiasaan}</p>
            <span className="text-[11px] font-bold text-emerald-900/70">Pembiasaan</span>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center mx-auto mb-2">
              <Award className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-orange-700">{counts.sevenHabits}</p>
            <span className="text-[11px] font-bold text-orange-900/70">Seven Habits</span>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/60 border border-pink-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-pink-500 text-white flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-pink-700">{counts.geniusClass}</p>
            <span className="text-[11px] font-bold text-pink-900/70">GENIUS Class</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mx-auto mb-2">
              <Users className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-purple-700">{counts.kombel}</p>
            <span className="text-[11px] font-bold text-purple-900/70">Kombel GENIUS</span>
          </div>

          <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-100 text-center">
            <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center mx-auto mb-2">
              <FolderKanban className="w-4 h-4" />
            </div>
            <p className="text-2xl font-black text-cyan-700">{counts.administrasi}</p>
            <span className="text-[11px] font-bold text-cyan-900/70">Administrasi</span>
          </div>
        </div>

        {/* Kurva Radar Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Radar 1: Pra Observasi */}
          <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#6C63FF]" />
                  <span>Kurva Radar: Pra Observasi (Perangkat Ajar)</span>
                </h3>
                <p className="text-[11px] text-slate-400">Rata-rata 9 indikator administrasi (Skor maks. 4.0)</p>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={praRadarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 4]} stroke="#CBD5E1" />
                  <Radar
                    name="Rata-rata Skor"
                    dataKey="score"
                    stroke="#6C63FF"
                    fill="#6C63FF"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value} / 4.0`, 'Skor Rata-rata']}
                    contentStyle={{ borderRadius: 16, fontSize: 12, border: '1px solid #E2E8F0' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Radar 2: Observasi Kelas */}
          <div className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-pink-500" />
                  <span>Kurva Radar: Observasi Pembelajaran</span>
                </h3>
                <p className="text-[11px] text-slate-400">Rata-rata 10 indikator proses pembelajaran kelas (Skor maks. 4.0)</p>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={obsRadarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: '#475569', fontSize: 10, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 4]} stroke="#CBD5E1" />
                  <Radar
                    name="Rata-rata Skor"
                    dataKey="score"
                    stroke="#FF6584"
                    fill="#FF6584"
                    fillOpacity={0.4}
                  />
                  <Tooltip
                    formatter={(value: any) => [`${value} / 4.0`, 'Skor Rata-rata']}
                    contentStyle={{ borderRadius: 16, fontSize: 12, border: '1px solid #E2E8F0' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recommendations Feed */}
        <div className="mt-8">
          <h3 className="font-extrabold text-sm text-slate-800 mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Rekomendasi & Catatan Supervisi Guru</span>
          </h3>

          {recommendations.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Belum ada rekomendasi supervisi.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-amber-900 truncate max-w-[170px]">
                      {rec.guru}
                    </span>
                    <span className="text-[10px] text-amber-700/60">{rec.date}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-relaxed">
                    <strong>Rekomendasi:</strong> {rec.rekomendasi}
                  </p>
                  {rec.hasil && (
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      <strong>Hasil:</strong> {rec.hasil}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Charts: Distribution Bar & Daily Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* Distribution */}
          <div className="p-5 rounded-3xl border border-slate-100 bg-white">
            <h3 className="font-extrabold text-sm text-slate-800 mb-3">
              Distribusi Volume Kegiatan ({period})
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distributionData}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 16, fontSize: 12 }} />
                  <Bar dataKey="total" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Daily timeline */}
          <div className="p-5 rounded-3xl border border-slate-100 bg-white">
            <h3 className="font-extrabold text-sm text-slate-800 mb-3">
              Tren Aktivitas 7 Hari Terakhir
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyTimelineData}>
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10 }} />
                  <Tooltip contentStyle={{ borderRadius: 16, fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#6C63FF"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#6C63FF' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Activity Table */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-800 mb-3">
            Daftar Aktivitas Terpantau ({filteredActivities.length} Catatan)
          </h3>
          <div className="overflow-x-auto max-h-72 divide-y divide-slate-100">
            {filteredActivities.slice(0, 15).map((act) => (
              <div key={act.id} className="py-2.5 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-[11px] text-slate-400 font-mono shrink-0">
                    {new Date(act.timestamp).toLocaleTimeString('id-ID', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="font-bold text-slate-800 shrink-0">{act.user}</span>
                  <span className="text-slate-500 truncate">{act.detail}</span>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold text-[10px] shrink-0">
                  {act.activity}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      </>
      )}
    </div>
  );
};

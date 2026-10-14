import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  Save,
  CheckCircle2,
  Calendar,
  Users,
  Award,
  BookOpen,
  Apple,
  Sunrise,
  Moon,
  Activity,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  Filter,
  RefreshCw,
  Database,
  ExternalLink,
  Search,
  Check,
  AlertCircle,
  FileSpreadsheet,
  Clock,
} from 'lucide-react';
import { GURU_LIST, KELAS_LIST, SEVEN_HABITS_LIST, HabitDefinition } from '../data/initialData';
import { SevenHabitsData, HabitCheckItem } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import {
  fetchSevenHabitsFromSpreadsheet,
  getActiveSpreadsheetId,
  SPREADSHEET_URL,
} from '../services/googleSheetsService';

interface SevenHabitsViewProps {
  onBack: () => void;
  onSave: (data: SevenHabitsData) => void;
  savedEntries?: SevenHabitsData[];
}

export const SevenHabitsView: React.FC<SevenHabitsViewProps> = ({
  onBack,
  onSave,
  savedEntries = [],
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'history' | 'guide'>('form');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [guru, setGuru] = useState('');
  const [kelas, setKelas] = useState('4a');
  const [jumlahSiswa, setJumlahSiswa] = useState<number>(28);
  const [catatanRefleksi, setCatatanRefleksi] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [fotoData, setFotoData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 7 Habits Checklist State
  const [habitsData, setHabitsData] = useState<
    Record<
      string,
      {
        status: 'sangat_baik' | 'baik' | 'cukup' | 'perlu_bimbingan';
        jumlahSiswa: number;
        catatan: string;
      }
    >
  >(() => {
    const initial: Record<string, any> = {};
    SEVEN_HABITS_LIST.forEach((h) => {
      initial[h.id] = {
        status: 'sangat_baik',
        jumlahSiswa: 28,
        catatan: '',
      };
    });
    return initial;
  });

  // History & Spreadsheet Sync State
  const [entries, setEntries] = useState<SevenHabitsData[]>(savedEntries);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Search & Filter State
  const [filterKelas, setFilterKelas] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

  // Update entries when parent savedEntries changes
  useEffect(() => {
    if (savedEntries.length > 0) {
      setEntries(savedEntries);
    }
  }, [savedEntries]);

  // Fungsi untuk menarik data dari Google Spreadsheet tab "Seven Habits"
  const handleSyncFromSpreadsheet = async () => {
    setIsSyncing(true);
    setSyncStatus('Menghubungkan ke Google Spreadsheet...');
    try {
      const res = await fetchSevenHabitsFromSpreadsheet();
      if (res.data && res.data.length > 0) {
        setEntries(res.data);
        setSyncStatus(`Berhasil mengambil ${res.data.length} data Seven Habits dari Spreadsheet.`);
        setLastSyncTime(new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
      } else {
        setSyncStatus(res.message || 'Sheet Seven Habits masih kosong.');
      }
    } catch (err) {
      console.error('Error sync Seven Habits:', err);
      setSyncStatus('Koneksi spreadsheet tertunda. Menampilkan data tersimpan.');
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  // Quick Action: Tandai Semua 7 Kebiasaan Terlaksana (Sangat Baik)
  const handleSetAllBest = () => {
    const updated: Record<string, any> = {};
    SEVEN_HABITS_LIST.forEach((h) => {
      updated[h.id] = {
        status: 'sangat_baik',
        jumlahSiswa: jumlahSiswa,
        catatan: habitsData[h.id]?.catatan || '',
      };
    });
    setHabitsData(updated);
  };

  const handleHabitChange = (
    habitId: string,
    field: 'status' | 'jumlahSiswa' | 'catatan',
    value: any
  ) => {
    setHabitsData((prev) => ({
      ...prev,
      [habitId]: {
        ...prev[habitId],
        [field]: value,
      },
    }));
  };

  const getHabitIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sunrise':
        return <Sunrise className="w-5 h-5" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5" />;
      case 'Activity':
        return <Activity className="w-5 h-5" />;
      case 'Apple':
        return <Apple className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'Moon':
        return <Moon className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const formatHabitValue = (habitId: string): string => {
    const current = habitsData[habitId];
    if (!current) return 'Terlaksana';
    const label =
      current.status === 'sangat_baik'
        ? 'Sangat Baik'
        : current.status === 'baik'
        ? 'Baik'
        : current.status === 'cukup'
        ? 'Cukup'
        : 'Perlu Bimbingan';
    const detailNote = current.catatan.trim() ? ` (${current.catatan.trim()})` : '';
    return `${label} [${current.jumlahSiswa}/${jumlahSiswa} Siswa]${detailNote}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guru) {
      alert('Silakan pilih nama guru pembina / wali kelas');
      return;
    }
    if (!kelas) {
      alert('Silakan pilih kelas');
      return;
    }

    setIsSubmitting(true);

    const habits: HabitCheckItem[] = SEVEN_HABITS_LIST.map((def) => {
      const current = habitsData[def.id] || {
        status: 'sangat_baik',
        jumlahSiswa: jumlahSiswa,
        catatan: '',
      };
      const persentase =
        jumlahSiswa > 0 ? Math.round((current.jumlahSiswa / jumlahSiswa) * 100) : 100;

      return {
        id: def.id,
        name: def.name,
        tagline: def.tagline,
        status: current.status,
        persentase,
        jumlahSiswa: current.jumlahSiswa,
        catatan: current.catatan.trim() || undefined,
      };
    });

    const newRecord: SevenHabitsData = {
      date,
      guru,
      kelas,
      jumlahSiswa,
      habits,
      // Kolom langsung sesuai format Code.gs & Sheet
      bangunPagi: formatHabitValue('bangun-pagi'),
      beribadah: formatHabitValue('beribadah'),
      berolahraga: formatHabitValue('berolahraga'),
      makanSehat: formatHabitValue('makan-sehat'),
      gemarBelajar: formatHabitValue('gemar-belajar'),
      bermasyarakat: formatHabitValue('bermasyarakat'),
      tidurCepat: formatHabitValue('tidur-cepat'),
      catatanRefleksi: catatanRefleksi.trim() || undefined,
      tindakLanjut: tindakLanjut.trim() || undefined,
      fotoData: fotoData || undefined,
    };

    setTimeout(() => {
      onSave(newRecord);
      setEntries((prev) => [newRecord, ...prev]);
      setIsSubmitting(false);
      setActiveSubTab('history');
    }, 400);
  };

  // Filter history entries
  const filteredHistory = entries.filter((item) => {
    const matchKelas = filterKelas === 'all' || item.kelas.toLowerCase() === filterKelas.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    const matchSearch =
      !query ||
      item.guru.toLowerCase().includes(query) ||
      item.kelas.toLowerCase().includes(query) ||
      (item.catatanRefleksi && item.catatanRefleksi.toLowerCase().includes(query)) ||
      (item.tindakLanjut && item.tindakLanjut.toLowerCase().includes(query));
    return matchKelas && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition-all shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-extrabold uppercase tracking-wider">
                🌟 Program Unggulan Murid
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                • SDN Tamansari
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Seven Habits (7 Kebiasaan Anak Hebat)
            </h1>
          </div>
        </div>

        {/* Sync & External Sheet Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSyncFromSpreadsheet}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all shadow-xs"
            title="Tarik data terbaru dari Google Spreadsheet"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : 'text-slate-400'}`} />
            <span>{isSyncing ? 'Menyinkronkan...' : 'Tarik dari Spreadsheet'}</span>
          </button>

          <a
            href={SPREADSHEET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors"
            title="Buka Spreadsheet resmi di Google Drive"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden md:inline">Buka Sheet</span>
            <ExternalLink className="w-3 h-3 text-emerald-600" />
          </a>
        </div>
      </div>

      {/* Sync Status Banner */}
      <AnimatePresence>
        {syncStatus && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-between shadow-xs"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{syncStatus}</span>
            </div>
            {lastSyncTime && (
              <span className="text-[11px] text-emerald-700 font-semibold">
                Pukul {lastSyncTime} WIB
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subtab Navigation */}
      <div className="flex bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 shadow-2xs">
        <button
          onClick={() => setActiveSubTab('form')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'form'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-4 h-4 text-[#6C63FF]" />
          <span>Form Input Seven Habits</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'history'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Riwayat &amp; Rekap ({entries.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('guide')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all ${
            activeSubTab === 'guide'
              ? 'bg-white text-indigo-700 shadow-sm border border-slate-200/50'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-600" />
          <span>Panduan 7 Kebiasaan</span>
        </button>
      </div>

      {/* Hero Banner Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 sm:p-8 text-white shadow-lg shadow-orange-500/10"
      >
        <div className="relative z-10 max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>Karakter Unggul Pelajar Indonesia</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Seven Habits (7 Kebiasaan Anak Hebat Indonesia)
          </h2>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            Jurnal pembiasaan karakter luhur dan disiplin diri: <strong>Bangun pagi</strong>, <strong>Beribadah</strong>, <strong>Berolahraga</strong>, <strong>Makan sehat &amp; bergizi</strong>, <strong>Gemar belajar</strong>, <strong>Bermasyarakat</strong>, dan <strong>Tidur cepat</strong>. Seluruh data otomatis terhubung ke sheet <em>"Seven Habits"</em>.
          </p>
        </div>

        {/* Decorative background shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-16 right-32 w-40 h-40 rounded-full bg-white/10 blur-lg pointer-events-none" />
      </motion.div>

      {/* SUBTAB 1: FORM INPUT SEVEN HABITS */}
      {activeSubTab === 'form' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-indigo-900/5 space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Input Jurnal 7 Kebiasaan Anak Hebat
              </h3>
              <p className="text-xs text-slate-500">
                Dokumentasikan ketercapaian pembiasaan 7 kebiasaan pada hari ini (Sesuai Code.gs &amp; Google Sheet)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSetAllBest}
                className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                title="Tandai semua 7 kebiasaan dengan status Sangat Baik / Terlaksana"
              >
                <Check className="w-3.5 h-3.5 text-amber-600" />
                <span>Set Semua Sangat Baik</span>
              </button>
              <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6C63FF] text-xs font-bold">
                Formulir Harian
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Data: Tanggal, Guru, Kelas, Total Siswa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Guru Pembina / Wali Kelas *
                </label>
                <select
                  required
                  value={guru}
                  onChange={(e) => setGuru(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
                >
                  <option value="">-- Pilih Guru --</option>
                  {GURU_LIST.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kelas *
                </label>
                <select
                  required
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {KELAS_LIST.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Jumlah Siswa Terpantau *
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const next = Math.max(1, jumlahSiswa - 1);
                      setJumlahSiswa(next);
                    }}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    required
                    value={jumlahSiswa}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setJumlahSiswa(val);
                    }}
                    className="w-full text-center py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#6C63FF]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const next = jumlahSiswa + 1;
                      setJumlahSiswa(next);
                    }}
                    className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Checklist 7 Kebiasaan Anak Hebat Indonesia */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-[#6C63FF] flex items-center justify-center font-black text-xs">
                    7
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-800 uppercase tracking-wide">
                    Evaluasi Ketercapaian 7 Kebiasaan Anak Hebat
                  </h4>
                </div>
                <span className="text-[11px] text-slate-400">
                  Target: 7 pembiasaan harian murid
                </span>
              </div>

              <div className="space-y-3.5">
                {SEVEN_HABITS_LIST.map((habit) => {
                  const current = habitsData[habit.id] || {
                    status: 'sangat_baik',
                    jumlahSiswa: jumlahSiswa,
                    catatan: '',
                  };
                  const persentase =
                    jumlahSiswa > 0 ? Math.round((current.jumlahSiswa / jumlahSiswa) * 100) : 100;

                  return (
                    <div
                      key={habit.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${habit.bgColor} ${habit.borderColor}`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        {/* Habit Title & Tagline */}
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${habit.color} text-white flex items-center justify-center shadow-sm shrink-0 mt-0.5`}
                          >
                            {getHabitIcon(habit.iconName)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="w-5 h-5 rounded-md bg-white text-slate-700 flex items-center justify-center text-[11px] font-black shadow-2xs">
                                {habit.number}
                              </span>
                              <h5 className="font-extrabold text-sm text-slate-900">
                                {habit.name}
                              </h5>
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${habit.badgeColor}`}>
                                {habit.targetWaktu}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium mt-1">
                              • {habit.tagline}
                            </p>
                            <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
                              {habit.detail}
                            </p>
                          </div>
                        </div>

                        {/* Status Pills & Counter */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0">
                          {/* Predikat Status */}
                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                            <button
                              type="button"
                              onClick={() => handleHabitChange(habit.id, 'status', 'sangat_baik')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                                current.status === 'sangat_baik'
                                  ? 'bg-emerald-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-emerald-700'
                              }`}
                            >
                              Sangat Baik
                            </button>
                            <button
                              type="button"
                              onClick={() => handleHabitChange(habit.id, 'status', 'baik')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                                current.status === 'baik'
                                  ? 'bg-blue-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-blue-700'
                              }`}
                            >
                              Baik
                            </button>
                            <button
                              type="button"
                              onClick={() => handleHabitChange(habit.id, 'status', 'cukup')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                                current.status === 'cukup'
                                  ? 'bg-amber-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-amber-700'
                              }`}
                            >
                              Cukup
                            </button>
                            <button
                              type="button"
                              onClick={() => handleHabitChange(habit.id, 'status', 'perlu_bimbingan')}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                                current.status === 'perlu_bimbingan'
                                  ? 'bg-rose-600 text-white shadow-2xs'
                                  : 'text-slate-600 hover:text-rose-700'
                              }`}
                            >
                              Bimbingan
                            </button>
                          </div>

                          {/* Stepper Siswa Tuntas */}
                          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-slate-200/80 shadow-2xs">
                            <span className="text-[10px] font-bold text-slate-500">Tuntas:</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleHabitChange(
                                  habit.id,
                                  'jumlahSiswa',
                                  Math.max(0, current.jumlahSiswa - 1)
                                )
                              }
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="text-xs font-black text-slate-800 w-8 text-center">
                              {current.jumlahSiswa}/{jumlahSiswa}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleHabitChange(
                                  habit.id,
                                  'jumlahSiswa',
                                  Math.min(jumlahSiswa, current.jumlahSiswa + 1)
                                )
                              }
                              className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center"
                            >
                              +
                            </button>
                            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                              {persentase}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Catatan Praktik Baik */}
                      <div className="mt-3 pt-3 border-t border-slate-200/60">
                        <input
                          type="text"
                          placeholder={`Catatan spesifik pembiasaan "${habit.name}" hari ini (contoh: sholat tepat waktu, sarapan gizi seimbang...)`}
                          value={current.catatan}
                          onChange={(e) => handleHabitChange(habit.id, 'catatan', e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Catatan Refleksi & Tindak Lanjut Guru */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Catatan Refleksi &amp; Apresiasi Guru
                </label>
                <textarea
                  rows={3}
                  value={catatanRefleksi}
                  onChange={(e) => setCatatanRefleksi(e.target.value)}
                  placeholder="Refleksi ketercapaian pembiasaan, apresiasi murid yang teladan, atau evaluasi kelas..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rencana Tindak Lanjut (RTL)
                </label>
                <textarea
                  rows={3}
                  value={tindakLanjut}
                  onChange={(e) => setTindakLanjut(e.target.value)}
                  placeholder="Rencana tindak lanjut (misal: pemberian bintang penghargaan, komunikasi dengan orang tua...)"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
                />
              </div>
            </div>

            {/* Dokumentasi Foto */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Dokumentasi Kegiatan Pembiasaan (Opsional)
              </label>
              <ImageUpload
                onImageSelected={(base64) => setFotoData(base64)}
                currentImage={fotoData}
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-2.5 rounded-2xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white text-xs font-black shadow-md hover:shadow-lg hover:from-amber-600 hover:to-rose-600 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan & Menyinkronkan...' : 'Simpan Jurnal Seven Habits'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* SUBTAB 2: RIWAYAT & REKAP JURNAL */}
      {activeSubTab === 'history' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Filter Bar & Controls */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-800 text-base">
                  Riwayat Jurnal Seven Habits
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-black">
                  {filteredHistory.length} Jurnal
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Data jurnal 7 kebiasaan anak hebat yang tersinkronisasi dengan spreadsheet SDN Tamansari
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Search input */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Cari guru / catatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#6C63FF] w-40 sm:w-48"
                />
              </div>

              {/* Kelas Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={filterKelas}
                  onChange={(e) => setFilterKelas(e.target.value)}
                  className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none"
                >
                  <option value="all">Semua Kelas</option>
                  {KELAS_LIST.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sync Button */}
              <button
                type="button"
                onClick={handleSyncFromSpreadsheet}
                disabled={isSyncing}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                title="Tarik pembaruan dari Google Spreadsheet"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-600' : 'text-emerald-700'}`} />
                <span>{isSyncing ? 'Sinkron...' : 'Sinkron'}</span>
              </button>
            </div>
          </div>

          {/* List Entries */}
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">Belum Ada Riwayat Jurnal</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Silakan isi formulir Seven Habits atau klik "Tarik dari Spreadsheet" untuk memuat data dari spreadsheet resmi sekolah.
              </p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => setActiveSubTab('form')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-xs hover:from-amber-600 hover:to-orange-600 transition-colors"
                >
                  Isi Jurnal Sekarang
                </button>
                <button
                  onClick={handleSyncFromSpreadsheet}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Ambil Data Spreadsheet</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredHistory.map((item, idx) => {
                const isExpanded = expandedEntryId === (item.id || `item-${idx}`);
                const habitsList = item.habits || [];
                const averagePersen =
                  habitsList.length > 0
                    ? Math.round(
                        habitsList.reduce((acc, h) => acc + (h.persentase || 0), 0) /
                          habitsList.length
                      )
                    : 100;

                return (
                  <div
                    key={item.id || `entry-${idx}`}
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                          {String(item.kelas || '').toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-sm text-slate-800">
                              Kelas {String(item.kelas || '').toUpperCase()} • {item.guru}
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-black">
                              Ketercapaian: {averagePersen}%
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Tanggal: {item.date} • {item.jumlahSiswa} Siswa Terpantau
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setExpandedEntryId(isExpanded ? null : (item.id || `item-${idx}`))
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold self-start sm:self-auto transition-colors"
                      >
                        <span>{isExpanded ? 'Tutup Rincian' : 'Lihat 7 Kebiasaan'}</span>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Quick Habit Mini Badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 border-t border-slate-100 text-center">
                      <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-100">
                        <span className="block text-[10px] font-bold text-amber-800 truncate">
                          1. Bangun Pagi
                        </span>
                        <span className="text-[11px] font-black text-amber-900 truncate">
                          {item.bangunPagi || 'Terlaksana'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-emerald-50/80 border border-emerald-100">
                        <span className="block text-[10px] font-bold text-emerald-800 truncate">
                          2. Beribadah
                        </span>
                        <span className="text-[11px] font-black text-emerald-900 truncate">
                          {item.beribadah || 'Terlaksana'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-blue-50/80 border border-blue-100">
                        <span className="block text-[10px] font-bold text-blue-800 truncate">
                          3. Berolahraga
                        </span>
                        <span className="text-[11px] font-black text-blue-900 truncate">
                          {item.berolahraga || 'Terlaksana'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-rose-50/80 border border-rose-100">
                        <span className="block text-[10px] font-bold text-rose-800 truncate">
                          4. Makan Sehat
                        </span>
                        <span className="text-[11px] font-black text-rose-900 truncate">
                          {item.makanSehat || 'Terlaksana'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-purple-50/80 border border-purple-100">
                        <span className="block text-[10px] font-bold text-purple-800 truncate">
                          5. Belajar
                        </span>
                        <span className="text-[11px] font-black text-purple-900 truncate">
                          {item.gemarBelajar || 'Terlaksana'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-teal-50/80 border border-teal-100">
                        <span className="block text-[10px] font-bold text-teal-800 truncate">
                          6. Bermasyarakat
                        </span>
                        <span className="text-[11px] font-black text-teal-900 truncate">
                          {item.bermasyarakat || 'Terlaksana'}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-slate-50/80 border border-slate-200">
                        <span className="block text-[10px] font-bold text-slate-700 truncate">
                          7. Tidur Cepat
                        </span>
                        <span className="text-[11px] font-black text-slate-800 truncate">
                          {item.tidurCepat || 'Terlaksana'}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 border-t border-slate-100 space-y-4"
                        >
                          {/* 7 Habits Detail List */}
                          <div className="space-y-2">
                            <h5 className="font-extrabold text-xs text-slate-700 uppercase tracking-wider">
                              Rincian Ketercapaian 7 Kebiasaan:
                            </h5>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {SEVEN_HABITS_LIST.map((def) => {
                                const hItem = habitsList.find((h) => h.id === def.id);
                                const directVal =
                                  def.id === 'bangun-pagi'
                                    ? item.bangunPagi
                                    : def.id === 'beribadah'
                                    ? item.beribadah
                                    : def.id === 'berolahraga'
                                    ? item.berolahraga
                                    : def.id === 'makan-sehat'
                                    ? item.makanSehat
                                    : def.id === 'gemar-belajar'
                                    ? item.gemarBelajar
                                    : def.id === 'bermasyarakat'
                                    ? item.bermasyarakat
                                    : item.tidurCepat;

                                return (
                                  <div
                                    key={def.id}
                                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="font-bold text-xs text-slate-800">
                                        {def.number}. {def.name}
                                      </span>
                                      <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        {directVal || 'Terlaksana'}
                                      </span>
                                    </div>
                                    {hItem?.catatan && (
                                      <p className="text-[11px] text-slate-500 italic">
                                        Catatan: {hItem.catatan}
                                      </p>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Catatan Refleksi & RTL */}
                          {(item.catatanRefleksi || item.tindakLanjut) && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                              {item.catatanRefleksi && (
                                <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1">
                                  <span className="font-bold text-[10px] uppercase tracking-wider text-amber-800">
                                    Catatan Refleksi Guru:
                                  </span>
                                  <p className="text-xs text-slate-700 leading-relaxed">
                                    {item.catatanRefleksi}
                                  </p>
                                </div>
                              )}
                              {item.tindakLanjut && (
                                <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-200/60 space-y-1">
                                  <span className="font-bold text-[10px] uppercase tracking-wider text-indigo-800">
                                    Rencana Tindak Lanjut:
                                  </span>
                                  <p className="text-xs text-slate-700 leading-relaxed">
                                    {item.tindakLanjut}
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Foto Dokumentasi */}
                          {item.fotoData && (
                            <div className="pt-2">
                              <span className="block font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                                Foto Dokumentasi:
                              </span>
                              <img
                                src={item.fotoData}
                                alt="Dokumentasi Seven Habits"
                                className="w-32 h-32 object-cover rounded-2xl border border-slate-200 shadow-xs"
                              />
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {/* SUBTAB 3: PANDUAN 7 KEBIASAAN ANAK HEBAT */}
      {activeSubTab === 'guide' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-lg">
              Panduan 7 Kebiasaan Anak Hebat Indonesia
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Pedoman komprehensif bagi guru pembina, wali kelas, orang tua, dan murid SDN Tamansari
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SEVEN_HABITS_LIST.map((h) => (
              <div
                key={h.id}
                className={`p-6 rounded-3xl border transition-all ${h.bgColor} ${h.borderColor} space-y-3`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${h.color} text-white flex items-center justify-center shadow-xs shrink-0`}
                  >
                    {getHabitIcon(h.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-md bg-white text-slate-800 flex items-center justify-center text-xs font-black shadow-2xs">
                        {h.number}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base">{h.name}</h4>
                    </div>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${h.badgeColor}`}>
                      Target: {h.targetWaktu}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-bold text-slate-800">
                    Tujuan &amp; Esensi:
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {h.tagline}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-200/60">
                  <p className="text-xs font-bold text-slate-800">
                    Praktik Harian Murid:
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {h.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

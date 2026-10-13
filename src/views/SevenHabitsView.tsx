import React, { useState } from 'react';
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
  Info,
  Clock,
  Check,
  AlertCircle,
  Plus,
  Trash2,
} from 'lucide-react';
import { GURU_LIST, KELAS_LIST, SEVEN_HABITS_LIST, HabitDefinition } from '../data/initialData';
import { SevenHabitsData, HabitCheckItem } from '../types';
import { ImageUpload } from '../components/ImageUpload';

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
  const [habitsData, setHabitsData] = useState<Record<string, {
    status: 'sangat_baik' | 'baik' | 'cukup' | 'perlu_bimbingan';
    jumlahSiswa: number;
    catatan: string;
  }>>(() => {
    const initial: Record<string, any> = {};
    SEVEN_HABITS_LIST.forEach((h) => {
      initial[h.id] = {
        status: 'sangat_baik',
        jumlahSiswa: 27,
        catatan: '',
      };
    });
    return initial;
  });

  // History Filter
  const [filterKelas, setFilterKelas] = useState('all');
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);

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
      catatanRefleksi: catatanRefleksi.trim() || undefined,
      tindakLanjut: tindakLanjut.trim() || undefined,
      fotoData: fotoData || undefined,
    };

    setTimeout(() => {
      onSave(newRecord);
      setIsSubmitting(false);
    }, 400);
  };

  const filteredHistory = savedEntries.filter((item) => {
    if (filterKelas === 'all') return true;
    return item.kelas === filterKelas;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors shadow-2xs self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Dashboard</span>
        </button>

        {/* Sub-tab Navigation */}
        <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold shadow-2xs self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab('form')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'form'
                ? 'bg-[#6C63FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Form Input Seven Habits</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'bg-[#6C63FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Riwayat & Rekap ({savedEntries.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('guide')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeSubTab === 'guide'
                ? 'bg-[#6C63FF] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Pedoman 7 Kebiasaan</span>
          </button>
        </div>
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-[#6C63FF] via-[#7B73FF] to-indigo-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-900/10 relative overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-bold mb-3 border border-white/20">
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Karakter Unggul Pelajar Pancasila • SDN Tamansari</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Seven Habits (7 Kebiasaan Anak Hebat Indonesia)
          </h2>
          <p className="text-indigo-100 text-xs sm:text-sm mt-2 leading-relaxed font-normal">
            Jurnal pembiasaan karakter luhur dan disiplin diri: <strong>Bangun pagi</strong>, <strong>Beribadah</strong>, <strong>Berolahraga</strong>, <strong>Makan sehat & bergizi</strong>, <strong>Gemar belajar</strong>, <strong>Bermasyarakat</strong>, dan <strong>Tidur cepat</strong>.
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
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Input Jurnal 7 Kebiasaan Anak Hebat
              </h3>
              <p className="text-xs text-slate-500">
                Dokumentasikan ketercapaian pembiasaan 7 kebiasaan pada hari ini
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-[#6C63FF] text-xs font-bold">
              Formulir Harian
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Data: Tanggal, Guru, Kelas, Total Siswa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
                />
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
                    onClick={() => setJumlahSiswa((prev) => Math.max(1, prev - 1))}
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
                    onChange={(e) => setJumlahSiswa(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full text-center py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 focus:outline-none focus:border-[#6C63FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setJumlahSiswa((prev) => prev + 1)}
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
                  Total target: 7 pembiasaan harian
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
                          placeholder={`Catatan spesifik pembiasaan "${habit.name}" hari ini (contoh: ${habit.detail.slice(0, 50)}...)`}
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
                  Catatan Refleksi & Apresiasi Guru
                </label>
                <textarea
                  rows={3}
                  value={catatanRefleksi}
                  onChange={(e) => setCatatanRefleksi(e.target.value)}
                  placeholder="Catatan perkembangan karakter anak hari ini, siswa yang menonjol, atau apresiasi kelas..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rencana Tindak Lanjut & Kerja Sama Orang Tua
                </label>
                <textarea
                  rows={3}
                  value={tindakLanjut}
                  onChange={(e) => setTindakLanjut(e.target.value)}
                  placeholder="Rencana penguatan habit berikutnya, sosialisasi ke paguyuban orang tua murid..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all resize-none"
                />
              </div>
            </div>

            {/* Foto Dokumentasi */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Dokumentasi Foto Pembiasaan Anak Hebat (Opsional)
              </label>
              <ImageUpload
                value={fotoData}
                onChange={setFotoData}
                label="Unggah foto kegiatan kebiasaan murid (makan sehat, ibadah, olahraga, dll)"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onBack}
                className="px-5 py-3 rounded-2xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-2xl bg-[#6C63FF] hover:bg-[#5a52e0] active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Jurnal Seven Habits'}</span>
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
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">
                Riwayat Jurnal Seven Habits
              </h3>
              <p className="text-xs text-slate-500">
                Data jurnal 7 kebiasaan anak hebat yang telah tersimpan di sistem
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={filterKelas}
                onChange={(e) => setFilterKelas(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6C63FF]"
              >
                <option value="all">Semua Kelas</option>
                {KELAS_LIST.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List Entries */}
          {filteredHistory.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#6C63FF] flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-7 h-7" />
              </div>
              <h4 className="font-bold text-slate-700 text-sm">Belum Ada Riwayat Jurnal</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Silakan isi formulir jurnal Seven Habits pada tab "Form Input Seven Habits" untuk memulai pemantauan.
              </p>
              <button
                onClick={() => setActiveSubTab('form')}
                className="mt-4 px-4 py-2 rounded-xl bg-[#6C63FF] text-white text-xs font-bold shadow-xs hover:bg-[#5a52e0] transition-colors"
              >
                Isi Jurnal Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredHistory.map((item) => {
                const isExpanded = expandedEntryId === item.id;
                const averagePersen =
                  item.habits.length > 0
                    ? Math.round(
                        item.habits.reduce((acc, h) => acc + (h.persentase || 0), 0) /
                          item.habits.length
                      )
                    : 100;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-indigo-700 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                          {item.kelas.toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-sm text-slate-800">
                              Kelas {item.kelas.toUpperCase()} • {item.guru}
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
                          setExpandedEntryId(isExpanded ? null : (item.id || 'entry'))
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
                      {item.habits.map((h, idx) => (
                        <div
                          key={h.id}
                          className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center"
                        >
                          <span className="block text-[10px] font-bold text-slate-500 truncate">
                            {idx + 1}. {h.name}
                          </span>
                          <span className="text-xs font-black text-indigo-600">
                            {h.persentase}%
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Expanded Detail */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="pt-3 border-t border-slate-100 space-y-3 overflow-hidden"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {item.habits.map((h, i) => (
                              <div
                                key={h.id}
                                className="p-3 rounded-2xl bg-indigo-50/40 border border-indigo-100 flex items-start gap-2.5 text-xs"
                              >
                                <span className="w-5 h-5 rounded-md bg-[#6C63FF] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1">
                                    <span className="font-extrabold text-slate-800">
                                      {h.name}
                                    </span>
                                    <span className="font-bold text-emerald-700 text-[11px]">
                                      {h.jumlahSiswa}/{item.jumlahSiswa} ({h.persentase}%)
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 italic mt-0.5">
                                    • {h.tagline}
                                  </p>
                                  {h.catatan && (
                                    <p className="text-[11px] text-slate-700 bg-white p-1.5 rounded-lg mt-1 border border-slate-200">
                                      {h.catatan}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {(item.catatanRefleksi || item.tindakLanjut) && (
                            <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-100 text-xs space-y-1.5">
                              {item.catatanRefleksi && (
                                <p>
                                  <strong>Refleksi Guru:</strong> {item.catatanRefleksi}
                                </p>
                              )}
                              {item.tindakLanjut && (
                                <p>
                                  <strong>Tindak Lanjut:</strong> {item.tindakLanjut}
                                </p>
                              )}
                            </div>
                          )}

                          {item.fotoData && (
                            <div className="pt-2">
                              <p className="text-xs font-bold text-slate-600 mb-1.5">
                                Dokumentasi Kegiatan:
                              </p>
                              <img
                                src={item.fotoData}
                                alt="Foto Pembiasaan"
                                className="w-full max-h-64 object-cover rounded-2xl border border-slate-200"
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

      {/* SUBTAB 3: PEDOMAN & PANDUAN 7 KEBIASAAN */}
      {activeSubTab === 'guide' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
            <h3 className="font-extrabold text-slate-800 text-lg">
              Pedoman 7 Kebiasaan Anak Hebat Indonesia
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Panduan implementasi bagi guru, orang tua, dan murid SDN Tamansari
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
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${h.color} text-white flex items-center justify-center shadow-md shrink-0`}
                  >
                    {getHabitIcon(h.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-white text-slate-800 flex items-center justify-center font-black text-xs shadow-2xs">
                        {h.number}
                      </span>
                      <h4 className="font-black text-base text-slate-900">{h.name}</h4>
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border mt-1 ${h.badgeColor}`}>
                      Target: {h.targetWaktu}
                    </span>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-white space-y-1.5">
                  <p className="text-xs font-bold text-slate-800">
                    • Makna & Filosofi:
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {h.tagline}
                  </p>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-800">• Praktik Pembiasaan Nyata:</p>
                  <p className="leading-relaxed">{h.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GURU_LIST, KELAS_LIST, MAPEL_LIST } from '../data/initialData';
import { JurnalMengajarData, TeachingMood, TeachingSession } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import {
  ArrowLeft,
  GraduationCap,
  Plus,
  Trash2,
  Smile,
  Meh,
  Moon,
  Zap,
  Save,
  CheckCircle2,
  Clock,
  BookOpen,
  Users,
  UserCheck,
  UserX,
  Minus,
} from 'lucide-react';

interface JurnalMengajarViewProps {
  onBack: () => void;
  onSave: (data: JurnalMengajarData) => void;
}

export const JurnalMengajarView: React.FC<JurnalMengajarViewProps> = ({
  onBack,
  onSave,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [guru, setGuru] = useState('');
  const [kelas, setKelas] = useState('');

  // Absensi Siswa
  const [totalSiswa, setTotalSiswa] = useState<number>(28);
  const [sakit, setSakit] = useState<number>(0);
  const [izin, setIzin] = useState<number>(0);
  const [alpa, setAlpa] = useState<number>(0);
  const [siswaTidakHadir, setSiswaTidakHadir] = useState<string>('');

  const hadir = Math.max(0, totalSiswa - (sakit + izin + alpa));
  const persentaseHadir = totalSiswa > 0 ? Math.round((hadir / totalSiswa) * 100) : 100;

  const [sessions, setSessions] = useState<TeachingSession[]>([
    {
      waktu: '07:30 - 09:00',
      mapel: 'Bahasa Indonesia',
      materi: '',
    },
  ]);
  const [kendala, setKendala] = useState('');
  const [rencana, setRencana] = useState('');
  const [mood, setMood] = useState<TeachingMood>('senang');
  const [fotoData, setFotoData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSession = () => {
    if (sessions.length >= 4) return;
    setSessions([
      ...sessions,
      {
        waktu: '09:30 - 11:00',
        mapel: 'Matematika',
        materi: '',
      },
    ]);
  };

  const removeSession = (index: number) => {
    if (sessions.length === 1) return;
    setSessions(sessions.filter((_, i) => i !== index));
  };

  const updateSession = (
    index: number,
    field: keyof TeachingSession,
    value: string
  ) => {
    const next = [...sessions];
    next[index][field] = value;
    setSessions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guru) {
      alert('Silakan pilih nama guru');
      return;
    }
    if (!kelas) {
      alert('Silakan pilih kelas');
      return;
    }

    const hasEmptySession = sessions.some(
      (s) => !s.waktu.trim() || !s.mapel.trim() || !s.materi.trim()
    );
    if (hasEmptySession) {
      alert('Mohon lengkapi waktu, mata pelajaran, dan materi pada setiap sesi');
      return;
    }

    setIsSubmitting(true);

    const journalData: JurnalMengajarData = {
      date,
      guru,
      kelas,
      sessions,
      absensi: {
        totalSiswa,
        hadir,
        sakit,
        izin,
        alpa,
        siswaTidakHadir: siswaTidakHadir.trim() || undefined,
      },
      kendala,
      rencana,
      mood,
      fotoData,
    };

    setTimeout(() => {
      onSave(journalData);
      setIsSubmitting(false);
    }, 400);
  };

  const moodOptions: { id: TeachingMood; label: string; icon: any; color: string; emoji: string }[] = [
    { id: 'senang', label: 'Senang', icon: Smile, color: 'hover:bg-emerald-50 text-emerald-600', emoji: '😊' },
    { id: 'semangat', label: 'Semangat', icon: Zap, color: 'hover:bg-indigo-50 text-indigo-600', emoji: '💪' },
    { id: 'biasa', label: 'Biasa', icon: Meh, color: 'hover:bg-slate-50 text-slate-600', emoji: '😐' },
    { id: 'lelah', label: 'Lelah', icon: Moon, color: 'hover:bg-amber-50 text-amber-600', emoji: '😴' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-16">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dashboard</span>
      </button>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-indigo-900/5"
      >
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#6C63FF] to-[#8A85FF] text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Jurnal Mengajar Guru
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Dokumentasi proses pembelajaran dan refleksi harian kelas
            </p>
          </div>
        </div>

        {/* Deadline Notice Bar */}
        <div className="mt-4 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex items-center justify-between gap-3 text-amber-900">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs font-semibold leading-relaxed">
              <strong>Aturan Sekolah:</strong> Batas pengisian Jurnal Mengajar & Presensi Siswa harian maksimal <strong>pukul 12:00 siang WIB</strong>.
            </p>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-200/60 text-amber-800 text-[10px] font-black uppercase shrink-0">
            Maks 12:00 WIB
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Header Info: Tanggal, Guru, Kelas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tanggal Pembelajaran *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Guru *
              </label>
              <select
                required
                value={guru}
                onChange={(e) => setGuru(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
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
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-4 focus:ring-[#6C63FF]/10 transition-all"
              >
                <option value="">-- Pilih Kelas --</option>
                {KELAS_LIST.map((k) => (
                  <option key={k.value} value={k.value}>
                    {k.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Absensi / Presensi Siswa */}
          <div className="p-5 rounded-3xl border border-indigo-100 bg-gradient-to-b from-indigo-50/40 via-white to-slate-50/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-indigo-100/60">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    <span>Presensi & Absensi Siswa Kelas</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">Catat kehadiran peserta didik pada hari pembelajaran ini</p>
                </div>
              </div>

              {/* Attendance percentage indicator */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span
                  className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center gap-1 shadow-xs border ${
                    persentaseHadir >= 90
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                      : persentaseHadir >= 75
                      ? 'bg-amber-50 border-amber-200 text-amber-700'
                      : 'bg-rose-50 border-rose-200 text-rose-700'
                  }`}
                >
                  <span>Kehadiran: {persentaseHadir}%</span>
                  <span className="text-[10px] opacity-80 font-normal">
                    ({hadir}/{totalSiswa} Siswa)
                  </span>
                </span>
              </div>
            </div>

            {/* Attendance Counter Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {/* Total Siswa */}
              <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
                <label className="block text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Total Siswa</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setTotalSiswa((prev) => Math.max(1, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={totalSiswa}
                    onChange={(e) => setTotalSiswa(Math.max(1, parseInt(e.target.value) || 0))}
                    className="w-full text-center py-1 rounded-lg bg-slate-50 border border-slate-200 text-xs font-black text-slate-800 focus:outline-none focus:border-[#6C63FF]"
                  />
                  <button
                    type="button"
                    onClick={() => setTotalSiswa((prev) => prev + 1)}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Hadir (H) */}
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs">
                <label className="block text-[11px] font-bold text-emerald-800 mb-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Hadir (H)</span>
                </label>
                <div className="py-1 px-2 rounded-lg bg-white border border-emerald-200 text-center font-black text-emerald-700 text-sm">
                  {hadir} Siswa
                </div>
              </div>

              {/* Sakit (S) */}
              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 shadow-2xs">
                <label className="block text-[11px] font-bold text-amber-800 mb-1.5">
                  Sakit (S)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSakit((prev) => Math.max(0, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={totalSiswa}
                    value={sakit}
                    onChange={(e) => setSakit(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center py-1 rounded-lg bg-white border border-amber-200 text-xs font-black text-amber-800 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setSakit((prev) => prev + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-amber-200 hover:bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Izin (I) */}
              <div className="p-3 rounded-2xl bg-blue-50/70 border border-blue-200/80 shadow-2xs">
                <label className="block text-[11px] font-bold text-blue-800 mb-1.5">
                  Izin (I)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIzin((prev) => Math.max(0, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={totalSiswa}
                    value={izin}
                    onChange={(e) => setIzin(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center py-1 rounded-lg bg-white border border-blue-200 text-xs font-black text-blue-800 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setIzin((prev) => prev + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-blue-200 hover:bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Alpa (A) */}
              <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 shadow-2xs">
                <label className="block text-[11px] font-bold text-rose-800 mb-1.5">
                  Alpa (A)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setAlpa((prev) => Math.max(0, prev - 1))}
                    className="w-7 h-7 rounded-lg bg-white border border-rose-200 hover:bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="0"
                    max={totalSiswa}
                    value={alpa}
                    onChange={(e) => setAlpa(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-center py-1 rounded-lg bg-white border border-rose-200 text-xs font-black text-rose-800 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setAlpa((prev) => prev + 1)}
                    className="w-7 h-7 rounded-lg bg-white border border-rose-200 hover:bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-xs transition-colors shrink-0"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Nama Siswa Tidak Hadir */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Catatan Siswa Tidak Hadir & Alasan (Opsional):
              </label>
              <input
                type="text"
                placeholder="Misal: Ahmad Dani (Sakit demam), Siti Nur (Izin acara keluarga)"
                value={siswaTidakHadir}
                onChange={(e) => setSiswaTidakHadir(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/10 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Sesi Pembelajaran Dinamis */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#6C63FF]" />
                <span>Sesi Pembelajaran ({sessions.length} Sesi)</span>
              </label>

              {sessions.length < 4 && (
                <button
                  type="button"
                  onClick={addSession}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-[#6C63FF] font-bold text-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Sesi</span>
                </button>
              )}
            </div>

            {sessions.map((sess, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl border border-indigo-100/80 bg-indigo-50/30 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#6C63FF] bg-white px-2.5 py-1 rounded-xl shadow-xs border border-indigo-100">
                    Sesi {idx + 1}
                  </span>
                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSession(idx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Hapus sesi ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Waktu (Jam Ke / Pukul) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 07:30 - 09:00"
                      value={sess.waktu}
                      onChange={(e) => updateSession(idx, 'waktu', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Mata Pelajaran *
                    </label>
                    <select
                      required
                      value={sess.mapel}
                      onChange={(e) => updateSession(idx, 'mapel', e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                    >
                      <option value="">-- Pilih Mata Pelajaran --</option>
                      {MAPEL_LIST.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Materi Pokok / Pembahasan / Tujuan Belajar *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Uraikan topik materi, capaian pembelajaran, atau kegiatan siswa..."
                    value={sess.materi}
                    onChange={(e) => updateSession(idx, 'materi', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Kendala & Rencana */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Kendala yang Dihadapi (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Misal: Beberapa siswa kurang fokus pada materi pecahan..."
                value={kendala}
                onChange={(e) => setKendala(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Rencana Perbaikan Pembelajaran (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Misal: Menggunakan media manipulatif konkret di pertemuan berikutnya..."
                value={rencana}
                onChange={(e) => setRencana(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          </div>

          {/* Mood Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Mood Mengajar Hari Ini
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {moodOptions.map((item) => {
                const isSelected = mood === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMood(item.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF] shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Foto Dokumentasi Kegiatan */}
          <ImageUpload
            label="Upload Foto Kegiatan Pembelajaran"
            value={fotoData}
            onChange={setFotoData}
            helperText="Lampirkan foto suasana kelas atau hasil karya siswa (maks. 5MB)"
          />

          {/* Submit Action */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white font-bold text-xs shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Jurnal Mengajar'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

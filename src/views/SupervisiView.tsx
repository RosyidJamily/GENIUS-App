import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GURU_LIST, KELAS_LIST } from '../data/initialData';
import {
  SupervisiData,
  JadwalSupervisiData,
  PraObservasiData,
  ObservasiData,
  PascaObservasiData,
  AssessmentItem,
} from '../types';
import { ImageUpload } from '../components/ImageUpload';
import {
  ArrowLeft,
  ClipboardCheck,
  Calendar,
  Save,
  CheckCircle,
  FileCheck2,
  FileText,
  Star,
} from 'lucide-react';

interface SupervisiViewProps {
  onBack: () => void;
  onSaveSupervisi: (data: SupervisiData) => void;
  onSaveJadwal: (data: JadwalSupervisiData) => void;
}

export const SupervisiView: React.FC<SupervisiViewProps> = ({
  onBack,
  onSaveSupervisi,
  onSaveJadwal,
}) => {
  const [activeTab, setActiveTab] = useState<'form' | 'jadwal'>('form');

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [guru, setGuru] = useState('');
  const [mapel, setMapel] = useState('Pendidikan Pancasila');
  const [kelas, setKelas] = useState('4a');
  const [tahapan, setTahapan] = useState<'pra-observasi' | 'observasi' | 'pasca-observasi'>('observasi');
  const [hasil, setHasil] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [fotoData, setFotoData] = useState('');

  // Pra Observasi Indicators
  const [praItems, setPraItems] = useState<AssessmentItem[]>([
    { indicator: 'Modul Ajar', score: 4, note: 'Lengkap dan terstruktur' },
    { indicator: 'Materi', score: 4, note: 'Sesuai kurikulum' },
    { indicator: 'Media/bahan ajar', score: 4, note: 'Media konkret & digital' },
    { indicator: 'LKPD', score: 3, note: 'Petunjuk cukup jelas' },
    { indicator: 'Kisi-kisi soal', score: 4, note: 'Sesuai indikator CP' },
    { indicator: 'Soal/instrumen penilaian', score: 3, note: 'Formatif & sumatif' },
    { indicator: 'Rubrik penskoran', score: 3, note: 'Tersedia rubrik' },
    { indicator: 'Lembar analisis penilaian', score: 3, note: 'Rapi' },
    { indicator: 'Program remidi & pengayaan', score: 4, note: 'Terencana dengan baik' },
  ]);
  const [praNotes, setPraNotes] = useState('Administrasi pembelajaran guru lengkap dan siap diterapkan di kelas.');

  // Observasi Indicators
  const [obsItems, setObsItems] = useState<AssessmentItem[]>([
    { indicator: 'Menyampaikan tujuan pembelajaran', score: 4, note: 'Jelas dan mudah dipahami siswa' },
    { indicator: 'Melakukan apersepsi', score: 4, note: 'Mengaitkan materi dengan pengalaman nyata' },
    { indicator: 'Penguasaan materi', score: 4, note: 'Sangat menguasai konsep' },
    { indicator: 'Variasi metode pembelajaran', score: 4, note: 'Problem Based Learning & Diskusi' },
    { indicator: 'Penggunaan media/sumber belajar', score: 4, note: 'Alat peraga & LCD interaktif' },
    { indicator: 'Keterlibatan aktif siswa', score: 4, note: 'Siswa aktif bertanya dan berdiskusi' },
    { indicator: 'Pengelolaan waktu', score: 3, note: 'Waktu penutupan perlu lebih longgar' },
    { indicator: 'Penilaian proses pembelajaran', score: 4, note: 'Observasi formatif berjalan lancar' },
    { indicator: 'Pemberian umpan balik', score: 4, note: 'Membangun motivasi siswa' },
    { indicator: 'Penutupan pembelajaran', score: 3, note: 'Refleksi dan kesimpulan bersama' },
  ]);
  const [obsNotes, setObsNotes] = useState('Pelaksanaan pembelajaran sangat kondusif, interaktif, dan berpihak pada murid.');

  // Pasca Observasi
  const [pascaHasil, setPascaHasil] = useState('Guru merasa pembelajaran berjalan sesuai modul dan siswa mencapai pemahaman yang baik.');
  const [pascaTindakLanjut, setPascaTindakLanjut] = useState('Mengembangkan variasi asesmen alternatif dan ice breaking.');
  const [pascaKesimpulan, setPascaKesimpulan] = useState('Supervisi berhasil dengan capaian predikat Amat Baik (A).');

  // Jadwal Supervisi State
  const [jadwalDate, setJadwalDate] = useState(new Date().toISOString().split('T')[0]);
  const [jadwalHari, setJadwalHari] = useState('Senin');
  const [jadwalWaktu, setJadwalWaktu] = useState('08:00 - 10:00');
  const [jadwalGuru, setJadwalGuru] = useState('');
  const [jadwalKelas, setJadwalKelas] = useState('4a');
  const [jadwalPengawas, setJadwalPengawas] = useState('Pengawas Pembina SD');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePraScoreChange = (index: number, score: number) => {
    const next = [...praItems];
    next[index].score = score;
    setPraItems(next);
  };

  const handlePraNoteChange = (index: number, note: string) => {
    const next = [...praItems];
    next[index].note = note;
    setPraItems(next);
  };

  const handleObsScoreChange = (index: number, score: number) => {
    const next = [...obsItems];
    next[index].score = score;
    setObsItems(next);
  };

  const handleObsNoteChange = (index: number, note: string) => {
    const next = [...obsItems];
    next[index].note = note;
    setObsItems(next);
  };

  const handleSubmitSupervisi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guru) {
      alert('Silakan pilih nama guru yang disupervisi');
      return;
    }

    setIsSubmitting(true);

    const praData: PraObservasiData = {
      items: praItems,
      notes: praNotes,
    };

    const obsData: ObservasiData = {
      items: obsItems,
      notes: obsNotes,
    };

    const pascaData: PascaObservasiData = {
      hasil: pascaHasil,
      tindakLanjut: pascaTindakLanjut,
      kesimpulan: pascaKesimpulan,
    };

    const supData: SupervisiData = {
      date,
      guru,
      mapel,
      kelas,
      tahapan,
      hasil: hasil || (tahapan === 'pra-observasi' ? praNotes : tahapan === 'observasi' ? obsNotes : pascaHasil),
      tindakLanjut: tindakLanjut || (tahapan === 'pasca-observasi' ? pascaTindakLanjut : 'Pertahankan dan tingkatkan kualitas pembelajaran.'),
      praObservasi: tahapan === 'pra-observasi' || tahapan === 'observasi' ? praData : undefined,
      observasi: tahapan === 'observasi' ? obsData : undefined,
      pascaObservasi: tahapan === 'pasca-observasi' ? pascaData : undefined,
      fotoData,
    };

    setTimeout(() => {
      onSaveSupervisi(supData);
      setIsSubmitting(false);
    }, 400);
  };

  const handleSubmitJadwal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jadwalGuru) {
      alert('Silakan pilih guru untuk jadwal supervisi');
      return;
    }

    setIsSubmitting(true);

    const jData: JadwalSupervisiData = {
      date: jadwalDate,
      hari: jadwalHari,
      waktu: jadwalWaktu,
      guru: jadwalGuru,
      kelas: jadwalKelas,
      pengawas: jadwalPengawas,
    };

    setTimeout(() => {
      onSaveJadwal(jData);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                Supervisi Akademik Guru
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Instrumen Pra Observasi, Observasi Kelas, dan Pasca Observasi
              </p>
            </div>
          </div>

          {/* Tab Switcher (Form Supervisi vs Jadwal) */}
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setActiveTab('form')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'form'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Form Penilaian
            </button>
            <button
              onClick={() => setActiveTab('jadwal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'jadwal'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Jadwal Supervisi
            </button>
          </div>
        </div>

        {activeTab === 'form' ? (
          <form onSubmit={handleSubmitSupervisi} className="mt-6 space-y-6">
            {/* Header info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal Supervisi *
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Guru yang Disupervisi *
                </label>
                <select
                  required
                  value={guru}
                  onChange={(e) => setGuru(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
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
                  Mata Pelajaran *
                </label>
                <input
                  type="text"
                  required
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  placeholder="Mata Pelajaran..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kelas *
                </label>
                <select
                  required
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  {KELAS_LIST.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tahapan Supervisi Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
                Pilih Tahapan Supervisi *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTahapan('pra-observasi')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    tahapan === 'pra-observasi'
                      ? 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Pra Observasi</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTahapan('observasi')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    tahapan === 'observasi'
                      ? 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Star className="w-4 h-4" />
                  <span>Observasi Kelas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTahapan('pasca-observasi')}
                  className={`p-3.5 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    tahapan === 'pasca-observasi'
                      ? 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Pasca Observasi</span>
                </button>
              </div>
            </div>

            {/* PRA OBSERVASI SECTION */}
            {tahapan === 'pra-observasi' && (
              <div className="p-5 rounded-3xl bg-amber-50/40 border border-amber-200/70 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-800">
                      A. Instrumen Kelengkapan Administrasi & Perangkat Ajar
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Skala skor 1-4 (1: Kurang, 2: Cukup, 3: Baik, 4: Sangat Baik)
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-amber-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3">Komponen yang Dinilai</th>
                        <th className="py-2.5 px-3 w-36 text-center">Skor (1-4)</th>
                        <th className="py-2.5 px-3">Catatan Verifikasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {praItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/60">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {item.indicator}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <select
                              value={item.score}
                              onChange={(e) => handlePraScoreChange(idx, parseInt(e.target.value))}
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-amber-700 text-xs focus:outline-none focus:border-amber-500"
                            >
                              <option value={4}>4 - Sangat Baik</option>
                              <option value={3}>3 - Baik</option>
                              <option value={2}>2 - Cukup</option>
                              <option value={1}>1 - Kurang</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={item.note || ''}
                              onChange={(e) => handlePraNoteChange(idx, e.target.value)}
                              placeholder="Catatan..."
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Catatan Umum Pra Observasi
                  </label>
                  <textarea
                    rows={2}
                    value={praNotes}
                    onChange={(e) => setPraNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* OBSERVASI SECTION */}
            {tahapan === 'observasi' && (
              <div className="p-5 rounded-3xl bg-amber-50/40 border border-amber-200/70 space-y-4">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">
                    B. Instrumen Pengamatan Kegiatan Pembelajaran Kelas
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Skala skor 1-4 (1: Kurang, 2: Cukup, 3: Baik, 4: Sangat Baik)
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-amber-200 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                        <th className="py-2.5 px-3">Indikator Pembelajaran</th>
                        <th className="py-2.5 px-3 w-36 text-center">Skor (1-4)</th>
                        <th className="py-2.5 px-3">Catatan Pengamatan Supervisor</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {obsItems.map((item, idx) => (
                        <tr key={idx} className="hover:bg-white/60">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">
                            {item.indicator}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <select
                              value={item.score}
                              onChange={(e) => handleObsScoreChange(idx, parseInt(e.target.value))}
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-amber-700 text-xs focus:outline-none focus:border-amber-500"
                            >
                              <option value={4}>4 - Sangat Baik</option>
                              <option value={3}>3 - Baik</option>
                              <option value={2}>2 - Cukup</option>
                              <option value={1}>1 - Kurang</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              value={item.note || ''}
                              onChange={(e) => handleObsNoteChange(idx, e.target.value)}
                              placeholder="Catatan..."
                              className="w-full px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:border-amber-500"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Catatan Khusus Pengamatan Observasi
                  </label>
                  <textarea
                    rows={2}
                    value={obsNotes}
                    onChange={(e) => setObsNotes(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* PASCA OBSERVASI SECTION */}
            {tahapan === 'pasca-observasi' && (
              <div className="p-5 rounded-3xl bg-amber-50/40 border border-amber-200/70 space-y-4">
                <h3 className="font-extrabold text-sm text-slate-800">
                  C. Pasca Observasi & Refleksi Bersama Guru
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Refleksi Guru Terhadap Pembelajaran yang Telah Berjalan
                    </label>
                    <textarea
                      rows={3}
                      value={pascaHasil}
                      onChange={(e) => setPascaHasil(e.target.value)}
                      placeholder="Uraikan refleksi dari pihak guru..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Rencana Tindak Lanjut & Pengembangan Keprofesian
                    </label>
                    <textarea
                      rows={3}
                      value={pascaTindakLanjut}
                      onChange={(e) => setPascaTindakLanjut(e.target.value)}
                      placeholder="Rencana perbaikan tindak lanjut..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Kesimpulan Supervisor
                    </label>
                    <textarea
                      rows={2}
                      value={pascaKesimpulan}
                      onChange={(e) => setPascaKesimpulan(e.target.value)}
                      placeholder="Kesimpulan akhir..."
                      className="w-full px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Hasil Supervisi & Rekomendasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hasil Supervisi (Kesimpulan Supervisor) *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Uraikan hasil evaluasi dan penilaian umum..."
                  value={hasil}
                  onChange={(e) => setHasil(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Rekomendasi Perbaikan *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Rekomendasi untuk peningkatan mutu pengajaran..."
                  value={tindakLanjut}
                  onChange={(e) => setTindakLanjut(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Foto upload */}
            <ImageUpload
              label="Foto Pelaksanaan Supervisi"
              value={fotoData}
              onChange={setFotoData}
              helperText="Lampirkan foto saat supervisi berlangsung di dalam kelas (maks. 5MB)"
            />

            {/* Submit button */}
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
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Data Supervisi'}</span>
              </button>
            </div>
          </form>
        ) : (
          /* JADWAL SUPERVISI FORM */
          <form onSubmit={handleSubmitJadwal} className="mt-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal Pelaksanaan *
                </label>
                <input
                  type="date"
                  required
                  value={jadwalDate}
                  onChange={(e) => setJadwalDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Hari *
                </label>
                <select
                  required
                  value={jadwalHari}
                  onChange={(e) => setJadwalHari(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="Senin">Senin</option>
                  <option value="Selasa">Selasa</option>
                  <option value="Rabu">Rabu</option>
                  <option value="Kamis">Kamis</option>
                  <option value="Jumat">Jumat</option>
                  <option value="Sabtu">Sabtu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Waktu Pelaksanaan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 08:00 - 10:00"
                  value={jadwalWaktu}
                  onChange={(e) => setJadwalWaktu(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Guru yang Akan Disupervisi *
                </label>
                <select
                  required
                  value={jadwalGuru}
                  onChange={(e) => setJadwalGuru(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
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
                  value={jadwalKelas}
                  onChange={(e) => setJadwalKelas(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
                >
                  {KELAS_LIST.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Pengawas / Supervisor *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Pengawas / Kepala Sekolah..."
                  value={jadwalPengawas}
                  onChange={(e) => setJadwalPengawas(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Jadwal Supervisi'}</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

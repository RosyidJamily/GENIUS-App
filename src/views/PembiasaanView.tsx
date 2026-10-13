import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GURU_LIST, PEMBIASAAN_LIST } from '../data/initialData';
import { PembiasaanData } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import {
  ArrowLeft,
  CalendarCheck,
  Flag,
  Activity,
  BookOpen,
  Calculator,
  HeartHandshake,
  Sparkles,
  Save,
  Users,
} from 'lucide-react';

interface PembiasaanViewProps {
  onBack: () => void;
  onSave: (data: PembiasaanData) => void;
}

export const PembiasaanView: React.FC<PembiasaanViewProps> = ({
  onBack,
  onSave,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [kegiatan, setKegiatan] = useState('senam');
  const [koordinator, setKoordinator] = useState('');
  const [peserta, setPeserta] = useState<number>(292);
  const [deskripsi, setDeskripsi] = useState('');
  const [hasil, setHasil] = useState('');
  const [fotoData, setFotoData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getIcon = (id: string) => {
    switch (id) {
      case 'upacara':
        return <Flag className="w-5 h-5" />;
      case 'senam':
        return <Activity className="w-5 h-5" />;
      case 'literasi':
        return <BookOpen className="w-5 h-5" />;
      case 'numerasi':
        return <Calculator className="w-5 h-5" />;
      case 'pahala':
        return <HeartHandshake className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!koordinator) {
      alert('Silakan pilih koordinator kegiatan');
      return;
    }
    if (!deskripsi.trim()) {
      alert('Mohon isi deskripsi kegiatan pembiasaan');
      return;
    }
    if (!hasil.trim()) {
      alert('Mohon isi hasil kegiatan pembiasaan');
      return;
    }

    setIsSubmitting(true);

    const selectedKegiatan = PEMBIASAAN_LIST.find((p) => p.id === kegiatan)?.name || kegiatan;

    const data: PembiasaanData = {
      date,
      kegiatan: selectedKegiatan,
      koordinator,
      peserta: Number(peserta) || 0,
      deskripsi,
      hasil,
      fotoData,
    };

    setTimeout(() => {
      onSave(data);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5 pb-16">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dashboard</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-indigo-900/5"
      >
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Jurnal Pembiasaan Sekolah
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Pencatatan kegiatan pembiasaan karakter & budaya positif pagi hari
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tanggal Kegiatan *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Koordinator Kegiatan *
              </label>
              <select
                required
                value={koordinator}
                onChange={(e) => setKoordinator(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
              >
                <option value="">-- Pilih Koordinator --</option>
                {GURU_LIST.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Jumlah Peserta Siswa *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  required
                  value={peserta}
                  onChange={(e) => setPeserta(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-4 top-3 text-xs text-slate-400 font-semibold">
                  Siswa
                </span>
              </div>
            </div>
          </div>

          {/* Pembiasaan Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Pilih Kegiatan Pembiasaan
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {PEMBIASAAN_LIST.map((item) => {
                const isSelected = kegiatan === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setKegiatan(item.id)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`p-2 rounded-xl ${
                          isSelected
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-100 text-slate-500 group-hover:text-emerald-600'
                        }`}
                      >
                        {getIcon(item.id)}
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.day}
                      </span>
                    </div>
                    <span className="font-bold text-xs line-clamp-1">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Deskripsi & Hasil */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Deskripsi Jalannya Kegiatan *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Uraikan rangkaian kegiatan pembiasaan yang telah berlangsung..."
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hasil & Dampak Positif yang Dicapai *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Hasil yang dicapai, evaluasi ketertiban siswa, respon positif..."
                value={hasil}
                onChange={(e) => setHasil(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Upload Foto */}
          <ImageUpload
            label="Upload Foto Dokumentasi Pembiasaan"
            value={fotoData}
            onChange={setFotoData}
            helperText="Lampirkan foto saat kegiatan pembiasaan pagi berlangsung (maks. 5MB)"
          />

          {/* Submit */}
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
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Jurnal Pembiasaan'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

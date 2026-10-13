import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GURU_LIST } from '../data/initialData';
import { KombelGeniusData } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import {
  ArrowLeft,
  Users,
  Save,
  BookMarked,
  Lightbulb,
} from 'lucide-react';

interface KombelGeniusViewProps {
  onBack: () => void;
  onSave: (data: KombelGeniusData) => void;
}

export const KombelGeniusView: React.FC<KombelGeniusViewProps> = ({
  onBack,
  onSave,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topik, setTopik] = useState('');
  const [pemateri, setPemateri] = useState('');
  const [peserta, setPeserta] = useState<number>(11);
  const [materi, setMateri] = useState('');
  const [praktikBaik, setPraktikBaik] = useState('');
  const [fotoData, setFotoData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topik.trim()) {
      alert('Silakan isi topik diskusi Kombel');
      return;
    }
    if (!pemateri.trim()) {
      alert('Silakan isi pemateri');
      return;
    }
    if (!materi.trim()) {
      alert('Silakan isi materi yang dibagikan');
      return;
    }

    setIsSubmitting(true);

    const data: KombelGeniusData = {
      date,
      topik,
      pemateri,
      peserta: Number(peserta) || 0,
      materi,
      praktikBaik,
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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-violet-700 text-white flex items-center justify-center shadow-md shadow-purple-500/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Kombel GENIUS (Komunitas Belajar Guru)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Forum kolaborasi pendidik, telaah kurikulum, dan berbagi praktik baik
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
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Pemateri / Narasumber *
              </label>
              <input
                type="text"
                required
                placeholder="Nama Pemateri..."
                value={pemateri}
                onChange={(e) => setPemateri(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Jumlah Peserta Guru *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  required
                  value={peserta}
                  onChange={(e) => setPeserta(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500"
                />
                <span className="absolute right-4 top-3 text-xs text-slate-400 font-semibold">
                  Guru
                </span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Topik Pembahasan Kombel *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Strategi Pembelajaran Berdiferensiasi & Asesmen Formatif..."
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookMarked className="w-4 h-4 text-purple-600" />
                <span>Materi yang Dibagikan *</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Rangkuman intisari materi, modul, atau kebijakan pendidikan yang dipelajari bersama..."
                value={materi}
                onChange={(e) => setMateri(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Praktik Baik yang Akan Diterapkan di Kelas *</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Rencana implementasi aksi nyata dan perubahan positif di kelas masing-masing..."
                value={praktikBaik}
                onChange={(e) => setPraktikBaik(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <ImageUpload
            label="Upload Foto Dokumentasi Kombel"
            value={fotoData}
            onChange={setFotoData}
            helperText="Lampirkan foto saat diskusi Kombel berlangsung (maks. 5MB)"
          />

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
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-500 to-violet-700 text-white font-bold text-xs shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Kombel GENIUS'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

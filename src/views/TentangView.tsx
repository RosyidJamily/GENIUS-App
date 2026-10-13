import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TutorialLink } from '../types';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Video,
  Plus,
  Trash2,
  ExternalLink,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Info,
  GraduationCap,
  Upload,
  X,
} from 'lucide-react';

interface TentangViewProps {
  tutorials: TutorialLink[];
  developerFoto?: string;
  onBack: () => void;
  onAddTutorial: (tut: Omit<TutorialLink, 'id' | 'timestamp'>) => void;
  onDeleteTutorial: (id: string) => void;
  onUpdateDeveloperFoto: (base64: string) => void;
}

export const TentangView: React.FC<TentangViewProps> = ({
  tutorials,
  developerFoto,
  onBack,
  onAddTutorial,
  onDeleteTutorial,
  onUpdateDeveloperFoto,
}) => {
  const [modalPlatform, setModalPlatform] = useState<'youtube' | 'tiktok' | 'instagram' | null>(null);
  const [judulInput, setJudulInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onUpdateDeveloperFoto(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalPlatform || !judulInput.trim() || !urlInput.trim()) {
      alert('Mohon isi judul dan URL video');
      return;
    }
    onAddTutorial({
      platform: modalPlatform,
      judul: judulInput,
      link: urlInput.startsWith('http') ? urlInput : `https://${urlInput}`,
      author: 'Pengembang GENIUS',
    });
    setModalPlatform(null);
    setJudulInput('');
    setUrlInput('');
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube':
        return <span className="font-bold text-red-600">YouTube</span>;
      case 'tiktok':
        return <span className="font-bold text-slate-900">TikTok</span>;
      case 'instagram':
        return <span className="font-bold text-pink-600">Instagram</span>;
      default:
        return <span>Video</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dashboard</span>
      </button>

      {/* Developer Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm text-center relative overflow-hidden"
      >
        <div className="relative inline-block mx-auto mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#8A85FF] text-white p-1 shadow-xl shadow-indigo-500/20 overflow-hidden mx-auto">
            {developerFoto ? (
              <img
                src={developerFoto}
                alt="Muhammad Rosyid Jamily"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-white/20 flex items-center justify-center text-3xl font-extrabold">
                MR
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 p-2 rounded-full bg-slate-900 text-white cursor-pointer shadow-md hover:scale-110 transition-transform">
            <Upload className="w-3.5 h-3.5" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoUpload}
              className="hidden"
            />
          </label>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
          MUHAMMAD ROSYID JAMILY
        </h2>
        <p className="text-xs font-bold text-[#6C63FF] uppercase tracking-wider mt-1">
          Pengembang Aplikasi GENIUS
        </p>
        <p className="text-xs text-slate-500 mt-0.5">SDN Tamansari • Banyuwangi</p>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <a
            href="https://wa.me/6285704005011?text=Halo%20Mas%20Rosyid%20pengembang%20GENIUS"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors border border-emerald-200/60"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>085704005011 (WhatsApp)</span>
          </a>

          <a
            href="mailto:rosyidjamily22@gmail.com"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors border border-indigo-200/60"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>rosyidjamily22@gmail.com</span>
          </a>
        </div>
      </motion.div>

      {/* Tutorial Video Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">
                Koleksi Video Tutorial & Panduan
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Tonton panduan resmi penggunaan modul sistem GENIUS
              </p>
            </div>
          </div>
        </div>

        {/* Platform Quick Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl border border-red-200 bg-red-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider">
                  YouTube
                </span>
                <span className="text-xs text-slate-400">Tutorial Panjang</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Video langkah demi langkah pengisian form supervisi & jurnal.
              </p>
            </div>
            <button
              onClick={() => setModalPlatform('youtube')}
              className="mt-4 w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Video</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-300 bg-slate-50/60 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  TikTok
                </span>
                <span className="text-xs text-slate-400">Shorts / Tips</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Tips ringkas dan trik cepat penggunaan fitur aplikasi.
              </p>
            </div>
            <button
              onClick={() => setModalPlatform('tiktok')}
              className="mt-4 w-full py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Video</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-pink-200 bg-pink-50/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-extrabold text-pink-600 uppercase tracking-wider">
                  Instagram
                </span>
                <span className="text-xs text-slate-400">Reels & Highlight</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Dokumentasi kegiatan sekolah & prestasi GENIUS Class.
              </p>
            </div>
            <button
              onClick={() => setModalPlatform('instagram')}
              className="mt-4 w-full py-2 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Video</span>
            </button>
          </div>
        </div>

        {/* Existing Tutorial Links List */}
        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Daftar Link Video ({tutorials.length})
          </h4>
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
            {tutorials.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-white hover:bg-slate-50 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-[10px] font-extrabold uppercase shrink-0">
                    {item.platform}
                  </span>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-slate-800 hover:text-[#6C63FF] transition-colors truncate flex items-center gap-1.5"
                  >
                    <span>{item.judul}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </a>
                </div>
                <button
                  onClick={() => onDeleteTutorial(item.id)}
                  className="p-1 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors shrink-0"
                  title="Hapus link"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* About Application Information */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4"
      >
        <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#6C63FF] flex items-center justify-center">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Tentang Aplikasi GENIUS</h3>
            <p className="text-xs text-slate-500">SDN Tamansari Digital Management</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>GENIUS</strong> adalah platform monitoring kegiatan sekolah terpadu yang dirancang khusus untuk memenuhi kebutuhan administrasi digital, pemantauan kurikulum, supervisi akademik, dan pencatatan kegiatan ekstrakurikuler di lingkungan <strong>SDN Tamansari</strong>.
        </p>

        <div className="space-y-2 pt-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Fitur Utama Aplikasi:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Jurnal Mengajar Multi-Sesi & Refleksi Mood</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Supervisi Lengkap (Pra, Observasi, Pasca)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Kurva Radar Penilaian Supervisi Guru</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Jurnal Pembiasaan Karakter Positif Pagi</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>GENIUS Class (7 Program Ekstrakurikuler)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Kombel GENIUS (Komunitas Belajar Pendidik)</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>4 Buku Administrasi Kelas Terintegrasi</span>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Customer Service Chat & Tutorial Lengkap</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Modal Tambah Link Tutorial */}
      <AnimatePresence>
        {modalPlatform && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">
                  Tambah Video Tutorial {getPlatformIcon(modalPlatform)}
                </h3>
                <button
                  onClick={() => setModalPlatform(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Judul Video *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Tutorial Pengisian Jurnal Mengajar..."
                    value={judulInput}
                    onChange={(e) => setJudulInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    URL / Link Video *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalPlatform(null)}
                    className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#6C63FF] text-white font-bold text-xs shadow-md hover:bg-[#5651D9]"
                  >
                    Simpan Link
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

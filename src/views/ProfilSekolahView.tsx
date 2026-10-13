import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProfilSekolah } from '../types';
import {
  ArrowLeft,
  School,
  Edit3,
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  Users,
  GraduationCap,
  Trophy,
  Upload,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface ProfilSekolahViewProps {
  profil: ProfilSekolah;
  onBack: () => void;
  onUpdateProfil: (updated: ProfilSekolah) => void;
}

export const ProfilSekolahView: React.FC<ProfilSekolahViewProps> = ({
  profil,
  onBack,
  onUpdateProfil,
}) => {
  const [isEditingVisi, setIsEditingVisi] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  const [visiInput, setVisiInput] = useState(profil.visiSekolah);
  const [kepalaSekolahInput, setKepalaSekolahInput] = useState(
    profil.kepalaSekolah || 'Muhammad Rosyid Jamily, M.Pd'
  );
  const [npsnInput, setNpsnInput] = useState(profil.npsn);
  const [alamatInput, setAlamatInput] = useState(profil.alamat);
  const [teleponInput, setTeleponInput] = useState(profil.telepon);
  const [emailInput, setEmailInput] = useState(profil.email);
  const [guruInput, setGuruInput] = useState(profil.jumlahGuru);
  const [siswaInput, setSiswaInput] = useState(profil.jumlahSiswa);
  const [ekstraInput, setEkstraInput] = useState(profil.jumlahProgramEkstra);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onUpdateProfil({
          ...profil,
          logoUrl: event.target.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveVisi = () => {
    onUpdateProfil({
      ...profil,
      visiSekolah: visiInput,
    });
    setIsEditingVisi(false);
  };

  const handleSaveInfo = () => {
    onUpdateProfil({
      ...profil,
      kepalaSekolah: kepalaSekolahInput,
      npsn: npsnInput,
      alamat: alamatInput,
      telepon: teleponInput,
      email: emailInput,
      jumlahGuru: guruInput,
      jumlahSiswa: siswaInput,
      jumlahProgramEkstra: ekstraInput,
    });
    setIsEditingInfo(false);
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

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6C63FF] via-[#7F77FF] to-[#5651D9] text-white p-6 sm:p-8 shadow-xl shadow-indigo-900/10"
      >
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Logo container */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-white p-2 flex items-center justify-center shadow-xl overflow-hidden border-2 border-white/40">
              {profil.logoUrl ? (
                <img
                  src={profil.logoUrl}
                  alt="Logo Sekolah"
                  className="w-full h-full object-contain"
                />
              ) : (
                <School className="w-12 h-12 text-[#6C63FF]" />
              )}
            </div>
            <label className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer transition-all shadow-md">
              <Upload className="w-3.5 h-3.5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* School details */}
          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{profil.jenisSekolah}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {profil.namaSekolah}
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 font-medium mt-1 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-4 h-4 shrink-0 opacity-80" />
              <span>{profil.alamat}</span>
            </p>
          </div>
        </div>

        {/* Quick Statistics Strip */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-white/15 relative z-10">
          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-100 font-medium mb-1">
              <Users className="w-3.5 h-3.5" />
              <span>Guru Aktif</span>
            </div>
            <p className="text-xl sm:text-2xl font-black">{profil.jumlahGuru}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-100 font-medium mb-1">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Siswa Total</span>
            </div>
            <p className="text-xl sm:text-2xl font-black">{profil.jumlahSiswa}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-indigo-100 font-medium mb-1">
              <Trophy className="w-3.5 h-3.5" />
              <span>Prog. Ekstra</span>
            </div>
            <p className="text-xl sm:text-2xl font-black">{profil.jumlahProgramEkstra}</p>
          </div>
        </div>

        {/* Blobs */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </motion.div>

      {/* Visi Sekolah Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#6C63FF] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Visi Sekolah</h3>
          </div>

          {!isEditingVisi ? (
            <button
              onClick={() => setIsEditingVisi(true)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-[#6C63FF] text-slate-600 hover:text-[#6C63FF] text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ubah Visi</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingVisi(false)}
                className="px-3 py-1 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveVisi}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>
          )}
        </div>

        {!isEditingVisi ? (
          <blockquote className="p-4 rounded-2xl bg-indigo-50/40 border-l-4 border-[#6C63FF] text-xs sm:text-sm text-slate-700 font-medium leading-relaxed italic">
            "{profil.visiSekolah}"
          </blockquote>
        ) : (
          <textarea
            rows={3}
            value={visiInput}
            onChange={(e) => setVisiInput(e.target.value)}
            className="w-full p-3.5 rounded-2xl border border-[#6C63FF] bg-white text-xs text-slate-800 focus:outline-none focus:ring-4 focus:ring-[#6C63FF]/10 font-medium leading-relaxed"
          />
        )}
      </motion.div>

      {/* Informasi Detail Sekolah Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <School className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-800 text-base">Identitas & Informasi Sekolah</h3>
          </div>

          {!isEditingInfo ? (
            <button
              onClick={() => setIsEditingInfo(true)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-500 text-slate-600 hover:text-emerald-600 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Data</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingInfo(false)}
                className="px-3 py-1 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleSaveInfo}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan</span>
              </button>
            </div>
          )}
        </div>

        {!isEditingInfo ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex justify-between items-center sm:col-span-2">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6C63FF]" />
                Kepala Sekolah
              </span>
              <span className="font-extrabold text-[#6C63FF] text-xs sm:text-sm">
                {profil.kepalaSekolah || 'Muhammad Rosyid Jamily, M.Pd'}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                NPSN
              </span>
              <span className="font-extrabold text-slate-800 font-mono text-sm">{profil.npsn}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Telepon
              </span>
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                {profil.telepon}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Email
              </span>
              <span className="font-bold text-slate-800 flex items-center gap-1 truncate max-w-[200px]">
                <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                {profil.email}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Alamat
              </span>
              <span className="font-medium text-slate-800 truncate max-w-[200px]">
                {profil.alamat}
              </span>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={kepalaSekolahInput}
                onChange={(e) => setKepalaSekolahInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">NPSN</label>
              <input
                type="text"
                value={npsnInput}
                onChange={(e) => setNpsnInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Telepon</label>
              <input
                type="text"
                value={teleponInput}
                onChange={(e) => setTeleponInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Alamat Lengkap</label>
              <input
                type="text"
                value={alamatInput}
                onChange={(e) => setAlamatInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Jumlah Guru</label>
              <input
                type="number"
                value={guruInput}
                onChange={(e) => setGuruInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Jumlah Siswa</label>
              <input
                type="number"
                value={siswaInput}
                onChange={(e) => setSiswaInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

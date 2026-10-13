import React, { useState } from 'react';
import { motion } from 'motion/react';
import { JurnalOrangTuaData, User } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import {
  ArrowLeft,
  HeartHandshake,
  Calendar,
  Save,
  CheckCircle2,
  Sparkles,
  Sunrise,
  Heart,
  Apple,
  BookOpen,
  Moon,
  MessageSquare,
  Award,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { getStoredItem, setStoredItem, STORAGE_KEYS, INITIAL_JURNAL_ORANG_TUA } from '../data/initialData';
import { SpreadsheetStatusIndicator } from '../components/SpreadsheetStatusIndicator';

interface JurnalOrangTuaViewProps {
  user?: User | null;
  onBack: () => void;
  onSaveJurnalOrangTua: (data: JurnalOrangTuaData) => void;
}

export const JurnalOrangTuaView: React.FC<JurnalOrangTuaViewProps> = ({
  user,
  onBack,
  onSaveJurnalOrangTua,
}) => {
  const [entries, setEntries] = useState<JurnalOrangTuaData[]>(() =>
    getStoredItem<JurnalOrangTuaData[]>(
      STORAGE_KEYS.JURNAL_ORANG_TUA,
      INITIAL_JURNAL_ORANG_TUA
    )
  );

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [namaOrtu, setNamaOrtu] = useState(
    user?.role === 'Orang Tua' ? user.name : 'Hendra Wijaya, S.T'
  );
  const [namaAnak, setNamaAnak] = useState('Muhammad Fathan Al-Faruq');
  const [kelas, setKelas] = useState(user?.kelas || '4a');

  // 5 Habit observations at home
  const [bangunPagi, setBangunPagi] = useState('04.45 WIB - Bangun sendiri & merapikan tempat tidur');
  const [ibadah, setIbadah] = useState('Sholat Subuh berjamaah & berdoa sebelum beraktivitas');
  const [makanSehat, setMakanSehat] = useState('Sarapan nasi, lauk pauk, sayur & membawa bekal sehat');
  const [belajarMandiri, setBelajarMandiri] = useState('Membaca buku pengetahuan 20 menit & merapikan tas');
  const [tidurCepat, setTidurCepat] = useState('20.45 WIB - Tidur tepat waktu tanpa bermain gawai');
  const [pesanGuru, setPesanGuru] = useState('');
  const [paraf, setParaf] = useState(true);
  const [fotoData, setFotoData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'riwayat'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaOrtu.trim() || !namaAnak.trim()) {
      alert('Mohon isi nama orang tua dan nama siswa');
      return;
    }

    setIsSubmitting(true);

    const newRecord: JurnalOrangTuaData = {
      id: `jot-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date,
      namaOrtu: namaOrtu.trim(),
      namaAnak: namaAnak.trim(),
      kelas,
      bangunPagi,
      ibadah,
      makanSehat,
      belajarMandiri,
      tidurCepat,
      pesanGuru: pesanGuru.trim() || 'Ananda dalam kondisi sehat dan siap mengikuti pelajaran sekolah.',
      paraf,
      fotoData,
    };

    try {
      await onSaveJurnalOrangTua(newRecord);
      const updated = [newRecord, ...entries];
      setEntries(updated);
      setStoredItem(STORAGE_KEYS.JURNAL_ORANG_TUA, updated);

      setPesanGuru('');
      setFotoData('');
      setActiveTab('riwayat');
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-800">
                Jurnal Pendampingan Orang Tua
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                Wali Murid
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemantauan 7 Kebiasaan Anak Hebat di rumah & komunikasi langsung dengan wali kelas
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <SpreadsheetStatusIndicator variant="badge" />
        </div>
      </div>

      {/* Segmented Tab */}
      <div className="flex gap-2 p-1.5 bg-slate-200/60 rounded-2xl max-w-sm">
        <button
          onClick={() => setActiveTab('form')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'form'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Isi Jurnal Rumah
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'riwayat'
              ? 'bg-white text-emerald-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Riwayat Jurnal ({entries.length})
        </button>
      </div>

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
                <span>Identitas Orang Tua & Siswa</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Konfirmasi data ananda dan wali murid SDN Tamansari
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tanggal Pemantauan
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Orang Tua / Wali
                </label>
                <input
                  type="text"
                  value={namaOrtu}
                  onChange={(e) => setNamaOrtu(e.target.value)}
                  required
                  placeholder="Nama Lengkap Orang Tua"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Ananda (Siswa)
                </label>
                <input
                  type="text"
                  value={namaAnak}
                  onChange={(e) => setNamaAnak(e.target.value)}
                  required
                  placeholder="Nama Siswa"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kelas
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
                >
                  <option value="1">Kelas 1</option>
                  <option value="2a">Kelas 2A</option>
                  <option value="2b">Kelas 2B</option>
                  <option value="3a">Kelas 3A</option>
                  <option value="3b">Kelas 3B</option>
                  <option value="4a">Kelas 4A</option>
                  <option value="4b">Kelas 4B</option>
                  <option value="5">Kelas 5</option>
                  <option value="6">Kelas 6</option>
                </select>
              </div>
            </div>

            {/* Checklist 7 Kebiasaan di Rumah */}
            <div className="space-y-4 pt-2">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider text-emerald-800 bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Pemantauan Pembiasaan Karakter di Rumah</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-1.5">
                  <label className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Sunrise className="w-4 h-4 text-amber-600" />
                    <span>1. Bangun Pagi (Melatih Disiplin)</span>
                  </label>
                  <input
                    type="text"
                    value={bangunPagi}
                    onChange={(e) => setBangunPagi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-xs"
                    placeholder="Contoh: Pk 04.45 WIB, merapikan kasur mandiri"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/40 space-y-1.5">
                  <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-emerald-600" />
                    <span>2. Beribadah di Rumah</span>
                  </label>
                  <input
                    type="text"
                    value={ibadah}
                    onChange={(e) => setIbadah(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-emerald-200 bg-white text-xs"
                    placeholder="Contoh: Sholat subuh, mengaji, berdoa"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-1.5">
                  <label className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                    <Apple className="w-4 h-4 text-rose-600" />
                    <span>3. Makan Sehat & Sarapan Bergizi</span>
                  </label>
                  <input
                    type="text"
                    value={makanSehat}
                    onChange={(e) => setMakanSehat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-rose-200 bg-white text-xs"
                    placeholder="Contoh: Sarapan telur & sayur, bawa bekal air"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-indigo-200 bg-indigo-50/40 space-y-1.5">
                  <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>4. Belajar Mandiri di Rumah</span>
                  </label>
                  <input
                    type="text"
                    value={belajarMandiri}
                    onChange={(e) => setBelajarMandiri(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs"
                    placeholder="Contoh: Membaca 20 menit, mengerjakan tugas mandiri"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <Moon className="w-4 h-4 text-blue-600" />
                    <span>5. Tidur Cepat (Maksimal 21.00 WIB)</span>
                  </label>
                  <input
                    type="text"
                    value={tidurCepat}
                    onChange={(e) => setTidurCepat(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-blue-200 bg-white text-xs"
                    placeholder="Contoh: Pk 20.45 WIB tidur teratur, gawai disimpan"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Pesan / Catatan Orang Tua untuk Wali Kelas</span>
                </label>
                <textarea
                  rows={2}
                  value={pesanGuru}
                  onChange={(e) => setPesanGuru(e.target.value)}
                  placeholder="Tuliskan catatan kondisi kesehatan anak, semangat belajar, atau permohonan bimbingan khusus..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-emerald-500 focus:bg-white leading-relaxed"
                />
              </div>

              {/* Digital Signature / Paraf Ortu */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="paraf-check"
                    checked={paraf}
                    onChange={(e) => setParaf(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-md focus:ring-emerald-500"
                  />
                  <label htmlFor="paraf-check" className="text-xs font-bold text-emerald-900 cursor-pointer">
                    Paraf Digital Wali Murid: Menyatakan data di atas diisi dengan jujur oleh orang tua.
                  </label>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">
                  {paraf ? 'Tervalidasi' : 'Belum Paraf'}
                </span>
              </div>

              {/* Foto Dokumentasi */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Foto Dokumentasi Kebiasaan Anak di Rumah (Opsional)
                </label>
                <ImageUpload
                  value={fotoData}
                  onChange={setFotoData}
                  label="Unggah foto kegiatan belajar / sarapan / ibadah ananda"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Menyimpan ke Google Spreadsheet...</span>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Kirim Jurnal Orang Tua ke Google Spreadsheet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
              <HeartHandshake className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700">Belum Ada Riwayat Jurnal Orang Tua</h4>
              <p className="text-xs text-slate-400 mt-1">
                Silakan isi form jurnal pendampingan anak di rumah untuk memulai.
              </p>
            </div>
          ) : (
            entries.map((item, idx) => (
              <div
                key={item.id || idx}
                className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      #{entries.length - idx}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">
                        {item.namaAnak} (Kelas {item.kelas.toUpperCase()})
                      </h4>
                      <p className="text-xs text-slate-500">
                        {item.date} • Wali Murid: {item.namaOrtu}
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {item.paraf ? '✓ Diparaf Orang Tua' : 'Belum Paraf'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-3">
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200">
                    <span className="font-bold text-amber-900 block mb-0.5">Bangun Pagi:</span>
                    <span className="text-amber-800">{item.bangunPagi}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <span className="font-bold text-emerald-900 block mb-0.5">Ibadah di Rumah:</span>
                    <span className="text-emerald-800">{item.ibadah}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-200">
                    <span className="font-bold text-rose-900 block mb-0.5">Makan Sehat:</span>
                    <span className="text-rose-800">{item.makanSehat}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
                    <span className="font-bold text-indigo-900 block mb-0.5">Belajar Mandiri:</span>
                    <span className="text-indigo-800">{item.belajarMandiri}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs mb-3">
                  <span className="font-bold text-blue-900 block mb-0.5">Tidur Malam:</span>
                  <span className="text-blue-800">{item.tidurCepat}</span>
                </div>

                {item.pesanGuru && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">
                      Pesan untuk Wali Kelas:
                    </span>
                    <p className="text-slate-600 italic">"{item.pesanGuru}"</p>
                  </div>
                )}

                {item.fotoData && (
                  <div className="mt-3">
                    <img
                      src={item.fotoData}
                      alt="Dokumentasi Anak"
                      className="w-32 h-24 object-cover rounded-xl border border-slate-200"
                    />
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

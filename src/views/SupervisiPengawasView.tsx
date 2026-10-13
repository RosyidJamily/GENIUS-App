import React, { useState } from 'react';
import { motion } from 'motion/react';
import { SupervisiPengawasData, User } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import {
  ArrowLeft,
  ShieldCheck,
  LineChart,
  Calendar,
  UserCheck,
  Save,
  CheckCircle2,
  FileText,
  Sparkles,
  School,
  Clock,
  Printer,
  ChevronRight,
  Award,
} from 'lucide-react';
import { getStoredItem, setStoredItem, STORAGE_KEYS, INITIAL_SUPERVISI_PENGAWAS } from '../data/initialData';
import { SpreadsheetStatusIndicator } from '../components/SpreadsheetStatusIndicator';

interface SupervisiPengawasViewProps {
  user?: User | null;
  onBack: () => void;
  onSaveSupervisiPengawas: (data: SupervisiPengawasData) => void;
}

export const SupervisiPengawasView: React.FC<SupervisiPengawasViewProps> = ({
  user,
  onBack,
  onSaveSupervisiPengawas,
}) => {
  const [entries, setEntries] = useState<SupervisiPengawasData[]>(() =>
    getStoredItem<SupervisiPengawasData[]>(
      STORAGE_KEYS.SUPERVISI_PENGAWAS,
      INITIAL_SUPERVISI_PENGAWAS
    )
  );

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [pengawas, setPengawas] = useState(
    user?.role === 'Pengawas' ? user.name : 'Drs. H. Bambang Sujarwo, M.Pd'
  );
  const [nip, setNip] = useState(
    user?.role === 'Pengawas' && user.nip ? user.nip : '196803121993031005'
  );
  const [sasaran, setSasaran] = useState('Kepala Sekolah (Muhammad Rosyid Jamily, M.Pd)');
  const [aspekSupervisi, setAspekSupervisi] = useState(
    'Implementasi Kurikulum Merdeka & Budaya Karakter 7 Kebiasaan'
  );
  const [temuan, setTemuan] = useState('');
  const [rekomendasi, setRekomendasi] = useState('');
  const [tindakLanjut, setTindakLanjut] = useState('');
  const [fotoData, setFotoData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'form' | 'riwayat'>('form');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!temuan.trim() || !rekomendasi.trim()) {
      alert('Mohon lengkapi temuan pembinaan dan rekomendasi mutu');
      return;
    }

    setIsSubmitting(true);

    const newRecord: SupervisiPengawasData = {
      id: `sp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      date,
      pengawas,
      nip,
      sasaran,
      aspekSupervisi,
      temuan: temuan.trim(),
      rekomendasi: rekomendasi.trim(),
      tindakLanjut: tindakLanjut.trim() || 'Ditindaklanjuti dalam rapat koordinasi sekolah.',
      fotoData,
    };

    try {
      await onSaveSupervisiPengawas(newRecord);
      const updated = [newRecord, ...entries];
      setEntries(updated);
      setStoredItem(STORAGE_KEYS.SUPERVISI_PENGAWAS, updated);

      // Reset Form
      setTemuan('');
      setRekomendasi('');
      setTindakLanjut('');
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
                Supervisi & Pembinaan Pengawas
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 uppercase">
                Pengawas Pembina
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instrumen pengawasan mutu sekolah, pembinaan KS & evaluasi pembelajaran guru
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
              ? 'bg-white text-sky-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Form Supervisi Pengawas
        </button>
        <button
          onClick={() => setActiveTab('riwayat')}
          className={`flex-1 py-2 px-4 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'riwayat'
              ? 'bg-white text-sky-700 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Riwayat Pembinaan ({entries.length})
        </button>
      </div>

      {activeTab === 'form' ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-sky-600" />
                <span>Identitas Pengawasan & Sasaran Pembinaan</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Data resmi kunjungan pengawas sekolah di SDN Tamansari
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tanggal Kunjungan Supervisi
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Pengawas Pembina
                </label>
                <input
                  type="text"
                  value={pengawas}
                  onChange={(e) => setPengawas(e.target.value)}
                  required
                  placeholder="Nama Lengkap & Gelar Pengawas"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  NIP Pengawas
                </label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  required
                  placeholder="NIP Pengawas Pembina"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Sasaran Supervisi
                </label>
                <select
                  value={sasaran}
                  onChange={(e) => setSasaran(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                >
                  <option value="Kepala Sekolah (Muhammad Rosyid Jamily, M.Pd)">
                    Kepala Sekolah (Muhammad Rosyid Jamily, M.Pd)
                  </option>
                  <option value="Guru Kelas (Fase A, B, C)">Guru Kelas (Fase A, B, C)</option>
                  <option value="Guru Mata Pelajaran (PAI, PJOK, Bhs Inggris)">Guru Mata Pelajaran</option>
                  <option value="Pembina Ekstrakurikuler (GENIUS Class)">Pembina Ekstrakurikuler</option>
                  <option value="Manajemen Sarpras & Tata Kelola Sekolah">Manajemen Sarpras & Tata Kelola</option>
                  <option value="Seluruh Pendidik & Tenaga Kependidikan">Seluruh Pendidik & Tendik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Aspek Supervisi / Standar Mutu
                </label>
                <select
                  value={aspekSupervisi}
                  onChange={(e) => setAspekSupervisi(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white"
                >
                  <option value="Implementasi Kurikulum Merdeka & Budaya Karakter 7 Kebiasaan">
                    Implementasi Kurikulum Merdeka & Budaya 7 Kebiasaan
                  </option>
                  <option value="Supervisi Manajerial Kepemimpinan Kepala Sekolah">
                    Supervisi Manajerial Kepemimpinan Kepala Sekolah
                  </option>
                  <option value="Administrasi Modul Ajar & Diferensiasi Pembelajaran Guru">
                    Administrasi Modul Ajar & Diferensiasi Pembelajaran Guru
                  </option>
                  <option value="Evaluasi Pembiasaan Pagi & Program Ekstrakurikuler">
                    Evaluasi Pembiasaan Pagi & Program Ekstrakurikuler
                  </option>
                  <option value="Ketertiban Administrasi Kelas & Penilaian Asesmen Formatif/Sumatif">
                    Ketertiban Administrasi Kelas & Asesmen
                  </option>
                  <option value="RKT, RKAS & Ketercapaian Rapor Pendidikan Sekolah">
                    RKT, RKAS & Ketercapaian Rapor Pendidikan
                  </option>
                </select>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Temuan & Catatan Pengamatan Pengawas
                </label>
                <textarea
                  rows={3}
                  value={temuan}
                  onChange={(e) => setTemuan(e.target.value)}
                  required
                  placeholder="Tuliskan temuan positif, bukti pelaksanaan di kelas/sekolah, atau hal yang diobservasi..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Rekomendasi Peningkatan Mutu Pengawas
                </label>
                <textarea
                  rows={3}
                  value={rekomendasi}
                  onChange={(e) => setRekomendasi(e.target.value)}
                  required
                  placeholder="Tuliskan saran rekomendasi strategis bagi Kepala Sekolah dan Bapak/Ibu Guru..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. Rencana Tindak Lanjut Sekolah
                </label>
                <textarea
                  rows={2}
                  value={tindakLanjut}
                  onChange={(e) => setTindakLanjut(e.target.value)}
                  placeholder="Langkah konkret sekolah dalam menindaklanjuti arahan pengawas..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-sky-500 focus:bg-white leading-relaxed"
                />
              </div>
            </div>

            {/* Foto Dokumentasi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Foto Dokumentasi Kunjungan Pengawas (Opsional)
              </label>
              <ImageUpload
                value={fotoData}
                onChange={setFotoData}
                label="Unggah foto kunjungan supervisi pengawas"
              />
            </div>

            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-700 hover:from-sky-700 hover:to-indigo-800 text-white font-extrabold text-sm shadow-lg shadow-sky-600/25 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Menyimpan ke Google Spreadsheet...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Simpan Supervisi Pengawas & Sinkron ke Spreadsheet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          {entries.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-slate-200">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700">Belum Ada Riwayat Supervisi Pengawas</h4>
              <p className="text-xs text-slate-400 mt-1">
                Silakan isi form supervisi di atas untuk mencatat kunjungan pembinaan pengawas.
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
                    <span className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      #{entries.length - idx}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">{item.aspekSupervisi}</h4>
                      <p className="text-xs text-slate-500">
                        {item.date} • Pengawas: {item.pengawas} (NIP: {item.nip})
                      </p>
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Sasaran: {item.sasaran}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-extrabold text-slate-700 block mb-1">
                      Catatan Temuan Pengawas:
                    </span>
                    <p className="text-slate-600 leading-relaxed">{item.temuan}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200">
                    <span className="font-extrabold text-sky-800 block mb-1">
                      Rekomendasi Mutu Pengawas:
                    </span>
                    <p className="text-sky-900 leading-relaxed">{item.rekomendasi}</p>
                  </div>
                </div>

                {item.tindakLanjut && (
                  <div className="mt-3 text-xs p-3 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-emerald-800">Tindak Lanjut Sekolah: </span>
                      <span className="text-emerald-900">{item.tindakLanjut}</span>
                    </div>
                  </div>
                )}

                {item.fotoData && (
                  <div className="mt-3">
                    <img
                      src={item.fotoData}
                      alt="Dokumentasi Pengawas"
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

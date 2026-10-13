import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KELAS_LIST } from '../data/initialData';
import {
  BukuKejadianData,
  BukuKunjunganData,
  BukuInventarisData,
  BukuPerkembanganData,
} from '../types';
import { ImageUpload } from '../components/ImageUpload';
import {
  ArrowLeft,
  FolderKanban,
  AlertTriangle,
  Users2,
  Boxes,
  TrendingUp,
  Save,
  CheckCircle,
} from 'lucide-react';

interface AdministrasiViewProps {
  onBack: () => void;
  onSaveKejadian: (data: BukuKejadianData) => void;
  onSaveKunjungan: (data: BukuKunjunganData) => void;
  onSaveInventaris: (data: BukuInventarisData) => void;
  onSavePerkembangan: (data: BukuPerkembanganData) => void;
}

export const AdministrasiView: React.FC<AdministrasiViewProps> = ({
  onBack,
  onSaveKejadian,
  onSaveKunjungan,
  onSaveInventaris,
  onSavePerkembangan,
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<
    'kejadian' | 'kunjungan' | 'inventaris' | 'perkembangan'
  >('kejadian');

  // Buku Kejadian state
  const [kejDate, setKejDate] = useState(new Date().toISOString().split('T')[0]);
  const [kejNama, setKejNama] = useState('');
  const [kejKelas, setKejKelas] = useState('4a');
  const [kejJenis, setKejJenis] = useState<'Prestasi' | 'Pelanggaran' | 'Kecelakaan' | 'Kesehatan' | 'Lainnya'>('Prestasi');
  const [kejDeskripsi, setKejDeskripsi] = useState('');
  const [kejTindakan, setKejTindakan] = useState('');
  const [kejFoto, setKejFoto] = useState('');

  // Buku Kunjungan state
  const [kunDate, setKunDate] = useState(new Date().toISOString().split('T')[0]);
  const [kunNama, setKunNama] = useState('');
  const [kunInstansi, setKunInstansi] = useState('');
  const [kunKeperluan, setKunKeperluan] = useState('');
  const [kunBertemu, setKunBertemu] = useState('Kepala Sekolah');
  const [kunKeterangan, setKunKeterangan] = useState('');
  const [kunFoto, setKunFoto] = useState('');

  // Buku Inventaris state
  const [invDate, setInvDate] = useState(new Date().toISOString().split('T')[0]);
  const [invNama, setInvNama] = useState('');
  const [invKode, setInvKode] = useState('');
  const [invJumlah, setInvJumlah] = useState<number>(1);
  const [invKondisi, setInvKondisi] = useState<'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Hilang'>('Baik');
  const [invLokasi, setInvLokasi] = useState('Ruang Kelas 4A');
  const [invKeterangan, setInvKeterangan] = useState('');
  const [invFoto, setInvFoto] = useState('');

  // Buku Perkembangan state
  const [perkDate, setPerkDate] = useState(new Date().toISOString().split('T')[0]);
  const [perkNama, setPerkNama] = useState('');
  const [perkKelas, setPerkKelas] = useState('4a');
  const [perkAspek, setPerkAspek] = useState<'Akademik' | 'Sikap' | 'Keterampilan' | 'Sosial' | 'Emosional'>('Akademik');
  const [perkDeskripsi, setPerkDeskripsi] = useState('');
  const [perkTindakLanjut, setPerkTindakLanjut] = useState('');
  const [perkFoto, setPerkFoto] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitKejadian = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kejNama.trim()) return alert('Nama siswa wajib diisi');
    if (!kejDeskripsi.trim()) return alert('Deskripsi kejadian wajib diisi');

    setIsSubmitting(true);
    const data: BukuKejadianData = {
      date: kejDate,
      namaSiswa: kejNama,
      kelas: kejKelas,
      jenisKejadian: kejJenis,
      deskripsi: kejDeskripsi,
      tindakan: kejTindakan,
      fotoData: kejFoto,
    };
    setTimeout(() => {
      onSaveKejadian(data);
      setIsSubmitting(false);
    }, 400);
  };

  const handleSubmitKunjungan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kunNama.trim()) return alert('Nama pengunjung wajib diisi');
    if (!kunInstansi.trim()) return alert('Instansi wajib diisi');
    if (!kunKeperluan.trim()) return alert('Keperluan wajib diisi');

    setIsSubmitting(true);
    const data: BukuKunjunganData = {
      date: kunDate,
      namaPengunjung: kunNama,
      instansi: kunInstansi,
      keperluan: kunKeperluan,
      bertemu: kunBertemu,
      keterangan: kunKeterangan,
      fotoData: kunFoto,
    };
    setTimeout(() => {
      onSaveKunjungan(data);
      setIsSubmitting(false);
    }, 400);
  };

  const handleSubmitInventaris = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invNama.trim()) return alert('Nama barang wajib diisi');
    if (!invKode.trim()) return alert('Kode barang wajib diisi');

    setIsSubmitting(true);
    const data: BukuInventarisData = {
      date: invDate,
      namaBarang: invNama,
      kodeBarang: invKode,
      jumlah: Number(invJumlah) || 1,
      kondisi: invKondisi,
      lokasi: invLokasi,
      keterangan: invKeterangan,
      fotoData: invFoto,
    };
    setTimeout(() => {
      onSaveInventaris(data);
      setIsSubmitting(false);
    }, 400);
  };

  const handleSubmitPerkembangan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!perkNama.trim()) return alert('Nama siswa wajib diisi');
    if (!perkDeskripsi.trim()) return alert('Deskripsi perkembangan wajib diisi');

    setIsSubmitting(true);
    const data: BukuPerkembanganData = {
      date: perkDate,
      namaSiswa: perkNama,
      kelas: perkKelas,
      aspek: perkAspek,
      deskripsi: perkDeskripsi,
      tindakLanjut: perkTindakLanjut,
      fotoData: perkFoto,
    };
    setTimeout(() => {
      onSavePerkembangan(data);
      setIsSubmitting(false);
    }, 400);
  };

  const subTabs = [
    { id: 'kejadian', label: 'Buku Kejadian', icon: AlertTriangle, color: 'text-amber-600 bg-amber-50' },
    { id: 'kunjungan', label: 'Buku Kunjungan', icon: Users2, color: 'text-blue-600 bg-blue-50' },
    { id: 'inventaris', label: 'Buku Inventaris', icon: Boxes, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'perkembangan', label: 'Perkembangan Siswa', icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">
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
        {/* Header */}
        <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
              Buku Administrasi Guru & Kelas
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Pencatatan kejadian siswa, buku tamu kunjungan, inventaris sarpras, dan perkembangan belajar
            </p>
          </div>
        </div>

        {/* Sub-Tabs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-6">
          {subTabs.map((t) => {
            const IconComponent = t.icon;
            const isSelected = selectedSubTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedSubTab(t.id as any)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'border-[#6C63FF] bg-indigo-50/50 text-[#6C63FF] shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className={`p-2 rounded-xl ${t.color}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <span className="font-bold text-xs leading-tight line-clamp-1">{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. BUKU KEJADIAN FORM */}
        {selectedSubTab === 'kejadian' && (
          <form onSubmit={handleSubmitKejadian} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal Kejadian *
                </label>
                <input
                  type="date"
                  required
                  value={kejDate}
                  onChange={(e) => setKejDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap siswa..."
                  value={kejNama}
                  onChange={(e) => setKejNama(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kelas *
                </label>
                <select
                  required
                  value={kejKelas}
                  onChange={(e) => setKejKelas(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                >
                  {KELAS_LIST.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Jenis Kejadian *
              </label>
              <div className="flex flex-wrap gap-2">
                {['Prestasi', 'Pelanggaran', 'Kecelakaan', 'Kesehatan', 'Lainnya'].map((jk) => (
                  <button
                    key={jk}
                    type="button"
                    onClick={() => setKejJenis(jk as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      kejJenis === jk
                        ? 'bg-[#6C63FF] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {jk}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Deskripsi Kejadian / Prestasi *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Uraikan kronologi kejadian atau rincian prestasi yang diraih..."
                  value={kejDeskripsi}
                  onChange={(e) => setKejDeskripsi(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tindakan yang Diambil / Pembinaan *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Tindakan penanganan, apresiasi sekolah, atau komunikasi orang tua..."
                  value={kejTindakan}
                  onChange={(e) => setKejTindakan(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>
            </div>

            <ImageUpload
              label="Upload Foto Terkait (Opsional)"
              value={kejFoto}
              onChange={setKejFoto}
              helperText="Lampirkan piagam/foto dokumentasi kejadian"
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-xl hover:opacity-95 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Buku Kejadian</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. BUKU KUNJUNGAN TAMU FORM */}
        {selectedSubTab === 'kunjungan' && (
          <form onSubmit={handleSubmitKunjungan} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal Kunjungan *
                </label>
                <input
                  type="date"
                  required
                  value={kunDate}
                  onChange={(e) => setKunDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Pengunjung *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama lengkap pengunjung..."
                  value={kunNama}
                  onChange={(e) => setKunNama(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Asal Instansi / Lembaga *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dinas Pendidikan / Puskesmas / Komite / dll..."
                  value={kunInstansi}
                  onChange={(e) => setKunInstansi(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Bertemu Dengan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Kepala Sekolah / Guru Kelas / dll..."
                  value={kunBertemu}
                  onChange={(e) => setKunBertemu(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Keperluan Kunjungan *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Tujuan kedatangan dan agenda pembahasan..."
                value={kunKeperluan}
                onChange={(e) => setKunKeperluan(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Keterangan Tambahan / Hasil Pertemuan
              </label>
              <textarea
                rows={2}
                placeholder="Catatan hasil pertemuan tamu..."
                value={kunKeterangan}
                onChange={(e) => setKunKeterangan(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <ImageUpload
              label="Upload Foto Kunjungan (Opsional)"
              value={kunFoto}
              onChange={setKunFoto}
              helperText="Lampirkan foto tamu atau dokumen kunjungan"
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-xl hover:opacity-95 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Buku Kunjungan</span>
              </button>
            </div>
          </form>
        )}

        {/* 3. BUKU INVENTARIS FORM */}
        {selectedSubTab === 'inventaris' && (
          <form onSubmit={handleSubmitInventaris} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal Pencatatan *
                </label>
                <input
                  type="date"
                  required
                  value={invDate}
                  onChange={(e) => setInvDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Barang / Sarpras *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: Proyektor LCD Infocus..."
                  value={invNama}
                  onChange={(e) => setInvNama(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kode Barang *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Misal: INV-2026-001..."
                  value={invKode}
                  onChange={(e) => setInvKode(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Jumlah Barang *
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={invJumlah}
                  onChange={(e) => setInvJumlah(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kondisi Barang *
                </label>
                <select
                  required
                  value={invKondisi}
                  onChange={(e) => setInvKondisi(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                >
                  <option value="Baik">Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                  <option value="Hilang">Hilang</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Lokasi Penyimpanan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Lab Komputer / Kelas 4A / dll..."
                  value={invLokasi}
                  onChange={(e) => setInvLokasi(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Keterangan Sumber Pengadaan & Riwayat
              </label>
              <textarea
                rows={2}
                placeholder="Sumber dana BOS / Bantuan Dinas / Hibah..."
                value={invKeterangan}
                onChange={(e) => setInvKeterangan(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
              />
            </div>

            <ImageUpload
              label="Upload Foto Barang Inventaris"
              value={invFoto}
              onChange={setInvFoto}
              helperText="Lampirkan foto fisik barang atau nomor seri inventaris"
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-xl hover:opacity-95 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Buku Inventaris</span>
              </button>
            </div>
          </form>
        )}

        {/* 4. BUKU PERKEMBANGAN SISWA FORM */}
        {selectedSubTab === 'perkembangan' && (
          <form onSubmit={handleSubmitPerkembangan} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tanggal Pengamatan *
                </label>
                <input
                  type="date"
                  required
                  value={perkDate}
                  onChange={(e) => setPerkDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Nama Siswa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama siswa yang diobservasi..."
                  value={perkNama}
                  onChange={(e) => setPerkNama(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Kelas *
                </label>
                <select
                  required
                  value={perkKelas}
                  onChange={(e) => setPerkKelas(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-[#6C63FF]"
                >
                  {KELAS_LIST.map((k) => (
                    <option key={k.value} value={k.value}>
                      {k.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Aspek Perkembangan *
              </label>
              <div className="flex flex-wrap gap-2">
                {['Akademik', 'Sikap', 'Keterampilan', 'Sosial', 'Emosional'].map((asp) => (
                  <button
                    key={asp}
                    type="button"
                    onClick={() => setPerkAspek(asp as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      perkAspek === asp
                        ? 'bg-purple-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {asp}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Deskripsi Perkembangan Belajar & Perilaku *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Catat kemajuan belajar, perubahan perilaku, minat khusus, atau tantangan..."
                  value={perkDeskripsi}
                  onChange={(e) => setPerkDeskripsi(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Tindak Lanjut & Pendampingan Guru *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Rencana bimbingan individual, pengayaan materi, atau konsultasi wali murid..."
                  value={perkTindakLanjut}
                  onChange={(e) => setPerkTindakLanjut(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
                />
              </div>
            </div>

            <ImageUpload
              label="Upload Foto Pendukung (Opsional)"
              value={perkFoto}
              onChange={setPerkFoto}
              helperText="Lampirkan foto hasil kerja siswa atau dokumentasi bimbingan"
            />

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-xl hover:opacity-95 flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Buku Perkembangan</span>
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

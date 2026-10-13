import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  FileSpreadsheet,
  FileText,
  FileDown,
  Printer,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  ClipboardCheck,
  CalendarCheck,
  Trophy,
  Users,
  FolderKanban,
  Search,
  Download,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  AllFeaturesData,
  FeatureKey,
  FEATURE_OPTIONS,
  fetchAllAppData,
  exportToExcel,
  exportToWord,
  exportToPdf,
} from '../services/rekapExportService';
import { GURU_LIST } from '../data/initialData';

interface RekapMonitoringSectionProps {
  onNotify?: (message: string, type: 'success' | 'info') => void;
}

export const RekapMonitoringSection: React.FC<RekapMonitoringSectionProps> = ({ onNotify }) => {
  const [data, setData] = useState<AllFeaturesData>(() => fetchAllAppData());
  const [selectedFeature, setSelectedFeature] = useState<FeatureKey>('all');
  const [selectedTeacher, setSelectedTeacher] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isExporting, setIsExporting] = useState<string | null>(null);

  // Refresh latest data
  const handleReload = () => {
    setData(fetchAllAppData());
  };

  // Filtered Preview Data
  const filteredPreviewList = useMemo(() => {
    let items: Array<{
      id: string;
      no: number;
      tanggal: string;
      fitur: string;
      pelaksana: string;
      kelas?: string;
      kegiatan: string;
      hasil: string;
    }> = [];

    let count = 1;

    // 1. Jurnal Mengajar
    if (selectedFeature === 'all' || selectedFeature === 'jurnal') {
      data.journals.forEach((j) => {
        const presensiBadge = j.absensi
          ? `[Presensi: H:${j.absensi.hadir}/${j.absensi.totalSiswa || 0}, S:${j.absensi.sakit}, I:${j.absensi.izin}, A:${j.absensi.alpa}${j.absensi.siswaTidakHadir ? ` (${j.absensi.siswaTidakHadir})` : ''}] `
          : '';
        items.push({
          id: `jrn-${j.id || Math.random()}`,
          no: count++,
          tanggal: j.date || '-',
          fitur: 'Jurnal Mengajar',
          pelaksana: j.guru || '-',
          kelas: j.kelas ? `Kelas ${j.kelas.toUpperCase()}` : '-',
          kegiatan: `${presensiBadge}${(j.sessions || []).map((s) => `${s.mapel}: ${s.materi}`).join('; ') || 'Sesi pembelajaran'}`,
          hasil: `Kendala: ${j.kendala || 'Tidak ada'} | RTL: ${j.rencana || 'Sesuai target'}`,
        });
      });
    }

    // 2. Supervisi
    if (selectedFeature === 'all' || selectedFeature === 'supervisi') {
      data.supervisions.forEach((s) => {
        items.push({
          id: `sup-${s.id || Math.random()}`,
          no: count++,
          tanggal: s.date || '-',
          fitur: `Supervisi (${s.tahapan?.toUpperCase() || 'AKADEMIK'})`,
          pelaksana: s.guru || '-',
          kelas: s.kelas ? `Kelas ${s.kelas.toUpperCase()}` : '-',
          kegiatan: `Mapel: ${s.mapel || '-'}`,
          hasil: `Hasil: ${s.hasil || '-'} | RTL: ${s.tindakLanjut || '-'}`,
        });
      });
    }

    // 3. Jadwal Supervisi
    if (selectedFeature === 'all' || selectedFeature === 'jadwal') {
      data.jadwalSupervisi.forEach((js) => {
        items.push({
          id: `jdw-${js.id || Math.random()}`,
          no: count++,
          tanggal: `${js.hari || ''}, ${js.date || '-'}`,
          fitur: 'Jadwal Supervisi',
          pelaksana: js.guru || '-',
          kelas: js.kelas ? `Kelas ${js.kelas.toUpperCase()}` : '-',
          kegiatan: `Waktu: ${js.waktu || '-'}`,
          hasil: `Pengawas / Asesor: ${js.pengawas || '-'}`,
        });
      });
    }

    // 4. Pembiasaan
    if (selectedFeature === 'all' || selectedFeature === 'pembiasaan') {
      data.pembiasaan.forEach((p) => {
        items.push({
          id: `pem-${p.id || Math.random()}`,
          no: count++,
          tanggal: p.date || '-',
          fitur: 'Jurnal Pembiasaan',
          pelaksana: p.koordinator || '-',
          kegiatan: `${p.kegiatan} (${p.peserta || 0} Siswa)`,
          hasil: `Deskripsi: ${p.deskripsi || '-'} | Evaluasi: ${p.hasil || '-'}`,
        });
      });
    }

    // Seven Habits (7 Kebiasaan Anak Hebat)
    if (selectedFeature === 'all' || selectedFeature === 'seven-habits') {
      (data.sevenHabits || []).forEach((sh) => {
        const habitsSummary = (sh.habits || [])
          .map((h) => `${h.name}: ${h.jumlahSiswa}/${sh.jumlahSiswa} (${h.persentase}%)`)
          .join(', ');
        items.push({
          id: `sh-${sh.id || Math.random()}`,
          no: count++,
          tanggal: sh.date || '-',
          fitur: 'Seven Habits (7 Kebiasaan)',
          pelaksana: sh.guru || '-',
          kelas: sh.kelas ? `Kelas ${sh.kelas.toUpperCase()}` : '-',
          kegiatan: `${sh.jumlahSiswa} Siswa • ${habitsSummary}`,
          hasil: `Refleksi: ${sh.catatanRefleksi || '-'} | RTL: ${sh.tindakLanjut || '-'}`,
        });
      });
    }

    // 5. GENIUS Class & OSN
    if (selectedFeature === 'all' || selectedFeature === 'genius-class') {
      data.geniusClass.forEach((g) => {
        items.push({
          id: `gen-${g.id || Math.random()}`,
          no: count++,
          tanggal: g.date || '-',
          fitur: `GENIUS Class (${g.geniusClass})`,
          pelaksana: g.pembina || '-',
          kegiatan: `${g.subKegiatan || g.geniusClass} • Materi: ${(g.lingkupMateri || []).join(', ') || g.kegiatan}`,
          hasil: `Capaian: ${g.hasil || '-'} (${g.peserta || 0} Siswa)`,
        });
      });
    }

    // 6. Kombel GENIUS
    if (selectedFeature === 'all' || selectedFeature === 'kombel') {
      data.kombel.forEach((k) => {
        items.push({
          id: `kom-${k.id || Math.random()}`,
          no: count++,
          tanggal: k.date || '-',
          fitur: 'Kombel GENIUS',
          pelaksana: k.pemateri || '-',
          kegiatan: `Topik: ${k.topik} (${k.peserta || 0} Guru)`,
          hasil: `Praktik Baik / RTL: ${k.praktikBaik || '-'}`,
        });
      });
    }

    // 7. Administrasi: Buku Kejadian
    if (selectedFeature === 'all' || selectedFeature === 'administrasi' || selectedFeature === 'kejadian') {
      data.bukuKejadian.forEach((bk) => {
        items.push({
          id: `bkj-${bk.id || Math.random()}`,
          no: count++,
          tanggal: bk.date || '-',
          fitur: 'Buku Kejadian Siswa',
          pelaksana: bk.namaSiswa || '-',
          kelas: bk.kelas ? `Kelas ${bk.kelas.toUpperCase()}` : '-',
          kegiatan: `[${bk.jenisKejadian}] ${bk.deskripsi || '-'}`,
          hasil: `Tindakan: ${bk.tindakan || '-'}`,
        });
      });
    }

    // 8. Administrasi: Buku Kunjungan
    if (selectedFeature === 'all' || selectedFeature === 'administrasi' || selectedFeature === 'kunjungan') {
      data.bukuKunjungan.forEach((bk) => {
        items.push({
          id: `bkn-${bk.id || Math.random()}`,
          no: count++,
          tanggal: bk.date || '-',
          fitur: 'Buku Kunjungan Tamu',
          pelaksana: bk.namaPengunjung || '-',
          kegiatan: `Instansi: ${bk.instansi || '-'} | Bertemu: ${bk.bertemu || '-'}`,
          hasil: `Keperluan: ${bk.keperluan || '-'} | Keterangan: ${bk.keterangan || '-'}`,
        });
      });
    }

    // 9. Administrasi: Buku Inventaris
    if (selectedFeature === 'all' || selectedFeature === 'administrasi' || selectedFeature === 'inventaris') {
      data.bukuInventaris.forEach((bi) => {
        items.push({
          id: `bin-${bi.id || Math.random()}`,
          no: count++,
          tanggal: bi.date || '-',
          fitur: 'Buku Inventaris Sarpras',
          pelaksana: bi.namaBarang || '-',
          kegiatan: `Kode: ${bi.kodeBarang || '-'} | Jumlah: ${bi.jumlah || 0} Unit (${bi.kondisi || '-'})`,
          hasil: `Lokasi: ${bi.lokasi || '-'} | Ket: ${bi.keterangan || '-'}`,
        });
      });
    }

    // 10. Administrasi: Perkembangan Siswa
    if (selectedFeature === 'all' || selectedFeature === 'administrasi' || selectedFeature === 'perkembangan') {
      data.bukuPerkembangan.forEach((bp) => {
        items.push({
          id: `bpr-${bp.id || Math.random()}`,
          no: count++,
          tanggal: bp.date || '-',
          fitur: 'Perkembangan Siswa',
          pelaksana: bp.namaSiswa || '-',
          kelas: bp.kelas ? `Kelas ${bp.kelas.toUpperCase()}` : '-',
          kegiatan: `Aspek: ${bp.aspek || '-'} • ${bp.deskripsi || '-'}`,
          hasil: `Rencana Tindak Lanjut: ${bp.tindakLanjut || '-'}`,
        });
      });
    }

    // Apply Teacher Filter
    if (selectedTeacher !== 'all') {
      items = items.filter((it) =>
        it.pelaksana.toLowerCase().includes(selectedTeacher.toLowerCase())
      );
    }

    // Apply Keyword Search
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      items = items.filter(
        (it) =>
          it.fitur.toLowerCase().includes(q) ||
          it.pelaksana.toLowerCase().includes(q) ||
          it.kegiatan.toLowerCase().includes(q) ||
          it.hasil.toLowerCase().includes(q) ||
          it.tanggal.toLowerCase().includes(q)
      );
    }

    return items;
  }, [data, selectedFeature, selectedTeacher, searchKeyword]);

  // Handle Downloads
  const handleExportExcel = () => {
    setIsExporting('excel');
    try {
      exportToExcel(data, selectedFeature, selectedTeacher);
      onNotify?.('Laporan format Excel (.xlsx) berhasil diunduh!', 'success');
    } catch (err: any) {
      console.error(err);
      onNotify?.(`Gagal mengunduh Excel: ${err?.message}`, 'info');
    } finally {
      setTimeout(() => setIsExporting(null), 800);
    }
  };

  const handleExportWord = () => {
    setIsExporting('word');
    try {
      exportToWord(data, selectedFeature, selectedTeacher);
      onNotify?.('Laporan format Word (.doc) lengkap dengan Kop Surat berhasil diunduh!', 'success');
    } catch (err: any) {
      console.error(err);
      onNotify?.(`Gagal mengunduh Word: ${err?.message}`, 'info');
    } finally {
      setTimeout(() => setIsExporting(null), 800);
    }
  };

  const handleExportPdf = () => {
    setIsExporting('pdf');
    try {
      exportToPdf(data, selectedFeature, selectedTeacher);
      onNotify?.('Laporan format PDF (.pdf) resmi berhasil diunduh!', 'success');
    } catch (err: any) {
      console.error(err);
      onNotify?.(`Gagal mengunduh PDF: ${err?.message}`, 'info');
    } finally {
      setTimeout(() => setIsExporting(null), 800);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Action Download Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-[#6C63FF] to-purple-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-indigo-100 text-xs font-bold mb-3 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Pusat Unduh Laporan Resmi Kepala Sekolah</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
              Rekapitulasi Semua Fitur GENIUS App
            </h2>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1.5 leading-relaxed font-normal">
              Unduh seluruh hasil input jurnal mengajar, supervisi akademik, pembiasaan, GENIUS class/OSN 2026, kombel, dan administrasi dalam format <strong>Excel</strong>, <strong>Word</strong>, maupun <strong>PDF</strong> resmi.
            </p>
          </div>

          {/* 3 Main Action Download Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 shrink-0">
            {/* Download Excel */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExportExcel}
              disabled={isExporting !== null}
              className="px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all border border-emerald-400/30"
            >
              <FileSpreadsheet className="w-4 h-4 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-emerald-100 font-medium">Spreadsheet</span>
                <span className="font-extrabold text-xs">Unduh Excel (.xlsx)</span>
              </div>
            </motion.button>

            {/* Download Word */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExportWord}
              disabled={isExporting !== null}
              className="px-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-950/20 flex items-center justify-center gap-2 transition-all border border-blue-400/30"
            >
              <FileText className="w-4 h-4 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-blue-100 font-medium">Dokumen Word</span>
                <span className="font-extrabold text-xs">Unduh Word (.doc)</span>
              </div>
            </motion.button>

            {/* Download PDF */}
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleExportPdf}
              disabled={isExporting !== null}
              className="px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-950/20 flex items-center justify-center gap-2 transition-all border border-rose-400/30"
            >
              <FileDown className="w-4 h-4 shrink-0" />
              <div className="text-left leading-tight">
                <span className="block text-[10px] text-rose-100 font-medium">Format PDF</span>
                <span className="font-extrabold text-xs">Unduh PDF (.pdf)</span>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Decorative circle shapes */}
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -bottom-16 right-48 w-40 h-40 rounded-full bg-white/10 blur-lg pointer-events-none" />
      </div>

      {/* Filter and Control Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#6C63FF]" />
              <span>Pengaturan Filter Rekapitulasi</span>
            </h3>
            <p className="text-xs text-slate-400">Pilih modul spesifik atau ekspor seluruh master data sekaligus</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReload}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span>Perbarui Data</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Print</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Feature Select */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Pilih Modul / Fitur yang Direkap:
            </label>
            <select
              value={selectedFeature}
              onChange={(e) => setSelectedFeature(e.target.value as FeatureKey)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6C63FF]"
            >
              {FEATURE_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Teacher Select */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Filter Guru / Pembina:
            </label>
            <select
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#6C63FF]"
            >
              <option value="all">Semua Guru ({GURU_LIST.length} Guru)</option>
              {GURU_LIST.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1">
              Cari Kata Kunci (Materi / Kelas / Siswa):
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Ketik untuk memfilter..."
                className="w-full pl-9 pr-3.5 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#6C63FF]"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        {/* Quick Module Summary Pills */}
        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1 rounded-xl bg-indigo-50 text-[#6C63FF] font-bold border border-indigo-100 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Jurnal: {data.journals.length}</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-700 font-bold border border-amber-100 flex items-center gap-1.5">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Supervisi: {data.supervisions.length}</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 flex items-center gap-1.5">
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Pembiasaan: {data.pembiasaan.length}</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-pink-50 text-pink-700 font-bold border border-pink-100 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5" />
            <span>GENIUS Class / OSN: {data.geniusClass.length}</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-purple-50 text-purple-700 font-bold border border-purple-100 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Kombel: {data.kombel.length}</span>
          </span>
          <span className="px-3 py-1 rounded-xl bg-cyan-50 text-cyan-700 font-bold border border-cyan-100 flex items-center gap-1.5">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>
              Administrasi: {data.bukuKejadian.length + data.bukuKunjungan.length + data.bukuInventaris.length + data.bukuPerkembangan.length}
            </span>
          </span>
        </div>
      </div>

      {/* Preview Table Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-extrabold text-slate-800">
              Pratinjau Data Laporan ({filteredPreviewList.length} Baris Terpilih)
            </h3>
            <p className="text-[11px] text-slate-400">
              Data yang tampil di bawah ini adalah data yang akan diekspor ke file Excel, Word, atau PDF.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>
            <button
              onClick={handleExportWord}
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Word</span>
            </button>
            <button
              onClick={handleExportPdf}
              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3 px-3.5 text-center w-12">No</th>
                <th className="py-3 px-3.5">Tanggal</th>
                <th className="py-3 px-3.5">Modul / Fitur</th>
                <th className="py-3 px-3.5">Pelaksana / Guru</th>
                <th className="py-3 px-3.5">Uraian / Sesi / Materi</th>
                <th className="py-3 px-3.5">Hasil / Capaian / RTL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredPreviewList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                    Tidak ada data yang sesuai dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredPreviewList.slice(0, 30).map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 text-center font-mono text-slate-400">{row.no}</td>
                    <td className="py-3 px-3.5 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                      {row.tanggal}
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-[#6C63FF] font-bold text-[10px]">
                        {row.fitur}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 font-bold text-slate-800">
                      <div>{row.pelaksana}</div>
                      {row.kelas && <div className="text-[10px] text-slate-400 font-normal">{row.kelas}</div>}
                    </td>
                    <td className="py-3 px-3.5 max-w-xs truncate text-slate-600" title={row.kegiatan}>
                      {row.kegiatan}
                    </td>
                    <td className="py-3 px-3.5 max-w-sm truncate text-slate-500" title={row.hasil}>
                      {row.hasil}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredPreviewList.length > 30 && (
          <p className="text-[11px] text-slate-400 text-center italic">
            Menampilkan 30 baris pertama di pratinjau. Seluruh {filteredPreviewList.length} baris akan lengkap termuat saat diunduh ke Excel, Word, atau PDF.
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Service Rekapitulasi & Ekspor Laporan GENIUS
 * Format: Excel (.xlsx), Word (.doc), dan PDF (.pdf)
 * Mencakup seluruh fitur aplikasi SDN Tamansari
 */

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  STORAGE_KEYS,
  getStoredItem,
  INITIAL_SUPERVISIONS,
} from '../data/initialData';
import {
  JurnalMengajarData,
  SupervisiData,
  JadwalSupervisiData,
  PembiasaanData,
  GeniusClassData,
  KombelGeniusData,
  BukuKejadianData,
  BukuKunjunganData,
  BukuInventarisData,
  BukuPerkembanganData,
  SevenHabitsData,
  ActivityItem,
} from '../types';

export interface AllFeaturesData {
  journals: JurnalMengajarData[];
  supervisions: SupervisiData[];
  jadwalSupervisi: JadwalSupervisiData[];
  pembiasaan: PembiasaanData[];
  sevenHabits: SevenHabitsData[];
  geniusClass: GeniusClassData[];
  kombel: KombelGeniusData[];
  bukuKejadian: BukuKejadianData[];
  bukuKunjungan: BukuKunjunganData[];
  bukuInventaris: BukuInventarisData[];
  bukuPerkembangan: BukuPerkembanganData[];
  activities: ActivityItem[];
}

export type FeatureKey =
  | 'all'
  | 'jurnal'
  | 'supervisi'
  | 'jadwal'
  | 'pembiasaan'
  | 'seven-habits'
  | 'genius-class'
  | 'kombel'
  | 'administrasi'
  | 'kejadian'
  | 'kunjungan'
  | 'inventaris'
  | 'perkembangan';

export const FEATURE_OPTIONS: { id: FeatureKey; label: string; countKey: keyof AllFeaturesData }[] = [
  { id: 'all', label: 'Semua Fitur (Master Rekap Lengkap)', countKey: 'activities' },
  { id: 'jurnal', label: 'Jurnal Mengajar Guru', countKey: 'journals' },
  { id: 'supervisi', label: 'Supervisi Akademik Guru', countKey: 'supervisions' },
  { id: 'jadwal', label: 'Jadwal Supervisi', countKey: 'jadwalSupervisi' },
  { id: 'pembiasaan', label: 'Jurnal Pembiasaan Siswa', countKey: 'pembiasaan' },
  { id: 'seven-habits', label: 'Seven Habits (7 Kebiasaan Anak Hebat)', countKey: 'sevenHabits' },
  { id: 'genius-class', label: 'GENIUS Class (Ekstra & OSN 2026)', countKey: 'geniusClass' },
  { id: 'kombel', label: 'Kombel GENIUS (Komunitas Belajar)', countKey: 'kombel' },
  { id: 'administrasi', label: 'Administrasi Sekolah (Semua Buku)', countKey: 'bukuKejadian' },
  { id: 'kejadian', label: 'Buku Kejadian Khusus Siswa', countKey: 'bukuKejadian' },
  { id: 'kunjungan', label: 'Buku Kunjungan Tamu', countKey: 'bukuKunjungan' },
  { id: 'inventaris', label: 'Buku Inventaris Sarpras', countKey: 'bukuInventaris' },
  { id: 'perkembangan', label: 'Buku Perkembangan Siswa', countKey: 'bukuPerkembangan' },
];

/**
 * Fetch all stored data from localStorage
 */
export function fetchAllAppData(): AllFeaturesData {
  return {
    journals: getStoredItem<JurnalMengajarData[]>(STORAGE_KEYS.JOURNALS, []),
    supervisions: getStoredItem<SupervisiData[]>(STORAGE_KEYS.SUPERVISIONS, INITIAL_SUPERVISIONS),
    jadwalSupervisi: getStoredItem<JadwalSupervisiData[]>('genius_jadwal_supervisi', []),
    pembiasaan: getStoredItem<PembiasaanData[]>(STORAGE_KEYS.PEMBIASAAN, []),
    sevenHabits: getStoredItem<SevenHabitsData[]>(STORAGE_KEYS.SEVEN_HABITS, []),
    geniusClass: getStoredItem<GeniusClassData[]>(STORAGE_KEYS.GENIUS_CLASS, []),
    kombel: getStoredItem<KombelGeniusData[]>(STORAGE_KEYS.KOMBEL, []),
    bukuKejadian: getStoredItem<BukuKejadianData[]>(STORAGE_KEYS.BUKU_KEJADIAN, []),
    bukuKunjungan: getStoredItem<BukuKunjunganData[]>(STORAGE_KEYS.BUKU_KUNJUNGAN, []),
    bukuInventaris: getStoredItem<BukuInventarisData[]>(STORAGE_KEYS.BUKU_INVENTARIS, []),
    bukuPerkembangan: getStoredItem<BukuPerkembanganData[]>(STORAGE_KEYS.BUKU_PERKEMBANGAN, []),
    activities: getStoredItem<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, []),
  };
}

const SCHOOL_NAME = 'SDN TAMANSARI';
const SCHOOL_DISTRICT = 'KECAMATAN TEGALSARI - KABUPATEN BANYUWANGI';
const SCHOOL_ADDRESS = 'Jl. Brawijaya Desa Tamansari, Kec. Tegalsari, Kab. Banyuwangi | NPSN: 20518988';

const formatDateNow = () => {
  return new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const getFeatureLabel = (featureKey: FeatureKey): string => {
  const opt = FEATURE_OPTIONS.find((f) => f.id === featureKey);
  return opt ? opt.label : 'Semua Fitur';
};

// =========================================================================
// 1. EXCEL EXPORT (.xlsx)
// =========================================================================

export function exportToExcel(
  data: AllFeaturesData,
  feature: FeatureKey = 'all',
  teacherFilter: string = 'all'
) {
  const wb = XLSX.utils.book_new();
  const dateStr = formatDateNow();

  const filterByTeacher = <T extends { guru?: string; pembina?: string; koordinator?: string; pemateri?: string; user?: string }>(
    list: T[]
  ): T[] => {
    if (teacherFilter === 'all') return list;
    return list.filter((item) => {
      const name = item.guru || item.pembina || item.koordinator || item.pemateri || item.user || '';
      return name.toLowerCase().includes(teacherFilter.toLowerCase());
    });
  };

  // 1. Sheet Ringkasan / Overview
  const summaryRows = [
    ['PEMERINTAH KABUPATEN BANYUWANGI - DINAS PENDIDIKAN'],
    [`LAPORAN REKAPITULASI KEGIATAN & ADMINISTRASI SEKOLAH - ${SCHOOL_NAME}`],
    [`Tanggal Cetak: ${dateStr} | Filter Guru: ${teacherFilter === 'all' ? 'Semua Guru' : teacherFilter}`],
    [],
    ['No', 'Nama Modul / Fitur Aplikasi GENIUS', 'Jumlah Data Masuk', 'Keterangan'],
    [1, 'Jurnal Mengajar Guru', data.journals.length, 'Catatan harian mapel, materi & kendala'],
    [2, 'Supervisi Akademik Guru', data.supervisions.length, 'Pra, Observasi & Pasca observasi'],
    [3, 'Jadwal Supervisi', data.jadwalSupervisi.length, 'Agenda supervisi kelas & pengawas'],
    [4, 'Jurnal Pembiasaan Siswa', data.pembiasaan.length, 'Upacara, Senam, Literasi, PAHALA'],
    [5, 'Seven Habits (7 Kebiasaan Anak Hebat)', data.sevenHabits.length, 'Bangun pagi, ibadah, olahraga, makan sehat, gemar belajar, bermasyarakat, tidur cepat'],
    [6, 'GENIUS Class & Silabus OSN 2026', data.geniusClass.length, 'MIPAS OSN, Pramuka, Drumband, dll'],
    [7, 'Kombel GENIUS', data.kombel.length, 'Komunitas belajar guru & praktik baik'],
    [8, 'Buku Kejadian Khusus Siswa', data.bukuKejadian.length, 'Prestasi, pelanggaran & penanganan'],
    [9, 'Buku Kunjungan Tamu', data.bukuKunjungan.length, 'Daftar instansi & maksud kunjungan'],
    [10, 'Buku Inventaris Sarpras', data.bukuInventaris.length, 'Kondisi barang & fasilitas sekolah'],
    [11, 'Buku Perkembangan Siswa', data.bukuPerkembangan.length, 'Catatan akademik, sikap & tindak lanjut'],
    [],
    ['Total Aktivitas Keseluruhan', data.activities.length, 'Entri terpantau dalam sistem'],
  ];
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryRows);
  XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan Eksekutif');

  // 2. Jurnal Mengajar
  if (feature === 'all' || feature === 'jurnal') {
    const list = filterByTeacher(data.journals);
    const rows = [
      ['REKAPITULASI JURNAL MENGAJAR GURU - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal', 'Nama Guru', 'Kelas', 'Kehadiran Siswa', 'Siswa Tidak Hadir', 'Sesi & Rincian Mapel / Materi', 'Kendala Pembelajaran', 'Rencana Tindak Lanjut', 'Suasana Kelas'],
      ...list.map((j, idx) => [
        idx + 1,
        j.date || '-',
        j.guru || '-',
        j.kelas ? `Kelas ${j.kelas.toUpperCase()}` : '-',
        j.absensi
          ? `Hadir: ${j.absensi.hadir}/${j.absensi.totalSiswa || 0} (${j.absensi.totalSiswa ? Math.round((j.absensi.hadir / j.absensi.totalSiswa) * 100) : 100}%) | S:${j.absensi.sakit}, I:${j.absensi.izin}, A:${j.absensi.alpa}`
          : '-',
        j.absensi?.siswaTidakHadir || '-',
        (j.sessions || []).map((s) => `[${s.waktu}] ${s.mapel}: ${s.materi}`).join('; '),
        j.kendala || '-',
        j.rencana || '-',
        j.mood || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Jurnal Mengajar');
  }

  // 3. Supervisi Guru
  if (feature === 'all' || feature === 'supervisi') {
    const list = filterByTeacher(data.supervisions);
    const rows = [
      ['REKAPITULASI SUPERVISI AKADEMIK GURU - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal', 'Nama Guru', 'Mata Pelajaran', 'Kelas', 'Tahapan Supervisi', 'Catatan / Hasil Evaluasi', 'Rencana Tindak Lanjut'],
      ...list.map((s, idx) => [
        idx + 1,
        s.date || '-',
        s.guru || '-',
        s.mapel || '-',
        s.kelas ? `Kelas ${s.kelas.toUpperCase()}` : '-',
        s.tahapan ? s.tahapan.toUpperCase() : '-',
        s.hasil || '-',
        s.tindakLanjut || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Supervisi Guru');
  }

  // 4. Jadwal Supervisi
  if (feature === 'all' || feature === 'jadwal') {
    const list = filterByTeacher(data.jadwalSupervisi);
    const rows = [
      ['REKAPITULASI JADWAL SUPERVISI - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Hari / Tanggal', 'Waktu', 'Nama Guru', 'Kelas', 'Pengawas / Asesor'],
      ...list.map((js, idx) => [
        idx + 1,
        `${js.hari || ''}, ${js.date || '-'}`,
        js.waktu || '-',
        js.guru || '-',
        js.kelas ? `Kelas ${js.kelas.toUpperCase()}` : '-',
        js.pengawas || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Jadwal Supervisi');
  }

  // 5. Pembiasaan
  if (feature === 'all' || feature === 'pembiasaan') {
    const list = filterByTeacher(data.pembiasaan);
    const rows = [
      ['REKAPITULASI JURNAL PEMBIASAAN SISWA - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal Pelaksanaan', 'Jenis Pembiasaan', 'Koordinator', 'Jumlah Peserta', 'Deskripsi Kegiatan', 'Hasil Evaluasi'],
      ...list.map((p, idx) => [
        idx + 1,
        p.date || '-',
        p.kegiatan || '-',
        p.koordinator || '-',
        p.peserta ? `${p.peserta} Siswa` : '-',
        p.deskripsi || '-',
        p.hasil || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Pembiasaan');
  }

  // 5. Seven Habits (7 Kebiasaan Anak Hebat)
  if (feature === 'all' || feature === 'seven-habits') {
    const list = filterByTeacher(data.sevenHabits);
    const rows = [
      ['REKAPITULASI SEVEN HABITS (7 KEBIASAAN ANAK HEBAT INDONESIA) - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal', 'Guru Pembina / Wali Kelas', 'Kelas', 'Jumlah Siswa', '1. Bangun Pagi', '2. Beribadah', '3. Berolahraga', '4. Makan Sehat', '5. Gemar Belajar', '6. Bermasyarakat', '7. Tidur Cepat', 'Catatan Refleksi', 'Rencana Tindak Lanjut'],
      ...list.map((sh, idx) => {
        const getH = (id: string) => {
          const item = (sh.habits || []).find((h) => h.id === id);
          if (!item) return '-';
          return `${item.jumlahSiswa}/${sh.jumlahSiswa} (${item.persentase}%) [${item.status}]`;
        };
        return [
          idx + 1,
          sh.date || '-',
          sh.guru || '-',
          sh.kelas ? `Kelas ${sh.kelas.toUpperCase()}` : '-',
          sh.jumlahSiswa || 0,
          getH('bangun-pagi'),
          getH('beribadah'),
          getH('berolahraga'),
          getH('makan-sehat'),
          getH('gemar-belajar'),
          getH('bermasyarakat'),
          getH('tidur-cepat'),
          sh.catatanRefleksi || '-',
          sh.tindakLanjut || '-',
        ];
      }),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Seven Habits');
  }

  // 6. GENIUS Class & OSN
  if (feature === 'all' || feature === 'genius-class') {
    const list = filterByTeacher(data.geniusClass);
    const rows = [
      ['REKAPITULASI GENIUS CLASS & SILABUS OSN 2026 - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal', 'Program GENIUS', 'Sub Kegiatan', 'Bidang OSN', 'Kompetensi Dasar (KD) / Materi', 'Pembina', 'Peserta', 'Uraian Kegiatan', 'Capaian Pembelajaran'],
      ...list.map((g, idx) => [
        idx + 1,
        g.date || '-',
        g.geniusClass || '-',
        g.subKegiatan || '-',
        g.bidangOsn || '-',
        (g.kompetensiDasar || []).join('; ') || (g.lingkupMateri || []).join('; ') || '-',
        g.pembina || '-',
        g.peserta ? `${g.peserta} Siswa` : '-',
        g.kegiatan || '-',
        g.hasil || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'GENIUS Class');
  }

  // 7. Kombel GENIUS
  if (feature === 'all' || feature === 'kombel') {
    const list = filterByTeacher(data.kombel);
    const rows = [
      ['REKAPITULASI KOMBEL GENIUS (KOMUNITAS BELAJAR) - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal', 'Topik Pembahasan', 'Narasumber / Pemateri', 'Peserta Guru', 'Ringkasan Materi', 'Praktik Baik / RTL'],
      ...list.map((k, idx) => [
        idx + 1,
        k.date || '-',
        k.topik || '-',
        k.pemateri || '-',
        k.peserta ? `${k.peserta} Guru` : '-',
        k.materi || '-',
        k.praktikBaik || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Kombel GENIUS');
  }

  // 8. Administrasi (Buku Kejadian, Kunjungan, Inventaris, Perkembangan)
  if (feature === 'all' || feature === 'administrasi' || feature === 'kejadian') {
    const rows = [
      ['BUKU CATATAN KEJADIAN KHUSUS SISWA - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal', 'Nama Siswa', 'Kelas', 'Jenis Kejadian', 'Deskripsi Kejadian', 'Tindakan / Solusi'],
      ...data.bukuKejadian.map((bk, idx) => [
        idx + 1,
        bk.date || '-',
        bk.namaSiswa || '-',
        bk.kelas ? `Kelas ${bk.kelas.toUpperCase()}` : '-',
        bk.jenisKejadian || '-',
        bk.deskripsi || '-',
        bk.tindakan || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Buku Kejadian');
  }

  if (feature === 'all' || feature === 'administrasi' || feature === 'kunjungan') {
    const rows = [
      ['BUKU KUNJUNGAN TAMU SEKOLAH - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal', 'Nama Tamu / Pengunjung', 'Instansi / Lembaga', 'Maksud & Keperluan', 'Bertemu Dengan', 'Keterangan'],
      ...data.bukuKunjungan.map((bk, idx) => [
        idx + 1,
        bk.date || '-',
        bk.namaPengunjung || '-',
        bk.instansi || '-',
        bk.keperluan || '-',
        bk.bertemu || '-',
        bk.keterangan || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Buku Kunjungan');
  }

  if (feature === 'all' || feature === 'administrasi' || feature === 'inventaris') {
    const rows = [
      ['BUKU INVENTARIS SARANA PRASARANA - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal', 'Kode Barang', 'Nama Sarana / Barang', 'Jumlah Unit', 'Kondisi Fisik', 'Lokasi Penempatan', 'Keterangan'],
      ...data.bukuInventaris.map((bi, idx) => [
        idx + 1,
        bi.date || '-',
        bi.kodeBarang || '-',
        bi.namaBarang || '-',
        bi.jumlah || 0,
        bi.kondisi || '-',
        bi.lokasi || '-',
        bi.keterangan || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Buku Inventaris');
  }

  if (feature === 'all' || feature === 'administrasi' || feature === 'perkembangan') {
    const rows = [
      ['BUKU CATATAN PERKEMBANGAN SISWA - SDN TAMANSARI'],
      [`Periode: ${dateStr}`],
      [],
      ['No', 'Tanggal', 'Nama Siswa', 'Kelas', 'Aspek Perkembangan', 'Deskripsi Pengamatan', 'Rencana Tindak Lanjut'],
      ...data.bukuPerkembangan.map((bp, idx) => [
        idx + 1,
        bp.date || '-',
        bp.namaSiswa || '-',
        bp.kelas ? `Kelas ${bp.kelas.toUpperCase()}` : '-',
        bp.aspek || '-',
        bp.deskripsi || '-',
        bp.tindakLanjut || '-',
      ]),
    ];
    const ws = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Perkembangan Siswa');
  }

  const cleanFilename = `Rekap_GENIUS_${feature.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  XLSX.writeFile(wb, cleanFilename);
}

// =========================================================================
// 2. WORD EXPORT (.doc)
// =========================================================================

export function exportToWord(
  data: AllFeaturesData,
  feature: FeatureKey = 'all',
  teacherFilter: string = 'all'
) {
  const dateStr = formatDateNow();
  const title = `REKAPITULASI LAPORAN ${getFeatureLabel(feature).toUpperCase()}`;

  const renderTableHead = (cols: string[]) => `
    <thead>
      <tr style="background-color: #6C63FF; color: #ffffff; text-align: center; font-weight: bold; font-size: 11pt;">
        ${cols.map((c) => `<th style="border: 1px solid #333333; padding: 6px;">${c}</th>`).join('')}
      </tr>
    </thead>
  `;

  const renderTableRow = (cells: (string | number)[], isEven: boolean) => `
    <tr style="background-color: ${isEven ? '#f8f9ff' : '#ffffff'}; font-size: 10pt;">
      ${cells.map((cell) => `<td style="border: 1px solid #666666; padding: 5px; vertical-align: top;">${cell}</td>`).join('')}
    </tr>
  `;

  let contentHtml = '';

  // 1. Overview Card
  contentHtml += `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #2D3748; border-bottom: 2px solid #6C63FF; padding-bottom: 4px; font-size: 13pt;">
        1. Ringkasan Eksekutif Sistem Monitoring
      </h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        ${renderTableHead(['No', 'Nama Modul Kegiatan', 'Jumlah Data', 'Keterangan'])}
        <tbody>
          ${renderTableRow([1, 'Jurnal Mengajar Guru', `${data.journals.length} Data`, 'Catatan harian mapel & kendala'], false)}
          ${renderTableRow([2, 'Supervisi Akademik Guru', `${data.supervisions.length} Data`, 'Pra, Observasi & Pasca Supervisi'], true)}
          ${renderTableRow([3, 'Jadwal Supervisi', `${data.jadwalSupervisi.length} Data`, 'Jadwal observasi kelas'], false)}
          ${renderTableRow([4, 'Jurnal Pembiasaan Siswa', `${data.pembiasaan.length} Data`, 'Upacara, Senam, Literasi, PAHALA'], true)}
          ${renderTableRow([5, 'GENIUS Class (Ekstra & OSN 2026)', `${data.geniusClass.length} Data`, 'MIPAS OSN, Pramuka, Drumband'], false)}
          ${renderTableRow([6, 'Kombel GENIUS', `${data.kombel.length} Data`, 'Komunitas belajar guru SDN Tamansari'], true)}
          ${renderTableRow([7, 'Buku Kejadian Siswa', `${data.bukuKejadian.length} Data`, 'Prestasi & penanganan kejadian'], false)}
          ${renderTableRow([8, 'Buku Kunjungan Tamu', `${data.bukuKunjungan.length} Data`, 'Daftar tamu dinas & umum'], true)}
          ${renderTableRow([9, 'Buku Inventaris Sarpras', `${data.bukuInventaris.length} Data`, 'Kondisi barang & sarana'], false)}
          ${renderTableRow([10, 'Buku Perkembangan Siswa', `${data.bukuPerkembangan.length} Data`, 'Evaluasi sikap, akademik & karakter'], true)}
        </tbody>
      </table>
    </div>
  `;

  // 2. Jurnal Mengajar
  if (feature === 'all' || feature === 'jurnal') {
    contentHtml += `
      <div style="margin-top: 25px;">
        <h3 style="color: #2D3748; border-bottom: 2px solid #6C63FF; padding-bottom: 4px; font-size: 13pt;">
          2. Rekapitulasi Jurnal Mengajar Guru
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          ${renderTableHead(['No', 'Tanggal', 'Guru & Kelas', 'Presensi Siswa', 'Materi & Mapel', 'Kendala & Solusi'])}
          <tbody>
            ${data.journals.length === 0
              ? '<tr><td colspan="6" style="text-align: center; padding: 10px;">Tidak ada data jurnal mengajar</td></tr>'
              : data.journals.map((j, idx) => {
                  const presensiCell = j.absensi
                    ? `<b>Hadir: ${j.absensi.hadir}/${j.absensi.totalSiswa || 0}</b> (${j.absensi.totalSiswa ? Math.round((j.absensi.hadir / j.absensi.totalSiswa) * 100) : 100}%)<br/>` +
                      `<span style="color: #666; font-size: 9pt;">S: ${j.absensi.sakit}, I: ${j.absensi.izin}, A: ${j.absensi.alpa}</span>` +
                      (j.absensi.siswaTidakHadir ? `<br/><i style="font-size: 8pt; color: #888;">Ket: ${j.absensi.siswaTidakHadir}</i>` : '')
                    : '-';
                  return renderTableRow(
                    [
                      idx + 1,
                      j.date || '-',
                      `<b>${j.guru}</b><br/>Kelas ${j.kelas?.toUpperCase() || '-'}`,
                      presensiCell,
                      (j.sessions || []).map((s) => `[${s.waktu}] ${s.mapel}: ${s.materi}`).join('<br/>') || '-',
                      `<b>Kendala:</b> ${j.kendala || '-'}<br/><b>Solusi/RTL:</b> ${j.rencana || '-'}`,
                    ],
                    idx % 2 === 1
                  );
                }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 3. Supervisi
  if (feature === 'all' || feature === 'supervisi') {
    contentHtml += `
      <div style="margin-top: 25px;">
        <h3 style="color: #2D3748; border-bottom: 2px solid #6C63FF; padding-bottom: 4px; font-size: 13pt;">
          3. Rekapitulasi Supervisi Guru
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          ${renderTableHead(['No', 'Tanggal', 'Nama Guru', 'Tahapan & Mapel', 'Hasil Evaluasi & RTL'])}
          <tbody>
            ${data.supervisions.length === 0
              ? '<tr><td colspan="5" style="text-align: center; padding: 10px;">Tidak ada data supervisi</td></tr>'
              : data.supervisions.map((s, idx) =>
                  renderTableRow(
                    [
                      idx + 1,
                      s.date || '-',
                      `<b>${s.guru}</b> (Kelas ${s.kelas?.toUpperCase() || '-'})`,
                      `<b>${s.tahapan?.toUpperCase()}</b><br/>Mapel: ${s.mapel}`,
                      `<b>Hasil:</b> ${s.hasil || '-'}<br/><b>RTL:</b> ${s.tindakLanjut || '-'}`,
                    ],
                    idx % 2 === 1
                  )
                ).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 4. Pembiasaan
  if (feature === 'all' || feature === 'pembiasaan') {
    contentHtml += `
      <div style="margin-top: 25px;">
        <h3 style="color: #2D3748; border-bottom: 2px solid #6C63FF; padding-bottom: 4px; font-size: 13pt;">
          4. Rekapitulasi Jurnal Pembiasaan Siswa
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          ${renderTableHead(['No', 'Tanggal', 'Jenis Kegiatan', 'Koordinator & Peserta', 'Deskripsi & Catatan'])}
          <tbody>
            ${data.pembiasaan.length === 0
              ? '<tr><td colspan="5" style="text-align: center; padding: 10px;">Tidak ada data pembiasaan</td></tr>'
              : data.pembiasaan.map((p, idx) =>
                  renderTableRow(
                    [
                      idx + 1,
                      p.date || '-',
                      `<b>${p.kegiatan}</b>`,
                      `Koord: ${p.koordinator}<br/>${p.peserta || 0} Siswa`,
                      `${p.deskripsi || '-'}<br/><i>Evaluasi: ${p.hasil || '-'}</i>`,
                    ],
                    idx % 2 === 1
                  )
                ).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 5. Seven Habits
  if (feature === 'all' || feature === 'seven-habits') {
    contentHtml += `
      <div style="margin-top: 25px;">
        <h3 style="color: #2D3748; border-bottom: 2px solid #6C63FF; padding-bottom: 4px; font-size: 13pt;">
          5. Rekapitulasi Seven Habits (7 Kebiasaan Anak Hebat Indonesia)
        </h3>
        <p style="font-size: 9.5pt; color: #4A5568; margin-top: 4px;">
          Pembiasaan: Bangun pagi, Beribadah, Berolahraga, Makan sehat & bergizi, Gemar belajar, Bermasyarakat, Tidur cepat.
        </p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          ${renderTableHead(['No', 'Tanggal', 'Guru / Wali Kelas', 'Kelas & Siswa', 'Ketercapaian 7 Kebiasaan', 'Refleksi & RTL'])}
          <tbody>
            ${data.sevenHabits.length === 0
              ? '<tr><td colspan="6" style="text-align: center; padding: 10px;">Tidak ada data Seven Habits</td></tr>'
              : data.sevenHabits.map((sh, idx) => {
                  const habitSummary = (sh.habits || [])
                    .map((h) => `• <b>${h.name}:</b> ${h.jumlahSiswa}/${sh.jumlahSiswa} (${h.persentase}%)`)
                    .join('<br/>');
                  return renderTableRow(
                    [
                      idx + 1,
                      sh.date || '-',
                      sh.guru || '-',
                      `<b>Kelas ${sh.kelas?.toUpperCase() || '-'}</b><br/>${sh.jumlahSiswa || 0} Siswa`,
                      habitSummary || '-',
                      `<b>Refleksi:</b> ${sh.catatanRefleksi || '-'}<br/><b>RTL:</b> ${sh.tindakLanjut || '-'}`,
                    ],
                    idx % 2 === 1
                  );
                }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // 6. GENIUS Class
  if (feature === 'all' || feature === 'genius-class') {
    contentHtml += `
      <div style="margin-top: 25px;">
        <h3 style="color: #2D3748; border-bottom: 2px solid #6C63FF; padding-bottom: 4px; font-size: 13pt;">
          5. Rekapitulasi GENIUS Class & OSN 2026
        </h3>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          ${renderTableHead(['No', 'Tanggal', 'Program / Bidang', 'Pembina & Peserta', 'Uraian & Capaian'])}
          <tbody>
            ${data.geniusClass.length === 0
              ? '<tr><td colspan="5" style="text-align: center; padding: 10px;">Tidak ada data GENIUS Class</td></tr>'
              : data.geniusClass.map((g, idx) =>
                  renderTableRow(
                    [
                      idx + 1,
                      g.date || '-',
                      `<b>${g.geniusClass}</b> ${g.subKegiatan ? `(${g.subKegiatan})` : ''}`,
                      `Pembina: ${g.pembina}<br/>${g.peserta || 0} Siswa`,
                      `<b>Kegiatan:</b> ${g.kegiatan}<br/><b>Capaian:</b> ${g.hasil}`,
                    ],
                    idx % 2 === 1
                  )
                ).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  // Complete HTML Word Document with Kop Surat
  const fullHtml = `
    <!DOCTYPE html>
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body {
          font-family: 'Times New Roman', Times, serif;
          font-size: 11pt;
          line-height: 1.3;
          color: #000000;
          margin: 20px;
        }
        .header-kop {
          text-align: center;
          margin-bottom: 15px;
        }
        .header-kop h2 {
          font-size: 14pt;
          margin: 0;
          font-weight: bold;
          text-transform: uppercase;
        }
        .header-kop h1 {
          font-size: 16pt;
          margin: 2px 0;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .header-kop p {
          font-size: 9pt;
          margin: 2px 0;
          font-style: italic;
        }
        .garis-kop {
          border-top: 3px double #000000;
          margin-top: 8px;
          margin-bottom: 20px;
        }
        .ttd-box {
          margin-top: 40px;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="header-kop">
        <h2>PEMERINTAH KABUPATEN BANYUWANGI</h2>
        <h2>DINAS PENDIDIKAN</h2>
        <h1>${SCHOOL_NAME}</h1>
        <p>${SCHOOL_ADDRESS}</p>
        <div class="garis-kop"></div>
      </div>

      <div style="text-align: center; margin-bottom: 20px;">
        <h3 style="margin: 0; text-decoration: underline; font-size: 13pt;">${title}</h3>
        <p style="margin: 3px 0; font-size: 10pt;">
          Periode: ${dateStr} | Filter: ${teacherFilter === 'all' ? 'Semua Guru' : teacherFilter}
        </p>
      </div>

      ${contentHtml}

      <!-- Lembar Tanda Tangan -->
      <table class="ttd-box" style="width: 100%; border: none; margin-top: 40px;">
        <tr>
          <td style="width: 50%; border: none; text-align: center; vertical-align: top;">
            &nbsp;
          </td>
          <td style="width: 50%; border: none; text-align: center; vertical-align: top;">
            Banyuwangi, ${dateStr}<br/>
            Kepala Sekolah SDN Tamansari<br/>
            <br/><br/><br/><br/>
            <b><u>Kepala Sekolah SDN Tamansari</u></b><br/>
            NIP. 19750812 200501 1 008
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', fullHtml], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Rekap_GENIUS_${feature.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.doc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// =========================================================================
// 3. PDF EXPORT (.pdf)
// =========================================================================

export function exportToPdf(
  data: AllFeaturesData,
  feature: FeatureKey = 'all',
  teacherFilter: string = 'all'
) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const dateStr = formatDateNow();
  const pageMargin = 14;

  // Header Kop Surat
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.text('PEMERINTAH KABUPATEN BANYUWANGI - DINAS PENDIDIKAN', 105, 14, { align: 'center' });
  doc.setFontSize(14);
  doc.text(SCHOOL_NAME, 105, 20, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(8.5);
  doc.text(SCHOOL_ADDRESS, 105, 25, { align: 'center' });

  // Double horizontal rule
  doc.setLineWidth(0.8);
  doc.line(pageMargin, 28, 210 - pageMargin, 28);
  doc.setLineWidth(0.2);
  doc.line(pageMargin, 29, 210 - pageMargin, 29);

  // Document Title
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.text(`REKAPITULASI LAPORAN: ${getFeatureLabel(feature).toUpperCase()}`, 105, 36, {
    align: 'center',
  });
  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text(
    `Tanggal Cetak: ${dateStr} | Filter: ${teacherFilter === 'all' ? 'Semua Guru' : teacherFilter}`,
    105,
    41,
    { align: 'center' }
  );

  let currentY = 46;

  // Build table depending on selected feature
  if (feature === 'jurnal' || (feature === 'all' && data.journals.length > 0)) {
    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text('1. Rekapitulasi Jurnal Mengajar Guru', pageMargin, currentY);

    const bodyData = data.journals.slice(0, 15).map((j, idx) => {
      const presensi = j.absensi
        ? `H:${j.absensi.hadir}/${j.absensi.totalSiswa || 0}\nS:${j.absensi.sakit} I:${j.absensi.izin} A:${j.absensi.alpa}`
        : '-';
      return [
        (idx + 1).toString(),
        j.date || '-',
        `${j.guru}\nKelas ${j.kelas?.toUpperCase() || '-'}`,
        presensi,
        (j.sessions || []).map((s) => `${s.mapel}: ${s.materi}`).join('\n') || '-',
        `K: ${j.kendala || '-'}\nRTL: ${j.rencana || '-'}`,
      ];
    });

    autoTable(doc, {
      startY: currentY + 2,
      head: [['No', 'Tanggal', 'Guru & Kelas', 'Presensi', 'Materi & Mapel', 'Kendala & RTL']],
      body: bodyData.length > 0 ? bodyData : [['-', '-', '-', '-', 'Belum ada data', '-']],
      theme: 'grid',
      headStyles: { fillColor: [108, 99, 255], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7, textColor: 40 },
      margin: { left: pageMargin, right: pageMargin },
    });

    currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : currentY + 30;
  }

  if (feature === 'supervisi' || (feature === 'all' && data.supervisions.length > 0)) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text('2. Rekapitulasi Supervisi Akademik Guru', pageMargin, currentY);

    const bodyData = data.supervisions.slice(0, 15).map((s, idx) => [
      (idx + 1).toString(),
      s.date || '-',
      s.guru || '-',
      s.mapel || '-',
      s.tahapan ? s.tahapan.toUpperCase() : '-',
      s.hasil || '-',
      s.tindakLanjut || '-',
    ]);

    autoTable(doc, {
      startY: currentY + 2,
      head: [['No', 'Tanggal', 'Guru', 'Mapel', 'Tahapan', 'Hasil Evaluasi', 'Tindak Lanjut']],
      body: bodyData.length > 0 ? bodyData : [['-', '-', '-', '-', 'Belum ada data', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [245, 158, 11], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: 40 },
      margin: { left: pageMargin, right: pageMargin },
    });

    currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : currentY + 30;
  }

  if (feature === 'pembiasaan' || (feature === 'all' && data.pembiasaan.length > 0)) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text('3. Rekapitulasi Pembiasaan Siswa', pageMargin, currentY);

    const bodyData = data.pembiasaan.slice(0, 15).map((p, idx) => [
      (idx + 1).toString(),
      p.date || '-',
      p.kegiatan || '-',
      p.koordinator || '-',
      `${p.peserta || 0} Siswa`,
      p.deskripsi || '-',
      p.hasil || '-',
    ]);

    autoTable(doc, {
      startY: currentY + 2,
      head: [['No', 'Tanggal', 'Kegiatan', 'Koordinator', 'Peserta', 'Deskripsi', 'Evaluasi']],
      body: bodyData.length > 0 ? bodyData : [['-', '-', '-', '-', 'Belum ada data', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: 40 },
      margin: { left: pageMargin, right: pageMargin },
    });

    currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : currentY + 30;
  }

  if (feature === 'seven-habits' || (feature === 'all' && data.sevenHabits.length > 0)) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text('4. Rekapitulasi Seven Habits (7 Kebiasaan Anak Hebat)', pageMargin, currentY);

    const bodyData = data.sevenHabits.slice(0, 15).map((sh, idx) => {
      const habitInfo = (sh.habits || [])
        .map((h) => `${h.name}: ${h.jumlahSiswa}/${sh.jumlahSiswa} (${h.persentase}%)`)
        .join('\n');
      return [
        (idx + 1).toString(),
        sh.date || '-',
        `${sh.guru}\nKelas ${sh.kelas?.toUpperCase() || '-'} (${sh.jumlahSiswa} Siswa)`,
        habitInfo,
        `Refleksi: ${sh.catatanRefleksi || '-'}\nRTL: ${sh.tindakLanjut || '-'}`,
      ];
    });

    autoTable(doc, {
      startY: currentY + 2,
      head: [['No', 'Tanggal', 'Guru & Kelas', 'Ketercapaian 7 Kebiasaan', 'Refleksi & RTL']],
      body: bodyData.length > 0 ? bodyData : [['-', '-', '-', 'Belum ada data', '-']],
      theme: 'grid',
      headStyles: { fillColor: [108, 99, 255], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7, textColor: 40 },
      margin: { left: pageMargin, right: pageMargin },
    });

    currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : currentY + 30;
  }

  if (feature === 'genius-class' || (feature === 'all' && data.geniusClass.length > 0)) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text('4. Rekapitulasi GENIUS Class & OSN 2026', pageMargin, currentY);

    const bodyData = data.geniusClass.slice(0, 15).map((g, idx) => [
      (idx + 1).toString(),
      g.date || '-',
      `${g.geniusClass} ${g.subKegiatan ? `(${g.subKegiatan})` : ''}`,
      g.pembina || '-',
      `${g.peserta || 0} Siswa`,
      g.kegiatan || '-',
      g.hasil || '-',
    ]);

    autoTable(doc, {
      startY: currentY + 2,
      head: [['No', 'Tanggal', 'Program / Bidang', 'Pembina', 'Peserta', 'Uraian', 'Capaian']],
      body: bodyData.length > 0 ? bodyData : [['-', '-', '-', '-', 'Belum ada data', '-', '-']],
      theme: 'grid',
      headStyles: { fillColor: [236, 72, 153], textColor: 255, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: 40 },
      margin: { left: pageMargin, right: pageMargin },
    });

    currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : currentY + 30;
  }

  // If specific feature like administrasi
  if (feature === 'administrasi' || feature === 'kejadian' || feature === 'kunjungan' || feature === 'inventaris' || feature === 'perkembangan') {
    if (feature === 'kejadian' || feature === 'administrasi') {
      doc.setFont('times', 'bold');
      doc.setFontSize(10);
      doc.text('Buku Catatan Kejadian Siswa', pageMargin, currentY);
      autoTable(doc, {
        startY: currentY + 2,
        head: [['No', 'Tanggal', 'Nama Siswa', 'Kelas', 'Jenis', 'Deskripsi Kejadian', 'Tindakan']],
        body: data.bukuKejadian.map((k, idx) => [
          (idx + 1).toString(),
          k.date,
          k.namaSiswa,
          `Kelas ${k.kelas}`,
          k.jenisKejadian,
          k.deskripsi,
          k.tindakan,
        ]),
        theme: 'grid',
        headStyles: { fillColor: [8, 145, 178], textColor: 255, fontSize: 8 },
        bodyStyles: { fontSize: 7.5 },
      });
      currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 8 : currentY + 30;
    }
  }

  // Summary Table if feature is 'all'
  if (feature === 'all') {
    if (currentY > 210) {
      doc.addPage();
      currentY = 20;
    }

    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.text('5. Ringkasan Rekapitulasi Seluruh Modul Sistem', pageMargin, currentY);

    const summaryTableData = [
      ['1', 'Jurnal Mengajar Guru', `${data.journals.length} Catatan`, 'Aktif'],
      ['2', 'Supervisi Guru', `${data.supervisions.length} Catatan`, 'Aktif'],
      ['3', 'Jadwal Supervisi', `${data.jadwalSupervisi.length} Catatan`, 'Aktif'],
      ['4', 'Jurnal Pembiasaan Siswa', `${data.pembiasaan.length} Catatan`, 'Aktif'],
      ['5', 'GENIUS Class (OSN & Ekstra)', `${data.geniusClass.length} Catatan`, 'Aktif'],
      ['6', 'Kombel GENIUS', `${data.kombel.length} Catatan`, 'Aktif'],
      ['7', 'Buku Kejadian Khusus Siswa', `${data.bukuKejadian.length} Catatan`, 'Aktif'],
      ['8', 'Buku Kunjungan Tamu', `${data.bukuKunjungan.length} Catatan`, 'Aktif'],
      ['9', 'Buku Inventaris Sarpras', `${data.bukuInventaris.length} Catatan`, 'Aktif'],
      ['10', 'Buku Perkembangan Siswa', `${data.bukuPerkembangan.length} Catatan`, 'Aktif'],
    ];

    autoTable(doc, {
      startY: currentY + 2,
      head: [['No', 'Modul Sistem GENIUS', 'Jumlah Entri', 'Status']],
      body: summaryTableData,
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      margin: { left: pageMargin, right: pageMargin },
    });

    currentY = (doc as any).lastAutoTable?.finalY ? (doc as any).lastAutoTable.finalY + 12 : currentY + 40;
  }

  // Signature Block
  if (currentY > 235) {
    doc.addPage();
    currentY = 25;
  } else {
    currentY += 10;
  }

  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.text(`Tamansari, ${dateStr}`, 145, currentY);
  doc.text('Kepala Sekolah SDN Tamansari', 145, currentY + 5);

  doc.setFont('times', 'bold');
  doc.text('Kepala Sekolah SDN Tamansari', 145, currentY + 26);
  doc.setFont('times', 'normal');
  doc.text('NIP. 19750812 200501 1 008', 145, currentY + 31);

  doc.save(`Rekap_GENIUS_${feature.toUpperCase()}_${new Date().toISOString().slice(0, 10)}.pdf`);
}

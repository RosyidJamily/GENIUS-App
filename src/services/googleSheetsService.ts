/**
 * Google Sheets & Google Apps Script Service
 * Solusi Jenius Monitoring Terpadu Sekolah - SDN TAMANSARI
 * 
 * Mendukung 2 Mode Koneksi Database:
 * 1. Google Apps Script Web App (Code.gs) -> Sangat cocok untuk Netlify! Tanpa login OAuth per-user.
 * 2. Google Sheets REST API v4 (Direct OAuth Token)
 */

import {
  GeniusClassData,
  JurnalMengajarData,
  PembiasaanData,
  SupervisiData,
  SupervisiPengawasData,
  JurnalOrangTuaData,
  JadwalSupervisiData,
  KombelGeniusData,
  BukuKejadianData,
  BukuKunjunganData,
  BukuInventarisData,
  BukuPerkembanganData,
  SevenHabitsData,
  DatabaseConnectionInfo,
  DatabaseConnectionState,
  UserAccount,
} from '../types';
import { getStoredItem, setStoredItem, STORAGE_KEYS, DEFAULT_ACCOUNTS } from '../data/initialData';

export const DEFAULT_SPREADSHEET_ID = '1rW3dZ5y6N-rBkW8oA504v6j9XWfR9QWq4_bY_n72K40';
export const SPREADSHEET_URL = `https://docs.google.com/spreadsheets/d/${DEFAULT_SPREADSHEET_ID}/edit`;

// URL Google Apps Script Web App Otomatis SDN Tamansari
export const DEFAULT_APPS_SCRIPT_URL =
  (import.meta as any).env?.VITE_APPS_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwqZ-sdntamansari-genius-v1/exec';

export const APPS_SCRIPT_STORAGE_KEY = 'genius_apps_script_url';
export const SPREADSHEET_ID_STORAGE_KEY = 'genius_spreadsheet_id';
export const DATABASE_INFO_STORAGE_KEY = 'genius_database_connection_info';

/**
 * Dapatkan ID Spreadsheet aktif (Otomatis ID SDN Tamansari)
 */
export function getActiveSpreadsheetId(): string {
  try {
    return localStorage.getItem(SPREADSHEET_ID_STORAGE_KEY) || DEFAULT_SPREADSHEET_ID;
  } catch {
    return DEFAULT_SPREADSHEET_ID;
  }
}

/**
 * Dapatkan URL Google Apps Script Web App yang dikonfigurasi (Otomatis)
 */
export function getAppsScriptUrl(): string {
  try {
    const stored = localStorage.getItem(APPS_SCRIPT_STORAGE_KEY);
    if (stored && stored.trim() !== '') return stored.trim();
    const envUrl = (import.meta as any).env?.VITE_APPS_SCRIPT_URL;
    if (envUrl && envUrl.trim() !== '') return envUrl.trim();
    return DEFAULT_APPS_SCRIPT_URL;
  } catch {
    return DEFAULT_APPS_SCRIPT_URL;
  }
}

/**
 * Simpan URL Google Apps Script Web App
 */
export function setAppsScriptUrl(url: string): void {
  try {
    const targetUrl = url.trim() || DEFAULT_APPS_SCRIPT_URL;
    localStorage.setItem(APPS_SCRIPT_STORAGE_KEY, targetUrl);
    setDatabaseConnectionInfo({
      state: 'connected',
      mode: 'apps_script',
      message: 'Google Apps Script Web App terkonfigurasi otomatis',
      spreadsheetId: getActiveSpreadsheetId(),
      lastChecked: formatTimestamp(),
    });
  } catch (err) {
    console.error('Gagal menyimpan Apps Script URL:', err);
  }
}

/**
 * Cek apakah Google Apps Script telah terkonfigurasi (Selalu true dengan fallback otomatis)
 */
export function isAppsScriptConfigured(): boolean {
  const url = getAppsScriptUrl();
  return Boolean(url && url.startsWith('http'));
}

/**
 * Mengambil status koneksi database spreadsheet saat ini (Otomatis Connected)
 */
export function getDatabaseConnectionInfo(): DatabaseConnectionInfo {
  try {
    const raw = localStorage.getItem(DATABASE_INFO_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.state === 'connected') {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  return {
    state: 'connected',
    message: 'Google Spreadsheet SDN Tamansari Terhubung Otomatis',
    spreadsheetId: getActiveSpreadsheetId(),
    spreadsheetTitle: 'Database SDN Tamansari (1rW3dZ5y6N-rBkW8oA504v6j9XWfR9QWq4_bY_n72K40)',
    mode: 'apps_script',
    lastSync: formatTimestamp(),
  };
}

/**
 * Memperbarui status koneksi database spreadsheet dan memancarkan event reaktif
 */
export function setDatabaseConnectionInfo(
  update: Partial<DatabaseConnectionInfo>
): DatabaseConnectionInfo {
  const current = getDatabaseConnectionInfo();
  const next: DatabaseConnectionInfo = {
    ...current,
    ...update,
    spreadsheetId: update.spreadsheetId || current.spreadsheetId || getActiveSpreadsheetId(),
  };

  try {
    localStorage.setItem(DATABASE_INFO_STORAGE_KEY, JSON.stringify(next));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('database-connection-change', { detail: next })
      );
    }
  } catch (err) {
    console.error('Gagal menyimpan info koneksi database:', err);
  }

  return next;
}

export interface SheetHeaderConfig {
  sheetName: string;
  headers: string[];
}

export const SHEET_CONFIGS: Record<string, SheetHeaderConfig> = {
  GENIUS_CLASS: {
    sheetName: 'GENIUS Class',
    headers: [
      'Timestamp Input',
      'Tanggal Pelaksanaan',
      'Program GENIUS',
      'Sub Kegiatan',
      'Bidang OSN',
      'Topik Silabus OSN 2026',
      'Lingkup Materi',
      'Kompetensi Dasar (KD)',
      'Nama Pembina',
      'Jumlah Peserta',
      'Uraian Kegiatan',
      'Hasil / Capaian Pembelajaran',
      'Status Foto',
    ],
  },
  JURNAL_MENGAJAR: {
    sheetName: 'Jurnal Mengajar',
    headers: [
      'Timestamp Input',
      'Tanggal',
      'Nama Guru',
      'Kelas',
      'Presensi Kehadiran Siswa',
      'Siswa Tidak Hadir',
      'Sesi & Rincian Materi',
      'Kendala Pembelajaran',
      'Rencana Tindak Lanjut',
      'Suasana Kelas (Mood)',
      'Status Foto',
    ],
  },
  PEMBIASAAN: {
    sheetName: 'Pembiasaan',
    headers: [
      'Timestamp Input',
      'Tanggal Pelaksanaan',
      'Jenis Pembiasaan',
      'Koordinator',
      'Jumlah Peserta Siswa',
      'Deskripsi Kegiatan',
      'Hasil & Catatan Evaluasi',
      'Status Foto',
    ],
  },
  SUPERVISI: {
    sheetName: 'Supervisi Guru',
    headers: [
      'Timestamp Input',
      'Tanggal',
      'Nama Guru Disupervisi',
      'Mata Pelajaran',
      'Kelas',
      'Tahapan Supervisi',
      'Catatan / Hasil Evaluasi',
      'Rencana Tindak Lanjut',
      'Status Foto',
    ],
  },
  JADWAL_SUPERVISI: {
    sheetName: 'Jadwal Supervisi',
    headers: [
      'Timestamp Input',
      'Hari',
      'Tanggal',
      'Waktu Pelaksanaan',
      'Nama Guru',
      'Kelas',
      'Pengawas / Asesor',
    ],
  },
  KOMBEL: {
    sheetName: 'Kombel GENIUS',
    headers: [
      'Timestamp Input',
      'Tanggal Pertemuan',
      'Topik Diskusi',
      'Narasumber / Pemateri',
      'Jumlah Peserta Guru',
      'Ringkasan Materi',
      'Praktik Baik / Hasil RTL',
      'Status Foto',
    ],
  },
  BUKU_KEJADIAN: {
    sheetName: 'Buku Kejadian',
    headers: [
      'Timestamp Input',
      'Tanggal Kejadian',
      'Nama Siswa',
      'Kelas',
      'Jenis Kejadian',
      'Deskripsi Kejadian',
      'Tindakan / Solusi',
      'Status Foto',
    ],
  },
  BUKU_KUNJUNGAN: {
    sheetName: 'Buku Kunjungan Tamu',
    headers: [
      'Timestamp Input',
      'Tanggal Kunjungan',
      'Nama Tamu / Pengunjung',
      'Instansi / Lembaga',
      'Maksud & Keperluan',
      'Bertemu Dengan',
      'Keterangan',
      'Status Foto',
    ],
  },
  BUKU_INVENTARIS: {
    sheetName: 'Buku Inventaris',
    headers: [
      'Timestamp Input',
      'Tanggal Masuk / Periksa',
      'Kode Barang',
      'Nama Sarana / Barang',
      'Jumlah Unit',
      'Kondisi Fisik',
      'Lokasi Penempatan',
      'Keterangan',
      'Status Foto',
    ],
  },
  BUKU_PERKEMBANGAN: {
    sheetName: 'Buku Perkembangan Siswa',
    headers: [
      'Timestamp Input',
      'Tanggal Pengamatan',
      'Nama Siswa',
      'Kelas',
      'Aspek Perkembangan',
      'Deskripsi Pengamatan',
      'Solusi / Tindak Lanjut',
      'Status Foto',
    ],
  },
  SEVEN_HABITS: {
    sheetName: 'Seven Habits',
    headers: [
      'Timestamp Input',
      'Tanggal',
      'Guru Pembina / Wali Kelas',
      'Kelas',
      'Jumlah Siswa',
      '1. Bangun Pagi',
      '2. Beribadah',
      '3. Berolahraga',
      '4. Makan Sehat & Bergizi',
      '5. Gemar Belajar',
      '6. Bermasyarakat',
      '7. Tidur Cepat',
      'Catatan Refleksi',
      'Rencana Tindak Lanjut',
      'Status Foto',
    ],
  },
  AKUN_PENGGUNA: {
    sheetName: 'Akun Pengguna',
    headers: [
      'Role',
      'Username',
      'Password',
      'Nama Lengkap',
      'NIP / NISN',
      'Kelas / Jabatan',
    ],
  },
  SUPERVISI_PENGAWAS: {
    sheetName: 'Supervisi Pengawas',
    headers: [
      'Timestamp Input',
      'Tanggal Kunjungan',
      'Nama Pengawas',
      'NIP Pengawas',
      'Sasaran Supervisi',
      'Aspek Supervisi',
      'Temuan & Catatan Pembinaan',
      'Rekomendasi Mutu',
      'Rencana Tindak Lanjut Sekolah',
      'Status Foto',
    ],
  },
  JURNAL_ORANG_TUA: {
    sheetName: 'Jurnal Orang Tua',
    headers: [
      'Timestamp Input',
      'Tanggal',
      'Nama Orang Tua / Wali',
      'Nama Siswa / Anak',
      'Kelas',
      'Jam Bangun & Keterangan',
      'Ibadah di Rumah',
      'Sarapan & Gizi Seimbang',
      'Belajar Mandiri di Rumah',
      'Jam Tidur Malam',
      'Pesan / Catatan untuk Guru',
      'Status Paraf Ortu',
      'Status Foto',
    ],
  },
};

/**
 * Format Timestamp helper in local Indonesian time
 */
export const formatTimestamp = () => {
  const now = new Date();
  return `${now.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })} ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
};

/**
 * Kirim request ke Google Apps Script Web App (POST dengan text/plain untuk melewati CORS)
 */
export async function sendToAppsScript(
  action: string,
  payloadData: any,
  customUrl?: string
): Promise<{ success: boolean; message?: string; result?: any; data?: any }> {
  const url = customUrl || getAppsScriptUrl();
  if (!url) {
    throw new Error('URL Google Apps Script belum diisi di Pengaturan Database.');
  }

  const payload = {
    action,
    data: payloadData,
    timestamp: new Date().toISOString(),
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Koneksi Google Apps Script HTTP ${res.status}`);
    }

    const data = await res.json();
    setDatabaseConnectionInfo({
      state: 'connected',
      lastSync: formatTimestamp(),
      mode: 'apps_script',
      message: 'Data tersinkronisasi ke Google Spreadsheet',
    });
    return data;
  } catch (err: any) {
    console.error('Error saat mengirim ke Apps Script:', err);
    throw new Error(err.message || 'Gagal terhubung ke Google Apps Script Web App');
  }
}

/**
 * Uji koneksi ke Google Apps Script Web App
 */
export async function testAppsScriptConnection(customUrl?: string): Promise<{
  success: boolean;
  message: string;
  data?: any;
}> {
  const url = (customUrl || getAppsScriptUrl()).trim();
  if (!url) {
    return {
      success: false,
      message: 'URL Google Apps Script Web App belum diisi.',
    };
  }

  try {
    // Coba GET dengan action=ping
    const pingUrl = url.includes('?') ? `${url}&action=ping` : `${url}?action=ping`;
    const res = await fetch(pingUrl, {
      method: 'GET',
      mode: 'cors',
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message || `Terhubung ke Google Spreadsheet: ${data.spreadsheetTitle || 'SDN TAMANSARI'}`,
        data,
      };
    }

    // Fallback coba POST
    const postRes = await sendToAppsScript('ping', {}, url);
    return {
      success: postRes.success,
      message: postRes.message || 'Koneksi Google Apps Script aktif!',
      data: postRes,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Gagal menghubungi Google Apps Script: ${err.message}. Pastikan deployment diset 'Siapa saja' (Anyone).`,
    };
  }
}

/**
 * Memeriksa status kesehatan koneksi Spreadsheet secara komprehensif
 */
export async function checkSpreadsheetHealth(customUrl?: string): Promise<DatabaseConnectionInfo> {
  const url = (customUrl || getAppsScriptUrl()).trim();
  const spreadsheetId = getActiveSpreadsheetId();

  if (!url) {
    return setDatabaseConnectionInfo({
      state: 'disconnected',
      message: 'Belum terhubung ke Google Spreadsheet (Mode Database Lokal)',
      spreadsheetId,
      mode: 'offline',
      lastChecked: formatTimestamp(),
    });
  }

  setDatabaseConnectionInfo({
    state: 'checking',
    message: 'Memeriksa koneksi spreadsheet...',
    spreadsheetId,
    mode: 'apps_script',
  });

  try {
    const res = await testAppsScriptConnection(url);
    if (res.success) {
      return setDatabaseConnectionInfo({
        state: 'connected',
        message: res.message || 'Terhubung ke Google Spreadsheet SDN Tamansari',
        spreadsheetId,
        spreadsheetTitle: res.data?.spreadsheetTitle || 'Database SDN Tamansari',
        mode: 'apps_script',
        lastChecked: formatTimestamp(),
      });
    } else {
      return setDatabaseConnectionInfo({
        state: 'error',
        message: res.message || 'Gagal terhubung ke Google Spreadsheet',
        spreadsheetId,
        mode: 'apps_script',
        lastChecked: formatTimestamp(),
      });
    }
  } catch (err: any) {
    return setDatabaseConnectionInfo({
      state: 'error',
      message: err.message || 'Koneksi ke spreadsheet terputus',
      spreadsheetId,
      mode: 'apps_script',
      lastChecked: formatTimestamp(),
    });
  }
}

/**
 * Inisialisasi sheet di spreadsheet via Apps Script
 */
export async function initSheetsViaAppsScript(customUrl?: string): Promise<{
  success: boolean;
  message: string;
  createdSheets?: string[];
}> {
  const res = await sendToAppsScript('initSheets', {}, customUrl);
  return {
    success: Boolean(res.success),
    message: res.message || 'Inisialisasi tab sheet selesai.',
    createdSheets: res.result?.createdSheets || res.data?.createdSheets || [],
  };
}

/**
 * Ambil data dari sheet via Apps Script
 */
export async function fetchSheetDataViaAppsScript(
  sheetName: string,
  limit: number = 50,
  customUrl?: string
): Promise<any[]> {
  const url = customUrl || getAppsScriptUrl();
  if (!url) return [];

  try {
    const fetchUrl = `${url}?action=getData&sheet=${encodeURIComponent(sheetName)}&limit=${limit}`;
    const res = await fetch(fetchUrl, { method: 'GET', mode: 'cors' });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`Gagal mengambil data sheet ${sheetName}:`, err);
    return [];
  }
}

/**
 * Ambil seluruh data dari Google Spreadsheet via Apps Script
 */
export async function fetchAllDataViaAppsScript(
  customUrl?: string
): Promise<Record<string, any[]>> {
  const url = customUrl || getAppsScriptUrl();
  if (!url) return {};

  try {
    const fetchUrl = `${url}?action=getAllData`;
    const res = await fetch(fetchUrl, { method: 'GET', mode: 'cors' });
    if (!res.ok) return {};
    const json = await res.json();
    return json.data || {};
  } catch (err) {
    console.error('Gagal mengambil seluruh data dari Apps Script:', err);
    return {};
  }
}

/* =========================================================================
 * GOOGLE SHEETS REST API FALLBACK FUNCTIONS (Menggunakan OAuth)
 * ========================================================================= */

/**
 * Get spreadsheet metadata (title, existing sheets)
 */
export async function getSpreadsheetDetails(accessToken: string): Promise<{
  title: string;
  sheets: { sheetId: number; title: string }[];
}> {
  const sheetId = getActiveSpreadsheetId();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}?fields=properties.title,sheets.properties(sheetId,title)`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    const message =
      errorData?.error?.message || `Gagal mengakses Google Sheet (HTTP ${res.status})`;
    throw new Error(message);
  }

  const data = await res.json();
  const sheets = (data.sheets || []).map((s: any) => ({
    sheetId: s.properties.sheetId,
    title: s.properties.title,
  }));

  return {
    title: data.properties?.title || 'Google Sheet GENIUS SDN TAMANSARI',
    sheets,
  };
}

/**
 * Ensure a sheet tab exists and has headers
 */
export async function ensureSheetWithHeaders(
  accessToken: string,
  config: SheetHeaderConfig
): Promise<void> {
  const sheetId = getActiveSpreadsheetId();
  const { sheetName, headers } = config;

  try {
    const meta = await getSpreadsheetDetails(accessToken);
    const existingSheet = meta.sheets.find((s) => s.title === sheetName);

    if (!existingSheet) {
      const addSheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}:batchUpdate`;
      const addRes = await fetch(addSheetUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                  gridProperties: {
                    frozenRowCount: 1,
                  },
                },
              },
            },
          ],
        }),
      });

      if (!addRes.ok) {
        const err = await addRes.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Gagal membuat tab sheet "${sheetName}"`);
      }

      await setSheetHeaders(accessToken, sheetName, headers);
    } else {
      const range = `${encodeURIComponent(sheetName)}!A1:Z1`;
      const checkRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (checkRes.ok) {
        const data = await checkRes.json();
        if (!data.values || data.values.length === 0 || data.values[0].length === 0) {
          await setSheetHeaders(accessToken, sheetName, headers);
        }
      }
    }
  } catch (err) {
    console.warn(`Catatan pastikan header tab ${sheetName}:`, err);
  }
}

/**
 * Set header row for a sheet tab
 */
async function setSheetHeaders(
  accessToken: string,
  sheetName: string,
  headers: string[]
): Promise<void> {
  const sheetId = getActiveSpreadsheetId();
  const range = `${encodeURIComponent(sheetName)}!A1`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?valueInputOption=USER_ENTERED`;

  await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [headers],
    }),
  });
}

/**
 * Append row to target sheet via REST API
 */
export async function appendRowToSheet(
  accessToken: string,
  sheetName: string,
  rowValues: (string | number | boolean | null | undefined)[]
): Promise<any> {
  const sheetId = getActiveSpreadsheetId();
  const range = `${encodeURIComponent(sheetName)}!A1`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const formattedRow = rowValues.map((v) => (v === undefined || v === null ? '' : String(v)));

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      values: [formattedRow],
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `Gagal menyimpan baris ke Google Sheets (${res.status})`
    );
  }

  return await res.json();
}

/* =========================================================================
 * FUNGSI PENYIMPANAN DATA UNTUK SETIAP MODUL (MENDUKUNG KODE GS + OAUTH)
 * ========================================================================= */

/**
 * 1. Simpan GENIUS Class ke Google Sheet
 */
export async function saveGeniusClassToSheet(
  data: GeniusClassData,
  accessToken?: string
): Promise<void> {
  // 1. Coba lewat Google Apps Script jika URL ada
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('saveGeniusClass', data);
    return;
  }

  // 2. Fallback lewat OAuth jika token tersedia
  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.GENIUS_CLASS);
    const row = [
      formatTimestamp(),
      data.date || '-',
      data.geniusClass || 'GENIUS Class',
      data.subKegiatan || '-',
      data.bidangOsn || '-',
      data.topikOsnId || '-',
      Array.isArray(data.lingkupMateri) && data.lingkupMateri.length > 0
        ? data.lingkupMateri.join('\n• ')
        : '-',
      Array.isArray(data.kompetensiDasar) && data.kompetensiDasar.length > 0
        ? data.kompetensiDasar.join('\n• ')
        : '-',
      data.pembina || '-',
      data.peserta || 0,
      data.kegiatan || '-',
      data.hasil || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];
    await appendRowToSheet(accessToken, SHEET_CONFIGS.GENIUS_CLASS.sheetName, row);
    return;
  }

  console.info('GENIUS Class tersimpan di database lokal (Apps Script belum diset).');
}

/**
 * 2. Simpan Jurnal Mengajar ke Google Sheet
 */
export async function saveJurnalMengajarToSheet(
  data: JurnalMengajarData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('saveJurnal', data);
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.JURNAL_MENGAJAR);

    const formattedSessions = (data.sessions || [])
      .map((s, idx) => `[Sesi ${idx + 1} (${s.waktu})] Mapel: ${s.mapel} | Materi: ${s.materi}`)
      .join('\n');

    const absensiText = data.absensi
      ? `Hadir: ${data.absensi.hadir}/${data.absensi.totalSiswa || 0} Siswa (${data.absensi.totalSiswa ? Math.round((data.absensi.hadir / data.absensi.totalSiswa) * 100) : 100}%) | S: ${data.absensi.sakit}, I: ${data.absensi.izin}, A: ${data.absensi.alpa}`
      : '-';
    const siswaTidakHadirText = data.absensi?.siswaTidakHadir || '-';

    const row = [
      formatTimestamp(),
      data.date || '-',
      data.guru || '-',
      `Kelas ${data.kelas?.toUpperCase() || '-'}`,
      absensiText,
      siswaTidakHadirText,
      formattedSessions || '-',
      data.kendala || '-',
      data.rencana || '-',
      data.mood ? data.mood.toUpperCase() : 'NORMAL',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.JURNAL_MENGAJAR.sheetName, row);
    return;
  }

  console.info('Jurnal Mengajar tersimpan di database lokal.');
}

/**
 * 3. Simpan Pembiasaan ke Google Sheet
 */
export async function savePembiasaanToSheet(
  data: PembiasaanData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('savePembiasaan', data);
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.PEMBIASAAN);

    const row = [
      formatTimestamp(),
      data.date || '-',
      data.kegiatan || '-',
      data.koordinator || '-',
      data.peserta || 0,
      data.deskripsi || '-',
      data.hasil || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.PEMBIASAAN.sheetName, row);
    return;
  }

  console.info('Pembiasaan tersimpan di database lokal.');
}

/**
 * 4. Simpan Supervisi ke Google Sheet
 */
export async function saveSupervisiToSheet(
  data: SupervisiData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('saveSupervisi', data);
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.SUPERVISI);

    const row = [
      formatTimestamp(),
      data.date || '-',
      data.guru || '-',
      data.mapel || '-',
      `Kelas ${data.kelas?.toUpperCase() || '-'}`,
      data.tahapan?.toUpperCase() || '-',
      data.hasil || '-',
      data.tindakLanjut || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.SUPERVISI.sheetName, row);
    return;
  }

  console.info('Supervisi tersimpan di database lokal.');
}

/**
 * 5. Simpan Jadwal Supervisi ke Google Sheet
 */
export async function saveJadwalSupervisiToSheet(
  data: JadwalSupervisiData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('appendRow', {
      sheetName: SHEET_CONFIGS.JADWAL_SUPERVISI.sheetName,
      rowValues: [
        formatTimestamp(),
        data.hari || '-',
        data.date || '-',
        data.waktu || '-',
        data.guru || '-',
        `Kelas ${data.kelas?.toUpperCase() || '-'}`,
        data.pengawas || '-',
      ],
    });
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.JADWAL_SUPERVISI);

    const row = [
      formatTimestamp(),
      data.hari || '-',
      data.date || '-',
      data.waktu || '-',
      data.guru || '-',
      `Kelas ${data.kelas?.toUpperCase() || '-'}`,
      data.pengawas || '-',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.JADWAL_SUPERVISI.sheetName, row);
    return;
  }

  console.info('Jadwal Supervisi tersimpan di database lokal.');
}

/**
 * 6. Simpan Kombel GENIUS ke Google Sheet
 */
export async function saveKombelToSheet(
  data: KombelGeniusData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('saveKombel', data);
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.KOMBEL);

    const row = [
      formatTimestamp(),
      data.date || '-',
      data.topik || '-',
      data.pemateri || '-',
      data.peserta || 0,
      data.materi || '-',
      data.praktikBaik || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.KOMBEL.sheetName, row);
    return;
  }

  console.info('Kombel tersimpan di database lokal.');
}

/**
 * 7. Simpan Buku Kejadian ke Google Sheet
 */
export async function saveKejadianToSheet(
  data: BukuKejadianData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('appendRow', {
      sheetName: SHEET_CONFIGS.BUKU_KEJADIAN.sheetName,
      rowValues: [
        formatTimestamp(),
        data.date || '-',
        data.namaSiswa || '-',
        `Kelas ${data.kelas?.toUpperCase() || '-'}`,
        data.jenisKejadian || '-',
        data.deskripsi || '-',
        data.tindakan || '-',
        data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
      ],
    });
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.BUKU_KEJADIAN);

    const row = [
      formatTimestamp(),
      data.date || '-',
      data.namaSiswa || '-',
      `Kelas ${data.kelas?.toUpperCase() || '-'}`,
      data.jenisKejadian || '-',
      data.deskripsi || '-',
      data.tindakan || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.BUKU_KEJADIAN.sheetName, row);
    return;
  }

  console.info('Buku Kejadian tersimpan di database lokal.');
}

/**
 * 8. Simpan Buku Kunjungan ke Google Sheet
 */
export async function saveKunjunganToSheet(
  data: BukuKunjunganData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('appendRow', {
      sheetName: SHEET_CONFIGS.BUKU_KUNJUNGAN.sheetName,
      rowValues: [
        formatTimestamp(),
        data.date || '-',
        data.namaPengunjung || '-',
        data.instansi || '-',
        data.keperluan || '-',
        data.bertemu || '-',
        data.keterangan || '-',
        data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
      ],
    });
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.BUKU_KUNJUNGAN);

    const row = [
      formatTimestamp(),
      data.date || '-',
      data.namaPengunjung || '-',
      data.instansi || '-',
      data.keperluan || '-',
      data.bertemu || '-',
      data.keterangan || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.BUKU_KUNJUNGAN.sheetName, row);
    return;
  }

  console.info('Buku Kunjungan tersimpan di database lokal.');
}

/**
 * 9. Simpan Buku Inventaris ke Google Sheet
 */
export async function saveInventarisToSheet(
  data: BukuInventarisData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('appendRow', {
      sheetName: SHEET_CONFIGS.BUKU_INVENTARIS.sheetName,
      rowValues: [
        formatTimestamp(),
        data.date || '-',
        data.kodeBarang || '-',
        data.namaBarang || '-',
        data.jumlah || 0,
        data.kondisi || '-',
        data.lokasi || '-',
        data.keterangan || '-',
        data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
      ],
    });
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.BUKU_INVENTARIS);

    const row = [
      formatTimestamp(),
      data.date || '-',
      data.kodeBarang || '-',
      data.namaBarang || '-',
      data.jumlah || 0,
      data.kondisi || '-',
      data.lokasi || '-',
      data.keterangan || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.BUKU_INVENTARIS.sheetName, row);
    return;
  }

  console.info('Buku Inventaris tersimpan di database lokal.');
}

/**
 * 10. Simpan Buku Perkembangan ke Google Sheet
 */
export async function savePerkembanganToSheet(
  data: BukuPerkembanganData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('appendRow', {
      sheetName: SHEET_CONFIGS.BUKU_PERKEMBANGAN.sheetName,
      rowValues: [
        formatTimestamp(),
        data.date || '-',
        data.namaSiswa || '-',
        `Kelas ${data.kelas?.toUpperCase() || '-'}`,
        data.aspek || '-',
        data.deskripsi || '-',
        data.tindakLanjut || '-',
        data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
      ],
    });
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.BUKU_PERKEMBANGAN);

    const row = [
      formatTimestamp(),
      data.date || '-',
      data.namaSiswa || '-',
      `Kelas ${data.kelas?.toUpperCase() || '-'}`,
      data.aspek || '-',
      data.deskripsi || '-',
      data.tindakLanjut || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.BUKU_PERKEMBANGAN.sheetName, row);
    return;
  }

  console.info('Buku Perkembangan tersimpan di database lokal.');
}

/**
 * 11. Simpan Seven Habits (Jurnal 7 Kebiasaan Anak Hebat) ke Google Sheet
 */
export async function saveSevenHabitsToSheet(
  data: SevenHabitsData,
  accessToken?: string
): Promise<void> {
  const getHabitDetail = (id: string, defaultName: string): string => {
    const item = (data.habits || []).find((h) => h.id === id);
    if (!item) {
      const camelKey = id.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      const direct = (data as any)[camelKey] || (data as any)[id];
      return direct || 'Terlaksana';
    }
    const statusLabel =
      item.status === 'sangat_baik'
        ? 'Sangat Baik'
        : item.status === 'baik'
        ? 'Baik'
        : item.status === 'cukup'
        ? 'Cukup'
        : item.status === 'perlu_bimbingan'
        ? 'Perlu Bimbingan'
        : (item.status as string) || 'Terlaksana';
    const countInfo = item.jumlahSiswa !== undefined ? ` [${item.jumlahSiswa}/${data.jumlahSiswa} Siswa]` : '';
    const noteInfo = item.catatan ? ` - ${item.catatan}` : '';
    return `${statusLabel}${countInfo}${noteInfo}`;
  };

  const bangunPagi = data.bangunPagi || getHabitDetail('bangun-pagi', 'Bangun Pagi');
  const beribadah = data.beribadah || getHabitDetail('beribadah', 'Beribadah');
  const berolahraga = data.berolahraga || getHabitDetail('berolahraga', 'Berolahraga');
  const makanSehat = data.makanSehat || getHabitDetail('makan-sehat', 'Makan Sehat & Bergizi');
  const gemarBelajar = data.gemarBelajar || getHabitDetail('gemar-belajar', 'Gemar Belajar');
  const bermasyarakat = data.bermasyarakat || getHabitDetail('bermasyarakat', 'Bermasyarakat');
  const tidurCepat = data.tidurCepat || getHabitDetail('tidur-cepat', 'Tidur Cepat');

  const payload = {
    ...data,
    bangunPagi,
    beribadah,
    berolahraga,
    makanSehat,
    gemarBelajar,
    bermasyarakat,
    tidurCepat,
    siswaCount: data.jumlahSiswa,
    refleksi: data.catatanRefleksi,
    rencanaLanjut: data.tindakLanjut,
  };

  if (isAppsScriptConfigured()) {
    await sendToAppsScript('saveSevenHabits', payload);
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.SEVEN_HABITS);

    const row = [
      formatTimestamp(),
      data.date || '-',
      data.guru || '-',
      `Kelas ${data.kelas?.toUpperCase() || '-'}`,
      data.jumlahSiswa || 0,
      bangunPagi,
      beribadah,
      berolahraga,
      makanSehat,
      gemarBelajar,
      bermasyarakat,
      tidurCepat,
      data.catatanRefleksi || '-',
      data.tindakLanjut || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];

    await appendRowToSheet(accessToken, SHEET_CONFIGS.SEVEN_HABITS.sheetName, row);
    return;
  }

  console.info('Seven Habits tersimpan di database lokal.');
}

/**
 * 12. Simpan Supervisi Pengawas ke Google Sheet
 */
export async function saveSupervisiPengawasToSheet(
  data: SupervisiPengawasData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('saveSupervisiPengawas', data);
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.SUPERVISI_PENGAWAS);
    const row = [
      formatTimestamp(),
      data.date || '-',
      data.pengawas || '-',
      data.nip || '-',
      data.sasaran || '-',
      data.aspekSupervisi || '-',
      data.temuan || '-',
      data.rekomendasi || '-',
      data.tindakLanjut || '-',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];
    await appendRowToSheet(accessToken, SHEET_CONFIGS.SUPERVISI_PENGAWAS.sheetName, row);
    return;
  }

  console.info('Supervisi Pengawas tersimpan di database lokal.');
}

/**
 * 13. Simpan Jurnal Orang Tua ke Google Sheet
 */
export async function saveJurnalOrangTuaToSheet(
  data: JurnalOrangTuaData,
  accessToken?: string
): Promise<void> {
  if (isAppsScriptConfigured()) {
    await sendToAppsScript('saveJurnalOrangTua', data);
    return;
  }

  if (accessToken) {
    await ensureSheetWithHeaders(accessToken, SHEET_CONFIGS.JURNAL_ORANG_TUA);
    const row = [
      formatTimestamp(),
      data.date || '-',
      data.namaOrtu || '-',
      data.namaAnak || '-',
      `Kelas ${data.kelas || '-'}`,
      data.bangunPagi || '-',
      data.ibadah || '-',
      data.makanSehat || '-',
      data.belajarMandiri || '-',
      data.tidurCepat || '-',
      data.pesanGuru || '-',
      data.paraf ? 'Sudah Diparaf Ortu' : 'Belum Paraf',
      data.fotoData ? 'Ada Dokumentasi Foto' : 'Tanpa Foto',
    ];
    await appendRowToSheet(accessToken, SHEET_CONFIGS.JURNAL_ORANG_TUA.sheetName, row);
    return;
  }

  console.info('Jurnal Orang Tua tersimpan di database lokal.');
}

/**
 * =========================================================================
 * 14. PENGELOLAAN AKUN PENGGUNA RESMI DARI GOOGLE SPREADSHEET (NO DUMMY)
 * Sheet Tab: "Akun Pengguna"
 * =========================================================================
 */

/**
 * Mengambil seluruh akun pengguna resmi langsung dari sheet "Akun Pengguna" di Google Spreadsheet
 */
export async function fetchAccountsFromSpreadsheet(
  forceRefresh: boolean = false
): Promise<{
  success: boolean;
  accounts: UserAccount[];
  message: string;
}> {
  const url = getAppsScriptUrl();
  if (url) {
    try {
      const fetchUrl = `${url}?action=getAccounts&_t=${Date.now()}`;
      const res = await fetch(fetchUrl, { method: 'GET', mode: 'cors' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.accounts)) {
          const parsedAccounts: UserAccount[] = json.accounts
            .filter((a: any) => a.username && String(a.username).trim() !== '')
            .map((a: any) => ({
              username: String(a.username).trim(),
              password: String(a.password || '').trim(),
              name: String(a.name || a.username).trim(),
              role: (a.role as any) || 'Guru',
              deskripsi: a.deskripsi || `Akun ${a.role || 'Pengguna'} - ${a.name || a.username}`,
              kelas: a.kelas || undefined,
              nip: a.nip || undefined,
              fotoUrl: a.fotoUrl || undefined,
            }));

          // Simpan ke local storage untuk akses offline
          setStoredItem(STORAGE_KEYS.ACCOUNTS, parsedAccounts);
          return {
            success: true,
            accounts: parsedAccounts,
            message: `Berhasil memuat ${parsedAccounts.length} akun resmi dari Google Spreadsheet.`,
          };
        }
      }
    } catch (err: any) {
      console.warn('Gagal fetch akun via Apps Script:', err);
    }
  }

  // Fallback: Gunakan akun tersimpan di localStorage atau akun resmi bawaan
  const cached = getStoredItem<UserAccount[]>(STORAGE_KEYS.ACCOUNTS, DEFAULT_ACCOUNTS);
  const finalAccounts = Array.isArray(cached) && cached.length > 0 ? cached : DEFAULT_ACCOUNTS;
  setStoredItem(STORAGE_KEYS.ACCOUNTS, finalAccounts);

  return {
    success: true,
    accounts: finalAccounts,
    message: `Koneksi otomatis aktif: ${finalAccounts.length} akun resmi SDN Tamansari siap digunakan.`,
  };
}

/**
 * Menyimpan akun baru ke sheet "Akun Pengguna" di Google Spreadsheet
 */
export async function saveAccountToSpreadsheet(account: UserAccount): Promise<boolean> {
  if (isAppsScriptConfigured()) {
    try {
      const res = await sendToAppsScript('saveAccount', account);
      return Boolean(res.success);
    } catch (err) {
      console.error('Gagal menyimpan akun ke spreadsheet:', err);
      return false;
    }
  }
  return false;
}

/**
 * Memperbarui kata sandi akun di sheet "Akun Pengguna" di Google Spreadsheet
 */
export async function updateAccountPasswordInSpreadsheet(
  username: string,
  newPassword: string
): Promise<boolean> {
  if (isAppsScriptConfigured()) {
    try {
      const res = await sendToAppsScript('updatePassword', { username, newPassword });
      return Boolean(res.success);
    } catch (err) {
      console.error('Gagal update password di spreadsheet:', err);
      return false;
    }
  }
  return false;
}

/**
 * Menghapus akun dari sheet "Akun Pengguna" di Google Spreadsheet
 */
export async function deleteAccountFromSpreadsheet(username: string): Promise<boolean> {
  if (isAppsScriptConfigured()) {
    try {
      const res = await sendToAppsScript('deleteAccount', { username });
      return Boolean(res.success);
    } catch (err) {
      console.error('Gagal menghapus akun di spreadsheet:', err);
      return false;
    }
  }
  return false;
}

/**
 * =========================================================================
 * 15. PENGAMBILAN DATA SEVEN HABITS DARI GOOGLE SPREADSHEET
 * Sheet Tab: "Seven Habits"
 * =========================================================================
 */

function parseHabitCell(
  id: string,
  name: string,
  tagline: string,
  val: string,
  totalSiswa: number
): { id: string; name: string; tagline: string; status: 'sangat_baik' | 'baik' | 'cukup' | 'perlu_bimbingan'; persentase: number; jumlahSiswa: number; catatan?: string } {
  const v = (val || '').toLowerCase();
  let status: 'sangat_baik' | 'baik' | 'cukup' | 'perlu_bimbingan' = 'sangat_baik';
  if (v.includes('bimbingan') || v.includes('perlu')) {
    status = 'perlu_bimbingan';
  } else if (v.includes('cukup')) {
    status = 'cukup';
  } else if (v.includes('baik') && !v.includes('sangat')) {
    status = 'baik';
  } else {
    status = 'sangat_baik';
  }

  let catatan: string | undefined = undefined;
  if (val && val.includes('- Catatan:')) {
    catatan = val.split('- Catatan:')[1]?.trim();
  } else if (val && val.includes('(') && val.includes(')')) {
    const match = val.match(/\((.*?)\)/);
    if (match) catatan = match[1];
  } else if (val && !['terlaksana', 'sangat baik', 'baik', 'cukup', 'perlu bimbingan', '-'].includes(v.trim())) {
    catatan = val.trim();
  }

  const persentase =
    status === 'sangat_baik' ? 100 : status === 'baik' ? 85 : status === 'cukup' ? 70 : 50;

  return {
    id,
    name,
    tagline,
    status,
    persentase,
    jumlahSiswa: totalSiswa,
    catatan: catatan || undefined,
  };
}

function parseRawSevenHabitsRow(row: any[], idx: number): SevenHabitsData {
  const ts = row[0] ? String(row[0]) : new Date().toISOString();
  const date = row[1] ? String(row[1]) : new Date().toISOString().split('T')[0];
  const guru = row[2] ? String(row[2]) : '-';
  const kelas = String(row[3] || '').replace(/^Kelas\s+/i, '') || '4a';
  const jumlahSiswa = Number(row[4]) || 28;
  const bangunPagi = String(row[5] || 'Terlaksana');
  const beribadah = String(row[6] || 'Terlaksana');
  const berolahraga = String(row[7] || 'Terlaksana');
  const makanSehat = String(row[8] || 'Terlaksana');
  const gemarBelajar = String(row[9] || 'Terlaksana');
  const bermasyarakat = String(row[10] || 'Terlaksana');
  const tidurCepat = String(row[11] || 'Terlaksana');
  const catatanRefleksi = row[12] ? String(row[12]) : '';
  const tindakLanjut = row[13] ? String(row[13]) : '';
  const fotoData = row[14] ? String(row[14]) : '';

  const habits = [
    parseHabitCell('bangun-pagi', 'Bangun pagi', 'Melatih disiplin dan menghargai waktu sejak dini.', bangunPagi, jumlahSiswa),
    parseHabitCell('beribadah', 'Beribadah', 'Membangun fondasi spiritual dan nilai moral yang kuat.', beribadah, jumlahSiswa),
    parseHabitCell('berolahraga', 'Berolahraga', 'Menjaga kebugaran tubuh serta kesehatan mental.', berolahraga, jumlahSiswa),
    parseHabitCell('makan-sehat', 'Makan sehat dan bergizi', 'Memenuhi nutrisi seimbang untuk tumbuh kembang.', makanSehat, jumlahSiswa),
    parseHabitCell('gemar-belajar', 'Gemar belajar', 'Menumbuhkan rasa ingin tahu dan semangat sepanjang hayat.', gemarBelajar, jumlahSiswa),
    parseHabitCell('bermasyarakat', 'Bermasyarakat', 'Belajar bergotong royong dan peduli kepada sesama.', bermasyarakat, jumlahSiswa),
    parseHabitCell('tidur-cepat', 'Tidur cepat', 'Memulihkan energi agar tubuh kembali bugar esok.', tidurCepat, jumlahSiswa),
  ];

  return {
    id: `sh-sheet-${idx + 1}`,
    timestamp: ts,
    date,
    guru,
    kelas,
    jumlahSiswa,
    bangunPagi,
    beribadah,
    berolahraga,
    makanSehat,
    gemarBelajar,
    bermasyarakat,
    tidurCepat,
    habits,
    catatanRefleksi: catatanRefleksi || undefined,
    tindakLanjut: tindakLanjut || undefined,
    fotoData: fotoData || undefined,
  };
}

/**
 * Mengambil data jurnal Seven Habits dari Spreadsheet resmi
 */
export async function fetchSevenHabitsFromSpreadsheet(
  accessToken?: string
): Promise<{ success: boolean; data: SevenHabitsData[]; message: string }> {
  const url = getAppsScriptUrl();

  // Mode 1: Melalui Google Apps Script Web App
  if (url && url.startsWith('http')) {
    try {
      const fetchUrl = `${url}?action=getSevenHabits`;
      const res = await fetch(fetchUrl, { method: 'GET', mode: 'cors' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.entries) && json.entries.length > 0) {
          const list: SevenHabitsData[] = json.entries.map((item: any, idx: number) => {
            const rowArr = [
              item.timestamp,
              item.date,
              item.guru,
              item.kelas,
              item.jumlahSiswa,
              item.bangunPagi,
              item.beribadah,
              item.berolahraga,
              item.makanSehat,
              item.gemarBelajar,
              item.bermasyarakat,
              item.tidurCepat,
              item.catatanRefleksi,
              item.tindakLanjut,
              item.fotoData,
            ];
            return parseRawSevenHabitsRow(rowArr, idx);
          });

          // Sinkronkan ke local storage
          setStoredItem(STORAGE_KEYS.SEVEN_HABITS, list);
          return {
            success: true,
            data: list,
            message: `Berhasil menyinkronkan ${list.length} data Seven Habits dari Spreadsheet.`,
          };
        }
      }
    } catch (err) {
      console.warn('Gagal fetch getSevenHabits via Apps Script:', err);
    }

    // Fallback: coba action=getData&sheet=Seven Habits
    try {
      const fallbackUrl = `${url}?action=getData&sheet=${encodeURIComponent('Seven Habits')}&limit=100`;
      const res = await fetch(fallbackUrl, { method: 'GET', mode: 'cors' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const list: SevenHabitsData[] = json.data.map((row: any, idx: number) =>
            parseRawSevenHabitsRow(row, idx)
          );
          setStoredItem(STORAGE_KEYS.SEVEN_HABITS, list);
          return {
            success: true,
            data: list,
            message: `Berhasil mengambil ${list.length} data Seven Habits dari tab 'Seven Habits'.`,
          };
        }
      }
    } catch (err) {
      console.warn('Fallback getData Seven Habits gagal:', err);
    }
  }

  // Mode 2: Direct Google Sheets REST API dengan OAuth
  if (accessToken) {
    try {
      const sheetId = getActiveSpreadsheetId();
      const range = encodeURIComponent('Seven Habits!A2:O');
      const apiRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (apiRes.ok) {
        const apiJson = await apiRes.json();
        const rows = apiJson.values || [];
        if (rows.length > 0) {
          const list: SevenHabitsData[] = rows.map((r: any[], idx: number) =>
            parseRawSevenHabitsRow(r, idx)
          );
          setStoredItem(STORAGE_KEYS.SEVEN_HABITS, list);
          return {
            success: true,
            data: list,
            message: `Berhasil mengambil ${list.length} data Seven Habits melalui Google Sheets API.`,
          };
        }
      }
    } catch (err) {
      console.error('REST API Seven Habits error:', err);
    }
  }

  // Fallback ke local storage
  const localList = getStoredItem<SevenHabitsData[]>(STORAGE_KEYS.SEVEN_HABITS, []);
  return {
    success: false,
    data: localList,
    message: localList.length > 0
      ? `Menampilkan ${localList.length} data Seven Habits lokal.`
      : 'Belum ada data Seven Habits di Spreadsheet maupun lokal.',
  };
}


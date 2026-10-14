import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Database,
  Cloud,
  CheckCircle2,
  XCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Code2,
  Layers,
  Sparkles,
  HelpCircle,
  Play,
  X,
  FileSpreadsheet,
  Globe,
  ShieldCheck,
  AlertTriangle,
  Table,
  Users,
  GraduationCap,
  Award,
  HeartHandshake,
  Trophy,
} from 'lucide-react';
import {
  getAppsScriptUrl,
  setAppsScriptUrl,
  testAppsScriptConnection,
  initSheetsViaAppsScript,
  fetchAllDataViaAppsScript,
  getActiveSpreadsheetId,
  SPREADSHEET_URL,
  SHEET_CONFIGS,
  setDatabaseConnectionInfo,
  DEFAULT_APPS_SCRIPT_URL,
} from '../services/googleSheetsService';

interface DatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataSynced?: (data: Record<string, any[]>) => void;
  showToast: (msg: string, type?: 'success' | 'error' | 'warning' | 'info') => void;
}

export const DatabaseSettingsModal: React.FC<DatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  onDataSynced,
  showToast,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'koneksi' | 'codegs' | 'struktur' | 'netlify'>('koneksi');
  const [testing, setTesting] = useState(false);
  const [initializing, setInitializing] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    details?: any;
  }>({
    tested: false,
    success: false,
    message: '',
  });

  useEffect(() => {
    if (isOpen) {
      const current = getAppsScriptUrl();
      setUrlInput(current);
      if (current) {
        // Auto check quick status
        testAppsScriptConnection(current).then((res) => {
          setConnectionStatus({
            tested: true,
            success: res.success,
            message: res.message,
            details: res.data,
          });
        });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    setAppsScriptUrl(urlInput);
    showToast('URL Google Apps Script berhasil disimpan!', 'success');
  };

  const handleTestConnection = async () => {
    if (!urlInput.trim()) {
      showToast('Harap masukkan URL Google Apps Script Web App terlebih dahulu.', 'warning');
      return;
    }
    setTesting(true);
    setAppsScriptUrl(urlInput);
    try {
      const res = await testAppsScriptConnection(urlInput);
      setConnectionStatus({
        tested: true,
        success: res.success,
        message: res.message,
        details: res.data,
      });
      setDatabaseConnectionInfo({
        state: res.success ? 'connected' : 'error',
        message: res.message,
        spreadsheetTitle: res.data?.spreadsheetTitle || 'Database SDN Tamansari',
        mode: 'apps_script',
      });
      if (res.success) {
        showToast(res.message, 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: err.message || 'Gagal terhubung',
      });
      setDatabaseConnectionInfo({
        state: 'error',
        message: err.message || 'Gagal terhubung ke Google Spreadsheet',
        mode: 'apps_script',
      });
      showToast(`Gagal: ${err.message}`, 'error');
    } finally {
      setTesting(false);
    }
  };

  const handleInitSheets = async () => {
    if (!urlInput.trim()) {
      showToast('Masukkan URL Apps Script terlebih dahulu.', 'warning');
      return;
    }
    setInitializing(true);
    try {
      const res = await initSheetsViaAppsScript(urlInput);
      if (res.success) {
        showToast('Seluruh sheet tab berhasil disiapkan di Google Spreadsheet!', 'success');
      } else {
        showToast(`Gagal inisialisasi: ${res.message}`, 'warning');
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setInitializing(false);
    }
  };

  const handleSyncData = async () => {
    if (!urlInput.trim()) {
      showToast('Masukkan URL Apps Script terlebih dahulu.', 'warning');
      return;
    }
    setSyncing(true);
    try {
      const data = await fetchAllDataViaAppsScript(urlInput);
      if (onDataSynced && data && Object.keys(data).length > 0) {
        onDataSynced(data);
        showToast('Data dari Google Spreadsheet berhasil ditarik ke aplikasi!', 'success');
      } else {
        showToast('Sinkronisasi selesai. Belum ada baris data tambahan di Spreadsheet.', 'info');
      }
    } catch (err: any) {
      showToast(`Gagal menarik data: ${err.message}`, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleReplayOpener = () => {
    window.location.reload();
  };

  const copyAppsScriptCode = () => {
    const code = CODE_GS_TEMPLATE;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    showToast('Kode Code.gs berhasil disalin ke clipboard!', 'success');
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const spreadsheetId = getActiveSpreadsheetId();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-white border-2 border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header (2D Modern) */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-600 text-white flex items-center justify-between border-b border-indigo-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/20">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">Database & Netlify Center</h3>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white">
                  Google Sheets
                </span>
              </div>
              <p className="text-xs text-indigo-100">
                Solusi Jenius Database Spreadsheet & Deployment Netlify
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2D Segmented Tabs */}
        <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setActiveTab('koneksi')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all border ${
              activeTab === 'koneksi'
                ? 'bg-white text-indigo-700 border-indigo-200 shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>Koneksi Google Apps Script</span>
          </button>
          <button
            onClick={() => setActiveTab('codegs')}
            className={`flex-1 py-2.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border ${
              activeTab === 'codegs'
                ? 'bg-white text-indigo-700 border-indigo-200 shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code.gs</span>
          </button>
          <button
            onClick={() => setActiveTab('struktur')}
            className={`flex-1 py-2.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border ${
              activeTab === 'struktur'
                ? 'bg-white text-indigo-700 border-indigo-200 shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Sheet 6 Peran</span>
          </button>
          <button
            onClick={() => setActiveTab('netlify')}
            className={`flex-1 py-2.5 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all border ${
              activeTab === 'netlify'
                ? 'bg-white text-indigo-700 border-indigo-200 shadow-xs'
                : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Netlify</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-700 text-sm">
          {/* TAB 1: KONEKSI APPS SCRIPT */}
          {activeTab === 'koneksi' && (
            <div className="space-y-5">
              {/* Target Spreadsheet Info Card */}
              <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-indigo-900 text-sm">Spreadsheet Target SDN TAMANSARI</p>
                    <a
                      href={SPREADSHEET_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      Buka Sheet <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-xs text-indigo-700/80 font-mono mt-1 break-all">
                    ID: {spreadsheetId}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Semua input dari Jurnal Mengajar, Pembiasaan, GENIUS Class, Kombel, Supervisi, & 7 Habits langsung tersimpan ke sheet ini.
                  </p>
                </div>
              </div>

              {/* URL Input Form */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  URL Google Apps Script Web App (Code.gs)
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border-2 border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl text-xs font-mono outline-hidden transition-all text-slate-800"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveUrl}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setUrlInput(DEFAULT_APPS_SCRIPT_URL);
                        setAppsScriptUrl(DEFAULT_APPS_SCRIPT_URL);
                        showToast('URL Google Apps Script otomatis berhasil diterapkan!', 'success');
                      }}
                      className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors shrink-0"
                      title="Kembalikan ke URL Google Apps Script bawaan otomatis"
                    >
                      Reset Otomatis
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Koneksi otomatis aktif ke Google Spreadsheet SDN Tamansari. Anda juga dapat mengganti dengan URL Apps Script kustom Anda sendiri.
                </p>
              </div>

              {/* Status Pill */}
              {connectionStatus.tested && (
                <div
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 ${
                    connectionStatus.success
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-rose-50 border-rose-200 text-rose-800'
                  }`}
                >
                  {connectionStatus.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <div className="text-xs">
                    <p className="font-bold">
                      {connectionStatus.success ? 'Koneksi Berhasil Aktif!' : 'Koneksi Belum Terhubung'}
                    </p>
                    <p className="opacity-90">{connectionStatus.message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons (2D Style) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                <button
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Menguji...' : 'Uji Koneksi'}</span>
                </button>

                <button
                  onClick={handleInitSheets}
                  disabled={initializing}
                  className="py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
                >
                  <Layers className={`w-3.5 h-3.5 ${initializing ? 'animate-spin' : ''}`} />
                  <span>{initializing ? 'Membuat...' : 'Inisialisasi Tab'}</span>
                </button>

                <button
                  onClick={handleSyncData}
                  disabled={syncing}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Sinkron...' : 'Tarik Data Sheet'}</span>
                </button>
              </div>

              {/* Opener Replay Feature */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-slate-800">Animasi Opener 2D</p>
                  <p className="text-[11px] text-slate-500">
                    Putar kembali animasi pembuka SDN Tamansari di index.html
                  </p>
                </div>
                <button
                  onClick={handleReplayOpener}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Putar Ulang</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: KODE CODE.GS */}
          {activeTab === 'codegs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs">File Google Apps Script (Code.gs)</h4>
                  <p className="text-[11px] text-slate-500">
                    Salin kode ini dan tempel di menu Extensions &gt; Apps Script pada Spreadsheet Anda.
                  </p>
                </div>
                <button
                  onClick={copyAppsScriptCode}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>

              {/* Code viewer box */}
              <div className="relative rounded-2xl bg-slate-900 p-4 border border-slate-800 text-slate-300 font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto">
                <pre>{CODE_GS_TEMPLATE}</pre>
              </div>

              {/* Steps recap */}
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Catatan Penting Deployment:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-amber-800">
                  <li>Pilih jenis penerapan: <strong>Aplikasi Web (Web App)</strong>.</li>
                  <li>Jalankan sebagai: <strong>Saya (Me)</strong>.</li>
                  <li>Akses: <strong>Siapa Saja (Anyone)</strong> agar Netlify dapat menyimpan form tanpa blokir izin.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 3: PANDUAN NETLIFY */}
          {activeTab === 'netlify' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <p className="font-bold text-sky-900 text-xs uppercase tracking-wide">
                    Konfigurasi Netlify Siap Pakai
                  </p>
                </div>
                <p className="text-xs text-sky-800">
                  Aplikasi telah dilengkapi file <code className="bg-sky-100 px-1.5 py-0.5 rounded font-mono text-sky-900">netlify.toml</code> dan <code className="bg-sky-100 px-1.5 py-0.5 rounded font-mono text-sky-900">public/_redirects</code> untuk mencegah error 404 pada routing SPA di Netlify.
                </p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <p className="font-bold text-slate-800">1. Pengaturan Build di Netlify:</p>
                  <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
                    <li>Build command: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">npm run build</code></li>
                    <li>Publish directory: <code className="font-mono bg-white px-1 py-0.5 rounded border border-slate-200">dist</code></li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <p className="font-bold text-slate-800">2. Environment Variables (Opsional):</p>
                  <p className="text-slate-600 text-[11px]">
                    Di Netlify Dashboard &gt; Site configuration &gt; Environment variables, tambahkan:
                  </p>
                  <code className="block font-mono bg-white p-2 rounded border border-slate-200 text-[11px] text-indigo-700">
                    VITE_APPS_SCRIPT_URL = [URL_Aplikasi_Web_Anda]
                  </code>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <p className="font-bold text-slate-800">3. Redirects SPA:</p>
                  <p className="text-slate-600 text-[11px]">
                    File <code className="font-mono">_redirects</code> dengan isi <code className="font-mono">/*  /index.html  200</code> sudah disiapkan otomatis di dalam folder <code className="font-mono">public</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STRUKTUR DATABASE MULTI-ROLE & MULTI-USER */}
          {activeTab === 'struktur' && (
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-sky-50 border border-indigo-100 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-indigo-950 text-xs flex items-center gap-1.5">
                    <Table className="w-4 h-4 text-indigo-600" />
                    <span>Database Google Spreadsheet Multi-Role (Siap Diisi)</span>
                  </h4>
                  <p className="text-[11px] text-indigo-800 mt-0.5">
                    Tersedia 14 Tab Sheet khusus untuk 6 Peran & Pengguna
                  </p>
                </div>
                <a
                  href={SPREADSHEET_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Sheet</span>
                </a>
              </div>

              {/* Grid 6 Roles and Sheets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-sky-50/70 border border-sky-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-sky-900">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>1. Pengawas Pembina</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Tab: <strong className="text-slate-800">"Supervisi Pengawas"</strong> &amp; <strong className="text-slate-800">"Jadwal Supervisi"</strong>
                  </p>
                  <span className="text-[10px] text-sky-700 font-medium block">
                    Menampung temuan, pembinaan KS & rekomendasi mutu sekolah.
                  </span>
                </div>

                <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>2. Kepala Sekolah (KS)</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Tab: <strong className="text-slate-800">"Supervisi Guru"</strong>, <strong className="text-slate-800">"Buku Kunjungan"</strong>, <strong className="text-slate-800">"Buku Inventaris"</strong>
                  </p>
                  <span className="text-[10px] text-indigo-700 font-medium block">
                    KS: Muhammad Rosyid Jamily, M.Pd - Monitoring akademik & sarpras.
                  </span>
                </div>

                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-purple-900">
                    <GraduationCap className="w-4 h-4 text-purple-600" />
                    <span>3. Guru Kelas &amp; Mapel</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Tab: <strong className="text-slate-800">"Jurnal Mengajar"</strong>, <strong className="text-slate-800">"Pembiasaan"</strong>, <strong className="text-slate-800">"Kombel GENIUS"</strong>
                  </p>
                  <span className="text-[10px] text-purple-700 font-medium block">
                    Presensi murid, materi, kendala & administrasi harian (batas jam 12).
                  </span>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Trophy className="w-4 h-4 text-amber-600" />
                    <span>4. Pembina Ekstrakurikuler</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Tab: <strong className="text-slate-800">"GENIUS Class"</strong> &amp; <strong className="text-slate-800">"Buku Perkembangan"</strong>
                  </p>
                  <span className="text-[10px] text-amber-700 font-medium block">
                    Pramuka, Drumband, MIPAS OSN, Silat, Tari, Qur'ani & Tamansari Sport.
                  </span>
                </div>

                <div className="p-3 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <Award className="w-4 h-4 text-rose-600" />
                    <span>5. Murid / Siswa</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Tab: <strong className="text-slate-800">"Seven Habits"</strong> &amp; <strong className="text-slate-800">"Pembiasaan"</strong>
                  </p>
                  <span className="text-[10px] text-rose-700 font-medium block">
                    Check-in 7 Kebiasaan Anak Hebat Indonesia & presensi pembiasaan.
                  </span>
                </div>

                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <HeartHandshake className="w-4 h-4 text-emerald-600" />
                    <span>6. Orang Tua / Wali Murid</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Tab: <strong className="text-slate-800">"Jurnal Orang Tua"</strong>
                  </p>
                  <span className="text-[10px] text-emerald-700 font-medium block">
                    Pantauan bangun pagi, ibadah, sarapan, belajar & paraf wali murid.
                  </span>
                </div>
              </div>

              {/* Master Multi-User Sheet */}
              <div className="p-3.5 bg-slate-100 border border-slate-300/80 rounded-2xl text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-slate-700" />
                    Tab Master: "Akun Pengguna" (Multi-User)
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white text-slate-700 border border-slate-200">
                    7 Akun Demo Ready
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Menyimpan kredensial seluruh pengguna (Role, Username, Password, Nama Lengkap, NIP/NISN, Kelas/Jabatan).
                </p>
              </div>

              <div className="pt-1">
                <button
                  onClick={handleInitSheets}
                  disabled={initializing}
                  className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                >
                  <Layers className={`w-3.5 h-3.5 ${initializing ? 'animate-spin' : ''}`} />
                  <span>
                    {initializing
                      ? 'Sedang Menyiapkan Seluruh Tab...'
                      : 'Klik Di Sini: Inisialisasi Seluruh 14 Sheet di Spreadsheet'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>2D Modern Architecture</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// Ready-to-copy Code.gs string representation
const CODE_GS_TEMPLATE = `/**
 * =========================================================================
 * GENIUS APP - SDN TAMANSARI BACKEND (Google Apps Script / Code.gs)
 * Database Engine: Google Spreadsheet
 * Solusi Jenius Monitoring Terpadu Sekolah
 * =========================================================================
 * 
 * 1. Buka Google Spreadsheet SDN TAMANSARI
 * 2. Menu Ekstensi (Extensions) > Apps Script
 * 3. Hapus kode lama, tempel kode ini, klik Simpan
 * 4. Klik Terapkan (Deploy) > Penerapan Baru (New deployment)
 * 5. Pilih "Aplikasi Web" (Web app)
 *    - Jalankan sebagai: Saya (Me)
 *    - Akses: Siapa saja (Anyone) -> WAJIB agar Netlify terhubung!
 * 6. Salin URL /exec dan masukkan ke GENIUS APP!
 */

var SHEET_CONFIGS = {
  JURNAL_MENGAJAR: {
    name: "Jurnal Mengajar",
    headers: ["Timestamp Input", "Tanggal", "Nama Guru", "Kelas", "Presensi Kehadiran Siswa", "Siswa Tidak Hadir", "Sesi & Rincian Materi", "Kendala Pembelajaran", "Rencana Tindak Lanjut", "Suasana Kelas (Mood)", "Status Foto"]
  },
  PEMBIASAAN: {
    name: "Pembiasaan",
    headers: ["Timestamp Input", "Tanggal Pelaksanaan", "Jenis Pembiasaan", "Koordinator", "Jumlah Peserta Siswa", "Deskripsi Kegiatan", "Hasil & Catatan Evaluasi", "Status Foto"]
  },
  GENIUS_CLASS: {
    name: "GENIUS Class",
    headers: ["Timestamp Input", "Tanggal Pelaksanaan", "Program GENIUS", "Sub Kegiatan", "Bidang OSN", "Topik Silabus OSN 2026", "Lingkup Materi", "Kompetensi Dasar (KD)", "Nama Pembina", "Jumlah Peserta", "Uraian Kegiatan", "Hasil / Capaian Pembelajaran", "Status Foto"]
  },
  KOMBEL: {
    name: "Kombel GENIUS",
    headers: ["Timestamp Input", "Tanggal Pertemuan", "Topik Diskusi", "Narasumber / Pemateri", "Jumlah Peserta Guru", "Ringkasan Materi", "Praktik Baik / Hasil RTL", "Status Foto"]
  },
  SUPERVISI: {
    name: "Supervisi Guru",
    headers: ["Timestamp Input", "Tanggal", "Nama Guru Disupervisi", "Mata Pelajaran", "Kelas", "Tahapan Supervisi", "Catatan / Hasil Evaluasi", "Rencana Tindak Lanjut", "Status Foto"]
  },
  JADWAL_SUPERVISI: {
    name: "Jadwal Supervisi",
    headers: ["Timestamp Input", "Hari", "Tanggal", "Waktu Pelaksanaan", "Nama Guru", "Kelas", "Pengawas / Asesor"]
  },
  SEVEN_HABITS: {
    name: "Seven Habits",
    headers: ["Timestamp Input", "Tanggal", "Guru Pembina / Wali Kelas", "Kelas", "Jumlah Siswa", "1. Bangun Pagi", "2. Beribadah", "3. Berolahraga", "4. Makan Sehat & Bergizi", "5. Gemar Belajar", "6. Bermasyarakat", "7. Tidur Cepat", "Catatan Refleksi", "Rencana Tindak Lanjut", "Status Foto"]
  },
  BUKU_KEJADIAN: {
    name: "Buku Kejadian",
    headers: ["Timestamp Input", "Tanggal Kejadian", "Nama Siswa", "Kelas", "Jenis Kejadian", "Deskripsi Kejadian", "Tindakan / Solusi", "Status Foto"]
  },
  BUKU_KUNJUNGAN: {
    name: "Buku Kunjungan Tamu",
    headers: ["Timestamp Input", "Tanggal Kunjungan", "Nama Tamu / Pengunjung", "Instansi / Lembaga", "Maksud & Keperluan", "Bertemu Dengan", "Keterangan", "Status Foto"]
  },
  BUKU_INVENTARIS: {
    name: "Buku Inventaris",
    headers: ["Timestamp Input", "Tanggal Masuk / Periksa", "Kode Barang", "Nama Sarana / Barang", "Jumlah Unit", "Kondisi Fisik", "Lokasi Penempatan", "Keterangan", "Status Foto"]
  },
  BUKU_PERKEMBANGAN: {
    name: "Buku Perkembangan Siswa",
    headers: ["Timestamp Input", "Tanggal Pengamatan", "Nama Siswa", "Kelas", "Aspek Perkembangan", "Deskripsi Pengamatan", "Solusi / Tindak Lanjut", "Status Foto"]
  },
  SUPERVISI_PENGAWAS: {
    name: "Supervisi Pengawas",
    headers: ["Timestamp Input", "Tanggal Kunjungan", "Nama Pengawas", "NIP Pengawas", "Sasaran Supervisi", "Aspek Supervisi", "Temuan & Catatan Pembinaan", "Rekomendasi Mutu", "Rencana Tindak Lanjut Sekolah", "Status Foto"]
  },
  JURNAL_ORANG_TUA: {
    name: "Jurnal Orang Tua",
    headers: ["Timestamp Input", "Tanggal", "Nama Orang Tua / Wali", "Nama Siswa / Anak", "Kelas", "Jam Bangun & Keterangan", "Ibadah di Rumah", "Sarapan & Gizi Seimbang", "Belajar Mandiri di Rumah", "Jam Tidur Malam", "Pesan / Catatan untuk Guru", "Status Paraf Ortu", "Status Foto"]
  },
  AKUN_PENGGUNA: {
    name: "Akun Pengguna",
    headers: ["Role", "Username", "Password", "Nama Lengkap", "NIP / NISN / No Kontak", "Kelas / Jabatan"]
  }
};

function getActiveSpreadsheet() {
  try { return SpreadsheetApp.getActiveSpreadsheet(); }
  catch (e) { return SpreadsheetApp.openById("1axsdnznagOYvvZdFicRK42RcKIVqCDpTfKue3McQlxU"); }
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function initAllSheets() {
  var ss = getActiveSpreadsheet();
  var created = [];
  for (var key in SHEET_CONFIGS) {
    var config = SHEET_CONFIGS[key];
    var sheet = ss.getSheetByName(config.name);
    if (!sheet) {
      sheet = ss.insertSheet(config.name);
      sheet.appendRow(config.headers);
      var hr = sheet.getRange(1, 1, 1, config.headers.length);
      hr.setFontWeight("bold").setBackground("#4F46E5").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
      
      // Master Akun Pengguna: Akun Resmi SDN Tamansari (Pengawas sampai Orang Tua)
      if (config.name === "Akun Pengguna") {
        var officialAccounts = [
          ["Pengawas", "pengawas", "pengawas123", "Drs. H. Bambang Sujarwo, M.Pd", "196803121993031005", "Pengawas Pembina SD"],
          ["Kepala Sekolah", "ks", "ks123", "Muhammad Rosyid Jamily, M.Pd", "198506142010011018", "Kepala Sekolah"],
          ["Guru", "guru", "guru123", "Novia Rahmawati, S.Pd", "198804152015022003", "Guru Kelas 4A"],
          ["Pembina Ekskul", "pembina", "pembina123", "Rif'an, S.Pd.I", "199008202019031008", "Pembina Pramuka & Qurani"],
          ["Murid", "murid", "murid123", "Muhammad Fathan Al-Faruq", "0145892311", "Kelas 4A"],
          ["Orang Tua", "orangtua", "ortu123", "Hendra Wijaya, S.T", "081234567890", "Wali Murid Kelas 4A"],
          ["Admin", "admin", "admin123", "Administrator GENIUS", "-", "Pengelola Sistem"]
        ];
        for (var a = 0; a < officialAccounts.length; a++) {
          sheet.appendRow(officialAccounts[a]);
        }
      }
      
      created.push(config.name);
    }
  }
  return { success: true, message: "Inisialisasi sheet multi-role selesai.", createdSheets: created };
}

function appendRowToSheet(sheetName, rowData) {
  var ss = getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    initAllSheets();
    sheet = ss.getSheetByName(sheetName);
  }
  sheet.appendRow(rowData);
  return { success: true, sheetName: sheetName, rowInserted: sheet.getLastRow() };
}

function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
  var ss = getActiveSpreadsheet();
  if (action === "ping") {
    return createJsonResponse({
      success: true,
      status: "online",
      appName: "GENIUS APP SDN TAMANSARI",
      spreadsheetTitle: ss.getName(),
      sheetsCount: ss.getSheets().length
    });
  }
  if (action === "initSheets") return createJsonResponse(initAllSheets());

  // Ambil seluruh akun resmi dari sheet "Akun Pengguna"
  if (action === "getAccounts" || (action === "getData" && e.parameter && e.parameter.sheet === "Akun Pengguna")) {
    var accSheet = ss.getSheetByName("Akun Pengguna");
    if (!accSheet) {
      initAllSheets();
      accSheet = ss.getSheetByName("Akun Pengguna");
    }
    var lRow = accSheet.getLastRow();
    if (lRow <= 1) {
      return createJsonResponse({ success: true, count: 0, accounts: [], message: "Sheet Akun Pengguna kosong." });
    }
    var values = accSheet.getRange(2, 1, lRow - 1, 6).getValues();
    var accList = [];
    for (var i = 0; i < values.length; i++) {
      var r = values[i];
      var uRole = String(r[0] || "").trim();
      var uUser = String(r[1] || "").trim();
      var uPass = String(r[2] || "").trim();
      var uName = String(r[3] || "").trim();
      var uNip = String(r[4] || "").trim();
      var uKelas = String(r[5] || "").trim();
      if (uUser !== "") {
        accList.push({
          role: uRole || "Guru",
          username: uUser,
          password: uPass,
          name: uName || uUser,
          nip: uNip || "-",
          kelas: uKelas || "",
          deskripsi: "Akun " + (uRole || "Pengguna") + " - " + (uName || uUser)
        });
      }
    }
    return createJsonResponse({ success: true, count: accList.length, accounts: accList });
  }

  // Ambil data Seven Habits
  if (action === "getSevenHabits" || (action === "getData" && e.parameter && (e.parameter.sheet === "Seven Habits" || e.parameter.sheet === "SevenHabits"))) {
    var shSheet = ss.getSheetByName("Seven Habits");
    if (!shSheet) {
      initAllSheets();
      shSheet = ss.getSheetByName("Seven Habits");
    }
    var lr = shSheet.getLastRow();
    if (lr <= 1) return createJsonResponse({ success: true, count: 0, entries: [] });
    var shVals = shSheet.getRange(2, 1, lr - 1, 15).getValues();
    var list = [];
    for (var j = 0; j < shVals.length; j++) {
      var row = shVals[j];
      list.push({
        id: "sh-" + (j + 1),
        timestamp: String(row[0] || ""),
        date: String(row[1] || ""),
        guru: String(row[2] || "-"),
        kelas: String(row[3] || "").replace(/^Kelas\\s+/i, ""),
        jumlahSiswa: Number(row[4]) || 0,
        bangunPagi: String(row[5] || "Terlaksana"),
        beribadah: String(row[6] || "Terlaksana"),
        berolahraga: String(row[7] || "Terlaksana"),
        makanSehat: String(row[8] || "Terlaksana"),
        gemarBelajar: String(row[9] || "Terlaksana"),
        bermasyarakat: String(row[10] || "Terlaksana"),
        tidurCepat: String(row[11] || "Terlaksana"),
        catatanRefleksi: String(row[12] || ""),
        tindakLanjut: String(row[13] || ""),
        fotoData: String(row[14] || "")
      });
    }
    return createJsonResponse({ success: true, count: list.length, entries: list });
  }

  // Generic getData
  if (action === "getData") {
    var sName = (e.parameter && e.parameter.sheet) ? e.parameter.sheet : "";
    var targetSheet = ss.getSheetByName(sName);
    if (!targetSheet) return createJsonResponse({ success: false, message: "Sheet tidak ditemukan: " + sName, data: [] });
    var lr = targetSheet.getLastRow();
    var lc = targetSheet.getLastColumn();
    if (lr <= 1 || lc < 1) return createJsonResponse({ success: true, count: 0, data: [] });
    var allData = targetSheet.getRange(2, 1, lr - 1, lc).getValues();
    return createJsonResponse({ success: true, count: allData.length, data: allData });
  }

  return createJsonResponse({ success: false, message: "Action tidak dikenal: " + action });
}

function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try { payload = JSON.parse(e.postData.contents); }
      catch (err) { payload = e.parameter || {}; }
    } else { payload = e.parameter || {}; }
    
    var action = payload.action || "save";
    var timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");
    
    if (action === "initSheets") return createJsonResponse(initAllSheets());
    
    // Auto router to specific sheets
    if (action === "saveJurnal") {
      var d = payload.data || payload;
      var sessText = Array.isArray(d.sessions) ? d.sessions.map(function(s, i) {
        return "[Sesi " + (i+1) + "] " + s.mapel + " - " + s.materi;
      }).join("\\n") : "-";
      var abs = d.absensi ? ("Hadir: " + d.absensi.hadir + "/" + (d.absensi.totalSiswa || 0)) : "-";
      var row = [timestamp, d.date||"-", d.guru||"-", "Kelas " + (d.kelas||"-"), abs, (d.absensi&&d.absensi.siswaTidakHadir)||"-", sessText, d.kendala||"-", d.rencana||"-", (d.mood||"NORMAL"), d.fotoData ? "Ada Foto" : "Tanpa Foto"];
      return createJsonResponse({ success: true, result: appendRowToSheet("Jurnal Mengajar", row) });
    }
    
    if (action === "savePembiasaan") {
      var p = payload.data || payload;
      var pRow = [timestamp, p.date||"-", p.kegiatan||"-", p.koordinator||"-", p.peserta||0, p.deskripsi||"-", p.hasil||"-", p.fotoData ? "Ada Foto" : "Tanpa Foto"];
      return createJsonResponse({ success: true, result: appendRowToSheet("Pembiasaan", pRow) });
    }

    if (action === "saveGeniusClass") {
      var g = payload.data || payload;
      var gRow = [timestamp, g.date||"-", g.geniusClass||"-", g.subKegiatan||"-", g.bidangOsn||"-", g.topikOsnId||"-", (Array.isArray(g.lingkupMateri)?g.lingkupMateri.join(", "):"-"), (Array.isArray(g.kompetensiDasar)?g.kompetensiDasar.join(", "):"-"), g.pembina||"-", g.peserta||0, g.kegiatan||"-", g.hasil||"-", g.fotoData ? "Ada Foto" : "Tanpa Foto"];
      return createJsonResponse({ success: true, result: appendRowToSheet("GENIUS Class", gRow) });
    }

    if (action === "saveKombel") {
      var k = payload.data || payload;
      var kRow = [timestamp, k.date||"-", k.topik||"-", k.pemateri||"-", k.peserta||0, k.materi||"-", k.rtl||"-", k.fotoData ? "Ada Foto" : "Tanpa Foto"];
      return createJsonResponse({ success: true, result: appendRowToSheet("Kombel GENIUS", kRow) });
    }

    if (action === "saveSupervisi") {
      var s = payload.data || payload;
      var sRow = [timestamp, s.date||"-", s.guru||"-", s.mapel||"-", "Kelas " + (s.kelas||"-"), s.tahapan||"-", s.hasil||"-", s.tindakLanjut||"-", s.fotoData ? "Ada Foto" : "Tanpa Foto"];
      return createJsonResponse({ success: true, result: appendRowToSheet("Supervisi Guru", sRow) });
    }

    if (action === "saveSupervisiPengawas") {
      var sp = payload.data || payload;
      var spRow = [timestamp, sp.date||"-", sp.pengawas||"-", sp.nip||"-", sp.sasaran||"-", sp.aspekSupervisi||"-", sp.temuan||"-", sp.rekomendasi||"-", sp.tindakLanjut||"-", sp.fotoData ? "Ada Foto" : "Tanpa Foto"];
      return createJsonResponse({ success: true, result: appendRowToSheet("Supervisi Pengawas", spRow) });
    }

    if (action === "saveJurnalOrangTua") {
      var jot = payload.data || payload;
      var jotRow = [timestamp, jot.date||"-", jot.namaOrtu||"-", jot.namaAnak||"-", "Kelas " + (jot.kelas||"-"), jot.bangunPagi||"-", jot.ibadah||"-", jot.makanSehat||"-", jot.belajarMandiri||"-", jot.tidurCepat||"-", jot.pesanGuru||"-", jot.paraf ? "Diparaf" : "Belum", jot.fotoData ? "Ada Foto" : "Tanpa Foto"];
      return createJsonResponse({ success: true, result: appendRowToSheet("Jurnal Orang Tua", jotRow) });
    }

    if (action === "saveSevenHabits") {
      var sh = payload.data || payload;
      var shRow = [
        timestamp,
        sh.date || "-",
        sh.guru || "-",
        "Kelas " + (sh.kelas || "-"),
        sh.siswaCount || sh.jumlahSiswa || 0,
        sh.bangunPagi || "Terlaksana",
        sh.beribadah || "Terlaksana",
        sh.berolahraga || "Terlaksana",
        sh.makanSehat || "Terlaksana",
        sh.gemarBelajar || "Terlaksana",
        sh.bermasyarakat || "Terlaksana",
        sh.tidurCepat || "Terlaksana",
        sh.refleksi || sh.catatanRefleksi || "-",
        sh.rencanaLanjut || sh.tindakLanjut || "-",
        sh.fotoData ? "Ada Foto" : "Tanpa Foto"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("Seven Habits", shRow) });
    }

    // Master Akun Pengguna
    if (action === "saveAkun" || action === "saveAccount") {
      var acc = payload.data || payload.account || payload;
      var accRow = [acc.role||"Guru", acc.username||"-", acc.password||"-", acc.name||acc.username||"-", acc.nip||"-", acc.kelas||acc.deskripsi||"-"];
      return createJsonResponse({ success: true, result: appendRowToSheet("Akun Pengguna", accRow) });
    }

    // Perbarui Password Akun di Sheet 'Akun Pengguna'
    if (action === "updatePassword") {
      var targetUser = payload.username || (payload.data && payload.data.username);
      var targetNewPass = payload.newPassword || (payload.data && payload.data.newPassword);
      var accSheet = ss.getSheetByName("Akun Pengguna");
      if (!accSheet) return createJsonResponse({ success: false, message: "Sheet Akun Pengguna tidak ditemukan" });
      var lRow = accSheet.getLastRow();
      var found = false;
      if (lRow > 1) {
        var usernames = accSheet.getRange(2, 2, lRow - 1, 1).getValues();
        for (var j = 0; j < usernames.length; j++) {
          if (String(usernames[j][0]).trim().toLowerCase() === String(targetUser).trim().toLowerCase()) {
            accSheet.getRange(j + 2, 3).setValue(targetNewPass);
            found = true;
            break;
          }
        }
      }
      return createJsonResponse({ success: found, message: found ? "Password akun berhasil diperbarui di Spreadsheet" : "Username tidak ditemukan" });
    }

    // Hapus Akun dari Sheet 'Akun Pengguna'
    if (action === "deleteAccount") {
      var delUser = payload.username || (payload.data && payload.data.username);
      var accSheet = ss.getSheetByName("Akun Pengguna");
      if (!accSheet) return createJsonResponse({ success: false, message: "Sheet Akun Pengguna tidak ditemukan" });
      var lRow = accSheet.getLastRow();
      var foundDel = false;
      if (lRow > 1) {
        var uValues = accSheet.getRange(2, 2, lRow - 1, 1).getValues();
        for (var k = 0; k < uValues.length; k++) {
          if (String(uValues[k][0]).trim().toLowerCase() === String(delUser).trim().toLowerCase()) {
            accSheet.deleteRow(k + 2);
            foundDel = true;
            break;
          }
        }
      }
      return createJsonResponse({ success: foundDel, message: foundDel ? "Akun berhasil dihapus dari Spreadsheet" : "Username tidak ditemukan" });
    }

    if (action === "appendRow") {
      return createJsonResponse({ success: true, result: appendRowToSheet(payload.sheetName, payload.rowValues || []) });
    }

    return createJsonResponse({ success: false, message: "Action tidak didukung: " + action });
  } catch (err) {
    return createJsonResponse({ success: false, error: err.toString() });
  }
}`;

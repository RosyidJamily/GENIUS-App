import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileSpreadsheet,
  Database,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  getDatabaseConnectionInfo,
  checkSpreadsheetHealth,
  SPREADSHEET_URL,
  getActiveSpreadsheetId,
} from '../services/googleSheetsService';
import { DatabaseConnectionInfo } from '../types';

interface SpreadsheetStatusIndicatorProps {
  variant?: 'navbar' | 'card' | 'login' | 'badge';
  onOpenSettings?: () => void;
  className?: string;
}

export const SpreadsheetStatusIndicator: React.FC<SpreadsheetStatusIndicatorProps> = ({
  variant = 'navbar',
  onOpenSettings,
  className = '',
}) => {
  const [info, setInfo] = useState<DatabaseConnectionInfo>(getDatabaseConnectionInfo());
  const [isHovered, setIsHovered] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync state whenever custom event fires or on mount
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e?.detail) {
        setInfo(e.detail);
      } else {
        setInfo(getDatabaseConnectionInfo());
      }
    };

    window.addEventListener('database-connection-change', handleUpdate);

    // Initial check on mount
    const timer = setTimeout(() => {
      setInfo(getDatabaseConnectionInfo());
    }, 300);

    return () => {
      window.removeEventListener('database-connection-change', handleUpdate);
      clearTimeout(timer);
    };
  }, []);

  const handleQuickCheck = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsRefreshing(true);
    try {
      const updated = await checkSpreadsheetHealth();
      setInfo(updated);
    } catch {
      // handled inside helper
    } finally {
      setIsRefreshing(false);
    }
  };

  const isConnected = info.state === 'connected';
  const isChecking = info.state === 'checking' || isRefreshing;
  const isError = info.state === 'error';
  const isDisconnected = info.state === 'disconnected' && !isConnected;

  const spreadsheetId = info.spreadsheetId || getActiveSpreadsheetId();

  // VARIANT: NAVBAR
  if (variant === 'navbar') {
    return (
      <div className={`relative inline-block ${className}`}>
        <button
          type="button"
          onClick={onOpenSettings}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all border shadow-xs select-none ${
            isConnected
              ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 border-emerald-400/40 backdrop-blur-xs'
              : isChecking
              ? 'bg-sky-500/20 hover:bg-sky-500/30 text-sky-100 border-sky-400/40 backdrop-blur-xs'
              : isError
              ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 border-rose-400/40 backdrop-blur-xs'
              : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-100 border-amber-400/40 backdrop-blur-xs'
          }`}
          title="Klik untuk membuka Pengaturan Database Spreadsheet & Netlify"
        >
          {/* Animated Status Dot */}
          <span className="relative flex h-2 w-2 items-center justify-center">
            {isConnected && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            )}
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isConnected
                  ? 'bg-emerald-400'
                  : isChecking
                  ? 'bg-sky-400 animate-spin'
                  : isError
                  ? 'bg-rose-400'
                  : 'bg-amber-400'
              }`}
            ></span>
          </span>

          <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 opacity-90" />

          <span className="hidden sm:inline font-bold">
            {isConnected ? 'Spreadsheet Terhubung' : isChecking ? 'Memeriksa...' : isError ? 'Spreadsheet Terputus' : 'Database Spreadsheet'}
          </span>
          <span className="sm:hidden font-bold">
            {isConnected ? 'Spreadsheet Online' : isChecking ? 'Cek...' : 'Spreadsheet'}
          </span>

          {isConnected && (
            <span className="text-[10px] bg-emerald-400/30 text-emerald-100 px-1 rounded-sm uppercase tracking-wider font-extrabold hidden md:inline">
              Online
            </span>
          )}
        </button>

        {/* Hover / Tooltip Card */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-72 bg-white text-slate-800 rounded-2xl shadow-xl border-2 border-slate-200 p-3.5 z-50 text-left text-xs pointer-events-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Database className="w-4 h-4 text-[#6C63FF]" />
                  <span>Status Database Spreadsheet</span>
                </div>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isConnected
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isConnected ? 'TERHUBUNG' : 'MODE LOKAL'}
                </span>
              </div>

              <div className="space-y-1.5 text-[11px]">
                <p className="text-slate-600">
                  <strong className="text-slate-800 font-semibold">Target:</strong> SDN TAMANSARI
                </p>
                <p className="text-slate-500 font-mono text-[10px] truncate" title={spreadsheetId}>
                  ID: {spreadsheetId}
                </p>
                {info.lastSync && (
                  <p className="text-slate-500">
                    <strong className="text-slate-700 font-medium">Sinkron Terakhir:</strong> {info.lastSync}
                  </p>
                )}
                <p className="text-slate-500">
                  <strong className="text-slate-700 font-medium">Status:</strong> {info.message}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={SPREADSHEET_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Buka Sheet <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={onOpenSettings}
                  className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg text-[11px] font-bold hover:bg-indigo-700 transition-colors"
                >
                  Kelola Database
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // VARIANT: LOGIN PAGE
  if (variant === 'login') {
    return (
      <div
        className={`w-full p-3 rounded-2xl border-2 transition-all text-xs flex items-center justify-between gap-3 ${
          isConnected
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900 shadow-xs'
            : isChecking
            ? 'bg-sky-50/80 border-sky-200 text-sky-900'
            : isError
            ? 'bg-rose-50/80 border-rose-200 text-rose-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        } ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
              isConnected
                ? 'bg-emerald-500 text-white border-emerald-400'
                : 'bg-amber-400 text-white border-amber-300'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-extrabold text-[12px]">
                {isConnected ? 'Database Spreadsheet Terhubung' : 'Database Spreadsheet'}
              </span>
              <span className="relative flex h-2 w-2 items-center justify-center">
                {isConnected && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                ></span>
              </span>
            </div>
            <p className="text-[11px] opacity-80 truncate">
              {isConnected
                ? 'SDN Tamansari • Sinkronisasi otomatis aktif'
                : 'Belum terhubung • Klik untuk memasukkan Apps Script'}
            </p>
          </div>
        </div>

        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className={`shrink-0 px-3 py-1.5 rounded-xl font-bold text-[11px] border transition-all flex items-center gap-1 ${
              isConnected
                ? 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-100/60'
                : 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600'
            }`}
          >
            <span>{isConnected ? 'Cek Status' : 'Hubungkan'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  // VARIANT: DASHBOARD CARD (Modern 2D Flat Card)
  if (variant === 'card') {
    return (
      <div
        className={`w-full bg-white rounded-3xl border-2 p-5 sm:p-6 transition-all shadow-xs ${
          isConnected
            ? 'border-emerald-200/80 bg-gradient-to-br from-emerald-50/50 via-white to-indigo-50/20'
            : 'border-slate-200 bg-white'
        } ${className}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                isConnected
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500'
                  : 'bg-gradient-to-tr from-slate-600 to-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-slate-800 text-base">
                  Indikator Database Spreadsheet
                </h4>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>ONLINE & TERHUBUNG</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                    <span>MODE LOKAL (OFFLINE)</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {isConnected
                  ? 'Data guru, siswa, jurnal, pembiasaan & supervisi SDN Tamansari otomatis tersinkronisasi ke Google Spreadsheet.'
                  : 'Data saat ini tersimpan di memori browser lokal. Hubungkan ke Google Spreadsheet & Netlify agar aman dan realtime.'}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={handleQuickCheck}
              disabled={isRefreshing}
              className="px-3 py-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Periksa status koneksi ke Google Spreadsheet"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Menguji...' : 'Uji Koneksi'}</span>
            </button>

            {onOpenSettings && (
              <button
                type="button"
                onClick={onOpenSettings}
                className="px-3.5 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#584ee3] text-white text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Pengaturan Database</span>
              </button>
            )}
          </div>
        </div>

        {/* 2D Metrics & Sheet Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Spreadsheet Target
            </span>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-xs">SDN Tamansari</span>
              <a
                href={SPREADSHEET_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-bold text-[#6C63FF] hover:underline flex items-center gap-1"
              >
                Buka <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="font-mono text-[10px] text-slate-500 truncate mt-1">
              ID: {spreadsheetId}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Metode Koneksi
            </span>
            <span className="font-bold text-slate-800 text-xs block">
              {info.mode === 'apps_script'
                ? 'Google Apps Script Web App (Code.gs)'
                : info.mode === 'google_oauth'
                ? 'Google Sheets REST API (OAuth)'
                : 'Penyimpanan Lokal Browser'}
            </span>
            <p className="text-[10px] text-slate-500 mt-1 truncate">
              {isConnected ? 'Otomatis bypass CORS & siap Netlify' : 'Belum ada Web App URL'}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">
              Status Sinkronisasi
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className={`font-bold text-xs ${
                  isConnected ? 'text-emerald-700' : 'text-slate-700'
                }`}
              >
                {isConnected ? 'Siap Menerima Input' : 'Penyimpanan Lokal Aktif'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 truncate">
              {info.lastSync ? `Sinkron terakhir: ${info.lastSync}` : 'Semua form otomatis terhubung'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // VARIANT: BADGE (Minimalist)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
        isConnected
          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
      } ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {isConnected && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isConnected ? 'bg-emerald-500' : 'bg-amber-500'
          }`}
        ></span>
      </span>
      <span>{isConnected ? 'Spreadsheet Terhubung' : 'Spreadsheet: Mode Lokal'}</span>
    </span>
  );
};

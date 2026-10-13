import React from 'react';
import { User, AppNotification } from '../types';
import { GraduationCap, Bell, Video, UserCheck, ShieldCheck, Award, Settings, School, Database, Cloud, Trophy, HeartHandshake } from 'lucide-react';
import { SpreadsheetStatusIndicator } from './SpreadsheetStatusIndicator';

interface NavbarProps {
  user: User | null;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  onOpenTutorial: () => void;
  onAvatarClick: () => void;
  onOpenDatabaseModal?: () => void;
  isDatabaseConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  notifications,
  onOpenNotifications,
  onOpenTutorial,
  onAvatarClick,
  onOpenDatabaseModal,
  isDatabaseConnected = false,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-gradient-to-r from-[#6C63FF] via-[#7B73FF] to-[#8A85FF] text-white shadow-lg shadow-indigo-900/10">
      {/* Top micro bar */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between border-b border-white/10 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold tracking-wide">SDN Tamansari</span>
          <span className="opacity-40">•</span>
          <span className="text-[11px] opacity-85">Solusi Jenius Monitoring Terpadu</span>
        </div>
        <div className="flex items-center gap-2">
          {/* Database Spreadsheet Indicator */}
          <SpreadsheetStatusIndicator
            variant="navbar"
            onOpenSettings={onOpenDatabaseModal}
          />
          <button
            onClick={onOpenTutorial}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 transition-all text-xs font-medium backdrop-blur-xs border border-white/20"
          >
            <Video className="w-3.5 h-3.5" />
            <span>Tutorial</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">GENIUS</h1>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded-md text-white">
                v2.0
              </span>
            </div>
            <p className="text-xs text-indigo-100 font-medium">Monitoring & Administrasi Guru</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Notification Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2.5 rounded-2xl bg-white/15 hover:bg-white/25 transition-all text-white backdrop-blur-xs"
            aria-label="Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={onAvatarClick}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl bg-white/15 hover:bg-white/25 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-xl bg-white/90 text-[#6C63FF] overflow-hidden flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
              {user?.fotoUrl ? (
                <img src={user.fotoUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : user?.role === 'Pengawas' ? (
                <ShieldCheck className="w-5 h-5 text-sky-600" />
              ) : user?.role === 'Kepala Sekolah' ? (
                <ShieldCheck className="w-5 h-5 text-purple-700" />
              ) : user?.role === 'Pembina Ekskul' ? (
                <Trophy className="w-5 h-5 text-amber-600" />
              ) : user?.role === 'Murid' ? (
                <Award className="w-5 h-5 text-rose-600" />
              ) : user?.role === 'Orang Tua' ? (
                <HeartHandshake className="w-5 h-5 text-emerald-600" />
              ) : user?.role === 'Admin' ? (
                <Settings className="w-5 h-5 text-slate-700" />
              ) : (
                <GraduationCap className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-tight truncate max-w-[140px]">
                {user?.name || 'Pengguna GENIUS'}
              </p>
              <p className="text-[10px] text-indigo-100 font-medium flex items-center gap-1">
                <span>{user?.role || 'Guru'}</span>
                {user?.kelas && <span>• Kls {user.kelas.toUpperCase()}</span>}
              </p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

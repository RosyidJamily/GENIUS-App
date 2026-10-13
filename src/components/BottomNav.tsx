import React from 'react';
import {
  Home,
  LineChart,
  Plus,
  School,
  ClipboardCheck,
  GraduationCap,
  Award,
  FolderKanban,
  KeyRound,
  Trophy,
  HeartHandshake,
} from 'lucide-react';
import { UserRole } from '../types';

interface BottomNavProps {
  currentTab: string;
  role?: UserRole;
  onSelectTab: (tab: string) => void;
  onOpenQuickMenu: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  role = 'Guru',
  onSelectTab,
  onOpenQuickMenu,
}) => {
  const getNavItems = () => {
    if (role === 'Pengawas') {
      return [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'monitoring', label: 'Monitoring', icon: LineChart },
        { id: 'plus', label: '', icon: Plus, isAction: true },
        { id: 'supervisi-pengawas', label: 'Supervisi', icon: ClipboardCheck },
        { id: 'profil', label: 'Profil', icon: School },
      ];
    }

    if (role === 'Kepala Sekolah') {
      return [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'monitoring', label: 'Monitoring', icon: LineChart },
        { id: 'plus', label: '', icon: Plus, isAction: true },
        { id: 'supervisi', label: 'Supervisi', icon: ClipboardCheck },
        { id: 'profil', label: 'Profil', icon: School },
      ];
    }

    if (role === 'Pembina Ekskul') {
      return [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'genius-class', label: 'Ekskul', icon: Trophy },
        { id: 'plus', label: '', icon: Plus, isAction: true },
        { id: 'administrasi', label: 'Prestasi', icon: Award },
        { id: 'profil', label: 'Profil', icon: School },
      ];
    }

    if (role === 'Murid') {
      return [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'seven-habits', label: '7 Habits', icon: Award },
        { id: 'plus', label: '', icon: Plus, isAction: true },
        { id: 'genius-class', label: 'Ekskul', icon: Trophy },
        { id: 'profil', label: 'Sekolah', icon: School },
      ];
    }

    if (role === 'Orang Tua') {
      return [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'jurnal-orangtua', label: 'Jurnal Ortu', icon: HeartHandshake },
        { id: 'plus', label: '', icon: Plus, isAction: true },
        { id: 'seven-habits', label: '7 Habits', icon: Award },
        { id: 'profil', label: 'Sekolah', icon: School },
      ];
    }

    if (role === 'Admin') {
      return [
        { id: 'dashboard', label: 'Home', icon: Home },
        { id: 'monitoring', label: 'Monitoring', icon: LineChart },
        { id: 'plus', label: '', icon: Plus, isAction: true },
        { id: 'admin', label: 'Kelola User', icon: KeyRound },
        { id: 'profil', label: 'Profil', icon: School },
      ];
    }

    // Default: Guru
    return [
      { id: 'dashboard', label: 'Home', icon: Home },
      { id: 'jurnal', label: 'Jurnal', icon: GraduationCap },
      { id: 'plus', label: '', icon: Plus, isAction: true },
      { id: 'administrasi', label: 'Administrasi', icon: FolderKanban },
      { id: 'profil', label: 'Profil', icon: School },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 px-4 pb-3 pt-1 pointer-events-none">
      <div className="max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-slate-200/80 p-2 flex items-center justify-between pointer-events-auto">
        {navItems.map((item) => {
          if (item.isAction) {
            return (
              <div key="action-plus" className="relative -top-5 px-2">
                <button
                  onClick={onOpenQuickMenu}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#6C63FF] to-[#8A85FF] text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all"
                  aria-label="Input Cepat"
                  title="Menu Input Cepat"
                >
                  <Plus className="w-7 h-7" />
                </button>
              </div>
            );
          }

          const IconComponent = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex-1 py-1 flex flex-col items-center gap-1 transition-all rounded-2xl ${
                isActive
                  ? 'text-[#6C63FF] font-bold'
                  : 'text-slate-400 hover:text-slate-600 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive ? 'bg-[#6C63FF]/10 scale-110' : ''
                }`}
              >
                <IconComponent className="w-5 h-5" />
              </div>
              <span className="text-[11px] leading-none">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

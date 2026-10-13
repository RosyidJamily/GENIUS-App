/**
 * GENIUS - Monitoring Sekolah SDN Tamansari
 * Modern React TypeScript Application
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  User,
  ActivityItem,
  AppNotification,
  ProfilSekolah,
  TrafficStats,
  TutorialLink,
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
  SupervisiPengawasData,
  JurnalOrangTuaData,
} from './types';
import {
  getStoredItem,
  setStoredItem,
  initAppStorage,
  STORAGE_KEYS,
  INITIAL_PROFIL,
  INITIAL_TRAFFIC,
  INITIAL_ACTIVITIES,
  INITIAL_NOTIFICATIONS,
  INITIAL_TUTORIALS,
  INITIAL_SUPERVISIONS,
} from './data/initialData';

import { initGoogleAuth, setCachedAccessToken, signInWithGoogle, getAccessToken } from './services/googleAuth';
import {
  saveGeniusClassToSheet,
  saveJurnalMengajarToSheet,
  savePembiasaanToSheet,
  saveSupervisiToSheet,
  saveJadwalSupervisiToSheet,
  saveKombelToSheet,
  saveKejadianToSheet,
  saveKunjunganToSheet,
  saveInventarisToSheet,
  savePerkembanganToSheet,
  saveSevenHabitsToSheet,
  saveSupervisiPengawasToSheet,
  saveJurnalOrangTuaToSheet,
  isAppsScriptConfigured,
  checkSpreadsheetHealth,
} from './services/googleSheetsService';

import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { QuickMenuModal } from './components/QuickMenuModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CustomerServiceChat } from './components/CustomerServiceChat';
import { PasswordModal } from './components/PasswordModal';
import { Toast, ToastProps } from './components/Toast';
import { DatabaseSettingsModal } from './components/DatabaseSettingsModal';
import { syncJournalDeadlineNotifications } from './services/journalReminderService';

import { LoginView } from './views/LoginView';
import { DashboardView } from './views/DashboardView';
import { JurnalMengajarView } from './views/JurnalMengajarView';
import { SupervisiView } from './views/SupervisiView';
import { PembiasaanView } from './views/PembiasaanView';
import { SevenHabitsView } from './views/SevenHabitsView';
import { GeniusClassView } from './views/GeniusClassView';
import { KombelGeniusView } from './views/KombelGeniusView';
import { AdministrasiView } from './views/AdministrasiView';
import { MonitoringView } from './views/MonitoringView';
import { ProfilSekolahView } from './views/ProfilSekolahView';
import { TentangView } from './views/TentangView';
import { AdminView } from './views/AdminView';
import { SupervisiPengawasView } from './views/SupervisiPengawasView';
import { JurnalOrangTuaView } from './views/JurnalOrangTuaView';

export default function App() {
  // App State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState(false);

  // Google Sheets Integration State
  const [googleUser, setGoogleUser] = useState<any>(null);
  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(null);

  // Data State
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [profil, setProfil] = useState<ProfilSekolah>(INITIAL_PROFIL);
  const [tutorials, setTutorials] = useState<TutorialLink[]>([]);
  const [supervisions, setSupervisions] = useState<SupervisiData[]>([]);
  const [sevenHabits, setSevenHabits] = useState<SevenHabitsData[]>([]);
  const [traffic, setTraffic] = useState<TrafficStats>({
    todayVisits: 19,
    weekVisits: 85,
    monthVisits: 313,
    totalVisits: 1421,
    uniqueVisitors: 46,
  });

  // Toast State
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({
    isOpen: false,
    message: '',
    type: 'success',
  });

  // Initialize storage & session
  useEffect(() => {
    initAppStorage();

    const storedUser = getStoredItem<User | null>(STORAGE_KEYS.USER, null);
    if (storedUser) {
      setCurrentUser(storedUser);
    }

    const storedActivities = getStoredItem<ActivityItem[]>(
      STORAGE_KEYS.ACTIVITIES,
      INITIAL_ACTIVITIES
    );
    setActivities(storedActivities);

    const storedNotifications = getStoredItem<AppNotification[]>(
      STORAGE_KEYS.NOTIFICATIONS,
      INITIAL_NOTIFICATIONS
    );
    setNotifications(storedNotifications);

    const storedProfil = getStoredItem<ProfilSekolah>(
      STORAGE_KEYS.PROFIL,
      INITIAL_PROFIL
    );
    setProfil(storedProfil);

    const storedTutorials = getStoredItem<TutorialLink[]>(
      STORAGE_KEYS.TUTORIALS,
      INITIAL_TUTORIALS
    );
    setTutorials(storedTutorials);

    const storedSupervisions = getStoredItem<SupervisiData[]>(
      STORAGE_KEYS.SUPERVISIONS,
      INITIAL_SUPERVISIONS
    );
    setSupervisions(storedSupervisions);

    const storedSevenHabits = getStoredItem<SevenHabitsData[]>(
      STORAGE_KEYS.SEVEN_HABITS,
      []
    );
    setSevenHabits(storedSevenHabits);

    const storedTraffic = getStoredItem<TrafficStats>(STORAGE_KEYS.TRAFFIC, {
      todayVisits: 19,
      weekVisits: 85,
      monthVisits: 313,
      totalVisits: 1421,
      uniqueVisitors: 46,
    });
    setTraffic(storedTraffic);

    // Initialize Google Sheets Auth listener
    const unsubscribeGoogleAuth = initGoogleAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleAccessToken(token);
        setCachedAccessToken(token);
      },
      () => {
        setGoogleAccessToken(null);
        setCachedAccessToken(null);
      }
    );

    // Check and initialize spreadsheet database connection
    checkSpreadsheetHealth().catch(() => {});

    return () => {
      unsubscribeGoogleAuth();
    };
  }, []);

  // Sinkronisasi notifikasi pengingat batas waktu jurnal mengajar (Maksimal Jam 12 Siang)
  useEffect(() => {
    const updated = syncJournalDeadlineNotifications(currentUser);
    setNotifications(updated);
  }, [currentUser]);

  const showToast = (
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'success'
  ) => {
    setToast({
      isOpen: true,
      message,
      type,
    });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, isOpen: false }));
    }, 3500);
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch {
      // fallback
    }
  };

  // Login Handler
  const handleLoginSuccess = async (user: User) => {
    setCurrentUser(user);
    setStoredItem(STORAGE_KEYS.USER, user);
    setStoredItem(STORAGE_KEYS.LOGGED_IN, 'true');
    const token = await getAccessToken();
    if (token) {
      setGoogleAccessToken(token);
    }
    showToast(`Selamat Datang, ${user.name}!`, 'success');
  };

  // Logout Handler
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN);
    setCurrentTab('dashboard');
    showToast('Anda telah keluar dari aplikasi.', 'info');
  };

  // Add an activity record
  const addActivityRecord = (
    type: ActivityItem['type'],
    activityName: string,
    detail: string,
    user?: string
  ) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      type,
      activity: activityName,
      user: user || currentUser?.name || 'Bapak/Ibu Guru',
      detail,
    };

    const updated = [newAct, ...activities];
    setActivities(updated);
    setStoredItem(STORAGE_KEYS.ACTIVITIES, updated);
  };

  // Check Monitoring Access
  const handleOpenMonitoring = () => {
    if (currentUser?.role === 'Kepala Sekolah' || currentUser?.role === 'Admin') {
      setCurrentTab('monitoring');
    } else {
      setIsPasswordModalOpen(true);
    }
  };

  // Guarded tab navigation based on role
  const handleNavigateTab = (tab: string) => {
    if (currentUser?.role === 'Murid') {
      const allowedMuridTabs = ['dashboard', 'seven-habits', 'profil', 'tentang'];
      if (!allowedMuridTabs.includes(tab)) {
        showToast('Halaman ini khusus untuk Guru & Kepala Sekolah.', 'warning');
        setCurrentTab('seven-habits');
        return;
      }
    }
    if (currentUser?.role === 'Guru') {
      if (tab === 'admin') {
        showToast('Menu Manajemen Sistem khusus untuk Administrator.', 'warning');
        return;
      }
      if (tab === 'monitoring') {
        handleOpenMonitoring();
        return;
      }
    }
    if (currentUser?.role === 'Kepala Sekolah') {
      if (tab === 'admin') {
        showToast('Menu Manajemen Sistem khusus untuk Administrator.', 'warning');
        return;
      }
    }
    setCurrentTab(tab);
  };

  // Automatic background saver to Google Sheet & Apps Script
  const autoSaveToGoogleSheet = async (
    saveFn: (token: string) => Promise<void>,
    entityLabel: string
  ) => {
    // 1. Cek Google Apps Script Web App (Direkomendasikan untuk Netlify)
    if (isAppsScriptConfigured()) {
      try {
        await saveFn('');
        triggerConfetti();
        showToast(`${entityLabel} berhasil disimpan & otomatis masuk ke Google Spreadsheet!`, 'success');
        return;
      } catch (scriptErr: any) {
        console.error('Apps Script auto-save error:', scriptErr);
        showToast(`${entityLabel} tersimpan di lokal. (Google Sheet: ${scriptErr.message})`, 'warning');
        return;
      }
    }

    // 2. Jika belum ada Apps Script, coba lewat Google OAuth
    let token = googleAccessToken || (await getAccessToken());
    if (!token) {
      try {
        const authResult = await signInWithGoogle();
        if (authResult?.accessToken) {
          token = authResult.accessToken;
          setGoogleUser(authResult.user);
          setGoogleAccessToken(authResult.accessToken);
          setCachedAccessToken(authResult.accessToken);
        }
      } catch (authErr: any) {
        console.warn('Google Auth note:', authErr);
        showToast(`${entityLabel} tersimpan ke sistem lokal!`, 'success');
        return;
      }
    }

    if (token) {
      try {
        await saveFn(token);
        triggerConfetti();
        showToast(`${entityLabel} berhasil disimpan & otomatis masuk ke Google Sheet!`, 'success');
      } catch (err: any) {
        console.error('Google Sheet auto-save error:', err);
        showToast(`${entityLabel} tersimpan ke sistem. (Google Sheet: ${err.message})`, 'warning');
      }
    } else {
      showToast(`${entityLabel} tersimpan di lokal! Atur Apps Script di menu 'Spreadsheet & Netlify'.`, 'info');
    }
  };

  // Save Jurnal Mengajar
  const handleSaveJurnal = (data: JurnalMengajarData) => {
    const list = getStoredItem<JurnalMengajarData[]>(STORAGE_KEYS.JOURNALS, []);
    const updated = [{ ...data, id: `jrn-${Date.now()}` }, ...list];
    setStoredItem(STORAGE_KEYS.JOURNALS, updated);

    const absensiSummary = data.absensi
      ? ` • Hadir ${data.absensi.hadir}/${data.absensi.totalSiswa || 0}`
      : '';

    addActivityRecord(
      'jurnal',
      'Jurnal Mengajar',
      `Kelas ${data.kelas.toUpperCase()}${absensiSummary} • ${data.sessions.length} Sesi (${data.sessions
        .map((s) => s.mapel)
        .join(', ')})`,
      data.guru
    );

    autoSaveToGoogleSheet((token) => saveJurnalMengajarToSheet(data, token), 'Jurnal Mengajar');
    const updatedNotifs = syncJournalDeadlineNotifications(currentUser);
    setNotifications(updatedNotifs);
    triggerConfetti();
    setCurrentTab('dashboard');
  };

  // Save Supervisi
  const handleSaveSupervisi = (data: SupervisiData) => {
    const list = getStoredItem<SupervisiData[]>(STORAGE_KEYS.SUPERVISIONS, supervisions);
    const updated = [{ ...data, id: `sup-${Date.now()}` }, ...list];
    setSupervisions(updated);
    setStoredItem(STORAGE_KEYS.SUPERVISIONS, updated);

    addActivityRecord(
      'supervisi',
      'Supervisi Guru',
      `${data.tahapan.toUpperCase()} • ${data.guru} (Mapel: ${data.mapel})`,
      'Kepala Sekolah'
    );

    autoSaveToGoogleSheet((token) => saveSupervisiToSheet(data, token), 'Data Supervisi Guru');
    triggerConfetti();
    setCurrentTab('dashboard');
  };

  // Save Jadwal Supervisi
  const handleSaveJadwal = (data: JadwalSupervisiData) => {
    addActivityRecord(
      'supervisi',
      'Jadwal Supervisi',
      `Jadwal ${data.hari}, ${data.date} (${data.waktu}) • Guru: ${data.guru}`,
      'Pengawas'
    );

    autoSaveToGoogleSheet((token) => saveJadwalSupervisiToSheet(data, token), 'Jadwal Supervisi');
    setCurrentTab('dashboard');
  };

  // Save Pembiasaan
  const handleSavePembiasaan = (data: PembiasaanData) => {
    const list = getStoredItem<PembiasaanData[]>(STORAGE_KEYS.PEMBIASAAN, []);
    setStoredItem(STORAGE_KEYS.PEMBIASAAN, [data, ...list]);

    addActivityRecord(
      'pembiasaan',
      'Pembiasaan',
      `${data.kegiatan} • ${data.peserta} Siswa (Koordinator: ${data.koordinator})`,
      data.koordinator
    );

    autoSaveToGoogleSheet((token) => savePembiasaanToSheet(data, token), 'Jurnal Pembiasaan');
    triggerConfetti();
    setCurrentTab('dashboard');
  };

  // Save Seven Habits (7 Kebiasaan Anak Hebat)
  const handleSaveSevenHabits = (data: SevenHabitsData) => {
    const list = getStoredItem<SevenHabitsData[]>(STORAGE_KEYS.SEVEN_HABITS, []);
    const updated = [{ ...data, id: `sh-${Date.now()}` }, ...list];
    setSevenHabits(updated);
    setStoredItem(STORAGE_KEYS.SEVEN_HABITS, updated);

    addActivityRecord(
      'seven-habits',
      'Seven Habits',
      `Kelas ${data.kelas.toUpperCase()} • ${data.jumlahSiswa} Siswa (7 Kebiasaan Terpantau)`,
      data.guru
    );

    autoSaveToGoogleSheet((token) => saveSevenHabitsToSheet(data, token), 'Seven Habits');
    triggerConfetti();
    showToast('Jurnal Seven Habits berhasil disimpan & otomatis masuk ke Google Sheet!', 'success');
  };

  // Save GENIUS Class
  const handleSaveGeniusClass = (data: GeniusClassData) => {
    const list = getStoredItem<GeniusClassData[]>(STORAGE_KEYS.GENIUS_CLASS, []);
    setStoredItem(STORAGE_KEYS.GENIUS_CLASS, [data, ...list]);

    addActivityRecord(
      'genius-class',
      'GENIUS Class',
      `${data.geniusClass}${data.subKegiatan ? ` (${data.subKegiatan})` : ''} • ${
        data.peserta
      } Siswa`,
      data.pembina
    );

    autoSaveToGoogleSheet((token) => saveGeniusClassToSheet(data, token), 'Jurnal GENIUS Class');
    triggerConfetti();
    setCurrentTab('dashboard');
  };

  // Save Kombel GENIUS
  const handleSaveKombel = (data: KombelGeniusData) => {
    const list = getStoredItem<KombelGeniusData[]>(STORAGE_KEYS.KOMBEL, []);
    setStoredItem(STORAGE_KEYS.KOMBEL, [data, ...list]);

    addActivityRecord(
      'kombel',
      'Kombel GENIUS',
      `Topik: "${data.topik}" • Narasumber: ${data.pemateri} (${data.peserta} Guru)`,
      data.pemateri
    );

    autoSaveToGoogleSheet((token) => saveKombelToSheet(data, token), 'Kegiatan Kombel GENIUS');
    triggerConfetti();
    setCurrentTab('dashboard');
  };

  // Save Buku Kejadian
  const handleSaveKejadian = (data: BukuKejadianData) => {
    addActivityRecord(
      'buku-kejadian',
      'Buku Kejadian',
      `[${data.jenisKejadian}] ${data.namaSiswa} (Kelas ${data.kelas.toUpperCase()}) - ${
        data.deskripsi
      }`,
      currentUser?.name || 'Wali Kelas'
    );

    autoSaveToGoogleSheet((token) => saveKejadianToSheet(data, token), 'Catatan Buku Kejadian');
    setCurrentTab('dashboard');
  };

  // Save Buku Kunjungan
  const handleSaveKunjungan = (data: BukuKunjunganData) => {
    addActivityRecord(
      'buku-kunjungan',
      'Buku Kunjungan',
      `Tamu: ${data.namaPengunjung} (${data.instansi}) • Keperluan: ${data.keperluan}`,
      'Piket / Administrasi'
    );

    autoSaveToGoogleSheet((token) => saveKunjunganToSheet(data, token), 'Buku Kunjungan Tamu');
    setCurrentTab('dashboard');
  };

  // Save Buku Inventaris
  const handleSaveInventaris = (data: BukuInventarisData) => {
    addActivityRecord(
      'buku-inventaris',
      'Buku Inventaris',
      `Barang: ${data.namaBarang} (${data.jumlah} Unit) • Kondisi: ${data.kondisi}`,
      'Sarpras Sekolah'
    );

    autoSaveToGoogleSheet((token) => saveInventarisToSheet(data, token), 'Pencatatan Sarpras/Inventaris');
    setCurrentTab('dashboard');
  };

  // Save Buku Perkembangan
  const handleSavePerkembangan = (data: BukuPerkembanganData) => {
    addActivityRecord(
      'buku-perkembangan',
      'Perkembangan Siswa',
      `Aspek ${data.aspek} • Siswa: ${data.namaSiswa} (Kelas ${data.kelas.toUpperCase()})`,
      currentUser?.name || 'Wali Kelas'
    );

    autoSaveToGoogleSheet((token) => savePerkembanganToSheet(data, token), 'Catatan Perkembangan Siswa');
    setCurrentTab('dashboard');
  };

  // Save Supervisi Pengawas
  const handleSaveSupervisiPengawas = (data: SupervisiPengawasData) => {
    addActivityRecord(
      'supervisi-pengawas',
      'Supervisi Pengawas',
      `${data.aspekSupervisi} • Pengawas: ${data.pengawas} (Sasaran: ${data.sasaran})`,
      data.pengawas
    );

    autoSaveToGoogleSheet(
      (token) => saveSupervisiPengawasToSheet(data, token),
      'Supervisi Pengawas'
    );
    triggerConfetti();
    showToast('Supervisi Pengawas berhasil disimpan & masuk ke Google Spreadsheet!', 'success');
    setCurrentTab('dashboard');
  };

  // Save Jurnal Orang Tua
  const handleSaveJurnalOrangTua = (data: JurnalOrangTuaData) => {
    addActivityRecord(
      'jurnal-orangtua',
      'Jurnal Orang Tua',
      `Pendampingan Rumah: ${data.namaAnak} (${data.kelas.toUpperCase()}) • Wali: ${data.namaOrtu}`,
      data.namaOrtu
    );

    autoSaveToGoogleSheet(
      (token) => saveJurnalOrangTuaToSheet(data, token),
      'Jurnal Orang Tua'
    );
    triggerConfetti();
    showToast('Jurnal Orang Tua berhasil disimpan & masuk ke Google Spreadsheet!', 'success');
    setCurrentTab('dashboard');
  };

  // Update Profil
  const handleUpdateProfil = (updated: ProfilSekolah) => {
    setProfil(updated);
    setStoredItem(STORAGE_KEYS.PROFIL, updated);
    showToast('Profil sekolah berhasil diperbarui!', 'success');
  };

  // Add Tutorial Link
  const handleAddTutorial = (tut: Omit<TutorialLink, 'id' | 'timestamp'>) => {
    const newTut: TutorialLink = {
      ...tut,
      id: `tut-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    const updated = [newTut, ...tutorials];
    setTutorials(updated);
    setStoredItem(STORAGE_KEYS.TUTORIALS, updated);
    showToast('Link video tutorial berhasil ditambahkan!', 'success');
  };

  // Delete Tutorial Link
  const handleDeleteTutorial = (id: string) => {
    const updated = tutorials.filter((t) => t.id !== id);
    setTutorials(updated);
    setStoredItem(STORAGE_KEYS.TUTORIALS, updated);
    showToast('Link video tutorial berhasil dihapus', 'info');
  };

  // Delete an activity
  const handleDeleteActivity = (id: string) => {
    const updated = activities.filter((a) => a.id !== id);
    setActivities(updated);
    setStoredItem(STORAGE_KEYS.ACTIVITIES, updated);
    showToast('Riwayat aktivitas dihapus', 'info');
  };

  // Clear all activities
  const handleClearAllActivities = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus semua riwayat aktivitas?')) {
      setActivities([]);
      setStoredItem(STORAGE_KEYS.ACTIVITIES, []);
      showToast('Semua riwayat aktivitas telah dibersihkan', 'info');
    }
  };

  // Notifications
  const handleClearAllNotifications = () => {
    setNotifications([]);
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, []);
    showToast('Semua notifikasi dibersihkan', 'info');
  };

  const handleMarkNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  // Update user avatar
  const handleUpdateUserFoto = (base64: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, fotoUrl: base64 };
    setCurrentUser(updated);
    setStoredItem(STORAGE_KEYS.USER, updated);
    showToast('Foto profil berhasil diperbarui', 'success');
  };

  // Data sync handler from Google Spreadsheet
  const handleDataSynced = (data: Record<string, any[]>) => {
    console.log('Data synced from Google Spreadsheet:', data);
    showToast('Sinkronisasi data Google Spreadsheet berhasil!', 'success');
  };

  // If not logged in, render Login View
  if (!currentUser) {
    return (
      <>
        <Toast
          isOpen={toast.isOpen}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        />
        <LoginView
          onLoginSuccess={handleLoginSuccess}
          onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
        />
        <DatabaseSettingsModal
          isOpen={isDatabaseModalOpen}
          onClose={() => setIsDatabaseModalOpen(false)}
          onDataSynced={handleDataSynced}
          showToast={showToast}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FF] text-[#2D3748] flex flex-col antialiased selection:bg-[#6C63FF]/20 selection:text-[#6C63FF] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Alert */}
      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Top Header */}
      <Navbar
        user={currentUser}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        onOpenTutorial={() => setCurrentTab('tentang')}
        onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
        isDatabaseConnected={isAppsScriptConfigured() || Boolean(googleAccessToken)}
        onAvatarClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = (e: any) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
              if (typeof event.target?.result === 'string') {
                handleUpdateUserFoto(event.target.result);
              }
            };
            reader.readAsDataURL(file);
          };
          input.click();
        }}
      />

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClearAll={handleClearAllNotifications}
        onMarkAsRead={handleMarkNotificationAsRead}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {currentTab === 'dashboard' && (
          <DashboardView
            user={currentUser}
            traffic={traffic}
            activities={activities}
            onSelectTab={handleNavigateTab}
            onOpenMonitoring={handleOpenMonitoring}
            onDeleteActivity={handleDeleteActivity}
            onClearAllActivities={handleClearAllActivities}
            onLogout={handleLogout}
            onNotify={(msg, type) => showToast(msg, type as any)}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />
        )}

        {currentTab === 'admin' && (
          <AdminView
            onBack={() => setCurrentTab('dashboard')}
            onNavigateToTab={handleNavigateTab}
            onNotify={(msg, type) => showToast(msg, type as any)}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />
        )}

        {currentTab === 'jurnal' && (
          <JurnalMengajarView
            onBack={() => setCurrentTab('dashboard')}
            onSave={handleSaveJurnal}
          />
        )}

        {currentTab === 'supervisi' && (
          <SupervisiView
            onBack={() => setCurrentTab('dashboard')}
            onSaveSupervisi={handleSaveSupervisi}
            onSaveJadwal={handleSaveJadwal}
          />
        )}

        {currentTab === 'pembiasaan' && (
          <PembiasaanView
            onBack={() => setCurrentTab('dashboard')}
            onSave={handleSavePembiasaan}
          />
        )}

        {currentTab === 'seven-habits' && (
          <SevenHabitsView
            onBack={() => setCurrentTab('dashboard')}
            onSave={handleSaveSevenHabits}
            savedEntries={sevenHabits}
          />
        )}

        {currentTab === 'supervisi-pengawas' && (
          <SupervisiPengawasView
            user={currentUser}
            onBack={() => setCurrentTab('dashboard')}
            onSaveSupervisiPengawas={handleSaveSupervisiPengawas}
          />
        )}

        {currentTab === 'jurnal-orangtua' && (
          <JurnalOrangTuaView
            user={currentUser}
            onBack={() => setCurrentTab('dashboard')}
            onSaveJurnalOrangTua={handleSaveJurnalOrangTua}
          />
        )}

        {currentTab === 'genius-class' && (
          <GeniusClassView
            onBack={() => setCurrentTab('dashboard')}
            onSave={handleSaveGeniusClass}
          />
        )}

        {currentTab === 'kombel' && (
          <KombelGeniusView
            onBack={() => setCurrentTab('dashboard')}
            onSave={handleSaveKombel}
          />
        )}

        {currentTab === 'administrasi' && (
          <AdministrasiView
            onBack={() => setCurrentTab('dashboard')}
            onSaveKejadian={handleSaveKejadian}
            onSaveKunjungan={handleSaveKunjungan}
            onSaveInventaris={handleSaveInventaris}
            onSavePerkembangan={handleSavePerkembangan}
          />
        )}

        {currentTab === 'monitoring' && (
          <MonitoringView
            onBack={() => setCurrentTab('dashboard')}
            activities={activities}
            supervisions={supervisions}
            onRefresh={() => {
              const freshActivities = getStoredItem<ActivityItem[]>(
                STORAGE_KEYS.ACTIVITIES,
                activities
              );
              setActivities(freshActivities);
              showToast('Data monitoring telah diperbarui', 'info');
            }}
            onNotify={(msg, type) => showToast(msg, type as any)}
          />
        )}

        {currentTab === 'profil' && (
          <ProfilSekolahView
            profil={profil}
            onBack={() => setCurrentTab('dashboard')}
            onUpdateProfil={handleUpdateProfil}
          />
        )}

        {currentTab === 'tentang' && (
          <TentangView
            tutorials={tutorials}
            developerFoto={profil.pengembangFoto}
            onBack={() => setCurrentTab('dashboard')}
            onAddTutorial={handleAddTutorial}
            onDeleteTutorial={handleDeleteTutorial}
            onUpdateDeveloperFoto={(foto) => {
              handleUpdateProfil({ ...profil, pengembangFoto: foto });
            }}
          />
        )}
      </main>

      {/* Floating Center Quick Action Modal */}
      <QuickMenuModal
        isOpen={isQuickMenuOpen}
        role={currentUser?.role}
        onClose={() => setIsQuickMenuOpen(false)}
        onSelectTab={(tab) => {
          handleNavigateTab(tab);
        }}
      />

      {/* Password Modal for Kepala Sekolah */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSuccess={() => {
          setIsPasswordModalOpen(false);
          setCurrentTab('monitoring');
          showToast('Akses Monitoring Kepala Sekolah dibuka!', 'success');
        }}
      />

      {/* Interactive Customer Service Chat widget */}
      <CustomerServiceChat />

      {/* Floating Bottom Nav */}
      <BottomNav
        currentTab={currentTab}
        role={currentUser?.role}
        onSelectTab={(tab) => {
          handleNavigateTab(tab);
        }}
        onOpenQuickMenu={() => setIsQuickMenuOpen(true)}
      />

      {/* Database & Netlify Settings Modal */}
      <DatabaseSettingsModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
        onDataSynced={handleDataSynced}
        showToast={showToast}
      />
    </div>
  );
}

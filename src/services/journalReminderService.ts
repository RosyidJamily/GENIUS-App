/**
 * Service Pengingat & Notifikasi Batas Waktu Jurnal Mengajar (Maksimal Jam 12 Siang)
 * SDN Tamansari - GENIUS App
 */

import { AppNotification, JurnalMengajarData, User } from '../types';
import { GURU_LIST, getStoredItem, setStoredItem } from '../data/initialData';

const STORAGE_KEYS = {
  NOTIFICATIONS: 'genius_notifications',
  JOURNALS: 'genius_journals',
};

export interface JournalStatusReport {
  todayDate: string;
  todayFormatted: string;
  currentHour: number;
  currentMinute: number;
  isPast12: boolean;
  totalTeachers: number;
  submittedTeachers: string[];
  unsubmittedTeachers: string[];
  completionPercentage: number;
  hasCurrentUserSubmitted: boolean;
  currentUserJournal?: JurnalMengajarData;
}

export const getIndonesianDateString = (dateObj: Date = new Date()): string => {
  return dateObj.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Mendapatkan status pengisian jurnal hari ini dengan dukungan simulasi jam
 */
export const checkTodayJournalStatus = (
  currentUser: User | null,
  simulatedHour?: number | null
): JournalStatusReport => {
  const now = new Date();
  const todayDate = now.toISOString().split('T')[0];
  const todayFormatted = getIndonesianDateString(now);

  const hour = simulatedHour !== undefined && simulatedHour !== null ? simulatedHour : now.getHours();
  const minute = now.getMinutes();
  const isPast12 = hour >= 12;

  const journals = getStoredItem<JurnalMengajarData[]>(STORAGE_KEYS.JOURNALS, []);
  
  // Ambil jurnal hari ini
  const todayJournals = journals.filter((j) => j.date === todayDate);

  // Normalisasi nama guru untuk pencocokan yang akurat
  const submittedSet = new Set<string>();
  todayJournals.forEach((j) => {
    if (j.guru) {
      submittedSet.add(j.guru.trim().toLowerCase());
    }
  });

  const submittedTeachers: string[] = [];
  const unsubmittedTeachers: string[] = [];

  GURU_LIST.forEach((guruName) => {
    const normalized = guruName.trim().toLowerCase();
    const isSubmitted = Array.from(submittedSet).some(
      (submitted) => submitted.includes(normalized) || normalized.includes(submitted)
    );

    if (isSubmitted) {
      submittedTeachers.push(guruName);
    } else {
      unsubmittedTeachers.push(guruName);
    }
  });

  // Cek apakah user yang login saat ini sudah mengisi
  let hasCurrentUserSubmitted = false;
  let currentUserJournal: JurnalMengajarData | undefined;

  if (currentUser) {
    const userNorm = currentUser.name.trim().toLowerCase();
    const match = todayJournals.find((j) => {
      const gNorm = (j.guru || '').trim().toLowerCase();
      return (
        gNorm.includes(userNorm) ||
        userNorm.includes(gNorm) ||
        (currentUser.role === 'Guru' && todayJournals.length > 0)
      );
    });

    if (match) {
      hasCurrentUserSubmitted = true;
      currentUserJournal = match;
    }
  }

  const totalTeachers = GURU_LIST.length;
  const completionPercentage =
    totalTeachers > 0 ? Math.round((submittedTeachers.length / totalTeachers) * 100) : 0;

  return {
    todayDate,
    todayFormatted,
    currentHour: hour,
    currentMinute: minute,
    isPast12,
    totalTeachers,
    submittedTeachers,
    unsubmittedTeachers,
    completionPercentage,
    hasCurrentUserSubmitted,
    currentUserJournal,
  };
};

/**
 * Sinkronisasi notifikasi pengingat jurnal mengajar (Maksimal Jam 12 Siang)
 */
export const syncJournalDeadlineNotifications = (
  currentUser: User | null,
  simulatedHour?: number | null
): AppNotification[] => {
  const status = checkTodayJournalStatus(currentUser, simulatedHour);
  const currentNotifs = getStoredItem<AppNotification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
  
  const timeStr = `${String(status.currentHour).padStart(2, '0')}:${String(
    status.currentMinute
  ).padStart(2, '0')}`;

  const notifIdGuruOverdue = `notif-jurnal-overdue-${status.todayDate}`;
  const notifIdGuruReminder = `notif-jurnal-reminder-${status.todayDate}`;
  const notifIdKsReport = `notif-ks-jurnal-${status.todayDate}`;

  let updatedNotifs = [...currentNotifs];

  // 1. Logika untuk Guru
  if (!currentUser || currentUser.role === 'Guru') {
    if (!status.hasCurrentUserSubmitted) {
      if (status.isPast12) {
        // LEWAT JAM 12 SIANG: Berikan peringatan keras bahwa batas waktu telah lewat!
        const existingIdx = updatedNotifs.findIndex((n) => n.id === notifIdGuruOverdue);
        const warningNotif: AppNotification = {
          id: notifIdGuruOverdue,
          title: '⚠️ Peringatan: Jurnal Mengajar Belum Diisi!',
          message: `Batas pengisian jurnal mengajar maksimal pukul 12:00 siang telah terlewati. Mohon segera melengkapi jurnal pembelajaran & presensi siswa hari ini (${status.todayFormatted}).`,
          time: timeStr,
          timestamp: new Date().toISOString(),
          type: 'warning',
          read: false,
        };

        if (existingIdx >= 0) {
          // Tetap pertahankan jika ada, refresh pesan
          updatedNotifs[existingIdx] = { ...updatedNotifs[existingIdx], message: warningNotif.message };
        } else {
          updatedNotifs = [warningNotif, ...updatedNotifs];
        }
      } else {
        // SEBELUM JAM 12 SIANG: Berikan pengingat batas waktu jam 12
        const existingIdx = updatedNotifs.findIndex((n) => n.id === notifIdGuruReminder);
        if (existingIdx < 0) {
          const reminderNotif: AppNotification = {
            id: notifIdGuruReminder,
            title: '⏰ Pengingat: Jurnal Mengajar Hari Ini',
            message: `Batas akhir pengisian jurnal mengajar hari ini adalah pukul 12:00 siang. Jangan lupa input materi dan absensi siswa Anda.`,
            time: timeStr,
            timestamp: new Date().toISOString(),
            type: 'info',
            read: false,
          };
          updatedNotifs = [reminderNotif, ...updatedNotifs];
        }
      }
    } else {
      // Guru sudah mengisi: tandai notif pengingat/overdue sebagai read
      updatedNotifs = updatedNotifs.map((n) => {
        if (n.id === notifIdGuruOverdue || n.id === notifIdGuruReminder) {
          return { ...n, read: true };
        }
        return n;
      });
    }
  }

  // 2. Logika untuk Kepala Sekolah
  if (currentUser?.role === 'Kepala Sekolah') {
    if (status.isPast12 && status.unsubmittedTeachers.length > 0) {
      const existingIdx = updatedNotifs.findIndex((n) => n.id === notifIdKsReport);
      const ksNotif: AppNotification = {
        id: notifIdKsReport,
        title: `⚠️ Monitoring Jam 12: ${status.unsubmittedTeachers.length} Guru Belum Isi Jurnal`,
        message: `Pukul 12:00 siang telah terlewati. Terdapat ${status.unsubmittedTeachers.length} guru belum mengisi jurnal mengajar hari ini: ${status.unsubmittedTeachers.slice(0, 3).join(', ')}${status.unsubmittedTeachers.length > 3 ? '...' : ''}.`,
        time: timeStr,
        timestamp: new Date().toISOString(),
        type: 'warning',
        read: false,
      };

      if (existingIdx >= 0) {
        updatedNotifs[existingIdx] = { ...updatedNotifs[existingIdx], message: ksNotif.message };
      } else {
        updatedNotifs = [ksNotif, ...updatedNotifs];
      }
    }
  }

  setStoredItem(STORAGE_KEYS.NOTIFICATIONS, updatedNotifs);
  return updatedNotifs;
};

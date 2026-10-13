import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  ArrowRight,
  Send,
  Users,
  Calendar,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  UserX,
  UserCheck,
} from 'lucide-react';
import { User, JurnalMengajarData } from '../types';
import {
  checkTodayJournalStatus,
  JournalStatusReport,
} from '../services/journalReminderService';

interface JournalDeadlineAlertBannerProps {
  user: User | null;
  onGoToJournal: () => void;
  onGoToMonitoring?: () => void;
  onNotify?: (msg: string, type: 'info' | 'success' | 'warning') => void;
}

export const JournalDeadlineAlertBanner: React.FC<JournalDeadlineAlertBannerProps> = ({
  user,
  onGoToJournal,
  onGoToMonitoring,
  onNotify,
}) => {
  // Mode simulasi jam (null = pakai jam perangkat asli, number = simulasi)
  const [simulatedHour, setSimulatedHour] = useState<number | null>(null);
  const [showSimulateMenu, setShowSimulateMenu] = useState(false);

  const status: JournalStatusReport = checkTodayJournalStatus(user, simulatedHour);

  const toggleSimulation = (hour: number | null) => {
    setSimulatedHour(hour);
    if (hour === 13) {
      onNotify?.('Mode simulasi aktif: Pukul 13:00 WIB (Melewati batas jam 12 siang)', 'warning');
    } else if (hour === 9) {
      onNotify?.('Mode simulasi aktif: Pukul 09:00 WIB (Pagi hari sebelum jam 12 siang)', 'info');
    } else {
      onNotify?.('Kembali ke jam perangkat waktu nyata (real-time)', 'info');
    }
  };

  const handleSendWaReminderToAll = () => {
    if (status.unsubmittedTeachers.length === 0) return;
    const text = encodeURIComponent(
      `*PEMBERITAHUAN KEPALA SEKOLAH - SDN TAMANSARI*\n\n` +
      `Bapak/Ibu Guru yang kami hormati,\n` +
      `Mengingatkan kembali bahwa batas pengisian *Jurnal Mengajar Harian* maksimal adalah *pukul 12:00 siang*.\n\n` +
      `Mohon bagi yang belum melengkapi jurnal hari ini (${status.todayFormatted}) untuk segera mengisi melalui aplikasi GENIUS App.\n\n` +
      `Terima kasih atas dedikasi dan kerja sama Bapak/Ibu Guru.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const isTeacher = !user || user.role === 'Guru';
  const isPrincipal = user?.role === 'Kepala Sekolah';

  return (
    <div className="space-y-2">
      {/* Simulation Bar (Discreet & helpful for testing deadline jam 12 siang) */}
      <div className="flex items-center justify-between px-1 text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-indigo-500" />
          <span>Batas Waktu Jurnal: <strong>Pukul 12:00 WIB Siang</strong></span>
          <span className="opacity-40">•</span>
          <span className="text-slate-600 font-bold">
            {status.todayFormatted} (Pk {String(status.currentHour).padStart(2, '0')}:{String(status.currentMinute).padStart(2, '0')} WIB)
          </span>
        </div>

        {/* Quick simulation tester toggle */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-400 hidden sm:inline">Uji Notifikasi:</span>
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200 text-[10px] font-semibold">
            <button
              onClick={() => toggleSimulation(null)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                simulatedHour === null
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Jam Asli
            </button>
            <button
              onClick={() => toggleSimulation(9)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                simulatedHour === 9
                  ? 'bg-white text-indigo-600 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              09:00 (Pagi)
            </button>
            <button
              onClick={() => toggleSimulation(13)}
              className={`px-2 py-0.5 rounded-lg transition-all ${
                simulatedHour === 13
                  ? 'bg-rose-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              13:00 (&gt;12 Siang)
            </button>
          </div>
        </div>
      </div>

      {/* Main Alert Component for GURU */}
      {isTeacher && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-5 sm:p-6 border transition-all shadow-md overflow-hidden relative ${
            status.hasCurrentUserSubmitted
              ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border-emerald-200'
              : status.isPast12
              ? 'bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-white border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-gradient-to-r from-indigo-500/10 via-blue-500/5 to-white border-indigo-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start sm:items-center gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  status.hasCurrentUserSubmitted
                    ? 'bg-emerald-500 text-white'
                    : status.isPast12
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {status.hasCurrentUserSubmitted ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : status.isPast12 ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <Clock className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      status.hasCurrentUserSubmitted
                        ? 'bg-emerald-100 text-emerald-800'
                        : status.isPast12
                        ? 'bg-rose-100 text-rose-800 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {status.hasCurrentUserSubmitted
                      ? 'Sudah Terisi Tepat Waktu'
                      : status.isPast12
                      ? 'Melewati Batas Pukul 12:00 Siang'
                      : 'Batas Pengisian Pukul 12:00 Siang'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Hari ini: {status.todayFormatted}
                  </span>
                </div>

                <h3
                  className={`text-base sm:text-lg font-black tracking-tight ${
                    status.hasCurrentUserSubmitted
                      ? 'text-emerald-950'
                      : status.isPast12
                      ? 'text-rose-950'
                      : 'text-indigo-950'
                  }`}
                >
                  {status.hasCurrentUserSubmitted
                    ? 'Jurnal Mengajar Hari Ini Sudah Lengkap!'
                    : status.isPast12
                    ? '⚠️ Perhatian: Anda Belum Mengisi Jurnal Mengajar Hari Ini!'
                    : 'Pengingat: Isi Jurnal Mengajar & Absensi Siswa'}
                </h3>

                <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                  {status.hasCurrentUserSubmitted ? (
                    <>
                      Terima kasih! Jurnal pembelajaran dan kehadiran siswa telah tersimpan.
                      {status.currentUserJournal && (
                        <span className="font-semibold text-emerald-800 ml-1">
                          (Kelas {status.currentUserJournal.kelas.toUpperCase()} •{' '}
                          {status.currentUserJournal.sessions?.length || 0} Sesi • Hadir:{' '}
                          {status.currentUserJournal.absensi?.hadir || 0}/
                          {status.currentUserJournal.absensi?.totalSiswa || 0})
                        </span>
                      )}
                    </>
                  ) : status.isPast12 ? (
                    <>
                      Batas waktu pengisian maksimal <strong>pukul 12:00 siang</strong> telah terlewati. Mohon Bapak/Ibu Guru segera melengkapi jurnal mengajar dan data kehadiran siswa sekarang agar kegiatan pembelajaran tercatat.
                    </>
                  ) : (
                    <>
                      Batas maksimal pengisian jurnal mengajar harian adalah <strong>pukul 12:00 siang WIB</strong>. Segera catat sesi materi dan presensi sebelum batas waktu.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onGoToJournal}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
                  status.hasCurrentUserSubmitted
                    ? 'bg-white hover:bg-slate-50 text-emerald-700 border border-emerald-200'
                    : status.isPast12
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/25 ring-2 ring-rose-400'
                    : 'bg-[#6C63FF] hover:bg-[#5a52e0] text-white shadow-indigo-600/25'
                }`}
              >
                <span>
                  {status.hasCurrentUserSubmitted ? 'Lihat / Tambah Sesi' : 'Isi Jurnal Sekarang'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Alert Component for KEPALA SEKOLAH */}
      {isPrincipal && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-5 sm:p-6 border transition-all shadow-md overflow-hidden relative ${
            status.unsubmittedTeachers.length === 0
              ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-white border-emerald-200'
              : status.isPast12
              ? 'bg-gradient-to-r from-rose-500/15 via-amber-500/10 to-white border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-gradient-to-r from-indigo-500/10 via-blue-500/5 to-white border-indigo-200'
          }`}
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
            <div className="flex items-start gap-3.5">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  status.unsubmittedTeachers.length === 0
                    ? 'bg-emerald-500 text-white'
                    : status.isPast12
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {status.unsubmittedTeachers.length === 0 ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider ${
                      status.unsubmittedTeachers.length === 0
                        ? 'bg-emerald-100 text-emerald-800'
                        : status.isPast12
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {status.unsubmittedTeachers.length === 0
                      ? '100% Guru Sudah Mengisi'
                      : status.isPast12
                      ? `⚠️ Batas Jam 12 Siang Terlewati (${status.unsubmittedTeachers.length} Guru Belum)`
                      : `Monitoring Jurnal Hari Ini (Batas Jam 12 Siang)`}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {status.todayFormatted}
                  </span>
                </div>

                <h3
                  className={`text-base sm:text-lg font-black tracking-tight ${
                    status.unsubmittedTeachers.length === 0
                      ? 'text-emerald-950'
                      : status.isPast12
                      ? 'text-rose-950'
                      : 'text-indigo-950'
                  }`}
                >
                  {status.unsubmittedTeachers.length === 0
                    ? 'Seluruh Guru Telah Mengisi Jurnal Mengajar Hari Ini'
                    : status.isPast12
                    ? `Perhatian: ${status.unsubmittedTeachers.length} dari ${status.totalTeachers} Guru Belum Mengisi Jurnal Mengajar`
                    : `Status Jurnal Guru: ${status.submittedTeachers.length}/${status.totalTeachers} Guru Telah Mengisi`}
                </h3>

                <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                  {status.isPast12 && status.unsubmittedTeachers.length > 0 ? (
                    <>
                      Waktu telah melewati batas maksimal pukul <strong>12:00 siang WIB</strong>. Berikut guru yang belum mengirimkan jurnal mengajar hari ini:
                    </>
                  ) : (
                    <>
                      Progres pengisian jurnal harian sebelum batas pukul 12:00 siang. Pantau kepatuhan pengisian jurnal dan presensi siswa secara real-time.
                    </>
                  )}
                </p>

                {/* List of unsubmitted teachers badges */}
                {status.unsubmittedTeachers.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5 max-w-2xl">
                    {status.unsubmittedTeachers.map((guru) => (
                      <span
                        key={guru}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[11px]"
                      >
                        <UserX className="w-3 h-3 text-rose-500" />
                        <span>{guru}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons for Kepala Sekolah */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto shrink-0">
              {status.unsubmittedTeachers.length > 0 && (
                <button
                  onClick={handleSendWaReminderToAll}
                  className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                  title="Kirim pesan broadcast pengingat ke WhatsApp Guru"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ingatkan via WA</span>
                </button>
              )}

              {onGoToMonitoring && (
                <button
                  onClick={onGoToMonitoring}
                  className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Buka Rekap Monitoring</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

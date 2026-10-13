export type UserRole =
  | 'Pengawas'
  | 'Kepala Sekolah'
  | 'Guru'
  | 'Pembina Ekskul'
  | 'Murid'
  | 'Orang Tua'
  | 'Admin';

export interface User {
  username: string;
  name: string;
  role: UserRole;
  password?: string;
  kelas?: string;
  nip?: string;
  fotoUrl?: string;
  message?: string;
}

export interface UserAccount {
  username: string;
  name: string;
  role: UserRole;
  password: string;
  deskripsi: string;
  kelas?: string;
  nip?: string;
  fotoUrl?: string;
}

export type ActivityType =
  | 'supervisi'
  | 'supervisi-pengawas'
  | 'jurnal'
  | 'jurnal-orangtua'
  | 'pembiasaan'
  | 'seven-habits'
  | 'genius-class'
  | 'kombel'
  | 'buku-kejadian'
  | 'buku-kunjungan'
  | 'buku-inventaris'
  | 'buku-perkembangan';

export interface ActivityItem {
  id: string;
  timestamp: string;
  time: string;
  type: ActivityType;
  activity: string;
  user: string;
  detail: string;
}

export interface TeachingSession {
  waktu: string;
  mapel: string;
  materi: string;
}

export type TeachingMood = 'senang' | 'biasa' | 'lelah' | 'semangat' | '';

export interface StudentAttendance {
  totalSiswa?: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  siswaTidakHadir?: string;
}

export interface JurnalMengajarData {
  id?: string;
  timestamp?: string;
  date: string;
  guru: string;
  kelas: string;
  sessions: TeachingSession[];
  absensi?: StudentAttendance;
  kendala?: string;
  rencana?: string;
  mood?: TeachingMood;
  fotoData?: string;
}

export interface AssessmentItem {
  indicator: string;
  score: number; // 1-4
  note?: string;
}

export interface PraObservasiData {
  items: AssessmentItem[];
  notes?: string;
}

export interface ObservasiData {
  items: AssessmentItem[];
  notes?: string;
}

export interface PascaObservasiData {
  hasil: string;
  tindakLanjut: string;
  kesimpulan: string;
}

export interface SupervisiData {
  id?: string;
  timestamp?: string;
  date: string;
  guru: string;
  mapel: string;
  kelas: string;
  tahapan: 'pra-observasi' | 'observasi' | 'pasca-observasi';
  hasil: string;
  tindakLanjut: string;
  praObservasi?: PraObservasiData;
  observasi?: ObservasiData;
  pascaObservasi?: PascaObservasiData;
  fotoData?: string;
}

export interface JadwalSupervisiData {
  id?: string;
  timestamp?: string;
  date: string;
  hari: string;
  waktu: string;
  guru: string;
  kelas: string;
  pengawas: string;
}

export interface PembiasaanData {
  id?: string;
  timestamp?: string;
  date: string;
  kegiatan: string;
  koordinator: string;
  peserta: number;
  deskripsi: string;
  hasil: string;
  fotoData?: string;
}

export interface HabitCheckItem {
  id: string; // 'bangun-pagi' | 'beribadah' | 'berolahraga' | 'makan-sehat' | 'gemar-belajar' | 'bermasyarakat' | 'tidur-cepat'
  name: string;
  tagline: string;
  status: 'sangat_baik' | 'baik' | 'cukup' | 'perlu_bimbingan';
  persentase?: number;
  jumlahSiswa?: number;
  catatan?: string;
}

export interface SevenHabitsData {
  id?: string;
  timestamp?: string;
  date: string;
  guru: string;
  kelas: string;
  jumlahSiswa: number;
  habits: HabitCheckItem[];
  catatanRefleksi?: string;
  tindakLanjut?: string;
  fotoData?: string;
}

export interface GeniusClassData {
  id?: string;
  timestamp?: string;
  date: string;
  geniusClass: string;
  subKegiatan?: string;
  bidangOsn?: 'Matematika' | 'IPA' | 'IPS' | string;
  topikOsnId?: string;
  lingkupMateri?: string[];
  kompetensiDasar?: string[];
  pembina: string;
  peserta: number;
  kegiatan: string;
  hasil: string;
  fotoData?: string;
}

export interface KombelGeniusData {
  id?: string;
  timestamp?: string;
  date: string;
  topik: string;
  pemateri: string;
  peserta: number;
  materi: string;
  praktikBaik: string;
  fotoData?: string;
}

export interface BukuKejadianData {
  id?: string;
  timestamp?: string;
  date: string;
  namaSiswa: string;
  kelas: string;
  jenisKejadian: 'Prestasi' | 'Pelanggaran' | 'Kecelakaan' | 'Kesehatan' | 'Lainnya';
  deskripsi: string;
  tindakan: string;
  fotoData?: string;
}

export interface BukuKunjunganData {
  id?: string;
  timestamp?: string;
  date: string;
  namaPengunjung: string;
  instansi: string;
  keperluan: string;
  bertemu: string;
  keterangan: string;
  fotoData?: string;
}

export interface BukuInventarisData {
  id?: string;
  timestamp?: string;
  date: string;
  namaBarang: string;
  kodeBarang: string;
  jumlah: number;
  kondisi: 'Baik' | 'Rusak Ringan' | 'Rusak Berat' | 'Hilang';
  lokasi: string;
  keterangan: string;
  fotoData?: string;
}

export interface BukuPerkembanganData {
  id?: string;
  timestamp?: string;
  date: string;
  namaSiswa: string;
  kelas: string;
  aspek: 'Akademik' | 'Sikap' | 'Keterampilan' | 'Sosial' | 'Emosional';
  deskripsi: string;
  tindakLanjut: string;
  fotoData?: string;
}

export interface ProfilSekolah {
  namaSekolah: string;
  jenisSekolah: string;
  kepalaSekolah?: string;
  npsn: string;
  alamat: string;
  telepon: string;
  email: string;
  jumlahGuru: string;
  jumlahSiswa: string;
  jumlahProgramEkstra: string;
  visiSekolah: string;
  logoUrl?: string;
  pengembangFoto?: string;
}

export interface TutorialLink {
  id: string;
  platform: 'youtube' | 'tiktok' | 'instagram';
  judul: string;
  link: string;
  timestamp: string;
  author: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
  read: boolean;
}

export interface TrafficStats {
  todayVisits: number;
  weekVisits: number;
  monthVisits: number;
  totalVisits: number;
  uniqueVisitors: number;
}

export type DatabaseConnectionState = 'connected' | 'checking' | 'disconnected' | 'error';

export interface DatabaseConnectionInfo {
  state: DatabaseConnectionState;
  message: string;
  spreadsheetId: string;
  spreadsheetTitle?: string;
  lastChecked?: string;
  lastSync?: string;
  mode?: 'apps_script' | 'google_oauth' | 'offline';
}

export interface SupervisiPengawasData {
  id: string;
  timestamp: string;
  date: string;
  pengawas: string;
  nip: string;
  sasaran: string; // 'Kepala Sekolah' | 'Guru Kelas / Mapel' | 'Tenaga Kependidikan' | 'Manajemen Sekolah'
  aspekSupervisi: string;
  temuan: string;
  rekomendasi: string;
  tindakLanjut: string;
  fotoData?: string;
}

export interface JurnalOrangTuaData {
  id: string;
  timestamp: string;
  date: string;
  namaOrtu: string;
  namaAnak: string;
  kelas: string;
  bangunPagi: string;
  ibadah: string;
  makanSehat: string;
  belajarMandiri: string;
  tidurCepat: string;
  pesanGuru: string;
  paraf: boolean;
  fotoData?: string;
}

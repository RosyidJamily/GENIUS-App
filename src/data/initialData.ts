import {
  ActivityItem,
  AppNotification,
  ProfilSekolah,
  SupervisiData,
  SupervisiPengawasData,
  JurnalOrangTuaData,
  SevenHabitsData,
  TrafficStats,
  TutorialLink,
  User,
  UserAccount,
} from '../types';

export const GURU_LIST = [
  'Ike Novi Pristiwati, S.Pd',
  'Novia Rahmawati, S.Pd',
  'Lailatul Novida, S.Pd',
  "I'anatul Wachdiyah, S.Pd",
  'Intan Kartini, S.Pd',
  'Lila Fitriali, S.Pd',
  'Alfina Muliati, S.Pd',
  'Wahyu Dwi Maulida, S.Pd',
  "Rif'an, S.Pd.I",
  'May Syta Hariyanti, S.Pd.SD',
  'Muhammad Hasan Bisri, S.Pd',
];

export const KELAS_LIST = [
  { value: '1', label: 'Kelas 1' },
  { value: '2a', label: 'Kelas 2A' },
  { value: '2b', label: 'Kelas 2B' },
  { value: '3a', label: 'Kelas 3A' },
  { value: '3b', label: 'Kelas 3B' },
  { value: '4a', label: 'Kelas 4A' },
  { value: '4b', label: 'Kelas 4B' },
  { value: '5', label: 'Kelas 5' },
  { value: '6', label: 'Kelas 6' },
];

export const MAPEL_LIST = [
  'Pendidikan Agama Islam dan Budi Pekerti',
  'Pendidikan Pancasila',
  'Bahasa Indonesia',
  'Matematika',
  'Ilmu Pengetahuan Alam dan Sosial',
  'Pendidikan Jasmani Olahraga dan Kesehatan',
  'Seni Musik',
  'Seni Rupa',
  'Seni Teater',
  'Seni Tari',
  'Bahasa Jawa',
  'BTQ',
  'Bahasa Inggris',
  'Penilaian Harian',
  'Assesmen Sumatif Tengah Semester',
  'ANBK',
  'TKA (Tes Kemampuan Akademik)',
  'Kokurikuler',
];

export const GENIUS_CLASS_LIST = [
  { id: 'pramuka', name: 'Pramuka', icon: 'Flame', color: 'from-amber-500 to-orange-600' },
  { id: 'drumband', name: 'Drumband', icon: 'Drum', color: 'from-red-500 to-rose-600' },
  { id: 'paskibra', name: 'Paskibra', icon: 'Flag', color: 'from-blue-500 to-indigo-600' },
  { id: 'mipas', name: 'MIPAS Club', icon: 'FlaskConical', color: 'from-emerald-500 to-teal-600', sub: ['Matematika', 'IPA', 'IPS'] },
  { id: 'art', name: 'Art Club', icon: 'Palette', color: 'from-purple-500 to-pink-600', sub: ['Menyanyi', 'Menulis', 'Menggambar', 'Pantomim', 'Mendongeng', 'Menari'] },
  { id: 'sport', name: 'Tamansari Sport', icon: 'Trophy', color: 'from-orange-500 to-amber-600', sub: ['Voli', 'Kid Atletik'] },
  { id: 'qurani', name: "Qur'ani Club", icon: 'BookOpen', color: 'from-green-600 to-emerald-700', sub: ['MHQ', 'MTQ', 'Pildacil', 'Kaligrafi', 'Albanjari', 'Cerdas Cermat'] },
];

export const PEMBIASAAN_LIST = [
  { id: 'upacara', name: 'Upacara Bendera', day: 'Senin', icon: 'Flag' },
  { id: 'senam', name: 'Senam Anak Indonesia Hebat', day: 'Selasa', icon: 'Activity' },
  { id: 'literasi', name: 'Literasi Budaya', day: 'Rabu', icon: 'BookOpen' },
  { id: 'numerasi', name: 'Numerasi', day: 'Kamis', icon: 'Calculator' },
  { id: 'pahala', name: 'PAHALA (Peduli & Amal)', day: 'Jumat', icon: 'HeartHandshake' },
  { id: 'lainnya', name: 'Kegiatan Lain', day: 'Fleksibel', icon: 'Sparkles' },
];

export interface HabitDefinition {
  id: string;
  number: number;
  name: string;
  tagline: string;
  detail: string;
  targetWaktu?: string;
  iconName: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  badgeColor: string;
}

export const SEVEN_HABITS_LIST: HabitDefinition[] = [
  {
    id: 'bangun-pagi',
    number: 1,
    name: 'Bangun pagi',
    tagline: 'Melatih disiplin dan menghargai waktu sejak dini.',
    detail: 'Membiasakan bangun lebih awal sebelum subuh (04.30 - 05.00), merapikan tempat tidur secara mandiri, dan menyambut hari dengan kesiapan optimal.',
    targetWaktu: '04.30 - 05.00 WIB',
    iconName: 'Sunrise',
    color: 'from-amber-500 to-orange-500',
    bgColor: 'bg-amber-50/70',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-800',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  {
    id: 'beribadah',
    number: 2,
    name: 'Beribadah',
    tagline: 'Membangun fondasi spiritual dan nilai moral yang kuat.',
    detail: 'Menunaikan sholat wajib tepat waktu / beribadah sesuai agama masing-masing, berdoa sebelum & sesudah belajar, tadarus/membaca kitab, dan berakhlak mulia.',
    targetWaktu: 'Sepanjang Hari',
    iconName: 'HeartHandshake',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50/70',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-800',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  {
    id: 'berolahraga',
    number: 3,
    name: 'Berolahraga',
    tagline: 'Menjaga kebugaran tubuh serta kesehatan mental.',
    detail: 'Melakukan gerak aktif minimal 15-30 menit sehari (senam anak hebat, jalan pagi, lari kecil, peregangan tubuh, atau bermain bola) agar tubuh bugar dan pikiran segar.',
    targetWaktu: 'Pagi Hari (06.00 - 07.00)',
    iconName: 'Activity',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50/70',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  {
    id: 'makan-sehat',
    number: 4,
    name: 'Makan sehat dan bergizi',
    tagline: 'Memenuhi nutrisi seimbang untuk tumbuh kembang.',
    detail: 'Membiasakan sarapan bergizi seimbang (karbohidrat, lauk protein, sayur, dan buah), membawa bekal sehat higienis dari rumah, serta minum air putih minimal 8 gelas per hari.',
    targetWaktu: 'Sarapan & Makan Siang',
    iconName: 'Apple',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50/70',
    borderColor: 'border-rose-200',
    textColor: 'text-rose-800',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
  },
  {
    id: 'gemar-belajar',
    number: 5,
    name: 'Gemar belajar',
    tagline: 'Menumbuhkan rasa ingin tahu dan semangat sepanjang hayat.',
    detail: 'Membaca buku non-pelajaran 15 menit setiap hari (literasi), antusias bertanya hal baru, mengeksplorasi ilmu pengetahuan, dan menyelesaikan tugas mandiri tanpa menunda.',
    targetWaktu: '15 Menit Setiap Hari',
    iconName: 'BookOpen',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-purple-50/70',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-800',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  {
    id: 'bermasyarakat',
    number: 6,
    name: 'Bermasyarakat',
    tagline: 'Belajar bergotong royong dan peduli kepada sesama.',
    detail: 'Menerapkan budaya 5S (Senyum, Salam, Sapa, Sopan, Santun), aktif piket kelas & menjaga kebersihan sekolah, saling menolong sesama teman, serta patuh kepada orang tua.',
    targetWaktu: 'Di Sekolah & Rumah',
    iconName: 'Users',
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-50/70',
    borderColor: 'border-teal-200',
    textColor: 'text-teal-800',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
  },
  {
    id: 'tidur-cepat',
    number: 7,
    name: 'Tidur cepat',
    tagline: 'Memulihkan energi agar tubuh kembali bugar esok.',
    detail: 'Tidur malam tepat waktu sebelum pukul 21.00 WIB, mematikan layar gadget 30 menit sebelum tidur, serta mencukupi waktu istirahat 8-9 jam agar bangun bugar keesokan harinya.',
    targetWaktu: 'Maksimal 21.00 WIB',
    iconName: 'Moon',
    color: 'from-indigo-600 to-slate-700',
    bgColor: 'bg-slate-50/70',
    borderColor: 'border-slate-200',
    textColor: 'text-slate-800',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
  },
];

export const INITIAL_SEVEN_HABITS: SevenHabitsData[] = [
  {
    id: 'sh-1',
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    guru: 'Ike Novi Pristiwati, S.Pd',
    kelas: '4a',
    jumlahSiswa: 28,
    habits: [
      { id: 'bangun-pagi', name: 'Bangun pagi', tagline: 'Melatih disiplin dan menghargai waktu sejak dini.', status: 'sangat_baik', persentase: 96, jumlahSiswa: 27, catatan: 'Mayoritas bangun pukul 04.45 WIB' },
      { id: 'beribadah', name: 'Beribadah', tagline: 'Membangun fondasi spiritual dan nilai moral yang kuat.', status: 'sangat_baik', persentase: 100, jumlahSiswa: 28, catatan: 'Sholat Dhuha bersama dan doa pagi' },
      { id: 'berolahraga', name: 'Berolahraga', tagline: 'Menjaga kebugaran tubuh serta kesehatan mental.', status: 'baik', persentase: 89, jumlahSiswa: 25, catatan: 'Senam Anak Indonesia Hebat di halaman' },
      { id: 'makan-sehat', name: 'Makan sehat dan bergizi', tagline: 'Memenuhi nutrisi seimbang untuk tumbuh kembang.', status: 'sangat_baik', persentase: 93, jumlahSiswa: 26, catatan: 'Bawa bekal buah dan sayur bersama' },
      { id: 'gemar-belajar', name: 'Gemar belajar', tagline: 'Menumbuhkan rasa ingin tahu dan semangat sepanjang hayat.', status: 'sangat_baik', persentase: 96, jumlahSiswa: 27, catatan: 'Literasi pojok baca 15 menit' },
      { id: 'bermasyarakat', name: 'Bermasyarakat', tagline: 'Belajar bergotong royong dan peduli kepada sesama.', status: 'sangat_baik', persentase: 100, jumlahSiswa: 28, catatan: 'Piket kelas dan budaya 5S' },
      { id: 'tidur-cepat', name: 'Tidur cepat', tagline: 'Memulihkan energi agar tubuh kembali bugar esok.', status: 'baik', persentase: 86, jumlahSiswa: 24, catatan: 'Tidur sebelum pk 21.00 WIB sesuai laporan ortu' },
    ],
    catatanRefleksi: 'Pembiasaan 7 Kebiasaan Anak Hebat di Kelas 4A berlangsung sangat antusias. Orang tua siswa turut mendukung melalui pemantauan jurnal di rumah.',
    tindakLanjut: 'Berikan apresiasi pin Bintang Anak Hebat bagi siswa yang konsisten menjalankan ke-7 kebiasaan selama 1 pekan.',
  },
];

export const INITIAL_PROFIL: ProfilSekolah = {
  namaSekolah: 'SDN Tamansari',
  jenisSekolah: 'Sekolah Dasar Negeri',
  kepalaSekolah: 'Muhammad Rosyid Jamily, M.Pd',
  npsn: '20518988',
  alamat: 'Jl. Brawijaya Desa Tamansari, Kec. Tegalsari, Kab. Banyuwangi',
  telepon: '085704005011',
  email: 'sdntamansari32@gmail.com',
  jumlahGuru: '11',
  jumlahSiswa: '292',
  jumlahProgramEkstra: '20',
  visiSekolah: 'Mencetak generasi unggul yang inovatif, berprestasi, berkarakter mulia, dan religius berlandaskan Profil Pelajar Pancasila.',
  logoUrl: '',
  pengembangFoto: '',
};

export const INITIAL_TUTORIALS: TutorialLink[] = [
  {
    id: 'tut-1',
    platform: 'youtube',
    judul: 'Panduan Lengkap Pengisian Jurnal Mengajar & Supervisi Guru',
    link: 'https://youtube.com',
    timestamp: new Date().toISOString(),
    author: 'Rosyid Jamily',
  },
  {
    id: 'tut-2',
    platform: 'youtube',
    judul: 'Tutorial Monitoring Kepala Sekolah & Kurva Radar Penilaian',
    link: 'https://youtube.com',
    timestamp: new Date().toISOString(),
    author: 'Rosyid Jamily',
  },
  {
    id: 'tut-3',
    platform: 'tiktok',
    judul: 'Tips Cepat Input Presensi Pembiasaan dan GENIUS Class',
    link: 'https://tiktok.com',
    timestamp: new Date().toISOString(),
    author: 'Admin GENIUS',
  },
  {
    id: 'tut-4',
    platform: 'instagram',
    judul: 'Highlight Kegiatan Siswa dan Program Ekstrakurikuler',
    link: 'https://instagram.com',
    timestamp: new Date().toISOString(),
    author: 'SDN Tamansari',
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'Jadwal Supervisi Pembelajaran',
    message: 'Supervisi akademik semester ganjil berlangsung pekan ini.',
    time: '08:00',
    timestamp: new Date().toISOString(),
    type: 'info',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Pengisian Jurnal Mengajar (Batas Jam 12 Siang)',
    message: 'Bapak/Ibu Guru wajib melengkapi jurnal mengajar harian dan absensi siswa maksimal sebelum pukul 12:00 siang.',
    time: '07:30',
    timestamp: new Date().toISOString(),
    type: 'warning',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'GENIUS Class Hari Ini',
    message: 'Kegiatan ekstrakurikuler Art Club & MIPAS Club dimulai pukul 13.30.',
    time: 'Kemarin',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    type: 'success',
    read: true,
  },
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    timestamp: new Date().toISOString(),
    time: '08:15',
    type: 'jurnal',
    activity: 'Jurnal Mengajar',
    user: 'Novia Rahmawati, S.Pd',
    detail: 'Kelas 4A - IPAS - Materi Siklus Air dan Ekosistem',
  },
  {
    id: 'act-2',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    time: '07:15',
    type: 'pembiasaan',
    activity: 'Pembiasaan',
    user: 'Ike Novi Pristiwati, S.Pd',
    detail: 'Upacara Bendera - 292 Siswa & Semua Guru',
  },
  {
    id: 'act-3',
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    time: '09:45',
    type: 'supervisi',
    activity: 'Supervisi Guru',
    user: 'Lailatul Novida, S.Pd',
    detail: 'Tahapan Observasi - Matematika Kelas 5 (Skor 3.8/4.0)',
  },
  {
    id: 'act-4',
    timestamp: new Date(Date.now() - 14400000).toISOString(),
    time: '13:30',
    type: 'genius-class',
    activity: 'GENIUS Class',
    user: 'Muhammad Hasan Bisri, S.Pd',
    detail: 'MIPAS Club (Silabus OSN 2026: Bilangan, KPK & FPB) - 24 Siswa',
  },
  {
    id: 'act-5',
    timestamp: new Date(Date.now() - 28800000).toISOString(),
    time: '14:00',
    type: 'kombel',
    activity: 'Kombel GENIUS',
    user: 'Intan Kartini, S.Pd',
    detail: 'Penerapan Diferensiasi Pembelajaran Kurikulum Merdeka',
  },
  {
    id: 'act-6',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    time: '10:30',
    type: 'buku-kejadian',
    activity: 'Buku Kejadian',
    user: 'Ahmad Raihan (Kelas 6)',
    detail: 'Prestasi Juara 1 Lomba OSN Tingkat Kecamatan',
  },
];

export const INITIAL_SUPERVISIONS: SupervisiData[] = [
  {
    id: 'sup-1',
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    guru: 'Novia Rahmawati, S.Pd',
    mapel: 'Ilmu Pengetahuan Alam dan Sosial',
    kelas: '4a',
    tahapan: 'observasi',
    hasil: 'Pembelajaran interaktif dengan media visual berjalan sangat baik dan siswa aktif berdiskusi.',
    tindakLanjut: 'Tingkatkan diferensiasi konten untuk siswa yang membutuhkan bimbingan ekstra.',
    praObservasi: {
      items: [
        { indicator: 'Modul Ajar', score: 4, note: 'Lengkap dan terstruktur sesuai CP' },
        { indicator: 'Materi', score: 4, note: 'Materi kontekstual' },
        { indicator: 'Media/bahan ajar', score: 4, note: 'Menggunakan video & PPT interaktif' },
        { indicator: 'LKPD', score: 3, note: 'Perlu sedikit penguatan petunjuk tugas' },
        { indicator: 'Kisi-kisi soal', score: 4, note: 'Sesuai indikator' },
        { indicator: 'Soal/instrumen penilaian', score: 4, note: 'Bervariasi (HOTS)' },
        { indicator: 'Rubrik penskoran', score: 3, note: 'Perlu deskriptor lebih rinci' },
        { indicator: 'Lembar analisis penilaian', score: 4, note: 'Tersedia rapi' },
        { indicator: 'Program remidi & pengayaan', score: 3, note: 'Siap dilaksanakan' },
      ],
      notes: 'Administrasi lengkap dan rapi.',
    },
    observasi: {
      items: [
        { indicator: 'Menyampaikan tujuan pembelajaran', score: 4, note: 'Disampaikan dengan jelas' },
        { indicator: 'Melakukan apersepsi', score: 4, note: 'Apersepsi menarik melalui pertanyaan pemantik' },
        { indicator: 'Penguasaan materi', score: 4, note: 'Sangat menguasai' },
        { indicator: 'Variasi metode pembelajaran', score: 4, note: 'PBL dengan diskusi kelompok' },
        { indicator: 'Penggunaan media/sumber belajar', score: 4, note: 'Media digital & kartu gambar' },
        { indicator: 'Keterlibatan aktif siswa', score: 4, note: 'Siswa antusias dan kolaboratif' },
        { indicator: 'Pengelolaan waktu', score: 3, note: 'Sesi penutup sedikit tergesa' },
        { indicator: 'Penilaian proses pembelajaran', score: 4, note: 'Observasi formatif berjalan' },
        { indicator: 'Pemberian umpan balik', score: 4, note: 'Apresiatif & membangun' },
        { indicator: 'Penutupan pembelajaran', score: 3, note: 'Refleksi singkat dilakukan' },
      ],
      notes: 'Proses belajar mengajar sangat kondusif dan berpusat pada siswa.',
    },
  },
  {
    id: 'sup-2',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    date: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    guru: 'Ike Novi Pristiwati, S.Pd',
    mapel: 'Bahasa Indonesia',
    kelas: '1',
    tahapan: 'observasi',
    hasil: 'Pengenalan fonem dan suku kata dibawakan dengan games bernyanyi yang menyenangkan.',
    tindakLanjut: 'Pertahankan metode bermain sambil belajar untuk kelas awal.',
    praObservasi: {
      items: [
        { indicator: 'Modul Ajar', score: 4, note: 'Sangat baik' },
        { indicator: 'Materi', score: 4, note: 'Sesuai fase A' },
        { indicator: 'Media/bahan ajar', score: 4, note: 'Kartu huruf bergambar' },
        { indicator: 'LKPD', score: 4, note: 'Ramah anak' },
        { indicator: 'Kisi-kisi soal', score: 3, note: 'Cukup' },
        { indicator: 'Soal/instrumen penilaian', score: 4, note: 'Formatif lisan' },
        { indicator: 'Rubrik penskoran', score: 3, note: 'Baik' },
        { indicator: 'Lembar analisis penilaian', score: 3, note: 'Baik' },
        { indicator: 'Program remidi & pengayaan', score: 4, note: 'Ada program fonik remidi' },
      ],
    },
    observasi: {
      items: [
        { indicator: 'Menyampaikan tujuan pembelajaran', score: 4 },
        { indicator: 'Melakukan apersepsi', score: 4 },
        { indicator: 'Penguasaan materi', score: 4 },
        { indicator: 'Variasi metode pembelajaran', score: 4 },
        { indicator: 'Penggunaan media/sumber belajar', score: 4 },
        { indicator: 'Keterlibatan aktif siswa', score: 4 },
        { indicator: 'Pengelolaan waktu', score: 4 },
        { indicator: 'Penilaian proses pembelajaran', score: 4 },
        { indicator: 'Pemberian umpan balik', score: 4 },
        { indicator: 'Penutupan pembelajaran', score: 4 },
      ],
    },
  },
];

// Akun Pengguna Resmi: Murni menggunakan data yang ada di Google Spreadsheet tab 'Akun Pengguna'
// Akun dummy dihapus sepenuhnya sesuai permintaan pengguna.
export const DEFAULT_ACCOUNTS: UserAccount[] = [];

export const INITIAL_SUPERVISI_PENGAWAS: SupervisiPengawasData[] = [
  {
    id: 'sp-1',
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    pengawas: 'Drs. H. Bambang Sujarwo, M.Pd',
    nip: '196803121993031005',
    sasaran: 'Kepala Sekolah & Guru Kelas',
    aspekSupervisi: 'Implementasi Kurikulum Merdeka & Budaya Karakter 7 Kebiasaan',
    temuan: 'Kepala Sekolah Muhammad Rosyid Jamily, M.Pd telah memimpin digitalisasi jurnal mengajar dan 7 kebiasaan anak dengan sangat tertib. Partisipasi guru 100%.',
    rekomendasi: 'Pertahankan sistem monitoring digital dan sosialisasikan praktik baik ke gugus sekolah binaan lainnya.',
    tindakLanjut: 'Akan diadakan diseminasi praktik baik dalam Kombel Gugus 02 Tegalsari pada akhir bulan.',
  },
];

export const INITIAL_JURNAL_ORANG_TUA: JurnalOrangTuaData[] = [
  {
    id: 'jot-1',
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0],
    namaOrtu: 'Hendra Wijaya, S.T',
    namaAnak: 'Muhammad Fathan Al-Faruq',
    kelas: '4a',
    bangunPagi: '04.45 WIB - Bangun sendiri dan merapikan tempat tidur',
    ibadah: 'Sholat Subuh berjamaah di masjid dan doa pagi',
    makanSehat: 'Sarapan nasi telur sayur bayam dan minum air putih hangat',
    belajarMandiri: 'Membaca buku ensiklopedia sains 20 menit',
    tidurCepat: '20.45 WIB - Tidur tepat waktu tanpa bermain gadget',
    pesanGuru: 'Alhamdulillah ananda semakin mandiri di rumah. Mohon bimbingan saat kegiatan ekstra sains.',
    paraf: true,
  },
];

export const INITIAL_TRAFFIC: TrafficStats = {
  todayVisits: 19,
  weekVisits: 85,
  monthVisits: 313,
  totalVisits: 1421,
  uniqueVisitors: 46,
};

// Local storage storage helper keys
const STORAGE_KEYS = {
  USER: 'genius_user',
  LOGGED_IN: 'genius_loggedIn',
  ACCOUNTS: 'genius_accounts',
  ACTIVITIES: 'genius_activities',
  NOTIFICATIONS: 'genius_notifications',
  PROFIL: 'genius_profil',
  TUTORIALS: 'genius_tutorials',
  TRAFFIC: 'genius_traffic',
  SUPERVISIONS: 'genius_supervisions',
  JOURNALS: 'genius_journals',
  PEMBIASAAN: 'genius_pembiasaan',
  GENIUS_CLASS: 'genius_class_data',
  KOMBEL: 'genius_kombel_data',
  BUKU_KEJADIAN: 'genius_buku_kejadian',
  BUKU_KUNJUNGAN: 'genius_buku_kunjungan',
  BUKU_INVENTARIS: 'genius_buku_inventaris',
  BUKU_PERKEMBANGAN: 'genius_buku_perkembangan',
  SEVEN_HABITS: 'genius_seven_habits',
  SUPERVISI_PENGAWAS: 'genius_supervisi_pengawas',
  JURNAL_ORANG_TUA: 'genius_jurnal_orang_tua',
  APPS_SCRIPT_URL: 'genius_apps_script_url',
  SPREADSHEET_ID_OVERRIDE: 'genius_spreadsheet_id',
};

export const getStoredItem = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
};

export const setStoredItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage save error:', err);
  }
};

export const initAppStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    setStoredItem(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    setStoredItem(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PROFIL)) {
    setStoredItem(STORAGE_KEYS.PROFIL, INITIAL_PROFIL);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TUTORIALS)) {
    setStoredItem(STORAGE_KEYS.TUTORIALS, INITIAL_TUTORIALS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SUPERVISIONS)) {
    setStoredItem(STORAGE_KEYS.SUPERVISIONS, INITIAL_SUPERVISIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SEVEN_HABITS)) {
    setStoredItem(STORAGE_KEYS.SEVEN_HABITS, INITIAL_SEVEN_HABITS);
  }
  // Inisialisasi dan bersihkan akun dummy dari local storage
  try {
    const rawAccounts = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    if (rawAccounts) {
      const parsed = JSON.parse(rawAccounts);
      if (Array.isArray(parsed)) {
        // Hapus akun yang menggunakan password default dummy bawaan
        const dummyPasswords = [
          'pengawasgenius',
          'ksgenius',
          'gurugenius',
          'pembinagenius',
          'muridgenius',
          'ortugenius',
          'admingenius',
        ];
        const isDummyPresent = parsed.some((a: any) => dummyPasswords.includes(a.password));
        if (isDummyPresent) {
          const cleaned = parsed.filter((a: any) => !dummyPasswords.includes(a.password));
          setStoredItem(STORAGE_KEYS.ACCOUNTS, cleaned);
        }
      }
    } else {
      setStoredItem(STORAGE_KEYS.ACCOUNTS, []);
    }
  } catch (err) {
    console.error('Error saat inisialisasi akun:', err);
  }

  // Update traffic counters
  const currentTraffic = getStoredItem<TrafficStats>(STORAGE_KEYS.TRAFFIC, {
    todayVisits: 18,
    weekVisits: 84,
    monthVisits: 312,
    totalVisits: 1420,
    uniqueVisitors: 45,
  });
  currentTraffic.todayVisits += 1;
  currentTraffic.weekVisits += 1;
  currentTraffic.monthVisits += 1;
  currentTraffic.totalVisits += 1;
  setStoredItem(STORAGE_KEYS.TRAFFIC, currentTraffic);
};

export { STORAGE_KEYS };

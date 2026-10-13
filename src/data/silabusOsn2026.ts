/**
 * Silabus Olimpiade Sains Nasional (OSN) 2026 SD/MI/Sederajat
 * Diterbitkan oleh Pusat Prestasi Nasional (Puspresnas) - Kemendikdasmen
 */

export interface KompetensiDasarItem {
  kode: string;
  kelas: string;
  deskripsi: string;
}

export interface SilabusTopic {
  id: string;
  nomor: number;
  judul: string;
  lingkupMateri: string[];
  kompetensiDasar: KompetensiDasarItem[];
  silabusImso?: string[];
  catatanKhusus?: string;
}

export interface BidangSilabus {
  id: 'matematika' | 'ipa' | 'ips';
  nama: string;
  deskripsi: string;
  warna: string;
  badgeColor: string;
  topics: SilabusTopic[];
}

export const SILABUS_OSN_2026: BidangSilabus[] = [
  {
    id: 'matematika',
    nama: 'Matematika',
    deskripsi: 'Silabus OSN Bidang Matematika SD/MI 2026 mencakup Bilangan, Aritmatika, Geometri, Statistika & Pengukuran, dan Kombinatorik serta Silabus IMSO.',
    warna: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    topics: [
      {
        id: 'mat-1',
        nomor: 1,
        judul: 'Bilangan',
        lingkupMateri: [
          'Bilangan Cacah',
          'Bilangan Bulat',
          'Bilangan Rasional',
          'Bilangan Prima',
          'Kelipatan Persekutuan Terkecil (KPK)',
          'Persekutuan Terbesar (FPB)',
          'Pola Bilangan',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.2', kelas: 'Kelas III', deskripsi: 'Menjelaskan bilangan cacah dan pecahan sederhana (seperti 1/2, 1/3, dan 1/4) yang disajikan pada garis bilangan' },
          { kode: 'KD 4.2', kelas: 'Kelas III', deskripsi: 'Menggunakan bilangan cacah dan pecahan sederhana (seperti 1/2, 1/3, dan 1/4) yang disajikan pada garis bilangan' },
          { kode: 'KD 3.3', kelas: 'Kelas III', deskripsi: 'Menyatakan suatu bilangan sebagai jumlah, selisih, hasil kali, atau hasil bagi dua bilangan cacah' },
          { kode: 'KD 4.3', kelas: 'Kelas III', deskripsi: 'Menilai apakah suatu bilangan dapat dinyatakan sebagai jumlah, selisih, hasil kali, atau hasil bagi dua bilangan cacah' },
          { kode: 'KD 3.4', kelas: 'Kelas III', deskripsi: 'Menggeneralisasi ide pecahan sebagai bagian dari keseluruhan menggunakan benda-benda konkret' },
          { kode: 'KD 4.4', kelas: 'Kelas III', deskripsi: 'Menyajikan pecahan sebagai bagian dari keseluruhan menggunakan benda-benda konkret' },
          { kode: 'KD 3.1', kelas: 'Kelas IV', deskripsi: 'Menjelaskan pecahan-pecahan senilai dengan gambar dan model konkret' },
          { kode: 'KD 4.1', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi pecahan-pecahan senilai dengan gambar dan model konkret' },
          { kode: 'KD 3.2', kelas: 'Kelas IV', deskripsi: 'Menjelaskan berbagai bentuk pecahan (biasa, campuran, desimal, dan persen) dan hubungan di antaranya' },
          { kode: 'KD 4.2', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi berbagai bentuk pecahan (biasa, campuran, desimal, dan persen) dan hubungan di antaranya' },
          { kode: 'KD 3.4', kelas: 'Kelas IV', deskripsi: 'Menjelaskan faktor dan kelipatan suatu bilangan' },
          { kode: 'KD 4.4', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi faktor dan kelipatan suatu bilangan' },
          { kode: 'KD 3.5', kelas: 'Kelas IV', deskripsi: 'Menjelaskan bilangan prima' },
          { kode: 'KD 4.5', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi bilangan prima' },
          { kode: 'KD 3.6', kelas: 'Kelas IV', deskripsi: 'Menjelaskan dan menentukan faktor persekutuan, faktor persekutuan terbesar (FPB), kelipatan persekutuan, dan kelipatan persekutuan terkecil (KPK) dari dua bilangan berkaitan dengan kehidupan sehari-hari' },
          { kode: 'KD 4.6', kelas: 'Kelas IV', deskripsi: 'Menyelesaikan masalah yang berkaitan dengan faktor persekutuan, FPB, kelipatan persekutuan, dan KPK dari dua bilangan berkaitan dengan kehidupan sehari-hari' },
          { kode: 'KD 3.1', kelas: 'Kelas VI', deskripsi: 'Menjelaskan bilangan bulat negatif (termasuk menggunakan garis bilangan)' },
          { kode: 'KD 4.1', kelas: 'Kelas VI', deskripsi: 'Menggunakan konsep bilangan bulat negatif (termasuk menggunakan garis bilangan) untuk menyatakan situasi sehari-hari' },
        ],
        silabusImso: [
          'Whole numbers',
          'Rational numbers and their representations (fractions, decimals, and percentages)',
          'Pattern recognition',
          'Factors and Multiples',
          'Greatest Common Divisor (GCD / FPB)',
          'Least Common Multiples (LCM / KPK)',
          'Ordering of numbers',
          'Ratio and Proportion',
        ],
      },
      {
        id: 'mat-2',
        nomor: 2,
        judul: 'Aritmatika',
        lingkupMateri: [
          'Operasi Bilangan (Penjumlahan, Pengurangan, Perkalian, Pembagian)',
          'Persamaan Linear Satu Variabel',
          'Persamaan Linear Dua Variabel',
          'Sistem Pertidaksamaan Linear',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.1', kelas: 'Kelas III', deskripsi: 'Menerapkan sifat-sifat operasi hitung pada bilangan cacah' },
          { kode: 'KD 4.1', kelas: 'Kelas III', deskripsi: 'Menyelesaikan masalah yang melibatkan penggunaan sifat-sifat operasi hitung pada bilangan cacah' },
          { kode: 'KD 3.5', kelas: 'Kelas III', deskripsi: 'Menjelaskan proses dan hasil penjumlahan dan pengurangan pecahan berpenyebut sama' },
          { kode: 'KD 4.5', kelas: 'Kelas III', deskripsi: 'Menyelesaikan masalah penjumlahan dan pengurangan pecahan berpenyebut sama' },
          { kode: 'KD 3.3', kelas: 'Kelas IV', deskripsi: 'Menjelaskan proses dan hasil penaksiran dari jumlah, selisih, hasil kali, dan atau hasil bagi dua bilangan cacah maupun pecahan dan desimal' },
          { kode: 'KD 4.3', kelas: 'Kelas IV', deskripsi: 'Menyelesaikan masalah penaksiran dari jumlah, selisih, hasil kali, atau hasil bagi dua bilangan cacah, pecahan atau desimal' },
          { kode: 'KD 3.1', kelas: 'Kelas V', deskripsi: 'Menjelaskan proses dan hasil penjumlahan dan pengurangan dua pecahan dengan penyebut berbeda' },
          { kode: 'KD 4.1', kelas: 'Kelas V', deskripsi: 'Menyelesaikan masalah yang berkaitan dengan penjumlahan dan pengurangan dua pecahan dengan penyebut berbeda' },
          { kode: 'KD 3.2', kelas: 'Kelas V', deskripsi: 'Menjelaskan proses dan hasil perkalian dan pembagian pecahan dan desimal' },
          { kode: 'KD 4.2', kelas: 'Kelas V', deskripsi: 'Menyelesaikan masalah yang berkaitan dengan perkalian dan pembagian pecahan dan desimal' },
          { kode: 'KD 3.3', kelas: 'Kelas V', deskripsi: 'Menjelaskan proses dan hasil operasi hitung campuran yang melibatkan bilangan cacah, pecahan dan/atau desimal dalam berbagai bentuk' },
          { kode: 'KD 4.3', kelas: 'Kelas V', deskripsi: 'Menyelesaikan masalah yang berkaitan dengan operasi hitung campuran yang melibatkan bilangan cacah, pecahan dan/atau desimal dalam berbagai bentuk' },
          { kode: 'KD 3.2', kelas: 'Kelas VI', deskripsi: 'Menjelaskan proses dan hasil operasi penjumlahan, pengurangan, perkalian, dan pembagian yang melibatkan bilangan bulat negatif' },
          { kode: 'KD 4.2', kelas: 'Kelas VI', deskripsi: 'Menyelesaikan masalah dalam kehidupan sehari-hari yang berkaitan dengan operasi penjumlahan, pengurangan, perkalian, dan pembagian yang melibatkan bilangan bulat negatif' },
        ],
        silabusImso: [
          'Counting Techniques',
          'Recreational Mathematics such as mathematical puzzle',
        ],
      },
      {
        id: 'mat-3',
        nomor: 3,
        judul: 'Geometri',
        lingkupMateri: [
          'Bidang Datar: sifat-sifat bangun datar, segiempat, segitiga, lingkaran, luas, keliling, sudut, simetri lipat dan simetri putar',
          'Geometri Ruang: Volume, luas permukaan, jaring-jaring bangun ruang (kubus, balok, prisma, tabung, limas, kerucut, bola)',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.8', kelas: 'Kelas III', deskripsi: 'Menjelaskan dan menentukan luas dan volume dalam satuan tidak baku dengan menggunakan benda konkret' },
          { kode: 'KD 4.8', kelas: 'Kelas III', deskripsi: 'Menyelesaikan masalah luas dan volume dalam satuan tidak baku dengan menggunakan benda konkret' },
          { kode: 'KD 3.9', kelas: 'Kelas III', deskripsi: 'Menjelaskan simetri lipat dan simetri putar pada bangun datar menggunakan benda konkret' },
          { kode: 'KD 4.9', kelas: 'Kelas III', deskripsi: 'Mendefinisikan simetri lipat dan simetri putar pada bangun datar menggunakan benda konkret' },
          { kode: 'KD 3.10', kelas: 'Kelas III', deskripsi: 'Menjelaskan dan menentukan keliling bangun datar' },
          { kode: 'KD 4.10', kelas: 'Kelas III', deskripsi: 'Menyajikan dan menyelesaikan masalah yang berkaitan dengan keliling bangun datar' },
          { kode: 'KD 3.11', kelas: 'Kelas III', deskripsi: 'Menjelaskan sudut, jenis sudut (sudut siku-siku, sudut lancip, dan sudut tumpul), dan satuan pengukuran tidak baku' },
          { kode: 'KD 4.11', kelas: 'Kelas III', deskripsi: 'Mengidentifikasi jenis sudut (sudut siku-siku, sudut lancip, dan sudut tumpul), dan satuan pengukuran tidak baku' },
          { kode: 'KD 3.12', kelas: 'Kelas III', deskripsi: 'Menganalisis berbagai bangun datar berdasarkan sifat-sifat yang dimiliki' },
          { kode: 'KD 4.12', kelas: 'Kelas III', deskripsi: 'Mengelompokkan berbagai bangun datar berdasarkan sifat-sifat yang dimiliki' },
          { kode: 'KD 3.8', kelas: 'Kelas IV', deskripsi: 'Menganalisis sifat-sifat segi banyak beraturan dan segibanyak tidak beraturan' },
          { kode: 'KD 4.8', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi segibanyak beraturan dan segibanyak tidak beraturan' },
          { kode: 'KD 3.9', kelas: 'Kelas IV', deskripsi: 'Menjelaskan dan menentukan keliling dan luas persegi, persegipanjang, dan segitiga serta hubungan pangkat dua dengan akar pangkat dua' },
          { kode: 'KD 4.9', kelas: 'Kelas IV', deskripsi: 'Menyelesaikan masalah berkaitan dengan keliling dan luas persegi, persegipanjang, dan segitiga termasuk melibatkan pangkat dua dan akar pangkat dua' },
          { kode: 'KD 3.10', kelas: 'Kelas IV', deskripsi: 'Menjelaskan hubungan antar garis (sejajar, berpotongan, berhimpit) menggunakan model konkret' },
          { kode: 'KD 4.10', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi hubungan antar garis (sejajar, berpotongan, berhimpit) menggunakan model konkret' },
          { kode: 'KD 3.5', kelas: 'Kelas V', deskripsi: 'Menjelaskan dan menentukan volume bangun ruang dengan menggunakan satuan volume (seperti kubus satuan) serta hubungan pangkat tiga dengan akar pangkat tiga' },
          { kode: 'KD 4.5', kelas: 'Kelas V', deskripsi: 'Menyelesaikan masalah yang berkaitan dengan volume bangun ruang menggunakan satuan volume melibatkan pangkat tiga dan akar pangkat tiga' },
          { kode: 'KD 3.6', kelas: 'Kelas V', deskripsi: 'Menjelaskan dan menemukan jaring-jaring bangun ruang sederhana (kubus dan balok)' },
          { kode: 'KD 4.6', kelas: 'Kelas V', deskripsi: 'Membuat jaring-jaring bangun ruang sederhana (kubus dan balok)' },
          { kode: 'KD 3.7', kelas: 'Kelas V', deskripsi: 'Menjelaskan bangun ruang yang merupakan gabungan dari beberapa bangun ruang serta luas permukaan dan volumenya' },
          { kode: 'KD 4.7', kelas: 'Kelas V', deskripsi: 'Mengidentifikasi bangun ruang yang merupakan gabungan dari beberapa bangun ruang serta luas permukaan dan volumenya' },
          { kode: 'KD 3.4', kelas: 'Kelas VI', deskripsi: 'Menjelaskan titik pusat, jari-jari, diameter, busur, tali busur, temberang, dan juring lingkaran' },
          { kode: 'KD 4.4', kelas: 'Kelas VI', deskripsi: 'Mengidentifikasi titik pusat, jari-jari, diameter, busur, tali busur, temberang, dan juring lingkaran' },
          { kode: 'KD 3.5', kelas: 'Kelas VI', deskripsi: 'Menjelaskan taksiran keliling dan luas lingkaran' },
          { kode: 'KD 4.5', kelas: 'Kelas VI', deskripsi: 'Menaksir keliling dan luas lingkaran serta menggunakannya untuk menyelesaikan masalah' },
          { kode: 'KD 3.6', kelas: 'Kelas VI', deskripsi: 'Membandingkan prisma, tabung, limas, kerucut, dan bola' },
          { kode: 'KD 4.6', kelas: 'Kelas VI', deskripsi: 'Mengidentifikasi prisma, tabung, limas, kerucut, dan bola' },
        ],
        silabusImso: [
          'Angle and its measure',
          'Area and perimeter of different polygons',
          'Symmetry, reflection, rotation, similarity, and proportion properties of solid figures',
          'Properties of polygons (Triangle, quadrilateral, parallelogram, trapezium) and circles',
          'Nets of cube and parallelepiped',
        ],
      },
      {
        id: 'mat-4',
        nomor: 4,
        judul: 'Statistika Data & Pengukuran',
        lingkupMateri: [
          'Satuan Waktu',
          'Hubungan antar satuan baku panjang, berat dan waktu',
          'Penyajian dan penjelasan diagram batang',
          'Pengumpulan dan penjelasan diagram batang',
          'Perbandingan dua besaran berbeda: Kecepatan (Jarak-waktu), debit (volume-waktu)',
          'Pengumpulan dan analisis data',
          'Daftar, tabel, picto-gram, diagram batang, diagram garis',
          'Modus, median, dan mean data tunggal',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.6', kelas: 'Kelas III', deskripsi: 'Menjelaskan dan menentukan lama waktu suatu kejadian berlangsung' },
          { kode: 'KD 4.6', kelas: 'Kelas III', deskripsi: 'Menyelesaikan masalah yang berkaitan lama waktu suatu kejadian berlangsung' },
          { kode: 'KD 3.7', kelas: 'Kelas III', deskripsi: 'Mendeskripsikan dan menentukan hubungan antar satuan baku untuk panjang, berat, dan waktu yang umumnya digunakan dalam kehidupan sehari-hari' },
          { kode: 'KD 4.7', kelas: 'Kelas III', deskripsi: 'Menyelesaikan masalah yang berkaitan dengan hubungan antarsatuan baku untuk panjang, berat, dan waktu dalam kehidupan sehari-hari' },
          { kode: 'KD 3.13', kelas: 'Kelas III', deskripsi: 'Menjelaskan data berkaitan dengan diri peserta didik yang disajikan dalam diagram gambar' },
          { kode: 'KD 4.13', kelas: 'Kelas III', deskripsi: 'Menyajikan data berkaitan dengan diri peserta didik yang disajikan dalam diagram gambar' },
          { kode: 'KD 3.11', kelas: 'Kelas IV', deskripsi: 'Menjelaskan data diri peserta didik dan lingkungannya yang disajikan dalam bentuk diagram batang' },
          { kode: 'KD 4.11', kelas: 'Kelas IV', deskripsi: 'Mengumpulkan data diri peserta didik dan lingkungannya dan menyajikan dalam bentuk diagram batang' },
          { kode: 'KD 3.8', kelas: 'Kelas IV', deskripsi: 'Menjelaskan dan membandingkan modus, median, dan mean dari data tunggal untuk menentukan nilai mana yang paling tepat mewakili data' },
          { kode: 'KD 4.8', kelas: 'Kelas IV', deskripsi: 'Menyelesaikan masalah yang berkaitan dengan modus, median, dan mean dari data tunggal dalam penyelesaian masalah' },
          { kode: 'KD 3.3', kelas: 'Kelas V', deskripsi: 'Menjelaskan perbandingan dua besaran yang berbeda (kecepatan sebagai perbandingan jarak dengan waktu, debit sebagai perbandingan volume dan waktu)' },
          { kode: 'KD 4.3', kelas: 'Kelas V', deskripsi: 'Menyelesaikan masalah yang berkaitan dengan perbandingan dua besaran yang berbeda (kecepatan, debit)' },
          { kode: 'KD 3.7', kelas: 'Kelas V', deskripsi: 'Menjelaskan data yang berkaitan dengan diri peserta didik atau lingkungan sekitar serta cara pengumpulannya' },
          { kode: 'KD 4.7', kelas: 'Kelas V', deskripsi: 'Menganalisis data yang berkaitan dengan diri peserta didik atau lingkungan sekitar serta cara pengumpulannya' },
          { kode: 'KD 3.8', kelas: 'Kelas V', deskripsi: 'Menjelaskan penyajian data yang berkaitan dengan diri peserta didik dan membandingkan dengan data dari lingkungan sekitar dalam bentuk daftar, tabel, diagram gambar (piktogram), diagram batang, atau diagram garis' },
          { kode: 'KD 4.9', kelas: 'Kelas V', deskripsi: 'Mengorganisasikan dan menyajikan data yang berkaitan dengan diri peserta didik dan membandingkan dengan data lingkungan sekitar dalam bentuk daftar, tabel, piktogram, diagram batang, atau garis' },
        ],
      },
      {
        id: 'mat-5',
        nomor: 5,
        judul: 'Kombinatorik',
        lingkupMateri: [
          'Penggunaan kombinasi dengan teknik Counting problem',
          'Pengenalan pola dengan menggunakan kombinasi',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.3', kelas: 'Kelas III', deskripsi: 'Menyatakan suatu bilangan sebagai jumlah selisih, hasil kali atau hasil bagi dua bilangan cacah' },
          { kode: 'KD 4.3', kelas: 'Kelas III', deskripsi: 'Menilai apakah suatu bilangan dapat dinyatakan sebagai jumlah, selisih, hasil kali dan hasil bagi dua bilangan cacah' },
          { kode: 'KD 4.3', kelas: 'Kelas V', deskripsi: 'Mengidentifikasi faktor dan kelipatan suatu bilangan' },
          { kode: 'KD 4.5', kelas: 'Kelas V', deskripsi: 'Mengidentifikasi bilangan prima' },
          { kode: 'KD 3.7', kelas: 'Kelas V', deskripsi: 'Memilih prosedur pemecahan masalah dengan menganalisis hubungan antar simbol, informasi yang relevan, dan mengamati pola' },
          { kode: 'KD 3.6', kelas: 'Kelas VI', deskripsi: 'Menyelesaikan masalah yang berkaitan dengan operasi penjumlahan, pengurangan, perkalian dan pembagian yang melibatkan bilangan bulat negatif dalam kehidupan sehari-hari' },
        ],
        silabusImso: [
          'Pattern Recognition',
          'Counting Technique',
          'Recreational Mathematics such as mathematical puzzle',
        ],
      },
    ],
  },
  {
    id: 'ipa',
    nama: 'IPA (Ilmu Pengetahuan Alam)',
    deskripsi: 'Silabus OSN Bidang IPA SD/MI 2026 mencakup 13 bidang kajian komprehensif mulai dari Biologi, Ekologi, Fisika, Termodinamika, Astronomi hingga Struktur Atom.',
    warna: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    topics: [
      {
        id: 'ipa-1',
        nomor: 1,
        judul: 'Keterampilan dan Metode Ilmiah',
        lingkupMateri: [
          'Memahami proses dalam melakukan kegiatan dan alur berpikir ilmiah',
          'Metode perumusan hipotesis, observasi eksperimen, dan penarikan kesimpulan ilmiah',
        ],
        kompetensiDasar: [
          { kode: 'KI 3', kelas: 'Kelas IV', deskripsi: 'Memahami pengetahuan faktual dengan cara mengamati dan bertanya berdasarkan rasa ingin tahu tentang dirinya, makhluk ciptaan Tuhan dan kegiatannya, serta benda-benda yang dijumpainya di rumah, di sekolah dan tempat bermain' },
          { kode: 'KI 3', kelas: 'Kelas V', deskripsi: 'Memahami pengetahuan faktual dan konseptual dengan cara mengamati, bertanya, dan mencoba berdasarkan rasa ingin tahu tentang dirinya, makhluk ciptaan Tuhan dan kegiatannya, serta benda-benda yang dijumpainya di rumah, di sekolah dan tempat bermain' },
          { kode: 'KI 3', kelas: 'Kelas VI', deskripsi: 'Memahami pengetahuan faktual dan konseptual dengan cara mengamati, bertanya dan mencoba berdasarkan rasa ingin tahu tentang dirinya, makhluk ciptaan Tuhan dan kegiatannya, serta benda-benda yang dijumpainya di rumah, di sekolah dan tempat bermain' },
        ],
      },
      {
        id: 'ipa-2',
        nomor: 2,
        judul: 'Keanekaragaman Hayati dan Pengklasifikasian Makhluk Hidup',
        lingkupMateri: [
          'Keanekaragaman hayati, distribusi makhluk hidup, dan biodiversitas Indonesia',
          'Dasar-dasar klasifikasi makhluk hidup',
          'Klasifikasi makhluk hidup berdasarkan sistem lima kingdom (Monera, Protista, Fungi, Plantae, Animalia)',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.1', kelas: 'Kelas IV', deskripsi: 'Menganalisis hubungan antara bentuk dan fungsi bagian tubuh pada hewan dan tumbuhan' },
          { kode: 'KD 3.2', kelas: 'Kelas IV', deskripsi: 'Membandingkan siklus hidup beberapa jenis makhluk hidup serta mengaitkan dengan upaya pelestariannya' },
        ],
      },
      {
        id: 'ipa-3',
        nomor: 3,
        judul: 'Proses dan Mekanisme yang Terjadi pada Makhluk Hidup',
        lingkupMateri: [
          'Anatomi dan fisiologi pada sel dan jaringan',
          'Anatomi dan fisiologi pada hewan dan manusia (sistem gerak, pernapasan, pencernaan, peredaran darah, ekskresi, reproduksi)',
          'Anatomi dan fisiologi pada tumbuhan',
          'Metabolisme pada makhluk hidup (pertumbuhan dan perkembangan, fotosintesis, respirasi, serta proses fermentasi mikroorganisme)',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.1', kelas: 'Kelas IV', deskripsi: 'Menganalisis hubungan antara bentuk dan fungsi bagian tubuh pada hewan dan tumbuhan' },
          { kode: 'KD 3.4', kelas: 'Kelas IV', deskripsi: 'Menghubungkan gaya dengan gerak pada peristiwa di lingkungan sekitar' },
          { kode: 'KD 3.6', kelas: 'Kelas IV', deskripsi: 'Menerapkan sifat-sifat bunyi dan keterkaitannya dengan indra pendengaran' },
          { kode: 'KD 3.7', kelas: 'Kelas IV', deskripsi: 'Menerapkan sifat-sifat cahaya dan keterkaitannya dengan indra penglihatan' },
          { kode: 'KD 3.1', kelas: 'Kelas V', deskripsi: 'Menjelaskan alat gerak dan fungsinya pada hewan dan manusia serta cara memelihara kesehatan alat gerak manusia' },
          { kode: 'KD 3.2', kelas: 'Kelas V', deskripsi: 'Menjelaskan organ pernapasan dan fungsinya pada hewan dan manusia, serta cara memelihara kesehatan organ pernapasan manusia' },
          { kode: 'KD 3.3', kelas: 'Kelas V', deskripsi: 'Menjelaskan organ pencernaan dan fungsinya pada hewan dan manusia serta cara memelihara kesehatan organ pencernaan manusia' },
          { kode: 'KD 3.4', kelas: 'Kelas V', deskripsi: 'Menjelaskan organ peredaran darah dan fungsinya pada hewan dan manusia serta cara memelihara kesehatan organ peredaran darah manusia' },
          { kode: 'KD 3.1', kelas: 'Kelas VI', deskripsi: 'Membandingkan cara perkembangbiakan tumbuhan dan hewan' },
          { kode: 'KD 3.2', kelas: 'Kelas VI', deskripsi: 'Menghubungkan ciri pubertas pada laki-laki dan perempuan dengan kesehatan reproduksi' },
          { kode: 'KD 3.3', kelas: 'Kelas VI', deskripsi: 'Menganalisis cara makhluk hidup menyesuaikan diri dengan lingkungan' },
        ],
      },
      {
        id: 'ipa-4',
        nomor: 4,
        judul: 'Ekologi, Lingkungan, dan Pelestarian Sumber Daya Alam',
        lingkupMateri: [
          'Populasi, komunitas, dan ekosistem',
          'Interaksi organisme dan jejaring makanan (simbiosis, rantai & jaring-jaring makanan, piramida ekologi)',
          'Adaptasi makhluk hidup (morfologi, fisiologi, tingkah laku)',
          'Siklus materi, polusi, dan lingkungan (siklus air, karbon, nitrogen)',
          'Pelestarian sumber daya alam hayati dan keanekaragaman genetik',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.2', kelas: 'Kelas IV', deskripsi: 'Membandingkan siklus hidup beberapa jenis makhluk hidup serta mengaitkan dengan upaya pelestariannya' },
          { kode: 'KD 3.8', kelas: 'Kelas IV', deskripsi: 'Menjelaskan pentingnya upaya keseimbangan dan pelestarian sumber daya alam di lingkungannya' },
          { kode: 'KD 3.5', kelas: 'Kelas V', deskripsi: 'Menganalisis hubungan antar komponen ekosistem dan jaring-jaring makanan di lingkungan sekitar' },
          { kode: 'KD 3.8', kelas: 'Kelas V', deskripsi: 'Menganalisis siklus air dan dampaknya pada peristiwa di bumi serta kelangsungan makhluk hidup' },
        ],
      },
      {
        id: 'ipa-5',
        nomor: 5,
        judul: 'Isu Kesehatan Lingkungan dan Teknologi',
        lingkupMateri: [
          'Bioteknologi konvensional dan modern',
          'Isu kesehatan dan lingkungan (wabah penyakit, pencemaran air/udara/tanah, pemanasan global)',
          'Aplikasi sains dan teknologi untuk pengelolaan lingkungan ramah lingkungan (renewable tech, 3R)',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.2', kelas: 'Kelas IV', deskripsi: 'Membandingkan siklus hidup beberapa jenis makhluk hidup serta mengaitkan dengan upaya pelestariannya' },
          { kode: 'KD 3.8', kelas: 'Kelas IV', deskripsi: 'Menjelaskan pentingnya upaya keseimbangan dan pelestarian sumber daya alam di lingkungannya' },
        ],
      },
      {
        id: 'ipa-6',
        nomor: 6,
        judul: 'Mekanika',
        lingkupMateri: [
          'Gerak Benda (GLB, GLBB, gerak melingkar dasar)',
          'Gaya (gaya gesek, gaya otot, gaya pegas, hukum Newton)',
          'Momentum',
          'Energi Kinetik dan Potensial',
          'Tekanan (tekanan hidrostatis, hukum Pascal, bejana berhubungan)',
          'Gravitasi bumi dan hukum tarik menarik gravitasi',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.3', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi macam-macam gaya, antara lain: gaya otot, gaya listrik, gaya magnet, gaya gravitasi, dan gaya gesekan' },
          { kode: 'KD 3.4', kelas: 'Kelas IV', deskripsi: 'Menghubungkan gaya dengan gerak pada peristiwa di lingkungan sekitar' },
        ],
      },
      {
        id: 'ipa-7',
        nomor: 7,
        judul: 'Wujud Benda & Materi',
        lingkupMateri: [
          'Sifat dan kegunaan benda padat',
          'Sifat dan kegunaan benda cair (kapilaritas, viskositas, meniskus)',
          'Sifat dan kegunaan gas',
          'Zat tunggal (unsur, senyawa) dan campuran (homogen, heterogen, larutan, koloid, suspensi)',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.7', kelas: 'Kelas V', deskripsi: 'Menganalisis pengaruh kalor terhadap perubahan suhu dan wujud benda dalam kehidupan sehari-hari' },
          { kode: 'KD 3.9', kelas: 'Kelas V', deskripsi: 'Mengelompokkan materi dalam kehidupan sehari-hari berdasarkan komponen penyusunnya (zat tunggal dan campuran)' },
        ],
      },
      {
        id: 'ipa-8',
        nomor: 8,
        judul: 'Listrik & Magnet',
        lingkupMateri: [
          'Listrik Statis (muatan listrik, elektroskop, hukum Coulomb)',
          'Listrik Dinamis (arus listrik, tegangan, hambatan, rangkaian seri/paralel, hukum Ohm)',
          'Sifat Magnet (kutub magnet, medan magnet, feromagnetik)',
          'Induksi Elektromagnetik (generator, dinamo, transformator)',
          'Aplikasi Listrik dan Magnet dalam teknologi kehidupan sehari-hari',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.3', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi macam-macam gaya (gaya listrik, gaya magnet, gravitasi, gesekan)' },
          { kode: 'KD 3.5', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi berbagai sumber energi, perubahan bentuk energi, dan energi alternatif dalam kehidupan sehari-hari' },
          { kode: 'KD 3.4', kelas: 'Kelas VI', deskripsi: 'Mengidentifikasi komponen-komponen listrik dan fungsinya dalam rangkaian listrik sederhana' },
          { kode: 'KD 3.5', kelas: 'Kelas VI', deskripsi: 'Mengidentifikasi sifat-sifat magnet dalam kehidupan sehari-hari' },
          { kode: 'KD 3.6', kelas: 'Kelas VI', deskripsi: 'Menjelaskan cara menghasilkan, menyalurkan, dan menghemat energi listrik' },
        ],
      },
      {
        id: 'ipa-9',
        nomor: 9,
        judul: 'Gelombang & Optik',
        lingkupMateri: [
          'Osilasi Harmonik (frekuensi, periode, amplitudo)',
          'Gelombang Mekanik (tali, bunyi, resonansi, efek Doppler sederhana)',
          'Gelombang Elektromagnetik (spektrum cahaya)',
          'Sifat-sifat Gelombang (pemantulan, pembiasan, interferensi, difraksi)',
          'Alat Optik (mata, kacamata, cermin datar/cekung/cembung, lensa, mikroskop, periskop, lup)',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.6', kelas: 'Kelas IV', deskripsi: 'Menerapkan sifat-sifat bunyi dan keterkaitannya dengan indra pendengaran' },
          { kode: 'KD 3.7', kelas: 'Kelas IV', deskripsi: 'Menerapkan sifat-sifat cahaya dan keterkaitannya dengan indra penglihatan' },
        ],
      },
      {
        id: 'ipa-10',
        nomor: 10,
        judul: 'Suhu & Kalor',
        lingkupMateri: [
          'Skala Suhu (Celcius, Reamur, Fahrenheit, Kelvin & konversinya)',
          'Termometer dan prinsip pemuaian zat',
          'Hantaran Kalor (Konduksi, Konveksi, Radiasi)',
          'Perubahan Wujud karena Kalor (Asas Black, kalor jenis, kalor laten)',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.6', kelas: 'Kelas V', deskripsi: 'Menerapkan konsep perpindahan kalor dalam kehidupan sehari-hari' },
          { kode: 'KD 3.7', kelas: 'Kelas V', deskripsi: 'Menganalisis pengaruh kalor terhadap perubahan suhu dan wujud benda dalam kehidupan sehari-hari' },
        ],
      },
      {
        id: 'ipa-11',
        nomor: 11,
        judul: 'Bentuk Energi & Perubahannya',
        lingkupMateri: [
          'Energi Kimia',
          'Energi Listrik',
          'Energi Mekanik (Kinetik + Potensial)',
          'Energi Panas (Termal)',
          'Energi Nuklir',
          'Energi Gravitasi',
          'Energi Terbarukan (Surya, Angin, Hidro, Biomassa, Geotermal)',
          'Hukum Kekekalan Energi & Konversi Energi',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.5', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi berbagai sumber energi, perubahan bentuk energi, dan sumber energi alternatif (angin, air, matahari, panas bumi, bahan bakar organik, dan nuklir)' },
          { kode: 'KD 3.8', kelas: 'Kelas IV', deskripsi: 'Menjelaskan pentingnya upaya keseimbangan dan pelestarian sumber daya alam di lingkungannya' },
          { kode: 'KD 3.6', kelas: 'Kelas V', deskripsi: 'Menerapkan konsep perpindahan kalor dalam kehidupan sehari-hari' },
          { kode: 'KD 3.7', kelas: 'Kelas V', deskripsi: 'Menganalisis pengaruh kalor terhadap perubahan suhu dan wujud benda dalam kehidupan sehari-hari' },
          { kode: 'KD 3.6', kelas: 'Kelas VI', deskripsi: 'Menjelaskan cara menghasilkan, menyalurkan, dan menghemat energi listrik' },
        ],
      },
      {
        id: 'ipa-12',
        nomor: 12,
        judul: 'Bumi, Tata Surya & Antariksa',
        lingkupMateri: [
          'Struktur Lapisan Bumi (Kerak, Mantel, Inti Luar, Inti Dalam)',
          'Atmosfer Bumi (Troposfer, Stratosfer, Mesosfer, Termosfer, Eksosfer)',
          'Iklim, Cuaca, dan Musim',
          'Rotasi & Revolusi Benda Langit (Bumi, Bulan, Planet)',
          'Proses Terbentuknya Tata Surya',
          'Struktur Tata Surya (Matahari, Planet Dalam & Luar, Sabuk Asteroid, Komet, Meteor)',
          'Bintang & Rasi Bintang',
          'Galaksi (Bima Sakti, Andromeda) dan Alam Semesta',
          'Gerhana Bulan dan Gerhana Matahari',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.7', kelas: 'Kelas VI', deskripsi: 'Menjelaskan sistem tata surya dan karakteristik anggota tata surya' },
          { kode: 'KD 3.8', kelas: 'Kelas VI', deskripsi: 'Menjelaskan peristiwa rotasi dan revolusi bumi serta terjadinya gerhana bulan dan gerhana matahari' },
        ],
      },
      {
        id: 'ipa-13',
        nomor: 13,
        judul: 'Atom & Struktur Materi',
        lingkupMateri: [
          'Inti Atom (Nukleus: Proton dan Neutron)',
          'Muatan Listrik (Elektron pada kulit atom, ion positif/kation, ion negatif/anion)',
          'Interaksi Atom dan Pembentukan Senyawa',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.9 (Perluasan)', kelas: 'Kelas V', deskripsi: 'Mengelompokkan materi dalam kehidupan sehari-hari berdasarkan komponen penyusunnya (zat tunggal dan campuran)' },
        ],
      },
    ],
  },
  {
    id: 'ips',
    nama: 'IPS (Ilmu Pengetahuan Sosial)',
    deskripsi: 'Silabus OSN Bidang IPS SD/MI 2026 mencakup Geografi, Sosiologi, Ekonomi Nasional & ASEAN, serta Sejarah Perjuangan Bangsa Indonesia.',
    warna: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    topics: [
      {
        id: 'ips-1',
        nomor: 1,
        judul: 'Keterampilan dan Metode Ilmiah IPS',
        lingkupMateri: [
          'Memahami proses penalaran faktual, konseptual, dan observasi fenomena sosial kemasyarakatan',
          'Alur berpikir kritis dalam menganalisis data kependudukan dan peristiwa sosial budaya',
        ],
        kompetensiDasar: [
          { kode: 'KI 3', kelas: 'Kelas IV', deskripsi: 'Memahami pengetahuan faktual dengan cara mengamati dan menanya berdasarkan rasa ingin tahu tentang lingkungan sekitar, keluarga, dan masyarakat' },
          { kode: 'KI 3', kelas: 'Kelas V', deskripsi: 'Memahami pengetahuan faktual dan konseptual dengan cara mengamati, menanya, dan mencoba berdasarkan rasa ingin tahu fenomena sosial masyarakat' },
          { kode: 'KI 3', kelas: 'Kelas VI', deskripsi: 'Memahami pengetahuan faktual dan konseptual dengan cara menelaah dinamika kemasyarakatan, kebangsaan, dan kenegaraan' },
        ],
      },
      {
        id: 'ips-2',
        nomor: 2,
        judul: 'Kenampakan Fenomena Alam, Sosial dan Budaya',
        lingkupMateri: [
          'Peta, Atlas, dan Globe (Skala, simbol, letak koordinat)',
          'Letak Geografis dan Astronomis Indonesia',
          'Keanekaragaman Hayati dan Persebaran Fauna (Garis Wallace & Weber)',
          'Sumber Daya Alam (Hayati, Non-Hayati, Energi)',
          'Perubahan Wilayah Administrasi di Indonesia',
          'Kenampakan Alam dan Kondisi Sosial Kependudukan',
          'Gejala Alam (Gempa, Gunung Meletus, Tsunami, Siklon) dan Mitigasi Bencana',
          'Bentang Alam dan Kaitannya dengan Profesi & Mata Pencaharian Masyarakat',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.1', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi karakteristik ruang dan pemanfaatan sumber daya alam untuk kesejahteraan masyarakat dari tingkat kota/kabupaten sampai tingkat provinsi' },
          { kode: 'KD 3.1', kelas: 'Kelas V', deskripsi: 'Mengidentifikasi karakteristik geografis Indonesia sebagai negara kepulauan/maritim dan agraris serta pengaruhnya terhadap kehidupan ekonomi, sosial, budaya, komunikasi serta transportasi' },
          { kode: 'KD 3.1', kelas: 'Kelas VI', deskripsi: 'Mengidentifikasi karakteristik geografis dan kehidupan sosial budaya, ekonomi, politik di Wilayah ASEAN' },
        ],
      },
      {
        id: 'ips-3',
        nomor: 3,
        judul: 'Keragaman, Interaksi dan Perubahan Sosial',
        lingkupMateri: [
          'Lembaga Sosial (Keluarga, Pendidikan, Agama, Ekonomi, Politik)',
          'Nilai dan Norma Sosial',
          'Peran dan Tanggung Jawab Sosial Warga Negara',
          'Interaksi Sosial (Asosiatif & Disosiatif)',
          'Proses Sosial dalam Masyarakat Multikultural',
          'Keragaman Sosial Budaya (Suku, Bahasa Daerah, Rumah Adat, Tarian, Upacara Adat)',
          'Globalisasi, Modernisasi, dan Perubahan Sosial Budaya',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.2', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi keragaman sosial, ekonomi, budaya, etnis dan agama di provinsi setempat sebagai identitas bangsa Indonesia; serta hubungannya dengan karakteristik ruang' },
          { kode: 'KD 3.2', kelas: 'Kelas V', deskripsi: 'Menganalisis bentuk-bentuk interaksi manusia dengan lingkungan dan pengaruhnya terhadap pembangunan sosial, budaya, dan ekonomi masyarakat Indonesia' },
          { kode: 'KD 3.2', kelas: 'Kelas VI', deskripsi: 'Menganalisis perubahan sosial budaya dalam rangka modernisasi bangsa Indonesia' },
        ],
      },
      {
        id: 'ips-4',
        nomor: 4,
        judul: 'Kegiatan Ekonomi, Peran dan Posisi Indonesia dalam Ekonomi Global',
        lingkupMateri: [
          'Masalah Pokok Ekonomi (Produksi, Distribusi, Konsumsi)',
          'Nilai Guna Barang dan Jasa',
          'Uang, Perbankan, dan Lembaga Keuangan',
          'Kegiatan Ekonomi Negara ASEAN dan Perannya dalam Ekonomi Global (MEA)',
          'Peran Pelaku Ekonomi Indonesia (Rumah Tangga Konsumen, Produsen, Pemerintah, Luar Negeri)',
          'Kegiatan Ekspor dan Impor',
          'Ekonomi Maritim dan Agraris Indonesia',
          'Pembangunan Ekonomi Berkelanjutan (Green Economy)',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.3', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi kegiatan ekonomi dan hubungannya dengan berbagai bidang pekerjaan, serta kehidupan sosial dan budaya di lingkungan sekitar sampai provinsi' },
          { kode: 'KD 3.3', kelas: 'Kelas V', deskripsi: 'Menganalisis peran ekonomi dalam upaya menyejahterakan kehidupan di bidang sosial dan budaya untuk memperkuat kesatuan dan persatuan bangsa' },
          { kode: 'KD 3.3', kelas: 'Kelas VI', deskripsi: 'Menganalisis posisi dan peran Indonesia dalam kerjasama di bidang ekonomi, politik, sosial, budaya, teknologi, dan pendidikan dalam lingkup ASEAN' },
        ],
      },
      {
        id: 'ips-5',
        nomor: 5,
        judul: 'Perkembangan Sejarah Indonesia',
        lingkupMateri: [
          'Pembentukan awal budaya Masyarakat Indonesia (Zaman Praaksara/Prasejarah)',
          'Perkembangan Kerajaan Hindu-Buddha dalam Sejarah Indonesia (Kutai, Sriwijaya, Majapahit, Mataram Kuno, dll.)',
          'Pengaruh dan Kerajaan Islam dalam Sejarah Indonesia (Samudera Pasai, Demak, Mataram Islam, Banten, Gowa-Tallo, Ternate-Tidore)',
          'Proses dan Perkembangan Kolonialisme dan Imperialisme di Indonesia (VOC, Belanda, Inggris, Jepang)',
          'Perlawanan Rakyat Indonesia terhadap Kolonialisme (Perang Diponegoro, Padri, Pattimura, Aceh, Puputan, dll.)',
          'Perjuangan Mencapai Kemerdekaan Indonesia (Kebangkitan Nasional 1908, Sumpah Pemuda 1928, BPUPKI, PPKI, Proklamasi 17 Agustus 1945)',
          'Tokoh Lokal dan Nasional dalam Upaya Mencapai dan Mempertahankan Kemerdekaan',
        ],
        kompetensiDasar: [
          { kode: 'KD 3.4', kelas: 'Kelas IV', deskripsi: 'Mengidentifikasi kerajaan Hindu dan/atau Buddha, dan/atau Islam di lingkungan daerah setempat, serta pengaruhnya pada kehidupan masyarakat masa kini' },
          { kode: 'KD 3.4', kelas: 'Kelas V', deskripsi: 'Mengidentifikasi faktor-faktor penting penyebab penjajahan bangsa Indonesia dan upaya bangsa Indonesia dalam mempertahankan kedaulatannya' },
          { kode: 'KD 3.4', kelas: 'Kelas VI', deskripsi: 'Memahami makna proklamasi kemerdekaan, upaya mempertahankan kemerdekaan, dan upaya mengembangkan kehidupan kebangsaan yang sejahtera' },
        ],
      },
    ],
  },
];

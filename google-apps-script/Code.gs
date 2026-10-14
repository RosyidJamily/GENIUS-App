/**
 * =========================================================================
 * GENIUS APP - SDN TAMANSARI BACKEND (Google Apps Script / Code.gs)
 * Database Engine: Google Spreadsheet Multi-Role & Multi-User
 * Peran Didukung: Pengawas, KS, Guru, Pembina Ekskul, Murid, Orang Tua
 * =========================================================================
 * 
 * PANDUAN PENERAPAN (DEPLOYMENT):
 * 1. Buka Google Spreadsheet SDN TAMANSARI:
 *    https://docs.google.com/spreadsheets/d/1rW3dZ5y6N-rBkW8oA504v6j9XWfR9QWq4_bY_n72K40/edit
 * 2. Klik menu "Ekstensi" (Extensions) > "Apps Script".
 * 3. Hapus seluruh isi kode lama di Code.gs, lalu tempelkan (paste) seluruh kode ini.
 * 4. Klik ikon Simpan (Save).
 * 5. CARA MEMBUAT SELURUH TAB OTOMATIS:
 *    - Pada dropdown fungsi di sebelah tombol "Jalankan", pilih "initAllSheets".
 *    - Klik tombol "Jalankan" (Run) dan izinkan akses (Review Permissions > Akun > Lanjutan > Buka Project > Izinkan).
 * 6. CARA MENGHUBUNGKAN KE WEB APP:
 *    - Klik tombol biru "Terapkan" (Deploy) di pojok kanan atas > "Penerapan Baru" (New deployment).
 *    - Pilih jenis roda gigi: "Aplikasi Web" (Web app).
 *    - Deskripsi: GENIUS APP Web App API Multi-Role
 *    - Jalankan sebagai: Saya (Me / rosyidjamily22@gmail.com)
 *    - Siapa yang memiliki akses: Siapa saja (Anyone) -> WAJIB!
 *    - Klik "Terapkan" (Deploy) dan salin URL Web App yang berakhiran /exec.
 * =========================================================================
 */

// Konfigurasi Seluruh 14 Sheet Tab Sesuai 6 Peran & Master User
var SHEET_CONFIGS = {
  // 1. ROLE PENGAWAS
  SUPERVISI_PENGAWAS: {
    name: "Supervisi Pengawas",
    headers: [
      "Timestamp Input",
      "Tanggal Kunjungan",
      "Nama Pengawas",
      "NIP Pengawas",
      "Sasaran Supervisi",
      "Aspek Supervisi",
      "Temuan & Catatan Pembinaan",
      "Rekomendasi Mutu",
      "Rencana Tindak Lanjut Sekolah",
      "Status Foto"
    ]
  },

  // 2. ROLE KEPALA SEKOLAH (KS)
  JADWAL_SUPERVISI: {
    name: "Jadwal Supervisi",
    headers: [
      "Timestamp Input",
      "Hari",
      "Tanggal",
      "Waktu Pelaksanaan",
      "Nama Guru",
      "Kelas",
      "Pengawas / Asesor"
    ]
  },
  SUPERVISI: {
    name: "Supervisi Guru",
    headers: [
      "Timestamp Input",
      "Tanggal",
      "Nama Guru Disupervisi",
      "Mata Pelajaran",
      "Kelas",
      "Tahapan Supervisi",
      "Catatan / Hasil Evaluasi",
      "Rencana Tindak Lanjut",
      "Status Foto"
    ]
  },
  BUKU_KUNJUNGAN: {
    name: "Buku Kunjungan Tamu",
    headers: [
      "Timestamp Input",
      "Tanggal Kunjungan",
      "Nama Tamu / Pengunjung",
      "Instansi / Lembaga",
      "Maksud & Keperluan",
      "Bertemu Dengan",
      "Keterangan",
      "Status Foto"
    ]
  },
  BUKU_INVENTARIS: {
    name: "Buku Inventaris",
    headers: [
      "Timestamp Input",
      "Tanggal Masuk / Periksa",
      "Kode Barang",
      "Nama Sarana / Barang",
      "Jumlah Unit",
      "Kondisi Fisik",
      "Lokasi Penempatan",
      "Keterangan",
      "Status Foto"
    ]
  },

  // 3. ROLE GURU
  JURNAL_MENGAJAR: {
    name: "Jurnal Mengajar",
    headers: [
      "Timestamp Input",
      "Tanggal",
      "Nama Guru",
      "Kelas",
      "Presensi Kehadiran Siswa",
      "Siswa Tidak Hadir",
      "Sesi & Rincian Materi",
      "Kendala Pembelajaran",
      "Rencana Tindak Lanjut",
      "Suasana Kelas (Mood)",
      "Status Foto"
    ]
  },
  PEMBIASAAN: {
    name: "Pembiasaan",
    headers: [
      "Timestamp Input",
      "Tanggal Pelaksanaan",
      "Jenis Pembiasaan",
      "Koordinator",
      "Jumlah Peserta Siswa",
      "Deskripsi Kegiatan",
      "Hasil & Catatan Evaluasi",
      "Status Foto"
    ]
  },
  KOMBEL: {
    name: "Kombel GENIUS",
    headers: [
      "Timestamp Input",
      "Tanggal Pertemuan",
      "Topik Diskusi",
      "Narasumber / Pemateri",
      "Jumlah Peserta Guru",
      "Ringkasan Materi",
      "Praktik Baik / Hasil RTL",
      "Status Foto"
    ]
  },
  BUKU_KEJADIAN: {
    name: "Buku Kejadian",
    headers: [
      "Timestamp Input",
      "Tanggal Kejadian",
      "Nama Siswa",
      "Kelas",
      "Jenis Kejadian",
      "Deskripsi Kejadian",
      "Tindakan / Solusi",
      "Status Foto"
    ]
  },

  // 4. ROLE PEMBINA EKSKUL
  GENIUS_CLASS: {
    name: "GENIUS Class",
    headers: [
      "Timestamp Input",
      "Tanggal Pelaksanaan",
      "Program GENIUS",
      "Sub Kegiatan",
      "Bidang OSN",
      "Topik Silabus OSN 2026",
      "Lingkup Materi",
      "Kompetensi Dasar (KD)",
      "Nama Pembina",
      "Jumlah Peserta",
      "Uraian Kegiatan",
      "Hasil / Capaian Pembelajaran",
      "Status Foto"
    ]
  },
  BUKU_PERKEMBANGAN: {
    name: "Buku Perkembangan Siswa",
    headers: [
      "Timestamp Input",
      "Tanggal Pengamatan",
      "Nama Siswa",
      "Kelas",
      "Aspek Perkembangan",
      "Deskripsi Pengamatan",
      "Solusi / Tindak Lanjut",
      "Status Foto"
    ]
  },

  // 5. ROLE MURID
  SEVEN_HABITS: {
    name: "Seven Habits",
    headers: [
      "Timestamp Input",
      "Tanggal",
      "Guru Pembina / Wali Kelas",
      "Kelas",
      "Jumlah Siswa",
      "1. Bangun Pagi",
      "2. Beribadah",
      "3. Berolahraga",
      "4. Makan Sehat & Bergizi",
      "5. Gemar Belajar",
      "6. Bermasyarakat",
      "7. Tidur Cepat",
      "Catatan Refleksi",
      "Rencana Tindak Lanjut",
      "Status Foto"
    ]
  },

  // 6. ROLE ORANG TUA
  JURNAL_ORANG_TUA: {
    name: "Jurnal Orang Tua",
    headers: [
      "Timestamp Input",
      "Tanggal",
      "Nama Orang Tua / Wali",
      "Nama Siswa / Anak",
      "Kelas",
      "Jam Bangun & Keterangan",
      "Ibadah di Rumah",
      "Sarapan & Gizi Seimbang",
      "Belajar Mandiri di Rumah",
      "Jam Tidur Malam",
      "Pesan / Catatan untuk Guru",
      "Status Paraf Ortu",
      "Status Foto"
    ]
  },

  // MASTER USER SEMUA PERAN
  AKUN_PENGGUNA: {
    name: "Akun Pengguna",
    headers: [
      "Role",
      "Username",
      "Password",
      "Nama Lengkap",
      "NIP / NISN / No Kontak",
      "Kelas / Jabatan"
    ]
  }
};

/**
 * Mendapatkan Spreadsheet yang sedang aktif
 */
function getActiveSpreadsheet() {
  try {
    return SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    // ID Spreadsheet Target SDN TAMANSARI jika script dijalankan secara standalone
    var DEFAULT_ID = "1rW3dZ5y6N-rBkW8oA504v6j9XWfR9QWq4_bY_n72K40";
    return SpreadsheetApp.openById(DEFAULT_ID);
  }
}

/**
 * Helper response JSON
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * =========================================================================
 * FUNGSI UTAMA: INISIALISASI SELURUH SHEET
 * Pilih fungsi ini di Apps Script lalu klik "Jalankan" (Run)
 * =========================================================================
 */
function initAllSheets() {
  var ss = getActiveSpreadsheet();
  var created = [];

  for (var key in SHEET_CONFIGS) {
    var config = SHEET_CONFIGS[key];
    var sheet = ss.getSheetByName(config.name);

    if (!sheet) {
      sheet = ss.insertSheet(config.name);
      sheet.appendRow(config.headers);

      // Desain Header: Bold, Warna Indigo Elegan, Teks Putih, Bekukan Baris 1
      var hr = sheet.getRange(1, 1, 1, config.headers.length);
      hr.setFontWeight("bold");
      hr.setBackground("#4F46E5");
      hr.setFontColor("#FFFFFF");
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
    } else {
      // Jika sheet sudah ada tetapi baris 1 kosong
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(config.headers);
        var hrExist = sheet.getRange(1, 1, 1, config.headers.length);
        hrExist.setFontWeight("bold");
        hrExist.setBackground("#4F46E5");
        hrExist.setFontColor("#FFFFFF");
        sheet.setFrozenRows(1);
      }
    }
  }

  return {
    success: true,
    message: "Inisialisasi seluruh sheet multi-role berhasil!",
    createdSheets: created,
    totalSheets: ss.getSheets().length
  };
}

/**
 * Menambahkan data ke sheet tertentu
 */
function appendRowToSheet(sheetName, rowData) {
  var ss = getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    initAllSheets();
    sheet = ss.getSheetByName(sheetName);
  }

  sheet.appendRow(rowData);
  return {
    success: true,
    sheetName: sheetName,
    rowInserted: sheet.getLastRow()
  };
}

/**
 * Handler HTTP GET untuk Cek Status & Inisialisasi dari Web App
 */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : "ping";
  var ss = getActiveSpreadsheet();

  if (action === "ping") {
    return createJsonResponse({
      success: true,
      status: "online",
      appName: "GENIUS APP SDN TAMANSARI",
      spreadsheetTitle: ss.getName(),
      sheetsCount: ss.getSheets().length,
      timestamp: new Date().toISOString()
    });
  }

  if (action === "initSheets") {
    return createJsonResponse(initAllSheets());
  }

  // 1. Ambil seluruh akun dari sheet "Akun Pengguna"
  if (action === "getAccounts" || (action === "getData" && e.parameter && e.parameter.sheet === "Akun Pengguna")) {
    var accSheet = ss.getSheetByName("Akun Pengguna");
    if (!accSheet) {
      initAllSheets();
      accSheet = ss.getSheetByName("Akun Pengguna");
    }
    var lRow = accSheet.getLastRow();
    if (lRow <= 1) {
      return createJsonResponse({
        success: true,
        count: 0,
        accounts: [],
        message: "Sheet 'Akun Pengguna' belum memiliki data akun pengguna."
      });
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

    return createJsonResponse({
      success: true,
      count: accList.length,
      accounts: accList,
      timestamp: new Date().toISOString()
    });
  }

  // 2. Ambil data dari sheet "Seven Habits"
  if (action === "getSevenHabits" || (action === "getData" && e.parameter && (e.parameter.sheet === "Seven Habits" || e.parameter.sheet === "SevenHabits"))) {
    var shSheet = ss.getSheetByName("Seven Habits");
    if (!shSheet) {
      initAllSheets();
      shSheet = ss.getSheetByName("Seven Habits");
    }
    var lr = shSheet.getLastRow();
    if (lr <= 1) {
      return createJsonResponse({
        success: true,
        count: 0,
        entries: [],
        message: "Sheet 'Seven Habits' belum memiliki data."
      });
    }

    var shValues = shSheet.getRange(2, 1, lr - 1, 15).getValues();
    var shList = [];
    for (var j = 0; j < shValues.length; j++) {
      var rowItem = shValues[j];
      shList.push({
        id: "sh-row-" + (j + 1),
        timestamp: rowItem[0] ? String(rowItem[0]) : "",
        date: rowItem[1] ? String(rowItem[1]) : "",
        guru: rowItem[2] ? String(rowItem[2]) : "-",
        kelas: String(rowItem[3] || "").replace(/^Kelas\s+/i, ""),
        jumlahSiswa: Number(rowItem[4]) || 0,
        bangunPagi: String(rowItem[5] || "Terlaksana"),
        beribadah: String(rowItem[6] || "Terlaksana"),
        berolahraga: String(rowItem[7] || "Terlaksana"),
        makanSehat: String(rowItem[8] || "Terlaksana"),
        gemarBelajar: String(rowItem[9] || "Terlaksana"),
        bermasyarakat: String(rowItem[10] || "Terlaksana"),
        tidurCepat: String(rowItem[11] || "Terlaksana"),
        catatanRefleksi: rowItem[12] ? String(rowItem[12]) : "",
        tindakLanjut: rowItem[13] ? String(rowItem[13]) : "",
        fotoData: rowItem[14] ? String(rowItem[14]) : ""
      });
    }

    return createJsonResponse({
      success: true,
      count: shList.length,
      entries: shList,
      timestamp: new Date().toISOString()
    });
  }

  // 3. Generic getData untuk sheet tertentu
  if (action === "getData") {
    var sName = (e.parameter && e.parameter.sheet) ? e.parameter.sheet : "";
    var targetSheet = ss.getSheetByName(sName);
    if (!targetSheet) {
      return createJsonResponse({ success: false, message: "Sheet tidak ditemukan: " + sName, data: [] });
    }
    var lr = targetSheet.getLastRow();
    var lc = targetSheet.getLastColumn();
    if (lr <= 1 || lc < 1) {
      return createJsonResponse({ success: true, count: 0, data: [] });
    }
    var allData = targetSheet.getRange(2, 1, lr - 1, lc).getValues();
    return createJsonResponse({ success: true, count: allData.length, data: allData });
  }

  return createJsonResponse({
    success: false,
    message: "Action tidak dikenal: " + action
  });
}

/**
 * Handler HTTP POST untuk Menerima Pengiriman Data dari Form Web App
 */
function doPost(e) {
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else {
      payload = e.parameter || {};
    }

    var action = payload.action || "save";
    var timestamp = Utilities.formatDate(new Date(), "Asia/Jakarta", "dd/MM/yyyy HH:mm:ss");

    if (action === "initSheets") {
      return createJsonResponse(initAllSheets());
    }

    // 1. Pengawas
    if (action === "saveSupervisiPengawas") {
      var sp = payload.data || payload;
      var spRow = [
        timestamp,
        sp.date || "-",
        sp.pengawas || "-",
        sp.nip || "-",
        sp.sasaran || "-",
        sp.aspekSupervisi || "-",
        sp.temuan || "-",
        sp.rekomendasi || "-",
        sp.tindakLanjut || "-",
        sp.fotoData ? "Ada Dokumentasi Foto" : "Tanpa Foto"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("Supervisi Pengawas", spRow) });
    }

    // 2. Kepala Sekolah - Supervisi Guru
    if (action === "saveSupervisi") {
      var s = payload.data || payload;
      var sRow = [
        timestamp,
        s.date || "-",
        s.guru || "-",
        s.mapel || "-",
        "Kelas " + (s.kelas || "-"),
        s.tahapan || "-",
        s.hasil || "-",
        s.tindakLanjut || "-",
        s.fotoData ? "Ada Dokumentasi Foto" : "Tanpa Foto"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("Supervisi Guru", sRow) });
    }

    // 3. Guru - Jurnal Mengajar
    if (action === "saveJurnal") {
      var d = payload.data || payload;
      var sessText = Array.isArray(d.sessions) ? d.sessions.map(function(s, i) {
        return "[Sesi " + (i+1) + "] " + s.mapel + " - " + s.materi;
      }).join("\n") : "-";
      var abs = d.absensi ? ("Hadir: " + d.absensi.hadir + "/" + (d.absensi.totalSiswa || 0)) : "-";
      var row = [
        timestamp,
        d.date || "-",
        d.guru || "-",
        "Kelas " + (d.kelas || "-"),
        abs,
        (d.absensi && d.absensi.siswaTidakHadir) || "-",
        sessText,
        d.kendala || "-",
        d.rencana || "-",
        (d.mood || "NORMAL"),
        d.fotoData ? "Ada Dokumentasi Foto" : "Tanpa Foto"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("Jurnal Mengajar", row) });
    }

    // 4. Guru - Pembiasaan
    if (action === "savePembiasaan") {
      var p = payload.data || payload;
      var pRow = [
        timestamp,
        p.date || "-",
        p.kegiatan || "-",
        p.koordinator || "-",
        p.peserta || 0,
        p.deskripsi || "-",
        p.hasil || "-",
        p.fotoData ? "Ada Dokumentasi Foto" : "Tanpa Foto"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("Pembiasaan", pRow) });
    }

    // 5. Pembina Ekskul - GENIUS Class
    if (action === "saveGeniusClass") {
      var g = payload.data || payload;
      var gRow = [
        timestamp,
        g.date || "-",
        g.geniusClass || "-",
        g.subKegiatan || "-",
        g.bidangOsn || "-",
        g.topikOsnId || "-",
        (Array.isArray(g.lingkupMateri) ? g.lingkupMateri.join(", ") : "-"),
        (Array.isArray(g.kompetensiDasar) ? g.kompetensiDasar.join(", ") : "-"),
        g.pembina || "-",
        g.peserta || 0,
        g.kegiatan || "-",
        g.hasil || "-",
        g.fotoData ? "Ada Dokumentasi Foto" : "Tanpa Foto"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("GENIUS Class", gRow) });
    }

    // 6. Guru - Kombel GENIUS
    if (action === "saveKombel") {
      var k = payload.data || payload;
      var kRow = [
        timestamp,
        k.date || "-",
        k.topik || "-",
        k.pemateri || "-",
        k.peserta || 0,
        k.materi || "-",
        k.rtl || "-",
        k.fotoData ? "Ada Dokumentasi Foto" : "Tanpa Foto"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("Kombel GENIUS", kRow) });
    }

    // 7. Orang Tua - Jurnal Orang Tua
    if (action === "saveJurnalOrangTua") {
      var jot = payload.data || payload;
      var jotRow = [
        timestamp,
        jot.date || "-",
        jot.namaOrtu || "-",
        jot.namaAnak || "-",
        "Kelas " + (jot.kelas || "-"),
        jot.bangunPagi || "-",
        jot.ibadah || "-",
        jot.makanSehat || "-",
        jot.belajarMandiri || "-",
        jot.tidurCepat || "-",
        jot.pesanGuru || "-",
        jot.paraf ? "Telah Diparaf Orang Tua" : "Belum",
        jot.fotoData ? "Ada Dokumentasi Foto" : "Tanpa Foto"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("Jurnal Orang Tua", jotRow) });
    }

    // 8. Murid - Seven Habits
    if (action === "saveSevenHabits") {
      var sh = payload.data || payload;
      
      // Helper untuk mengambil rincian habit jika dikirim berupa array habits
      function getHabitText(habitKey, fallbackName) {
        if (sh[habitKey]) return String(sh[habitKey]);
        if (Array.isArray(sh.habits)) {
          for (var hIdx = 0; hIdx < sh.habits.length; hIdx++) {
            var item = sh.habits[hIdx];
            if (item && (item.id === habitKey || (item.name && item.name.toLowerCase().indexOf(fallbackName.toLowerCase()) !== -1))) {
              var stat = item.status === "sangat_baik" ? "Sangat Baik" :
                         item.status === "baik" ? "Baik" :
                         item.status === "cukup" ? "Cukup" :
                         item.status === "perlu_bimbingan" ? "Perlu Bimbingan" : (item.status || "Terlaksana");
              var extra = item.catatan ? " (" + item.catatan + ")" : "";
              return stat + extra;
            }
          }
        }
        return "Terlaksana";
      }

      var shRow = [
        timestamp,
        sh.date || "-",
        sh.guru || "-",
        "Kelas " + (sh.kelas || "-"),
        sh.siswaCount || sh.jumlahSiswa || 0,
        getHabitText("bangunPagi", "Bangun"),
        getHabitText("beribadah", "Ibadah"),
        getHabitText("berolahraga", "Olahraga"),
        getHabitText("makanSehat", "Makan"),
        getHabitText("gemarBelajar", "Belajar"),
        getHabitText("bermasyarakat", "Masyarakat"),
        getHabitText("tidurCepat", "Tidur"),
        sh.refleksi || sh.catatanRefleksi || "-",
        sh.rencanaLanjut || sh.tindakLanjut || "-",
        sh.fotoData ? "Ada Dokumentasi Foto" : "Tanpa Foto"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("Seven Habits", shRow) });
    }

    // 9. Master Akun Pengguna - Simpan / Tambah Akun
    if (action === "saveAkun" || action === "saveAccount") {
      var acc = payload.data || payload.account || payload;
      var accRow = [
        acc.role || "Guru",
        acc.username || "-",
        acc.password || "-",
        acc.name || acc.username || "-",
        acc.nip || "-",
        acc.kelas || acc.deskripsi || "-"
      ];
      return createJsonResponse({ success: true, result: appendRowToSheet("Akun Pengguna", accRow) });
    }

    // Perbarui Password Akun di Sheet 'Akun Pengguna'
    if (action === "updatePassword") {
      var targetUser = payload.username || (payload.data && payload.data.username);
      var targetNewPass = payload.newPassword || (payload.data && payload.data.newPassword);
      var accSheet = ss.getSheetByName("Akun Pengguna");
      if (!accSheet) {
        return createJsonResponse({ success: false, message: "Sheet Akun Pengguna tidak ditemukan" });
      }
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
      return createJsonResponse({
        success: found,
        message: found ? "Password akun berhasil diperbarui di Spreadsheet" : "Username tidak ditemukan di Spreadsheet"
      });
    }

    // Hapus Akun dari Sheet 'Akun Pengguna'
    if (action === "deleteAccount") {
      var delUser = payload.username || (payload.data && payload.data.username);
      var accSheet = ss.getSheetByName("Akun Pengguna");
      if (!accSheet) {
        return createJsonResponse({ success: false, message: "Sheet Akun Pengguna tidak ditemukan" });
      }
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
      return createJsonResponse({
        success: foundDel,
        message: foundDel ? "Akun berhasil dihapus dari Spreadsheet" : "Username tidak ditemukan di Spreadsheet"
      });
    }

    // Generic appendRow
    if (action === "appendRow") {
      return createJsonResponse({
        success: true,
        result: appendRowToSheet(payload.sheetName, payload.rowValues || [])
      });
    }

    return createJsonResponse({
      success: false,
      message: "Action tidak didukung: " + action
    });

  } catch (err) {
    return createJsonResponse({
      success: false,
      error: err.toString()
    });
  }
}

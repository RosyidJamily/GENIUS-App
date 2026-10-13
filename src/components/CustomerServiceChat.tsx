import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Headphones,
  X,
  Send,
  HelpCircle,
  MessageCircle,
  Phone,
  Sparkles,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  time: string;
  hasWaAction?: boolean;
  waQueryText?: string;
}

const ADMIN_WA_NUMBER = '085704005011';
const ADMIN_WA_LINK = 'https://wa.me/6285704005011';

export const CustomerServiceChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: 'Halo! Selamat datang di Layanan Bantuan & Customer Service GENIUS SDN Tamansari. Layanan chat ini terhubung langsung dengan Admin (WA: 085704005011).',
      time: 'Baru saja',
      hasWaAction: true,
      waQueryText: 'Halo Admin GENIUS SDN Tamansari, saya ingin berkonsultasi seputar aplikasi.',
    },
    {
      id: 'm-2',
      sender: 'bot',
      text: 'Anda dapat bertanya di sini atau langsung menghubungkan chat ke WhatsApp Admin kami melalui tombol WhatsApp yang tersedia.',
      time: 'Baru saja',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    {
      id: 'wa',
      label: '💬 Chat WA Admin (085704005011)',
      isDirectWa: true,
      waText: 'Halo Admin GENIUS SDN Tamansari (085704005011), saya butuh bantuan terkait aplikasi.',
    },
    { id: 'rekap', label: '📑 Rekap & Unduh Excel/Word/PDF' },
    { id: 'seven-habits', label: '🌟 Seven Habits (7 Kebiasaan Anak Hebat)' },
    { id: 'jurnal-jam12', label: '⏰ Batas Jurnal Jam 12 Siang & Absensi' },
    { id: 'sheet', label: '📊 Input Otomatis Masuk Google Sheet' },
    { id: 'login', label: '🔑 Cara login Guru / Kepala Sekolah' },
    { id: 'supervisi', label: '📈 Instrumen Supervisi & Radar' },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const openWhatsApp = (customText?: string) => {
    const text = customText || 'Halo Admin GENIUS SDN Tamansari, saya ingin bertanya terkait aplikasi.';
    const url = `${ADMIN_WA_LINK}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSendToWhatsAppDirect = () => {
    const query = inputMessage.trim();
    if (!query) {
      openWhatsApp();
      return;
    }
    openWhatsApp(`Halo Admin GENIUS (085704005011), saya ingin bertanya:\n\n"${query}"`);
    setInputMessage('');
  };

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const qLower = query.toLowerCase();

      if (
        qLower.includes('rekap') ||
        qLower.includes('excel') ||
        qLower.includes('word') ||
        qLower.includes('pdf') ||
        qLower.includes('unduh') ||
        qLower.includes('download')
      ) {
        reply =
          'Menu Rekapitulasi & Unduh tersedia di halaman "Monitoring Kepala Sekolah". Anda dapat mengunduh seluruh data input dari semua fitur (Jurnal Mengajar, Supervisi, Pembiasaan, GENIUS Class/OSN 2026, Kombel, dan Administrasi) dalam format Excel (.xlsx), Word (.doc dengan Kop Surat), dan PDF (.pdf) resmi secara instan!';
      } else if (
        qLower.includes('12') ||
        qLower.includes('jam 12') ||
        qLower.includes('siang') ||
        qLower.includes('absensi') ||
        qLower.includes('presensi') ||
        qLower.includes('jurnal')
      ) {
        reply =
          'Sesuai ketentuan sekolah, batas waktu pengisian Jurnal Mengajar dan Absensi/Presensi Siswa harian adalah maksimal pukul 12:00 siang WIB. Jika guru belum mengisi hingga jam 12:00 siang, sistem secara otomatis memunculkan notifikasi peringatan di lonceng notifikasi, banner dashboard, dan laporan monitoring Kepala Sekolah.';
      } else if (
        qLower.includes('seven') ||
        qLower.includes('habit') ||
        qLower.includes('7 kebiasaan') ||
        qLower.includes('kebiasaan') ||
        qLower.includes('anak hebat')
      ) {
        reply =
          'Halaman khusus "Seven Habits" (Jurnal 7 Kebiasaan Anak Hebat Indonesia) telah tersedia di GENIUS App: 1. Bangun pagi (disiplin & menghargai waktu), 2. Beribadah (fondasi spiritual & moral), 3. Berolahraga (kebugaran fisik & mental), 4. Makan sehat & bergizi (nutrisi seimbang), 5. Gemar belajar (semangat sepanjang hayat), 6. Bermasyarakat (gotong royong & peduli sesama), dan 7. Tidur cepat (pemulihan energi). Anda dapat mengakses menu ini langsung dari Dashboard atau menu Tambah Cepat.';
      } else if (
        qLower.includes('sheet') ||
        qLower.includes('google') ||
        qLower.includes('spreadsheet') ||
        qLower.includes('simpan') ||
        qLower.includes('otomatis')
      ) {
        reply =
          'Semua hasil input (GENIUS Class, Jurnal Mengajar, Pembiasaan, Supervisi, Kombel, Administrasi) otomatis tersinkronisasi langsung ke Google Sheet resmi sistem (ID: 1axsdnznagOYvvZdFicRK42RcKIVqCDpTfKue3McQlxU). Menu manual telah disederhanakan agar Bapak/Ibu Guru cukup mengisi form dan menekan "Simpan" tanpa langkah tambahan.';
      } else if (
        qLower.includes('login') ||
        qLower.includes('masuk') ||
        qLower.includes('password') ||
        qLower.includes('kata sandi') ||
        qLower.includes('akun')
      ) {
        reply =
          'Akun pengguna GENIUS kini terintegrasi langsung dengan database Google Spreadsheet resmi pada sheet "Akun Pengguna".\n\nSeluruh peran (Pengawas, Kepala Sekolah, Guru, Pembina Ekskul, Murid, Orang Tua, dan Admin) menggunakan username & password yang diatur di sheet spreadsheet tersebut tanpa akun dummy. Anda dapat menekan tombol "Sinkronkan Akun" di halaman login untuk memuat akun terbaru.';
      } else if (
        qLower.includes('supervisi') ||
        qLower.includes('radar') ||
        qLower.includes('observasi')
      ) {
        reply =
          'Form Supervisi Guru memiliki 3 tahapan: Pra Observasi (9 instrumen), Observasi (10 instrumen), dan Pasca Observasi. Skala 1-4 akan otomatis diakumulasikan dalam Kurva Radar di menu Monitoring Kepala Sekolah.';
      } else if (
        qLower.includes('upload') ||
        qLower.includes('foto') ||
        qLower.includes('gambar')
      ) {
        reply =
          'Pastikan format foto JPG atau PNG dengan ukuran maksimal 5MB. Anda dapat mengunggah langsung dari galeri HP atau memotret langsung dengan kamera perangkat.';
      } else if (
        qLower.includes('wa') ||
        qLower.includes('whatsapp') ||
        qLower.includes('admin') ||
        qLower.includes('kontak') ||
        qLower.includes('cs') ||
        qLower.includes('nomor')
      ) {
        reply =
          'Admin Resmi GENIUS SDN Tamansari dapat dihubungi via WhatsApp di nomor 085704005011. Klik tombol hijau di bawah untuk langsung membuka chat WhatsApp dengan admin.';
      } else {
        reply = `Terima kasih atas pertanyaannya mengenai "${query}". Tim Customer Service & Admin SDN Tamansari siap membantu. Untuk solusi cepat, Anda dapat langsung menghubungkan chat ini ke WhatsApp Admin (085704005011).`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          hasWaAction: true,
          waQueryText: `Halo Admin GENIUS (085704005011), saya mau menanyakan lebih lanjut tentang:\n"${query}"`,
        },
      ]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-24 right-5 z-40 h-14 px-4 rounded-2xl bg-gradient-to-tr from-[#6C63FF] via-[#7B73FF] to-emerald-500 text-white shadow-xl shadow-indigo-500/30 flex items-center gap-2.5 transition-all ${
          isOpen ? 'scale-0 pointer-events-none opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Customer Service & WA Admin"
      >
        <div className="relative">
          <Headphones className="w-5 h-5 animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border border-white rounded-full"></span>
        </div>
        <span className="text-xs font-bold hidden sm:inline tracking-tight">CS & WA Admin</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            className="fixed bottom-20 right-3 sm:right-6 z-50 w-[calc(100vw-1.5rem)] sm:w-[400px] h-[540px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#6C63FF] to-[#8A85FF] text-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-none flex items-center gap-1.5">
                      <span>CS & Bantuan GENIUS</span>
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-[11px] text-indigo-100 font-medium">
                        Online • SDN Tamansari
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Quick Direct WhatsApp Button in Header */}
                  <button
                    onClick={() => openWhatsApp()}
                    title="Buka Chat WhatsApp Admin (085704005011)"
                    className="p-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center gap-1 text-xs font-bold transition-colors shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="text-[11px]">WA Admin</span>
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
                    aria-label="Tutup Chat"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* WA Admin banner info inside header */}
              <div className="mt-3 pt-2.5 border-t border-white/15 flex items-center justify-between text-[11px]">
                <span className="text-indigo-100 flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-300" />
                  <span>WA Admin: <strong className="text-white font-mono">085704005011</strong></span>
                </span>
                <button
                  onClick={() => openWhatsApp()}
                  className="underline text-emerald-200 hover:text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <span>Chat Sekarang</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    m.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-xs ${
                      m.sender === 'user'
                        ? 'bg-[#6C63FF] text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
                    }`}
                  >
                    {m.text}

                    {/* WhatsApp Action Button in Bot Reply */}
                    {m.hasWaAction && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => openWhatsApp(m.waQueryText)}
                          className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 text-emerald-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Hubungkan ke WhatsApp Admin (085704005011)</span>
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">{m.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white border border-slate-100 px-3 py-2 rounded-2xl w-fit text-xs text-slate-500 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#6C63FF] animate-spin" />
                  <span>Sedang memproses jawaban...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Chips */}
            <div className="p-2.5 bg-white border-t border-slate-100 overflow-x-auto flex gap-1.5 no-scrollbar">
              {quickQuestions.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    if (q.isDirectWa) {
                      openWhatsApp(q.waText);
                    } else {
                      handleSend(q.label);
                    }
                  }}
                  className={`whitespace-nowrap shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                    q.isDirectWa
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-[#6C63FF]/10 hover:text-[#6C63FF] text-slate-600'
                  }`}
                >
                  {q.isDirectWa && <Phone className="w-3 h-3" />}
                  <span>{q.label}</span>
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Tulis pesan atau pertanyaan..."
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-slate-100 text-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/30 placeholder:text-slate-400"
              />

              {/* Direct Send to WhatsApp button */}
              <button
                type="button"
                onClick={handleSendToWhatsAppDirect}
                title="Kirim pesan ini ke WhatsApp Admin (085704005011)"
                className="h-10 px-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white flex items-center justify-center gap-1 text-xs font-bold transition-all shadow-sm shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Kirim WA</span>
              </button>

              {/* In-app CS Chat Send button */}
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                title="Kirim ke Chat CS"
                className="w-10 h-10 rounded-2xl bg-[#6C63FF] disabled:opacity-40 text-white flex items-center justify-center hover:bg-[#5651D9] active:scale-95 transition-all shrink-0 shadow-md shadow-indigo-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

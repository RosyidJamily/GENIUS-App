import React, { useState } from 'react';
import { motion } from 'motion/react';
import { GENIUS_CLASS_LIST, GURU_LIST } from '../data/initialData';
import { SILABUS_OSN_2026, BidangSilabus, SilabusTopic } from '../data/silabusOsn2026';
import { GeniusClassData } from '../types';
import { ImageUpload } from '../components/ImageUpload';
import { SilabusOsnModal } from '../components/SilabusOsnModal';
import {
  ArrowLeft,
  Trophy,
  Flame,
  Drum,
  Flag,
  FlaskConical,
  Palette,
  BookOpen,
  Save,
  Check,
  Award,
  Sparkles,
  Layers,
  FileText,
  Search,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

interface GeniusClassViewProps {
  onBack: () => void;
  onSave: (data: GeniusClassData) => void;
}

export const GeniusClassView: React.FC<GeniusClassViewProps> = ({
  onBack,
  onSave,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('mipas');
  const [subKegiatan, setSubKegiatan] = useState('Matematika');
  const [pembina, setPembina] = useState('Muhammad Hasan Bisri, S.Pd');
  const [peserta, setPeserta] = useState<number>(24);
  const [kegiatan, setKegiatan] = useState('');
  const [hasil, setHasil] = useState('');
  const [fotoData, setFotoData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // OSN 2026 State for MIPAS Club
  const [isSilabusModalOpen, setIsSilabusModalOpen] = useState(false);
  const [selectedOsnTopicId, setSelectedOsnTopicId] = useState<string>('mat-1');
  const [selectedLingkupMateri, setSelectedLingkupMateri] = useState<string[]>([
    'Bilangan Cacah',
    'Kelipatan Persekutuan Terkecil (KPK)',
    'Persekutuan Terbesar (FPB)',
  ]);
  const [selectedKd, setSelectedKd] = useState<string[]>([
    '[Kelas IV KD 3.6] Menjelaskan dan menentukan faktor persekutuan, FPB, kelipatan persekutuan, dan KPK dari dua bilangan',
  ]);

  const activeClassObj = GENIUS_CLASS_LIST.find((c) => c.id === selectedClass);

  // Derive OSN Bidang from subKegiatan ('Matematika' | 'IPA' | 'IPS')
  const currentBidangSilabus: BidangSilabus = React.useMemo(() => {
    const norm = (subKegiatan || '').toLowerCase();
    if (norm.includes('ipa')) {
      return SILABUS_OSN_2026.find((b) => b.id === 'ipa') || SILABUS_OSN_2026[1];
    }
    if (norm.includes('ips')) {
      return SILABUS_OSN_2026.find((b) => b.id === 'ips') || SILABUS_OSN_2026[2];
    }
    return SILABUS_OSN_2026.find((b) => b.id === 'matematika') || SILABUS_OSN_2026[0];
  }, [subKegiatan]);

  // Current active topic within active bidang
  const currentTopic: SilabusTopic = React.useMemo(() => {
    return (
      currentBidangSilabus.topics.find((t) => t.id === selectedOsnTopicId) ||
      currentBidangSilabus.topics[0]
    );
  }, [currentBidangSilabus, selectedOsnTopicId]);

  const handleClassChange = (classId: string) => {
    setSelectedClass(classId);
    const obj = GENIUS_CLASS_LIST.find((c) => c.id === classId);
    if (obj?.sub && obj.sub.length > 0) {
      setSubKegiatan(obj.sub[0]);
      if (classId === 'mipas') {
        setSelectedOsnTopicId(SILABUS_OSN_2026[0].topics[0].id);
      }
    } else {
      setSubKegiatan('');
    }
  };

  const handleSubBidangChange = (sub: string) => {
    setSubKegiatan(sub);
    const norm = sub.toLowerCase();
    if (norm.includes('ipa')) {
      setSelectedOsnTopicId(SILABUS_OSN_2026[1].topics[0].id);
      setSelectedLingkupMateri(SILABUS_OSN_2026[1].topics[0].lingkupMateri.slice(0, 2));
      setSelectedKd([
        `[${SILABUS_OSN_2026[1].topics[0].kompetensiDasar[0].kelas} ${SILABUS_OSN_2026[1].topics[0].kompetensiDasar[0].kode}] ${SILABUS_OSN_2026[1].topics[0].kompetensiDasar[0].deskripsi}`,
      ]);
    } else if (norm.includes('ips')) {
      setSelectedOsnTopicId(SILABUS_OSN_2026[2].topics[0].id);
      setSelectedLingkupMateri(SILABUS_OSN_2026[2].topics[0].lingkupMateri.slice(0, 2));
      setSelectedKd([
        `[${SILABUS_OSN_2026[2].topics[0].kompetensiDasar[0].kelas} ${SILABUS_OSN_2026[2].topics[0].kompetensiDasar[0].kode}] ${SILABUS_OSN_2026[2].topics[0].kompetensiDasar[0].deskripsi}`,
      ]);
    } else {
      setSelectedOsnTopicId(SILABUS_OSN_2026[0].topics[0].id);
      setSelectedLingkupMateri(SILABUS_OSN_2026[0].topics[0].lingkupMateri.slice(0, 2));
      setSelectedKd([
        `[${SILABUS_OSN_2026[0].topics[0].kompetensiDasar[0].kelas} ${SILABUS_OSN_2026[0].topics[0].kompetensiDasar[0].kode}] ${SILABUS_OSN_2026[0].topics[0].kompetensiDasar[0].deskripsi}`,
      ]);
    }
  };

  const handleSelectTopicDirect = (topic: SilabusTopic) => {
    setSelectedOsnTopicId(topic.id);
    setSelectedLingkupMateri(topic.lingkupMateri.slice(0, 3));
    if (topic.kompetensiDasar.length > 0) {
      setSelectedKd([
        `[${topic.kompetensiDasar[0].kelas} ${topic.kompetensiDasar[0].kode}] ${topic.kompetensiDasar[0].deskripsi}`,
      ]);
    }
  };

  const handleToggleLingkupMateri = (mat: string) => {
    setSelectedLingkupMateri((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const handleToggleKd = (kdStr: string) => {
    setSelectedKd((prev) =>
      prev.includes(kdStr) ? prev.filter((k) => k !== kdStr) : [...prev, kdStr]
    );
  };

  const applyOsnSelectionToForm = (
    topicJudul: string,
    materiList: string[],
    kdList: string[]
  ) => {
    const formattedKegiatan = `[Silabus OSN 2026 - ${currentBidangSilabus.nama}] Topik: ${topicJudul}\n\n• Lingkup Materi:\n${materiList
      .map((m) => `  - ${m}`)
      .join('\n')}\n\n• Kompetensi Dasar (KD):\n${kdList
      .map((k) => `  - ${k}`)
      .join('\n')}\n\n• Aktivitas Pembinaan: Pendalaman konsep dasar, latihan soal HOTS tingkat kabupaten/provinsi, dan pembahasan penalaran terstruktur.`;

    const formattedHasil = `Siswa memahami konsep ${topicJudul} (${materiList.join(
      ', '
    )}) dengan baik. Mampu menyelesaikan soal latihan olimpiade sains kategori tingkat dasar dan menengah secara mandiri.`;

    setKegiatan(formattedKegiatan);
    setHasil(formattedHasil);
  };

  const handleApplyFromModal = (data: {
    bidang: string;
    topicJudul: string;
    lingkupMateri: string[];
    kompetensiDasar: string[];
  }) => {
    setSubKegiatan(data.bidang);
    setSelectedLingkupMateri(data.lingkupMateri);
    setSelectedKd(data.kompetensiDasar);
    applyOsnSelectionToForm(data.topicJudul, data.lingkupMateri, data.kompetensiDasar);
  };

  const getClassIcon = (id: string) => {
    switch (id) {
      case 'pramuka':
        return <Flame className="w-5 h-5" />;
      case 'drumband':
        return <Drum className="w-5 h-5" />;
      case 'paskibra':
        return <Flag className="w-5 h-5" />;
      case 'mipas':
        return <FlaskConical className="w-5 h-5" />;
      case 'art':
        return <Palette className="w-5 h-5" />;
      case 'sport':
        return <Trophy className="w-5 h-5" />;
      case 'qurani':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Trophy className="w-5 h-5" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pembina.trim()) {
      alert('Silakan isi nama pembina');
      return;
    }
    if (!kegiatan.trim()) {
      alert('Silakan isi kegiatan ekstrakurikuler');
      return;
    }
    if (!hasil.trim()) {
      alert('Silakan isi hasil kegiatan');
      return;
    }

    setIsSubmitting(true);

    const data: GeniusClassData = {
      date,
      geniusClass: activeClassObj?.name || selectedClass,
      subKegiatan: subKegiatan || undefined,
      bidangOsn: selectedClass === 'mipas' ? currentBidangSilabus.nama : undefined,
      topikOsnId: selectedClass === 'mipas' ? currentTopic.id : undefined,
      lingkupMateri: selectedClass === 'mipas' ? selectedLingkupMateri : undefined,
      kompetensiDasar: selectedClass === 'mipas' ? selectedKd : undefined,
      pembina,
      peserta: Number(peserta) || 0,
      kegiatan,
      hasil,
      fotoData,
    };

    setTimeout(() => {
      onSave(data);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors shadow-xs"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dashboard</span>
      </button>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-indigo-900/5"
      >
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 text-white flex items-center justify-center shadow-md shadow-pink-500/20">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                  Jurnal GENIUS Class
                </h2>
                {selectedClass === 'mipas' && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold uppercase">
                    Silabus OSN 2026
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Pengembangan minat, bakat sains, dan prestasi ekstrakurikuler siswa SDN Tamansari
              </p>
            </div>
          </div>

          {selectedClass === 'mipas' && (
            <button
              type="button"
              onClick={() => setIsSilabusModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-[#6C63FF] border border-indigo-200 text-xs font-bold transition-all flex items-center gap-2 shadow-xs shrink-0 self-start sm:self-center"
            >
              <Award className="w-4 h-4" />
              <span>Buka Silabus OSN 2026</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Header Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Tanggal Kegiatan *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Nama Pembina / Pelatih *
              </label>
              <input
                type="text"
                required
                placeholder="Nama Pembina..."
                value={pembina}
                onChange={(e) => setPembina(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Jumlah Peserta Siswa *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  required
                  value={peserta}
                  onChange={(e) => setPeserta(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-pink-500"
                />
                <span className="absolute right-4 top-3 text-xs text-slate-400 font-semibold">
                  Siswa
                </span>
              </div>
            </div>
          </div>

          {/* Program Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
              Pilih Program GENIUS Class
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {GENIUS_CLASS_LIST.map((item) => {
                const isSelected = selectedClass === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleClassChange(item.id)}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all group ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50 text-pink-800 shadow-sm ring-2 ring-pink-500/20'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${
                        isSelected
                          ? 'bg-pink-500 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:text-pink-600'
                      }`}
                    >
                      {getClassIcon(item.id)}
                    </div>
                    <div>
                      <span className="font-bold text-xs line-clamp-1">{item.name}</span>
                      {item.id === 'mipas' && (
                        <span className="text-[10px] text-emerald-600 font-semibold block">
                          OSN 2026 Ready
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sub-kegiatan chips */}
          {activeClassObj?.sub && activeClassObj.sub.length > 0 && (
            <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-2">
              <label className="block text-xs font-bold text-pink-900 uppercase tracking-wider">
                Pilih Sub-Bidang / Cabang:
              </label>
              <div className="flex flex-wrap gap-2">
                {activeClassObj.sub.map((sub) => {
                  const isSelected = subKegiatan === sub;
                  return (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => handleSubBidangChange(sub)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-pink-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 hover:bg-pink-100/60 border border-pink-200'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                      <span>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SPECIAL MIPAS CLUB SECTION: SILABUS OSN 2026 (KOMPETENSI DASAR & LINGKUP) */}
          {/* ========================================================================= */}
          {selectedClass === 'mipas' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-indigo-50/70 to-slate-50 border-2 border-indigo-200/80 space-y-5"
            >
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#6C63FF] text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">
                      Pedoman Silabus OSN 2026: Bidang {currentBidangSilabus.nama}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Pilih pokok materi dan kompetensi dasar untuk disematkan ke jurnal MIPAS Club
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    applyOsnSelectionToForm(
                      currentTopic.judul,
                      selectedLingkupMateri,
                      selectedKd
                    )
                  }
                  className="px-4 py-2 rounded-xl bg-[#6C63FF] hover:bg-[#584FE4] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition-all self-start sm:self-center"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Sematkan ke Form</span>
                </button>
              </div>

              {/* 1. Topik Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#6C63FF]" />
                  <span>Pilih Topik Bahasan Silabus:</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {currentBidangSilabus.topics.map((t) => {
                    const isSelected = currentTopic.id === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTopicDirect(t)}
                        className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? 'border-[#6C63FF] bg-white text-[#6C63FF] shadow-sm ring-1 ring-[#6C63FF]'
                            : 'border-slate-200 bg-white/70 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-extrabold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-[#6C63FF] text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {t.nomor}
                        </span>
                        <div className="min-w-0">
                          <span className="line-clamp-1">{t.judul}</span>
                          <span className="text-[10px] text-slate-400 font-normal block">
                            {t.lingkupMateri.length} Materi • {t.kompetensiDasar.length} KD
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Lingkup Materi Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#6C63FF]" />
                  <span>Lingkup Materi ({currentTopic.judul}):</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentTopic.lingkupMateri.map((mat, mIdx) => {
                    const isChecked = selectedLingkupMateri.includes(mat);
                    return (
                      <button
                        key={mIdx}
                        type="button"
                        onClick={() => handleToggleLingkupMateri(mat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border flex items-center gap-2 ${
                          isChecked
                            ? 'bg-[#6C63FF] text-white border-[#6C63FF] shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] ${
                            isChecked ? 'bg-white text-[#6C63FF]' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && '✓'}
                        </span>
                        <span>{mat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Kompetensi Dasar Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Kompetensi Dasar Terkait (Kurikulum SD Kelas III - VI):</span>
                </label>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {currentTopic.kompetensiDasar.map((kd, kIdx) => {
                    const kdFull = `[${kd.kelas} ${kd.kode}] ${kd.deskripsi}`;
                    const isChecked = selectedKd.includes(kdFull);
                    return (
                      <div
                        key={kIdx}
                        onClick={() => handleToggleKd(kdFull)}
                        className={`p-3 rounded-2xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked
                            ? 'bg-emerald-50/90 border-emerald-400 text-emerald-950 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center text-[10px] shrink-0 ${
                            isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                          }`}
                        >
                          {isChecked && '✓'}
                        </span>
                        <div className="space-y-0.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                              {kd.kelas}
                            </span>
                            <span className="font-extrabold text-xs text-emerald-700">
                              {kd.kode}
                            </span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-slate-600">
                            {kd.deskripsi}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Silabus IMSO strip (if available) */}
              {currentTopic.silabusImso && currentTopic.silabusImso.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs">
                  <span className="font-bold text-amber-900 text-[11px] uppercase tracking-wider block mb-1">
                    Silabus IMSO (International Math & Science Olympiad):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentTopic.silabusImso.map((im, imIdx) => (
                      <span
                        key={imIdx}
                        className="px-2.5 py-0.5 rounded-lg bg-white border border-amber-200 text-amber-900 text-[10px] font-medium"
                      >
                        {im}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Kegiatan & Hasil Textareas */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Materi / Kegiatan yang Dilakukan *
                </label>
                {selectedClass === 'mipas' && (
                  <span className="text-[11px] text-[#6C63FF] font-semibold">
                    Terintegrasi dengan Silabus OSN 2026
                  </span>
                )}
              </div>
              <textarea
                rows={4}
                required
                placeholder="Jelaskan topik materi, kompetensi dasar, metode latihan, serta modul pembinaan olimpiade..."
                value={kegiatan}
                onChange={(e) => setKegiatan(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-pink-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Hasil & Capaian Pembelajaran Siswa *
              </label>
              <textarea
                rows={3}
                required
                placeholder="Hasil latihan, evaluasi pemahaman konsep, progres pemecahan soal HOTS siswa..."
                value={hasil}
                onChange={(e) => setHasil(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-pink-500 leading-relaxed"
              />
            </div>
          </div>

          {/* Upload Foto */}
          <ImageUpload
            label="Upload Foto Kegiatan GENIUS Class"
            value={fotoData}
            onChange={setFotoData}
            helperText="Lampirkan foto saat bimbingan materi atau simulasi olimpiade sains (maks. 5MB)"
          />

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-xs shadow-xl shadow-pink-500/25 hover:shadow-pink-500/40 hover:opacity-95 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Jurnal GENIUS Class'}</span>
            </button>
          </div>
        </form>
      </motion.div>

      {/* Silabus OSN Modal */}
      <SilabusOsnModal
        isOpen={isSilabusModalOpen}
        onClose={() => setIsSilabusModalOpen(false)}
        initialBidang={subKegiatan || 'Matematika'}
        onSelectMateriAndKd={handleApplyFromModal}
      />
    </div>
  );
};

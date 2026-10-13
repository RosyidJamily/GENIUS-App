import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SILABUS_OSN_2026, BidangSilabus, SilabusTopic, KompetensiDasarItem } from '../data/silabusOsn2026';
import {
  BookOpen,
  Search,
  CheckCircle2,
  X,
  Plus,
  Layers,
  Sparkles,
  Award,
  ChevronDown,
  ChevronUp,
  FileText,
  Filter,
} from 'lucide-react';

interface SilabusOsnModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialBidang?: 'Matematika' | 'IPA' | 'IPS' | string;
  onSelectMateriAndKd: (data: {
    bidang: string;
    topicJudul: string;
    lingkupMateri: string[];
    kompetensiDasar: string[];
  }) => void;
}

export const SilabusOsnModal: React.FC<SilabusOsnModalProps> = ({
  isOpen,
  onClose,
  initialBidang = 'Matematika',
  onSelectMateriAndKd,
}) => {
  const [activeBidangId, setActiveBidangId] = useState<'matematika' | 'ipa' | 'ips'>(
    initialBidang.toLowerCase().includes('ipa')
      ? 'ipa'
      : initialBidang.toLowerCase().includes('ips')
      ? 'ips'
      : 'matematika'
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedMateri, setSelectedMateri] = useState<string[]>([]);
  const [selectedKd, setSelectedKd] = useState<string[]>([]);
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});

  const activeBidang = useMemo(() => {
    return SILABUS_OSN_2026.find((b) => b.id === activeBidangId) || SILABUS_OSN_2026[0];
  }, [activeBidangId]);

  // Filter topics based on search
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return activeBidang.topics;
    const q = searchQuery.toLowerCase();
    return activeBidang.topics.filter((t) => {
      const matchJudul = t.judul.toLowerCase().includes(q);
      const matchMateri = t.lingkupMateri.some((m) => m.toLowerCase().includes(q));
      const matchKd = t.kompetensiDasar.some(
        (k) =>
          k.kode.toLowerCase().includes(q) ||
          k.kelas.toLowerCase().includes(q) ||
          k.deskripsi.toLowerCase().includes(q)
      );
      const matchImso = t.silabusImso?.some((im) => im.toLowerCase().includes(q));
      return matchJudul || matchMateri || matchKd || matchImso;
    });
  }, [activeBidang, searchQuery]);

  const toggleTopicExpand = (topicId: string) => {
    setExpandedTopics((prev) => ({
      ...prev,
      [topicId]: !prev[topicId],
    }));
  };

  const handleToggleMateri = (materi: string) => {
    setSelectedMateri((prev) =>
      prev.includes(materi) ? prev.filter((m) => m !== materi) : [...prev, materi]
    );
  };

  const handleToggleKd = (kdText: string) => {
    setSelectedKd((prev) =>
      prev.includes(kdText) ? prev.filter((k) => k !== kdText) : [...prev, kdText]
    );
  };

  const handleApplySelection = (topic: SilabusTopic) => {
    // If nothing specifically checked in this topic, select all checked or default to current topic's items
    const materiToApply =
      selectedMateri.length > 0
        ? selectedMateri
        : topic.lingkupMateri.slice(0, 3);

    const kdToApply =
      selectedKd.length > 0
        ? selectedKd
        : topic.kompetensiDasar.slice(0, 2).map((k) => `[${k.kelas} ${k.kode}] ${k.deskripsi}`);

    onSelectMateriAndKd({
      bidang: activeBidang.nama,
      topicJudul: topic.judul,
      lingkupMateri: materiToApply,
      kompetensiDasar: kdToApply,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden my-auto"
      >
        {/* Header Modal */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#6C63FF] via-[#7B73FF] to-[#584FE4] text-white flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-[11px] font-bold backdrop-blur-xs mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>SILABUS RESMI OSN-SD 2026 (KEMENDIKDASMEN)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Eksplorasi Kompetensi & Lingkup Materi MIPAS Club
            </h2>
            <p className="text-xs text-indigo-100 font-medium mt-0.5">
              Pusat Prestasi Nasional • Silabus Olimpiade Sains Nasional Jenjang SD/MI/Sederajat
            </p>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Decorative shapes */}
          <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* Tab Selector & Search Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Bidang Tabs */}
          <div className="flex p-1 bg-white rounded-2xl border border-slate-200 shadow-xs">
            {SILABUS_OSN_2026.map((b) => {
              const isSelected = activeBidangId === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => {
                    setActiveBidangId(b.id);
                    setSelectedTopicId(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#6C63FF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <span>{b.nama}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {b.topics.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari materi, KD, topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9.5 pr-4 py-2 rounded-2xl bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#6C63FF]"
            />
          </div>
        </div>

        {/* Content Topics List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-2.5 text-xs text-indigo-900">
            <Sparkles className="w-4 h-4 text-[#6C63FF] shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {activeBidang.nama} • {activeBidang.topics.length} Pokok Bahasan Utama
              </p>
              <p className="text-[11px] text-indigo-700/80 mt-0.5">{activeBidang.deskripsi}</p>
            </div>
          </div>

          {filteredTopics.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold">Tidak ditemukan topik dengan kata kunci "{searchQuery}"</p>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isExpanded = expandedTopics[topic.id] ?? true;
              return (
                <motion.div
                  key={topic.id}
                  layout
                  className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs hover:border-[#6C63FF]/50 transition-colors"
                >
                  {/* Topic Title Bar */}
                  <div
                    onClick={() => toggleTopicExpand(topic.id)}
                    className="p-4 bg-slate-50/70 hover:bg-slate-100/70 cursor-pointer flex items-center justify-between gap-3 border-b border-slate-100"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-xl bg-[#6C63FF] text-white flex items-center justify-center text-xs font-extrabold shrink-0">
                        {topic.nomor}
                      </span>
                      <div>
                        <h4 className="font-extrabold text-sm text-slate-800 tracking-tight">
                          {topic.judul}
                        </h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {topic.lingkupMateri.length} Lingkup Materi
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {topic.kompetensiDasar.length} Kompetensi Dasar (KD)
                          </span>
                          {topic.silabusImso && (
                            <>
                              <span className="text-slate-300">•</span>
                              <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">
                                IMSO Ready
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplySelection(topic);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Gunakan ke Jurnal</span>
                      </button>
                      <div className="p-1 rounded-lg text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  {isExpanded && (
                    <div className="p-4 sm:p-5 space-y-4">
                      {/* 1. Lingkup Materi */}
                      <div>
                        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#6C63FF]" />
                          <span>Lingkup Materi OSN:</span>
                        </h5>
                        <div className="flex flex-wrap gap-2">
                          {topic.lingkupMateri.map((mat, mIdx) => {
                            const isChecked = selectedMateri.includes(mat);
                            return (
                              <button
                                key={mIdx}
                                type="button"
                                onClick={() => handleToggleMateri(mat)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center gap-2 ${
                                  isChecked
                                    ? 'bg-indigo-50 text-[#6C63FF] border-[#6C63FF] shadow-2xs'
                                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <span className={`w-3.5 h-3.5 rounded-md flex items-center justify-center text-[10px] ${
                                  isChecked ? 'bg-[#6C63FF] text-white' : 'border border-slate-300'
                                }`}>
                                  {isChecked && '✓'}
                                </span>
                                <span>{mat}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* 2. Kompetensi Dasar */}
                      <div>
                        <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Kompetensi Dasar Terkait (Kurikulum SD):</span>
                        </h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                          {topic.kompetensiDasar.map((kd, kIdx) => {
                            const kdFull = `[${kd.kelas} ${kd.kode}] ${kd.deskripsi}`;
                            const isChecked = selectedKd.includes(kdFull);
                            return (
                              <div
                                key={kIdx}
                                onClick={() => handleToggleKd(kdFull)}
                                className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                                  isChecked
                                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <span className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center text-[10px] shrink-0 ${
                                  isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                                }`}>
                                  {isChecked && '✓'}
                                </span>
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                                      {kd.kelas}
                                    </span>
                                    <span className="font-extrabold text-[10px] text-emerald-700">
                                      {kd.kode}
                                    </span>
                                  </div>
                                  <p className="text-[11px] leading-relaxed line-clamp-3">
                                    {kd.deskripsi}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* 3. Silabus IMSO (if any) */}
                      {topic.silabusImso && topic.silabusImso.length > 0 && (
                        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs">
                          <h6 className="font-bold text-amber-900 text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <span>Silabus IMSO (International Mathematics and Science Olympiad):</span>
                          </h6>
                          <div className="flex flex-wrap gap-1.5">
                            {topic.silabusImso.map((im, iIdx) => (
                              <span
                                key={iIdx}
                                className="px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 text-[10px] font-medium"
                              >
                                {im}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3 text-xs">
          <div className="text-slate-500 font-medium">
            Dipilih:{' '}
            <strong className="text-[#6C63FF]">{selectedMateri.length} Materi</strong> •{' '}
            <strong className="text-emerald-600">{selectedKd.length} KD</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 font-bold hover:bg-slate-50"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => {
                if (filteredTopics.length > 0) {
                  handleApplySelection(filteredTopics[0]);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-[#6C63FF] hover:bg-[#584FE4] text-white font-bold shadow-xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Terapkan Pilihan</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

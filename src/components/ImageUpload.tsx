import React, { useRef } from 'react';
import { UploadCloud, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  value?: string;
  onChange: (base64: string) => void;
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label = 'Upload Foto Kegiatan',
  value,
  onChange,
  helperText = 'Format JPG/PNG, ukuran maks. 5MB',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar yang diperbolehkan');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {!value ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-[#6C63FF] bg-slate-50/50 hover:bg-[#6C63FF]/5 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#6C63FF] group-hover:scale-110 transition-transform">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-700">
              Klik atau seret file foto ke sini
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
          </div>
        </div>
      ) : (
        <div className="relative group rounded-2xl overflow-hidden border border-slate-200 bg-white p-2 flex items-center gap-4">
          <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 mb-0.5">
              <ImageIcon className="w-4 h-4" />
              <span>Foto Terlampir</span>
            </div>
            <p className="text-xs text-slate-500 truncate">Foto siap diunggah dan disimpan</p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#6C63FF] hover:underline font-medium mt-1"
            >
              Ganti foto
            </button>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition-colors mr-1"
            title="Hapus foto"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

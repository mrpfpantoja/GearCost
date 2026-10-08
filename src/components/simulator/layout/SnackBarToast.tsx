import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface SnackBarToastData {
  message: string;
  isError: boolean;
}

interface SnackBarToastProps {
  toast: SnackBarToastData | null;
  onClose: () => void;
}

export const SnackBarToast: React.FC<SnackBarToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="absolute bottom-16 left-4 right-4 z-40 animate-in slide-in-from-bottom-2 fade-in duration-200">
      <div
        className={`p-3 rounded-xl shadow-xl flex items-center justify-between text-xs font-semibold text-white ${
          toast.isError ? 'bg-[#E11D48]' : 'bg-[#10B981]'
        }`}
      >
        <div className="flex items-center gap-2">
          {toast.isError ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white ml-2 text-xs cursor-pointer p-0.5"
          aria-label="Fechar notificação"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

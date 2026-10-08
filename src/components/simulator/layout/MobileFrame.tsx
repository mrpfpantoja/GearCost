import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    <div className="relative mx-auto w-full max-w-[420px] bg-slate-950 rounded-[44px] p-3.5 shadow-2xl border-[6px] border-slate-800 ring-1 ring-slate-700/50">
      {/* Notch / Speaker / Camera */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-4 bg-slate-900 rounded-full z-30 flex items-center justify-center pointer-events-none">
        <div className="w-3 h-3 rounded-full bg-slate-950 mr-2 border border-slate-800/80"></div>
        <div className="w-10 h-1.5 rounded-full bg-slate-800"></div>
      </div>

      {/* Tela do Celular */}
      <div className="relative bg-slate-950 rounded-[34px] overflow-hidden flex flex-col h-[740px] text-slate-100 border border-slate-800/80">
        {/* Status Bar */}
        <div className="pt-2 px-6 pb-2 flex items-center justify-between text-[11px] font-medium text-slate-400 z-20 shrink-0">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] tracking-wider text-orange-400 font-bold">GEARCOST</span>
            <div className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
              <div className="h-full w-full bg-emerald-400 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Dynamic App Content */}
        {children}
      </div>
    </div>
  );
};

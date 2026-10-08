import React, { useState } from 'react';
import { KeyRound, Mail } from 'lucide-react';

interface ModalEsqueciSenhaProps {
  isOpen: boolean;
  onClose: () => void;
  onEnviar: (email: string) => void;
}

export const ModalEsqueciSenha: React.FC<ModalEsqueciSenhaProps> = ({
  isOpen,
  onClose,
  onEnviar,
}) => {
  const [emailRecuperacao, setEmailRecuperacao] = useState('marcus.racing@gearcost.app');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEnviar(emailRecuperacao);
  };

  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-[#18181C] rounded-t-[24px] p-5 border-t border-slate-700/80 shadow-2xl space-y-3.5 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-[#EA580C]">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Recuperação de Senha
              </h3>
              <span className="text-[10px] text-slate-400">Garagem GearCost Security</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Digite o e-mail cadastrado na sua garagem. Enviaremos um link de autenticação segura e redefinição instantânea de senha.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-slate-300 block mb-1">
              E-mail Cadastrado
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                value={emailRecuperacao}
                onChange={(e) => setEmailRecuperacao(e.target.value)}
                placeholder="piloto@gearcost.app"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
            >
              Voltar
            </button>
            <button
              type="submit"
              className="py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 cursor-pointer"
            >
              Enviar Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

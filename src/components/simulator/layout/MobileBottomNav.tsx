import React from 'react';
import { Car, Gauge, DollarSign, Flame, PlusCircle, User } from 'lucide-react';
import { Usuario } from '../../../types/gearcost';

export type TabType = 'garagem' | 'telemetria' | 'financeiro' | 'stages' | 'cadastro' | 'auth';

interface MobileBottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pecasCriticasCount: number;
  usuarioLogado: Usuario | null | undefined;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  pecasCriticasCount,
  usuarioLogado,
}) => {
  const tabs = [
    { id: 'garagem' as TabType, label: 'Garagem', icon: Car },
    { id: 'telemetria' as TabType, label: 'Telemetria', icon: Gauge, badge: pecasCriticasCount },
    { id: 'financeiro' as TabType, label: 'Financeiro', icon: DollarSign },
    { id: 'stages' as TabType, label: 'Stages', icon: Flame },
    { id: 'cadastro' as TabType, label: '+ Veículo', icon: PlusCircle },
    { id: 'auth' as TabType, label: usuarioLogado ? 'Piloto' : 'Login', icon: User },
  ];

  return (
    <div className="bg-slate-900/95 border-t border-slate-800 px-1 py-2 flex items-center justify-around z-20 shrink-0">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id)}
            className={`relative flex flex-col items-center py-1 px-1.5 rounded-xl transition-all cursor-pointer ${
              isActive ? 'text-orange-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="relative">
              <Icon className="w-4 h-4" />
              {Boolean(tab.badge && tab.badge > 0) && (
                <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8px] flex items-center justify-center font-bold animate-pulse">
                  {tab.badge}
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5">{tab.label}</span>
            {isActive && (
              <div className="w-3 h-0.5 bg-orange-400 rounded-full mt-0.5"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};

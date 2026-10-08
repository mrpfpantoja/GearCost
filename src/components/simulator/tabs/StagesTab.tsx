import React from 'react';
import { Flame, CheckCircle2 } from 'lucide-react';
import { Veiculo, StatusStage } from '../../../types/gearcost';

interface StagesTabProps {
  veiculoAtual: Veiculo;
  onToggleStageStatus: (veiculoId: string, stageId: string, nextStatus: StatusStage) => void;
}

export const StagesTab: React.FC<StagesTabProps> = ({
  veiculoAtual,
  onToggleStageStatus,
}) => {
  const totalPlanejado = veiculoAtual.stages.reduce((acc, s) => acc + s.custoEstimado, 0);

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">
      <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            Roadmap de Upgrades
          </h3>
          <p className="text-[10px] text-slate-400">Projetos Stage 1, Stage 2 e Stage 3</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-slate-400">Total Planejado</div>
          <div className="text-xs font-mono font-bold text-amber-400">
            R$ {totalPlanejado.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>

      {/* Itens de Upgrades */}
      <div className="space-y-2.5">
        {veiculoAtual.stages.map((stage) => {
          const statusColors: Record<
            StatusStage,
            { bg: string; text: string; next: StatusStage }
          > = {
            PLANEJADO: {
              bg: 'bg-slate-800 text-slate-300',
              text: 'Planejado',
              next: 'COMPRADO',
            },
            COMPRADO: {
              bg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
              text: 'Comprado',
              next: 'INSTALADO',
            },
            INSTALADO: {
              bg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
              text: 'Instalado',
              next: 'PLANEJADO',
            },
          };

          const currentCfg = statusColors[stage.status];

          return (
            <div key={stage.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 font-mono">
                      STAGE {stage.nivelStage}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      R$ {stage.custoEstimado.toFixed(2)}
                    </span>
                  </div>
                  <h4 className="font-bold text-white text-xs mt-1">{stage.nomeModificacao}</h4>
                </div>

                {/* Botão de Alternar Status */}
                <button
                  type="button"
                  onClick={() => onToggleStageStatus(veiculoAtual.id, stage.id, currentCfg.next)}
                  className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${currentCfg.bg} hover:brightness-110 flex items-center gap-1`}
                >
                  {stage.status === 'INSTALADO' && (
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  )}
                  {currentCfg.text}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

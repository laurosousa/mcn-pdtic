import { History, CalendarClock, Scissors } from 'lucide-react';
import {
  MATRIX_VERSION_ID,
  NORMATIVE_CUTOFF_DATE,
  MATRIX_MAINTENANCE_DATE,
  MATRIX_MAINTENANCE_REGISTRY,
  CURRENT_NORMATIVE_MAINTENANCE_NOTE,
} from '@/data/mcn';

function formatDateBR(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Registro de manutenção da matriz (versão, corte normativo e histórico de
// revisões), exibido no Dashboard e no Guia. Os dados vêm exclusivamente das
// constantes em src/data/mcn.ts, alinhadas ao apêndice canônico.
export function MatrixMaintenanceCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <History size={20} className="text-ufrr" />
        Manutenção da Matriz
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Versão da matriz</p>
          <p className="text-sm font-bold text-gray-800 mt-1">MCN-PDTIC {MATRIX_VERSION_ID}</p>
          <p className="text-xs text-gray-500 mt-0.5">80 requisitos · 4 dimensões</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <Scissors size={11} /> Corte normativo
          </p>
          <p className="text-sm font-bold text-gray-800 mt-1">{formatDateBR(NORMATIVE_CUTOFF_DATE)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Normas posteriores não geram não conformidade retroativa.</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
            <CalendarClock size={11} /> Última manutenção documental
          </p>
          <p className="text-sm font-bold text-gray-800 mt-1">{formatDateBR(MATRIX_MAINTENANCE_DATE)}</p>
          <p className="text-xs text-gray-500 mt-0.5">Atos supervenientes valem apenas para análise atual.</p>
        </div>
      </div>

      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Histórico de revisões</p>
      <ol className="space-y-3">
        {MATRIX_MAINTENANCE_REGISTRY.map(entry => (
          <li key={entry.date} className="border-l-2 border-ufrr/30 pl-3">
            <p className="text-sm text-gray-800">
              <span className="font-bold">{formatDateBR(entry.date)}</span>
              <span className="text-gray-400"> · </span>
              <span className="font-semibold">{entry.title}</span>
            </p>
            <ul className="mt-1 space-y-1">
              {entry.details.map((detail, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
                  <span className="text-ufrr/60 flex-shrink-0 mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <p className="text-[11px] text-gray-400 mt-4">{CURRENT_NORMATIVE_MAINTENANCE_NOTE}</p>
      <p className="text-[11px] text-gray-400 mt-1">
        Fonte: apêndice canônico da matriz (docs/apendice-canonico-mcn-pdtic.md). Revisão documental e metodológica, não parecer jurídico formal.
      </p>
    </div>
  );
}

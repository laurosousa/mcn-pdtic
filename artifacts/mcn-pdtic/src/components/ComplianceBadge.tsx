import { Compliance, COMPLIANCE_COLOR } from '@/data/mcn';

interface ComplianceBadgeProps {
  value: Compliance;
  compact?: boolean;
}

const COMPLIANCE_LABELS: Record<Compliance, string> = {
  'Conforme': 'Conforme',
  'Conforme Parcial': 'Conf. Parcial',
  'Não Conforme': 'Não Conforme',
  'Não Aplicável': 'Não Aplicável',
  'Não Avaliado': 'Não Avaliado',
};

export function ComplianceBadge({ value, compact = false }: ComplianceBadgeProps) {
  const color = COMPLIANCE_COLOR[value];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap"
      style={{ color, backgroundColor: `${color}18`, border: `1px solid ${color}40` }}
    >
      {compact ? COMPLIANCE_LABELS[value] : value}
    </span>
  );
}

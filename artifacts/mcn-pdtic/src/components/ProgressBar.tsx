import { getConformityLabel, formatICDPercent } from '@/data/mcn';

interface ProgressBarProps {
  value: number | null;
  label: string;
  color?: string;
  height?: string;
}

export function ProgressBar({ value, label, color, height = 'h-3' }: ProgressBarProps) {
  const pct = value !== null ? Math.round(value * 100) : 0;
  const conformity = value !== null ? getConformityLabel(value) : null;
  const barColor = color || conformity?.color || '#9E9E9E';

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700 w-28 shrink-0 font-medium">{label}</span>
      <div className="flex-1 bg-gray-100 rounded-full overflow-hidden" style={{ height: height.replace('h-', '') + 'px' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
      <span className="text-sm font-bold w-16 text-right" style={{ color: barColor }}>
        {formatICDPercent(value)}
      </span>
    </div>
  );
}

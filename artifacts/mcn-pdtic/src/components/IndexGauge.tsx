import { getConformityLabel, formatICDPercent, formatDecimalBR } from '@/data/mcn';

interface IndexGaugeProps {
  value: number | null;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function IndexGauge({ value, size = 'md', label }: IndexGaugeProps) {
  if (value === null) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={`rounded-full flex items-center justify-center bg-gray-100 border-4 border-gray-300 ${size === 'lg' ? 'w-36 h-36' : size === 'sm' ? 'w-20 h-20' : 'w-28 h-28'}`}>
          <span className={`text-gray-400 font-semibold ${size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-lg'}`}>N/A</span>
        </div>
        {label && <span className="text-xs text-gray-500 text-center">{label}</span>}
      </div>
    );
  }

  const { label: conformityLabel, color, bg } = getConformityLabel(value);

  const sizes = {
    lg: { circle: 'w-36 h-36', text: 'text-3xl', sub: 'text-sm' },
    md: { circle: 'w-28 h-28', text: 'text-2xl', sub: 'text-xs' },
    sm: { circle: 'w-20 h-20', text: 'text-lg', sub: 'text-xs' },
  };
  const s = sizes[size];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={`${s.circle} rounded-full flex flex-col items-center justify-center border-4`}
        style={{ borderColor: color, backgroundColor: bg }}
      >
        <span className={`${s.text} font-bold px-1 text-center leading-tight`} style={{ color }}>{formatICDPercent(value)}</span>
        {size !== 'sm' && (
          <span className={`${s.sub} font-medium`} style={{ color }}>{formatDecimalBR(value, 4)}</span>
        )}
      </div>
      <div className="text-center">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ color, backgroundColor: bg }}
        >
          {conformityLabel}
        </span>
        {label && <p className="text-xs text-gray-600 mt-1 text-center max-w-[120px]">{label}</p>}
      </div>
    </div>
  );
}

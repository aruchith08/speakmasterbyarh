interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

export const MetricCard = ({ label, value, unit, icon }: MetricCardProps) => {
  return (
    <div className="metric-card p-3 sm:p-4">
      <div className="flex justify-between items-start">
        <div className="min-w-0 flex-1">
          <div className="metric-label text-[8px] sm:text-[9px] truncate">{label}</div>
          <div className="metric-value text-xl sm:text-2xl md:text-3xl">
            {value}
            {unit && <span className="metric-unit text-[10px] sm:text-xs">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 border border-border rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 ml-2">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

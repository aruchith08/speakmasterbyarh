interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

export const MetricCard = ({ label, value, unit, icon }: MetricCardProps) => {
  return (
    <div className="metric-card">
      <div className="flex justify-between items-start">
        <div>
          <div className="metric-label">{label}</div>
          <div className="metric-value">
            {value}
            {unit && <span className="metric-unit">{unit}</span>}
          </div>
        </div>
        {icon && (
          <div className="w-10 h-10 border border-border rounded-xl flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

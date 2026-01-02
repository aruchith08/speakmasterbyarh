interface StreamBarProps {
  label: string;
  value: string;
  percentage?: number;
  delay?: string;
}

export const StreamBar = ({ label, value, percentage = 100, delay = "0s" }: StreamBarProps) => {
  return (
    <div>
      <div className="flex justify-between hud-label mb-3 font-bold">
        <span>{label}</span>
        <span className="text-foreground">{value}</span>
      </div>
      <div className="stream-bar">
        {percentage < 100 && (
          <div
            className="absolute inset-0 bg-white/10"
            style={{ width: `${percentage}%` }}
          />
        )}
        <div
          className="stream-fill"
          style={{ width: `${percentage}%`, animationDelay: delay }}
        />
      </div>
    </div>
  );
};

interface StatusBadgeProps {
  label: string;
  pulse?: boolean;
}

export const StatusBadge = ({ label, pulse = true }: StatusBadgeProps) => {
  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-border bg-white/5">
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground" />
        </span>
      )}
      <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground">
        {label}
      </span>
    </div>
  );
};

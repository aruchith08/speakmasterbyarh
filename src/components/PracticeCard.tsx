import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface PracticeCardProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  path: string;
  icon?: React.ReactNode;
  status?: "active" | "locked" | "completed";
}

export const PracticeCard = ({
  number,
  title,
  subtitle,
  description,
  path,
  icon,
  status = "active",
}: PracticeCardProps) => {
  const isLocked = status === "locked";

  return (
    <Link
      to={isLocked ? "#" : path}
      className={`practice-card block active:scale-[0.98] transition-transform ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex justify-between items-start mb-4 sm:mb-6">
        <div className="practice-card-number text-xs sm:text-sm">{number} //</div>
        {icon && (
          <div className="w-8 h-8 sm:w-10 sm:h-10 border border-border rounded-lg sm:rounded-xl flex items-center justify-center group-hover:border-foreground/30 transition-colors">
            {icon}
          </div>
        )}
      </div>
      
      <h3 className="practice-card-title text-lg sm:text-xl group-hover:text-mercury transition-all">
        {title}
      </h3>
      <p className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-muted-foreground mb-2 sm:mb-4">
        {subtitle}
      </p>
      <p className="practice-card-description text-xs sm:text-sm">{description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-3 sm:pt-4">
        <div className="feature-line" />
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};

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
      className={`practice-card block ${isLocked ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <div className="flex justify-between items-start mb-6">
        <div className="practice-card-number">{number} //</div>
        {icon && (
          <div className="w-10 h-10 border border-border rounded-xl flex items-center justify-center group-hover:border-foreground/30 transition-colors">
            {icon}
          </div>
        )}
      </div>
      
      <h3 className="practice-card-title group-hover:text-mercury transition-all">
        {title}
      </h3>
      <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-4">
        {subtitle}
      </p>
      <p className="practice-card-description">{description}</p>
      
      <div className="flex items-center justify-between mt-auto pt-4">
        <div className="feature-line" />
        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
};

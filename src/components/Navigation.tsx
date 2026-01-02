import { Link, useLocation } from "react-router-dom";
import { Activity, BookOpen, BarChart3, Zap, Settings } from "lucide-react";

const navItems = [
  { path: "/", label: "Command", icon: Activity },
  { path: "/practice", label: "Protocol", icon: Zap },
  { path: "/roadmap", label: "Journey", icon: BookOpen },
  { path: "/analytics", label: "Telemetry", icon: BarChart3 },
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="p-6 md:p-8 relative z-50">
      <div className="max-w-7xl mx-auto">
        <div className="chrome-card-static rounded-2xl px-6 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-foreground rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <div className="w-4 h-4 bg-background rounded-full animate-pulse-soft" />
            </div>
            <span className="font-heading font-bold text-sm tracking-widest text-foreground hidden sm:block">
              SPEAK<span className="opacity-40">MASTER</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link flex items-center gap-2 ${
                  location.pathname === item.path ? "text-foreground" : ""
                }`}
              >
                <item.icon className="w-3 h-3" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Status & Connect */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-3">
              <span className="font-mono text-[9px] text-muted-foreground uppercase">
                Latency: <span className="text-foreground">0.04ms</span>
              </span>
              <div className="h-4 w-px bg-border" />
            </div>
            <Link
              to="/settings"
              className="font-mono text-[10px] text-foreground font-bold tracking-widest px-4 py-2 border border-border rounded-lg hover:bg-foreground hover:text-background transition-all"
            >
              <Settings className="w-4 h-4 md:hidden" />
              <span className="hidden md:inline">CONNECT</span>
            </Link>
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden mt-4 chrome-card-static rounded-xl p-2 flex justify-around">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "text-foreground bg-white/5"
                  : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-mono text-[8px] uppercase tracking-wider">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

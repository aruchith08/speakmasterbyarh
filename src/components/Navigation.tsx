import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Activity, BookOpen, BarChart3, Zap, LogIn, LogOut, Settings, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ApiKeySettings } from "@/components/ApiKeySettings";

const navItems = [
  { path: "/", label: "Command", icon: Activity },
  { path: "/practice", label: "Protocol", icon: Zap },
  { path: "/roadmap", label: "Journey", icon: BookOpen },
  { path: "/analytics", label: "Telemetry", icon: BarChart3 },
];

export const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:block p-6 md:p-8 relative z-50">
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
            <div className="flex gap-8">
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

            {/* Status & Auth */}
            <div className="flex items-center gap-4">
              <div className="hidden lg:flex items-center gap-3">
                <span className="font-mono text-[9px] text-muted-foreground uppercase">
                  {user ? `User: ${user.email?.split('@')[0]}` : "Guest Mode"}
                </span>
                <div className="h-4 w-px bg-border" />
              </div>
              
              {/* Settings Button (only for logged-in users) */}
              {user && (
                <button
                  onClick={() => setShowSettings(true)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                  title="API Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              
              {user ? (
                <button
                  onClick={() => signOut()}
                  className="font-mono text-[10px] text-foreground font-bold tracking-widest px-4 py-2 border border-border rounded-lg hover:bg-foreground hover:text-background transition-all"
                >
                  LOGOUT
                </button>
              ) : (
                <Link
                  to="/auth"
                  className="font-mono text-[10px] text-foreground font-bold tracking-widest px-4 py-2 border border-border rounded-lg hover:bg-foreground hover:text-background transition-all"
                >
                  LOGIN
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border safe-area-top">
        <div className="flex items-center justify-between px-4 h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-foreground rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-background rounded-full" />
            </div>
            <span className="font-heading font-bold text-xs tracking-widest text-foreground">
              SPEAK<span className="opacity-40">MASTER</span>
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {user && (
              <button
                onClick={() => setShowSettings(true)}
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg active:bg-white/10"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
            {user ? (
              <button
                onClick={() => signOut()}
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg active:bg-white/10"
              >
                <LogOut className="w-5 h-5" />
              </button>
            ) : (
              <Link
                to="/auth"
                className="p-2.5 text-foreground transition-colors rounded-lg active:bg-white/10"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - App Style */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-xl border-t border-border safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === "/practice" && location.pathname.startsWith("/practice"));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all active:scale-95 min-w-[60px] ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-colors ${isActive ? "bg-mercury/20" : ""}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? "text-mercury" : ""}`} />
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-wider ${isActive ? "text-mercury" : ""}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Content Spacers */}
      <div className="md:hidden h-14" /> {/* Top spacer */}

      {/* API Key Settings Modal */}
      {showSettings && <ApiKeySettings onClose={() => setShowSettings(false)} />}
    </>
  );
};

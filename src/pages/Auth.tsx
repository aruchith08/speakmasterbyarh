import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { StatusBadge } from "@/components/StatusBadge";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";

const emailSchema = z.string().email("Please enter a valid email address");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters");

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    if (isSignUp) {
      const { error } = await signUp(email, password, displayName);
      if (!error) {
        navigate("/");
      }
    } else {
      const { error } = await signIn(email, password);
      if (!error) {
        navigate("/");
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className="max-w-md mx-auto px-6 pt-16 pb-32">
      <div className="text-center mb-12">
        <StatusBadge label={isSignUp ? "Create Account" : "Authentication"} />
        
        <h1 className="text-[clamp(2rem,5vw,3rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          {isSignUp ? "JOIN THE" : "ACCESS"}<br />
          <span className="text-mercury">MISSION.</span>
        </h1>
        
        <p className="text-muted-foreground">
          {isSignUp 
            ? "Create your account to track progress and unlock personalized training"
            : "Sign in to continue your speaking journey"}
        </p>
      </div>

      <div className="chrome-card-static rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label className="hud-label mb-2 block">Display Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your name"
                  className="w-full h-12 pl-12 pr-4 bg-white/5 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="hud-label mb-2 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrors(prev => ({ ...prev, email: undefined }));
                }}
                placeholder="you@example.com"
                className={`w-full h-12 pl-12 pr-4 bg-white/5 border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none ${
                  errors.email ? "border-red-500" : "border-border focus:border-foreground/50"
                }`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="hud-label mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrors(prev => ({ ...prev, password: undefined }));
                }}
                placeholder="••••••••"
                className={`w-full h-12 pl-12 pr-12 bg-white/5 border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none ${
                  errors.password ? "border-red-500" : "border-border focus:border-foreground/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-mercury w-full h-14 rounded-xl disabled:opacity-50"
          >
            {isSubmitting 
              ? "Processing..." 
              : isSignUp 
                ? "Create Account" 
                : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
              }}
              className="ml-2 text-foreground hover:underline font-medium"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Auth;

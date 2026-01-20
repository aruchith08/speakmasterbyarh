import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Camera, Save, Award, TrendingUp, Calendar, Zap } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useRealtimeStats } from '@/hooks/useRealtimeStats';
import { useAchievements, ACHIEVEMENTS } from '@/hooks/useAchievements';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Profile = () => {
  const { user } = useAuth();
  const { stats, isLoading: statsLoading } = useRealtimeStats();
  const { unlockedAchievements, isLoading: achievementsLoading } = useAchievements();
  
  const [displayName, setDisplayName] = useState('');
  const [bandTarget, setBandTarget] = useState(7);
  const [isSaving, setIsSaving] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, current_band_target')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setDisplayName(data.display_name || '');
        setBandTarget(data.current_band_target || 7);
      }
      setInitialLoaded(true);
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          current_band_target: bandTarget,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="chrome-card-static rounded-2xl p-12 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your profile.</p>
          <Link to="/auth" className="btn-mercury px-8 py-3 rounded-xl">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const unlockedBadges = ACHIEVEMENTS.filter(a => unlockedAchievements.includes(a.id));

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Back Navigation */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Back to Dashboard</span>
      </Link>

      {/* Header */}
      <div className="mb-12">
        <StatusBadge label="User Profile" />
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          YOUR<br />
          <span className="text-mercury">PROFILE.</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-5">
          <div className="chrome-card-static rounded-2xl p-6 space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-foreground/20 to-foreground/5 flex items-center justify-center text-3xl">
                {displayName ? displayName[0].toUpperCase() : user.email?.[0].toUpperCase()}
              </div>
              <div>
                <h3 className="font-heading font-bold">{displayName || 'Speaker'}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-4 pt-4 border-t border-border">
              <div>
                <label className="hud-label block mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border text-foreground focus:outline-none focus:border-foreground/50"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="hud-label block mb-2">Target Band Score</label>
                <select
                  value={bandTarget}
                  onChange={(e) => setBandTarget(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border text-foreground focus:outline-none focus:border-foreground/50"
                >
                  {[5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((band) => (
                    <option key={band} value={band}>Band {band}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full btn-mercury py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>

        {/* Stats & Achievements */}
        <div className="lg:col-span-7 space-y-6">
          {/* Quick Stats */}
          <div className="chrome-card-static rounded-2xl p-6">
            <h3 className="font-heading font-bold mb-6">Your Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <Calendar className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="block text-2xl font-light">{stats?.streak || 0}</span>
                <span className="hud-label">Day Streak</span>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <TrendingUp className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="block text-2xl font-light">{stats?.avgBandScore?.toFixed(1) || '0.0'}</span>
                <span className="hud-label">Avg Band</span>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <Zap className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="block text-2xl font-light">{stats?.sessionsCompleted || 0}</span>
                <span className="hud-label">Sessions</span>
              </div>
              <div className="text-center p-4 bg-white/5 rounded-xl">
                <Award className="w-5 h-5 mx-auto mb-2 text-primary" />
                <span className="block text-2xl font-light">{unlockedBadges.length}</span>
                <span className="hud-label">Badges</span>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="chrome-card-static rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-bold">Achievements</h3>
              <Link to="/achievements" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                View All →
              </Link>
            </div>
            
            {achievementsLoading ? (
              <p className="text-center text-muted-foreground py-4">Loading...</p>
            ) : unlockedBadges.length === 0 ? (
              <div className="text-center py-8">
                <Award className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No achievements unlocked yet.</p>
                <p className="text-sm text-muted-foreground mt-1">Keep practicing to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {unlockedBadges.slice(0, 8).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="aspect-square bg-white/5 rounded-xl flex flex-col items-center justify-center p-2 text-center"
                    title={achievement.description}
                  >
                    <span className="text-2xl mb-1">{achievement.icon}</span>
                    <span className="text-[10px] text-muted-foreground line-clamp-2">{achievement.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="chrome-card-static rounded-2xl p-6">
            <h3 className="font-heading font-bold mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/session-history"
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-center"
              >
                <span className="block text-sm font-medium">Session History</span>
                <span className="text-xs text-muted-foreground">View past sessions</span>
              </Link>
              <Link
                to="/vocabulary"
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-center"
              >
                <span className="block text-sm font-medium">Vocabulary Bank</span>
                <span className="text-xs text-muted-foreground">Review saved words</span>
              </Link>
              <Link
                to="/achievements"
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-center"
              >
                <span className="block text-sm font-medium">All Achievements</span>
                <span className="text-xs text-muted-foreground">View all badges</span>
              </Link>
              <Link
                to="/analytics"
                className="p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-center"
              >
                <span className="block text-sm font-medium">Analytics</span>
                <span className="text-xs text-muted-foreground">Detailed stats</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;

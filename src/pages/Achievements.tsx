import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useAuth } from '@/hooks/useAuth';
import { useAchievements, ACHIEVEMENTS } from '@/hooks/useAchievements';

const Achievements = () => {
  const { user } = useAuth();
  const { unlockedAchievements, isLoading } = useAchievements();

  const categories = [
    { id: 'streak', name: 'Streak Achievements', icon: '🔥' },
    { id: 'xp', name: 'XP Milestones', icon: '⭐' },
    { id: 'score', name: 'Band Score Goals', icon: '🎯' },
    { id: 'sessions', name: 'Practice Milestones', icon: '📝' },
    { id: 'vocabulary', name: 'Vocabulary Builder', icon: '📖' },
  ];

  if (!user) {
    return (
      <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="chrome-card-static rounded-2xl p-12 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your achievements.</p>
          <Link to="/auth" className="btn-mercury px-8 py-3 rounded-xl">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;
  const progressPercentage = (unlockedCount / totalCount) * 100;

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Back Navigation */}
      <Link
        to="/profile"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Back to Profile</span>
      </Link>

      {/* Header */}
      <div className="mb-12">
        <StatusBadge label="Achievement Gallery" />
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          ACHIEVEMENTS<br />
          <span className="text-mercury">UNLOCKED.</span>
        </h1>
        <p className="text-muted-foreground">Track your milestones and collect badges as you improve.</p>
      </div>

      {/* Progress Overview */}
      <div className="chrome-card-static rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-heading font-bold">Overall Progress</h3>
            <p className="text-sm text-muted-foreground">{unlockedCount} of {totalCount} achievements unlocked</p>
          </div>
          <span className="text-4xl font-light">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-foreground/60 to-foreground rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Achievement Categories */}
      {isLoading ? (
        <div className="chrome-card-static rounded-2xl p-12 text-center text-muted-foreground">
          Loading achievements...
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const categoryAchievements = ACHIEVEMENTS.filter(a => a.category === category.id);
            const unlockedInCategory = categoryAchievements.filter(a => unlockedAchievements.includes(a.id));

            return (
              <div key={category.id} className="chrome-card-static rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h3 className="font-heading font-bold">{category.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {unlockedInCategory.length} / {categoryAchievements.length} unlocked
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {categoryAchievements.map((achievement) => {
                    const isUnlocked = unlockedAchievements.includes(achievement.id);
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-xl border transition-all ${
                          isUnlocked
                            ? 'bg-white/10 border-foreground/20'
                            : 'bg-white/5 border-border opacity-60'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`text-3xl ${isUnlocked ? '' : 'grayscale'}`}>
                            {isUnlocked ? achievement.icon : <Lock className="w-6 h-6 text-muted-foreground" />}
                          </span>
                          <div>
                            <h4 className="font-medium text-sm">{achievement.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Achievements;

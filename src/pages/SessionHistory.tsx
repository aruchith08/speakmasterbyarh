import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, TrendingUp, Filter } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { StreamBar } from '@/components/StreamBar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface Session {
  id: string;
  session_type: string;
  topic: string | null;
  overall_band: number | null;
  fluency_score: number | null;
  lexical_score: number | null;
  grammar_score: number | null;
  pronunciation_score: number | null;
  duration_seconds: number | null;
  transcript: string | null;
  ai_feedback: string | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
  created_at: string;
}

const SessionHistory = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    const fetchSessions = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('session_summaries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error fetching sessions:', error);
      } else {
        setSessions(data || []);
      }
      setIsLoading(false);
    };

    fetchSessions();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSessionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'mock-exam': 'Mock Exam',
      'cue-card': 'Cue Card',
      'read-aloud': 'Read Aloud',
      'discussion': 'Discussion',
      'intonation': 'Intonation',
      'stammer': 'Stammer Neutralizer',
    };
    return labels[type] || type;
  };

  const filteredSessions = filterType === 'all' 
    ? sessions 
    : sessions.filter(s => s.session_type === filterType);

  const sessionTypes = ['all', ...new Set(sessions.map(s => s.session_type))];

  if (!user) {
    return (
      <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="chrome-card-static rounded-2xl p-12 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your session history.</p>
          <Link to="/auth" className="btn-mercury px-8 py-3 rounded-xl">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Back Navigation */}
      <Link
        to="/analytics"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Back to Analytics</span>
      </Link>

      {/* Header */}
      <div className="mb-12">
        <StatusBadge label="Practice Archive" />
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          SESSION<br />
          <span className="text-mercury">HISTORY.</span>
        </h1>
        <p className="text-muted-foreground">Review your past practice sessions and track your progress.</p>
      </div>

      {/* Filter */}
      <div className="chrome-card-static rounded-xl p-4 mb-8 flex items-center gap-4">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="hud-label">Filter by type:</span>
        <div className="flex gap-2 flex-wrap">
          {sessionTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-lg text-xs font-mono uppercase tracking-wide transition-colors ${
                filterType === type
                  ? 'bg-foreground text-background'
                  : 'bg-white/5 text-muted-foreground hover:text-foreground'
              }`}
            >
              {type === 'all' ? 'All' : getSessionTypeLabel(type)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Session List */}
        <div className="lg:col-span-5 space-y-4">
          {isLoading ? (
            <div className="chrome-card-static rounded-xl p-8 text-center text-muted-foreground">
              Loading sessions...
            </div>
          ) : filteredSessions.length === 0 ? (
            <div className="chrome-card-static rounded-xl p-8 text-center text-muted-foreground">
              No sessions found. Start practicing to see your history here!
            </div>
          ) : (
            filteredSessions.map((session) => (
              <button
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`w-full text-left chrome-card-static rounded-xl p-4 transition-all hover:bg-white/5 ${
                  selectedSession?.id === session.id ? 'ring-2 ring-foreground' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    {getSessionTypeLabel(session.session_type)}
                  </span>
                  <span className="text-2xl font-light">
                    {session.overall_band?.toFixed(1) || '--'}
                  </span>
                </div>
                <p className="text-sm text-foreground line-clamp-1 mb-2">
                  {session.topic || 'General Practice'}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(session.created_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(session.duration_seconds)}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Session Details */}
        <div className="lg:col-span-7">
          {selectedSession ? (
            <div className="chrome-card-static rounded-2xl p-6 sticky top-8 space-y-6">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
                    {getSessionTypeLabel(selectedSession.session_type)}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {formatDate(selectedSession.created_at)}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold mb-2">
                  {selectedSession.topic || 'General Practice'}
                </h3>
              </div>

              {/* Scores */}
              <div className="space-y-4">
                <StreamBar
                  label="Fluency & Coherence"
                  value={selectedSession.fluency_score?.toFixed(1) || '--'}
                  percentage={((selectedSession.fluency_score || 0) / 9) * 100}
                />
                <StreamBar
                  label="Lexical Resource"
                  value={selectedSession.lexical_score?.toFixed(1) || '--'}
                  percentage={((selectedSession.lexical_score || 0) / 9) * 100}
                  delay="-0.3s"
                />
                <StreamBar
                  label="Grammar Range"
                  value={selectedSession.grammar_score?.toFixed(1) || '--'}
                  percentage={((selectedSession.grammar_score || 0) / 9) * 100}
                  delay="-0.6s"
                />
                <StreamBar
                  label="Pronunciation"
                  value={selectedSession.pronunciation_score?.toFixed(1) || '--'}
                  percentage={((selectedSession.pronunciation_score || 0) / 9) * 100}
                  delay="-0.9s"
                />
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="hud-label">Overall Band</span>
                  <span className="text-4xl font-light">{selectedSession.overall_band?.toFixed(1) || '--'}</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              {(selectedSession.strengths?.length || selectedSession.weaknesses?.length) && (
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  {selectedSession.strengths && selectedSession.strengths.length > 0 && (
                    <div>
                      <h4 className="hud-label mb-2 text-primary">Strengths</h4>
                      <ul className="space-y-1">
                        {selectedSession.strengths.map((s, i) => (
                          <li key={i} className="text-xs text-muted-foreground">• {s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedSession.weaknesses && selectedSession.weaknesses.length > 0 && (
                    <div>
                      <h4 className="hud-label mb-2 text-muted-foreground">Areas to Improve</h4>
                      <ul className="space-y-1">
                        {selectedSession.weaknesses.map((w, i) => (
                          <li key={i} className="text-xs text-muted-foreground">• {w}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Transcript */}
              {selectedSession.transcript && (
                <div className="pt-4 border-t border-border">
                  <h4 className="hud-label mb-2">Transcript</h4>
                  <div className="bg-white/5 rounded-lg p-4 max-h-40 overflow-y-auto">
                    <p className="text-sm text-muted-foreground">{selectedSession.transcript}</p>
                  </div>
                </div>
              )}

              {/* AI Feedback */}
              {selectedSession.ai_feedback && (
                <div className="pt-4 border-t border-border">
                  <h4 className="hud-label mb-2">AI Feedback</h4>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm text-muted-foreground">{selectedSession.ai_feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="chrome-card-static rounded-2xl p-12 text-center">
              <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Select a session to view details</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SessionHistory;

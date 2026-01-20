import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Plus, BookOpen, Trash2, ChevronRight, RotateCcw } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { useVocabulary, VocabularyWord } from '@/hooks/useVocabulary';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const Vocabulary = () => {
  const { user } = useAuth();
  const { vocabulary, isLoading, addWord, updateMastery, deleteWord, getWordsForReview } = useVocabulary();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState({ word: '', definition: '', example: '' });
  const [reviewMode, setReviewMode] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const wordsForReview = getWordsForReview();

  const handleAddWord = async () => {
    if (!newWord.word.trim()) {
      toast.error('Please enter a word');
      return;
    }
    const success = await addWord(newWord.word, newWord.definition, newWord.example);
    if (success) {
      setNewWord({ word: '', definition: '', example: '' });
      setShowAddModal(false);
    }
  };

  const handleReviewAnswer = async (correct: boolean) => {
    const word = wordsForReview[currentReviewIndex];
    if (!word) return;

    const newLevel = correct ? Math.min(word.mastery_level + 1, 5) : Math.max(word.mastery_level - 1, 0);
    await updateMastery(word.id, newLevel);

    setShowAnswer(false);
    if (currentReviewIndex < wordsForReview.length - 1) {
      setCurrentReviewIndex(prev => prev + 1);
    } else {
      setReviewMode(false);
      setCurrentReviewIndex(0);
      toast.success('Review session complete!');
    }
  };

  const getMasteryColor = (level: number) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-emerald-500'];
    return colors[level] || colors[0];
  };

  if (!user) {
    return (
      <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <div className="chrome-card-static rounded-2xl p-12 text-center">
          <h2 className="font-heading text-2xl font-bold mb-4">Sign In Required</h2>
          <p className="text-muted-foreground mb-6">Please sign in to access your vocabulary bank.</p>
          <Link to="/auth" className="btn-mercury px-8 py-3 rounded-xl">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (reviewMode && wordsForReview.length > 0) {
    const currentWord = wordsForReview[currentReviewIndex];
    return (
      <main className="max-w-3xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
        <button
          onClick={() => { setReviewMode(false); setCurrentReviewIndex(0); setShowAnswer(false); }}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-mono text-[10px] uppercase tracking-widest">Exit Review</span>
        </button>

        <div className="text-center mb-8">
          <span className="font-mono text-sm text-muted-foreground">
            {currentReviewIndex + 1} / {wordsForReview.length}
          </span>
        </div>

        <div className="chrome-card-static rounded-2xl p-8 min-h-[400px] flex flex-col items-center justify-center">
          <h2 className="text-4xl font-heading font-bold mb-8">{currentWord.word}</h2>

          {showAnswer ? (
            <>
              <div className="text-center mb-8">
                {currentWord.definition && (
                  <p className="text-lg text-muted-foreground mb-4">{currentWord.definition}</p>
                )}
                {currentWord.example_sentence && (
                  <p className="text-sm italic text-muted-foreground">"{currentWord.example_sentence}"</p>
                )}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleReviewAnswer(false)}
                  className="px-8 py-3 rounded-xl bg-destructive/20 text-destructive hover:bg-destructive/30 transition-colors"
                >
                  Needs Practice
                </button>
                <button
                  onClick={() => handleReviewAnswer(true)}
                  className="px-8 py-3 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                >
                  Got It!
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setShowAnswer(true)}
              className="btn-mercury px-12 py-4 rounded-xl"
            >
              Show Answer
            </button>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-6 md:px-8 pt-8 md:pt-16 pb-24 md:pb-32">
      {/* Back Navigation */}
      <Link
        to="/practice"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-mono text-[10px] uppercase tracking-widest">Back to Practice</span>
      </Link>

      {/* Header */}
      <div className="mb-12">
        <StatusBadge label="Lexicon Database" />
        <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-heading font-bold tracking-tighter leading-[0.9] text-foreground mt-8 mb-4">
          VOCABULARY<br />
          <span className="text-mercury">BANK.</span>
        </h1>
        <p className="text-muted-foreground">Build and review your personal vocabulary with spaced repetition.</p>
      </div>

      {/* Stats & Actions */}
      <div className="chrome-card-static rounded-xl p-6 mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-8">
          <div>
            <div className="hud-label mb-1">Total Words</div>
            <span className="text-2xl font-light">{vocabulary.length}</span>
          </div>
          <div>
            <div className="hud-label mb-1">Due for Review</div>
            <span className="text-2xl font-light">{wordsForReview.length}</span>
          </div>
        </div>
        <div className="flex gap-3">
          {wordsForReview.length > 0 && (
            <button
              onClick={() => setReviewMode(true)}
              className="px-6 py-3 rounded-xl bg-foreground text-background font-bold text-xs uppercase tracking-wide flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Review ({wordsForReview.length})
            </button>
          )}
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-mercury px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Word
          </button>
        </div>
      </div>

      {/* Vocabulary List */}
      {isLoading ? (
        <div className="chrome-card-static rounded-xl p-12 text-center text-muted-foreground">
          Loading vocabulary...
        </div>
      ) : vocabulary.length === 0 ? (
        <div className="chrome-card-static rounded-xl p-12 text-center">
          <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-heading text-lg font-bold mb-2">No words yet</h3>
          <p className="text-muted-foreground mb-6">
            Start building your vocabulary by adding words or completing practice sessions.
          </p>
          <button onClick={() => setShowAddModal(true)} className="btn-mercury px-6 py-3 rounded-xl">
            Add Your First Word
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {vocabulary.map((word) => (
            <div key={word.id} className="chrome-card-static rounded-xl p-5 group">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-heading font-bold text-lg">{word.word}</h3>
                  {word.definition && (
                    <p className="text-sm text-muted-foreground mt-1">{word.definition}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteWord(word.id)}
                  className="p-2 text-muted-foreground hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {word.example_sentence && (
                <p className="text-xs italic text-muted-foreground mb-3">"{word.example_sentence}"</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="hud-label">Mastery</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-full ${
                          level <= word.mastery_level ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(word.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Word Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="chrome-card-static rounded-2xl p-8 max-w-md w-full">
            <h3 className="font-heading text-xl font-bold mb-6">Add New Word</h3>
            <div className="space-y-4">
              <div>
                <label className="hud-label block mb-2">Word *</label>
                <input
                  type="text"
                  value={newWord.word}
                  onChange={(e) => setNewWord(prev => ({ ...prev, word: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border text-foreground focus:outline-none focus:border-foreground/50"
                  placeholder="Enter word"
                />
              </div>
              <div>
                <label className="hud-label block mb-2">Definition</label>
                <input
                  type="text"
                  value={newWord.definition}
                  onChange={(e) => setNewWord(prev => ({ ...prev, definition: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border text-foreground focus:outline-none focus:border-foreground/50"
                  placeholder="Enter definition"
                />
              </div>
              <div>
                <label className="hud-label block mb-2">Example Sentence</label>
                <textarea
                  value={newWord.example}
                  onChange={(e) => setNewWord(prev => ({ ...prev, example: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-border text-foreground focus:outline-none focus:border-foreground/50 resize-none"
                  rows={2}
                  placeholder="Use the word in a sentence"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowAddModal(false); setNewWord({ word: '', definition: '', example: '' }); }}
                className="flex-1 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button onClick={handleAddWord} className="flex-1 btn-mercury py-3 rounded-lg">
                Add Word
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Vocabulary;

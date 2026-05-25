// Canonical session_type values. Use these everywhere instead of inline strings.
export const SESSION_TYPES = {
  MOCK_EXAM: "mock_exam",
  CUE_CARD: "cue_card",
  READ_ALOUD: "read_aloud",
  DISCUSSION: "discussion",
  PHONETICS: "phonetics",
  INTONATION: "intonation",
  STAMMER: "stammer_neutralizer",
} as const;

// Normalize legacy values (hyphenated, short forms) that may exist in old DB rows.
export const normalizeSessionType = (type: string): string => {
  if (!type) return type;
  const map: Record<string, string> = {
    "mock-exam": SESSION_TYPES.MOCK_EXAM,
    "cue-card": SESSION_TYPES.CUE_CARD,
    "read-aloud": SESSION_TYPES.READ_ALOUD,
    "stammer": SESSION_TYPES.STAMMER,
  };
  return map[type] ?? type;
};

export const SESSION_TYPE_LABELS: Record<string, string> = {
  [SESSION_TYPES.MOCK_EXAM]: "Mock Exam",
  [SESSION_TYPES.CUE_CARD]: "Cue Card",
  [SESSION_TYPES.READ_ALOUD]: "Read Aloud",
  [SESSION_TYPES.DISCUSSION]: "Discussion",
  [SESSION_TYPES.PHONETICS]: "Phonetics",
  [SESSION_TYPES.INTONATION]: "Intonation",
  [SESSION_TYPES.STAMMER]: "Stammer Neutralizer",
};

export const getSessionTypeLabel = (type: string): string => {
  const normalized = normalizeSessionType(type);
  return SESSION_TYPE_LABELS[normalized] ?? type;
};

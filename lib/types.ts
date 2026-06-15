export type Section =
  | "case-construction"
  | "rebuttals"
  | "lay-ld"
  | "progressive"
  | "library";

export type ResourceType = "file" | "youtube" | "guide";
export type DebateFormat = "LD" | "PF" | "WS" | "all";

export interface Resource {
  id: string;
  section: Section;
  category: string;
  title: string;
  description: string | null;
  type: ResourceType;
  url: string | null;
  storage_path: string | null;
  content: string | null;
  debate_format: DebateFormat;
  sort_order: number;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  access_code: string;
  created_at: string;
}

export type RoundStatus =
  | "uploaded"
  | "transcribing"
  | "analyzing"
  | "done"
  | "error";

export interface Round {
  id: string;
  school_id: string | null;
  debate_format: "LD" | "PF" | "WS";
  status: RoundStatus;
  audio_path: string | null;
  audio_type: string | null;
  transcript: string | null;
  analysis: RoundAnalysis | null;
  error: string | null;
  created_at: string;
}

export interface RoundAnalysis {
  decision: {
    winner: string;
    summary: string;
  };
  rfd: string;
  speakerPoints: Array<{
    speaker: string;
    side: string;
    points: number;
    justification: string;
  }>;
  keyClashes: Array<{
    title: string;
    description: string;
    wonBy: string;
  }>;
  droppedArguments: Array<{
    argument: string;
    droppedBy: string;
    impact: string;
  }>;
  speakerFeedback: Array<{
    speaker: string;
    strengths: string[];
    improvements: string[];
  }>;
  drills: Array<{
    title: string;
    description: string;
  }>;
  rulesNotes: string[];
}

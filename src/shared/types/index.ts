export interface Note {
  id: string;
  name: string;
  french_name: string;
  frequency: number;
  octave: number;
  created_at: string;
}

export interface FingeringData {
  left_hand: {
    thumb: boolean;
    index: boolean;
    middle: boolean;
    ring: boolean;
  };
  right_hand: {
    index: boolean;
    middle: boolean;
    ring: boolean;
    pinky: boolean;
  };
}

export interface Fingering {
  id: string;
  note_id: string;
  fingering_data: FingeringData;
  is_primary: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  note_id: string;
  flashcard_type: 'score' | 'name';
  correct_count: number;
  incorrect_count: number;
  last_practiced: string;
  created_at: string;
  updated_at: string;
}

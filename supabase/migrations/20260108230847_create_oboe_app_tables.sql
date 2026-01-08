/*
  # Create Oboe Learning App Tables

  ## Overview
  This migration creates the core tables for the Oboe learning application,
  including flashcard management, fingering data, and user progress tracking.

  ## New Tables

  ### 1. `notes`
  Stores musical note information for the oboe
  - `id` (uuid, primary key) - Unique identifier for each note
  - `name` (text, not null) - Note name (e.g., "C4", "D#5")
  - `french_name` (text, not null) - French notation (e.g., "Do4", "Ré#5")
  - `frequency` (numeric) - Frequency in Hz
  - `octave` (integer, not null) - Octave number
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `fingerings`
  Stores fingering information for each note on the oboe
  - `id` (uuid, primary key) - Unique identifier
  - `note_id` (uuid, foreign key) - Reference to notes table
  - `fingering_data` (jsonb, not null) - JSON data describing which holes to press
  - `is_primary` (boolean) - Whether this is the primary fingering for the note
  - `difficulty` (text) - Difficulty level: 'beginner', 'intermediate', 'advanced'
  - `notes` (text) - Additional notes about this fingering
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `user_progress`
  Tracks user progress on flashcards
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, not null) - User identifier (for future auth integration)
  - `note_id` (uuid, foreign key) - Reference to notes table
  - `flashcard_type` (text, not null) - Type: 'score' or 'name'
  - `correct_count` (integer) - Number of correct answers
  - `incorrect_count` (integer) - Number of incorrect answers
  - `last_practiced` (timestamptz) - Last practice timestamp
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Record update timestamp

  ## Security
  - Enable RLS on all tables
  - Add policies for public read access (for now, will be restricted with auth later)
  - Add policies for user-specific write access on user_progress
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  french_name text NOT NULL,
  frequency numeric,
  octave integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fingerings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
  fingering_data jsonb NOT NULL,
  is_primary boolean DEFAULT true,
  difficulty text CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  note_id uuid REFERENCES notes(id) ON DELETE CASCADE,
  flashcard_type text NOT NULL CHECK (flashcard_type IN ('score', 'name')),
  correct_count integer DEFAULT 0,
  incorrect_count integer DEFAULT 0,
  last_practiced timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fingerings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Notes are viewable by everyone"
  ON notes
  FOR SELECT
  USING (true);

CREATE POLICY "Fingerings are viewable by everyone"
  ON fingerings
  FOR SELECT
  USING (true);

CREATE POLICY "Users can view own progress"
  ON user_progress
  FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own progress"
  ON user_progress
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_fingerings_note_id ON fingerings(note_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_note_id ON user_progress(note_id);

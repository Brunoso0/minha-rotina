-- Migration: Add completed column to goals table
-- Run this in Supabase SQL Editor if the column doesn't exist yet

ALTER TABLE goals ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS goals_completed_idx ON goals(completed);

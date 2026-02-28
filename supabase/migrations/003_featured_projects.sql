-- Add is_featured column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Index for faster featured project queries
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured);

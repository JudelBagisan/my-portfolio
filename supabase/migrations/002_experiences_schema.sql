-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  role TEXT NOT NULL,
  org TEXT NOT NULL,
  period TEXT NOT NULL,
  is_current BOOLEAN DEFAULT false,
  side TEXT DEFAULT 'left' CHECK (side IN ('left', 'right')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_experiences_sort_order ON experiences(sort_order);

ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Experiences are viewable by everyone"
  ON experiences FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert experiences"
  ON experiences FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update experiences"
  ON experiences FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete experiences"
  ON experiences FOR DELETE TO authenticated USING (true);

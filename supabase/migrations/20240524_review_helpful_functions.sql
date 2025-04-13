-- Function to increment helpful_count for a review
CREATE OR REPLACE FUNCTION increment_helpful_count(review_id_param INT)
RETURNS VOID AS $$
BEGIN
  UPDATE reviews
  SET helpful_count = helpful_count + 1
  WHERE id = review_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement helpful_count for a review
CREATE OR REPLACE FUNCTION decrement_helpful_count(review_id_param INT)
RETURNS VOID AS $$
BEGIN
  UPDATE reviews
  SET helpful_count = GREATEST(0, helpful_count - 1)
  WHERE id = review_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create review_helpful table if it doesn't exist
CREATE TABLE IF NOT EXISTS review_helpful (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(review_id, user_id)
);

-- Create index on review_id and user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_review_helpful_review_id ON review_helpful(review_id);
CREATE INDEX IF NOT EXISTS idx_review_helpful_user_id ON review_helpful(user_id);

-- Add helpful_count column to reviews table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'reviews' AND column_name = 'helpful_count'
  ) THEN
    ALTER TABLE reviews ADD COLUMN helpful_count INTEGER DEFAULT 0;
  END IF;
END $$; 
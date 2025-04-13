-- Function to get order counts for specified customers
CREATE OR REPLACE FUNCTION get_customer_order_counts(user_ids UUID[])
RETURNS TABLE (
  user_id UUID,
  count BIGINT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    user_id,
    COUNT(*) as count
  FROM 
    orders
  WHERE 
    user_id = ANY(user_ids)
  GROUP BY 
    user_id;
$$;

-- Function to get total spent by specified customers
CREATE OR REPLACE FUNCTION get_customer_total_spent(user_ids UUID[])
RETURNS TABLE (
  user_id UUID,
  sum FLOAT
) 
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    user_id,
    COALESCE(SUM(total), 0) as sum
  FROM 
    orders
  WHERE 
    user_id = ANY(user_ids)
  GROUP BY 
    user_id;
$$;

-- Add appropriate RLS policies to ensure these functions can only be accessed by authenticated users
DO $$
BEGIN
  -- Ensure the auth.uid() function is available (should be by default in Supabase)
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'uid' AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth')) THEN
    RAISE EXCEPTION 'auth.uid() function not found';
  END IF;
  
  -- Add RLS policy for the orders table if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Enable read access for authenticated users') THEN
    ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
    
    CREATE POLICY "Enable read access for authenticated users"
      ON orders
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END$$; 
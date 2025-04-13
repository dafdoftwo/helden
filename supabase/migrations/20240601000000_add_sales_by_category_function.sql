-- Create a function to get sales by category
CREATE OR REPLACE FUNCTION get_sales_by_category(start_date TIMESTAMP)
RETURNS TABLE (
  category TEXT,
  sales NUMERIC
) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
  WITH order_items_with_category AS (
    SELECT
      oi.id,
      oi.order_id,
      oi.product_id,
      oi.quantity,
      oi.price,
      oi.total,
      COALESCE(c.name, 'Uncategorized') as category_name
    FROM
      order_items oi
    JOIN
      orders o ON oi.order_id = o.id
    JOIN
      products p ON oi.product_id = p.id
    LEFT JOIN
      categories c ON p.category_id = c.id
    WHERE
      o.created_at >= start_date
      AND o.status <> 'cancelled'
  )
  SELECT
    category_name as category,
    SUM(total) as sales
  FROM
    order_items_with_category
  GROUP BY
    category_name
  ORDER BY
    sales DESC;
END;
$$; 
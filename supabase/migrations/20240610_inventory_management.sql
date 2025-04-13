-- Migration for inventory management system
-- Add min_stock_threshold column to products table if it doesn't exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS min_stock_threshold INTEGER DEFAULT NULL;

-- Create stock_movements table for tracking inventory changes
CREATE TABLE IF NOT EXISTS stock_movements (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity_change INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on product_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_stock_movements_product_id ON stock_movements(product_id);

-- Add a trigger function to update updated_at when stock changes
CREATE OR REPLACE FUNCTION update_product_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.stock != NEW.stock THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger on products table
DROP TRIGGER IF EXISTS update_product_timestamp ON products;
CREATE TRIGGER update_product_timestamp
BEFORE UPDATE OF stock ON products
FOR EACH ROW
EXECUTE FUNCTION update_product_updated_at();

-- Create function to check low stock levels and notify
CREATE OR REPLACE FUNCTION check_low_stock()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stock <= COALESCE(NEW.min_stock_threshold, 5) AND NEW.stock > 0 AND 
       (OLD.stock IS NULL OR OLD.stock > COALESCE(NEW.min_stock_threshold, 5)) THEN
        
        -- Insert notification for low stock
        INSERT INTO admin_notifications (
            type,
            title,
            message,
            data,
            is_read
        ) VALUES (
            'low_stock',
            'Low Stock Alert',
            'Product "' || (SELECT name FROM products WHERE id = NEW.id) || '" is running low on stock (' || NEW.stock || ' remaining).',
            jsonb_build_object('product_id', NEW.id, 'stock', NEW.stock),
            false
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create admin_notifications table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_notifications (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on is_read for faster filtering
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON admin_notifications(is_read);

-- Create low stock trigger
DROP TRIGGER IF EXISTS check_low_stock_trigger ON products;
CREATE TRIGGER check_low_stock_trigger
AFTER UPDATE OF stock ON products
FOR EACH ROW
EXECUTE FUNCTION check_low_stock();

-- Create function to record stock movement when stock is updated
CREATE OR REPLACE FUNCTION record_stock_movement()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.stock != NEW.stock THEN
        INSERT INTO stock_movements (
            product_id,
            quantity_change,
            reason,
            created_by
        ) VALUES (
            NEW.id,
            NEW.stock - OLD.stock,
            'Automatic stock update',
            'System'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic stock movement recording
DROP TRIGGER IF EXISTS record_stock_movement_trigger ON products;
CREATE TRIGGER record_stock_movement_trigger
AFTER UPDATE OF stock ON products
FOR EACH ROW
EXECUTE FUNCTION record_stock_movement(); 
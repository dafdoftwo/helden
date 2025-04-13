-- Migration for shipping integration
-- Create shipping options table
CREATE TABLE IF NOT EXISTS shipping_options (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    estimated_days VARCHAR(20),
    tracking_url_template VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add shipping-related columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_provider VARCHAR(50),
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS estimated_delivery_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shipping_label_url VARCHAR(255);

-- Create table for shipping tracking events
CREATE TABLE IF NOT EXISTS shipping_events (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    tracking_number VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    description TEXT
);

-- Insert default shipping options
INSERT INTO shipping_options (id, name, provider, price, estimated_days, tracking_url_template, active)
VALUES 
    ('standard', 'Standard Shipping (3-7 days)', 'aramex', 30.00, '3-7', 'https://www.aramex.com/track/results?ShipmentNumber={tracking_number}', TRUE),
    ('express', 'Express Shipping (1-3 days)', 'smsa', 60.00, '1-3', 'https://www.smsaexpress.com/trackingdetails?awb={tracking_number}', TRUE),
    ('premium', 'Premium Shipping (Next day)', 'dhl', 100.00, '1', 'https://www.dhl.com/en/express/tracking.html?AWB={tracking_number}', TRUE)
ON CONFLICT (id) DO UPDATE 
SET 
    name = EXCLUDED.name,
    provider = EXCLUDED.provider,
    price = EXCLUDED.price,
    estimated_days = EXCLUDED.estimated_days,
    tracking_url_template = EXCLUDED.tracking_url_template,
    active = EXCLUDED.active,
    updated_at = NOW();

-- Create a function to add shipping event when tracking number is updated
CREATE OR REPLACE FUNCTION add_initial_shipping_event()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tracking_number IS NOT NULL AND 
       (OLD.tracking_number IS NULL OR NEW.tracking_number != OLD.tracking_number) THEN
        INSERT INTO shipping_events (
            order_id, 
            tracking_number, 
            status, 
            location, 
            description
        ) VALUES (
            NEW.id,
            NEW.tracking_number,
            'label_created',
            'Shipping Center',
            'Shipping label has been created'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically add shipping event
DROP TRIGGER IF EXISTS order_shipping_update ON orders;
CREATE TRIGGER order_shipping_update
AFTER UPDATE OF tracking_number ON orders
FOR EACH ROW
EXECUTE FUNCTION add_initial_shipping_event(); 
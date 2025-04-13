-- Create shipping_providers table
CREATE TABLE IF NOT EXISTS shipping_providers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    logo VARCHAR(255),
    base_cost DECIMAL(10, 2) NOT NULL,
    cost_per_kg DECIMAL(10, 2) DEFAULT 0.00,
    delivery_days INTEGER NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    priority INTEGER DEFAULT 0,
    api_key VARCHAR(255),
    api_secret VARCHAR(255),
    api_endpoint VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shipping table for tracking shipments
CREATE TABLE IF NOT EXISTS shipping (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    provider_id INTEGER REFERENCES shipping_providers(id),
    tracking_number VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    address JSONB NOT NULL,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create shipping_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS shipping_status_history (
    id SERIAL PRIMARY KEY,
    shipping_id INTEGER REFERENCES shipping(id),
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    notes TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_shipping_providers_updated_at
BEFORE UPDATE ON shipping_providers
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shipping_updated_at
BEFORE UPDATE ON shipping
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert sample shipping providers
INSERT INTO shipping_providers (name, description, logo, base_cost, cost_per_kg, delivery_days, priority)
VALUES 
    ('Aramex', 'Fast delivery across Saudi Arabia', '/images/shipping/aramex.png', 30.00, 0.50, 3, 1),
    ('SMSA Express', 'Reliable shipping with package tracking', '/images/shipping/smsa.png', 25.00, 0.45, 4, 2),
    ('DHL', 'International shipping expertise', '/images/shipping/dhl.png', 45.00, 0.75, 2, 3),
    ('Saudi Post', 'Affordable nationwide shipping', '/images/shipping/saudi-post.png', 15.00, 0.30, 5, 4);

-- Create index for faster queries
CREATE INDEX idx_shipping_order_id ON shipping(order_id);
CREATE INDEX idx_shipping_tracking_number ON shipping(tracking_number);
CREATE INDEX idx_shipping_status ON shipping(status);
CREATE INDEX idx_shipping_status_history_shipping_id ON shipping_status_history(shipping_id); 
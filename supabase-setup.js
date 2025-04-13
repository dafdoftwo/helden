import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: resolve(__dirname, '.env.local') });

// Initialize Supabase client with your project details
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

console.log('Using Supabase URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  console.log('Setting up Supabase database...');
  
  try {
    // Check if the categories table exists
    const { data: tableInfo, error: tableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'categories')
      .single();
    
    if (tableCheckError) {
      console.log('Unable to check if table exists. Will try to create it.', tableCheckError);
    }

    // If the table doesn't exist, create it
    if (!tableInfo) {
      console.log('Creating categories table...');
      
      // Using the SQL API to create the table
      const { error: sqlError } = await supabase.rpc('exec', { 
        query: `
          CREATE TABLE IF NOT EXISTS categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            image_url TEXT,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error('Error creating categories table:', sqlError);
      } else {
        console.log('Categories table created successfully');
      }
    } else {
      console.log('Categories table already exists');
    }
    
    // Check if the products table exists
    const { data: productsTableInfo, error: productsTableCheckError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'products')
      .single();
    
    if (productsTableCheckError) {
      console.log('Unable to check if products table exists. Will try to create it.', productsTableCheckError);
    }

    // If the products table doesn't exist, create it
    if (!productsTableInfo) {
      console.log('Creating products table...');
      
      // Using the SQL API to create the table
      const { error: sqlError } = await supabase.rpc('exec', { 
        query: `
          CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name VARCHAR(255) NOT NULL,
            slug VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            image_urls JSONB DEFAULT '[]'::jsonb,
            category_id UUID REFERENCES categories(id),
            stock_quantity INTEGER DEFAULT 0,
            is_featured BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
      
      if (sqlError) {
        console.error('Error creating products table:', sqlError);
      } else {
        console.log('Products table created successfully');
      }
    } else {
      console.log('Products table already exists');
    }
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase()
  .catch(console.error)
  .finally(() => {
    console.log('Database setup script finished');
    process.exit(0);
  }); 
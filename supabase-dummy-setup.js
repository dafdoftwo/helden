import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create sample data
const categoriesData = [
  {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Abayas',
    slug: 'abayas',
    description: 'Modern and elegant abayas for all occasions',
    image_url: '/images/Abayas/SaudiAbayas.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '223e4567-e89b-12d3-a456-426614174001',
    name: 'Dresses',
    slug: 'dresses',
    description: 'Stylish dresses for modern Saudi women',
    image_url: '/images/formal_wear/formal_wear_1.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '323e4567-e89b-12d3-a456-426614174002',
    name: 'Sportswear',
    slug: 'sportswear',
    description: 'Comfortable and fashionable sportswear',
    image_url: '/images/Saudi-women-sportswear/Saudi_women_sportswear.jpg',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

const productsData = [
  {
    id: '423e4567-e89b-12d3-a456-426614174003',
    name: 'Elegant Abaya',
    slug: 'elegant-abaya',
    description: 'A beautiful black abaya with gold embroidery',
    price: 499.99,
    image_urls: JSON.stringify(['/images/Abayas/Saudi_Abayas_1.jpg', '/images/Abayas/Saudi_Abayas_2.jpg']),
    category_id: '123e4567-e89b-12d3-a456-426614174000',
    stock_quantity: 15,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '523e4567-e89b-12d3-a456-426614174004',
    name: 'Casual Dress',
    slug: 'casual-dress',
    description: 'Comfortable casual dress for everyday wear',
    price: 299.99,
    image_urls: JSON.stringify(['/images/casual_clothes/Saudi_casual_clothes_1.jpg']),
    category_id: '223e4567-e89b-12d3-a456-426614174001',
    stock_quantity: 10,
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '623e4567-e89b-12d3-a456-426614174005',
    name: 'Workout Set',
    slug: 'workout-set',
    description: 'Comfortable and stylish workout set for active women',
    price: 199.99,
    image_urls: JSON.stringify(['/images/Saudi-women-sportswear/Saudi_women_sportswear.jpg']),
    category_id: '323e4567-e89b-12d3-a456-426614174002',
    stock_quantity: 20,
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Create the data directory if it doesn't exist
const dataDir = resolve(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write the data to JSON files
fs.writeFileSync(
  resolve(dataDir, 'categories.json'),
  JSON.stringify(categoriesData, null, 2)
);

fs.writeFileSync(
  resolve(dataDir, 'products.json'),
  JSON.stringify(productsData, null, 2)
);

console.log('Sample data files created successfully in the data directory.');
console.log('You can use these files as mock data until your database is properly set up.'); 
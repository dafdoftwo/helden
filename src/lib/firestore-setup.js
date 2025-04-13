import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to your service account key
const serviceAccountPath = resolve(__dirname, '../../serviceAccountKey.json');

// Initialize Firebase Admin
try {
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
  
  // Initialize the app
  initializeApp({
    credential: cert(serviceAccount)
  });
  
  console.log('Firebase Admin initialized successfully.');
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  process.exit(1);
}

// Get Firestore instance
const db = getFirestore();

// Sample data for categories
const categories = [
  {
    id: 'abayas',
    name: 'Abayas',
    slug: 'abayas',
    description: 'Modern and elegant abayas for all occasions',
    image_url: '/images/Abayas/SaudiAbayas.jpg',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'dresses',
    name: 'Dresses',
    slug: 'dresses',
    description: 'Stylish dresses for modern Saudi women',
    image_url: '/images/formal_wear/formal_wear_1.jpg',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'sportswear',
    name: 'Sportswear',
    slug: 'sportswear',
    description: 'Comfortable and fashionable sportswear',
    image_url: '/images/Saudi-women-sportswear/Saudi_women_sportswear.jpg',
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Sample data for products
const products = [
  {
    id: 'elegant-abaya',
    name: 'Elegant Abaya',
    slug: 'elegant-abaya',
    description: 'A beautiful black abaya with gold embroidery',
    price: 499.99,
    image_urls: ['/images/Abayas/Saudi_Abayas_1.jpg', '/images/Abayas/Saudi_Abayas_2.jpg'],
    category_id: 'abayas',
    stock_quantity: 15,
    is_featured: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'casual-dress',
    name: 'Casual Dress',
    slug: 'casual-dress',
    description: 'Comfortable casual dress for everyday wear',
    price: 299.99,
    image_urls: ['/images/casual_clothes/Saudi_casual_clothes_1.jpg'],
    category_id: 'dresses',
    stock_quantity: 10,
    is_featured: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'workout-set',
    name: 'Workout Set',
    slug: 'workout-set',
    description: 'Comfortable and stylish workout set for active women',
    price: 199.99,
    image_urls: ['/images/Saudi-women-sportswear/Saudi_women_sportswear.jpg'],
    category_id: 'sportswear',
    stock_quantity: 20,
    is_featured: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Function to setup database
async function setupFirestore() {
  console.log('Setting up Firestore database...');
  
  try {
    // Add categories
    const categoriesCollectionRef = db.collection('categories');
    for (const category of categories) {
      await categoriesCollectionRef.doc(category.id).set(category);
      console.log(`Added category: ${category.name}`);
    }
    
    // Add products
    const productsCollectionRef = db.collection('products');
    for (const product of products) {
      await productsCollectionRef.doc(product.id).set(product);
      console.log(`Added product: ${product.name}`);
    }
    
    console.log('Firestore database setup complete!');
  } catch (error) {
    console.error('Error setting up Firestore database:', error);
  }
}

// Run the setup
setupFirestore()
  .then(() => {
    console.log('Database setup completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Database setup failed:', error);
    process.exit(1);
  }); 
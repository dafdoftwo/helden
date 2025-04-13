export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  image: string;
  images: string[];
  category: string;
  originalPrice?: number;
  discount_price?: number;
  featured?: boolean;
  new?: boolean;
  rating?: number;
  reviews?: number;
  sold?: number;
  colors?: string[];
  sizes?: string[];
  stock?: number;
  sku?: string;
  main_image?: string;
  additional_images?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface StripeProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
  images: string[];
  description?: string;
}

export interface StripeSession {
  id: string;
  url: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  customer?: {
    email: string;
    name?: string;
  };
  shippingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: 'card' | 'paypal' | 'cash';
}

// Mock products for development - will replace with database query later
export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'Elegant Abaya',
    category: 'abayas',
    price: 499,
    originalPrice: 599,
    discount_price: 399,
    description: 'A sophisticated abaya crafted with premium fabric, featuring elegant embroidery details.',
    image: '/images/Abayas/SaudiAbayas.jpg',
    images: [
      '/images/Abayas/SaudiAbayas.jpg',
      '/images/Abayas/Saudi_Abayas2.jpg',
      '/images/Abayas/Saudi_Abayas_3.jpg',
    ],
    main_image: '/images/Abayas/SaudiAbayas.jpg',
    additional_images: [
      '/images/Abayas/Saudi_Abayas2.jpg',
      '/images/Abayas/Saudi_Abayas_3.jpg',
      '/images/Abayas/Saudi_Abayas_4.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Brown'],
    stock: 15,
    sku: 'WA-001',
    featured: true,
    new: true,
    rating: 4.8,
    reviews: 124,
    sold: 89,
  },
  {
    id: 2,
    name: 'Casual Abaya',
    category: 'abayas',
    price: 399,
    description: 'A comfortable everyday abaya made from lightweight breathable fabric, perfect for casual outings.',
    image: '/images/Abayas/Saudi_Abayas2.jpg',
    images: [
      '/images/Abayas/Saudi_Abayas2.jpg',
      '/images/Abayas/SaudiAbayas.jpg',
      '/images/Abayas/Saudi_Abayas_3.jpg',
    ],
    main_image: '/images/Abayas/Saudi_Abayas2.jpg',
    additional_images: [
      '/images/Abayas/SaudiAbayas.jpg',
      '/images/Abayas/Saudi_Abayas_3.jpg',
      '/images/Abayas/Saudi_Abayas_5.jpg',
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Black', 'Gray'],
    stock: 8,
    sku: 'WA-002',
    featured: false,
    new: true,
    rating: 4.5,
    reviews: 86,
    sold: 75,
  },
  {
    id: 3,
    name: 'Embellished Abaya',
    category: 'abayas',
    price: 649,
    originalPrice: 799,
    discount_price: 649,
    description: 'A luxurious abaya adorned with intricate beadwork and embellishments, perfect for special occasions.',
    image: '/images/Abayas/Saudi_Abayas_3.jpg',
    images: [
      '/images/Abayas/Saudi_Abayas_3.jpg',
      '/images/Abayas/SaudiAbayas.jpg',
      '/images/Abayas/Saudi_Abayas2.jpg',
    ],
    main_image: '/images/Abayas/Saudi_Abayas_3.jpg',
    additional_images: [
      '/images/Abayas/SaudiAbayas.jpg',
      '/images/Abayas/Saudi_Abayas2.jpg',
      '/images/Abayas/Saudi_Abayas_6.jpg',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['Black', 'Burgundy'],
    stock: 12,
    sku: 'WA-003',
    featured: true,
    new: false,
    rating: 4.9,
    reviews: 214,
    sold: 180,
  },
  {
    id: 4,
    name: 'Casual Wear',
    category: 'casual',
    price: 349,
    description: 'Comfortable and stylish casual wear made from high-quality materials, perfect for everyday use.',
    image: '/images/woman_waer_1.jpg',
    images: [
      '/images/woman_waer_1.jpg',
      '/images/woman_waer_2.jpg',
      '/images/woman_waer_3.jpg',
    ],
    main_image: '/images/woman_waer_1.jpg',
    additional_images: [
      '/images/woman_waer_2.jpg',
      '/images/woman_waer_3.jpg',
      '/images/woman_waer_4.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Beige', 'Light Blue'],
    stock: 25,
    sku: 'MT-001',
    featured: true,
    new: false,
    rating: 4.6,
    reviews: 178,
    sold: 150,
  },
  {
    id: 5,
    name: 'Formal Wear',
    category: 'formal',
    price: 599,
    originalPrice: 699,
    discount_price: 599,
    description: 'Elegant formal wear crafted with the finest materials, featuring subtle detailing and a refined finish.',
    image: '/images/woman_waer_2.jpg',
    images: [
      '/images/woman_waer_2.jpg',
      '/images/woman_waer_3.jpg',
      '/images/woman_waer_4.jpg',
    ],
    main_image: '/images/woman_waer_2.jpg',
    additional_images: [
      '/images/woman_waer_3.jpg',
      '/images/woman_waer_4.jpg',
      '/images/woman_waer_1.jpg',
    ],
    sizes: ['M', 'L', 'XL'],
    colors: ['White', 'Off-White', 'Gray'],
    stock: 10,
    sku: 'MT-002',
    featured: false,
    new: true,
    rating: 4.9,
    reviews: 93,
    sold: 45,
  },
  {
    id: 6,
    name: 'Sports Wear',
    category: 'sports',
    price: 249,
    description: 'High-performance sportswear designed for comfort and flexibility during physical activities.',
    image: '/images/sports_wear.jpg',
    images: [
      '/images/sports_wear.jpg',
      '/images/woman_waer_4.jpg',
      '/images/woman_waer_3.jpg',
    ],
    main_image: '/images/sports_wear.jpg',
    additional_images: [
      '/images/woman_waer_4.jpg',
      '/images/woman_waer_3.jpg',
      '/images/woman_waer_2.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Gray', 'Pink'],
    stock: 30,
    sku: 'AS-001',
    featured: true,
    new: false,
    rating: 4.7,
    reviews: 156,
    sold: 120,
  },
  {
    id: 7,
    name: 'Body Shaper',
    category: 'body-shapers',
    price: 199,
    originalPrice: 249,
    discount_price: 199,
    description: 'High-quality body shaper that offers comfortable support and helps achieve a flattering silhouette.',
    image: '/images/body_shapper.jpg',
    images: [
      '/images/body_shapper.jpg',
      '/images/body_shapper_2.jpg',
      '/images/women_body_shapers/women_body_shapers.jpg',
    ],
    main_image: '/images/body_shapper.jpg',
    additional_images: [
      '/images/body_shapper_2.jpg',
      '/images/women_body_shapers/women_body_shapers.jpg',
      '/images/women_body_shapers/women_body_shapers_2.jpg',
    ],
    sizes: ['S', 'M', 'L'],
    colors: ['Nude', 'Black'],
    stock: 7,
    sku: 'AB-001',
    featured: false,
    new: true,
    rating: 4.5,
    reviews: 68,
    sold: 40,
  },
  {
    id: 8,
    name: 'Premium Body Shaper',
    category: 'body-shapers',
    price: 299,
    description: 'Premium body shaper made with advanced fabric technology for maximum comfort and effectiveness.',
    image: '/images/women_body_shapers/women_body_shapers_2.jpg',
    images: [
      '/images/women_body_shapers/women_body_shapers_2.jpg',
      '/images/women_body_shapers/women_body_shapers_3.jpg',
      '/images/women_body_shapers/women_body_shapers_4.jpg',
    ],
    main_image: '/images/women_body_shapers/women_body_shapers_2.jpg',
    additional_images: [
      '/images/women_body_shapers/women_body_shapers_3.jpg',
      '/images/women_body_shapers/women_body_shapers_4.jpg',
      '/images/women_body_shapers/women_body_shapers_5.jpg',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Nude', 'White'],
    stock: 50,
    sku: 'AH-001',
    featured: true,
    new: false,
    rating: 4.8,
    reviews: 209,
    sold: 190,
  }
]; 
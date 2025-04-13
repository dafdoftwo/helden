import { db } from './firebase';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

// Categories
export async function getCategories() {
  try {
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
}

export async function getCategoryBySlug(slug) {
  try {
    const categoriesRef = collection(db, 'categories');
    const q = query(categoriesRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error('Error getting category by slug:', error);
    return null;
  }
}

// Products
export async function getProducts(options = {}) {
  try {
    const { categoryId, featured, sort = 'name', order = 'asc', pageSize = 20, lastDoc = null } = options;
    
    let productsRef = collection(db, 'products');
    let constraints = [];
    
    if (categoryId) {
      constraints.push(where('category_id', '==', categoryId));
    }
    
    if (featured) {
      constraints.push(where('is_featured', '==', true));
    }
    
    constraints.push(orderBy(sort, order));
    
    if (pageSize) {
      constraints.push(limit(pageSize));
    }
    
    if (lastDoc) {
      constraints.push(startAfter(lastDoc));
    }
    
    const q = query(productsRef, ...constraints);
    const snapshot = await getDocs(q);
    
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastVisible = snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;
    
    return { products, lastVisible };
  } catch (error) {
    console.error('Error getting products:', error);
    return { products: [], lastVisible: null };
  }
}

export async function getProductBySlug(slug) {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error('Error getting product by slug:', error);
    return null;
  }
}

// Orders
export async function createOrder(orderData) {
  try {
    const ordersRef = collection(db, 'orders');
    const docRef = await addDoc(ordersRef, {
      ...orderData,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    return { id: docRef.id };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export async function getUserOrders(userId) {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, 
      where('userId', '==', userId),
      orderBy('created_at', 'desc')
    );
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user orders:', error);
    return [];
  }
}

// Users
export async function getUserProfile(userId) {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      return null;
    }
    
    return { id: userSnap.id, ...userSnap.data() };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function updateUserProfile(userId, profileData) {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...profileData,
      updated_at: new Date()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

// Exports all functions
export default {
  getCategories,
  getCategoryBySlug,
  getProducts,
  getProductBySlug,
  createOrder,
  getUserOrders,
  getUserProfile,
  updateUserProfile
}; 
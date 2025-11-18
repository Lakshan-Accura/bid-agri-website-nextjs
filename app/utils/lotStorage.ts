import { Product } from '../components/apiEndpoints/products/products';
import { tokenUtils } from '../components/apiEndpoints/login/login';

export interface LotItem {
  product: Product;
  quantity: number;
  addedAt: string;
  userId: string; // Add userId to track which user added the item
}

export interface UserLot {
  userId: string;
  items: LotItem[];
  createdAt: string;
  updatedAt: string;
}

export const lotStorage = {
  // Get storage key for current user
  getStorageKey(): string {
    const decodedToken = tokenUtils.getDecodedToken();
    const userId = decodedToken?.sub; // Using 'sub' claim from JWT as user ID
    return userId ? `bidagri-lot-${userId}` : 'bidagri-lot-anonymous';
  },

  // Get current user ID from token
  getCurrentUserId(): string | null {
    const decodedToken = tokenUtils.getDecodedToken();
    return decodedToken?.sub || null; // Using 'sub' claim as user ID
  },

  // Get all items from lot for current user
  getLotItems(): LotItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const storageKey = this.getStorageKey();
      const items = localStorage.getItem(storageKey);
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error reading lot from localStorage:', error);
      return [];
    }
  },

  // Add product to lot for current user
  addToLot(product: Product): LotItem[] {
    const userId = this.getCurrentUserId();
    if (!userId) {
      throw new Error('Please login to add products to your lot');
    }

    const items = this.getLotItems();
    const existingItemIndex = items.findIndex(item => 
      item.product.id === product.id && item.userId === userId
    );

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists for this user
      items[existingItemIndex].quantity += 1;
      items[existingItemIndex].addedAt = new Date().toISOString();
    } else {
      // Add new item with user ID
      items.push({
        product,
        quantity: 1,
        addedAt: new Date().toISOString(),
        userId: userId
      });
    }

    const storageKey = this.getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(items));
    return items;
  },

  // Remove product from lot for current user
  removeFromLot(productId: number): LotItem[] {
    const userId = this.getCurrentUserId();
    const items = this.getLotItems();
    const filteredItems = items.filter(item => 
      !(item.product.id === productId && item.userId === userId)
    );
    
    const storageKey = this.getStorageKey();
    localStorage.setItem(storageKey, JSON.stringify(filteredItems));
    return filteredItems;
  },

  // Update product quantity in lot for current user
  updateQuantity(productId: number, quantity: number): LotItem[] {
    const userId = this.getCurrentUserId();
    const items = this.getLotItems();
    const itemIndex = items.findIndex(item => 
      item.product.id === productId && item.userId === userId
    );
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        return this.removeFromLot(productId);
      } else {
        items[itemIndex].quantity = quantity;
        items[itemIndex].addedAt = new Date().toISOString();
        const storageKey = this.getStorageKey();
        localStorage.setItem(storageKey, JSON.stringify(items));
      }
    }
    
    return items;
  },

  // Clear entire lot for current user
  clearLot(): void {
    const storageKey = this.getStorageKey();
    localStorage.removeItem(storageKey);
  },

  // Clear lot for all users (admin function)
  clearAllLots(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('bidagri-lot-')) {
        localStorage.removeItem(key);
      }
    });
    // Also clear anonymous lot
    localStorage.removeItem('bidagri-lot-anonymous');
  },

  // Get lot count (total items) for current user
  getLotCount(): number {
    const items = this.getLotItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get total value of lot for current user
  getLotTotal(): number {
    const items = this.getLotItems();
    return items.reduce((total, item) => total + (item.product.startPrice * item.quantity), 0);
  },

  // Get all lots for all users (admin function)
  getAllUserLots(): UserLot[] {
    if (typeof window === 'undefined') return [];
    
    const userLots: UserLot[] = [];
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith('bidagri-lot-')) {
        try {
          const items: LotItem[] = JSON.parse(localStorage.getItem(key) || '[]');
          if (items.length > 0) {
            const userId = key === 'bidagri-lot-anonymous' ? 'anonymous' : key.replace('bidagri-lot-', '');
            userLots.push({
              userId,
              items,
              createdAt: items[0]?.addedAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error(`Error parsing lot for key ${key}:`, error);
        }
      }
    });
    
    return userLots;
  },

  // Migrate anonymous lot to user lot (when user logs in)
  migrateAnonymousToUser(userId: string): void {
    const anonymousItems: LotItem[] = JSON.parse(localStorage.getItem('bidagri-lot-anonymous') || '[]');
    
    if (anonymousItems.length > 0) {
      const userItems = this.getLotItems();
      
      // Merge anonymous items with user items
      anonymousItems.forEach(anonymousItem => {
        const existingIndex = userItems.findIndex(userItem => 
          userItem.product.id === anonymousItem.product.id
        );
        
        if (existingIndex >= 0) {
          // Merge quantities
          userItems[existingIndex].quantity += anonymousItem.quantity;
        } else {
          // Add new item with user ID
          userItems.push({
            ...anonymousItem,
            userId: userId
          });
        }
      });
      
      // Save merged items to user's lot
      const userStorageKey = `bidagri-lot-${userId}`;
      localStorage.setItem(userStorageKey, JSON.stringify(userItems));
      
      // Clear anonymous lot
      localStorage.removeItem('bidagri-lot-anonymous');
    }
  },

  // Check if user is logged in
  isUserLoggedIn(): boolean {
    return tokenUtils.isTokenValid();
  }
};
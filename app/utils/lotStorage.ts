import { Product } from '../components/apiEndpoints/products/products';

export interface LotItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export const lotStorage = {
  // Get all items from lot
  getLotItems(): LotItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const items = localStorage.getItem('bidagri-lot');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error reading lot from localStorage:', error);
      return [];
    }
  },

  // Add product to lot
  addToLot(product: Product): LotItem[] {
    const items = this.getLotItems();
    const existingItemIndex = items.findIndex(item => item.product.id === product.id);

    if (existingItemIndex >= 0) {
      // Update quantity if product already exists
      items[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      items.push({
        product,
        quantity: 1,
        addedAt: new Date().toISOString()
      });
    }

    localStorage.setItem('bidagri-lot', JSON.stringify(items));
    return items;
  },

  // Remove product from lot
  removeFromLot(productId: number): LotItem[] {
    const items = this.getLotItems();
    const filteredItems = items.filter(item => item.product.id !== productId);
    localStorage.setItem('bidagri-lot', JSON.stringify(filteredItems));
    return filteredItems;
  },

  // Update product quantity in lot
  updateQuantity(productId: number, quantity: number): LotItem[] {
    const items = this.getLotItems();
    const itemIndex = items.findIndex(item => item.product.id === productId);
    
    if (itemIndex >= 0) {
      if (quantity <= 0) {
        return this.removeFromLot(productId);
      } else {
        items[itemIndex].quantity = quantity;
        localStorage.setItem('bidagri-lot', JSON.stringify(items));
      }
    }
    
    return items;
  },

  // Clear entire lot
  clearLot(): void {
    localStorage.removeItem('bidagri-lot');
  },

  // Get lot count (total items)
  getLotCount(): number {
    const items = this.getLotItems();
    return items.reduce((total, item) => total + item.quantity, 0);
  },

  // Get total value of lot
  getLotTotal(): number {
    const items = this.getLotItems();
    return items.reduce((total, item) => total + (item.product.startPrice * item.quantity), 0);
  }
};
'use client';

import { useState, useEffect, useCallback } from 'react';
import './products.css'
import { productCategoriesApi } from '../components/apiEndpoints/productCategory/productCategory';
import { message } from 'antd';
import { productApi } from '../components/apiEndpoints/products/products';
import { type Product } from '../components/apiEndpoints/products/products';
import { type ProductCategory } from '../components/apiEndpoints/productCategory/productCategory';
import ProtectedRoute from '../components/protectedRoute';
import { tokenUtils } from '../components/apiEndpoints/login/login';

// Local Storage Utilities with User-specific storage
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
      message.error('Please login to add products to your lot');
      return [];
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
      
      message.success('Your cart items have been saved to your account');
    }
  },

  // Check if user is logged in
  isUserLoggedIn(): boolean {
    return tokenUtils.isTokenValid();
  }
};

// Header Component (unchanged)
function Header({ lotCount, onHelpClick }: { lotCount: number; onHelpClick: () => void }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}></div>
      
      <div className="container row">
        {/* Logo */}
        <div className="brand">
          <a href="/">
            <div className="header-logo show" style={{ height: '32px', width: 'auto', color: 'white', fontWeight: 'bold', fontSize: '24px' }}>
              BIDAGRI
            </div>
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`mobile-menu-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Navigation */}
        <nav className={`nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <img 
            src="/images/auction-bid.png" 
            alt="Auction Hammer" 
            className="header-auction-img"
            style={{ height: '40px', width: 'auto', margin: '0 10px' }}
          />
          <a href="/#contact" className="cta">Auction</a>
          
          {/* Lot Indicator - Now clickable and goes to lot page */}
          <a href="/lot" className="lot-indicator" aria-label="View lot" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <svg className="lot-indicator-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16l-1.5 12h-13L4 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="lot-indicator-count">{lotCount}</span>
          </a>

          {/* Help Button */}
          <button 
            className="lot-help" 
            onClick={onHelpClick}
            aria-label="How the product lot works"
          >
            <span className="lot-help-icon">?</span>
          </button>
        </nav>
      </div>
    </header>
  );
}

// Product Card Component (unchanged)
function ProductCard({ product, onAddToLot, categories }: { 
  product: Product; 
  onAddToLot: (product: Product) => void;
  categories: ProductCategory[];
}) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToLot = async () => {
    setIsAdding(true);
    await onAddToLot(product);
    setIsAdding(false);
  };

  // Find the category and parent category for this product
  const productCategory = categories.find(cat => cat.id === product.productCategoryDTO.id);
  const parentCategory = productCategory?.parentId 
    ? categories.find(cat => cat.id === productCategory.parentId)
    : productCategory;

  return (
    <article 
      className="product-card" 
      data-category={parentCategory?.name || 'Uncategorized'} 
      data-subcategory={productCategory?.name || 'Uncategorized'}
    >
      <div className="product-image-placeholder">
        {productCategory?.imageUrl ? (
          <img src={productCategory.imageUrl} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image-fallback">
            {product.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        {/* Category badges */}
        <div className="product-categories">
          {parentCategory && (
            <span className="category-badge main-category">{parentCategory.name}</span>
          )}
          {productCategory && productCategory.parentId && (
            <span className="category-badge subcategory">{productCategory.name}</span>
          )}
        </div>
        
        <div className="product-pricing">
          <div className="product-price-block">
            <span className="price-label">Start Price</span>
            <span className="price-value">€{product.startPrice}</span>
          </div>
          <div className="product-price-block">
            <span className="price-label">End Price</span>
            <span className="price-value">€{product.endPrice}</span>
          </div>
        </div>
        
        <div className="product-details">
          <span className="product-size">{product.sizeOrVolume}</span>
          <span className="product-quantity">{product.quantity} {product.unit}</span>
        </div>
        
        <div className="product-actions">
          <button 
            className={`product-btn primary add-to-lot-btn ${isAdding ? 'loading' : ''}`}
            onClick={handleAddToLot}
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : 'Add to Lot'}
          </button>
          <button className="product-btn secondary">
            Details
          </button>
        </div>
      </div>
    </article>
  );
}

// Modal Components (unchanged)
function LoginModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState({ email: '', password: '' });

  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} id="loginModal" aria-hidden={!isOpen} role="dialog">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-dialog" role="document">
        <button className="modal-close" onClick={onClose} aria-label="Close login form">
          <span aria-hidden="true">&times;</span>
        </button>
        
        <div className="modal-header">
          <h2>Login to Continue</h2>
          <p>Please sign in to add products to your lot.</p>
        </div>
        
        <form className="modal-form" onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
          <div className="form-field">
            <label htmlFor="loginEmail">Email Address</label>
            <input
              type="email"
              id="loginEmail"
              name="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
          
          <div className="form-field">
            <label htmlFor="loginPassword">Password</label>
            <input
              type="password"
              id="loginPassword"
              name="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            />
          </div>
          
          <div className="modal-links">
            <a href="#" className="modal-link">Forgot password?</a>
          </div>
          
          <button type="submit" className="modal-submit">Login</button>
        </form>
        
        <div className="modal-footer">
          <p>Not registered yet? <a href="#">Create an account</a></p>
        </div>
      </div>
    </div>
  );
}

function HelpModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  const steps = [
    { number: 1, title: 'Select a Product', description: 'Browse the list and pick items that match your requirements. Each card shows price guidance to help you decide.' },
    { number: 2, title: 'Add to Lot', description: 'Use the "Add to Lot" button to queue the product. We\'ll keep track of the count in your lot indicator above.' },
    { number: 3, title: 'Specify Pricing', description: 'After logging in, confirm your target price band or adjust min and max figures to guide merchant bids.' },
    { number: 4, title: 'Confirm', description: 'Review your lot and lock it in. Once saved, you\'re ready to launch an auction or share the lot with suppliers.' },
  ];

  return (
    <div className={`help-modal ${isOpen ? 'show' : ''}`} id="lotHelpModal" aria-hidden={!isOpen} role="dialog">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-dialog" role="document">
        <button className="modal-close" onClick={onClose} aria-label="Close help">
          <span aria-hidden="true">&times;</span>
        </button>
        
        <div className="help-modal-header">
          <h2>How Product Lots Work</h2>
          <p>Follow these quick steps to collect the products you need before launching your auction.</p>
        </div>
        
        <div className="help-steps">
          {steps.map((step) => (
            <div key={step.number} className="help-step">
              <div className="help-step-icon">{step.number}</div>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="help-modal-footer">
          Need more details? <a href="#">Contact +1 000 000 000 for support</a>
        </div>
      </div>
    </div>
  );
}

// Footer Component (unchanged)
function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <div style={{ height: '120px', width: 'auto', color: 'white', fontWeight: 'bold', fontSize: '48px', display: 'flex', alignItems: 'center' }}>
              BIDAGRI
            </div>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="X (Twitter)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-text">
            <p>Join Ireland's fastest-growing agricultural marketplace. Farmers list what they need — merchants bid in real time to win the order. BidAgri brings competition, transparency, and better value to every farm transaction.</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/#how">How It Works</a></li>
                <li><a href="/#categories">Categories</a></li>
                <li><a href="/#contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2025 BidAgri. All rights reserved. | Registered in Ireland | VAT: IE123456789</p>
        </div>
      </div>
    </footer>
  );
}

// Main Products Page Component
function ProductsPageContent() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [lotCount, setLotCount] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Initialize lot count from localStorage
  useEffect(() => {
    setLotCount(lotStorage.getLotCount());
    
    // Listen for lot updates from other components
    const handleLotUpdate = () => {
      setLotCount(lotStorage.getLotCount());
    };

    window.addEventListener('lotUpdated', handleLotUpdate);
    return () => window.removeEventListener('lotUpdated', handleLotUpdate);
  }, []);

  // Extract main categories and subcategories based on your rule
  const mainCategories = categories.filter(cat => cat.id === cat.parentId);
  const subcategories = categories.filter(cat => 
    cat.id !== cat.parentId &&
    (selectedCategory === 'all' || cat.parentId?.toString() === selectedCategory)
  );

  const fetchProducts = async () => {
    try {
      const response = await productApi.getAllProduct();
      if (response.payloadDto) {
        setProducts(response.payloadDto);
        setFilteredProducts(response.payloadDto);
      } else {
        message.error("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Error loading products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search and category filters
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => {
        const productCategory = categories.find(cat => cat.id === product.productCategoryDTO.id);
        const parentCategoryId = productCategory?.parentId || productCategory?.id;
        return parentCategoryId?.toString() === selectedCategory;
      });
    }

    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => {
        const productCategory = categories.find(cat => cat.id === product.productCategoryDTO.id);
        return productCategory?.id.toString() === selectedSubcategory;
      });
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, selectedSubcategory, categories, products]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await productCategoriesApi.getAllProductCategories();
        setCategories(response.payloadDto || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddToLot = (product: Product) => {
    try {
      // Add to localStorage with user ID
      lotStorage.addToLot(product);
      
      // Update count
      const newCount = lotStorage.getLotCount();
      setLotCount(newCount);
      
      // Show success message
      message.success(`${product.name} added to lot!`);
      
      // Trigger event for other components to listen to
      window.dispatchEvent(new Event('lotUpdated'));
    } catch (error) {
      console.error('Error adding to lot:', error);
      message.error('Failed to add product to lot');
    }
  };

  return (
    <div className="products-page">
      <Header 
        lotCount={lotCount} 
        onHelpClick={() => setIsHelpModalOpen(true)}
      />
      
      <main className="products-main">
        <div className="container">
          {/* Header Section */}
          <section className="products-header">
            <h1>Dairy &amp; Livestock Essentials</h1>
            <p>Discover curated products ready to be bundled into your next auction lot. Every item is vetted for Irish farm conditions, with transparent pricing bands to guide your bidding strategy.</p>
            <span className="products-category-tag">Selected category: Dairy &amp; Livestock Essentials</span>
          </section>

          {/* Filters and Search */}
          <section className="products-controls" aria-label="Product controls">
            <div className="products-filters">
              <div className="filter-group">
                <label htmlFor="productCategoryFilter">Category</label>
                <select 
                  id="productCategoryFilter"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('all');
                  }}
                >
                  <option value="all">All categories</option>
                  {mainCategories.map(category => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="filter-group">
                <label htmlFor="productSubcategoryFilter">Subcategory</label>
                <select 
                  id="productSubcategoryFilter"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={selectedCategory === 'all'}
                >
                  <option value="all">All subcategories</option>
                  {subcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id.toString()}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="products-search">
              <input 
                id="productSearch"
                type="search" 
                placeholder="Search products by name or description…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </section>

          {/* Products Grid */}
          <section aria-label="Product listings">
            <div className="product-grid">
              {filteredProducts.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAddToLot={handleAddToLot}
                  categories={categories}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p className="products-empty">
                No products found. Try a different search term.
              </p>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSubmit={(data) => {
          console.log('Login:', data);
          setIsLoginModalOpen(false);
        }}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}

// Export the wrapped component
export default function ProductsPage() {
  return (
    <ProtectedRoute requiredRoles="SYSTEM_USER">
      <ProductsPageContent />
    </ProtectedRoute>
  );
}
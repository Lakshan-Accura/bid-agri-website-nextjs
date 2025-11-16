'use client';

import { useState, useEffect, useCallback } from 'react';
import './products.css'

// Types
interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  image: string;
  minPrice: number;
  maxPrice: number;
  unit?: string;
}

// Mock data
const products: Product[] = [
  {
    id: '1',
    name: 'Premium Grass Silage Bales (4x4)',
    description: 'High-density 2024 second-cut grass silage with 28% dry matter and excellent lactic acid profile.',
    category: 'Feed & Forage',
    subcategory: 'Silage',
    image: 'https://picsum.photos/seed/silage/600/400',
    minPrice: 120,
    maxPrice: 160
  },
  {
    id: '2',
    name: 'Wholecrop Barley (30% Moisture)',
    description: 'Fresh chopped wholecrop barley ensiled and sheeted, ideal for high-energy dairy rations.',
    category: 'Feed & Forage',
    subcategory: 'Wholecrop',
    image: 'https://picsum.photos/seed/barley/600/400',
    minPrice: 210,
    maxPrice: 250
  },
  {
    id: '3',
    name: 'Dairy Ration 18% Protein (Bulk)',
    description: 'Soya-rich, high-energy blend formulated for early lactation cows, delivered in bulk blower loads.',
    category: 'Feed & Nutrition',
    subcategory: 'Dairy Feed',
    image: 'https://picsum.photos/seed/ration/600/400',
    minPrice: 365,
    maxPrice: 395
  },
  {
    id: '4',
    name: 'Calf Starter Pellets (18% Protein)',
    description: 'Palatable, molassed pellets with a full vitamin and mineral pack for calves from 10 days old.',
    category: 'Youngstock',
    subcategory: 'Calf Feed',
    image: 'https://picsum.photos/seed/calfstarter/600/400',
    minPrice: 12,
    maxPrice: 15
  },
  {
    id: '5',
    name: 'Maize Silage Clamp (32% Starch)',
    description: 'Precision-chopped Pioneer hybrid maize with uniform kernel processing for maximum feed efficiency.',
    category: 'Feed & Forage',
    subcategory: 'Silage',
    image: 'https://picsum.photos/seed/maize/600/400',
    minPrice: 180,
    maxPrice: 220
  },
  {
    id: '6',
    name: 'Beet Pulp Nuts (Moist)',
    description: 'Moist beet pulp with added molasses, perfect for maintaining rumen health and butterfat levels.',
    category: 'Feed & Nutrition',
    subcategory: 'Energy Feeds',
    image: 'https://picsum.photos/seed/beetpulp/600/400',
    minPrice: 195,
    maxPrice: 225
  }
];

// Header Component
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
          
          {/* Lot Indicator */}
          <button className="lot-indicator" aria-label="View lot">
            <svg className="lot-indicator-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16l-1.5 12h-13L4 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="lot-indicator-count">{lotCount}</span>
          </button>

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

      <style jsx>{`
       
      `}</style>
    </header>
  );
}

// Product Card Component
function ProductCard({ product, onAddToLot }: { product: Product; onAddToLot: (product: Product) => void }) {
  return (
    <article className="product-card" data-category={product.category} data-subcategory={product.subcategory}>
      <img src={product.image} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        
        <div className="product-pricing">
          <div className="product-price-block">
            <span className="price-label">Min Price</span>
            <span className="price-value">€{product.minPrice}</span>
          </div>
          <div className="product-price-block">
            <span className="price-label">Max Price</span>
            <span className="price-value">€{product.maxPrice}</span>
          </div>
        </div>
        
        <div className="product-actions">
          <button 
            className="product-btn primary add-to-lot-btn"
            onClick={() => onAddToLot(product)}
          >
            Add to Lot
          </button>
          <button className="product-btn secondary">
            Details
          </button>
        </div>
      </div>

      <style jsx>{`
        
      `}</style>
    </article>
  );
}

// Modal Components
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

      <style jsx>{`
      
      `}</style>
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

      <style jsx>{`
       
      `}</style>
    </div>
  );
}

// Footer Component
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

      <style jsx>{`
       
      `}</style>
    </footer>
  );
}

// Main Products Page Component
export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [lotCount, setLotCount] = useState(0);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Extract categories and subcategories
  const categories = Array.from(new Set(products.map(p => p.category)));
  const subcategories = Array.from(new Set(
    products
      .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
      .map(p => p.subcategory)
  ));

  // Filter products
  useEffect(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, selectedSubcategory]);

  const handleAddToLot = (product: Product) => {
    setLotCount(prev => prev + 1);
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
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
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
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
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

      <style jsx global>{`
        
      `}</style>
    </div>
  );
}
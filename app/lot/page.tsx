'use client';

import { useState, useEffect } from 'react';
import { message } from 'antd';
import { Product } from '../components/apiEndpoints/products/products';
import './lot.css';
import {lotsApi} from '../components/apiEndpoints/lot/lot'
import ProtectedRoute from '../components/protectedRoute';
import { lotStorage } from '../utils/lotStorage';

export interface LotItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

  // Save lot
  const handleSave = async () => {
    try {
      const response = await lotsApi.saveLots();
      if (response.payload) {
        console.log(response.payload);
          } else {
        message.error("Failed to load product categories");
      }
    } catch (error: any) {
      console.error("Error fetching product categories:", error);
      message.error(error.message || "Failed to load product categories");
    } finally {
    }
      useEffect(() => {
    handleSave();
  }, []);
  };

// Header Component
function Header({ lotCount }: { lotCount: number }) {
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
          <a href="/products" className="cta">Products</a>
          
          {/* Lot Indicator */}
          <a href="/lot" className="lot-indicator" aria-label="View lot" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <svg className="lot-indicator-icon" width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 7h16l-1.5 12h-13L4 7Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="lot-indicator-count">{lotCount}</span>
          </a>
        </nav>
      </div>
    </header>
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
    </footer>
  );
}

// Main Lot Page Component
export default function LotPage() {
  const [lotItems, setLotItems] = useState<LotItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLotItems();
    
    // Listen for lot updates from other components
    const handleLotUpdate = () => {
      loadLotItems();
    };

    window.addEventListener('lotUpdated', handleLotUpdate);
    return () => window.removeEventListener('lotUpdated', handleLotUpdate);
  }, []);

  const loadLotItems = () => {
    const items = lotStorage.getLotItems();
    setLotItems(items);
    setIsLoading(false);
  };

  const removeFromLot = (productId: number) => {
    const updatedItems = lotStorage.removeFromLot(productId);
    setLotItems(updatedItems);
    message.success('Product removed from lot');
    window.dispatchEvent(new Event('lotUpdated'));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const updatedItems = lotStorage.updateQuantity(productId, quantity);
    setLotItems(updatedItems);
    window.dispatchEvent(new Event('lotUpdated'));
  };

  if (isLoading) {
    return (
      <div className="lot-page">
        <Header lotCount={0} />
        <div className="lot-loading">Loading your lot...</div>
      </div>
    );
  }

  return (
<ProtectedRoute requiredRoles="SYSTEM_USER">
    <div className="lot-page">
      <Header lotCount={lotStorage.getLotCount()} />
      
       <main className="create-lot-main">
        <div className="container">
            <div className="create-lot-header">
                <h1>Create Your Lot</h1>
                <p>Review and manage the products you've selected for your auction lot. Adjust quantities as needed before finalizing.</p>
            </div>

          {lotItems.length === 0 ? (
            <div className="lot-empty">
              <h2>Your lot is empty</h2>
              <p>Add some products from the products page to get started.</p>
              <a href="/products" className="btn primary">Browse Products</a>
            </div>
          ) : (
            <>
              <div className="lot-products-list">
                {lotItems.map((item) => (
                  
                  <div key={item.product.id} className="lot-product-item">
                    <div className="lot-product-image">
                      <div className="image-placeholder">
                        {item.product.name.charAt(0)}
                      </div>
                    </div>
                    
                    <div className="lot-product-info">
                        <h3 className="lot-product-title">{item.product.name}</h3>
                      <p className="lot-product-description">{item.product.description}</p>
                      <div className="lot-item-meta">
                         <div className="lot-product-brand">
                                <span className="meta-label">Brand: </span>
                                <span className="meta-value">{item.product.brandDTO.name}</span>
                            </div>
                         <div className="lot-product-pricing">
                                <span className="price-label">Min Price: </span>
                                <span className="price-value">&euro;{item.product.endPrice}</span>
                                <span className="price-label">Max Price: </span>
                                <span className="price-value">&euro;{item.product.startPrice}</span>
                        </div>
                      </div>
                    </div>

                    {/* <div className="lot-product-controls">
                      <label>Quantity:</label>
                      <div className="quantity-controls">

                        <div className="lot-product-qty">
                        <label>Quantity:</label>
                        </div>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </div> */}

                      <div className="lot-product-controls">
                        <div className="lot-product-qty">
                            <label htmlFor="qty1">Qty</label>
                            <input type="number" id="qty1" name="qty" value="1" min="1" className="qty-input"/>
                        </div>
                        <button className="lot-remove-btn" type="button" aria-label="Remove product">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                            Remove
                        </button>
                    </div>

                  </div>
                ))}
              </div>

              <div className="lot-actions">
                 <a href="/products" className="product-btn secondary">
                 Continue Shopping
                </a>
                <button onClick={handleSave} className="product-btn primary">
                   Create Lot 
                </button>
               
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
    </ProtectedRoute>
  );
}
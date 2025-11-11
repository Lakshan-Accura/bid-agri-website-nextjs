'use client'

import { Button, Space } from 'antd'
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react'
import './home.css'

import { 
  ShopOutlined, 
  UserOutlined, 
  EnvironmentOutlined 
} from '@ant-design/icons';

export default function Home() {

  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeRole, setActiveRole] = useState('farmer')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const catGridRef = useRef<HTMLDivElement | null>(null);
  const stepsScrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
    // Small delay to ensure page is fully loaded
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 80, // Adjust this value for how much to scroll down
        behavior: 'smooth'
      });
    }, 50); // 500ms delay

    return () => clearTimeout(timer)
  }, [])



  // Mobile Menu Functions
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.style.overflow = !isMenuOpen ? 'hidden' : ''
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = ''
  }

  // Contact Form Handler
    const submitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert("Thank you! We'll get back to you within 1-2 business days.");
    e.currentTarget.reset(); // safer than e.target.reset()
    };

  // Category Navigation
  const scrollCategories = (direction: 'next' | 'prev') => {
    if (!catGridRef.current) return
    
    const cardWidth = 300
    const scrollAmount = cardWidth
    catGridRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    })
  }

  // Steps Navigation
  const scrollSteps = (direction: 'next' | 'prev') => {
    if (!stepsScrollRef.current) return
    
    const stepWidth = stepsScrollRef.current.clientWidth * 0.7
    const gap = 30
    const scrollAmount = stepWidth + gap
    stepsScrollRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    })
  }

  // FAQ Accordion
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  // Header Scroll Effect
  useEffect(() => {
    const handleScroll = () => {
      const heroLogo = document.querySelector('.hero-logo')
      const headerLogo = document.querySelector('.header-logo')
      const header = document.querySelector('.header')
      const heroSection = document.querySelector('.hero') as HTMLElement | null;

      if (!heroSection) return
      
      const scrollY = window.scrollY
      const heroHeight = heroSection.offsetHeight
      const fadeStart = heroHeight * 0.1
      
      if (scrollY > fadeStart) {
        heroLogo?.classList.add('fade-out')
        headerLogo?.classList.add('show')
        header?.classList.add('scrolled')
      } else {
        heroLogo?.classList.remove('fade-out')
        headerLogo?.classList.remove('show')
        header?.classList.remove('scrolled')
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Background Slideshow for Features
  useEffect(() => {
    const featuresSection = document.querySelector('.features')
    if (!featuresSection) return
    
    const images = [
      '/images/hero/istockphoto-140462837-2048x2048.jpg',
      '/images/hero/istockphoto-510581590-2048x2048.jpg',
      '/images/hero/istockphoto-493539809-2048x2048.jpg'
    ]
    
    let currentIndex = 0
    
    const changeBackground = () => {
      const nextIndex = (currentIndex + 1) % images.length
      const img = new Image()
      img.src = images[nextIndex]
      
      img.onload = () => {
        const featuresSection = document.querySelector('.features') as HTMLElement | null;

        if (featuresSection) {
        featuresSection.style.backgroundImage = `url(${images[nextIndex]})`;
        }

        currentIndex = nextIndex
      }
    }
    
    const interval = setInterval(changeBackground, 4000)
    changeBackground()
    
    return () => clearInterval(interval)
  }, [])

  // Background Slideshow for About
  useEffect(() => {
    const aboutSection = document.querySelector('.about')
    if (!aboutSection) return
    
    const images = [
      '/images/hero/istockphoto-2235542580-2048x2048.jpg',
      '/images/hero/istockphoto-92024115-2048x2048.jpg',
      '/images/hero/istockphoto-1265550249-2048x2048.jpg',
      '/images/hero/istockphoto-1960246100-2048x2048.jpg'
    ]
    
    let currentIndex = 0
    
    const changeBackground = () => {
      const nextIndex = (currentIndex + 1) % images.length
      const img = new Image()
      img.src = images[nextIndex]
      
      img.onload = () => {
        const aboutSection = document.querySelector('.about-section') as HTMLElement | null;

        if (aboutSection) {
        aboutSection.style.backgroundImage = `url(${images[nextIndex]})`;
        }

        currentIndex = nextIndex
      }
    }
    
    const interval = setInterval(changeBackground, 4000)
    changeBackground()
    
    return () => clearInterval(interval)
  }, [])

  // Category Filtering
  const categories = [
    { id: 'animal-remedies', label: 'Animal Remedies', image: '/images/categories/istockphoto-2168017549-2048x2048.jpg' },
    { id: 'dairy', label: 'Dairy', image: '/images/categories/istockphoto-1343674453-2048x2048.jpg' },
    { id: 'calving-lambing', label: 'Calving and Lambing', image: '/images/categories/istockphoto-1289281917-2048x2048.jpg' },
    { id: 'grassland-harvest', label: 'Grassland and Harvest', image: '/images/categories/istockphoto-476573454-2048x2048.jpg' },
    { id: 'feed-fertilizer', label: 'Feed and Fertilizer', image: '/images/categories/istockphoto-1141422847-2048x2048.jpg' },
    { id: 'farm-equipment', label: 'Farm Equipment', image: '/images/categories/istockphoto-1166015650-2048x2048.jpg' },
    { id: 'hoof-care', label: 'Hoof Care', image: '/images/categories/istockphoto-875237114-2048x2048.jpg' }
  ]

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.id === selectedCategory)

  // FAQ Data
  const faqData = [
    {
      question: "What is BidAgri?",
      answer: "BidAgri is an online platform where farmers can list the supplies they need, and registered merchants bid in real time to offer the best price."
    },
    {
      question: "How does the auction work?",
      answer: "Once you submit your list, it opens a 3-hour reverse auction. Merchants across Ireland place bids to win your order, and you can watch your lot live as the bidding takes place."
    },
    {
      question: "Who can see the bidding?",
      answer: "Only you can see your auction as it runs. This keeps things simple and fair — merchants focus on giving their best price, and you can follow the live updates in real time."
    },
    {
      question: "Is it safe to buy through BidAgri?",
      answer: "Yes. All payments go through a secure Escrow system, meaning funds are only released once your goods are delivered."
    },
    {
      question: "What kind of products can I source on BidAgri?",
      answer: "You can source a wide range of farm supplies, including animal dosing, dairy hygiene, minerals, fertilizers, fencing, and more."
    },
    {
      question: "Can everyone see my details?",
      answer: "No. Merchants can only see the delivery area for your order. Your personal details are shared only with the winning bidder, and only after you approve the transaction."
    },
    {
      question: "How do I know the merchants are genuine?",
      answer: "All merchants are verified before joining BidAgri to ensure they're legitimate agricultural suppliers operating in Ireland."
    },
    {
      question: "Is there a cost to use BidAgri?",
      answer: "Farmers pay a €10 deposit to start an auction. If you proceed with the winning bid, the deposit is deducted from your final order. If you decide not to go ahead, the deposit is non-refundable."
    },
    {
      question: "Can I use BidAgri on my phone?",
      answer: "Yes. The entire platform is mobile-optimized, so you can track bids and manage your auctions anytime, anywhere."
    }
  ]

    const handleFarmerLogin = () => {
    router.push('/logins/farmerLogin');
  };

  const handleStoreLogin = () => {
    router.push('/logins/storeLogin');
  };


  return (
    <>
      <style jsx global>{`
        /* Copy your entire CSS file content here */
        /* Make sure image paths are correct for Next.js */
        body {
          margin: 0;
          padding: 0;
          font-family: 'Geist', sans-serif;
        }
        
        /* Add all your existing CSS styles */
        .header {
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          transition: all 0.3s ease;
        }
        
        .header.scrolled {
          background: rgba(0, 0, 0, 0.9);
        }
        
        .hero-logo.fade-out {
          opacity: 0;
        }
        
        .header-logo {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .header-logo.show {
          opacity: 1;
        }
        
        /* Continue with all your existing CSS rules... */
      `}</style>

      {/* Header */}
      <header className="header">
        <div className={`mobile-menu-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
        <div className="container row">
          <div className="brand">
            <img src="/images/logo-bidagri.png" alt="BidAgri Logo" className="header-logo" />
          </div>
          <button 
            className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`} 
            aria-label="Toggle menu"
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
            <a href="#how" onClick={closeMenu}>How It Works</a>
            <a href="#categories" onClick={closeMenu}>Categories</a>
            <a href="#about" onClick={closeMenu}>About Us</a>
            <img src="/images/auction-bid.png" alt="Auction" className="header-auction-img" />
            <a href="#contact" className="cta" onClick={closeMenu}>Auction</a>
            {/* <a href="/logins/farmerLogin" onClick={handleFarmerLogin}>Farmer Login</a>
            <a href="/logins/storeLogin" onClick={handleStoreLogin}>Store Login</a> */}
          
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <video className="hero-bg-video" autoPlay loop muted playsInline>
          <source src="/vid-crops-1.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay"></div>
        <div className="container hero-inner">
          <div className="hero-content">
            <img src="/images/logo-bidagri-large.png" alt="BidAgri Logo" className="hero-logo" />
            <h1><span className="highlight-text">Connecting Farmers with Merchants</span>, Real‑Time Bidding & Fair Prices</h1>
            <p className="lead">Join Ireland's fastest-growing agricultural marketplace. Farmers list what they need — merchants bid in real time to win the order. BidAgri brings competition, transparency, and better value to every farm transaction.</p>
            <div className="hero-actions">
              <a className="btn primary" href="#how">How it works</a>
              <a className="btn" href="#categories">Browse Categories</a>
            </div>
          </div>
          
            <div
            className="scroll-indicator"
            onClick={() => {
                const target = document.querySelector('.features');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            }}
            >
            <div className="scroll-text">Scroll Down</div>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose BidAgri?</h2>
          <p>Modern tools and features designed specifically for digital agricultural trading.</p>
          
          <div className="features-showcase">
            <div className="features-content">
              <h3>Built for Agriculture</h3>
              <p>BidAgri makes sourcing farm supplies faster and fairer. Skip the phone calls, list what you need once and let merchants bid in real time to win your order.</p>
              
              <ul className="features-list">
                <li>Save time with one request to all suppliers</li>
                <li>Get the best price through live, transparent bidding</li>
                <li>Stay secure with escrow protection</li>
                <li>Trade anywhere with our mobile-friendly platform</li>
                <li>Buy with confidence you stay in control from start to finish</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how" id="how">
        <div className="container">
          <h2>How It Works</h2>
          <p>Simple steps for farmers and buyers to trade with confidence.</p>
          
          <div className="workflow-pills">
            <div 
              className={`workflow-pill ${activeRole === 'farmer' ? 'active' : ''}`} 
              data-role="farmer"
              onClick={handleFarmerLogin}
            >
              I'm a Farmer
            </div>
            <div 
              className={`workflow-pill ${activeRole === 'merchant' ? 'active' : ''}`} 
              data-role="merchant"
              onClick={handleStoreLogin}
            >
              I'm a Merchant
            </div>
          </div>


          {/* Add your steps content here based on activeRole */}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <h2>Frequently Asked Questions</h2>
          <p>Get answers to common questions about BidAgri and how our platform works.</p>
          
          <div className="faq-container">
            {faqData.map((faq, index) => (
              <div key={index} className={`faq-item ${activeFaq === index ? 'active' : ''}`}>
                <div className="faq-question" onClick={() => toggleFaq(index)}>
                  <span>{faq.question}</span>
                  <span className="faq-icon">{activeFaq === index ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="cats" id="categories">
        <h2>Shop by Category</h2>
        <p>Discover a wide range of agricultural products from trusted Irish farmers and merchants.</p>
        
        <div className="category-filter">
          <label htmlFor="mainCategorySelect">Select Main Category:</label>
          <select 
            id="mainCategorySelect" 
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="animal-remedies">Animal Remedies</option>
            <option value="dairy">Dairy</option>
            <option value="calving-lambing">Calving and Lambing</option>
            <option value="grassland-harvest">Grassland and Harvest</option>
            <option value="feed-fertilizer">Feed and Fertilizer</option>
            <option value="farm-equipment">Farm Equipment</option>
            <option value="hoof-care">Hoof Care</option>
          </select>
        </div>
        
        <div className="cat-container">
          <button className="cat-nav-btn prev" onClick={() => scrollCategories('prev')}>‹</button>
          <div className="cats-grid" ref={catGridRef}>
            {filteredCategories.map((category) => (
              <div key={category.id} className="cat-grid-item" data-category={category.id}>
                <img src={category.image} alt={category.label} />
                <div className="cat-title-area">
                  <div className="cat-label">{category.label}</div>
                </div>
              </div>
            ))}
          </div>
          <button className="cat-nav-btn next" onClick={() => scrollCategories('next')}>›</button>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <h2>What Our Farmers Say</h2>
          <p>Real stories from Irish farmers who have transformed their trading experience with BidAgri.</p>
          
          <div className="testimonial-grid">
            <div className="testimonial">
              <div className="quote">"BidAgri has revolutionized how I sell my produce. The real-time bidding ensures I get fair prices every time."</div>
              <div className="author">Sean Murphy</div>
              <div className="role">Dairy Farmer, Cork</div>
            </div>
            <div className="testimonial">
              <div className="quote">"As a grain merchant, I love the transparency and efficiency. Finding quality Irish produce has never been easier."</div>
              <div className="author">Mary Walsh</div>
              <div className="role">Grain Merchant, Galway</div>
            </div>
            <div className="testimonial">
              <div className="quote">"The platform is intuitive and secure. I've increased my sales by 40% since joining BidAgri."</div>
              <div className="author">Kevin O'Brien</div>
              <div className="role">Vegetable Farmer, Kerry</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about">
        <div className="container">
          <h2>About BidAgri</h2>
          <p className="about-intro">BidAgri brings competition, transparency, and better value to every farm transaction.</p>
          
          <div className="about-showcase">
            <div className="about-content">
              <h3>Our Story</h3>
              <p>BidAgri was founded by George Sherlock, a farmer and agri professional based in Co. Laois. With deep roots in Irish agriculture and years spent working directly with farmers across Ireland, George has seen both the strengths and the challenges in how farm products are sourced and sold.</p>
              <p>As a farmer himself, George knows the pressure of balancing costs, time, and trust when buying supplies and the effort agri-stores put into staying competitive. That first-hand experience inspired the creation of BidAgri: a simple, fair, and transparent platform that connects farmers and suppliers through a reverse-auction system.</p>
              <p>Built on rural values of honesty, hard work, and community, BidAgri isn't about changing the way farmers do business—it's about improving it. Our goal is to save farmers time, help suppliers reach more customers, and keep more value in rural Ireland.</p>
            </div>
            
            <div className="about-content">
              <h3>Our Mission</h3>
              <p>At BidAgri, we believe farmers and merchants of every size deserve a fair, transparent way to do business. Prices can differ widely from store to store, and we're here to make the process simpler, faster, and fair for everyone involved.</p>
              <p>By creating real-time competition and open access to customers, BidAgri helps level the playing field—giving farmers better value and merchants new opportunities to grow. It's about bringing everyone together and giving the agricultural community back the control it deserves.</p>
            </div>
          </div>
          
          <p className="mission-highlight">Grow Your Farm, Not Your Costs!</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact" id="contact">
        <div className="container">
          <h2>Get In Touch</h2>
          <p>Ready to start trading? Contact our team for personalized support and guidance.</p>
          <div className="contact-grid">
            <form className="form" onSubmit={submitForm}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input id="phone" name="phone" />
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input id="subject" name="subject" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" required></textarea>
              </div>
              <button type="submit">Send Message</button>
            </form>
            <div className="info">
              <div className="card">
                <h4>Get in Touch</h4>
                <div className="contact-methods">
                  <div className="contact-method">
                    <h5>Email Support</h5>
                    <p><a href="mailto:support@bidagri.com">support@bidagri.com</a><br /><a href="mailto:info@bidagri.com">info@bidagri.com</a></p>
                  </div>
                  <div className="contact-method">
                    <h5>Phone Support</h5>
                    <p><a href="tel:+35312345678">+353 1 234 5678</a><br />Mon–Fri, 9am–6pm</p>
                  </div>
                  <div className="contact-method">
                    <h5>Office Location</h5>
                    <p>123 Main Street<br />Dublin, Ireland</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/images/logo-bidagri-large.png" alt="BidAgri Logo" />
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
                <h4>Our Work</h4>
                <ul>
                  <li><a href="#offerings">Offerings</a></li>
                  <li><a href="#initiatives">Initiatives</a></li>
                  <li><a href="#take-action">Take Action</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>© 2025 BidAgri. All rights reserved. | Registered in Ireland | VAT: IE123456789</p>
          </div>
        </div>
      </footer>
    </>
  )
}
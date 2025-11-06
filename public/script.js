        function submitForm(e){ e.preventDefault(); alert('Thank you! We\'ll get back to you within 1-2 business days.'); e.target.reset(); }
        
        // Mobile Menu Toggle Functionality
        document.addEventListener('DOMContentLoaded', function() {
            const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
            const nav = document.querySelector('.nav');
            const overlay = document.querySelector('.mobile-menu-overlay');
            const navLinks = document.querySelectorAll('.nav a');
            
            if (mobileMenuToggle) {
                function toggleMenu() {
                    mobileMenuToggle.classList.toggle('active');
                    nav.classList.toggle('active');
                    if (overlay) {
                        overlay.classList.toggle('active');
                    }
                    // Prevent body scroll when menu is open
                    document.body.style.overflow = mobileMenuToggle.classList.contains('active') ? 'hidden' : '';
                }
                
                function closeMenu() {
                    mobileMenuToggle.classList.remove('active');
                    nav.classList.remove('active');
                    if (overlay) {
                        overlay.classList.remove('active');
                    }
                    // Restore body scroll
                    document.body.style.overflow = '';
                }
                
                mobileMenuToggle.addEventListener('click', toggleMenu);
                
                // Close menu when clicking on overlay
                if (overlay) {
                    overlay.addEventListener('click', closeMenu);
                }
                
                // Close menu when clicking on a link
                navLinks.forEach(link => {
                    link.addEventListener('click', closeMenu);
                });
                
                // Close menu when clicking outside
                document.addEventListener('click', function(event) {
                    const isClickInsideNav = nav.contains(event.target);
                    const isClickOnToggle = mobileMenuToggle.contains(event.target);
                    
                    if (!isClickInsideNav && !isClickOnToggle && nav.classList.contains('active')) {
                        closeMenu();
                    }
                });
            }
        });
        
        // Category navigation functionality
        document.addEventListener('DOMContentLoaded', function() {
            const catGrid = document.getElementById('catsGrid');
            const prevBtn = document.getElementById('catPrevBtn');
            const nextBtn = document.getElementById('catNextBtn');
            
            function updateButtons() {
                if (!catGrid || !prevBtn || !nextBtn) return;
                
                const scrollLeft = catGrid.scrollLeft;
                const maxScroll = catGrid.scrollWidth - catGrid.clientWidth;
                
                prevBtn.disabled = scrollLeft <= 5; // Small tolerance for rounding
                nextBtn.disabled = scrollLeft >= maxScroll - 5; // Small tolerance for rounding
            }
            
            function scrollToNext() {
                const cardWidth = 300; // width of cat-grid-item
                const gap = 0; // gap between cards
                const scrollAmount = cardWidth + gap;
                
                catGrid.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
            
            function scrollToPrev() {
                const cardWidth = 300; // width of cat-grid-item
                const gap = 0; // gap between cards
                const scrollAmount = cardWidth + gap;
                
                catGrid.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
            
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', scrollToPrev);
                nextBtn.addEventListener('click', scrollToNext);
            }
            
            if (catGrid) {
                catGrid.addEventListener('scroll', updateButtons);
                updateButtons(); // Initial state
            }
            
            // Make updateButtons available globally for category filtering
            window.updateCategoryButtons = updateButtons;
        });
        
        // Category filtering functionality
        document.addEventListener('DOMContentLoaded', function() {
            const categorySelect = document.getElementById('mainCategorySelect');
            const categoryItems = document.querySelectorAll('.cat-grid-item');
            
            function filterCategories() {
                const selectedCategory = categorySelect.value;
                
                categoryItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
                
                // Reset scroll position when filtering
                const catGrid = document.getElementById('catsGrid');
                if (catGrid) {
                    catGrid.scrollLeft = 0;
                    
                    // Update button states after DOM has updated
                    // Use setTimeout to ensure DOM has reflowed after display changes
                    setTimeout(function() {
                        if (window.updateCategoryButtons) {
                            window.updateCategoryButtons();
                        }
                    }, 10);
                }
            }
            
            if (categorySelect) {
                categorySelect.addEventListener('change', filterCategories);
            }
        });
        
        // Steps navigation functionality
        document.addEventListener('DOMContentLoaded', function() {
            const stepsScroll = document.getElementById('stepsScroll');
            const prevStepBtn = document.getElementById('prevStepBtn');
            const nextStepBtn = document.getElementById('nextStepBtn');
            
            function updateStepButtons() {
                const scrollLeft = stepsScroll.scrollLeft;
                const maxScroll = stepsScroll.scrollWidth - stepsScroll.clientWidth;
                
                prevStepBtn.disabled = scrollLeft <= 5;
                nextStepBtn.disabled = scrollLeft >= maxScroll - 5;
            }
            
            function scrollToNextStep() {
                const stepWidth = stepsScroll.clientWidth * 0.7; // 70% of container width
                const gap = 30; // gap between steps
                const scrollAmount = stepWidth + gap;
                
                stepsScroll.scrollBy({
                    left: scrollAmount,
                    behavior: 'smooth'
                });
            }
            
            function scrollToPrevStep() {
                const stepWidth = stepsScroll.clientWidth * 0.7; // 70% of container width
                const gap = 30; // gap between steps
                const scrollAmount = stepWidth + gap;
                
                stepsScroll.scrollBy({
                    left: -scrollAmount,
                    behavior: 'smooth'
                });
            }
            
            prevStepBtn.addEventListener('click', scrollToPrevStep);
            nextStepBtn.addEventListener('click', scrollToNextStep);
            
            stepsScroll.addEventListener('scroll', updateStepButtons);
            updateStepButtons(); // Initial state
        });
        
        // Workflow pills functionality
        document.addEventListener('DOMContentLoaded', function() {
            const pills = document.querySelectorAll('.workflow-pill');
            const farmerSteps = document.querySelectorAll('.step-block[data-role="farmer"]');
            const merchantSteps = document.querySelectorAll('.step-block[data-role="merchant"]');
            
            function switchRole(role) {
                console.log('Switching to role:', role);
                
                // Update pill states - ensure both pills remain visible
                pills.forEach(pill => {
                    pill.classList.remove('active');
                    pill.style.display = 'inline-block';
                    pill.style.opacity = '1';
                    pill.style.visibility = 'visible';
                    
                    if (pill.dataset.role === role) {
                        pill.classList.add('active');
                    }
                });
                
                // Show/hide steps
                if (role === 'farmer') {
                    farmerSteps.forEach(step => step.style.display = 'block');
                    merchantSteps.forEach(step => step.style.display = 'none');
                } else {
                    farmerSteps.forEach(step => step.style.display = 'none');
                    merchantSteps.forEach(step => step.style.display = 'block');
                }
                
                // Reset scroll position
                const stepsScroll = document.getElementById('stepsScroll');
                if (stepsScroll) {
                    stepsScroll.scrollLeft = 0;
                }
                
                // Update navigation buttons
                const prevStepBtn = document.getElementById('prevStepBtn');
                const nextStepBtn = document.getElementById('nextStepBtn');
                if (prevStepBtn && nextStepBtn) {
                    prevStepBtn.disabled = true;
                    nextStepBtn.disabled = false;
                }
            }
            
            pills.forEach(pill => {
                pill.addEventListener('click', function() {
                    switchRole(this.dataset.role);
                });
            });
        });
        
        // Background slideshow for Features section
        document.addEventListener('DOMContentLoaded', function() {
            const featuresSection = document.querySelector('.features');
            if (!featuresSection) return;
            
            const images = [
                'images/hero/istockphoto-140462837-2048x2048.jpg',
                'images/hero/istockphoto-510581590-2048x2048.jpg',
                'images/hero/istockphoto-493539809-2048x2048.jpg'
            ];
            
            let currentIndex = 0;
            
            function changeBackground() {
                const nextIndex = (currentIndex + 1) % images.length;
                
                // Preload next image
                const img = new Image();
                img.src = images[nextIndex];
                
                img.onload = function() {
                    // Smooth transition by changing the background image
                    featuresSection.style.backgroundImage = `url(${images[nextIndex]})`;
                    currentIndex = nextIndex;
                };
            }
            
            // Change background every 4 seconds
            setInterval(changeBackground, 4000);
            
            // Start the slideshow
            changeBackground();
        });
        
        // Background slideshow for About section
        document.addEventListener('DOMContentLoaded', function() {
            const aboutSection = document.querySelector('.about');
            if (!aboutSection) return;
            
            const images = [
		'images/hero/istockphoto-2235542580-2048x2048.jpg',
                'images/hero/istockphoto-92024115-2048x2048.jpg',
                'images/hero/istockphoto-1265550249-2048x2048.jpg',
                'images/hero/istockphoto-1960246100-2048x2048.jpg'
            ];
            
            let currentIndex = 0;
            
            function changeBackground() {
                const nextIndex = (currentIndex + 1) % images.length;
                
                // Preload next image
                const img = new Image();
                img.src = images[nextIndex];
                
                img.onload = function() {
                    // Smooth transition by changing the background image
                    aboutSection.style.backgroundImage = `url(${images[nextIndex]})`;
                    currentIndex = nextIndex;
                };
            }
            
            // Change background every 4 seconds
            setInterval(changeBackground, 4000);
            
            // Start the slideshow
            changeBackground();
        });
        
        // FAQ accordion functionality
        document.addEventListener('DOMContentLoaded', function() {
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question');
                
                question.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isActive = item.classList.contains('active');
                    
                    // Close all other FAQ items
                    faqItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    if (isActive) {
                        item.classList.remove('active');
                    } else {
                        item.classList.add('active');
                    }
                    
                    return false;
                }, {passive: false});
            });
        });
        
        // Logo scroll functionality
        document.addEventListener('DOMContentLoaded', function() {
            const heroLogo = document.querySelector('.hero-logo');
            const headerLogo = document.querySelector('.header-logo');
            const header = document.querySelector('.header');
            const heroSection = document.querySelector('.hero');
            
            function handleScroll() {
                const scrollY = window.scrollY;
                const heroHeight = heroSection.offsetHeight;
                const fadeStart = heroHeight * 0.1; // Start fading at 10% of hero height
                
                if (scrollY > fadeStart) {
                    // Fade out hero logo and show header logo
                    heroLogo.classList.add('fade-out');
                    headerLogo.classList.add('show');
                    // Add black background to header
                    header.classList.add('scrolled');
                } else {
                    // Show hero logo and hide header logo
                    heroLogo.classList.remove('fade-out');
                    headerLogo.classList.remove('show');
                    // Remove black background from header
                    header.classList.remove('scrolled');
                }
            }
            
            window.addEventListener('scroll', handleScroll);
            handleScroll(); // Initial call
        });

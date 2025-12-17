document.addEventListener('DOMContentLoaded', function() {
    
    // =========================================
    // 1. MOBILE MENU TOGGLE (Responsive)
    // =========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', !isHidden);
            
            // Optional: Prevent body scroll when menu is open
            if (!isHidden) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // =========================================
    // 2. ACTIVE LINK HIGHLIGHTING (Multi-Page)
    // =========================================
    function highlightActivePage() {
        const currentPath = window.location.pathname;
        const pageName = currentPath.split("/").pop() || 'index.html'; // Default to index.html

        // FIX: Only target direct children links of the nav (excludes dropdowns)
        const navLinks = document.querySelectorAll('nav > a');
        
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            
            // Reset styles first
            link.classList.remove('border-gold', 'text-gold');
            link.classList.add('border-transparent');

            // Match current page
            if (linkHref === pageName || (pageName === 'index.html' && (linkHref === './' || linkHref === 'index.html'))) {
                link.classList.remove('border-transparent', 'text-white', 'text-gray-700');
                link.classList.add('border-gold');
                
                // Keep text color logic consistent with scroll header
                if (window.scrollY > 50) {
                    link.classList.add('text-primary'); 
                } else {
                     link.classList.add('text-gold'); 
                }
            }
        });
    }
    // Run on load
    highlightActivePage();


    // =========================================
    // 3. HEADER SCROLL EFFECT
    // =========================================
    function updateHeaderStyle() {
        const header = document.querySelector('header');
        if (!header) return;

        const logoLink = header.querySelector('a.font-bold');
        
        // FIX: Only target direct children (>) to avoid affecting the language dropdown items
        const navLinks = header.querySelectorAll('nav.hidden > a'); 
        
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const langBtn = document.getElementById('language-toggle-btn');
        
        if (window.scrollY > 50) {
            // Scrolled State (White Background)
            header.classList.add('shadow-lg', 'bg-white');
            
            if(logoLink) { logoLink.classList.remove('text-white'); logoLink.classList.add('text-primary'); }
            if(mobileBtn) { mobileBtn.classList.remove('text-white'); mobileBtn.classList.add('text-primary'); }
            
            // Language Button flip colors
            if(langBtn) { 
                langBtn.classList.remove('bg-gold', 'text-primary'); 
                langBtn.classList.add('bg-primary', 'text-white'); 
            }

            // Nav Links
            navLinks.forEach(link => {
                link.classList.remove('text-white', 'text-gold'); 
                link.classList.add('text-gray-700');
            });

        } else {
            // Top State (Transparent)
            header.classList.remove('shadow-lg', 'bg-white');
            
            if(logoLink) { logoLink.classList.remove('text-primary'); logoLink.classList.add('text-white'); }
            if(mobileBtn) { mobileBtn.classList.remove('text-primary'); mobileBtn.classList.add('text-white'); }
            
            if(langBtn) { 
                langBtn.classList.remove('bg-primary', 'text-white'); 
                langBtn.classList.add('bg-gold', 'text-primary'); 
            }

            navLinks.forEach(link => {
                link.classList.remove('text-gray-700', 'text-primary');
                link.classList.add('text-white');
            });
            
            // Re-apply active highlighting if needed
            highlightActivePage();
        }
    }
    window.addEventListener('scroll', updateHeaderStyle);
    // Init on load in case we start scrolled down
    updateHeaderStyle();


    // =========================================
    // 4. SMOOTH SCROLL (Anchor Links)
    // =========================================
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const headerOffset = 80; 
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                     mobileMenu.classList.add('hidden');
                     mobileMenuBtn.setAttribute('aria-expanded', 'false');
                     document.body.style.overflow = '';
                }
            }
        });
    });

    // =========================================
    // 5. LANGUAGE TRANSLATION LOGIC (NEW)
    // =========================================
    const langBtn = document.getElementById('language-toggle-btn');
    const langMenu = document.getElementById('language-menu');
    const langOptions = document.querySelectorAll('.lang-option');
    
    // Default Language
    let currentLang = localStorage.getItem('site-language') || 'en';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('site-language', lang);
        
        // Update Button Text
        if(langBtn) {
            const span = langBtn.querySelector('span');
            if(span) span.textContent = lang === 'en' ? 'EN' : 'KH';
        }

        // Apply Translations
        const elements = document.querySelectorAll('[data-lang-en]');
        elements.forEach(el => {
            const text = el.getAttribute(`data-lang-${lang}`);
            if (text) {
                // If it's an input with placeholder
                if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
                    el.setAttribute('placeholder', text);
                } else if (el.tagName === 'H2' && el.querySelector('div img')) {
                    // For h2 with image, only update text nodes, not the image div
                    let textNode = el.lastChild;
                    if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                        textNode.textContent = text;
                    }
                } else {
                    // If the translation contains HTML tags, apply as HTML; otherwise set as text
                    if (/<[a-z][\s\S]*>/i.test(text)) {
                        el.innerHTML = text;
                    } else {
                        el.textContent = text;
                    }
                }
            }
        });

        // Update Font Family
        if (lang === 'kh') {
            document.body.classList.add('font-khmer');
        } else {
            document.body.classList.remove('font-khmer');
        }
    }

    // Event Listeners for Language Toggle
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
        });

        window.addEventListener('click', () => {
            if (!langMenu.classList.contains('hidden')) {
                langMenu.classList.add('hidden');
            }
        });

        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const selectedLang = option.getAttribute('data-lang');
                setLanguage(selectedLang);
                langMenu.classList.add('hidden');
            });
        });
    }

    // Initialize Language on Load
    setLanguage(currentLang);


    // =========================================
    // 6. HERO SLIDER (Global)
    // =========================================
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return; // Exit if no slider on this page

        let currentSlide = 0;
        const slideDuration = 3000;
        const fadeDuration = 1000; 

        // Initial setup
        slides.forEach((slide, i) => {
            slide.style.opacity = i === 0 ? '1' : '0';
            slide.style.zIndex = i === 0 ? '10' : '0';
        });

        function nextSlide() { 
            const nextSlideIndex = (currentSlide + 1) % slides.length; 
            
            // Prepare next slide
            slides[nextSlideIndex].style.zIndex = '20';
            slides[nextSlideIndex].style.opacity = '1';
            
            // Current slide moves back
            slides[currentSlide].style.zIndex = '10';
            
            setTimeout(() => { 
                if (currentSlide !== nextSlideIndex) { 
                    slides[currentSlide].style.opacity = '0'; 
                    slides[currentSlide].style.zIndex = '0';
                } 
                currentSlide = nextSlideIndex; 
            }, fadeDuration);
        }

        setInterval(nextSlide, slideDuration);
    }
    initHeroSlider(); 

    // =========================================
    // 7. TEAM CAROUSEL (Global)
    // =========================================
    function initTeamCarousel() {
        const track = document.getElementById('team-carousel-track');
        if (!track) return; 

        const prevBtn = document.getElementById('team-prev-btn');
        const nextBtn = document.getElementById('team-next-btn');
        const slides = Array.from(track.children);
        const totalSlides = slides.length;
        
        let currentIndex = 0;
        let autoSwapTimer = setInterval(slideNext, 3000); 

        // Responsive Calculation
        function getItemsToShow() {
            if (window.innerWidth >= 1024) { return 4; } 
            else if (window.innerWidth >= 768) { return 3; } 
            else if (window.innerWidth >= 640) { return 2; }
            return 1; 
        }

        function updateCarousel() {
            const itemsToShow = getItemsToShow();
            const maxIndex = Math.max(0, totalSlides - itemsToShow);
            
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;
            
            const itemWidthPercentage = 100 / itemsToShow;
            
            track.style.transform = `translateX(-${currentIndex * itemWidthPercentage}%)`;

            // Fix sizing for all slides
            slides.forEach(slide => {
                slide.style.width = `${itemWidthPercentage}%`;
                // Ensure flex-shrink is 0 so they don't squish
                slide.style.flexShrink = '0'; 
            });

            // Update button states
            if (prevBtn) {
                prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
                prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
            }
            if (nextBtn) {
                nextBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
                nextBtn.style.pointerEvents = currentIndex === maxIndex ? 'none' : 'auto';
            }
        }

        function slideNext() {
            const itemsToShow = getItemsToShow();
            const maxIndex = Math.max(0, totalSlides - itemsToShow);
            
            if (currentIndex < maxIndex) { 
                currentIndex++; 
            } else { 
                currentIndex = 0; // Loop back to start
            }
            updateCarousel();
        }

        function slidePrev() {
            const itemsToShow = getItemsToShow();
            const maxIndex = Math.max(0, totalSlides - itemsToShow);
            
            if (currentIndex > 0) { 
                currentIndex--; 
            } else { 
                currentIndex = maxIndex; // Loop to end
            }
            updateCarousel();
        }

        function resetAutoSwap() {
            clearInterval(autoSwapTimer);
            autoSwapTimer = setInterval(slideNext, 3000);
        }

        // Event Listeners
        if(nextBtn) { nextBtn.addEventListener('click', () => { slideNext(); resetAutoSwap(); }); }
        if(prevBtn) { prevBtn.addEventListener('click', () => { slidePrev(); resetAutoSwap(); }); }

        // Touch Support
        let touchStartX = 0;
        track.addEventListener('touchstart', (e) => { 
            touchStartX = e.changedTouches[0].screenX; 
            clearInterval(autoSwapTimer);
        }, { passive: true });
        
        track.addEventListener('touchend', (e) => { 
            let touchEndX = e.changedTouches[0].screenX; 
            if (touchEndX < touchStartX - 50) slideNext();
            if (touchEndX > touchStartX + 50) slidePrev();
            resetAutoSwap();
        });

        // Hover Pause
        track.parentElement.addEventListener('mouseenter', () => clearInterval(autoSwapTimer));
        track.parentElement.addEventListener('mouseleave', resetAutoSwap);
        
        // Resize Handler
        window.addEventListener('resize', updateCarousel);
        
        // Initial call
        updateCarousel();
    }
    initTeamCarousel(); 

    // =========================================
    // 8. 3D BOOK CAROUSEL
    // =========================================
    function init3DCoverFlow() {
        const track = document.getElementById('book-track-3d');
        if (!track) return;

        const prevBtn = document.querySelector('.book-prev');
        const nextBtn = document.querySelector('.book-next');
        // Check if items exist
        const items = Array.from(document.querySelectorAll('.book-slide-item-3d'));
        if(items.length === 0) return;

        const totalItems = items.length;
        let currentIndex = 0; 
        let autoSlideInterval;

        function updateCarousel() {
            items.forEach((item, index) => {
                // Reset classes
                item.className = 'book-slide-item-3d'; 
                
                let offset = index - currentIndex;
                
                // Wrap around logic
                if (offset > totalItems / 2) offset -= totalItems;
                if (offset < -totalItems / 2) offset += totalItems;

                if (offset === 0) item.classList.add('active');
                else if (offset === -1) item.classList.add('prev-1');
                else if (offset === -2) item.classList.add('prev-2');
                else if (offset === 1) item.classList.add('next-1');
                else if (offset === 2) item.classList.add('next-2');
                else item.classList.add('hidden-item');
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }

        function startAuto() { stopAuto(); autoSlideInterval = setInterval(nextSlide, 3000); }
        function stopAuto() { clearInterval(autoSlideInterval); }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); stopAuto(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); stopAuto(); });

        items.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                if (!this.classList.contains('active')) {
                    e.preventDefault();
                    currentIndex = index;
                    updateCarousel();
                    stopAuto();
                }
            });
        });

        updateCarousel();
        startAuto();
    }
    init3DCoverFlow();

    // =========================================
    // 9. GALLERY SLIDERS (2x3 Grid)
    // =========================================
    function initGallerySliders() {
        const sliders = document.querySelectorAll('.gallery-slider-container');
        sliders.forEach(container => {
            const track = container.querySelector('.gallery-slider-track');
            const slides = container.querySelectorAll('.gallery-slide-group');
            const prevBtn = container.querySelector('.gallery-prev');
            const nextBtn = container.querySelector('.gallery-next');
            const dotsContainer = container.querySelector('.gallery-slider-dots');
            
            if (!track || slides.length === 0) return;

            let currentIndex = 0;
            let autoSlideTimer;

            // Generate Dots
            if (dotsContainer) {
                dotsContainer.innerHTML = ''; // Clear existing
                slides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('gallery-dot');
                    if (index === 0) dot.classList.add('active');
                    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
                    dot.addEventListener('click', () => { goToSlide(index); resetTimer(); });
                    dotsContainer.appendChild(dot);
                });
            }

            function updateDots() {
                if(!dotsContainer) return;
                const dots = dotsContainer.querySelectorAll('.gallery-dot');
                dots.forEach((dot, index) => {
                    if (index === currentIndex) dot.classList.add('active'); 
                    else dot.classList.remove('active');
                });
            }

            function goToSlide(index) {
                if (index < 0) index = slides.length - 1; 
                if (index >= slides.length) index = 0;
                
                currentIndex = index;
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDots();
            }

            function nextSlide() { goToSlide(currentIndex + 1); }
            function prevSlide() { goToSlide(currentIndex - 1); }
            
            function resetTimer() { 
                clearInterval(autoSlideTimer); 
                autoSlideTimer = setInterval(nextSlide, 5000); // Slower for gallery
            }

            if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });
            if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });

            resetTimer();
            container.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
            container.addEventListener('mouseleave', resetTimer);
        });
    }
    initGallerySliders();

    console.log('%c THHAKNAY & ASSOCIATES Global Script Loaded ', 'background: #1e303e; color: #D1B464; padding: 5px;');
});
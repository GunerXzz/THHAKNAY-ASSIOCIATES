document.addEventListener('DOMContentLoaded', function() {
    
    // --- Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            const isHidden = mobileMenu.classList.toggle('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', !isHidden);
        });

        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (link.getAttribute('href').startsWith('#')) { // Only close for anchor links
                    mobileMenu.classList.add('hidden');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 64; // h-16
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active Links & Header Style on Scroll (Global) ---
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 80; 
        const header = document.querySelector('header');
        if (!header) return;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('nav.hidden a[href^="#"]').forEach(link => {
                    link.classList.remove('text-primary', 'border-gold');
                    if (window.pageYOffset > 50) {
                         link.classList.add('text-gray-700');
                    }
                    link.classList.add('border-transparent');
                });

                const activeLink = document.querySelector(`nav.hidden a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.remove('text-gray-700', 'border-transparent');
                    activeLink.classList.add('text-primary', 'border-gold');
                }
            }
        });

        const logoLink = header.querySelector('a.font-bold');
        const navLinks = header.querySelectorAll('nav.hidden a:not(.bg-gold)');
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const langBtn = document.getElementById('language-toggle-btn');
        
        if (window.pageYOffset > 50) {
            header.classList.add('shadow-lg', 'bg-white');
            if(logoLink) { logoLink.classList.remove('text-white'); logoLink.classList.add('text-primary'); }
            if(mobileBtn) { mobileBtn.classList.remove('text-white'); mobileBtn.classList.add('text-primary'); }
            if(langBtn) { langBtn.classList.remove('bg-gold', 'text-primary'); langBtn.classList.add('bg-primary', 'text-white'); }
            navLinks.forEach(link => {
                link.classList.remove('text-white');
                if (link.classList.contains('border-gold')) { link.classList.add('text-primary'); } else { link.classList.add('text-gray-700'); }
            });
        } else {
            header.classList.remove('shadow-lg', 'bg-white');
            if(logoLink) { logoLink.classList.remove('text-primary'); logoLink.classList.add('text-white'); }
            if(mobileBtn) { mobileBtn.classList.remove('text-primary'); mobileBtn.classList.add('text-white'); }
            if(langBtn) { langBtn.classList.remove('bg-primary', 'text-white'); langBtn.classList.add('bg-gold', 'text-primary'); }
            navLinks.forEach(link => {
                link.classList.remove('text-gray-700', 'text-primary');
                link.classList.add('text-white');
            });
        }
    });

    // --- Book Carousel Logic (3D Cover Flow) ---
    function init3DCoverFlow() {
        const track = document.getElementById('book-track-3d');
        if (!track) return;

        const prevBtn = document.querySelector('.book-prev');
        const nextBtn = document.querySelector('.book-next');
        const items = Array.from(document.querySelectorAll('.book-slide-item-3d'));
        const totalItems = items.length;
        
        let currentIndex = 0; // Start with the first item as center
        let autoSlideInterval;
        const autoSlideDelay = 3000; // 3 seconds

        function updateCarousel() {
            items.forEach((item, index) => {
                // Reset basic styles
                item.className = 'book-slide-item-3d'; // Reset classes
                item.style.opacity = ''; // Allow CSS opacity to take over or be overridden
                item.style.transform = '';
                item.style.zIndex = '';
                item.style.pointerEvents = '';

                // Calculate relative offset
                let offset = index - currentIndex;
                
                // Infinite loop wrapping logic for visual positioning
                if (offset > totalItems / 2) offset -= totalItems;
                if (offset < -totalItems / 2) offset += totalItems;

                // Assign classes based on offset
                if (offset === 0) {
                    item.classList.add('active');
                } else if (offset === -1) {
                    item.classList.add('prev-1');
                } else if (offset === -2) {
                    item.classList.add('prev-2');
                } else if (offset === 1) {
                    item.classList.add('next-1');
                } else if (offset === 2) {
                    item.classList.add('next-2');
                } else {
                    // Hide others
                    item.classList.add('hidden-item');
                }
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

        function startAutoSlide() {
            stopAutoSlide();
            autoSlideInterval = setInterval(nextSlide, autoSlideDelay);
        }

        function stopAutoSlide() {
            if (autoSlideInterval) clearInterval(autoSlideInterval);
        }

        // Event Listeners for Buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopAutoSlide();
                // Restart after interaction?
                // setTimeout(startAutoSlide, 5000); 
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopAutoSlide();
            });
        }

        // Click to center
        items.forEach((item, index) => {
            item.addEventListener('click', function(e) {
                if (this.classList.contains('active')) return; // Let default link work
                e.preventDefault();
                // Calculate shortest path to this index
                // Simple method: set index directly
                currentIndex = index;
                updateCarousel();
                stopAutoSlide();
            });
        });

        // Hover to pause
        track.parentElement.addEventListener('mouseenter', stopAutoSlide);
        track.parentElement.addEventListener('mouseleave', startAutoSlide);

        // Initialize
        updateCarousel();
        startAutoSlide();
    }
    init3DCoverFlow();


    // --- Team Carousel Logic (Global) ---
    function initTeamCarousel() {
        const track = document.getElementById('team-carousel-track');
        if (!track) return; 

        const prevBtn = document.getElementById('team-prev-btn');
        const nextBtn = document.getElementById('team-next-btn');
        const slides = Array.from(track.children);
        const totalSlides = slides.length;
        
        let currentIndex = 0;
        let autoSwapTimer = setInterval(slideNext, 3000); 

        let touchStartX = 0;
        let touchEndX = 0;

        function getItemsToShow() {
            if (window.innerWidth >= 1024) { return 4; } 
            else if (window.innerWidth >= 768) { return 3; } 
            else if (window.innerWidth >= 640) { return 2; }
            return 1; 
        }

        function updateCarousel() {
            const itemsToShow = getItemsToShow();
            const maxIndex = totalSlides - itemsToShow;
            
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;
            
            const itemWidthPercentage = 100 / itemsToShow;
            if (track) {
                track.style.transform = `translateX(-${currentIndex * itemWidthPercentage}%)`;
            }

            slides.forEach(slide => {
                slide.style.width = `${itemWidthPercentage}%`;
                slide.style.paddingLeft = '1rem'; 
                slide.style.paddingRight = '1rem'; 
            });

            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === maxIndex;
        }

        function slideNext() {
            const itemsToShow = getItemsToShow();
            const maxIndex = totalSlides - itemsToShow;
            if (currentIndex < maxIndex) { currentIndex++; } else { currentIndex = 0; }
            updateCarousel();
        }

        function slidePrev() {
            const itemsToShow = getItemsToShow();
            const maxIndex = totalSlides - itemsToShow;
            if (currentIndex > 0) { currentIndex--; } else { currentIndex = maxIndex; }
            updateCarousel();
        }

        function resetAutoSwap() {
            clearInterval(autoSwapTimer);
            autoSwapTimer = setInterval(slideNext, 3000);
        }

        function handleSwipeGesture() {
            if (touchEndX < touchStartX - 50) { slideNext(); resetAutoSwap(); }
            if (touchEndX > touchStartX + 50) { slidePrev(); resetAutoSwap(); }
        }

        if(nextBtn) { nextBtn.addEventListener('click', () => { slideNext(); resetAutoSwap(); }); }
        if(prevBtn) { prevBtn.addEventListener('click', () => { slidePrev(); resetAutoSwap(); }); }

        if(track && track.parentElement) {
            track.parentElement.addEventListener('mouseenter', () => { clearInterval(autoSwapTimer); });
            track.parentElement.addEventListener('mouseleave', () => { resetAutoSwap(); });
            track.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true }); 
            track.addEventListener('touchend', (e) => { touchEndX = e.changedTouches[0].screenX; handleSwipeGesture(); });
        }
        
        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }
    initTeamCarousel(); 

    // === NEW: GALLERY SLIDER LOGIC (2x3 Grid) ===
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
            const slideInterval = 3500; 
            let autoSlideTimer;

            if (dotsContainer) {
                slides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('gallery-dot');
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => { goToSlide(index); resetTimer(); });
                    dotsContainer.appendChild(dot);
                });
            }

            function updateDots() {
                if(!dotsContainer) return;
                const dots = dotsContainer.querySelectorAll('.gallery-dot');
                dots.forEach((dot, index) => {
                    if (index === currentIndex) { dot.classList.add('active'); } else { dot.classList.remove('active'); }
                });
            }

            function goToSlide(index) {
                if (index < 0) { currentIndex = slides.length - 1; } 
                else if (index >= slides.length) { currentIndex = 0; } 
                else { currentIndex = index; }
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDots();
            }

            function nextSlide() { goToSlide(currentIndex + 1); }
            function prevSlide() { goToSlide(currentIndex - 1); }
            function resetTimer() { clearInterval(autoSlideTimer); autoSlideTimer = setInterval(nextSlide, slideInterval); }

            if (prevBtn) { prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); }); }
            if (nextBtn) { nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); }); }

            resetTimer();
            container.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
            container.addEventListener('mouseleave', resetTimer);
        });
    }
    initGallerySliders(); 

    // --- Language Dropdown Toggle (Global) ---
    function initLanguageToggle() {
        const toggleBtn = document.getElementById('language-toggle-btn');
        const menu = document.getElementById('language-menu');
        if (!toggleBtn || !menu) return; 
        toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); menu.classList.toggle('hidden'); });
        window.addEventListener('click', (e) => { if (menu.classList.contains('hidden')) return; if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) { menu.classList.add('hidden'); } });
    }
    initLanguageToggle(); 
    
    // === HERO SLIDER LOGIC (Global) ===
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        const slideDuration = 3000;
        const fadeDuration = 1000; 

        function showSlide(index) {
            slides.forEach((slide, i) => {
                if (i === index) { slide.style.zIndex = '20'; } else if (i === currentSlide) { slide.style.zIndex = '10'; } else { slide.style.zIndex = '0'; }
                if (i === index) { slide.style.opacity = '1'; }
            });
            setTimeout(() => { if (currentSlide !== index) { slides[currentSlide].style.opacity = '0'; } currentSlide = index; }, fadeDuration);
        }

        function nextSlide() { const nextSlideIndex = (currentSlide + 1) % slides.length; showSlide(nextSlideIndex); }
        slides[currentSlide].style.zIndex = '10';
        slides[currentSlide].style.opacity = '1';
        setInterval(nextSlide, slideDuration);
    }
    initHeroSlider(); 
    
    // --- Console Greeting (Global) ---
    console.log('%c THHANKNAY & ASSOCIATES ', 'background: #1e303e; color: white; font-size: 20px; padding: 10px;');
    console.log('%c Legal Excellence Since 2021 ', 'background: #2a4456; color: white; font-size: 14px; padding: 5px;');
});
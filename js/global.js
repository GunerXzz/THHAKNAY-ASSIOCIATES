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
    // This function handles both the header style change (transparent-to-white)
    // and the active link highlighting for the main nav.
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 80; // 64px header + 16px buffer
        const header = document.querySelector('header');
        if (!header) return;

        // Active link styling (will only work on homepage, which is correct)
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

        // Transparent-to-Solid Header (will work on all pages)
        const logoLink = header.querySelector('a.font-bold');
        const navLinks = header.querySelectorAll('nav.hidden a:not(.bg-gold)');
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const langBtn = document.getElementById('language-toggle-btn');
        
        if (window.pageYOffset > 50) {
            header.classList.add('shadow-lg', 'bg-white');
            
            if(logoLink) {
                logoLink.classList.remove('text-white'); 
                logoLink.classList.add('text-primary'); 
            }
            
            if(mobileBtn) {
                mobileBtn.classList.remove('text-white'); 
                mobileBtn.classList.add('text-primary');
            }
            if(langBtn) {
                langBtn.classList.remove('bg-gold', 'text-primary');
                langBtn.classList.add('bg-primary', 'text-white');
            }
            navLinks.forEach(link => {
                link.classList.remove('text-white');
                // Check if it's the active link (border-gold)
                if (link.classList.contains('border-gold')) {
                    link.classList.add('text-primary');
                } else {
                    link.classList.add('text-gray-700');
                }
            });
        } else {
            header.classList.remove('shadow-lg', 'bg-white');
            
            if(logoLink) {
                logoLink.classList.remove('text-primary'); 
                logoLink.classList.add('text-white'); 
            }
            
            if(mobileBtn) {
                mobileBtn.classList.remove('text-primary'); 
                mobileBtn.classList.add('text-white');
            }
            if(langBtn) {
                langBtn.classList.remove('bg-primary', 'text-white');
                langBtn.classList.add('bg-gold', 'text-primary');
            }
            navLinks.forEach(link => {
                link.classList.remove('text-gray-700', 'text-primary');
                link.classList.add('text-white');
            });
        }
    });

    // --- Team Carousel Logic (Global) ---
    function initTeamCarousel() {
        const track = document.getElementById('team-carousel-track');
        if (!track) return; // Exit if carousel isn't on the page

        const prevBtn = document.getElementById('team-prev-btn');
        const nextBtn = document.getElementById('team-next-btn');
        const slides = Array.from(track.children);
        const totalSlides = slides.length;
        
        let currentIndex = 0;
        let autoSwapTimer = setInterval(slideNext, 3000); 

        let touchStartX = 0;
        let touchEndX = 0;

        function getItemsToShow() {
            if (window.innerWidth >= 1024) {
                return 4; // 4 items on lg and up
            } else if (window.innerWidth >= 768) {
                return 3; // 3 items on md (tablet)
            } else if (window.innerWidth >= 640) {
                return 2; // 2 items on sm
            }
            return 1; // 1 item on xs (mobile)
        }

        function updateCarousel() {
            const itemsToShow = getItemsToShow();
            const maxIndex = totalSlides - itemsToShow;
            
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            if (currentIndex < 0) {
                currentIndex = 0;
            }
            
            const itemWidthPercentage = 100 / itemsToShow;
            if (track) {
                track.style.transform = `translateX(-${currentIndex * itemWidthPercentage}%)`;
            }

            slides.forEach(slide => {
                slide.style.width = `${itemWidthPercentage}%`;
                slide.style.paddingLeft = '1rem'; // px-4
                slide.style.paddingRight = '1rem'; // px-4
            });

            if (prevBtn) prevBtn.disabled = currentIndex === 0;
            if (nextBtn) nextBtn.disabled = currentIndex === maxIndex;
        }

        function slideNext() {
            const itemsToShow = getItemsToShow();
            const maxIndex = totalSlides - itemsToShow;
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateCarousel();
        }

        function slidePrev() {
            const itemsToShow = getItemsToShow();
            const maxIndex = totalSlides - itemsToShow;
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

        function handleSwipeGesture() {
            if (touchEndX < touchStartX - 50) { 
                slideNext();
                resetAutoSwap();
            }
            if (touchEndX > touchStartX + 50) {
                slidePrev();
                resetAutoSwap();
            }
        }

        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                slideNext();
                resetAutoSwap();
            });
        }
        
        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                slidePrev();
                resetAutoSwap();
            });
        }

        if(track && track.parentElement) {
            track.parentElement.addEventListener('mouseenter', () => {
                clearInterval(autoSwapTimer);
            });
            track.parentElement.addEventListener('mouseleave', () => {
                resetAutoSwap();
            });

            track.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true }); 

            track.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipeGesture();
            });
        }
        
        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    }
    initTeamCarousel(); // Run the carousel function

    // === NEW: GALLERY SLIDER LOGIC (2x3 Grid) ===
    // This looks for any element with class "gallery-slider-container"
    // and initializes a slider inside it.
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
            const slideInterval = 3500; // 3.5 seconds
            let autoSlideTimer;

            // Create Dots
            if (dotsContainer) {
                slides.forEach((_, index) => {
                    const dot = document.createElement('button');
                    dot.classList.add('gallery-dot');
                    if (index === 0) dot.classList.add('active');
                    dot.addEventListener('click', () => {
                        goToSlide(index);
                        resetTimer();
                    });
                    dotsContainer.appendChild(dot);
                });
            }

            function updateDots() {
                if(!dotsContainer) return;
                const dots = dotsContainer.querySelectorAll('.gallery-dot');
                dots.forEach((dot, index) => {
                    if (index === currentIndex) {
                        dot.classList.add('active');
                    } else {
                        dot.classList.remove('active');
                    }
                });
            }

            function goToSlide(index) {
                if (index < 0) {
                    currentIndex = slides.length - 1;
                } else if (index >= slides.length) {
                    currentIndex = 0;
                } else {
                    currentIndex = index;
                }
                
                track.style.transform = `translateX(-${currentIndex * 100}%)`;
                updateDots();
            }

            function nextSlide() {
                goToSlide(currentIndex + 1);
            }

            function prevSlide() {
                goToSlide(currentIndex - 1);
            }

            function resetTimer() {
                clearInterval(autoSlideTimer);
                autoSlideTimer = setInterval(nextSlide, slideInterval);
            }

            // Event Listeners
            if (prevBtn) {
                prevBtn.addEventListener('click', () => {
                    prevSlide();
                    resetTimer();
                });
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => {
                    nextSlide();
                    resetTimer();
                });
            }

            // Start Auto Slide
            resetTimer();
            
            // Pause on hover
            container.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
            container.addEventListener('mouseleave', resetTimer);
        });
    }
    initGallerySliders(); // Initialize all gallery sliders on the page


    // --- Language Dropdown Toggle (Global) ---
    function initLanguageToggle() {
        const toggleBtn = document.getElementById('language-toggle-btn');
        const menu = document.getElementById('language-menu');
        
        if (!toggleBtn || !menu) return; // Exit if elements not found

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent window listener from closing it immediately
            menu.classList.toggle('hidden');
        });
        
        // Close dropdown if clicking outside
        window.addEventListener('click', (e) => {
            if (menu.classList.contains('hidden')) return; // Don't do anything if hidden
            
            if (!menu.contains(e.target) && !toggleBtn.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });
    }
    initLanguageToggle(); // Run the language toggle function
    

    // === HERO SLIDER LOGIC (Global) ===
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        if (slides.length === 0) return;

        let currentSlide = 0;
        const slideDuration = 3000;
        const fadeDuration = 1000; // This must match duration-1000 in HTML

        function showSlide(index) {
            slides.forEach((slide, i) => {
                // Set z-index: new slide on top, old slide below, others at bottom
                if (i === index) {
                    slide.style.zIndex = '20';
                } else if (i === currentSlide) {
                    slide.style.zIndex = '10';
                } else {
                    slide.style.zIndex = '0';
                }

                // Fade in the new slide
                if (i === index) {
                    slide.style.opacity = '1';
                }
            });

            // After the fade-in is complete, hide the old slide
            setTimeout(() => {
                // Only hide the *previous* slide
                if (currentSlide !== index) {
                    slides[currentSlide].style.opacity = '0';
                }
                currentSlide = index; // Update the current slide index
            }, fadeDuration);
        }

        function nextSlide() {
            const nextSlideIndex = (currentSlide + 1) % slides.length;
            showSlide(nextSlideIndex);
        }

        // Show the first slide immediately (no fade-in)
        slides[currentSlide].style.zIndex = '10';
        slides[currentSlide].style.opacity = '1';
        
        // Start the loop
        setInterval(nextSlide, slideDuration);
    }
    initHeroSlider(); // Run the hero slider function
    
    
    // --- Console Greeting (Global) ---
    console.log('%c THHANKNAY & ASSOCIATES ', 'background: #1e303e; color: white; font-size: 20px; padding: 10px;');
    console.log('%c Legal Excellence Since 2021 ', 'background: #2a4456; color: white; font-size: 14px; padding: 5px;');
});
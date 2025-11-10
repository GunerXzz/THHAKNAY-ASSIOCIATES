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
                // Only close if it's not a link to another page
                if (link.getAttribute('href').startsWith('#') || link.getAttribute('href').includes('index.html#')) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- Header Style on Scroll ---
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (!header) return; // Exit if header not found

        const logoLink = header.querySelector('a.font-bold');
        const navLinks = header.querySelectorAll('nav.hidden a:not(.bg-gold)');
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const langBtn = document.getElementById('language-toggle-btn');
        
        if (window.pageYOffset > 50) {
            header.classList.add('shadow-lg', 'bg-white');
            
            if (logoLink) {
                logoLink.classList.remove('text-white'); 
                logoLink.classList.add('text-primary'); 
            }

            if (mobileBtn) {
                mobileBtn.classList.remove('text-white'); 
                mobileBtn.classList.add('text-primary');
            }
            if(langBtn) {
                langBtn.classList.remove('bg-gold', 'text-primary');
                langBtn.classList.add('bg-primary', 'text-white');
            }
            navLinks.forEach(link => {
                link.classList.remove('text-white');
                if (!link.classList.contains('border-gold')) { // Don't change active link color
                    link.classList.add('text-gray-700');
                } else {
                    link.classList.add('text-primary'); // Make active link dark
                }
            });
        } else {
            header.classList.remove('shadow-lg', 'bg-white');

            if (logoLink) {
                logoLink.classList.remove('text-primary'); 
                logoLink.classList.add('text-white'); 
            }
            
            if (mobileBtn) {
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
    
    // --- Language Dropdown Toggle ---
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
    

    // === NEW: TEAM CAROUSEL LOGIC (Copied from script.js) ===
    function initTeamCarousel() {
        const track = document.getElementById('team-carousel-track');
        if (!track) return; // Exit if carousel isn't on the page

        const prevBtn = document.getElementById('team-prev-btn');
        const nextBtn = document.getElementById('team-next-btn');
        const slides = Array.from(track.children);
        const totalSlides = slides.length;
        
        let currentIndex = 0;
        let autoSwapTimer = setInterval(slideNext, 3000); // 3 seconds

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
    // === END NEW TEAM CAROUSEL LOGIC ===


    // --- Console Greeting ---
    console.log('%c THHANKNAY & ASSOCIATES - Our People ', 'background: #1e303e; color: white; font-size: 20px; padding: 10px;');
    console.log('%c Legal Excellence Since 2021 ', 'background: #2a4456; color: white; font-size: 14px; padding: 5px;');
});
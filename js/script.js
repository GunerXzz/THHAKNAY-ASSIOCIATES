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
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
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

    // --- Scroll Animation for Sections ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // --- Active Links & Header Style on Scroll ---
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 80; // 64px header + 16px buffer

        // Active link styling
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

        // Transparent-to-Solid Header
        const header = document.querySelector('header');
        const logoLink = header.querySelector('a.font-bold');
        const navLinks = header.querySelectorAll('nav.hidden a:not(.bg-gold)');
        const mobileBtn = document.getElementById('mobile-menu-btn');
        
        if (window.pageYOffset > 50) {
            header.classList.add('shadow-lg', 'bg-white');
            logoLink.classList.remove('text-white');
            logoLink.classList.add('text-primary');
            mobileBtn.classList.remove('text-white');
            mobileBtn.classList.add('text-primary');
            navLinks.forEach(link => {
                link.classList.remove('text-white');
                if (!link.classList.contains('text-primary')) {
                    link.classList.add('text-gray-700');
                }
            });
        } else {
            header.classList.remove('shadow-lg', 'bg-white');
            logoLink.classList.remove('text-primary');
            logoLink.classList.add('text-white');
            mobileBtn.classList.remove('text-primary');
            mobileBtn.classList.add('text-white');
            navLinks.forEach(link => {
                link.classList.remove('text-gray-700');
                if (!link.classList.contains('text-primary')) {
                    link.classList.add('text-white');
                }
            });
        }
    });

    // --- Newsletter Form Validation ---
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        const emailInput = document.getElementById('newsletter-email');
        const messageEl = document.getElementById('newsletter-message');

        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = emailInput.value.trim();
            
            if (!messageEl) return; // Exit if message element doesn't exist
            
            messageEl.textContent = '';
            messageEl.classList.remove('text-green-300', 'text-red-300'); // Use appropriate colors from your new design if needed

            if (email === '' || !isValidEmail(email)) {
                messageEl.textContent = 'Please enter a valid email.';
                messageEl.classList.add('text-red-300'); // Or a text-gold/warning color
                return;
            }

            messageEl.textContent = 'Thank you for subscribing!';
            messageEl.classList.add('text-green-300'); // Or a text-gold/success color
            emailInput.value = '';

            setTimeout(() => {
                messageEl.textContent = '';
                messageEl.classList.remove('text-green-300');
            }, 3000);
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- Parallax Effect for Hero ---
    window.addEventListener('scroll', function() {
        const hero = document.querySelector('section.relative.h-screen');
        if (hero) {
            const scrolled = window.pageYOffset;
            const heroBackground = hero.querySelector('.absolute.inset-0');
            if (heroBackground) {
                // Check for a second background image (parallax)
                if(heroBackground.style.backgroundImage.includes('url(')) {
                    heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
                }
            }
        }
    });

    // --- *** NEW / FIXED: Team Carousel Logic *** ---
    function initTeamCarousel() {
        const track = document.getElementById('team-carousel-track');
        if (!track) return; // Exit if carousel isn't on the page

        const prevBtn = document.getElementById('team-prev-btn');
        const nextBtn = document.getElementById('team-next-btn');
        const slides = Array.from(track.children);
        const totalSlides = slides.length;
        
        let currentIndex = 0;
        let autoSwapTimer = setInterval(slideNext, 5000); // Auto-swap every 5 seconds

        // *** This function determines how many items to show ***
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
            track.style.transform = `translateX(-${currentIndex * itemWidthPercentage}%)`;

            // This sets the width of each *individual slide*
            slides.forEach(slide => {
                slide.style.width = `${itemWidthPercentage}%`;
                // Re-apply padding that was in the HTML
                slide.style.paddingLeft = '1rem'; // px-4
                slide.style.paddingRight = '1rem'; // px-4
            });

            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === maxIndex;
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
            autoSwapTimer = setInterval(slideNext, 5000);
        }

        // Event Listeners
        nextBtn.addEventListener('click', () => {
            slideNext();
            resetAutoSwap();
        });

        prevBtn.addEventListener('click', () => {
            slidePrev();
            resetAutoSwap();
        });

        // Pause on hover
        track.parentElement.addEventListener('mouseenter', () => {
            clearInterval(autoSwapTimer);
        });

        // Resume on mouse leave
        track.parentElement.addEventListener('mouseleave', () => {
            resetAutoSwap();
        });
        
        // Update on window resize
        window.addEventListener('resize', updateCarousel);

        // Initial setup
        updateCarousel();
    }

    initTeamCarousel(); // Run the carousel function
    
    // --- Console Greeting ---
    console.log('%c THHANKNAY & ASSOCIATES ', 'background: #1e303e; color: white; font-size: 20px; padding: 10px;');
    console.log('%c Legal Excellence Since 2010 ', 'background: #2a4456; color: white; font-size: 14px; padding: 5px;');
});
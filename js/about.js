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
                if (!link.classList.contains('border-gold')) { 
                    link.classList.add('text-gray-700');
                } else {
                    link.classList.add('text-primary'); 
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

    // --- Newsletter Form Validation (Now Footer Business Hours) ---
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
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
    

    // --- Console Greeting ---
    console.log('%c THHANKNAY & ASSOCIATES ', 'background: #1e303e; color: white; font-size: 20px; padding: 10px;');
    console.log('%c Legal Excellence Since 2010 ', 'background: #2a4456; color: white; font-size: 14px; padding: 5px;');
});
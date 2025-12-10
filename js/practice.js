document.addEventListener('DOMContentLoaded', function() {
    
    // --- Smooth Scroll for Quick Nav ---
    document.querySelectorAll('a.quick-nav-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                // 64px (header) + 52px (quick nav) + 48px (pt-12)
                const headerOffset = 64 + 52 + 48; 
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Active Link Highlighting for Quick Nav ---
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.practice-area-showcase > div[id]');
        const quickNavLinks = document.querySelectorAll('a.quick-nav-link');
        
        // Offset for header + quicknav + padding
        const scrollPosition = window.pageYOffset + (64 + 52 + 50); 

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                quickNavLinks.forEach(link => {
                    link.classList.remove('text-primary', 'border-gold');
                    link.classList.add('text-gray-600', 'border-transparent');
                });

                const activeLink = document.querySelector(`a.quick-nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.remove('text-gray-600', 'border-transparent');
                    activeLink.classList.add('text-primary', 'border-gold');
                }
            }
        });
    });

    // --- Console Greeting ---
    console.log('%c Practice Areas Script Loaded ', 'background: #D1B464; color: #1e303e; font-size: 14px; padding: 5px;');

});
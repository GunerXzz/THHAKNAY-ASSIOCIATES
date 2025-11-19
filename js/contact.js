document.addEventListener('DOMContentLoaded', function() {
    
    // --- Smooth Scroll for Map Button ---
    const mapScrollBtn = document.getElementById('map-scroll-btn');
    if (mapScrollBtn) {
        mapScrollBtn.addEventListener('click', function (e) {
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
    }

    // --- Console Greeting ---
    console.log('%c Contact Us Script Loaded ', 'background: #D1B464; color: #1e303e; font-size: 14px; padding: 5px;');

});
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Scroll Animation for Sections (Homepage Only) ---
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
        // Don't fade in the hero slider section
        if (section.id !== 'hero-slider') {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        }
    });

    // --- Console Greeting ---
    console.log('%c Homepage Script Loaded ', 'background: #D1B464; color: #1e303e; font-size: 14px; padding: 5px;');

});
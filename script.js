// GrainMeditate – gentle interactions for the design document

document.addEventListener('DOMContentLoaded', () => {

    // ---- 1. Fade in UI analysis cards when they scroll into view ----
    const cards = document.querySelectorAll('.ui-analysis');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing once visible
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    cards.forEach(card => observer.observe(card));

    // ---- 2. Smooth scroll for anchor links (e.g. footer links) ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

});‘
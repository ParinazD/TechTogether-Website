document.addEventListener('DOMContentLoaded', () => {

    // 1. Dynamic Cursor Glow Tracking Component
    const cursorGlow = document.getElementById('cursorGlow');
    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    // 2. Interactive Card Mouse Proximity Shine Effect
    const cards = document.querySelectorAll('.glass-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 3. Mobile Navigation Menu Toggle Engine
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if(navLinks.classList.contains('active')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    // Smooth navigation auto-collapsing for SPA layout
    document.querySelectorAll('.nav-item, .nav-btn, .nav-logo').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            if(icon) icon.className = 'fas fa-bars';
        });
    });

    // 4. Floating Decorative AI Icon Generator Layer
    const particlesContainer = document.getElementById('particles');
    const iconsArray = ['fa-brain', 'fa-code', 'fa-network-wired', 'fa-microchip', 'fa-database', 'fa-terminal'];
    
    for (let i = 0; i < 15; i++) {
        const iconEl = document.createElement('i');
        const randomIcon = iconsArray[Math.floor(Math.random() * iconsArray.length)];
        
        iconEl.className = `fas ${randomIcon} floating-ai-icon`;
        iconEl.style.left = `${Math.random() * 100}%`;
        iconEl.style.top = `${Math.random() * 100}%`;
        iconEl.style.setProperty('--duration', `${4 + Math.random() * 4}s`);
        iconEl.style.fontSize = `${1 + Math.random() * 1.5}rem`;
        
        particlesContainer.appendChild(iconEl);
    }

    // 5. Scroll Reveal Intersection Observer Framework
    const revealSections = document.querySelectorAll('.scroll-reveal');
    const statsNumbers = document.querySelectorAll('.stat-number');

    const animateStats = (stat) => {
        const target = parseInt(stat.getAttribute('data-target'));
        const speed = 40; // lower is faster
        const increment = Math.ceil(target / speed);
        
        let count = 0;
        const updateCount = () => {
            count += increment;
            if (count >= target) {
                stat.innerText = `${target}+`;
            } else {
                stat.innerText = `${count}+`;
                setTimeout(updateCount, 25);
            }
        };
        updateCount();
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If past events stats reveal container is found, fire data incrementor loops
                if (entry.target.id === 'past-events') {
                    statsNumbers.forEach(stat => {
                        if(stat.innerText === "0") animateStats(stat);
                    });
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 6. Interactive Modals Lightbox Gallery Controller
    const lightbox = document.getElementById('lightbox');
    const lightboxClose = document.querySelector('.lightbox-close');

    function bindGalleryItems(context) {
        context.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const src = item.getAttribute('data-src');
                if (lightbox && src) {
                    const existing = lightbox.querySelector('img.lightbox-img');
                    if (existing) existing.remove();
                    const img = document.createElement('img');
                    img.src = src;
                    img.alt = item.querySelector('img')?.alt || '';
                    img.className = 'lightbox-img';
                    img.style.cssText = 'max-width:90vw; max-height:85vh; border-radius:12px; display:block;';
                    const placeholder = lightbox.querySelector('.lightbox-placeholder-view');
                    if (placeholder) placeholder.appendChild(img);
                    lightbox.style.display = 'flex';
                }
            });
        });
    }

    if (lightboxClose) {
        lightboxClose.addEventListener('click', () => { lightbox.style.display = 'none'; });
    }
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.style.display = 'none';
        });
    }

    // Bind gallery items on initial page load
    bindGalleryItems(document);

    // 7. Event Detail Modal (popup on timeline card click)
    const eventModalOverlay = document.getElementById('event-modal-overlay');
    const eventModalClose = document.getElementById('eventModalClose');
    const eventModalBody = document.getElementById('eventModalBody');

    function openEventModal(templateId) {
        const tmpl = document.getElementById(templateId);
        if (!tmpl || !eventModalBody) return;
        eventModalBody.innerHTML = '';
        eventModalBody.appendChild(tmpl.content.cloneNode(true));
        eventModalOverlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        // Bind gallery items inside the newly inserted modal content
        bindGalleryItems(eventModalBody);
        // Focus management for accessibility
        eventModalClose.focus();
    }

    function closeEventModal() {
        eventModalOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.timeline-card-compact').forEach(card => {
        const modalId = card.getAttribute('data-modal');
        card.addEventListener('click', () => openEventModal(modalId));
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openEventModal(modalId);
            }
        });
    });

    // "Learn More" buttons on event cards
    document.querySelectorAll('.card-btn-learn').forEach(btn => {
        const modalId = btn.getAttribute('data-modal');
        btn.addEventListener('click', () => openEventModal(modalId));
    });

    if (eventModalClose) eventModalClose.addEventListener('click', closeEventModal);
    if (eventModalOverlay) {
        eventModalOverlay.addEventListener('click', (e) => {
            if (e.target === eventModalOverlay) closeEventModal();
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && eventModalOverlay.classList.contains('open')) {
            closeEventModal();
        }
    });
});
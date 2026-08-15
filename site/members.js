/* ── Members Page JS ── */

document.addEventListener('DOMContentLoaded', () => {

    // ── Mobile nav toggle (mirrors script.js for members page) ──
    const menuToggle = document.getElementById('menuToggle');
    const navLinks   = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });

        document.querySelectorAll('.nav-item, .nav-btn, .nav-logo').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });
    }

    // ── Member bio modal ──
    const overlay         = document.getElementById('member-modal-overlay');
    const modalClose      = document.getElementById('memberModalClose');
    const modalBody       = document.getElementById('memberModalBody');

    /**
     * Build and open the member bio popup.
     * Reads data-* attributes from the clicked button.
     */
    function openMemberModal(btn) {
        const name   = btn.getAttribute('data-name')  || 'Team Member';
        const role   = btn.getAttribute('data-role')  || '';
        const bio    = btn.getAttribute('data-bio')   || '';
        const badge  = btn.getAttribute('data-badge') || 'pink'; // 'pink' | 'lavender'

        // Determine avatar content — real image or icon placeholder
        const imgSrc = btn.getAttribute('data-img') || '';
        const isAdvisor = btn.classList.contains('advisor-photo-btn');

        const avatarClass  = badge === 'lavender' ? 'modal-avatar-lavender' : 'modal-avatar-pink';
        const roleClass    = badge === 'lavender' ? 'badge-purple'           : 'badge-pink';
        const iconClass    = isAdvisor ? 'fa-user-tie' : 'fa-user';

        const avatarHTML = imgSrc
            ? `<img src="${imgSrc}" alt="${name}">`
            : `<i class="fas ${iconClass}"></i>`;

        modalBody.innerHTML = `
            <div class="modal-member-avatar ${avatarClass}">${avatarHTML}</div>
            <h2 class="member-name" id="member-modal-name">${name}</h2>
            <span class="modal-member-role ${roleClass}">${role}</span>
            <p class="modal-member-bio">${bio}</p>
        `;

        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
        modalClose.focus();
    }

    function closeMemberModal() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    // Attach click handlers to all photo buttons
    document.querySelectorAll('.member-photo-btn').forEach(btn => {
        btn.addEventListener('click', () => openMemberModal(btn));
        btn.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openMemberModal(btn);
            }
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeMemberModal);

    if (overlay) {
        overlay.addEventListener('click', e => {
            if (e.target === overlay) closeMemberModal();
        });
    }

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay && overlay.classList.contains('open')) {
            closeMemberModal();
        }
    });

    // ── Scroll reveal (reuse same observer pattern as main site) ──
    const revealEls = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));

    // ── Card mouse-glow effect (same as main site) ──
    document.querySelectorAll('.glass-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
        });
    });

    // ── Cursor glow tracking ──
    const cursorGlow = document.getElementById('cursorGlow');
    if (cursorGlow) {
        document.addEventListener('mousemove', e => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top  = `${e.clientY}px`;
        });
    }
});

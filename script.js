// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initLucideIcons();
    initFadeInAnimations();
    initNavigationObserver();
    initSmoothScrolling();
    initParallaxEffects();
});

// ============================================
// LUCIDE ICONS INITIALIZATION
// ============================================
function initLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// ============================================
// FADE-IN ANIMATIONS
// ============================================
function initFadeInAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(el => fadeObserver.observe(el));
}

// ============================================
// NAVIGATION DOT ACTIVATION
// ============================================
function initNavigationObserver() {
    const sections = document.querySelectorAll('.slide');
    const navLinks = document.querySelectorAll('#slide-nav a');
    
    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                const id = entry.target.getAttribute('id');
                
                // Remove active class from all nav dots
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to corresponding nav dot
                const activeLink = document.querySelector(`#slide-nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.5
    });
    
    sections.forEach(section => navObserver.observe(section));
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('#slide-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// PARALLAX EFFECTS
// ============================================
function initParallaxEffects() {
    const container = document.getElementById('slide-container');
    
    container.addEventListener('scroll', () => {
        const scrolled = container.scrollTop;
        
        // Parallax for hero particles
        const heroParticles = document.querySelector('.hero-particles');
        if (heroParticles) {
            const slideOffset = heroParticles.closest('.slide').offsetTop;
            const relativeScroll = scrolled - slideOffset;
            heroParticles.style.transform = `translateY(${relativeScroll * 0.3}px)`;
        }
        
        // Parallax for images
        const images = document.querySelectorAll('.image-wrapper img');
        images.forEach(img => {
            const slide = img.closest('.slide');
            if (slide) {
                const slideOffset = slide.offsetTop;
                const slideHeight = slide.offsetHeight;
                const relativeScroll = scrolled - slideOffset;
                
                if (relativeScroll > -slideHeight && relativeScroll < slideHeight) {
                    img.style.transform = `translateY(${relativeScroll * 0.15}px) scale(1.1)`;
                }
            }
        });
    });
}

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    const container = document.getElementById('slide-container');
    const slides = document.querySelectorAll('.slide');
    const currentSlide = getCurrentSlide(slides, container);
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        navigateToSlide(currentSlide + 1, slides);
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        navigateToSlide(currentSlide - 1, slides);
    } else if (e.key === 'Home') {
        e.preventDefault();
        navigateToSlide(0, slides);
    } else if (e.key === 'End') {
        e.preventDefault();
        navigateToSlide(slides.length - 1, slides);
    }
});

function getCurrentSlide(slides, container) {
    const scrollTop = container.scrollTop;
    const windowHeight = window.innerHeight;
    
    for (let i = 0; i < slides.length; i++) {
        const slideTop = slides[i].offsetTop;
        const slideBottom = slideTop + slides[i].offsetHeight;
        
        if (scrollTop >= slideTop - windowHeight / 2 && scrollTop < slideBottom - windowHeight / 2) {
            return i;
        }
    }
    return 0;
}

function navigateToSlide(index, slides) {
    if (index >= 0 && index < slides.length) {
        slides[index].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// TOUCH GESTURES FOR MOBILE
// ============================================
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50;
    const container = document.getElementById('slide-container');
    const slides = document.querySelectorAll('.slide');
    const currentSlide = getCurrentSlide(slides, container);
    
    if (touchStartY - touchEndY > swipeThreshold) {
        // Swipe up - go to next slide
        navigateToSlide(currentSlide + 1, slides);
    } else if (touchEndY - touchStartY > swipeThreshold) {
        // Swipe down - go to previous slide
        navigateToSlide(currentSlide - 1, slides);
    }
}

// ============================================
// CARD HOVER EFFECTS
// ============================================
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        card.style.transform = `translateX(8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// ============================================
// RESIZE HANDLER
// ============================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Re-initialize icons after resize
        initLucideIcons();
    }, 250);
});

// ============================================
// VISIBILITY CHANGE HANDLER
// ============================================
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        // Re-initialize icons when tab becomes visible
        initLucideIcons();
    }
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to parallax
const debouncedParallax = debounce(initParallaxEffects, 10);

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c Smart HRIS Presentation ', 'background: #FF4500; color: white; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Developed for Bachelor of IT Project ', 'background: #1a1a1a; color: #FF4500; font-size: 14px; padding: 5px;');
/**
 * Business Coach Website - Interactive Functionality
 * Implementazione basata su best practice 2025 dalla research Perplexity
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inizializzazione tutte le funzionalità
    initNavigation();
    initTestimonialsCarousel();
    initContactForm();
    initScrollEffects();
    initModal();
    initFormValidation();
    initAnalytics();
});

/**
 * Navigation System - Mobile First con Smooth Scrolling
 */
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile Menu Toggle
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animazione hamburger menu
            const bars = navToggle.querySelectorAll('.bar');
            if (navToggle.classList.contains('active')) {
                bars[0].style.transform = 'rotate(-45deg) translate(-5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(45deg) translate(-5px, -6px)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }
    
    // Smooth Scrolling per navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Chiudi mobile menu se aperto
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        navToggle.classList.remove('active');
                        
                        // Reset hamburger animation
                        const bars = navToggle.querySelectorAll('.bar');
                        bars[0].style.transform = 'none';
                        bars[1].style.opacity = '1';
                        bars[2].style.transform = 'none';
                    }
                }
            }
        });
    });
    
    // Active navigation link basato su scroll position
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = document.querySelector('.header').offsetHeight;
            
            if (pageYOffset >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Testimonials Carousel con Auto-rotation e Touch Support
 */
function initTestimonialsCarousel() {
    const testimonials = document.querySelectorAll('.testimonial');
    const navBtns = document.querySelectorAll('.testimonial-nav-btn');
    let currentIndex = 0;
    let autoplayInterval;
    
    function showTestimonial(index) {
        // Nascondi tutti i testimonial
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        
        // Rimuovi active da tutti i bottoni
        navBtns.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Mostra testimonial corrente
        testimonials[index].classList.add('active');
        navBtns[index].classList.add('active');
        
        currentIndex = index;
    }
    
    function nextTestimonial() {
        const nextIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }
    
    function prevTestimonial() {
        const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
        showTestimonial(prevIndex);
    }
    
    function startAutoplay() {
        autoplayInterval = setInterval(nextTestimonial, 5000);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // Event listeners per navigation buttons
    navBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            showTestimonial(index);
            stopAutoplay();
            startAutoplay();
        });
    });
    
    // Touch support per mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    const carousel = document.querySelector('.testimonials-carousel');
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) {
            nextTestimonial();
            stopAutoplay();
            startAutoplay();
        }
        
        if (touchEndX > touchStartX + 50) {
            prevTestimonial();
            stopAutoplay();
            startAutoplay();
        }
    }
    
    // Inizia autoplay
    startAutoplay();
    
    // Pausa autoplay quando l'utente interagisce
    carousel.addEventListener('mouseenter', stopAutoplay);
    carousel.addEventListener('mouseleave', startAutoplay);
}

/**
 * Contact Form con Netlify Integration e Validazione
 */
function initContactForm() {
    const form = document.getElementById('consultation-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validazione form
            if (validateForm(form)) {
                // Crea FormData per Netlify
                const formData = new FormData(form);
                
                // Invia form a Netlify
                fetch('/', {
                    method: 'POST',
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams(formData).toString()
                })
                .then(response => {
                    if (response.ok) {
                        showSuccessModal();
                        form.reset();
                        trackFormSubmission();
                    } else {
                        showError('Errore nell\'invio del form. Riprova più tardi.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    showError('Errore nell\'invio del form. Riprova più tardi.');
                });
            }
        });
    }
}

/**
 * Form Validation Real-time
 */
function initFormValidation() {
    const form = document.getElementById('consultation-form');
    
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Validazione in tempo reale
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        // Rimuovi errore quando l'utente开始 a digitare
        input.addEventListener('input', function() {
            this.classList.remove('error');
            const errorMessage = this.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        });
    });
}

function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    // Rimuovi errori precedenti
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validazione required
    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Questo campo è obbligatorio';
    }
    
    // Validazione email
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Inserisci un\'email valida';
        }
    }
    
    // Validazione telefono
    if (field.type === 'tel' && field.value) {
        const phoneRegex = /^[\d\s\+\-\(\)]+$/;
        if (!phoneRegex.test(field.value) || field.value.length < 8) {
            isValid = false;
            errorMessage = 'Inserisci un numero di telefono valido';
        }
    }
    
    // Mostra errore se non valido
    if (!isValid) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        field.parentNode.appendChild(errorElement);
    }
    
    return isValid;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    // Validazione privacy checkbox
    const privacyCheckbox = form.querySelector('#privacy');
    if (privacyCheckbox && !privacyCheckbox.checked) {
        isValid = false;
        showError('Devi accettare la privacy policy per continuare');
    }
    
    return isValid;
}

/**
 * Scroll Effects per Header e Animazioni
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Header background opacity
        if (scrollTop > 50) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Animazione elementi quando entrano in viewport
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Osserva elementi da animare
    const animateElements = document.querySelectorAll('.service-card, .testimonial, .stat');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Modal System per Success Messages
 */
function initModal() {
    const modal = document.getElementById('success-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    
    // Chiudi modal cliccando fuori
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Chiudi modal con ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
}

function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Track conversion
    trackConversion();
}

function closeModal() {
    const modal = document.getElementById('success-modal');
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

/**
 * Error Handling
 */
function showError(message) {
    // Crea elemento errore
    const errorElement = document.createElement('div');
    errorElement.className = 'error-toast';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #EF4444;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(errorElement);
    
    // Animazione slide-in
    setTimeout(() => {
        errorElement.style.transform = 'translateX(0)';
    }, 100);
    
    // Rimuovi dopo 5 secondi
    setTimeout(() => {
        errorElement.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(errorElement);
        }, 300);
    }, 5000);
}

/**
 * Analytics e Tracking
 */
function initAnalytics() {
    // Track page view
    trackPageView();
    
    // Track CTA clicks
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            trackCTAClick(this.textContent);
        });
    });
    
    // Track service clicks
    const serviceCTAs = document.querySelectorAll('.service-cta');
    serviceCTAs.forEach(cta => {
        cta.addEventListener('click', function() {
            const serviceTitle = this.closest('.service-card').querySelector('.service-title').textContent;
            trackServiceClick(serviceTitle);
        });
    });
}

function trackPageView() {
    // Google Analytics 4 page view
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: document.title,
            page_location: window.location.href
        });
    }
}

function trackCTAClick(ctaText) {
    // Track CTA button clicks
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            'cta_text': ctaText,
            'page_location': window.location.href
        });
    }
}

function trackServiceClick(serviceName) {
    // Track service interest
    if (typeof gtag !== 'undefined') {
        gtag('event', 'service_click', {
            'service_name': serviceName,
            'page_location': window.location.href
        });
    }
}

function trackFormSubmission() {
    // Track form submissions
    if (typeof gtag !== 'undefined') {
        gtag('event', 'form_submission', {
            'form_name': 'consultation',
            'page_location': window.location.href
        });
    }
}

function trackConversion() {
    // Track conversions
    if (typeof gtag !== 'undefined') {
        gtag('event', 'conversion', {
            'conversion_type': 'form_submission',
            'page_location': window.location.href
        });
    }
}

/**
 * Performance Optimization
 */
function optimizePerformance() {
    // Lazy loading per immagini
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Utility Functions
 */
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

// Performance Optimization - Lazy Loading Images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        images.forEach(img => {
            img.src = img.dataset.src;
            img.classList.add('loaded');
        });
    }
}

// Performance Optimization - Preload Critical Resources
function preloadCriticalResources() {
    // Preload fonts
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap'
    ];
    
    fontLinks.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = url;
        document.head.appendChild(link);
    });
}

// Performance Optimization - Throttle Scroll Events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance Optimization - Animate Stats on Scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    if ('IntersectionObserver' in window) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const stat = entry.target;
                    stat.classList.add('animate');
                    
                    // Animate counter
                    const target = parseInt(stat.textContent.replace(/\D/g, ''));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.textContent = Math.ceil(current) + stat.textContent.replace(/\d+/g, '');
                            requestAnimationFrame(updateCounter);
                        } else {
                            stat.textContent = target + stat.textContent.replace(/\d+/g, '');
                        }
                    };
                    
                    updateCounter();
                    statsObserver.unobserve(stat);
                }
            });
        }, {
            threshold: 0.5
        });
        
        stats.forEach(stat => {
            statsObserver.observe(stat);
        });
    }
}

// Performance Optimization - Service Worker Registration (for future PWA)
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}

// Initialize all performance optimizations
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    preloadCriticalResources();
    animateStats();
    // registerServiceWorker(); // Uncomment when implementing PWA
});

// Inizializza performance optimization
optimizePerformance();

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll-related functionality here
}, 100));

// Esponi funzioni globalmente per debug
window.coachWebsite = {
    showSuccessModal,
    showError,
    trackConversion,
    debounce,
    throttle
};
// Children's Hope Charity Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeCounters();
    initializeDonationForm();
    initializeNewsletterForm();
    initializeScrollEffects();
    initializeCarousel();
    initializeScrollToTop();
});

// Navigation functionality
function initializeNavigation() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.custom-navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Active navigation highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

// Counter animation
function initializeCounters() {
    const counters = document.querySelectorAll('.counter');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Donation form functionality
function initializeDonationForm() {
    const amountButtons = document.querySelectorAll('.amount-btn');
    const customAmountInput = document.getElementById('customAmount');
    const donationForm = document.getElementById('donationForm');

    // Amount button selection
    amountButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            amountButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Clear custom amount
            if (customAmountInput) {
                customAmountInput.value = '';
            }
            
            // Store selected amount
            const amount = this.getAttribute('data-amount');
            this.setAttribute('data-selected', amount);
        });
    });

    // Custom amount input
    if (customAmountInput) {
        customAmountInput.addEventListener('input', function() {
            if (this.value) {
                // Remove active class from preset buttons
                amountButtons.forEach(btn => btn.classList.remove('active'));
            }
        });
    }

    // Form submission
    if (donationForm) {
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateDonationForm(this)) {
                showFormErrors();
                return;
            }

            const submitButton = this.querySelector('button[type="submit"]');
            showLoadingState(submitButton);

            // Get selected amount
            let selectedAmount = '';
            const activeButton = document.querySelector('.amount-btn.active');
            if (activeButton) {
                selectedAmount = activeButton.getAttribute('data-amount');
            } else if (customAmountInput && customAmountInput.value) {
                selectedAmount = customAmountInput.value;
            }

            // Get donation type
            const donationType = this.querySelector('input[name="donationType"]:checked').value;

            // Simulate processing
            setTimeout(() => {
                if (selectedAmount) {
                    showSuccessMessage(`Thank you for your ${donationType} donation of $${selectedAmount}! In a real implementation, this would redirect to a secure payment processor.`);
                    this.reset();
                    amountButtons.forEach(btn => btn.classList.remove('active'));
                } else {
                    showErrorMessage('Please select or enter a donation amount.');
                }
                hideLoadingState(submitButton);
            }, 2000);
        });
    }
}

// Form validation
function validateDonationForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('is-invalid');
            isValid = false;
        } else {
            field.classList.remove('is-invalid');
            field.classList.add('is-valid');
        }
    });

    return isValid;
}

function showFormErrors() {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'alert alert-danger mt-3';
    errorMessage.textContent = 'Please fill in all required fields.';
    
    const form = document.getElementById('donationForm');
    const existingError = form.querySelector('.alert-danger');
    if (existingError) {
        existingError.remove();
    }
    
    form.appendChild(errorMessage);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

function showLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
    button.disabled = true;
    button.setAttribute('data-original-text', originalText);
}

function hideLoadingState(button) {
    const originalText = button.getAttribute('data-original-text');
    button.innerHTML = originalText;
    button.disabled = false;
    button.removeAttribute('data-original-text');
}

function showSuccessMessage(message) {
    const successAlert = document.createElement('div');
    successAlert.className = 'alert alert-success alert-dismissible fade show position-fixed';
    successAlert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; max-width: 400px;';
    successAlert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(successAlert);
    
    setTimeout(() => {
        successAlert.remove();
    }, 8000);
}

function showErrorMessage(message) {
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    errorAlert.style.cssText = 'top: 100px; right: 20px; z-index: 9999; max-width: 400px;';
    errorAlert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(errorAlert);
    
    setTimeout(() => {
        errorAlert.remove();
    }, 5000);
}

// Newsletter form
function initializeNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            
            if (emailInput.value && emailInput.checkValidity()) {
                const originalHTML = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-check"></i>';
                submitButton.disabled = true;
                
                setTimeout(() => {
                    showSuccessMessage('Thank you for subscribing to our newsletter!');
                    emailInput.value = '';
                    submitButton.innerHTML = originalHTML;
                    submitButton.disabled = false;
                }, 1000);
            } else {
                emailInput.classList.add('is-invalid');
                setTimeout(() => {
                    emailInput.classList.remove('is-invalid');
                }, 3000);
            }
        });
    });
}

// Scroll effects and animations
function initializeScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elementsToAnimate = document.querySelectorAll('.work-card, .team-card, .story-content');
    elementsToAnimate.forEach(el => {
        observer.observe(el);
    });
}

// Carousel functionality
function initializeCarousel() {
    const carousel = document.querySelector('#storiesCarousel');
    if (carousel) {
        // Auto-play carousel
        const bsCarousel = new bootstrap.Carousel(carousel, {
            interval: 8000,
            wrap: true,
            pause: 'hover'
        });

        // Pause on hover
        carousel.addEventListener('mouseenter', () => {
            bsCarousel.pause();
        });

        carousel.addEventListener('mouseleave', () => {
            bsCarousel.cycle();
        });
    }
}

// Scroll to top functionality
function initializeScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollToTopBtn);

    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Utility functions
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

// Image lazy loading
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Performance optimization
window.addEventListener('load', () => {
    // Initialize lazy loading after page load
    initializeLazyLoading();
    
    // Preload critical images
    const criticalImages = [
        '/placeholder.svg?height=500&width=600&text=Happy+Children+Learning',
        '/placeholder.svg?height=400&width=600&text=Children+in+Classroom',
        '/placeholder.svg?height=400&width=600&text=Medical+Care+for+Children'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
});

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Skip to main content with Tab key
    if (e.key === 'Tab' && !e.shiftKey && document.activeElement === document.body) {
        const mainContent = document.querySelector('main') || document.querySelector('#home');
        if (mainContent) {
            mainContent.focus();
            e.preventDefault();
        }
    }
});

// Touch device optimizations
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Improve touch interactions
    document.querySelectorAll('.btn, .card').forEach(element => {
        element.style.cursor = 'pointer';
    });
}

// Print optimization
window.addEventListener('beforeprint', () => {
    document.body.classList.add('printing');
});

window.addEventListener('afterprint', () => {
    document.body.classList.remove('printing');
});
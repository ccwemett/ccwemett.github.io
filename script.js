// Shrink navbar on scroll
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scroll navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Log form data (in a real app, this would send to a backend)
        console.log('Form submitted:', formData);

        // Create mailto link
        const mailtoLink = `mailto:ccwemett@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`From: ${formData.name} (${formData.email})\n\n${formData.message}`)}`;
        
        // Show success message
        alert('Thank you for your message! Opening email client...');
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Reset form
        this.reset();
    });
}

// Add scroll animation class to elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animation
document.querySelectorAll('.project-card, .skill-category, .experience-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Experience card flip functionality
document.querySelectorAll('.experience-card').forEach(card => {
    card.addEventListener('click', function() {
        this.classList.toggle('flipped');
    });
});

// Mobile menu toggle (for future hamburger menu if needed)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Highlight active nav link on scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Add active nav link styling
const style = document.createElement('style');
style.textContent = `
    .nav-links a.active {
        color: var(--primary-blue);
    }
    
    .nav-links a.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ========== PHOTOGRAPHY MODAL POPUP ==========
// Mock data for photo shoots and related images
const photoData = {
    'Portrait': {
        shoots: [
            { id: 1, title: 'Kiya', subtitle: 'Senior Portraits', images: ['images/photography/kiya-senior-portraits/1.jpg', 'images/photography/kiya-senior-portraits/2.jpg', 'images/photography/kiya-senior-portraits/3.jpg', 'images/photography/kiya-senior-portraits/4.jpg'] },
            { id: 2, title: 'Diana', subtitle: 'Senior portraits', images: ['images/photography/diana-senior-portraits/1.jpg', 'images/photography/diana-senior-portraits/2.jpg', 'images/photography/diana-senior-portraits/3.jpg', 'images/photography/diana-senior-portraits/4.jpg'] }
            // { id: 3, title: 'Candid Moment', subtitle: 'Lifestyle Portrait', images: ['images/photography/john-senior-portraits/1.jpg', 'images/photography/john-senior-portraits/2.jpg', 'images/photography/john-senior-portraits/3.jpg', 'images/photography/john-senior-portraits/4.jpg'] }
        ]
    },
    'Food': {
        shoots: [
            { id: 1, title: 'Plated Dish', subtitle: 'Fine Dining', images: ['images/photography/5.jpg', 'images/photography/6.jpg', 'images/photography/7.jpg', 'images/photography/8.jpg'] },
            { id: 2, title: 'BBQ Spread', subtitle: 'Overhead Shot', images: ['images/photography/6.jpg', 'images/photography/7.jpg', 'images/photography/8.jpg', 'images/photography/5.jpg'] },
            { id: 3, title: 'Detail Work', subtitle: 'Close-up Photography', images: ['images/photography/7.jpg', 'images/photography/8.jpg', 'images/photography/5.jpg', 'images/photography/6.jpg'] }
        ]
    },
    'Landscape': {
        shoots: [
            { id: 1, title: 'Joshua Tree', subtitle: 'Adventure Photography', images: ['images/photography/joshua-tree/1.jpg', 'images/photography/joshua-tree/2.jpg', 'images/photography/joshua-tree/3.jpg', 'images/photography/joshua-tree/4.jpg', 'images/photography/joshua-tree/5.jpg', 'images/photography/joshua-tree/6.jpg', 'images/photography/joshua-tree/7.jpg'] },
            { id: 2, title: 'Yosemite', subtitle: 'Nature Photogrphy', images: ['images/photography/yosemite/1.jpg', 'images/photography/yosemite/2.jpg', 'images/photography/yosemite/3.jpg'] }
            // { id: 3, title: 'Nature\'s Beauty', subtitle: 'Landscape Photography', images: ['images/photography/11.jpg', 'images/photography/12.jpg', 'images/photography/9.jpg', 'images/photography/10.jpg'] }
        ]
    },
    'Event': {
        shoots: [
            { id: 1, title: 'Class of 2024 Graduation', subtitle: 'Event Coverage', images: ['images/photography/wshs-2024-graduation/1.jpg', 'images/photography/wshs-2024-graduation/2.jpg', 'images/photography/wshs-2024-graduation/3.jpg', 'images/photography/wshs-2024-graduation/4.jpg', 'images/photography/wshs-2024-graduation/5.jpg', 'images/photography/wshs-2024-graduation/6.jpg'] }
            // { id: 2, title: 'Crowd Moments', subtitle: 'Documentary Style', images: ['images/photography/14.jpg', 'images/photography/15.jpg', 'images/photography/16.jpg', 'images/photography/13.jpg'] },
            // { id: 3, title: 'Behind the Scenes', subtitle: 'Candid Coverage', images: ['images/photography/15.jpg', 'images/photography/16.jpg', 'images/photography/13.jpg', 'images/photography/14.jpg'] }
        ]
    }
};

// Add click handlers to photo cards on photography page
document.addEventListener('DOMContentLoaded', () => {
    const photoCards = document.querySelectorAll('.photo-card');
    
    photoCards.forEach((card, index) => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function(e) {
            // Determine which section this card belongs to
            const section = this.closest('.gallery-section');
            let category = '';
            
            if (section && section.querySelector('.gallery-title h2')) {
                const titleText = section.querySelector('.gallery-title h2').textContent;
                if (titleText.includes('Portrait')) category = 'Portrait';
                else if (titleText.includes('Food')) category = 'Food';
                else if (titleText.includes('Landscape')) category = 'Landscape';
                else if (titleText.includes('Event')) category = 'Event';
            }
            
            // Get the photo card index within its section
            const sectionCards = section.querySelectorAll('.photo-card');
            let cardIndex = 0;
            sectionCards.forEach((c, i) => {
                if (c === card) cardIndex = i;
            });
            
            if (category && photoData[category]) {
                const shoot = photoData[category].shoots[cardIndex];
                if (shoot) {
                    openImageModal(shoot, category);
                }
            }
        });
    });
});

function openImageModal(shoot, category) {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const relatedImagesContainer = document.getElementById('relatedImages');
    
    // Set main image and info
    modalImage.src = shoot.images[0];
    modalImage.alt = shoot.title;
    modalTitle.textContent = shoot.title;
    modalCategory.textContent = shoot.subtitle;
    
    // Generate related images (show 4 more from the shoot)
    relatedImagesContainer.innerHTML = '';
    const relatedImages = shoot.images.slice(1, 5);
    relatedImages.forEach(imageSrc => {
        const imageDiv = document.createElement('div');
        imageDiv.className = 'related-image';
        imageDiv.innerHTML = `<img src="${imageSrc}" alt="Related photo">`;
        
        // Allow clicking related images to update main view
        imageDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            modalImage.src = imageSrc;
        });
        
        relatedImagesContainer.appendChild(imageDiv);
    });
    
    // Show modal with animation
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeImageModal() {
    const modal = document.getElementById('imageModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Close modal when clicking close button
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeImageModal);
    }
    
    // Close modal when clicking outside the modal content
    const modal = document.getElementById('imageModal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeImageModal();
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeImageModal();
        }
    });
});

console.log('Portfolio website loaded successfully!');

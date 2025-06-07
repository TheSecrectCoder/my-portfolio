// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const currentYearEl = document.getElementById('current-year');
const versionInfoEl = document.getElementById('version-info');
const lastUpdatedEl = document.getElementById('last-updated');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    currentYearEl.textContent = new Date().getFullYear();
    
    // Load theme preference
    loadTheme();
    
    // Load version info
    loadVersionInfo();
    
    // Load projects if on relevant pages
    if (document.getElementById('featured-projects-container')) {
        loadFeaturedProjects();
    }
    
    if (document.getElementById('projects-container')) {
        loadAllProjects();
    }
    
    // Initialize filter buttons if on projects page
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (filterBtns.length > 0) {
        initializeFilters();
    }
    
    // Initialize testimonial slider if on homepage
    if (document.querySelector('.testimonials-slider')) {
        initTestimonialSlider();
    }
});

// Theme Toggle Functionality
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Save theme preference
    const isDarkTheme = document.body.classList.contains('dark-theme');
    localStorage.setItem('darkTheme', isDarkTheme);
});

// Load theme from localStorage
function loadTheme() {
    const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (isDarkTheme) {
        document.body.classList.add('dark-theme');
    }
}

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile nav when clicking a link
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Load version information from version.json
async function loadVersionInfo() {
    try {
        const response = await fetch('data/version.json');
        const data = await response.json();
        
        versionInfoEl.textContent = `Version: ${data.version}`;
        lastUpdatedEl.textContent = `Last Updated: ${data.lastUpdated}`;
    } catch (error) {
        console.error('Error loading version info:', error);
        versionInfoEl.textContent = 'Version: Not available';
        lastUpdatedEl.textContent = 'Last Updated: Not available';
    }
}

// Load featured projects for homepage
async function loadFeaturedProjects() {
    const container = document.getElementById('featured-projects-container');
    
    try {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        
        // Get featured projects (max 3)
        const featuredProjects = projects.filter(project => project.featured).slice(0, 3);
        
        if (featuredProjects.length === 0) {
            container.innerHTML = '<p>No featured projects available.</p>';
            return;
        }
        
        container.innerHTML = '';
        featuredProjects.forEach(project => {
            container.appendChild(createProjectCard(project));
        });
    } catch (error) {
        console.error('Error loading featured projects:', error);
        container.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}

// Load all projects for projects page
async function loadAllProjects() {
    const container = document.getElementById('projects-container');
    
    try {
        const response = await fetch('data/projects.json');
        const projects = await response.json();
        
        if (projects.length === 0) {
            container.innerHTML = '<p>No projects available.</p>';
            return;
        }
        
        container.innerHTML = '';
        projects.forEach(project => {
            container.appendChild(createProjectCard(project));
        });
    } catch (error) {
        console.error('Error loading projects:', error);
        container.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.category = project.category;
    
    card.innerHTML = `
        <img src="${project.image}" alt="${project.title}" class="project-image">
        <div class="project-content">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="project-tags">
                ${project.technologies.map(tech => `<span class="project-tag">${tech}</span>`).join('')}
            </div>
            <div class="project-links">
                ${project.demoUrl && project.demoUrl !== "N/A" ? `<a href="${project.demoUrl}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                ${project.codeUrl ? (project.codeUrl.startsWith("http") ? 
                    `<a href="${project.codeUrl}" target="_blank"><i class="fab fa-github"></i> Source Code</a>` : 
                    `<a href="code-unavailable.html" class="code-unavailable"><i class="fas fa-lock"></i> Source Code Unavailable</a>`) : ''}
                ${project.infoUrl ? `<a href="${project.infoUrl}"><i class="fas fa-info-circle"></i> Project Details</a>` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Initialize project filters
function initializeFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.dataset.filter;
            
            // Show/hide projects based on filter
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Initialize testimonial slider
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const cards = document.querySelectorAll('.testimonial-card');
    
    if (cards.length <= 1) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    
    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    
    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2;
        slider.scrollLeft = scrollLeft - walk;
    });
    
    // Auto scroll
    let scrollInterval;
    
    function startAutoScroll() {
        scrollInterval = setInterval(() => {
            slider.scrollLeft += 1;
            
            // Reset scroll position when reaching the end
            if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth) {
                slider.scrollLeft = 0;
            }
        }, 30);
    }
    
    function stopAutoScroll() {
        clearInterval(scrollInterval);
    }
    
    // Start auto scroll
    startAutoScroll();
    
    // Stop auto scroll on hover
    slider.addEventListener('mouseenter', stopAutoScroll);
    slider.addEventListener('mouseleave', startAutoScroll);
}

// Handle contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // In a real implementation, you would send the form data to a server
        // For this demo, we'll just simulate a successful submission
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Show success message
            formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
            formStatus.className = 'success';
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
            
            // Hide success message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        }, 1500);
    });
}

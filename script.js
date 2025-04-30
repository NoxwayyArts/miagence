document.addEventListener('DOMContentLoaded', function() {
    // Variables
    let menuToggle = document.querySelector('.menu-toggle');
    let menuOverlay = document.querySelector('.menu-overlay');
    let menuLinks = document.querySelectorAll('.menu-link');
    let nav = document.querySelector('.main-nav');
    let cursor = document.querySelector('.cursor');
    let cursorFollower = document.querySelector('.cursor-follower');
    let scrollPos = 0;
    let testimonialContainer = document.querySelector('.testimonial-container');
    let testimonialItems = document.querySelectorAll('.testimonial-item');
    let prevBtn = document.querySelector('.control-prev');
    let nextBtn = document.querySelector('.control-next');
    let currentSlide = 0;
    let isAnimating = false;
    
    // Loader (simulation)
    /*
    const loader = document.createElement('div');
    loader.className = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <h1>MAISON<span>INFLUENCE</span></h1>
            <div class="loader-bar">
                <div class="loader-progress"></div>
            </div>
        </div>
    `;
    document.body.appendChild(loader);
    
    setTimeout(function() {
        const progress = document.querySelector('.loader-progress');
        progress.style.width = '100%';
        
        setTimeout(function() {
            loader.classList.add('hidden');
            setTimeout(function() {
                loader.remove();
            }, 500);
        }, 1500);
    }, 500);
    */
    
    // Curseur personnalisé
    document.addEventListener('mousemove', function(e) {
        cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        
        // Le suiveur du curseur suit avec un délai
        setTimeout(function() {
            cursorFollower.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }, 50);
    });
    
    // Effet hover sur les liens pour le curseur
    const links = document.querySelectorAll('a, button, .menu-toggle, .portfolio-item, .social-icon, .social-link');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(0.5)`;
            cursorFollower.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(1.5)`;
            cursorFollower.style.background = 'rgba(255, 216, 0, 0.2)';
            cursorFollower.style.border = 'none';
        });
        
        link.addEventListener('mouseleave', function() {
            cursor.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(1)`;
            cursorFollower.style.transform = `translate(${event.clientX}px, ${event.clientY}px) scale(1)`;
            cursorFollower.style.background = 'transparent';
            cursorFollower.style.border = '1px solid var(--yellow)';
        });
    });
    
    // Navigation sticky au scroll
    window.addEventListener('scroll', function() {
        let currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Révéler les éléments au scroll
        revealElements();
        
        scrollPos = currentScroll;
    });
    
    // Menu toggle
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        menuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Fermer le menu quand on clique sur un lien
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Animation des stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const targetValue = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // Durée en ms
            const stepTime = 50; // Intervalle entre chaque incrémentation
            const steps = duration / stepTime;
            const increment = targetValue / steps;
            let currentValue = 0;
            
            const updateCounter = () => {
                currentValue += increment;
                if (currentValue < targetValue) {
                    stat.textContent = Math.floor(currentValue);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = targetValue;
                }
            };
            
            updateCounter();
        });
    }
    
    // Révéler les éléments au scroll
    function revealElements() {
        const elements = document.querySelectorAll('.service-card, .gallery-image, .portfolio-item');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
                
                // Animer les stats lorsque la section about est visible
                if (element.classList.contains('gallery-image') && !element.classList.contains('animated')) {
                    animateStats();
                    element.classList.add('animated');
                }
            }
        });
    }
    
    // Slider témoignages
    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        if (index < 0) {
            index = testimonialItems.length - 1;
        } else if (index >= testimonialItems.length) {
            index = 0;
        }
        
        currentSlide = index;
        testimonialContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        setTimeout(() => {
            isAnimating = false;
        }, 500);
    }
    
    nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
    });
    
    prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
    });
    
    // Filtrer les projets du portfolio
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Filtrer les projets
            const filter = this.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                item.style.opacity = '0';
                setTimeout(() => {
                    if (filter === 'all' || item.getAttribute('data-category') === filter) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 300);
                    } else {
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 300);
                    }
                }, 300);
            });
        });
    });
    
    // Formulaire de contact
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Animation de soumission
            const submitButton = this.querySelector('button[type="submit"]');
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            
            // Simuler l'envoi (à remplacer par l'envoi réel)
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check"></i> Envoyé!';
                
                // Réinitialiser le formulaire
                this.reset();
                
                // Remettre le texte d'origine après un moment
                setTimeout(() => {
                    submitButton.innerHTML = 'Envoyer';
                }, 3000);
            }, 2000);
        });
    }
    
    // Formulaire de newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = this.querySelector('input[type="email"]');
            const button = this.querySelector('button');
            
            if (input.value.trim() !== '') {
                button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                // Simuler l'inscription (à remplacer par l'envoi réel)
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-check"></i>';
                    input.value = '';
                    
                    // Afficher un message de confirmation
                    const confirmMessage = document.createElement('div');
                    confirmMessage.className = 'newsletter-confirm';
                    confirmMessage.textContent = 'Merci pour votre inscription!';
                    this.appendChild(confirmMessage);
                    
                    // Faire disparaître le message après un moment
                    setTimeout(() => {
                        confirmMessage.remove();
                        button.innerHTML = '<i class="fas fa-paper-plane"></i>';
                    }, 3000);
                }, 1500);
            }
        });
    }
    
    // Animation des sections au scroll
    const sections = document.querySelectorAll('section');
    
    function animateSections() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                section.classList.add('animate');
                
                // Animer le titre de la section
                const header = section.querySelector('.section-header');
                if (header) {
                    header.classList.add('animate');
                }
            }
        });
    }
    
    // Animation du texte de la section héro
    function animateHeroText() {
        const heroText = document.querySelectorAll('.hero .reveal-text');
        heroText.forEach((text, index) => {
            setTimeout(() => {
                text.classList.add('visible');
            }, 300 * index);
        });
    }
    
    // Effet de parallaxe sur la section héro
    function parallaxEffect() {
        const heroImage = document.querySelector('.hero-image');
        const heroVideo = document.querySelector('.hero-video');
        
        if (heroImage && heroVideo) {
            window.addEventListener('scroll', () => {
                const scrollValue = window.scrollY;
                heroImage.style.transform = `translateY(${scrollValue * 0.2}px)`;
                heroVideo.style.transform = `translateY(${scrollValue * 0.1}px)`;
            });
        }
    }
    
    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Vidéo popup
    const playButton = document.querySelector('.play-button');
    
    if (playButton) {
        playButton.addEventListener('click', function() {
            // Créer l'overlay de la vidéo
            const videoOverlay = document.createElement('div');
            videoOverlay.className = 'video-overlay';
            
            // Contenu de l'overlay
            videoOverlay.innerHTML = `
                <div class="video-popup">
                    <div class="close-video">
                        <i class="fas fa-times"></i>
                    </div>
                    <div class="video-content">
                        <!-- Remplacer par votre iframe de vidéo -->
                        <div class="video-placeholder">
                            <p>Vidéo de présentation</p>
                        </div>
                    </div>
                </div>
            `;
            
            // Ajouter au body
            document.body.appendChild(videoOverlay);
            
            // Empêcher le scroll du body
            document.body.style.overflow = 'hidden';
            
            // Animation d'entrée
            setTimeout(() => {
                videoOverlay.classList.add('active');
            }, 10);
            
            // Fermer la vidéo
            const closeBtn = videoOverlay.querySelector('.close-video');
            closeBtn.addEventListener('click', function() {
                videoOverlay.classList.remove('active');
                
                setTimeout(() => {
                    videoOverlay.remove();
                    document.body.style.overflow = '';
                }, 500);
            });
        });
    }
    
    // Navigation active selon la section visible
    function setActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.menu-link');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Appeler les fonctions au chargement
    animateHeroText();
    parallaxEffect();
    revealElements();
    animateSections();
    
    // Appeler les fonctions au scroll
    window.addEventListener('scroll', function() {
        animateSections();
        setActiveNav();
    });
});
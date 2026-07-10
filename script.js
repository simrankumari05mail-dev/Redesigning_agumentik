/* ═══════════════════════════════════════════════════════════════
   AGUMENTIK EDUCAMP — 3D ANIMATED DARK GEN Z REDESIGN
   Three.js particles + Mouse-tracking 3D tilt + Advanced interactions
   ═══════════════════════════════════════════════════════════════ */

// ─── LOADING SCREEN ───
const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loaderFill');
let loadProgress = 0;

function updateLoader() {
    loadProgress += Math.random() * 15 + 5;
    if (loadProgress > 100) loadProgress = 100;
    loaderFill.style.width = loadProgress + '%';
    
    if (loadProgress < 100) {
        setTimeout(updateLoader, 200);
    } else {
        setTimeout(() => {
            loader.classList.add('hidden');
            document.body.style.overflow = '';
            animateHeroEntrance();
        }, 500);
    }
}

document.body.style.overflow = 'hidden';
setTimeout(updateLoader, 300);

// ─── THREE.JS PARTICLE BACKGROUND ───
let scene, camera, renderer, particles, mouseX = 0, mouseY = 0;

function initThreeJS() {
    const canvas = document.getElementById('bgCanvas');
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle system
    const particleCount = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    const colorPalette = [
        { r: 168/255, g: 85/255, b: 247/255 },   // Purple
        { r: 99/255, g: 102/255, b: 241/255 },    // Indigo
        { r: 6/255, g: 182/255, b: 212/255 },     // Cyan
        { r: 236/255, g: 72/255, b: 153/255 },    // Pink
        { r: 16/255, g: 185/255, b: 129/255 },    // Green
    ];

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 3 + 0.5;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.PointsMaterial({
        size: 0.03,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Add floating torus knot wireframe
    const torusGeom = new THREE.TorusKnotGeometry(1.5, 0.4, 80, 12);
    const torusMat = new THREE.MeshBasicMaterial({ 
        color: 0xa855f7, 
        wireframe: true, 
        transparent: true, 
        opacity: 0.04 
    });
    const torus = new THREE.Mesh(torusGeom, torusMat);
    torus.position.set(3, 0, -3);
    scene.add(torus);

    // Animate
    function animate() {
        requestAnimationFrame(animate);

        particles.rotation.x += 0.0003;
        particles.rotation.y += 0.0005;

        // Mouse influence
        particles.rotation.x += (mouseY * 0.00005 - particles.rotation.x * 0.01);
        particles.rotation.y += (mouseX * 0.00005 - particles.rotation.y * 0.01);

        torus.rotation.x += 0.003;
        torus.rotation.y += 0.005;

        renderer.render(scene, camera);
    }

    animate();
}

// Initialize Three.js
try {
    initThreeJS();
} catch (e) {
    console.log('Three.js initialization skipped:', e);
}

// Resize handler
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// ─── CUSTOM CURSOR ───
const cursorGlow = document.getElementById('cursorGlow');
const cursorRing = document.getElementById('cursorRing');

if (window.matchMedia('(hover: hover)').matches) {
    let cursorX = 0, cursorY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX - window.innerWidth / 2;
        mouseY = e.clientY - window.innerHeight / 2;

        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';

        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    // Smooth cursor ring follow
    function animateCursor() {
        ringX += (cursorX - ringX) * 0.15;
        ringY += (cursorY - ringY) * 0.15;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effects on interactive elements
    document.querySelectorAll('a, button, .tilt-card, .filter-btn, .faq-question').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorRing.style.width = '50px';
            cursorRing.style.height = '50px';
            cursorRing.style.borderColor = 'rgba(168, 85, 247, 0.6)';
        });
        el.addEventListener('mouseleave', () => {
            cursorRing.style.width = '30px';
            cursorRing.style.height = '30px';
            cursorRing.style.borderColor = 'rgba(168, 85, 247, 0.4)';
        });
    });
}

// ─── NAVBAR SCROLL ───
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ─── HAMBURGER MENU ───
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
    });
});

// ─── TYPEWRITER EFFECT ───
const typewriterElement = document.getElementById('typewriter');
const phrases = [
    'with Real Projects 💻',
    'at Top Companies 🏢',
    'with Expert Mentors 🎓',
    'in 4-6 Months ⚡',
    'with 87% Placement 🚀'
];
let phraseIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 80;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeSpeed = 40;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeSpeed = 80;
    }
    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400;
    }
    setTimeout(typeWriter, typeSpeed);
}
typeWriter();

// ─── HERO ENTRANCE ANIMATION ───
function animateHeroEntrance() {
    document.querySelectorAll('.hero [data-animate]').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), i * 150 + 200);
    });
}

// ─── SCROLL ANIMATIONS ───
const animateElements = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('visible'), parseInt(delay));
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

animateElements.forEach(el => observer.observe(el));

// ─── 3D TILT CARDS (Mouse-tracking) ───
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        
        card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)';
    });
});

// ─── HERO 3D SCENE PARALLAX ───
const hero3dScene = document.getElementById('hero3dScene');
if (hero3dScene && window.matchMedia('(hover: hover)').matches) {
    document.querySelector('.hero-visual').addEventListener('mousemove', (e) => {
        const rect = hero3dScene.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        hero3dScene.style.transform = `rotateY(${x * 15}deg) rotateX(${-y * 15}deg)`;

        // Parallax on floating cards
        hero3dScene.querySelectorAll('[data-depth]').forEach(el => {
            const depth = parseFloat(el.dataset.depth);
            el.style.transform = `translate(${x * depth * 60}px, ${y * depth * 60}px)`;
        });
    });

    document.querySelector('.hero-visual').addEventListener('mouseleave', () => {
        hero3dScene.style.transform = '';
        hero3dScene.querySelectorAll('[data-depth]').forEach(el => {
            el.style.transform = '';
        });
    });
}

// ─── STATS COUNTER ───
const statCards = document.querySelectorAll('.stat-card');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const numberEl = entry.target.querySelector('.stat-number');
            const target = parseInt(numberEl.dataset.count);
            const duration = 2000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easeOut = 1 - Math.pow(1 - progress, 3);
                numberEl.textContent = Math.floor(target * easeOut).toLocaleString();
                if (progress < 1) requestAnimationFrame(updateCounter);
                else numberEl.textContent = target.toLocaleString();
            }

            requestAnimationFrame(updateCounter);

            // Animate bar
            const barFill = entry.target.querySelector('.stat-bar-fill');
            if (barFill) {
                const tw = barFill.style.width;
                barFill.style.width = '0%';
                setTimeout(() => { barFill.style.width = tw; }, 200);
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

statCards.forEach(card => statsObserver.observe(card));

// ─── FEATURE CARDS ───
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        featureCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

// ─── CATEGORY FILTER ───
const filterBtns = document.querySelectorAll('.filter-btn');
const catCards = document.querySelectorAll('.cat-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        catCards.forEach(card => {
            if (filter === 'all' || card.dataset.category === filter) {
                card.classList.remove('hidden');
                card.style.animation = 'cardFadeIn 0.5s ease forwards';
            } else {
                card.classList.add('hidden');
            }
        });
    });
});

// ─── TESTIMONIALS SLIDER ───
const testimonialCards = document.querySelectorAll('.testimonial-card');
const sliderDots = document.getElementById('sliderDots');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
let currentSlide = 0;
const cardsPerView = window.innerWidth > 1024 ? 3 : window.innerWidth > 768 ? 2 : 1;
const totalSlides = Math.ceil(testimonialCards.length / cardsPerView);

for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    sliderDots.appendChild(dot);
}

function goToSlide(index) {
    currentSlide = index;
    sliderDots.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === index));
    testimonialCards.forEach((card, i) => {
        const start = index * cardsPerView;
        const end = start + cardsPerView;
        card.style.display = (i >= start && i < end) ? 'flex' : 'none';
        if (i >= start && i < end) card.style.animation = 'cardFadeIn 0.5s ease forwards';
    });
}

prevBtn.addEventListener('click', () => goToSlide((currentSlide - 1 + totalSlides) % totalSlides));
nextBtn.addEventListener('click', () => goToSlide((currentSlide + 1) % totalSlides));
setInterval(() => goToSlide((currentSlide + 1) % totalSlides), 6000);
goToSlide(0);

// ─── FAQ ACCORDION ───
function toggleFaq(btn) {
    const item = btn.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('active'));
    if (!isActive) item.classList.add('active');
}

// ─── MODAL ───
const enrollModal = document.getElementById('enrollModal');
function openModal() {
    enrollModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    enrollModal.classList.remove('active');
    document.body.style.overflow = '';
}
enrollModal.addEventListener('click', (e) => { if (e.target === enrollModal) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ─── FAB ───
const fabMain = document.getElementById('fabMain');
const fabContainer = document.getElementById('fabContainer');
fabMain.addEventListener('click', () => {
    fabMain.classList.toggle('open');
    fabContainer.classList.toggle('open');
    const icon = fabMain.querySelector('i');
    icon.classList.toggle('fa-comments');
    icon.classList.toggle('fa-times');
});

// ─── SCROLL TOP ───
const scrollTopBtn = document.getElementById('scrollTop');
window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
});
scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ─── PROGRAM SELECT ───
const programSelect = document.getElementById('programSelect');
const courseSelect = document.getElementById('courseSelect');
if (programSelect && courseSelect) {
    const courseOptions = {
        courses: ['Backend Development', 'Master Digital Marketing', 'Full Stack with MERN Stack', 'Full Stack Java Spring Boot', 'Mastering Human Resource', 'Mastering Sales Training', 'Mastering Frontend Development'],
        special: ['BBA', 'BCA', 'B.Com', 'MBA', 'MCA']
    };
    programSelect.addEventListener('change', () => {
        const selected = programSelect.value;
        courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
        if (courseOptions[selected]) {
            courseOptions[selected].forEach(course => {
                const opt = document.createElement('option');
                opt.value = course.toLowerCase().replace(/\s+/g, '-');
                opt.textContent = course;
                courseSelect.appendChild(opt);
            });
        }
    });
}

// ─── CSS KEYFRAME INJECTION ───
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes cardFadeIn {
        from { opacity: 0; transform: translateY(15px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }
`;
document.head.appendChild(dynamicStyles);

// ─── PARALLAX SECTIONS ───
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    document.querySelectorAll('[data-parallax]').forEach(el => {
        const speed = parseFloat(el.dataset.parallax);
        el.style.transform = `translateY(${scrollY * speed}px)`;
    });
});

// ─── AUTO-SHOW MODAL ───
let modalAutoShown = false;
window.addEventListener('scroll', () => {
    if (!modalAutoShown) {
        const coursesSection = document.getElementById('courses');
        if (coursesSection) {
            const rect = coursesSection.getBoundingClientRect();
            if (rect.top <= window.innerHeight * 0.5) {
                openModal();
                modalAutoShown = true;
            }
        }
    }
});

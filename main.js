// Mobile Menu System
function initMobileMenu() {
  const ham = document.querySelector('.hamburger');
  const mm = document.querySelector('.mobile-menu');
  const links = document.querySelectorAll('.mobile-menu a');

  if (ham && mm) {
    ham.addEventListener('click', (e) => {
      e.stopPropagation();
      ham.classList.toggle('active');
      mm.classList.toggle('open');
      document.body.style.overflow = mm.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when clicking links
    links.forEach(link => {
      link.addEventListener('click', () => {
        ham.classList.remove('active');
        mm.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mm.classList.contains('open') && !mm.contains(e.target) && !ham.contains(e.target)) {
        ham.classList.remove('active');
        mm.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}
initMobileMenu();

// FAQ Accordion (Reliable Delegation)
document.addEventListener('click', e => {
  const quest = e.target.closest('.faq-question');
  if (quest) {
    const item = quest.parentElement;
    const isActive = item.classList.contains('active');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
    if (!isActive) item.classList.add('active');
  }
});

// ── THEME & SETTINGS ──
const root = document.documentElement;
const saved = localStorage.getItem('theme') || 'dark';
root.setAttribute('data-theme', saved);

function toggleTheme() {
  const current = root.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.textContent = next === 'dark' ? '☀️' : '🌙';
  });
}
document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.textContent = saved === 'dark' ? '☀️' : '🌙';
  btn.addEventListener('click', toggleTheme);
});

// RTL Toggle
const savedDir = localStorage.getItem('dir') || 'ltr';
root.setAttribute('dir', savedDir);
function updateRtlBtn() {
  document.querySelectorAll('.rtl-toggle').forEach(btn => {
    const isRtl = root.getAttribute('dir') === 'rtl';
    const label = btn.querySelector('.rtl-label');
    const icon = btn.querySelector('.rtl-icon');
    
    if (label) {
      label.textContent = isRtl ? 'LTR' : 'RTL';
    } else {
      // If no label span, swap text content directly if it's text-only toggle
      if (btn.textContent.trim() === 'RTL' || btn.textContent.trim() === 'LTR') {
        btn.textContent = isRtl ? 'LTR' : 'RTL';
      }
    }
    
    if (icon) icon.textContent = isRtl ? '⇄' : '⇄';
    btn.setAttribute('title', isRtl ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
  });
}
updateRtlBtn();
document.querySelectorAll('.rtl-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const current = root.getAttribute('dir');
    const next = current === 'rtl' ? 'ltr' : 'rtl';
    root.setAttribute('dir', next);
    localStorage.setItem('dir', next);
    updateRtlBtn();
  });
});
const reveals = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObs.unobserve(entry.target); }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObs.observe(el));

// Back to Top
const btt = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);
});
if (btt) btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// Active Nav Link (Persistent - High Precision)
function setActiveLink() {
  const navLinks = document.querySelectorAll('nav a, .mobile-menu a, .footer-col a');
  const currentPath = window.location.pathname.toLowerCase().split('/').pop() || 'index.html';
  const currentFile = (currentPath === '' || currentPath === '/') ? 'index.html' : currentPath;

  navLinks.forEach(link => {
    const href = link.getAttribute('href')?.toLowerCase().split('/').pop() || 'index.html';
    const linkFile = (href === '' || href === '/') ? 'index.html' : href;

    if (currentFile === linkFile) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// Global initialization
function initApp() {
  initMobileMenu();
  setActiveLink();
}

// Execute on load & during interaction
document.addEventListener('DOMContentLoaded', initApp);
window.addEventListener('load', initApp);

// Video Modal
const modal = document.querySelector('.modal-backdrop');
const modalClose = document.querySelector('.modal-close');
document.querySelectorAll('[data-video]').forEach(btn => {
  btn.addEventListener('click', () => { if (modal) modal.classList.add('open'); });
});
if (modalClose) modalClose.addEventListener('click', () => modal.classList.remove('open'));
if (modal) modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

// Counter Animation
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  let current = 0;
  const step = target / 60;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.getAttribute('data-suffix') || '');
  }, 25);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { animateCounter(entry.target); counterObs.unobserve(entry.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// Parallax Hero
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) hero.style.backgroundPositionY = window.scrollY * 0.4 + 'px';
});

// Contact Form
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type=submit]');
    btn.textContent = 'Sending…';
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#4caf50';
      contactForm.reset();
      setTimeout(() => { btn.textContent = 'Send Message'; btn.style.background = ''; }, 3000);
    }, 1500);
  });
}

// Portfolio Filter
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.getAttribute('data-filter');
    document.querySelectorAll('.showreel-item').forEach(item => {
      if (filter === 'all' || item.getAttribute('data-category') === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Password Toggle Visibility
document.querySelectorAll('.toggle-pw').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = btn.closest('.auth-input-wrap').querySelector('input');
    const isText = input.type === 'text';
    input.type = isText ? 'password' : 'text';
    btn.textContent = isText ? '👁️' : '🙈';
  });
});

// Password Strength
const pwInput = document.querySelector('#pw');
if (pwInput) {
  pwInput.addEventListener('input', () => {
    const val = pwInput.value;
    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val)) strength++;
    if (/[0-9]/.test(val)) strength++;
    if (/[^A-Za-z0-9]/.test(val)) strength++;
    const fill = document.querySelector('.strength-fill');
    const label = document.querySelector('.strength-label');
    const colors = ['#e53e3e', '#e53e3e', '#ed8936', '#48bb78', '#38a169'];
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    if (fill) { fill.style.width = (strength * 25) + '%'; fill.style.background = colors[strength]; }
    if (label) label.textContent = labels[strength] || '';
  });
}

// Auth Form Submit
const loginForm = document.querySelector('#login-form');
if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = loginForm.querySelector('.auth-btn');
    btn.querySelector('span').textContent = 'Signing In…';
    setTimeout(() => {
      btn.querySelector('span').textContent = '✓ Welcome Back!';
      btn.style.background = '#48bb78';
      setTimeout(() => { btn.querySelector('span').textContent = 'Sign In'; btn.style.background = ''; }, 3000);
    }, 1500);
  });
}
const registerForm = document.querySelector('#register-form');
if (registerForm) {
  registerForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = registerForm.querySelector('.auth-btn');
    btn.querySelector('span').textContent = 'Creating Account…';
    setTimeout(() => {
      btn.querySelector('span').textContent = '✓ Account Created!';
      btn.style.background = '#48bb78';
      setTimeout(() => { btn.querySelector('span').textContent = 'Create Account'; btn.style.background = ''; }, 3000);
    }, 1800);
  });
}

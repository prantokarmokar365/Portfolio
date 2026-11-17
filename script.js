const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navigationLinks = document.querySelectorAll('.site-nav a');
const navIndicator = document.querySelector('.nav-indicator');
const themeToggle = document.querySelector('.theme-toggle');

const updateNavIndicator = () => {
  const activeLink = document.querySelector('.site-nav a.active');
  if (!activeLink || !navIndicator) return;

  navIndicator.style.setProperty('--indicator-x', `${activeLink.offsetLeft}px`);
  navIndicator.style.setProperty('--indicator-width', `${activeLink.offsetWidth}px`);
};

const applyTheme = (isDarkTheme) => {
  document.body.classList.toggle('dark-theme', isDarkTheme);
  themeToggle.setAttribute('aria-checked', isDarkTheme);
  themeToggle.setAttribute('aria-label', isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode');
};

const savedTheme = localStorage.getItem('portfolio-theme');
applyTheme(savedTheme === 'dark');

themeToggle.addEventListener('click', () => {
  const isDarkTheme = !document.body.classList.contains('dark-theme');
  applyTheme(isDarkTheme);
  localStorage.setItem('portfolio-theme', isDarkTheme ? 'dark' : 'light');
});

menuButton.addEventListener('click', () => {
  const menuIsOpen = navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', menuIsOpen);
});

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sections = document.querySelectorAll('main section[id]');
const setActiveLink = () => {
  let currentSection = 'home';
  const pageIsAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

  if (pageIsAtBottom) {
    currentSection = sections[sections.length - 1].id;
  }

  sections.forEach((section) => {
    if (!pageIsAtBottom && window.scrollY >= section.offsetTop - 170) currentSection = section.id;
  });
  navigationLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`));
  updateNavIndicator();
};

window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('resize', updateNavIndicator);
setActiveLink();

const typedText = document.querySelector('.typed-text');
const typingLine = document.querySelector('.typing-line');
const roles = ['Frontend Learner', 'Software Engineering Student', 'Problem Solver'];

if (typedText && typingLine) {
  let roleIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;

  const typeRole = () => {
    const currentRole = roles[roleIndex];
    typedText.textContent = currentRole.slice(0, characterIndex);
    typingLine.setAttribute('aria-label', currentRole);

    if (!isDeleting && characterIndex < currentRole.length) {
      characterIndex += 1;
      setTimeout(typeRole, 90);
    } else if (!isDeleting) {
      isDeleting = true;
      setTimeout(typeRole, 1600);
    } else if (characterIndex > 0) {
      characterIndex -= 1;
      setTimeout(typeRole, 45);
    } else {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(typeRole, 260);
    }
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedText.textContent = roles[0];
  } else {
    typeRole();
  }
}

const heroArt = document.querySelector('.hero-art');

if (heroArt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroArt.addEventListener('pointermove', (event) => {
    const bounds = heroArt.getBoundingClientRect();
    const horizontalPosition = (event.clientX - bounds.left) / bounds.width - 0.5;
    const verticalPosition = (event.clientY - bounds.top) / bounds.height - 0.5;

    heroArt.style.setProperty('--portrait-x', `${horizontalPosition * 10}px`);
    heroArt.style.setProperty('--portrait-y', `${verticalPosition * 10}px`);
    heroArt.style.setProperty('--portrait-rotate-x', `${verticalPosition * -7}deg`);
    heroArt.style.setProperty('--portrait-rotate-y', `${horizontalPosition * 7}deg`);
  });

  heroArt.addEventListener('pointerleave', () => {
    heroArt.style.setProperty('--portrait-x', '0px');
    heroArt.style.setProperty('--portrait-y', '0px');
    heroArt.style.setProperty('--portrait-rotate-x', '0deg');
    heroArt.style.setProperty('--portrait-rotate-y', '0deg');
  });
}

const updateModal = document.querySelector('.update-modal');
const updateCards = document.querySelectorAll('.update-card');
let lastUpdateTrigger;

const closeUpdateModal = () => {
  updateModal.classList.remove('is-open');
  updateModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastUpdateTrigger?.focus();
};

const openUpdateModal = (card) => {
  const content = card.querySelector('div');
  const summary = content.querySelector('p:last-child').textContent;
  const title = content.querySelector('h3').textContent;
  const tag = content.querySelector('.update-tag').textContent;
  const date = card.querySelector('.update-date').textContent;

  lastUpdateTrigger = card;
  document.querySelector('#update-modal-title').textContent = title;
  document.querySelector('.update-modal-tag').textContent = tag;
  document.querySelector('.update-modal-date').textContent = date;
  document.querySelector('.update-modal-detail').textContent = `${summary} This update highlights the work, learning, and thoughtful iteration behind the result.`;
  updateModal.classList.add('is-open');
  updateModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  updateModal.querySelector('.update-modal-close').focus();
};

updateCards.forEach((card) => {
  card.tabIndex = 0;
  card.setAttribute('role', 'button');
  card.addEventListener('click', (event) => {
    if (event.target.closest('a')) event.preventDefault();
    openUpdateModal(card);
  });
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openUpdateModal(card);
    }
  });
});

updateModal?.addEventListener('click', (event) => {
  if (event.target.matches('[data-close-update]')) closeUpdateModal();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && updateModal?.classList.contains('is-open')) closeUpdateModal();
});

const marqueeTrack = document.querySelector('.marquee-track');

if (marqueeTrack && !marqueeTrack.dataset.loopReady) {
  marqueeTrack.insertAdjacentHTML('beforeend', marqueeTrack.innerHTML);
  marqueeTrack.dataset.loopReady = 'true';
}

const messageForm = document.querySelector('#message-form');

const contactSocials = document.querySelector('.contact-socials');
const contactFooter = document.querySelector('.contact footer');

if (contactSocials && contactFooter) {
  contactFooter.before(contactSocials);
}

messageForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(messageForm);
  const senderName = formData.get('name');
  const senderEmail = formData.get('email');
  const message = formData.get('message');
  const subject = encodeURIComponent(`Portfolio message from ${senderName}`);
  const body = encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\n\n${message}`);

  window.location.href = `mailto:hello@suprantokarmaker.com?subject=${subject}&body=${body}`;
});

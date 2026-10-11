/**
 * Ravi Kewat - Personal Portfolio Website
 * Script: Vanilla JavaScript (ES6+)
 * SATI Coding Club Guidebook Compliant
 * Features: Theme Toggle, Mobile Navigation, Scrollspy, Clipboard Copy, Accessible UI
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Light / Dark Navy)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeIconMoon = document.getElementById('theme-icon-moon');
  const STORAGE_KEY = 'ravi_portfolio_theme';

  // Determine initial theme: saved preference -> system preference -> default 'dark'
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark');

  applyTheme(initialTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    if (themeToggleBtn) {
      themeToggleBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }

    if (themeIconSun && themeIconMoon) {
      if (theme === 'dark') {
        themeIconSun.style.display = 'block';
        themeIconMoon.style.display = 'none';
      } else {
        themeIconSun.style.display = 'none';
        themeIconMoon.style.display = 'block';
      }
    }
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggleBtn && navMenu) {
    mobileToggleBtn.addEventListener('click', () => {
      const isOpen = navMenu.classList.contains('open');
      toggleMobileMenu(!isOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(event.target) && 
          !mobileToggleBtn.contains(event.target)) {
        toggleMobileMenu(false);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMobileMenu(false);
        mobileToggleBtn.focus();
      }
    });

    // Close menu when any nav link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMobileMenu(false);
        }
      });
    });
  }

  function toggleMobileMenu(open) {
    if (open) {
      navMenu.classList.add('open');
      mobileToggleBtn.setAttribute('aria-expanded', 'true');
    } else {
      navMenu.classList.remove('open');
      mobileToggleBtn.setAttribute('aria-expanded', 'false');
    }
  }

  // --------------------------------------------------------------------------
  // 3. Active Nav Link Highlighter (ScrollSpy via IntersectionObserver)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -55% 0px',
      threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));
  }

  // --------------------------------------------------------------------------
  // 4. Floating Back to Top Button
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --------------------------------------------------------------------------
  // 5. Dynamic Footer Year
  // --------------------------------------------------------------------------
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear().toString();
  }

  // --------------------------------------------------------------------------
  // 6. Copy Email & Copy Phone Buttons
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const emailValue = copyEmailBtn.getAttribute('data-email') || 'ravi22kewat@gmail.com';
      copyToClipboard(emailValue, 'Email copied to clipboard!');
    });
  }

  const copyPhoneBtn = document.getElementById('copy-phone-btn');
  if (copyPhoneBtn) {
    copyPhoneBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const phoneValue = copyPhoneBtn.getAttribute('data-phone') || '8287308242';
      copyToClipboard(phoneValue, 'Phone number copied to clipboard!');
    });
  }

  function copyToClipboard(text, successMessage) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text)
        .then(() => {
          showToast(successMessage);
        })
        .catch(() => {
          fallbackCopy(text, successMessage);
        });
    } else {
      fallbackCopy(text, successMessage);
    }
  }

  function fallbackCopy(text, successMessage) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast(successMessage);
    } catch {
      showToast('Copy text: ' + text);
    }
    document.body.removeChild(tempInput);
  }

  // --------------------------------------------------------------------------
  // 7. Toast Notification Utility
  // --------------------------------------------------------------------------
  let toastTimeout;
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
});

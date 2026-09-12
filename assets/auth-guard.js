

(function () {
  'use strict';

  function getRootUrl(relativePath) {
    const isInSubdir = window.location.pathname.includes('/farmer/') ||
                       window.location.pathname.includes('Agrimitra(wholesaler and distributer)');
    if (isInSubdir) {
      return '../../' + relativePath;
    }
    return './' + relativePath;
  }

  function showToast(message, type = 'info', duration = 3500) {
    let container = document.getElementById('agri-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'agri-toast-container';
      container.style.position = 'fixed';
      container.style.top = '24px';
      container.style.right = '24px';
      container.style.zIndex = '99999';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.gap = '10px';
      container.style.pointerEvents = 'none';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `agri-toast agri-toast-${type}`;
    toast.style.pointerEvents = 'auto';
    toast.style.padding = '12px 20px';
    toast.style.borderRadius = '10px';
    toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
    toast.style.fontSize = '14px';
    toast.style.fontWeight = '600';
    toast.style.fontFamily = "'Outfit', 'Inter', sans-serif";
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '10px';
    toast.style.animation = 'agriSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards';
    toast.style.transition = 'all 0.3s ease';

    let bg = '#1b4332';
    let icon = '✔';
    let textColor = '#ffffff';

    if (type === 'error') {
      bg = '#d90429';
      icon = '✖';
    } else if (type === 'warning') {
      bg = '#d97706';
      icon = '⚠';
    } else if (type === 'info') {
      bg = '#0284c7';
      icon = 'ℹ';
    }

    toast.style.background = bg;
    toast.style.color = textColor;
    toast.innerHTML = `<span style="font-size:16px;">${icon}</span> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  if (!document.getElementById('agri-toast-styles')) {
    const style = document.createElement('style');
    style.id = 'agri-toast-styles';
    style.textContent = `
      @keyframes agriSlideIn {
        from { opacity: 0; transform: translateY(-20px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
    `;
    document.head.appendChild(style);
  }

  const AgriMitraAuth = {
    showToast: showToast,

    getCurrentUser: function () {
      try {
        const stored = localStorage.getItem('agrimitra_user');
        return stored ? JSON.parse(stored) : null;
      } catch (e) {
        return null;
      }
    },

    setCurrentUser: function (user) {
      if (user) {
        localStorage.setItem('agrimitra_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('agrimitra_user');
      }
    },

    logout: async function (redirectUrl) {
      try {
        showToast('Signing out of AgriMitra...', 'info', 1500);
        await fetch('/api/auth/logout', { credentials: 'include' }).catch(() => {});
      } catch (e) {}

      localStorage.removeItem('agrimitra_user');
      sessionStorage.clear();

      setTimeout(() => {
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/farmer/') || currentPath.includes('Agrimitra(wholesaler and distributer)')) {
            window.location.href = '../../index.html';
          } else {
            window.location.href = 'index.html';
          }
        }
      }, 500);
    },

    guardRole: async function (expectedRole, options = {}) {
      const { strict = false, fallbackRedirect = 'index.html' } = options;

      let user = null;
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated && data.user) {
            user = data.user;
            AgriMitraAuth.setCurrentUser(user);
          }
        }
      } catch (err) {
        console.warn('[AgriMitra Auth] Could not reach backend session endpoint:', err);
      }

      if (!user) {
        user = AgriMitraAuth.getCurrentUser();
      }

      if (!user) {
        if (strict) {
          showToast('Authentication required. Redirecting to login...', 'warning', 2500);
          setTimeout(() => {
            window.location.href = fallbackRedirect;
          }, 1200);
        }
        return null;
      }

      if (expectedRole && user.role) {

        const isCompatibleRole = (user.role === expectedRole) ||
          (expectedRole === 'wholesaler' && user.role === 'distributor') ||
          (expectedRole === 'distributor' && user.role === 'wholesaler');

        if (!isCompatibleRole) {
          console.warn(`[AgriMitra Auth] Role mismatch: current=${user.role}, expected=${expectedRole}`);
          if (strict) {
            showToast(`Access Restricted: This portal is for ${expectedRole}s. Redirecting...`, 'error', 3000);
            setTimeout(() => {
              window.location.href = fallbackRedirect;
            }, 1500);
          }
        }
      }

      AgriMitraAuth.populateUserUI(user);
      return user;
    },

    populateUserUI: function (user) {
      if (!user) return;
      const nameElements = document.querySelectorAll('.user-display-name, #user-name, #header-username, #profile-name');
      nameElements.forEach(el => {
        el.textContent = user.full_name || user.phone;
      });

      const phoneElements = document.querySelectorAll('.user-display-phone, #user-phone, #profile-phone');
      phoneElements.forEach(el => {
        el.textContent = user.phone || '';
      });

      const roleBadges = document.querySelectorAll('.user-display-role, #user-role, #profile-role');
      roleBadges.forEach(el => {
        el.textContent = (user.role || '').toUpperCase();
      });
    },

    initAutoLogoutButtons: function () {
      document.addEventListener('click', function (e) {
        const target = e.target.closest('[data-action="logout"], .logout-btn, #logout-btn, a[href="#logout"], button[id*="logout"]');
        if (target) {
          e.preventDefault();
          AgriMitraAuth.logout();
        }
      });
    },

    initLanguageSync: function () {
      const savedLang = localStorage.getItem('agri_language') || 'en';
      const langSelectors = document.querySelectorAll('#language-select, #lang-select, select[name="language"]');
      langSelectors.forEach(sel => {
        if (sel.value !== savedLang) {
          sel.value = savedLang;
        }
        sel.addEventListener('change', function () {
          localStorage.setItem('agri_language', this.value);
          if (window.i18n && typeof window.i18n.setLanguage === 'function') {
            window.i18n.setLanguage(this.value);
          }
        });
      });
    },

    initGlobalInteractiveHandlers: function () {
      document.addEventListener('click', function (e) {

        const notifBtn = e.target.closest('.icon-button, button[aria-label*="Notification" i], button[title*="Notification" i], button[aria-label*="Alert" i], button[title*="Alert" i]');
        if (notifBtn) {
          e.preventDefault();
          const user = AgriMitraAuth.getCurrentUser();
          const msg = user ? `🔔 Notifications: 0 unread alerts. SafePay & Mandi live stream active for ${user.full_name || 'Account'}.` : '🔔 Notifications: All platform services operating normally.';
          showToast(msg, 'info', 3000);
          return;
        }

        const profileBadge = e.target.closest('.user-profile-badge, .profile-pill, [data-action="profile"], #headerProfileBtn');
        if (profileBadge) {
          const fpoModal = document.getElementById('fpoProfileModal');
          if (fpoModal) {
            e.preventDefault();
            fpoModal.style.display = 'flex';
            return;
          }
          const user = AgriMitraAuth.getCurrentUser();
          if (user) {
            e.preventDefault();
            showToast(`👤 Account: ${user.full_name || 'Verified User'} · Role: ${(user.role || 'Member').toUpperCase()} · Phone: ${user.phone || 'Verified'}`, 'info', 3500);
            return;
          }
        }

        const navAnchor = e.target.closest('a[href="#produce"], a[href="#orders"], a[href="#profile"]');
        if (navAnchor) {
          const hash = navAnchor.getAttribute('href');
          const targetSection = document.getElementById(hash.slice(1) + 'Section') || document.getElementById(hash.slice(1));
          if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({ behavior: 'smooth' });
          } else if (!window.location.pathname.includes('fpo-dashboard.html')) {
            e.preventDefault();
            window.location.href = 'fpo-dashboard.html' + hash;
          }
        }
      });
    }
  };

  window.AgriMitraAuth = AgriMitraAuth;

  function initAll() {
    AgriMitraAuth.initAutoLogoutButtons();
    AgriMitraAuth.initLanguageSync();
    AgriMitraAuth.initGlobalInteractiveHandlers();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();

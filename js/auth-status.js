import { auth } from './firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js';

const ADMIN_EMAIL = 'mezayeiner66@gmail.com';
let adminPanelButton = null;

function normalizePath(path) {
  return path.replace(/\\+/g, '/');
}

function isLoginPage(path) {
  return path.endsWith('/login.html') || path.endsWith('/login') || path === '/login';
}

function isAdminPage(path) {
  return path === '/admin' || path === '/admin/' || path.startsWith('/admin/') || path.endsWith('/dashboard.html');
}

function isRootPage(path) {
  return path === '/' || path.endsWith('/index.html');
}

function clearLegacyAdminParam() {
  const url = new URL(window.location);
  url.searchParams.delete('admin');
  window.history.replaceState({}, '', url.pathname + url.search + url.hash);
}

function redirectToLogin() {
  window.location.href = '/login.html';
}

function handleLegacyAdminQuery() {
  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('admin') && searchParams.get('admin') === 'true') {
    clearLegacyAdminParam();
    redirectToLogin();
    return true;
  }
  return false;
}

function createAdminPanelButton() {
  if (adminPanelButton) return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createAdminPanelButton);
    return;
  }

  adminPanelButton = document.createElement('div');
  adminPanelButton.style.position = 'fixed';
  adminPanelButton.style.bottom = '1.5rem';
  adminPanelButton.style.right = '1.5rem';
  adminPanelButton.style.zIndex = '9999';
  adminPanelButton.innerHTML = `
    <button id="admin-panel-button" style="padding:0.95rem 1.3rem;background:var(--dorado);color:#111;border:none;border-radius:999px;font-weight:700;box-shadow:0 10px 22px rgba(0,0,0,0.24);cursor:pointer;">Panel de Control</button>
  `;
  document.body.appendChild(adminPanelButton);

  const button = document.getElementById('admin-panel-button');
  if (button) {
    button.addEventListener('click', () => {
      window.location.href = '/admin/dashboard.html';
    });
  }
}

function removeAdminPanelButton() {
  if (adminPanelButton) {
    adminPanelButton.remove();
    adminPanelButton = null;
  }
}

function handleAuthState(user) {
  const path = normalizePath(window.location.pathname);
  const loggedInAdmin = user && user.email === ADMIN_EMAIL;

  if (handleLegacyAdminQuery()) {
    return;
  }

  if (!user && isAdminPage(path)) {
    redirectToLogin();
    return;
  }

  if (isLoginPage(path) && loggedInAdmin) {
    window.location.href = '/admin/dashboard.html';
    return;
  }

  if (isRootPage(path)) {
    if (loggedInAdmin) {
      createAdminPanelButton();
    } else {
      removeAdminPanelButton();
    }
  } else {
    removeAdminPanelButton();
  }

  if (user && !loggedInAdmin && isAdminPage(path)) {
    redirectToLogin();
    return;
  }

  console.log('[Auth] Estado:', user ? user.email : 'sin sesión', 'ruta:', path);
}

onAuthStateChanged(auth, handleAuthState);

export function checkAuth() {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

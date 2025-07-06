export function isAuthenticated() {
  const storedToken = localStorage.getItem('token');
  if (!storedToken) return false;
  try {
    const { exp } = require('jwt-decode')(storedToken);
    const currentTime = Date.now() / 1000;
    if (exp && exp < currentTime) return false;
    return true;
  } catch (err) {
    return false;
  }
}

export function requireAuth(action) {
  return () => {
    if (!isAuthenticated()) {
      const redirectPath = encodeURIComponent(window.location.pathname);
      window.location.href = `https://quote.vote/auth/request-access?from=${redirectPath}`;
      return;
    }
    if (typeof action === 'function') action();
  };
}

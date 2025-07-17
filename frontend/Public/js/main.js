// utils/api.js - Para centralizar llamadas API
export const api = {
  async get(url, token) {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const response = await fetch(`/api${url}`, { headers });
    return handleResponse(response);
  },
  async post(url, data, token) {
    // ...similar implementación para POST
  }
  // ...otros métodos HTTP
};

// main.js
document.addEventListener('DOMContentLoaded', async () => {
  // Verificar autenticación al cargar
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const user = await api.get('/auth/me', token);
      updateUIForUser(user);
      loadRoleSpecificModules(user.role);
    } catch (error) {
      logout();
    }
  } else if (!isAuthPage()) {
    redirectToLogin();
  }
});

function isAuthPage() {
  return ['login.html', 'register.html'].includes(window.location.pathname.split('/').pop());
}
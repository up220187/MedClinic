import { api } from '../utils/api.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const spinner = document.getElementById('loginSpinner');
            const submitBtn = document.getElementById('loginSubmit');
            
            try {
                submitBtn.disabled = true;
                spinner.classList.remove('d-none');
                
                const data = await api.login({ email, password });
                
                localStorage.setItem('authToken', data.token);
                
                // Redirigir según rol
                if (data.user.role === 'doctor') {
                    window.location.href = '/doctor-home.html';
                } else {
                    window.location.href = '/homepage.html';
                }
            } catch (error) {
                showAlert('danger', error.message);
            } finally {
                submitBtn.disabled = false;
                spinner.classList.add('d-none');
            }
        });
    }
});

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.auth-container');
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}
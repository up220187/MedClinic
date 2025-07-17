// Configuración global y inicialización
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tooltips de Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(tooltipTriggerEl => {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Inicializar popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(popoverTriggerEl => {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Cargar datos del usuario si está logueado
    if (isAuthenticated()) {
        loadUserData();
    }
});

// Verificar autenticación
function isAuthenticated() {
    return localStorage.getItem('authToken') !== null;
}

// Cargar datos del usuario
async function loadUserData() {
    try {
        const response = await fetch('/api/auth/me', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            updateUIWithUserData(userData);
        } else {
            localStorage.removeItem('authToken');
            window.location.href = '/login.html';
        }
    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Actualizar UI con datos del usuario
function updateUIWithUserData(userData) {
    // Actualizar navbar
    const userDropdown = document.querySelector('.navbar .dropdown-toggle');
    if (userDropdown) {
        if (userData.role === 'doctor') {
            userDropdown.innerHTML = `<i class="fas fa-user-md me-1"></i> Dr. ${userData.lastname}`;
        } else {
            userDropdown.innerHTML = `<i class="fas fa-user-circle me-1"></i> ${userData.firstname}`;
        }
    }
    
    // Actualizar bienvenida
    const welcomeElement = document.querySelector('.welcome-title');
    if (welcomeElement) {
        welcomeElement.querySelector('.user-name').textContent = userData.firstname;
    }
    
    // Actualizar según rol
    if (userData.role === 'doctor') {
        updateDoctorUI(userData);
    } else {
        updatePatientUI(userData);
    }
}
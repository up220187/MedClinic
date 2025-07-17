const API_BASE_URL = 'http://localhost:3000/api';

async function makeApiRequest(endpoint, method = 'GET', body = null, requiresAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (requiresAuth) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            throw new Error('No authentication token found');
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
        method,
        headers,
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'API request failed');
    }

    return response.json();
}

// Métodos específicos
export const api = {
    // Auth
    login: (credentials) => makeApiRequest('/auth/login', 'POST', credentials, false),
    register: (userData) => makeApiRequest('/auth/register', 'POST', userData, false),
    logout: () => makeApiRequest('/auth/logout', 'POST'),
    getProfile: () => makeApiRequest('/auth/me'),

    // Paciente
    getPatientAppointments: () => makeApiRequest('/patient/appointments'),
    createAppointment: (data) => makeApiRequest('/patient/appointments', 'POST', data),
    getMedicalHistory: () => makeApiRequest('/patient/history'),
    uploadDocument: (formData) => {
        // Manejo especial para upload de archivos
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        };
        return fetch(`${API_BASE_URL}/patient/documents`, {
            method: 'POST',
            headers,
            body: formData
        });
    },

    // Doctor
    getDoctorSchedule: () => makeApiRequest('/doctor/schedule'),
    getDoctorAppointments: (date) => makeApiRequest(`/doctor/appointments?date=${date}`),
    updateAppointmentStatus: (id, status) => makeApiRequest(`/doctor/appointments/${id}`, 'PATCH', { status }),
    createPrescription: (data) => makeApiRequest('/doctor/prescriptions', 'POST', data),
    getPatientRecords: (patientId) => makeApiRequest(`/doctor/patients/${patientId}/records`)
};
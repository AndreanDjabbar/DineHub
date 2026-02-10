import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error?.response?.status === 401) {
            const pathName = window?.location?.pathname || '/';
            
            const publicRoutes = [
                '/menu',
                '/cart',
                '/orders',
                '/login',
                '/signup',
                '/forgot-password',
                '/reset-password',
                '/verify-otp',
                '/register-tenant',
                '/partner',
                '/partner-payment',
                '/'
            ];
            
            const isPublicRoute = publicRoutes.some(route => 
                pathName === route || pathName.startsWith(`${route}?`) || pathName.startsWith(`${route}/`)
            );
            
            if (!isPublicRoute) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error.response);
    }
);

export default api; 
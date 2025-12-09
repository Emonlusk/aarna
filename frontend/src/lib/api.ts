import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const auth = {
    login: (data: { user_id: string; pin: string }) => api.post('/auth/login', data),
    logout: () => api.post('/auth/logout'),
    me: () => api.get('/auth/me'),
    getPublicClasses: () => api.get('/classes/public'),
    getPublicUsers: (params: any) => api.get('/users/public', { params }),
    updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const classes = {
    list: () => api.get('/classes/'),
    create: (data: any) => api.post('/classes/', data),
    delete: (id: number) => api.delete(`/classes/${id}`),
};

export const assignments = {
    create: (data: any) => api.post('/assignments/', data),
    list: (classId?: string) => api.get('/assignments/', { params: { class_id: classId } }),
    get: (id: number) => api.get(`/assignments/${id}`),
};

export const submissions = {
    submit: (data: any) => api.post('/submissions/', data),
    list: (assignmentId: number) => api.get(`/submissions/assignment/${assignmentId}`),
    get: (id: number) => api.get(`/submissions/${id}`),
    grade: (id: number, data: any) => api.post(`/submissions/${id}/grade`, data),
    pending: () => api.get('/submissions/pending'),
};

export const resources = {
    create: (data: any) => api.post('/resources/', data),
    list: () => api.get('/resources/'),
    delete: (id: string) => api.delete(`/resources/${id}`),
};

export const users = {
    list: () => api.get('/users/'),
    create: (data: any) => api.post('/users/', data),
    delete: (id: string) => api.delete(`/users/${id}`),
};

export const ai = {
    chat: (data: any) => api.post('/ai/chat', data),
    grade: (data: any) => api.post('/ai/grade', data),
};

export default api;

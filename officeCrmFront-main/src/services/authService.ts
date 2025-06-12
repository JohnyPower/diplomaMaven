// src/services/authService.ts
import axiosInstance from './axiosConfig';
import { LoginResponse } from '../types/auth';

export const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post<LoginResponse>('auth/login', { email, password });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Помилка входу');
    }
};

// Функція оновлення токенів
export const refreshAuthToken = async (): Promise<LoginResponse> => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        throw new Error('Refresh token is missing');
    }

    try {
        const response = await axiosInstance.post<LoginResponse>('auth/refresh', { refreshToken });
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error('Не вдалося оновити токен');
    }
};

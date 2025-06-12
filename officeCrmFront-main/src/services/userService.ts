// src/services/userService.ts

import axiosInstance from './axiosConfig';
import { User, CreateUserResponse, FetchUsersResponse } from '../types/user';

export const fetchUsers = async (token: string): Promise<User[]> => {
    const response = await axiosInstance.get<FetchUsersResponse>('user/all', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.user;
};

export const createUser = async (token: string, userData: Omit<User, 'id'> & { password: string }): Promise<void> => {
    const response = await axiosInstance.post<CreateUserResponse>('user/create-user', userData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.data.message !== 'User successfully created') {
        throw new Error('Не вдалося створити користувача');
    }
};

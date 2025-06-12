// src/types/user.d.ts

export interface User {
    id: number;
    userName: string;
    email: string;
    group: number | null;
    type: 'head' | 'shift' | 'teamLead' | 'user';
}

export interface CreateUserResponse {
    message: string;
}

export interface FetchUsersResponse {
    user: User[];
}

export type Role = 'head' | 'shift' | 'teamLead' | 'user';


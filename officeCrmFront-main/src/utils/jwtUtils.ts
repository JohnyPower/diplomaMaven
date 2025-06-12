// src/utils/jwtUtils.ts
import { jwtDecode } from 'jwt-decode';

export interface DecodedToken {
    sub: number;
    email: string;
    type: string; // Роль користувача
    iat: number;
    exp: number;
    group: number; // Додаємо поле group
}

export const decodeToken = (token: string): DecodedToken | null => {
    try {
        return jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error('Invalid token', error);
        return null;
    }
};

// src/types/auth.d.ts
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    email: string;
    id: number;
}

// src/services/platformService.ts
import axiosInstance from './axiosConfig';

export interface Position {
    id: string;
    pairId: number;
    userId: string;
    enterPrice: number;
    amount: number;
    takeProfit: string;
    stopLoss: string;
    type: 'buy' | 'sell';
    currentPrice: number;
    profit: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PlatformUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country: string;
    balance: number;
    lead_id: number;
    owner: number;
    positions: Position[];
}

export interface PairData {
    id: number;
    pair: string;  // Напр. "EUR/USD"
    type: string;  // Напр. "forex"
}

export interface GetPairResponse {
    pair: PairData;
}

export interface GetPlatformUserResponse {
    user: PlatformUser;
}

export interface CreatePlatformUserResponse {
    platformUser: PlatformUser;
    userPassword: string;
    message: string;
}

/** Створити акаунт на платформі */
export const createPlatformUser = async (token: string, leadId: number): Promise<CreatePlatformUserResponse> => {
    const response = await axiosInstance.post<CreatePlatformUserResponse>(
        '/platform/user/create',
        { leadId: leadId.toString() },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

/** Отримати інформацію про користувача платформи */
export const getPlatformUser = async (token: string, leadId: number): Promise<PlatformUser> => {
    const response = await axiosInstance.get<GetPlatformUserResponse>('/platform/user', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            leadId: leadId.toString(),
        },
    });
    return response.data.user;
};

/** Отримати дані пари (назва, тип) */
export const getPair = async (token: string, pairId: number): Promise<PairData> => {
    const response = await axiosInstance.get<GetPairResponse>('/platform/pair', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            pairId: pairId.toString(),
        },
    });
    return response.data.pair;
};

/** Створити нову позицію */
export const createPosition = async (
    token: string,
    data: { platformUserId: string; pairId: number; amount: string; type: 'buy' | 'sell'; }
): Promise<Position> => {
    const response = await axiosInstance.post<Position>(
        '/platform/position',
        data,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

/** Оновити/закрити позицію */
export const updatePosition = async (
    token: string,
    payload: any // { positionId, profit, isActive }, або { positionId, takeProfit, stopLoss, profit }
): Promise<Position> => {
    const response = await axiosInstance.put<Position>(
        '/platform/position',
        payload,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
    return response.data;
};

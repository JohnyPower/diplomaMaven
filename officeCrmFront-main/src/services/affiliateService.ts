// src/services/affiliateService.ts

import axiosInstance from './axiosConfig';
import { Affiliate, CreateAffiliateResponse, FetchAffiliatesResponse, GetSingleAffiliateResponse, GetSingleAffiliateRequest } from '../types/affiliate';

export const createAffiliate = async (
    token: string,
    affiliateData: Omit<Affiliate, 'id'>
): Promise<void> => {
    const response = await axiosInstance.post<CreateAffiliateResponse>('affiliate/', affiliateData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.data.message !== 'Affiliate successfully created') {
        throw new Error('Не вдалося створити афіліата');
    }
};

export const fetchAffiliates = async (token: string): Promise<Affiliate[]> => {
    const response = await axiosInstance.get<FetchAffiliatesResponse>('affiliate/all', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.affiliates;
};

export const getSingleAffiliate = async (token: string, affiliateId: number): Promise<Affiliate> => {
    const response = await axiosInstance.get<GetSingleAffiliateResponse>('affiliate', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            affiliateId,
        },
    });
    return response.data.affiliate;
};

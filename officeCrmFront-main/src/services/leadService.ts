// src/services/leadService.ts

import axiosInstance from './axiosConfig';
import { LeadFilters } from '../types/leadFilters';
import {
    FetchLeadsResponse,
    CreateLeadResponse,
    CreateLeadPayload,
    GetSingleLeadResponse,
    Lead,
} from '../types/lead';

export const fetchLeads = async (token: string, filters?: LeadFilters): Promise<FetchLeadsResponse> => {
    const params: any = {};

    if (filters) {
        if (filters.status) {
            params.status = filters.status;
        }
        if (filters.dateRange) {
            params.dateRange = filters.dateRange;
        }
        if (filters.page) {
            params.page = filters.page;
        }
        if (filters.limit) {
            params.limit = filters.limit;
        }
        if (filters.managerId) {
            params.managerId = filters.managerId;
        }
        if (filters.country) {
            params.country = filters.country;
        }
        if (filters.language) {
            params.language = filters.language;
        }

        // <<< NEW:
        if (filters.sortBy) {
            params.sortBy = filters.sortBy;
        }
        if (filters.sortOrder) {
            params.sortOrder = filters.sortOrder;
        }
    }

    const response = await axiosInstance.get<FetchLeadsResponse>('lead/all', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params,
    });
    return response.data;
};

/**
 * Отримання окремого ліда
 */
export const getSingleLead = async (token: string, leadId: number): Promise<Lead> => {
    const response = await axiosInstance.get<GetSingleLeadResponse>('lead/', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            leadId,
        },
    });
    return response.data.lead;
};

/**
 * Створення ліда
 */
export const createLead = async (token: string, leadData: CreateLeadPayload): Promise<void> => {
    const response = await axiosInstance.post<CreateLeadResponse>('lead/', leadData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.data.message !== 'Lead successfully created') {
        throw new Error('Не вдалося створити ліда');
    }
};

/**
 * Оновлення лідів
 */
export const updateLead = async (
    token: string,
    leadIds: number[],
    manager: number,
    status?: string
): Promise<{ message: string }> => {
    const payload: any = { leadIds, manager };
    if (status !== undefined) {
        payload.status = status;
    }

    const response = await axiosInstance.put<{ message: string }>('lead', payload, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

/**
 * Отримання списку країн та мов
 */
export const fetchCountriesAndLanguages = async (token: string): Promise<{ countries: string[], languages: string[] }> => {
    const response = await axiosInstance.get<{ countries: string[], languages: string[] }>('lead/country-and-language', {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
    return response.data;
};

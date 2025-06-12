// src/types/lead.d.ts

export interface LastComment {
    id: number;
    message: string;
    createdAt: string;
}

export interface User {
    id: number;
    userName: string;
    email: string;
    group: number | null;
    type: string;
}

export interface AffiliateData {
    id: number;
    offerName: string;
    offer: string;
    url: string;
    userName: string;
    referral: string;
    description: string;
}

export interface Lead {
    id: number;
    userName: string;
    email: string;
    phone: string;
    country: string;
    language: string;
    status: string;
    createdAt: string;
    lastComment: LastComment | null;
    user: User;
    affiliateData: AffiliateData;
    comment?: string | null; // Додано для коментаря
}

export interface FetchLeadsResponse {
    total: number;
    totalPages: number;
    leads: Lead[];
}

export interface GetSingleLeadResponse {
    lead: Lead;
}

export interface CreateLeadPayload {
    userName: string;
    email: string;
    phone: string;
    country: string;
    language: string;
    affiliate: number;
    manager: number;
    comment: string | null;
    status: string;
}

export interface CreateLeadResponse {
    message: string;
}

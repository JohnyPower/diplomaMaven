// src/types/affiliate.d.ts

export interface Affiliate {
    id: number;
    offerName: string;
    offer: string;
    url: string | null;
    userName: string | null;
    referral: string | null;
    description: string | null;
}

export interface CreateAffiliateResponse {
    message: string;
}

export interface FetchAffiliatesResponse {
    affiliates: Affiliate[];
}

export interface GetSingleAffiliateRequest {
    affiliateId: number;
}

export interface GetSingleAffiliateResponse {
    affiliate: Affiliate;
}

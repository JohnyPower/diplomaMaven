// src/slices/leadsSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchLeads, createLead, getSingleLead, updateLead, fetchCountriesAndLanguages } from '../services/leadService';
import { Lead, CreateLeadPayload, FetchLeadsResponse } from '../types/lead';
import { LeadFilters } from '../types/leadFilters';

interface LeadsState {
    leads: Lead[];
    selectedLead: Lead | null;
    loading: boolean;
    error: string | null;
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
    countries: string[];
    languages: string[];
}

const initialState: LeadsState = {
    leads: [],
    selectedLead: null,
    loading: false,
    error: null,
    total: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10,
    countries: [],
    languages: [],
};

export const loadLeads = createAsyncThunk(
    'leads/loadLeads',
    async (filters: LeadFilters, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            const data = await fetchLeads(token, filters);
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const addLead = createAsyncThunk(
    'leads/addLead',
    async (leadData: CreateLeadPayload, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            await createLead(token, leadData);
            return leadData;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const loadSingleLead = createAsyncThunk(
    'leads/loadSingleLead',
    async (leadId: number, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            const lead = await getSingleLead(token, leadId);
            return lead;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const loadCountriesAndLanguages = createAsyncThunk(
    'leads/loadCountriesAndLanguages',
    async (_, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            const data = await fetchCountriesAndLanguages(token);
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const updateLeadThunk = createAsyncThunk(
    'leads/updateLead',
    async (
        { leadIds, manager, status }: { leadIds: number[]; manager: number; status?: string },
        thunkAPI
    ) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            const response = await updateLead(token, leadIds, manager, status);
            return { leadIds, manager, status: status || null, message: response.message };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const leadsSlice = createSlice({
    name: 'leads',
    initialState,
    reducers: {
        clearSelectedLead(state) {
            state.selectedLead = null;
        },
        setCurrentPage(state, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        },
        setLimit(state, action: PayloadAction<number>) {
            state.limit = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadLeads.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadLeads.fulfilled, (state, action: PayloadAction<FetchLeadsResponse>) => {
                state.loading = false;
                state.leads = action.payload.leads;
                state.total = action.payload.total;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(loadLeads.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(addLead.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addLead.fulfilled, (state, action: PayloadAction<CreateLeadPayload>) => {
    state.loading = false;
    const newLead: Lead = {
        id: state.leads.length + 1,
        userName: action.payload.userName,
        email: action.payload.email,
        phone: action.payload.phone,
        country: action.payload.country,
        language: action.payload.language,
        comment: action.payload.comment,
        status: action.payload.status,
        lastComment: null,
        affiliateData: {
            id: action.payload.affiliate,
            offerName: '',
            offer: '',
            url: '',
            userName: '',
            referral: '',
            description: '',
        },
        user: {
            id: action.payload.manager,
            userName: '',
            email: '',
            group: null,
            type: 'user',
        },
        createdAt: new Date().toISOString(), // ✅ обов'язкове поле додано
    };
    state.leads.unshift(newLead);
})

            .addCase(addLead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(loadSingleLead.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedLead = null;
            })
            .addCase(loadSingleLead.fulfilled, (state, action: PayloadAction<Lead>) => {
                state.loading = false;
                state.selectedLead = action.payload;
            })
            .addCase(loadSingleLead.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(updateLeadThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLeadThunk.fulfilled, (state, action) => {
                state.loading = false;
                const { leadIds, manager, status } = action.payload;
                leadIds.forEach((id) => {
                    const existingLead = state.leads.find((lead) => lead.id === id);
                    if (existingLead) {
                        existingLead.user.id = manager;
                        if (status !== null) {
                            existingLead.status = status;
                        }
                    }
                    if (state.selectedLead && state.selectedLead.id === id) {
                        state.selectedLead.user.id = manager;
                        if (status !== null) {
                            state.selectedLead.status = status;
                        }
                    }
                });
            })
            .addCase(updateLeadThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            .addCase(loadCountriesAndLanguages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadCountriesAndLanguages.fulfilled, (state, action: PayloadAction<{ countries: string[], languages: string[] }>) => {
                state.loading = false;
                state.countries = action.payload.countries;
                state.languages = action.payload.languages;
            })
            .addCase(loadCountriesAndLanguages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearSelectedLead, setCurrentPage, setLimit } = leadsSlice.actions;
export default leadsSlice.reducer;

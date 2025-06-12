// src/slices/affiliateSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createAffiliate, fetchAffiliates } from '../services/affiliateService';
import { Affiliate } from '../types/affiliate';

interface AffiliateState {
    affiliates: Affiliate[];
    loading: boolean;
    error: string | null;
}

const initialState: AffiliateState = {
    affiliates: [],
    loading: false,
    error: null,
};

export const loadAffiliates = createAsyncThunk('affiliates/loadAffiliates', async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('accessToken') || '';
        const data = await fetchAffiliates(token);
        return data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const addAffiliate = createAsyncThunk(
    'affiliates/addAffiliate',
    async (affiliateData: Omit<Affiliate, 'id'>, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            await createAffiliate(token, affiliateData);
            return affiliateData;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const affiliateSlice = createSlice({
    name: 'affiliates',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadAffiliates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadAffiliates.fulfilled, (state, action) => {
                state.loading = false;
                state.affiliates = action.payload;
            })
            .addCase(loadAffiliates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addAffiliate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addAffiliate.fulfilled, (state, action) => {
                state.loading = false;
                state.affiliates.push({ ...action.payload, id: state.affiliates.length + 1 });
            })
            .addCase(addAffiliate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default affiliateSlice.reducer;

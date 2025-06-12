// src/slices/platformSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    createPlatformUser,
    getPlatformUser,
    CreatePlatformUserResponse,
    PlatformUser,
    getPair,
    PairData,
    createPosition,
    updatePosition,
    Position
} from '../services/platformService';

interface PlatformState {
    platformUser: PlatformUser | null;
    userPassword: string | null;
    loading: boolean;
    error: string | null;

    // Кеш пар (pairId -> { id, pair, type })
    pairsMap: Record<number, PairData>;
}

const initialState: PlatformState = {
    platformUser: null,
    userPassword: null,
    loading: false,
    error: null,
    pairsMap: {}
};

// Створити акаунт
export const createPlatformUserThunk = createAsyncThunk<
    CreatePlatformUserResponse,
    number,
    { rejectValue: string }
>(
    'platform/createPlatformUser',
    async (leadId, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            return await createPlatformUser(token, leadId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Отримати користувача
export const getPlatformUserThunk = createAsyncThunk<
    PlatformUser,
    number,
    { rejectValue: string }
>(
    'platform/getPlatformUser',
    async (leadId, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            return await getPlatformUser(token, leadId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Отримати дані пари
export const fetchPairThunk = createAsyncThunk<
    { pairId: number; pairData: PairData },
    number,
    { rejectValue: string }
>(
    'platform/fetchPair',
    async (pairId, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            const pairData = await getPair(token, pairId);
            return { pairId, pairData };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Створити позицію
export const createPositionThunk = createAsyncThunk<
    Position,
    { platformUserId: string; pairId: number; amount: string; type: 'buy' | 'sell'; },
    { rejectValue: string }
>(
    'platform/createPosition',
    async (payload, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            const newPos = await createPosition(token, payload);
            return newPos;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

// Оновити/закрити позицію
export const updatePositionThunk = createAsyncThunk<
    Position,
    any,
    { rejectValue: string }
>(
    'platform/updatePosition',
    async (payload, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            const updated = await updatePosition(token, payload);
            return updated;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const platformSlice = createSlice({
    name: 'platform',
    initialState,
    reducers: {
        clearPlatformData(state) {
            state.platformUser = null;
            state.userPassword = null;
            state.error = null;
            state.loading = false;
            state.pairsMap = {};
        },
    },
    extraReducers: (builder) => {
        // createPlatformUserThunk
        builder
            .addCase(createPlatformUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPlatformUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                const { platformUser, userPassword } = action.payload;
                state.platformUser = platformUser;
                state.userPassword = userPassword;
            })
            .addCase(createPlatformUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Помилка створення користувача на платформі';
            });

        // getPlatformUserThunk
        builder
            .addCase(getPlatformUserThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPlatformUserThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.platformUser = action.payload;
                state.userPassword = null;
            })
            .addCase(getPlatformUserThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Помилка отримання користувача платформи';
            });

        // fetchPairThunk
        builder
            .addCase(fetchPairThunk.fulfilled, (state, action) => {
                const { pairId, pairData } = action.payload;
                state.pairsMap[pairId] = pairData;
            });

        // createPositionThunk
        builder
            .addCase(createPositionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createPositionThunk.fulfilled, (state, action) => {
                state.loading = false;
                const newPos = action.payload;
                if (state.platformUser) {
                    state.platformUser.positions.push(newPos);
                }
            })
            .addCase(createPositionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });

        // updatePositionThunk
        builder
            .addCase(updatePositionThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePositionThunk.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                if (state.platformUser) {
                    const idx = state.platformUser.positions.findIndex((p) => p.id === updated.id);
                    if (idx !== -1) {
                        state.platformUser.positions[idx] = updated;
                    }
                }
            })
            .addCase(updatePositionThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearPlatformData } = platformSlice.actions;
export default platformSlice.reducer;

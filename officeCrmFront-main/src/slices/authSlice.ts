// src/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { login } from '../services/authService';
import { LoginResponse } from '../types/auth';
import { decodeToken, DecodedToken } from '../utils/jwtUtils';

interface AuthState {
    email: string | null;
    role: string | null;
    group: number | null;
    id: number | null;  // Додаємо ID користувача
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    email: localStorage.getItem('email') || null,
    role: localStorage.getItem('role') || null,
    group: localStorage.getItem('group') ? Number(localStorage.getItem('group')) : null,
    id: localStorage.getItem('userId') ? Number(localStorage.getItem('userId')) : null,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }: { email: string; password: string }, thunkAPI) => {
        try {
            const data: LoginResponse = await login(email, password);
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('email', data.email);

            // Зберігаємо id
            localStorage.setItem('userId', data.id.toString());

            const decoded: DecodedToken | null = decodeToken(data.accessToken);
            const role = decoded?.type || null;
            const group = decoded?.group || null;

            if (role) localStorage.setItem('role', role);
            if (group !== null) localStorage.setItem('group', group.toString());

            return { email: data.email, role, group, id: data.id };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
    localStorage.removeItem('group');
    localStorage.removeItem('userId');
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.email = action.payload.email;
                state.role = action.payload.role;
                state.group = action.payload.group;
                state.id = action.payload.id;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.email = null;
                state.role = null;
                state.group = null;
                state.id = null;
            });
    },
});

export default authSlice.reducer;

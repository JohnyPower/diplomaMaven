// src/slices/userSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUsers, createUser } from '../services/userService';
import { User } from '../types/user';

// userSlice.ts
interface UserState {
    users: User[];
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [], // Початково порожній масив
    loading: false,
    error: null,
};

export const loadUsers = createAsyncThunk('users/loadUsers', async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('accessToken') || '';
        const data = await fetchUsers(token);
        return data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const addUser = createAsyncThunk(
    'users/addUser',
    async (userData: Omit<User, 'id'> & { password: string }, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            await createUser(token, userData);
            return userData;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(loadUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push({ ...action.payload, id: state.users.length + 1 });
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default userSlice.reducer;

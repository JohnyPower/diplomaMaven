// src/slices/groupSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchGroups, createGroup } from '../services/groupService';
import { Group } from '../types/group';

interface GroupState {
    groups: Group[];
    loading: boolean;
    error: string | null;
}

const initialState: GroupState = {
    groups: [],
    loading: false,
    error: null,
};

export const loadGroups = createAsyncThunk('groups/loadGroups', async (_, thunkAPI) => {
    try {
        const token = localStorage.getItem('accessToken') || '';
        const data = await fetchGroups(token);
        return data;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const addGroup = createAsyncThunk(
    'groups/addGroup',
    async (groupData: Omit<Group, 'id'>, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            await createGroup(token, groupData);
            return groupData;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadGroups.fulfilled, (state, action) => {
                state.loading = false;
                state.groups = action.payload;
            })
            .addCase(loadGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addGroup.fulfilled, (state, action) => {
                state.loading = false;
                state.groups.push({ ...action.payload, id: state.groups.length + 1 });
            })
            .addCase(addGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default groupSlice.reducer;

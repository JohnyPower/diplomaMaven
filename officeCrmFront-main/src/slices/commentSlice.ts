// src/slices/commentSlice.ts

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchComments, createComment } from '../services/commentService';
import { Comment, CreateCommentRequest } from '../types/comment';

interface CommentState {
    comments: Comment[];
    loading: boolean;
    error: string | null;
}

const initialState: CommentState = {
    comments: [],
    loading: false,
    error: null,
};

/**
 * Завантаження коментарів для певного ліда
 */
export const loadComments = createAsyncThunk(
    'comments/loadComments',
    async (leadId: number, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            const data = await fetchComments(token, leadId);
            return data;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

/**
 * Додавання нового коментаря до ліда
 */
export const addComment = createAsyncThunk(
    'comments/addComment',
    async (commentData: CreateCommentRequest, thunkAPI) => {
        try {
            const token = localStorage.getItem('accessToken') || '';
            await createComment(token, commentData);
            return commentData;
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const commentSlice = createSlice({
    name: 'comments',
    initialState,
    reducers: {
        clearComments(state) {
            state.comments = [];
            state.error = null;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadComments.fulfilled, (state, action) => {
                state.loading = false;
                state.comments = action.payload;
            })
            .addCase(loadComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                state.loading = false;
                // Припускаємо, що сервер повертає новий коментар з ID та timestamp
                const newComment: Comment = {
                    id: state.comments.length + 1, // Можливо, краще отримати реальний ID з відповіді
                    message: action.payload.message,
                    createdAt: new Date().toISOString(),
                    userData: {
                        id: 1, // Замінити на реальні дані користувача, можливо, потрібно зберігати в auth
                        userName: 'admin', // Замінити на реальні дані
                        email: 'admin@example.com', // Замінити на реальні дані
                    },
                };
                state.comments.unshift(newComment);
            })
            .addCase(addComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearComments } = commentSlice.actions;

export default commentSlice.reducer;

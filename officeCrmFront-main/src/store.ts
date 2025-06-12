// src/store.ts

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import leadsReducer from './slices/leadsSlice';
import groupReducer from './slices/groupSlice';
import affiliateReducer from './slices/affiliateSlice';
import userReducer from './slices/userSlice';
import commentReducer from './slices/commentSlice'; // Імпортуємо commentReducer
import platformReducer from './slices/platformSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        leads: leadsReducer,
        groups: groupReducer,
        affiliates: affiliateReducer,
        users: userReducer,
        comments: commentReducer, // Додаємо commentReducer до Store
        platform: platformReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

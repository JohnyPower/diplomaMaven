// src/services/commentService.ts

import axiosInstance from './axiosConfig';
import { Comment, FetchCommentsResponse, CreateCommentRequest, CreateCommentResponse } from '../types/comment';

/**
 * Отримання всіх коментарів для певного ліда
 * @param token Токен доступу
 * @param leadId ID ліда
 * @returns Масив коментарів
 */
export const fetchComments = async (token: string, leadId: number): Promise<Comment[]> => {
    const response = await axiosInstance.get<FetchCommentsResponse>('comment/user/all', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            leadId,
        },
    });
    return response.data.comments;
};

/**
 * Створення нового коментаря
 * @param token Токен доступу
 * @param commentData Дані коментаря
 * @returns Відповідь з повідомленням
 */
export const createComment = async (token: string, commentData: CreateCommentRequest): Promise<void> => {
    const response = await axiosInstance.post<CreateCommentResponse>('comment/', commentData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.data.message !== 'Comments successfully created') {
        throw new Error('Не вдалося створити коментар');
    }
};

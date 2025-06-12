// src/types/comment.d.ts

export interface UserData {
    id: number;
    userName: string;
    email: string;
}

export interface Comment {
    id: number;
    message: string;
    createdAt: string;
    userData: UserData;
}

export interface FetchCommentsResponse {
    comments: Comment[];
}

export interface CreateCommentRequest {
    message: string;
    leadId: number;
}

export interface CreateCommentResponse {
    message: string;
}

// src/services/groupService.ts

import axiosInstance from './axiosConfig';
import { Group, CreateGroupResponse, FetchGroupsResponse, GetSingleGroupResponse, GetSingleGroupRequest } from '../types/group';

export const createGroup = async (token: string, groupData: Omit<Group, 'id'>): Promise<void> => {
    const response = await axiosInstance.post<CreateGroupResponse>('group/', groupData, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    if (response.data.message !== 'Group successfully created') {
        throw new Error('Не вдалося створити групу');
    }
};

export const fetchGroups = async (token: string): Promise<Group[]> => {
    const response = await axiosInstance.get<FetchGroupsResponse>('group/all', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data.groups;
};

export const getSingleGroup = async (token: string, groupId: number): Promise<Group> => {
    const response = await axiosInstance.get<GetSingleGroupResponse>('group', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            groupId,
        },
    });
    return response.data.group;
};

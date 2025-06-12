// src/types/group.d.ts

export interface Group {
    id: number;
    name: string;
}

export interface CreateGroupResponse {
    message: string;
}

export interface FetchGroupsResponse {
    groups: Group[];
}

export interface GetSingleGroupRequest {
    groupId: number;
}

export interface GetSingleGroupResponse {
    group: Group;
}

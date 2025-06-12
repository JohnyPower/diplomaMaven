// src/utils/permissions.ts

export type Permission =
    | 'CREATE_LEAD'
    | 'VIEW_LEAD'
    | 'EDIT_STATUS'
    | 'EDIT_MANAGER'
    | 'CREATE_AFFILIATE'
    | 'VIEW_AFFILIATE'
    | 'CREATE_USER'
    | 'VIEW_USER'
    | 'CREATE_GROUP'
    | 'VIEW_GROUP';

export type Role = 'head' | 'shift' | 'teamLead' | 'user';

// Визначення дозволів для кожної ролі
export const rolePermissions: Record<Role, Permission[]> = {
    head: [
        'CREATE_LEAD',
        'VIEW_LEAD',
        'EDIT_STATUS',
        'EDIT_MANAGER',
        'CREATE_AFFILIATE',
        'VIEW_AFFILIATE',
        'CREATE_USER',
        'VIEW_USER',
        'CREATE_GROUP',
        'VIEW_GROUP',
    ],
    shift: [
        'CREATE_LEAD',
        'VIEW_LEAD',
        'EDIT_STATUS',
        'EDIT_MANAGER', // Якщо shift може редагувати менеджера
        'CREATE_AFFILIATE',
        'VIEW_AFFILIATE',
    ],
    teamLead: [
        'VIEW_LEAD',
        'EDIT_STATUS',
        'EDIT_MANAGER',
    ],
    user: [
        'VIEW_LEAD',
        'EDIT_STATUS',
    ],
};

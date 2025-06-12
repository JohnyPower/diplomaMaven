// src/utils/permissionUtils.ts

import { rolePermissions, Permission, Role } from './permissions';

/**
 * Перевіряє, чи має роль певний дозвіл
 * @param role Роль користувача
 * @param permission Дозвіл, який перевіряється
 * @returns true, якщо роль має дозвіл, інакше false
 */
export const hasPermission = (role: Role, permission: Permission): boolean => {
    const permissions = rolePermissions[role];
    const result = permissions.includes(permission);
    console.log(`Checking permission: Role=${role}, Permission=${permission}, Result=${result}`);
    return result;
};

/**
 * Перевіряє, чи має роль хоча б один з дозволів
 * @param role Роль користувача
 * @param permissions Масив дозволів
 * @returns true, якщо роль має хоча б один з дозволів, інакше false
 */
export const hasAnyPermission = (role: Role, permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(role, permission));
};

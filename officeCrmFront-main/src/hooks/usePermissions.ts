// src/hooks/usePermissions.ts
import { useAppSelector } from './hooks';
import { hasPermission, hasAnyPermission } from '../utils/permissionUtils';
import { Permission, Role } from '../utils/permissions';

const usePermissions = () => {
    const role = useAppSelector((state) => state.auth.role) as Role;

    const can = (permission: Permission) => {
        return hasPermission(role, permission);
    };

    const canAny = (permissions: Permission[]) => {
        return hasAnyPermission(role, permissions);
    };

    return { can, canAny };
};

export default usePermissions;

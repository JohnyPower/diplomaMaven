// src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../hooks/hooks';
import { hasPermission, hasAnyPermission } from '../utils/permissionUtils';
import { Permission, Role } from '../utils/permissions';

interface PrivateRouteProps {
    children: JSX.Element;
    requiredPermissions?: Permission[]; // Дозволи, необхідні для доступу
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredPermissions }) => {
    const { email, role } = useAppSelector((state) => state.auth);

    if (!email || !role) {
        return <Navigate to="/login" />;
    }

    if (requiredPermissions && role) {
        // Перевіряємо, чи має користувач усі необхідні дозволи
        const hasAllPermissions = requiredPermissions.every((permission) =>
            hasPermission(role as Role, permission)
        );

        if (!hasAllPermissions) {
            return <Navigate to="/access-denied" />;
        }
    }

    return children;
};

export default PrivateRoute;

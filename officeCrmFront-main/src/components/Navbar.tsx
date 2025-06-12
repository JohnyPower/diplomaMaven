// src/components/Navbar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppSelector } from '../hooks/hooks';
import { hasPermission } from '../utils/permissionUtils';
import { Permission, Role } from '../utils/permissions';

const Navbar = () => {
    const role = useAppSelector((state) => state.auth.role) as Role;

    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded ${
            isActive ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-200'
        }`;

    return (
        <nav className="bg-white shadow mb-4">
            <div className="container mx-auto flex space-x-4">
                <NavLink to="/dashboard" className={navItemClass}>
                    Дашбоард
                </NavLink>

                {/* Ліди доступні всім ролям з дозволом VIEW_LEAD */}
                {hasPermission(role, 'VIEW_LEAD') && (
                    <NavLink to="/leads" className={navItemClass}>
                        Потенційні Клієнти
                    </NavLink>
                )}

                {/* Афіліати доступні з дозволом VIEW_AFFILIATE */}
                {hasPermission(role, 'VIEW_AFFILIATE') && (
                    <NavLink to="/affiliate" className={navItemClass}>
                        Рекламні компанії
                    </NavLink>
                )}

                {/* Групи доступні з дозволом VIEW_GROUP */}
                {hasPermission(role, 'VIEW_GROUP') && (
                    <NavLink to="/groups" className={navItemClass}>
                        Групи
                    </NavLink>
                )}

                {/* Юзери доступні з дозволом VIEW_USER */}
                {hasPermission(role, 'VIEW_USER') && (
                    <NavLink to="/users" className={navItemClass}>
                        Користувачі
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

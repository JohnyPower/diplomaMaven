// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaBars, FaTachometerAlt, FaUsers, FaUserTie, FaChartBar, FaSignOutAlt } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { logoutUser } from '../slices/authSlice';
import { hasPermission } from '../utils/permissionUtils';
import { Role } from '../utils/permissions';

const Sidebar = () => {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const role = useAppSelector((state) => state.auth.role) as Role;

    // Новий стиль для навігаційних пунктів, використовуючи наші кольори і transition
    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `flex items-center px-4 py-2 mt-4 transition-colors duration-200 transform rounded-lg ${
            isActive
                ? 'bg-primary text-white'
                : 'text-textPrimary hover:bg-blue-100'
        }`;

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div className={`flex flex-col ${isOpen ? 'w-64' : 'w-20'} h-screen px-4 py-8 bg-white border-r shadow-lg transition-all duration-300`}>
            <div className="flex items-center justify-between">
                {isOpen && <h2 className="text-2xl font-bold text-primary">CRM</h2>}
                <button onClick={toggleSidebar} className="text-gray-500 hover:text-primary focus:outline-none">
                    <FaBars />
                </button>
            </div>

            <div className="flex flex-col justify-between flex-1 mt-8">
                <nav className="space-y-2">
                    <NavLink to="/dashboard" className={navItemClass}>
                        <FaTachometerAlt className="w-5 h-5" />
                        {isOpen && <span className="ml-3">Інформаційна панель</span>}
                    </NavLink>

                    {hasPermission(role, 'VIEW_LEAD') && (
                        <NavLink to="/leads" className={navItemClass}>
                            <FaUsers className="w-5 h-5" />
                            {isOpen && <span className="ml-3">Потенційні Клієнти</span>}
                        </NavLink>
                    )}

                    {hasPermission(role, 'VIEW_AFFILIATE') && (
                        <NavLink to="/affiliate" className={navItemClass}>
                            <FaChartBar className="w-5 h-5" />
                            {isOpen && <span className="ml-3">Рекламні компанії</span>}
                        </NavLink>
                    )}

                    {hasPermission(role, 'VIEW_GROUP') && (
                        <NavLink to="/groups" className={navItemClass}>
                            <FaUserTie className="w-5 h-5" />
                            {isOpen && <span className="ml-3">Групи</span>}
                        </NavLink>
                    )}

                    {hasPermission(role, 'VIEW_USER') && (
                        <NavLink to="/users" className={navItemClass}>
                            <FaUsers className="w-5 h-5" />
                            {isOpen && <span className="ml-3">Користувачі</span>}
                        </NavLink>
                    )}
                </nav>

                <div className="mt-8">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-textPrimary transition-colors duration-200 transform rounded-lg hover:bg-blue-100"
                    >
                        <FaSignOutAlt className="w-5 h-5" />
                        {isOpen && <span className="ml-3">Вийти</span>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;

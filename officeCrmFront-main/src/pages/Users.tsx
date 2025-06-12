// src/pages/Users.tsx

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { loadUsers, addUser } from '../slices/userSlice';
import { loadGroups } from '../slices/groupSlice';
import Drawer from '../components/Drawer';
import { User } from '../types/user';
import { hasPermission } from '../utils/permissionUtils';
import { Role } from '../types/user'; // Переконайтеся, що Role імпортовано правильно

const Users = () => {
    const dispatch = useAppDispatch();
    const { users, loading, error } = useAppSelector((state) => state.users);
    const { groups } = useAppSelector((state) => state.groups);
    const role = useAppSelector((state) => state.auth.role) as Role;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [newUser, setNewUser] = useState<Omit<User, 'id'> & { password: string }>({
        userName: '',
        email: '',
        group: null,
        type: 'user',
        password: '',
    });

    useEffect(() => {
        dispatch(loadUsers());
        dispatch(loadGroups());
    }, [dispatch]);

    const handleCreateUser = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setNewUser({
            userName: '',
            email: '',
            group: null,
            type: 'user',
            password: '',
        });
    };

    const handleSaveUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(addUser(newUser)).unwrap();
            // Можна додати сповіщення про успішне створення користувача
            handleCloseDrawer();
        } catch (err) {
            // Обробка помилки, можливо, відображення сповіщення
            console.error('Error creating user:', err);
        }
    };

    // Перевірка дозволу на створення користувачів
    const canCreateUser = hasPermission(role, 'CREATE_USER');

    // Отримання груп для селекту
    const groupOptions = groups;

    // Визначення доступних ролей для створення (всі крім 'head')
    const availableRoles: Role[] = ['shift', 'teamLead', 'user'];

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Користувачі</h1>
                {canCreateUser && (
                    <button
                        onClick={handleCreateUser}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Створити користувача
                    </button>
                )}
            </div>
            {loading ? (
                <div>Завантаження...</div>
            ) : error ? (
                <div className="text-red-500">Помилка: {error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            {['ID', 'Ім\'я користувача', 'Email', 'Група', 'Тип'].map((header) => (
                                <th
                                    key={header}
                                    className="py-3 px-5 text-left text-sm font-semibold text-gray-700"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((user, index) => (
                            <tr
                                key={user.id}
                                className={`border-b ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100`}
                            >
                                <td className="py-3 px-5 text-sm text-gray-700">{user.id}</td>
                                <td className="py-3 px-5 text-sm text-gray-700">{user.userName}</td>
                                <td className="py-3 px-5 text-sm text-gray-700">{user.email}</td>
                                <td className="py-3 px-5 text-sm text-gray-700">
                                    {user.group
                                        ? groups.find((group) => group.id === user.group)?.name || '—'
                                        : '—'}
                                </td>
                                <td className="py-3 px-5 text-sm text-gray-700">{user.type}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Використовуємо Drawer для створення нового користувача */}
            {canCreateUser && (
                <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} title="Створити нового користувача">
                    <form onSubmit={handleSaveUser}>
                        {/* Ім'я користувача */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Ім'я користувача</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                value={newUser.userName}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, userName: e.target.value })
                                }
                                required
                            />
                        </div>
                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border rounded"
                                value={newUser.email}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, email: e.target.value })
                                }
                                required
                            />
                        </div>
                        {/* Пароль */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Пароль</label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border rounded"
                                value={newUser.password}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, password: e.target.value })
                                }
                                required
                            />
                        </div>
                        {/* Група */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Група</label>
                            <select
                                className="w-full px-3 py-2 border rounded"
                                value={newUser.group ?? ''}
                                onChange={(e) =>
                                    setNewUser({
                                        ...newUser,
                                        group: e.target.value ? Number(e.target.value) : null,
                                    })
                                }
                            >
                                <option value="">Без групи</option>
                                {groups.map((group) => (
                                    <option key={group.id} value={group.id}>
                                        {group.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Тип користувача */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Тип користувача</label>
                            <select
                                className="w-full px-3 py-2 border rounded"
                                value={newUser.type}
                                onChange={(e) =>
                                    setNewUser({ ...newUser, type: e.target.value as Role })
                                }
                                required
                            >
                                <option value="">Оберіть тип користувача</option>
                                {availableRoles.map((roleOption) => (
                                    <option key={roleOption} value={roleOption}>
                                        {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Кнопки */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleCloseDrawer}
                                className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                            >
                                Відмінити
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Створити
                            </button>
                        </div>
                    </form>
                </Drawer>
            )}
        </div>
    );
};
export default Users;


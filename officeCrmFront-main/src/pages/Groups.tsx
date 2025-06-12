// src/pages/Groups.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { loadGroups, addGroup } from '../slices/groupSlice';
import Drawer from '../components/Drawer';
import { Group } from '../types/group';
import { hasPermission } from '../utils/permissionUtils';
import { Permission, Role } from '../utils/permissions';

const Groups = () => {
    const dispatch = useAppDispatch();
    const { groups, loading, error } = useAppSelector((state) => state.groups);
    const role = useAppSelector((state) => state.auth.role) as Role;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        dispatch(loadGroups());
    }, [dispatch]);

    const handleCreateGroup = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setNewGroupName('');
    };

    const handleSaveGroup = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addGroup({ name: newGroupName }));
        handleCloseDrawer();
    };

    // Перевірка дозволу на створення груп
    const canCreateGroup = hasPermission(role, 'CREATE_GROUP');

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Групи</h1>
                {canCreateGroup && (
                    <button
                        onClick={handleCreateGroup}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Створити групу
                    </button>
                )}
            </div>
            {loading ? (
                <div>Завантаження...</div>
            ) : error ? (
                <div>Помилка: {error}</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">ID</th>
                            <th className="py-3 px-5 text-left text-sm font-semibold text-gray-700">Назва</th>
                        </tr>
                        </thead>
                        <tbody>
                        {groups.map((group, index) => (
                            <tr
                                key={group.id}
                                className={`border-b ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100`}
                            >
                                <td className="py-3 px-5 text-sm text-gray-700">{group.id}</td>
                                <td className="py-3 px-5 text-sm text-gray-700">{group.name}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Drawer для створення нової групи */}
            {canCreateGroup && (
                <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} title="Створити нову групу">
                    <form onSubmit={handleSaveGroup}>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Назва групи</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                                required
                            />
                        </div>
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
                                Зберегти
                            </button>
                        </div>
                    </form>
                </Drawer>
            )}
        </div>
    );
};

export default Groups;

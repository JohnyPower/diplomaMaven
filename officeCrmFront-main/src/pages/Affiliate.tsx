// src/pages/Affiliate.tsx

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { loadAffiliates, addAffiliate } from '../slices/affiliateSlice';
import Drawer from '../components/Drawer';
import { Affiliate } from '../types/affiliate';
import { hasPermission } from '../utils/permissionUtils';
import { Permission, Role } from '../utils/permissions';

const Affiliates = () => {
    const dispatch = useAppDispatch();
    const {affiliates, loading, error} = useAppSelector((state) => state.affiliates);
    const role = useAppSelector((state) => state.auth.role) as Role;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [newAffiliate, setNewAffiliate] = useState<Omit<Affiliate, 'id'>>({
        offerName: '',
        offer: '',
        url: '',
        userName: '',
        referral: '',
        description: '',
    });

    useEffect(() => {
        dispatch(loadAffiliates());
    }, [dispatch]);

    const handleCreateAffiliate = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
        setNewAffiliate({
            offerName: '',
            offer: '',
            url: '',
            userName: '',
            referral: '',
            description: '',
        });
    };

    const handleSaveAffiliate = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addAffiliate(newAffiliate));
        handleCloseDrawer();
    };

    // Перевірка дозволу на створення афіліатів
    const canCreateAffiliate = hasPermission(role, 'CREATE_AFFILIATE');

    return (
        <div className="flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Афіліати</h1>
                {canCreateAffiliate && (
                    <button
                        onClick={handleCreateAffiliate}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Створити афіліата
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
                            {[
                                'ID',
                                'Назва офера',
                                'Офер',
                                'URL',
                                "Ім'я користувача",
                                'Реферал',
                                'Опис',
                            ].map((header) => (
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
                        {affiliates.map((affiliate, index) => (
                            <tr
                                key={affiliate.id}
                                className={`border-b ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                } hover:bg-gray-100`}
                            >
                                <td className="py-3 px-5 text-sm text-gray-700">{affiliate.id}</td>
                                <td className="py-3 px-5 text-sm text-gray-700">{affiliate.offerName}</td>
                                <td className="py-3 px-5 text-sm text-gray-700">{affiliate.offer}</td>
                                <td className="py-3 px-5 text-sm text-gray-700">
                                    {affiliate.url || '—'}
                                </td>
                                <td className="py-3 px-5 text-sm text-gray-700">
                                    {affiliate.userName || '—'}
                                </td>
                                <td className="py-3 px-5 text-sm text-gray-700">
                                    {affiliate.referral || '—'}
                                </td>
                                <td className="py-3 px-5 text-sm text-gray-700">
                                    {affiliate.description || '—'}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Drawer для створення нового афіліата */}
            {canCreateAffiliate && (
                <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} title="Створити афіліата">
                    <form onSubmit={handleSaveAffiliate}>
                        {/* Назва офера */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Назва офера</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                value={newAffiliate.offerName}
                                onChange={(e) => setNewAffiliate({...newAffiliate, offerName: e.target.value})}
                                required
                            />
                        </div>
                        {/* Офер */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Офер</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                value={newAffiliate.offer}
                                onChange={(e) => setNewAffiliate({...newAffiliate, offer: e.target.value})}
                                required
                            />
                        </div>
                        {/* URL */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">URL</label>
                            <input
                                type="url"
                                className="w-full px-3 py-2 border rounded"
                                value={newAffiliate.url || ''}
                                onChange={(e) => setNewAffiliate({...newAffiliate, url: e.target.value})}
                                required
                            />
                        </div>
                        {/* Ім'я користувача */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Ім'я користувача</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                value={newAffiliate.userName || ''}
                                onChange={(e) => setNewAffiliate({...newAffiliate, userName: e.target.value})}
                                required
                            />
                        </div>
                        {/* Реферал */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Реферал</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border rounded"
                                value={newAffiliate.referral || ''}
                                onChange={(e) => setNewAffiliate({...newAffiliate, referral: e.target.value})}
                                required
                            />
                        </div>
                        {/* Опис */}
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2">Опис</label>
                            <textarea
                                className="w-full px-3 py-2 border rounded"
                                value={newAffiliate.description || ''}
                                onChange={(e) => setNewAffiliate({...newAffiliate, description: e.target.value})}
                            />
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
                                Зберегти
                            </button>
                        </div>
                    </form>
                </Drawer>
            )}
        </div>
    );
};
export default Affiliates;

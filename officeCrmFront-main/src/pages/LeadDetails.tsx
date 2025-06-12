// src/pages/LeadDetails.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';

// Ліди
import { loadSingleLead, clearSelectedLead, updateLeadThunk } from '../slices/leadsSlice';
import { Lead } from '../types/lead';

// Коментарі
import { loadComments, addComment, clearComments } from '../slices/commentSlice';
import { Comment as CommentType } from '../types/comment';

// Платформа
import {
    createPlatformUserThunk,
    getPlatformUserThunk,
    clearPlatformData,
    fetchPairThunk,
    createPositionThunk,
    updatePositionThunk
} from '../slices/platformSlice';
import { PlatformUser, Position } from '../services/platformService';

// Авторизація
import { hasPermission } from '../utils/permissionUtils';
import { Role } from '../utils/permissions';

// UI
import Modal from '../components/Modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const STATUS_OPTIONS = [
    'new', 'no answer', 'newer answer', 'slip away', 'not interested',
    'no pot', 'callback', 'reassign', 'active', 'depositor',
    'initial call', 'wrong info', 'invalid language', 'wrong number',
];

const LeadDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    // =======================
    // 1. Стан лідів
    const {
        selectedLead,
        loading: leadLoading,
        error: leadError
    } = useAppSelector((state) => state.leads);

    // =======================
    // 2. Стан коментарів
    const {
        comments,
        loading: commentsLoading,
        error: commentsError
    } = useAppSelector((state) => state.comments);

    // =======================
    // 3. Стан платформи
    const {
        platformUser,
        userPassword,
        loading: platformLoading,
        error: platformError,
        pairsMap
    } = useAppSelector((state) => state.platform);

    // =======================
    // 4. Стан авторизації (роль)
    const role = useAppSelector((state) => state.auth.role) as Role;
    const canEditStatus = hasPermission(role, 'EDIT_STATUS');
    const canEditManager = hasPermission(role, 'EDIT_MANAGER');

    // -----------------------
    // Ефекти
    useEffect(() => {
        if (id) {
            const leadId = parseInt(id, 10);
            if (isNaN(leadId)) {
                navigate('/leads');
            } else {
                // Завантажити інфо про лід
                dispatch(loadSingleLead(leadId));
                // Завантажити коментарі
                dispatch(loadComments(leadId));
                // Спробуємо отримати platform user
                dispatch(getPlatformUserThunk(leadId))
                    .unwrap()
                    .catch(() => {
                        // Якщо 404 або інша помилка - юзер на платформі не існує
                    });
            }
        }

        return () => {
            dispatch(clearSelectedLead());
            dispatch(clearComments());
            dispatch(clearPlatformData());
        };
    }, [id, dispatch, navigate]);

    // -----------------------
    // Модалка для редагування ліда (менеджер, статус)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editManager, setEditManager] = useState<number | null>(null);
    const [editStatus, setEditStatus] = useState<string>('');

    const handleOpenEditModal = () => {
        if (selectedLead) {
            setEditManager(selectedLead.user.id);
            setEditStatus(selectedLead.status);
            setIsEditModalOpen(true);
        }
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditManager(null);
        setEditStatus('');
    };
    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLead) return;
        const payload: any = { leadIds: [selectedLead.id] };
        if (canEditStatus) payload.status = editStatus;
        if (canEditManager && editManager !== null) payload.manager = editManager;

        dispatch(updateLeadThunk(payload))
            .unwrap()
            .then(() => {
                toast.success("Лід успішно оновлено!");
            })
            .catch((err) => console.error(err));
        handleCloseEditModal();
    };

    // -----------------------
    // Створення користувача на платформі
    const handleCreatePlatformUser = () => {
        if (!selectedLead) return;
        dispatch(createPlatformUserThunk(selectedLead.id))
            .unwrap()
            .then((res) => {
                toast.success(`Аккаунт створено. Пароль: ${res.userPassword}`);
            })
            .catch((err) => {
                toast.error(`Помилка створення: ${err}`);
            });
    };

    // -----------------------
    // Додавання коментаря (без модалки)
    const [newCommentText, setNewCommentText] = useState('');

    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLead) return;
        if (!newCommentText.trim()) return;

        dispatch(addComment({ message: newCommentText, leadId: selectedLead.id }))
            .unwrap()
            .then(() => {
                toast.success('Коментар додано');
            })
            .catch((err) => {
                toast.error(`Помилка: ${err}`);
            });
        setNewCommentText('');
    };

    // -----------------------
    // Локальний стан для вкладок
    const [activeTab, setActiveTab] = useState<'comments' | 'positions' | 'queries'>('comments');

    // -----------------------
    // Стан для 3 модалок (позиції): створення, закриття, редагування
    const [createPosModalOpen, setCreatePosModalOpen] = useState(false);
    const [closePosModalOpen, setClosePosModalOpen] = useState(false);
    const [editPosModalOpen, setEditPosModalOpen] = useState(false);

    // Дані для форм
    const [createForm, setCreateForm] = useState({
        pairId: 1,
        amount: '10',
        type: 'buy' as 'buy' | 'sell'
    });
    const [closeForm, setCloseForm] = useState({
        positionId: '',
        profit: ''
    });
    const [editForm, setEditForm] = useState({
        positionId: '',
        takeProfit: '',
        stopLoss: '',
        profit: ''
    });

    // -----------------------
    // Хендлери для створення позиції
    const handleOpenCreateModal = () => {
        setCreateForm({ pairId: 1, amount: '10', type: 'buy' });
        setCreatePosModalOpen(true);
    };
    const handleSubmitCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!platformUser) return;
        await dispatch(
            createPositionThunk({
                platformUserId: platformUser.id,
                pairId: createForm.pairId,
                amount: createForm.amount,
                type: createForm.type
            })
        )
            .unwrap()
            .then(() => {
                toast.success('Позицію відкрито');
            })
            .catch((err) => toast.error(err));
        setCreatePosModalOpen(false);
    };

    // -----------------------
    // Хендлери для закриття позиції
    const handleOpenCloseModal = (pos: Position) => {
        setCloseForm({ positionId: pos.id, profit: '' });
        setClosePosModalOpen(true);
    };
    const handleSubmitClose = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(
            updatePositionThunk({
                positionId: closeForm.positionId,
                profit: closeForm.profit,
                isActive: 'false'
            })
        )
            .unwrap()
            .then(() => {
                toast.success('Позицію закрито');
            })
            .catch((err) => toast.error(err));
        setClosePosModalOpen(false);
    };

    // -----------------------
    // Хендлери для редагування позиції
    // Замість handleOpenEditModal(pos: Position) робимо handleOpenEditPositionModal
    const handleOpenEditPositionModal = (pos: Position) => {
        setEditForm({
            positionId: pos.id,
            takeProfit: pos.takeProfit || '',
            stopLoss: pos.stopLoss || '',
            profit: pos.profit.toString()
        });
        setEditPosModalOpen(true);
    };

    const handleSubmitEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        await dispatch(
            updatePositionThunk({
                positionId: editForm.positionId,
                takeProfit: editForm.takeProfit,
                stopLoss: editForm.stopLoss,
                profit: editForm.profit
            })
        )
            .unwrap()
            .then(() => {
                toast.success('Позицію оновлено');
            })
            .catch((err) => toast.error(err));
        setEditPosModalOpen(false);
    };

    // -----------------------
    // Перевірка стани завантаження
    if (leadLoading) {
        return <div className="p-4">Завантаження ліда...</div>;
    }
    if (leadError) {
        return <div className="p-4 text-red-500">Помилка: {leadError}</div>;
    }
    if (!selectedLead) {
        return <div className="p-4">Лід не знайдено.</div>;
    }

    // -----------------------
    // Додаткові дані: афіліат і менеджер
    const affiliateData = selectedLead.affiliateData;
    const managerData = selectedLead.user;

    // -----------------------
    // Рендер
    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Ліва колонка */}
                    <div className="w-full md:w-1/3 flex flex-col gap-6">

                        {/* Картка: Основна інформація */}
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-semibold mb-3">Основна інформація</h3>
                            <div className="text-sm space-y-2">
                                <p><strong>ID:</strong> {selectedLead.id}</p>
                                <p><strong>Ім'я:</strong> {selectedLead.userName}</p>
                                <p><strong>Email:</strong> {selectedLead.email}</p>
                                <p><strong>Телефон:</strong> {selectedLead.phone}</p>
                                <p><strong>Країна:</strong> {selectedLead.country}</p>
                                <p><strong>Мова:</strong> {selectedLead.language}</p>
                                <p><strong>Статус:</strong> {selectedLead.status}</p>
                                {selectedLead.comment && (
                                    <p><strong>Коментар:</strong> {selectedLead.comment}</p>
                                )}
                            </div>
                            {(canEditStatus || canEditManager) && (
                                <button
                                    onClick={handleOpenEditModal}
                                    className="px-2 py-1 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-600 hover:text-white transition"
                                >
                                    Редагувати
                                </button>
                            )}
                        </div>

                        {/* Картка: Афіліат */}
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-semibold mb-3">Афіліат</h3>
                            <div className="text-sm space-y-2">
                                <p><strong>ID Афіліата:</strong> {affiliateData.id}</p>
                                <p><strong>Назва Офера:</strong> {affiliateData.offerName}</p>
                                <p><strong>Офер:</strong> {affiliateData.offer}</p>
                                <p><strong>URL:</strong> {affiliateData.url || '—'}</p>
                                <p><strong>Ім'я Користувача:</strong> {affiliateData.userName || '—'}</p>
                                <p><strong>Реферал:</strong> {affiliateData.referral || '—'}</p>
                                <p><strong>Опис:</strong> {affiliateData.description || '—'}</p>
                            </div>
                        </div>

                        {/* Картка: Менеджер */}
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-semibold mb-3">Менеджер</h3>
                            <div className="text-sm space-y-2">
                                <p><strong>ID Менеджера:</strong> {managerData.id}</p>
                                <p><strong>Ім'я Користувача:</strong> {managerData.userName}</p>
                                <p><strong>Email:</strong> {managerData.email}</p>
                                <p><strong>Група:</strong> {managerData.group ?? '—'}</p>
                                <p><strong>Тип:</strong> {managerData.type}</p>
                            </div>
                        </div>

                        {/* Картка: Аккаунт на платформі */}
                        <div className="bg-white p-4 rounded shadow">
                            <h3 className="text-lg font-semibold mb-3">Аккаунт на платформі</h3>
                            {platformLoading && <p>Завантаження даних платформи...</p>}
                            {platformError && <p className="text-red-500">{platformError}</p>}

                            {platformUser ? (
                                <div className="text-sm space-y-2">
                                    <p><strong>ID користувача:</strong> {platformUser.id}</p>
                                    <p><strong>Email:</strong> {platformUser.email}</p>
                                    <p><strong>Phone:</strong> {platformUser.phone}</p>
                                    <p><strong>Country:</strong> {platformUser.country}</p>
                                    <p><strong>Balance:</strong> {platformUser.balance}</p>
                                    {userPassword && (
                                        <p className="mt-2 text-green-600">
                                            Пароль: <strong>{userPassword}</strong>
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm mb-2">
                                        Користувач не зареєстрований на платформі.
                                    </p>
                                    <button
                                        onClick={handleCreatePlatformUser}
                                        className="btn bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Створити аккаунт
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Права колонка (вкладки) */}
                    <div className="w-full md:w-2/3 flex flex-col gap-6">
                        <div className="bg-white p-4 rounded shadow">
                            <div className="border-b border-gray-200 mb-4 flex space-x-8">
                                <button
                                    className={`pb-2 ${
                                        activeTab === 'comments'
                                            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('comments')}
                                >
                                    Коментарі
                                </button>
                                <button
                                    className={`pb-2 ${
                                        activeTab === 'positions'
                                            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('positions')}
                                >
                                    Позиції
                                </button>
                                <button
                                    className={`pb-2 ${
                                        activeTab === 'queries'
                                            ? 'text-blue-600 border-b-2 border-blue-600 font-semibold'
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                    onClick={() => setActiveTab('queries')}
                                >
                                    Запити
                                </button>
                            </div>

                            {/* Контент вкладок */}
                            {activeTab === 'comments' && (
                                <div>
                                    {/* Поле для додавання коментаря */}
                                    <form onSubmit={handleAddComment} className="mb-4 flex items-start space-x-2">
                                        <img
                                            className="w-8 h-8 rounded-full"
                                            src={`https://ui-avatars.com/api/?name=${selectedLead.userName}`}
                                            alt="Your avatar"
                                        />
                                        <textarea
                                            className="input w-full"
                                            placeholder="Введіть коментар..."
                                            value={newCommentText}
                                            onChange={(e) => setNewCommentText(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="btn bg-green-600 text-white hover:bg-green-700"
                                        >
                                            Надіслати
                                        </button>
                                    </form>

                                    {/* Список коментарів */}
                                    <div className="max-h-72 overflow-y-auto">
                                        {commentsLoading ? (
                                            <div>Завантаження коментарів...</div>
                                        ) : commentsError ? (
                                            <div className="text-red-500">Помилка: {commentsError}</div>
                                        ) : comments.length === 0 ? (
                                            <div className="text-gray-600">Немає коментарів.</div>
                                        ) : (
                                            <ul className="space-y-4">
                                                {comments.map((comment: CommentType) => (
                                                    <li key={comment.id} className="flex items-start space-x-2">
                                                        <img
                                                            className="w-8 h-8 rounded-full"
                                                            src={`https://ui-avatars.com/api/?name=${comment.userData.userName}`}
                                                            alt={comment.userData.userName}
                                                        />
                                                        <div>
                                                            <div className="bg-gray-100 p-3 rounded-lg">
                                                                <p className="text-gray-800">{comment.message}</p>
                                                            </div>
                                                            <span className="text-xs text-gray-500 mt-1 block">
                                {new Date(comment.createdAt).toLocaleString()} — {comment.userData.userName}
                              </span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'positions' && (
                                <div>
                                    {platformUser ? (
                                        <button
                                            onClick={handleOpenCreateModal}
                                            className="btn bg-blue-600 text-white hover:bg-blue-700 mb-4"
                                        >
                                            Відкрити позицію
                                        </button>
                                    ) : (
                                        <p>Аккаунт на платформі не створений.</p>
                                    )}

                                    {platformLoading ? (
                                        <p>Завантаження...</p>
                                    ) : !platformUser ? (
                                        <p>Немає даних по позиціях.</p>
                                    ) : platformUser.positions.length === 0 ? (
                                        <p>Немає позицій.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full bg-white border rounded text-sm">
                                                <thead className="bg-gray-100 border-b">
                                                <tr>
                                                    <th className="px-4 py-2 text-left">Актив</th>
                                                    <th className="px-4 py-2 text-left">Type</th>
                                                    <th className="px-4 py-2 text-left">Amount</th>
                                                    <th className="px-4 py-2 text-left">Enter Price</th>
                                                    <th className="px-4 py-2 text-left">Current Price</th>
                                                    <th className="px-4 py-2 text-left">Profit</th>
                                                    <th className="px-4 py-2 text-left">Is Active</th>
                                                    <th className="px-4 py-2 text-left">Actions</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {platformUser.positions.map((pos: Position) => {
                                                    const pairData = pairsMap[pos.pairId];
                                                    if (!pairData) {
                                                        // Якщо немає в кеші, завантажуємо
                                                        dispatch(fetchPairThunk(pos.pairId));
                                                    }
                                                    return (
                                                        <tr key={pos.id} className="border-b">
                                                            <td className="px-4 py-2">
                                                                {pairData ? pairData.pair : 'Завантаження...'}
                                                            </td>
                                                            <td className="px-4 py-2">{pos.type}</td>
                                                            <td className="px-4 py-2">{pos.amount}</td>
                                                            <td className="px-4 py-2">{pos.enterPrice}</td>
                                                            <td className="px-4 py-2">{pos.currentPrice}</td>
                                                            <td className="px-4 py-2">{pos.profit}</td>
                                                            <td className="px-4 py-2">{pos.isActive ? 'Yes' : 'No'}</td>
                                                            <td className="px-4 py-2 space-x-2">
                                                                {/* Редагувати */}
                                                                <button
                                                                    onClick={() => handleOpenEditPositionModal(pos)}
                                                                    className="px-2 py-1 rounded bg-yellow-100 text-yellow-600 hover:bg-yellow-600 hover:text-white transition"
                                                                >
                                                                    Edit
                                                                </button>
                                                                {/* Закрити (лише якщо активна) */}
                                                                {pos.isActive && (
                                                                    <button
                                                                        onClick={() => handleOpenCloseModal(pos)}
                                                                        className="px-2 py-1 rounded bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition"
                                                                    >
                                                                        Close
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}

                                    {/* Модалки для створення/закриття/редагування позицій */}
                                    {createPosModalOpen && (
                                        <Modal
                                            isOpen={createPosModalOpen}
                                            onClose={() => setCreatePosModalOpen(false)}
                                            title="Відкрити позицію"
                                        >
                                            <form onSubmit={handleSubmitCreate} className="space-y-4">
                                                <div>
                                                    <label className="block text-gray-700 mb-2">Pair ID</label>
                                                    <input
                                                        type="number"
                                                        className="input"
                                                        value={createForm.pairId}
                                                        onChange={(e) => setCreateForm({ ...createForm, pairId: +e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 mb-2">Amount</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={createForm.amount}
                                                        onChange={(e) => setCreateForm({ ...createForm, amount: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 mb-2">Type</label>
                                                    <select
                                                        className="input"
                                                        value={createForm.type}
                                                        onChange={(e) => setCreateForm({ ...createForm, type: e.target.value as 'buy' | 'sell' })}
                                                    >
                                                        <option value="buy">buy</option>
                                                        <option value="sell">sell</option>
                                                    </select>
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setCreatePosModalOpen(false)}
                                                        className="btn bg-gray-300 hover:bg-gray-400"
                                                    >
                                                        Відмінити
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn bg-blue-600 hover:bg-blue-700 text-white"
                                                    >
                                                        Створити
                                                    </button>
                                                </div>
                                            </form>
                                        </Modal>
                                    )}

                                    {closePosModalOpen && (
                                        <Modal
                                            isOpen={closePosModalOpen}
                                            onClose={() => setClosePosModalOpen(false)}
                                            title="Закрити позицію"
                                        >
                                            <form onSubmit={handleSubmitClose} className="space-y-4">
                                                <div>
                                                    <label className="block text-gray-700 mb-2">Profit</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={closeForm.profit}
                                                        onChange={(e) => setCloseForm({ ...closeForm, profit: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setClosePosModalOpen(false)}
                                                        className="btn bg-gray-300 hover:bg-gray-400"
                                                    >
                                                        Відмінити
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        Закрити
                                                    </button>
                                                </div>
                                            </form>
                                        </Modal>
                                    )}

                                    {editPosModalOpen && (
                                        <Modal
                                            isOpen={editPosModalOpen}
                                            onClose={() => setEditPosModalOpen(false)}
                                            title="Редагувати позицію"
                                        >
                                            <form onSubmit={handleSubmitEdit} className="space-y-4">
                                                <div>
                                                    <label className="block text-gray-700 mb-2">takeProfit</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={editForm.takeProfit}
                                                        onChange={(e) => setEditForm({ ...editForm, takeProfit: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 mb-2">stopLoss</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={editForm.stopLoss}
                                                        onChange={(e) => setEditForm({ ...editForm, stopLoss: e.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-gray-700 mb-2">profit</label>
                                                    <input
                                                        type="text"
                                                        className="input"
                                                        value={editForm.profit}
                                                        onChange={(e) => setEditForm({ ...editForm, profit: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex justify-end space-x-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setEditPosModalOpen(false)}
                                                        className="btn bg-gray-300 hover:bg-gray-400"
                                                    >
                                                        Відмінити
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        className="btn bg-yellow-500 hover:bg-yellow-600 text-white"
                                                    >
                                                        Зберегти
                                                    </button>
                                                </div>
                                            </form>
                                        </Modal>
                                    )}
                                </div>
                            )}

                            {activeTab === 'queries' && (
                                <div>
                                    <p className="text-gray-600">Тут будуть «Запити» (поки що заглушка).</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Модалка редагування ліда (статус/менеджер) */}
            {(canEditStatus || canEditManager) && (
                <Modal
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    title="Редагувати Лід"
                >
                    <form onSubmit={handleSaveEdit} className="space-y-4">
                        {canEditManager && (
                            <div>
                                <label className="block text-gray-700 mb-2">Менеджер (ID)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={editManager ?? ''}
                                    onChange={(e) => setEditManager(Number(e.target.value))}
                                    required
                                />
                            </div>
                        )}
                        {canEditStatus && (
                            <div>
                                <label className="block text-gray-700 mb-2">Статус</label>
                                <select
                                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    value={editStatus}
                                    onChange={(e) => setEditStatus(e.target.value)}
                                    required
                                >
                                    {STATUS_OPTIONS.map((statusOption) => (
                                        <option key={statusOption} value={statusOption}>
                                            {statusOption}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleCloseEditModal}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                            >
                                Відмінити
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                            >
                                Зберегти
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            <ToastContainer />
        </div>
    );
};

export default LeadDetails;

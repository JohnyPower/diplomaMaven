// src/pages/Leads.tsx
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import {
    loadLeads,
    addLead,
    setCurrentPage,
    setLimit,
    updateLeadThunk,
    loadCountriesAndLanguages,
} from '../slices/leadsSlice';
import Drawer from '../components/Drawer';
import LeadFilterComponent from '../components/LeadFilterComponent';
import Pagination from '../components/Pagination';
import { CreateLeadPayload, Lead } from '../types/lead';
import { hasPermission } from '../utils/permissionUtils';
import { Role } from '../utils/permissions';
import { loadAffiliates } from '../slices/affiliateSlice';
import { loadUsers } from '../slices/userSlice';
import { LeadFilters } from '../types/leadFilters';
import Modal from '../components/Modal';
import { FaEye, FaEdit } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import { format } from 'date-fns';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

const statusStyles: Record<string, { text: string; bg: string; shadow: string }> = {
    new: { text: "text-green-900", bg: "bg-green-200", shadow: "bg-green-500" },
    "no answer": { text: "text-yellow-900", bg: "bg-yellow-200", shadow: "bg-yellow-500" },
    "newer answer": { text: "text-purple-900", bg: "bg-purple-200", shadow: "bg-purple-500" },
    "slip away": { text: "text-red-900", bg: "bg-red-200", shadow: "bg-red-500" },
    "not interested": { text: "text-gray-900", bg: "bg-gray-300", shadow: "bg-gray-500" },
    "no pot": { text: "text-orange-900", bg: "bg-orange-200", shadow: "bg-orange-500" },
    callback: { text: "text-blue-900", bg: "bg-blue-200", shadow: "bg-blue-500" },
    reassign: { text: "text-teal-900", bg: "bg-teal-200", shadow: "bg-teal-500" },
    active: { text: "text-green-900", bg: "bg-green-300", shadow: "bg-green-600" },
    "initial call": { text: "text-yellow-900", bg: "bg-yellow-300", shadow: "bg-yellow-600" },
    "invalid language": { text: "text-purple-900", bg: "bg-purple-300", shadow: "bg-purple-600" },
    "wrong info": { text: "text-red-900", bg: "bg-red-300", shadow: "bg-red-600" },
    "wrong number": { text: "text-red-800", bg: "bg-red-900", shadow: "bg-red-400" },
    depositor: { text: "text-green-900", bg: "bg-green-300", shadow: "bg-green-600" },
};

const pageSizeOptions = [
    { value: 10, label: '10' },
    { value: 50, label: '50' },
    { value: 100, label: '100' },
    { value: 150, label: '150' },
    { value: 200, label: '200' },
    { value: 250, label: '250' },
];

const Leads = () => {
    const dispatch = useAppDispatch();
    const { leads, loading, error, totalPages, currentPage, limit } = useAppSelector((state) => state.leads);
    const { affiliates } = useAppSelector((state) => state.affiliates);
    const { users = [] } = useAppSelector((state) => state.users);
    const role = useAppSelector((state) => state.auth.role) as Role;
    const canEditStatus = hasPermission(role, 'EDIT_STATUS');
    const canEditManager = hasPermission(role, 'EDIT_MANAGER');
    const canCreateLead = hasPermission(role, 'CREATE_LEAD');

    // Глобальні фільтри з Redux
    const [filters, setFilters] = useState<LeadFilters>({
        page: currentPage,
        limit: limit,
        sortBy: 'lastComment',
        sortOrder: 'DESC',
    });
    // Локальний пошук (email/phone)
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        dispatch(loadLeads(filters));
    }, [dispatch, filters]);

    useEffect(() => {
        dispatch(loadAffiliates());
        dispatch(loadUsers());
        dispatch(loadCountriesAndLanguages());
    }, [dispatch]);

    // Обробник "onFilter" з LeadsFilterBar
    const handleFilter = (appliedFilters: LeadFilters) => {
        setFilters({
            ...appliedFilters,
            page: 1,
            limit: appliedFilters.limit || limit,
        });
        dispatch(setCurrentPage(1));
        if (appliedFilters.limit !== undefined) {
            dispatch(setLimit(appliedFilters.limit));
        }
    };

    // Обробник "onSearchLocal" з LeadsFilterBar
    const handleLocalSearch = (text: string) => {
        setSearchTerm(text.toLowerCase());
    };

    // Пагінація
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setFilters((prev) => ({ ...prev, page }));
        dispatch(setCurrentPage(page));
    };
    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = Number(e.target.value);
        setFilters((prev) => ({ ...prev, limit: newLimit, page: 1 }));
        dispatch(setLimit(newLimit));
        dispatch(setCurrentPage(1));
    };

    // Фільтрація лідів по локальному пошуку
    const filteredLeads = leads.filter((lead) => {
        const phoneLower = lead.phone.toLowerCase();
        const emailLower = lead.email.toLowerCase();
        return phoneLower.includes(searchTerm) || emailLower.includes(searchTerm);
    });

    // Створення ліда (Drawer)
    const [newLead, setNewLead] = useState<CreateLeadPayload>({
        userName: '',
        email: '',
        phone: '',
        country: '',
        language: '',
        affiliate: affiliates.length > 0 ? affiliates[0].id : 0,
        manager: users.length > 0 ? users[0].id : 0,
        comment: null,
        status: 'new',
    });
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const handleCreateLead = () => {
        setNewLead({
            userName: '',
            email: '',
            phone: '',
            country: '',
            language: '',
            affiliate: affiliates.length > 0 ? affiliates[0].id : 0,
            manager: users.length > 0 ? users[0].id : 0,
            comment: null,
            status: 'new',
        });
        setIsDrawerOpen(true);
    };
    const handleCloseDrawer = () => setIsDrawerOpen(false);
    const handleSaveLead = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(addLead(newLead));
        handleCloseDrawer();
    };

    // Редагування одного ліда (Modal)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [leadForEdit, setLeadForEdit] = useState<{ id: number; manager: number; status: string } | null>(null);
    const handleOpenEditModal = (leadId: number, currentManager: number, currentStatus: string) => {
        setLeadForEdit({ id: leadId, manager: currentManager, status: currentStatus });
        setIsEditModalOpen(true);
    };
    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setLeadForEdit(null);
    };
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadForEdit) return;
        const payload = {
            leadIds: [leadForEdit.id],
            manager: leadForEdit.manager,
            status: leadForEdit.status,
        };
        dispatch(updateLeadThunk(payload))
            .unwrap()
            .then(() => {
                toast.success("Лід успішно оновлено!");
                dispatch(loadLeads(filters));
                handleCloseEditModal();
            })
            .catch((err) => console.error(err));
    };

    // Масове редагування (вибір лідів)
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedLeads, setSelectedLeads] = useState<number[]>([]);
    const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
    const [bulkManager, setBulkManager] = useState<number | "">("");

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedLeads([]);
    };
    const handleSelectLead = (leadId: number, checked: boolean) => {
        setSelectedLeads(checked ? [...selectedLeads, leadId] : selectedLeads.filter(id => id !== leadId));
    };
    const openBulkEditModal = () => {
        if (selectedLeads.length > 0) setIsBulkEditModalOpen(true);
    };
    const handleBulkEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedLeads.length === 0 || bulkManager === "") return;
        dispatch(updateLeadThunk({ leadIds: selectedLeads, manager: Number(bulkManager) }))
            .unwrap()
            .then(() => {
                toast.success("Менеджера для вибраних лідів успішно змінено!");
                dispatch(loadLeads(filters));
                setIsBulkEditModalOpen(false);
                setSelectedLeads([]);
                setIsSelectionMode(false);
                setBulkManager("");
            })
            .catch((err) => console.error(err));
    };

    // Швидкий коментар (Modal)
    const [isQuickCommentModalOpen, setIsQuickCommentModalOpen] = useState(false);
    const [leadIdForComment, setLeadIdForComment] = useState<number | null>(null);
    const [quickComment, setQuickComment] = useState('');
    const handleOpenQuickComment = (id: number) => {
        setLeadIdForComment(id);
        setQuickComment('');
        setIsQuickCommentModalOpen(true);
    };
    const handleCloseQuickCommentModal = () => {
        setIsQuickCommentModalOpen(false);
        setLeadIdForComment(null);
        setQuickComment('');
    };
    const handleSubmitQuickComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!leadIdForComment) return;
        import('../slices/commentSlice')
            .then(({ addComment }) => {
                dispatch(addComment({ message: quickComment, leadId: leadIdForComment }))
                    .unwrap()
                    .then(() => {
                        toast.success('Коментар додано');
                        dispatch(loadLeads(filters));
                    })
                    .catch(() => toast.error('Помилка додавання коментаря'))
                    .finally(() => handleCloseQuickCommentModal());
            })
            .catch((err) => console.error('commentSlice not found', err));
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Заголовок + Кнопки */}
                <div className="flex flex-col lg:flex-row justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-textPrimary">Потенційні Клієнти</h1>
                    <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                        {canEditManager && (
                            <button onClick={toggleSelectionMode} className="btn bg-gray-500 hover:bg-gray-600">
                                {isSelectionMode ? "Вихід з вибору" : "Вибрати"}
                            </button>
                        )}
                        {canCreateLead && (
                            <button onClick={handleCreateLead} className="btn">
                                Створити потенційного клієнта
                            </button>
                        )}
                    </div>
                </div>

                {/* Панель фільтрів */}
                <div className="mb-6">
                    <LeadFilterComponent
                        onFilter={handleFilter}
                        onSearchLocal={handleLocalSearch}
                    />
                </div>

                {/* Керування лімітами */}
                <div className="flex items-center mb-4">
                    <label className="mr-2 text-textPrimary">Потенційних клієнтів на сторінку:</label>
                    <div className="w-32">
                        <Select
                            classNamePrefix="react-select"
                            isSearchable={false}
                            // Знаходимо поточний об'єкт із pageSizeOptions за значенням filters.limit:
                            value={pageSizeOptions.find((opt) => opt.value === filters.limit)}
                            onChange={(selectedOption) => {
                                if (!selectedOption) return;
                                // newLimit - обране значення з селекту
                                const newLimit = selectedOption.value;

                                // Оновлюємо локальний стейт і Redux
                                setFilters((prev) => ({...prev, limit: newLimit, page: 1}));
                                dispatch(setLimit(newLimit));
                                dispatch(setCurrentPage(1));
                            }}
                            options={pageSizeOptions}
                        />
                    </div>
                </div>

                {/* Кнопка для масового редагування */}
                {isSelectionMode && selectedLeads.length > 0 && canEditManager && (
                    <div className="mb-4">
                        <button onClick={openBulkEditModal} className="btn bg-yellow-500 hover:bg-yellow-600">
                            Змінити менеджера для вибраних
                        </button>
                    </div>
                )}

                {/* Таблиця з лідами */}
                <div className="overflow-x-auto shadow rounded-lg">
                    <table className="min-w-[1400px] w-full table-auto border-collapse">
                        <thead className="bg-white">
                        <tr>
                            {isSelectionMode && (
                                <th className="px-5 py-3 border-b text-textPrimary text-sm font-semibold">
                                    Вибір
                                </th>
                            )}
                            {[
                                'ID',
                                "Ім'я та Email",
                                'Телефон',
                                'Країна',
                                'Мова',
                                'Афіліат',
                                'Менеджер',
                                'Статус',
                                'Останній коментар',
                                'Дата створення',
                                'Дії',
                            ].map((header) => (
                                <th
                                    key={header}
                                    className="px-5 py-3 border-b text-textPrimary text-sm uppercase font-semibold whitespace-nowrap"
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={12} className="px-5 py-5 text-center">
                                    Завантаження...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={12} className="px-5 py-5 text-center text-red-500">
                                    Помилка: {error}
                                </td>
                            </tr>
                        ) : filteredLeads.length === 0 ? (
                            <tr>
                                <td colSpan={12} className="px-5 py-5 text-center text-gray-600">
                                    Немає лідів за обраними фільтрами або пошуком.
                                </td>
                            </tr>
                        ) : (
                            filteredLeads.map((lead: Lead, index) => (
                                <tr
                                    key={lead.id}
                                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition duration-200`}
                                >
                                    {isSelectionMode && (
                                        <td className="px-5 py-5 border-b text-sm">
                                            <input
                                                type="checkbox"
                                                checked={selectedLeads.includes(lead.id)}
                                                onChange={(e) => handleSelectLead(lead.id, e.target.checked)}
                                            />
                                        </td>
                                    )}
                                    <td className="px-5 py-5 border-b text-sm">{lead.id}</td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-nowrap">
                                        <div className="font-medium text-textPrimary">{lead.userName}</div>
                                        <div className="text-xs text-gray-500">{lead.email}</div>
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-nowrap">{lead.phone}</td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-nowrap">{lead.country}</td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-nowrap">{lead.language}</td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="ml-3">
                                                <div
                                                    className="text-textPrimary font-medium">{lead.affiliateData.offerName}</div>
                                                <div className="text-xs text-gray-500">{lead.affiliateData.offer}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-nowrap">
                                        <div className="font-medium text-textPrimary">{lead.user.userName}</div>
                                        <div className="text-xs text-gray-500">{lead.user.email}</div>
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-nowrap">
                      <span
                          className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${statusStyles[lead.status]?.text || "text-gray-900"} ${statusStyles[lead.status]?.bg || "bg-gray-200"}`}
                      >
                        <span className="relative capitalize">{lead.status}</span>
                      </span>
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-normal">
                                        <div>{lead.lastComment ? lead.lastComment.message : '—'}</div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {lead.lastComment
                                                ? format(new Date(lead.lastComment.createdAt), 'dd.MM.yyyy HH:mm')
                                                : '—'}
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-nowrap">
                                        {lead.createdAt ? format(new Date(lead.createdAt), 'dd.MM.yyyy HH:mm') : '—'}
                                    </td>
                                    <td className="px-5 py-5 border-b text-sm whitespace-nowrap flex space-x-4 items-center">
                                        {/* Переглянути (FaEye) */}
                                        <a
                                            href={`/leads/${lead.id}`}
                                            className="btn-icon bg-blue-100 text-blue-600 hover:bg-blue-600 hover:text-white"
                                            title="Переглянути лід"
                                        >
                                            <FaEye/>
                                        </a>

                                        {/* Редагувати (FaEdit) - якщо дозволено */}
                                        {(!isSelectionMode && (canEditStatus || canEditManager)) && (
                                            <button
                                                onClick={() => handleOpenEditModal(lead.id, lead.user.id, lead.status)}
                                                className="btn-icon bg-yellow-100 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                                                title="Редагувати лід"
                                            >
                                                <FaEdit/>
                                            </button>
                                        )}

                                        {/* Додати коментар */}
                                        <button
                                            onClick={() => handleOpenQuickComment(lead.id)}
                                            className="btn-icon bg-green-100 text-green-600 hover:bg-green-600 hover:text-white"
                                            title="Залишити коментар"
                                        >
                                            💬
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Пагінація */}
                {!loading && filteredLeads.length > 0 && totalPages > 1 && (
                    <div className="mt-6">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
                    </div>
                )}
            </div>

            {/* Drawer для створення ліда */}
            {canCreateLead && (
                <Drawer isOpen={isDrawerOpen} onClose={handleCloseDrawer} title="Створити нового потенційного клієнта">
                    <form onSubmit={handleSaveLead} className="space-y-4">
                        <div>
                            <label className="block text-textPrimary mb-2">Ім'я</label>
                            <input
                                type="text"
                                className="input"
                                value={newLead.userName}
                                onChange={(e) => setNewLead({...newLead, userName: e.target.value})}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-textPrimary mb-2">Email</label>
                            <input
                                type="email"
                                className="input"
                                value={newLead.email}
                                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-textPrimary mb-2">Телефон</label>
                            <input
                                type="text"
                                className="input"
                                value={newLead.phone}
                                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-textPrimary mb-2">Країна</label>
                            <input
                                type="text"
                                className="input"
                                value={newLead.country}
                                onChange={(e) => setNewLead({ ...newLead, country: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-textPrimary mb-2">Мова</label>
                            <input
                                type="text"
                                className="input"
                                value={newLead.language}
                                onChange={(e) => setNewLead({ ...newLead, language: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-textPrimary mb-2">Афіліат</label>
                            <select
                                className="input"
                                value={newLead.affiliate}
                                onChange={(e) => setNewLead({ ...newLead, affiliate: Number(e.target.value) })}
                                required
                            >
                                <option value="">Оберіть афіліата</option>
                                {affiliates.map((aff) => (
                                    <option key={aff.id} value={aff.id}>
                                        {aff.offerName} - {aff.offer}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-textPrimary mb-2">Менеджер</label>
                            <select
                                className="input"
                                value={newLead.manager}
                                onChange={(e) => setNewLead({ ...newLead, manager: Number(e.target.value) })}
                                required
                            >
                                <option value="">Оберіть менеджера</option>
                                {users.map((manager) => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.userName} ({manager.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-textPrimary mb-2">Коментар</label>
                            <textarea
                                className="input"
                                value={newLead.comment || ''}
                                onChange={(e) => setNewLead({ ...newLead, comment: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-textPrimary mb-2">Статус</label>
                            <select
                                className="input"
                                value={newLead.status}
                                onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                                required
                            >
                                {Object.keys(statusStyles).map((statusOption) => (
                                    <option key={statusOption} value={statusOption}>
                                        {statusOption}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleCloseDrawer}
                                className="btn bg-gray-300 hover:bg-gray-400"
                            >
                                Відмінити
                            </button>
                            <button type="submit" className="btn">
                                Зберегти
                            </button>
                        </div>
                    </form>
                </Drawer>
            )}

            {/* Модалка редагування одного ліда */}
            {isEditModalOpen && leadForEdit && (
                <Modal isOpen={isEditModalOpen} onClose={handleCloseEditModal} title="Редагувати Лід">
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        {canEditManager && (
                            <div>
                                <label className="block text-textPrimary mb-2">Менеджер</label>
                                <select
                                    className="input"
                                    value={leadForEdit.manager}
                                    onChange={(e) => setLeadForEdit({ ...leadForEdit!, manager: Number(e.target.value) })}
                                    required
                                >
                                    <option value="">Оберіть менеджера</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>
                                            {user.userName} ({user.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {canEditStatus && (
                            <div>
                                <label className="block text-textPrimary mb-2">Статус</label>
                                <select
                                    className="input"
                                    value={leadForEdit.status}
                                    onChange={(e) => setLeadForEdit({ ...leadForEdit!, status: e.target.value })}
                                    required
                                >
                                    {Object.keys(statusStyles).map((statusOption) => (
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
                                className="btn bg-gray-300 hover:bg-gray-400"
                            >
                                Відмінити
                            </button>
                            <button
                                type="submit"
                                className="btn bg-yellow-500 hover:bg-yellow-600"
                            >
                                Зберегти
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Модалка масового редагування */}
            {isBulkEditModalOpen && (
                <Modal
                    isOpen={isBulkEditModalOpen}
                    onClose={() => setIsBulkEditModalOpen(false)}
                    title="Змінити менеджера для вибраних лідів"
                >
                    <form onSubmit={handleBulkEditSubmit} className="space-y-4">
                        <div>
                            <label className="block text-textPrimary mb-2">Менеджер</label>
                            <select
                                className="input"
                                value={bulkManager}
                                onChange={(e) => setBulkManager(+e.target.value)}
                                required
                            >
                                <option value="">Оберіть менеджера</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.userName} ({user.email})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsBulkEditModalOpen(false)}
                                className="btn bg-gray-300 hover:bg-gray-400"
                            >
                                Відмінити
                            </button>
                            <button
                                type="submit"
                                className="btn bg-yellow-500 hover:bg-yellow-600"
                            >
                                Зберегти
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            {/* Модалка швидкого коментаря */}
            {isQuickCommentModalOpen && (
                <Modal
                    isOpen={isQuickCommentModalOpen}
                    onClose={handleCloseQuickCommentModal}
                    title="Додати коментар"
                >
                    <form onSubmit={handleSubmitQuickComment} className="space-y-4">
                        <div>
                            <label className="block text-textPrimary mb-2">Коментар</label>
                            <textarea
                                className="input"
                                value={quickComment}
                                onChange={(e) => setQuickComment(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={handleCloseQuickCommentModal}
                                className="btn bg-gray-300 hover:bg-gray-400"
                            >
                                Відмінити
                            </button>
                            <button
                                type="submit"
                                className="btn bg-green-600 hover:bg-green-700"
                            >
                                Додати
                            </button>
                        </div>
                    </form>
                </Modal>
            )}

            <ToastContainer />
        </div>
    );
};

export default Leads;

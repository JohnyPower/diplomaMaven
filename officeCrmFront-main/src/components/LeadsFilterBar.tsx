// src/components/LeadsFilterBar.tsx
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LeadFilters } from '../types/leadFilters';
import { useAppSelector } from '../hooks/hooks';
import { Role } from '../utils/permissions';

interface LeadsFilterBarProps {
    onFilter: (filters: LeadFilters) => void;
    onSearchLocal: (searchText: string) => void;
}

const statusOptions = [
    'new',
    'no answer',
    'newer answer',
    'slip away',
    'not interested',
    'no pot',
    'callback',
    'reassign',
    'active',
    'depositor',
    'initial call',
    'wrong info',
    'invalid language',
    'wrong number',
];

const sortFieldOptions = [
    { value: 'createdAt', label: 'Дата створення' },
    { value: 'lastComment', label: 'Дата останнього коментаря' },
];

const sortOrderOptions = [
    { value: 'ASC', label: 'За зростанням' },
    { value: 'DESC', label: 'За спаданням' },
];

const LeadsFilterBar: React.FC<LeadsFilterBarProps> = ({ onFilter, onSearchLocal }) => {
    // Стан фільтрів
    const [status, setStatus] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [managerId, setManagerId] = useState<number | undefined>(undefined);
    const [country, setCountry] = useState<string>('');
    const [language, setLanguage] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('lastComment');
    const [sortOrder, setSortOrder] = useState<string>('DESC');

    // Стан пошуку
    const [searchText, setSearchText] = useState('');

    // Дані з Redux (роль, користувачі, країни, мови)
    const role = useAppSelector((state) => state.auth.role) as Role;
    const users = useAppSelector((state) => state.users.users);
    const countries = useAppSelector((state) => state.leads.countries);
    const languages = useAppSelector((state) => state.leads.languages);

    // Обробник кнопки "Фільтрувати"
    const handleApplyFilters = () => {
        const appliedFilters: LeadFilters = {};

        if (status) {
            appliedFilters.status = status;
        }
        if (startDate && endDate) {
            appliedFilters.dateRange = [startDate.toISOString(), endDate.toISOString()];
        }
        if (['head', 'shift', 'teamLead'].includes(role) && managerId) {
            appliedFilters.managerId = managerId;
        }
        if (country) {
            appliedFilters.country = country;
        }
        if (language) {
            appliedFilters.language = language;
        }
        // Сортування
        appliedFilters.sortBy = sortBy;
        appliedFilters.sortOrder = sortOrder;

        onFilter(appliedFilters);
    };

    // Обробник кнопки "Скинути"
    const handleResetFilters = () => {
        setStatus('');
        setStartDate(null);
        setEndDate(null);
        setManagerId(undefined);
        setCountry('');
        setLanguage('');
        setSearchText('');
        setSortBy('lastComment');
        setSortOrder('DESC');

        onFilter({});
        onSearchLocal('');
    };

    // Слухаємо зміни поля пошуку (email/phone) і викликаємо onSearchLocal
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        onSearchLocal(e.target.value);
    };

    return (
        <div className="w-full bg-white rounded-xl shadow p-4 flex flex-col lg:flex-row items-center lg:space-x-4 space-y-4 lg:space-y-0">
            {/* Статус */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Статус</label>
                <select
                    className="input min-w-[120px]"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">Всі</option>
                    {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>

            {/* Дата (від..до) */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Дата</label>
                <div className="flex items-center space-x-2">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        placeholderText="Початок"
                        className="input w-28"
                        dateFormat="dd.MM.yyyy"
                        isClearable
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        placeholderText="Кінець"
                        className="input w-28"
                        dateFormat="dd.MM.yyyy"
                        isClearable
                        minDate={startDate || undefined}
                    />
                </div>
            </div>

            {/* Менеджер (доступно для head/shift/teamLead) */}
            {['head', 'shift', 'teamLead'].includes(role) && (
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Менеджер</label>
                    <select
                        className="input min-w-[120px]"
                        value={managerId || ''}
                        onChange={(e) => setManagerId(e.target.value ? Number(e.target.value) : undefined)}
                    >
                        <option value="">Всі</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.userName} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Країна */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Країна</label>
                <select
                    className="input min-w-[120px]"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                >
                    <option value="">Всі</option>
                    {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {/* Мова */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Мова</label>
                <select
                    className="input min-w-[120px]"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                >
                    <option value="">Всі</option>
                    {languages.map((l) => (
                        <option key={l} value={l}>{l}</option>
                    ))}
                </select>
            </div>

            {/* Пошук (email/phone) */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Пошук</label>
                <input
                    type="text"
                    className="input w-32"
                    placeholder="Email/телефон..."
                    value={searchText}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Сортування */}
            <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">Сортувати за</label>
                <div className="flex items-center space-x-2">
                    <select
                        className="input w-28"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        {sortFieldOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                    <select
                        className="input w-28"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                    >
                        {sortOrderOptions.map((option) => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Кнопки "Фільтрувати" і "Скинути" */}
            <div className="flex flex-col justify-center space-y-2 lg:space-y-0 lg:space-x-2 lg:flex-row mt-2 lg:mt-auto">
                <button
                    onClick={handleApplyFilters}
                    className="btn"
                >
                    Фільтрувати
                </button>
                <button
                    onClick={handleResetFilters}
                    className="btn bg-gray-300 hover:bg-gray-400 text-gray-700"
                >
                    Скинути
                </button>
            </div>
        </div>
    );
};

export default LeadsFilterBar;

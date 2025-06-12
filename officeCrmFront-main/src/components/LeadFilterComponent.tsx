// src/components/LeadFilterComponent.tsx
import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useAppSelector } from '../hooks/hooks';
import { Role } from '../utils/permissions';
import { LeadFilters } from '../types/leadFilters';

interface LeadFilterComponentProps {
    onFilter: (filters: LeadFilters) => void;
    onSearchLocal: (searchText: string) => void;
}

// Приклад опцій статусу для react-select
const statusOptions = [
    { value: '', label: 'Всі' },
    { value: 'new', label: 'new' },
    { value: 'no answer', label: 'no answer' },
    { value: 'newer answer', label: 'newer answer' },
    { value: 'slip away', label: 'slip away' },
    { value: 'not interested', label: 'not interested' },
    { value: 'no pot', label: 'no pot' },
    { value: 'callback', label: 'callback' },
    { value: 'reassign', label: 'reassign' },
    { value: 'active', label: 'active' },
    { value: 'depositor', label: 'depositor' },
    { value: 'initial call', label: 'initial call' },
    { value: 'wrong info', label: 'wrong info' },
    { value: 'invalid language', label: 'invalid language' },
    { value: 'wrong number', label: 'wrong number' },
];

// Опції для сортування
const sortFieldOptions = [
    { value: 'createdAt', label: 'Дата створення' },
    { value: 'lastComment', label: 'Дата останнього коментаря' },
];

const sortOrderOptions = [
    { value: 'ASC', label: 'За зростанням' },
    { value: 'DESC', label: 'За спаданням' },
];

const LeadFilterComponent: React.FC<LeadFilterComponentProps> = ({ onFilter, onSearchLocal }) => {
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

    // Дані з Redux
    const role = useAppSelector((state) => state.auth.role) as Role;
    const users = useAppSelector((state) => state.users.users);
    const countries = useAppSelector((state) => state.leads.countries);
    const languages = useAppSelector((state) => state.leads.languages);

    // Клік "Фільтрувати"
    const handleApplyFilters = () => {
        const appliedFilters: LeadFilters = {};

        if (status) {
            appliedFilters.status = status;
        }
        if (startDate && endDate) {
            appliedFilters.dateRange = [
                startDate.toISOString(),
                endDate.toISOString(),
            ];
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

    // Клік "Скинути"
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

    // Пошук (email/phone)
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        onSearchLocal(e.target.value);
    };

    // React-select з опціями для статусу
    const statusValue = statusOptions.find((opt) => opt.value === status) || statusOptions[0];
    const handleStatusChange = (selected: any) => {
        setStatus(selected?.value || '');
    };

    // React-select для sortBy
    const sortByValue = sortFieldOptions.find((opt) => opt.value === sortBy) || sortFieldOptions[1];
    const handleSortByChange = (selected: any) => {
        setSortBy(selected?.value || 'lastComment');
    };

    // React-select для sortOrder
    const sortOrderValue = sortOrderOptions.find((opt) => opt.value === sortOrder) || sortOrderOptions[1];
    const handleSortOrderChange = (selected: any) => {
        setSortOrder(selected?.value || 'DESC');
    };

    // Список менеджерів у форматі для react-select
    const managerOptions = users
        ? [{ value: '', label: 'Всі' }, ...users.map((u) => ({
            value: u.id,
            label: `${u.userName} (${u.email})`,
        }))]
        : [{ value: '', label: 'Немає доступних менеджерів' }];

    const managerValue = managerOptions.find((opt) => opt.value === managerId) || managerOptions[0];

    // Список країн
    const countryOptions = [
        { value: '', label: 'Всі' },
        ...countries.map((c) => ({ value: c, label: c })),
    ];
    const countryValue = countryOptions.find((opt) => opt.value === country) || countryOptions[0];

    // Список мов
    const languageOptions = [
        { value: '', label: 'Всі' },
        ...languages.map((l) => ({ value: l, label: l })),
    ];
    const languageValue = languageOptions.find((opt) => opt.value === language) || languageOptions[0];

    return (
        <div className="bg-white rounded-lg shadow p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Статус */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
                <Select
                    classNamePrefix="react-select"
                    value={statusValue}
                    onChange={handleStatusChange}
                    options={statusOptions}
                />
            </div>

            {/* Діапазон дат */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата від</label>
                <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Початок"
                    className="input w-full"
                    dateFormat="dd.MM.yyyy"
                    isClearable
                    calendarClassName="rounded-lg shadow border p-2"
                    popperClassName="react-datepicker-popper"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата до</label>
                <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="Кінець"
                    className="input w-full"
                    dateFormat="dd.MM.yyyy"
                    isClearable
                    calendarClassName="rounded-lg shadow border p-2"
                    popperClassName="react-datepicker-popper"
                    minDate={startDate || undefined}
                />
            </div>

            {/* Менеджер (тільки якщо роль head/shift/teamLead) */}
            {['head', 'shift', 'teamLead'].includes(role) && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Менеджер</label>
                    <Select
                        classNamePrefix="react-select"
                        value={managerValue}
                        onChange={(selected: any) =>
                            setManagerId(selected?.value ? Number(selected.value) : undefined)
                        }
                        options={managerOptions}
                    />
                </div>
            )}

            {/* Країна */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Країна</label>
                <Select
                    classNamePrefix="react-select"
                    value={countryValue}
                    onChange={(selected: any) => setCountry(selected?.value || '')}
                    options={countryOptions}
                />
            </div>

            {/* Мова */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Мова</label>
                <Select
                    classNamePrefix="react-select"
                    value={languageValue}
                    onChange={(selected: any) => setLanguage(selected?.value || '')}
                    options={languageOptions}
                />
            </div>

            {/* Пошук */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Пошук (email/тел.)</label>
                <input
                    type="text"
                    className="input w-full"
                    placeholder="Email або телефон..."
                    value={searchText}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Сортування (sortBy і sortOrder) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Сортувати за</label>
                <Select
                    classNamePrefix="react-select"
                    value={sortByValue}
                    onChange={handleSortByChange}
                    options={sortFieldOptions}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Напрямок</label>
                <Select
                    classNamePrefix="react-select"
                    value={sortOrderValue}
                    onChange={handleSortOrderChange}
                    options={sortOrderOptions}
                />
            </div>

            {/* Кнопки "Фільтрувати" і "Скинути" */}
            <div className="md:col-span-2 lg:col-span-3 flex justify-end space-x-4">
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

export default LeadFilterComponent;

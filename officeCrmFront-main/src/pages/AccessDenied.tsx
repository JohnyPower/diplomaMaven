// src/pages/AccessDenied.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-500 mb-4">Доступ заборонено</h1>
            <p className="text-lg mb-6">Ви не маєте доступу до цієї сторінки.</p>
            <Link to="/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                Повернутися до Дашборду
            </Link>
        </div>
    );
};

export default AccessDenied;

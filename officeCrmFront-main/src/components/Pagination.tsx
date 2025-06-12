import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages === 0) return null;

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const pageCountToShow = 3; // Кількість сторінок по центру
        const startPage = Math.max(2, currentPage - 1);
        const endPage = Math.min(totalPages - 1, currentPage + 1);

        pages.push(1); // Перша сторінка

        // Додаємо "..." якщо startPage > 2
        if (startPage > 2) {
            pages.push('...');
        }

        // Додаємо сторінки між першою і останньою
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        // Додаємо "..." якщо endPage < totalPages - 1
        if (endPage < totalPages - 1) {
            pages.push('...');
        }

        if (totalPages > 1) {
            pages.push(totalPages); // Остання сторінка
        }

        return pages;
    };

    return (
        <div className="flex justify-center mt-4">
            <nav className="inline-flex -space-x-px">
                {/* Кнопка "Попередня" */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 border ${
                        currentPage === 1
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'
                    }`}
                >
                    Попередня
                </button>

                {/* Кнопки номерів сторінок */}
                {getPageNumbers().map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' && onPageChange(page)}
                        disabled={typeof page !== 'number'}
                        className={`px-3 py-2 border ${
                            page === currentPage
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'
                        }`}
                    >
                        {page}
                    </button>
                ))}

                {/* Кнопка "Наступна" */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 border ${
                        currentPage === totalPages
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:bg-blue-500 hover:text-white'
                    }`}
                >
                    Наступна
                </button>
            </nav>
        </div>
    );
};

export default Pagination;

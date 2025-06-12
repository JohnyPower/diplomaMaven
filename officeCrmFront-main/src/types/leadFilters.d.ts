// src/types/leadFilters.d.ts

export interface LeadFilters {
    status?: string;
    dateRange?: string[]; // [startDate, endDate]
    page?: number;
    limit?: number;
    managerId?: number;   // Додано для фільтру по менеджеру
    country?: string;     // Додано для фільтру по країні
    language?: string;    // Додано для фільтру по мові

    // <<< NEW:
    sortBy?: string;      // Напр. 'lastComment'
    sortOrder?: string;   // Напр. 'ASC' | 'DESC'
}

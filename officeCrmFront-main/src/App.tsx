// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import DashboardLayout from './layouts/DashboardLayout';
import Statistics from './pages/Statistics';
import Leads from './pages/Leads';
import Groups from './pages/Groups';
import Users from './pages/Users';
import Affiliates from './pages/Affiliate';
import PrivateRoute from './components/PrivateRoute';
import AccessDenied from './pages/AccessDenied';
import LeadDetails from './pages/LeadDetails'; // Імпортуємо нову сторінку

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                    path="/*"
                    element={
                        <PrivateRoute>
                            <DashboardLayout />
                        </PrivateRoute>
                    }
                >
                    <Route path="dashboard" element={<Statistics />} />

                    <Route
                        path="leads"
                        element={
                            <PrivateRoute requiredPermissions={['VIEW_LEAD']}>
                                <Leads />
                            </PrivateRoute>
                        }
                    />
                    {/* Додамо маршрут для деталей ліда */}
                    <Route
                        path="leads/:id"
                        element={
                            <PrivateRoute requiredPermissions={['VIEW_LEAD']}>
                                <LeadDetails />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="groups"
                        element={
                            <PrivateRoute requiredPermissions={['VIEW_GROUP']}>
                                <Groups />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="users"
                        element={
                            <PrivateRoute requiredPermissions={['VIEW_USER']}>
                                <Users />
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="affiliate"
                        element={
                            <PrivateRoute requiredPermissions={['VIEW_AFFILIATE']}>
                                <Affiliates />
                            </PrivateRoute>
                        }
                    />

                    <Route path="access-denied" element={<AccessDenied />} />
                    <Route path="*" element={<Navigate to="/dashboard" />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;

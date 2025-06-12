// src/pages/Login.tsx
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { loginUser } from '../slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { decodeToken, DecodedToken } from '../utils/jwtUtils';

const Login = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { loading, error, email, role } = useAppSelector((state) => state.auth);

    const [emailInput, setEmailInput] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (email && role) {
            // Перенаправлення залежно від ролі, якщо потрібно
            navigate('/dashboard');
        }
    }, [email, role, navigate]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        dispatch(loginUser({ email: emailInput, password }));
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Увійти до CRM</h2>
                {error && (
                    <div className="mb-4 text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Введіть ваш email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-2">
                            Пароль
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Введіть ваш пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200 ${
                            loading ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Вхід...' : 'Увійти'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

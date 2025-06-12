// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UserData {
    email: string;
}

const Dashboard = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const email = localStorage.getItem('email');

        if (!accessToken || !email) {
            // Якщо немає токена або email, перенаправляємо на логін
            navigate('/login');
        } else {
            setUserData({ email });
        }
    }, [navigate]);

    if (!userData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard">
            <h2>Welcome</h2>
            <p>Email: {userData.email}</p>
            {/* Додайте інші елементи дашборду тут */}
        </div>
    );
};

export default Dashboard;

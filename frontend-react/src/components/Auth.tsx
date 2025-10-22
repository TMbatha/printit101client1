import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import AdminDashboard from './AdminDashboard';
import { useAuth } from '../context/AuthContext';

interface AuthProps {
    onAuthSuccess: (user: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const { user, setCurrentUser, logout } = useAuth();

    const handleSwitchToRegister = () => {
        setIsLoginMode(false);
    };

    const handleSwitchToLogin = () => {
        setIsLoginMode(true);
    };

    const handleAuthSuccess = (user: any) => {
        console.log('Auth: handleAuthSuccess called with user:', user);
        // setCurrentUser already handles both user and login state
        setCurrentUser(user);
        onAuthSuccess(user);
    };

    const handleLogout = () => {
        console.log('Auth: Logging out user');
        logout(); // Clear from context as well
        window.location.href = '/'; // Redirect to home
    };

    // For logged in users, let App.tsx routing handle the navigation
    // Auth component should only handle the login/register flow
    if (user) {
        return null; // Let App.tsx routing take over
    }

    // Show login/register forms
    return (
        <>
            {isLoginMode ? (
                <Login
                    onLoginSuccess={handleAuthSuccess}
                    onSwitchToRegister={handleSwitchToRegister}
                />
            ) : (
                <Register
                    onRegisterSuccess={handleAuthSuccess}
                    onSwitchToLogin={handleSwitchToLogin}
                />
            )}
        </>
    );
};

export default Auth;
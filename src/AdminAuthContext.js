import { createContext, useContext, useState } from 'react';
import { verifyAdmin } from './api';

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
    const [credentials, setCredentials] = useState(null);

    const login = async (username, password) => {
        const adminCredentials = { username, password };
        await verifyAdmin(adminCredentials);
        setCredentials(adminCredentials);
    };

    const logout = () => setCredentials(null);

    return (
        <AdminAuthContext.Provider value={{ credentials, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const context = useContext(AdminAuthContext);
    if (!context) {
        throw new Error('useAdminAuth must be used inside AdminAuthProvider');
    }
    return context;
}
import React from 'react';
import Header from '../components/common/Header';
import { useTheme } from '../hooks/useTheme';

const MainLayout = ({ children }) => {
    const { theme } = useTheme();

    return (
        <div className={`min-h-screen bg-${theme}-background text-${theme}-text`}>
            <Header />
            <main className="p-4">
                {children}
            </main>
        </div>
    );
};

export default MainLayout;
import { useEffect, useState } from 'react';

const useTheme = () => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(() => {
        document.documentElement.className = theme;
    }, [theme]);

    return { theme, toggleTheme };
};

export default useTheme;
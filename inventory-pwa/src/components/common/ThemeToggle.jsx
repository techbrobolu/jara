// Sure, here's the contents for the file /inventory-pwa/inventory-pwa/src/components/common/ThemeToggle.jsx:

import React from 'react';
import useTheme from '../../hooks/useTheme';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded focus:outline-none"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <span role="img" aria-label="Light mode">🌞</span>
            ) : (
                <span role="img" aria-label="Dark mode">🌜</span>
            )}
        </button>
    );
};

export default ThemeToggle;
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const saved = localStorage.getItem('skillswap-theme');
    if (saved) return saved;
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('skillswap-theme', theme);
    
    // Apply theme to document
    const root = document.documentElement;
    if (theme === 'dark') {
      root.style.colorScheme = 'dark';
      document.body.style.backgroundColor = '#08080f';
      document.body.style.color = '#f0f0fa';
    } else {
      root.style.colorScheme = 'light';
      document.body.style.backgroundColor = '#f8f9fa';
      document.body.style.color = '#1a1a2e';
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

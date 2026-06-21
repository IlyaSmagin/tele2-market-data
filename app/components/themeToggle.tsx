'use client';
import { useState, useEffect } from 'react';
import Button from './button';

interface ThemeToggleProps {
  variant?: 'text' | 'icon';
}

const ThemeToggle = ({ variant = 'text' }: ThemeToggleProps) => {
  const [darkTheme, setDarkTheme] = useState(true);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setDarkTheme(true);
    } else {
      setDarkTheme(false);
    }
  }, []);

  useEffect(() => {
    if (darkTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkTheme]);

  if (variant === 'icon') {
    return (
      <Button 
        onClick={() => setDarkTheme((prev) => !prev)}
        className="px-2 py-2 h-10 w-10 flex items-center justify-center"
        aria-label="Toggle theme"
      >
        {darkTheme ? '🌙' : '☀️'}
      </Button>
    );
  }

  return (
    <Button onClick={() => setDarkTheme((prev) => !prev)}>
      Toggle Theme
    </Button>
  );
};

export default ThemeToggle;

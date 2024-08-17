'use client';
import { useState, useEffect } from 'react';
import Button from './button';

const ThemeToggle = () => {
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

  return (
    <Button onClick={() => setDarkTheme((prev) => !prev)} >
      Toggle Theme
    </Button>

  );
};

export default ThemeToggle;

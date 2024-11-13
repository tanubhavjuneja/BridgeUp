import { useState, useEffect } from 'react';
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);
  const login = async (username, password) => {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (data.message === 'Login successful') {
      localStorage.setItem('token', data.token);
      setIsAuthenticated(true);
    } else {
      throw new Error('Invalid login credentials');
    }
  };
  const register = async (name, organization, mobile, email, username, password) => {
    const response = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, organization, mobile, email, username, password }),
    });
    const data = await response.json();
    if (data.message === 'User registered successfully') {
    } else {
      throw new Error('Registration failed');
    }
  };
  const logout = async () => {
    const response = await fetch('/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const data = await response.json();
    if (data.message === 'Logged out successfully') {
      localStorage.removeItem('token');
      setIsAuthenticated(false);
    } else {
      throw new Error('Logout failed');
    }
  };
  return { isAuthenticated, login, register, logout };
};
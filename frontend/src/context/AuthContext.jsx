import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    if (token) {
      // Set axios to include token on all requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // Optionally, fetch user info using /api/me
      axios.get('/api/me')
        .then(response => setUser(response.data.user))
        .catch(error => {
          console.error('Failed to fetch user', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        });
    }
  }, [token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

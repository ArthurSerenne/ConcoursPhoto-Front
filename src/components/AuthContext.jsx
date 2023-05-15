import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from './AxiosInstance';
const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const storedUser = localStorage.getItem('user');

    if (jwt && storedUser) {
      setIsAuthenticated(true);
      if (storedUser !== 'undefined') {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
  };

  const reloadUser = async () => {
    try {
      const response = await axiosInstance.get(`${process.env.REACT_APP_API_URL}/user_data`);
      if (response.status === 200) {
        const updatedUser = response.data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        console.error("Erreur lors de la récupération des données utilisateur");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
    }
  };

  return (
  <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, reloadUser }}>
    {children}
  </AuthContext.Provider>
);
};

export default AuthContext;

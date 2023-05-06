import { createContext, useContext, useState, useEffect } from 'react';
<<<<<<< HEAD
import axiosInstance from './AxiosInstance';
=======
>>>>>>> 6b9b2da (test)

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
<<<<<<< HEAD
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    const storedUser = localStorage.getItem('user');

    if (jwt && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
    } else {
      setIsLoading(false);
=======
  
  useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      setIsAuthenticated(true);
>>>>>>> 6b9b2da (test)
    }
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
<<<<<<< HEAD
    localStorage.setItem('user', JSON.stringify(userData));
=======
>>>>>>> 6b9b2da (test)
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
<<<<<<< HEAD
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
=======
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
<<<<<<< HEAD
<<<<<<< HEAD
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout }}>
>>>>>>> d68c59c (test)
=======
    <AuthContext.Provider value={{ isAuthenticated, user, isLoading, login, logout, reloadUser }}>
>>>>>>> 6d3aba9 (profil page and file upload)
=======
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
>>>>>>> 6b9b2da (test)
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './components/AuthContext';
import ViewContest from './pages/ViewContest';
import ListContest from './pages/ListContest';
import Register from './pages/Register';
import Home from './pages/Home';
import Profil from './pages/Profil';
import './sass/components/select.scss';

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concours-photo" element={<ListContest />} />
          <Route path="/concours-photo/:id" element={<ViewContest />} />
            <Route path="/register" element={<Register />} />
          <Route path="mon-compte" element={<Profil />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;

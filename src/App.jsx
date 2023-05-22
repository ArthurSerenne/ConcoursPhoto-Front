import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './components/AuthContext';
import ViewContest from './pages/ViewContest';
import ViewOrganization from './pages/ViewOrganization';
import ListContest from './pages/ListContest';
import Home from './pages/Home';
import Profil from './pages/Profil';
import './sass/components/select.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ListOrganization from './pages/ListOrganization';

const App = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/concours-photo" element={<ListContest />} />
          <Route path="/concours-photo/:id" element={<ViewContest />} />
          <Route path="/organisateurs" element={<ListOrganization />} />
          <Route path="/organisateur/:id" element={<ViewOrganization />} />
          <Route path="mon-compte" element={<Profil />} />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
};

export default App;

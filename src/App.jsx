import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contest from "./pages/Contest";
import Home from "./pages/Home"

const App = () => {
    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contest" element={<Contest />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;

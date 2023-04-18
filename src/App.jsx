import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ViewContest from "./pages/ViewContest";
import ListContest from "./pages/ListContest";
import Home from "./pages/Home";

const App = () => {
    return (
        <div className="App">
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/contest" element={<ListContest />} />
                <Route path="/contest/:id" element={<ViewContest />} />
            </Routes>
            <Footer />
        </div>
    );
};

export default App;

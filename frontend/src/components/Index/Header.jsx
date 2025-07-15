
import React from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="p-4 bg-gray-100 shadow mb-4">
        <nav className="flex gap-4">
            <Link to="/">Home</Link>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/chat">Chat Assistant</Link>
        </nav>
        </header>
    );
};

export default Header;
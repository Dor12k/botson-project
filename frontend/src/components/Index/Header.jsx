import React from 'react';
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Chat Assistant', path: '/chat' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-blue-600">Botson.ai</h1>

        <nav className="flex gap-6">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-gray-700 hover:text-blue-600 transition font-medium ${
                location.pathname === link.path ? 'border-b-2 border-blue-600 pb-1' : ''
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;

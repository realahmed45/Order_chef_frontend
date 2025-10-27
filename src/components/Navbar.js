import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-800">OrderChef</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-orange-500">
              Home
            </Link>
            <Link
              to="/#features"
              className="text-gray-600 hover:text-orange-500"
            >
              Features
            </Link>
            <Link to="/#about" className="text-gray-600 hover:text-orange-500">
              About
            </Link>
            <Link to="/#faq" className="text-gray-600 hover:text-orange-500">
              FAQ
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Welcome, {user.name}</span>
                <Link
                  to="/dashboard"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="text-gray-600 hover:text-orange-500"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-orange-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              to="/"
              className="block py-2 text-gray-600 hover:text-orange-500"
            >
              Home
            </Link>
            <Link
              to="/#features"
              className="block py-2 text-gray-600 hover:text-orange-500"
            >
              Features
            </Link>
            <Link
              to="/#about"
              className="block py-2 text-gray-600 hover:text-orange-500"
            >
              About
            </Link>
            <Link
              to="/#faq"
              className="block py-2 text-gray-600 hover:text-orange-500"
            >
              FAQ
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 text-gray-600 hover:text-orange-500"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="block py-2 text-gray-600 hover:text-orange-500 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 text-gray-600 hover:text-orange-500"
                >
                  Login
                </Link>
                <Link to="/register" className="block py-2 text-orange-500">
                  Get Started
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

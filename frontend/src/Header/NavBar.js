import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../common/context/auth-context";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const auth = useContext(AuthContext);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "Profile", to: "/profile" },
    { name: "Terms", to: "/terms" },
  ];

  const handleLogout = () => {
    auth.logout(); // Clears context/session
    navigate("/signin"); // Redirect to signin
  };

  // Function to render navigation links
  const renderLinks = (additionalClasses = "") => {
    return navLinks.map((link) => {
      const isActive = location.pathname === link.to;
      return (
        <Link
          key={link.name}
          to={link.to}
          className={`px-3 py-2 rounded-md text-base font-medium ${additionalClasses} ${
            isActive
              ? "bg-gray-900 text-white"
              : "text-gray-300 hover:text-white hover:bg-gray-700"
          }`}
        >
          {link.name}
        </Link>
      );
    });
  };

  // Function to render profile or login link
  const renderProfile = (additionalClasses = "") => {
    return auth.isLoggedIn ? (
      <div
        onClick={handleLogout}
        className={`flex items-center px-3 py-2 rounded-md text-base font-medium cursor-pointer ${additionalClasses} text-gray-300 hover:text-white hover:bg-gray-700`}
      >
        <img
          className="h-6 w-6 rounded-full mr-2"
          src={`https://ui-avatars.com/api/?name=${auth.userInfo.name}&size=40`}
          alt="Logout"
        />
        <span>Logout</span>
      </div>
    ) : (
      <Link
        to="/signin"
        className={`flex items-center px-3 py-2 rounded-md text-base font-medium cursor-pointer ${additionalClasses} text-gray-300 hover:text-white hover:bg-gray-700`}
      >
        <img
          className="h-6 w-6 rounded-full mr-2"
          src="https://ui-avatars.com/api/?name=User&size=40"
          alt="Sign In"
        />
        <span>Sign-in</span>
      </Link>
    );
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section: Logo and Links */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/">
                <img className="h-8 w-8" src="./logo.png" alt="Logo" />
              </Link>
            </div>

            {/* Navigation Links (Desktop View) */}
            <div className="hidden md:flex space-x-6">{renderLinks()}</div>
          </div>

          {/* Profile Section (Desktop View) */}
          <div className="hidden md:flex items-center">{renderProfile()}</div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden bg-gray-800 w-full px-2 pt-2 pb-3 space-y-1 absolute left-0 top-16 z-10">
            {renderLinks("block")}
            {renderProfile("block")}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;

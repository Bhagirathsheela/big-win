import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../common/context/auth-context";
import {
  FaHome, FaUserAlt, FaFileContract,
  FaSignOutAlt, FaSignInAlt, FaBars, FaTimes, FaInfoCircle,
  FaArrowRight,
} from "react-icons/fa";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const auth = useContext(AuthContext);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // close drawer on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const navLinks = [
    { name: "Home",    to: "/",        icon: <FaHome />,         tone: "from-purple-500 to-pink-500"  },
    { name: "Profile", to: "/profile", icon: <FaUserAlt />,      tone: "from-orange-400 to-pink-500"  },
    { name: "About",   to: "/about",   icon: <FaInfoCircle />,   tone: "from-sky-400 to-purple-500"   },
    { name: "Terms",   to: "/terms",   icon: <FaFileContract />, tone: "from-amber-400 to-pink-500"   },
  ];

  const handleLogout = () => {
    auth.logout();
    setIsOpen(false);
    navigate("/signin");
  };

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const DesktopLink = ({ link }) => {
    const active = isActive(link.to);
    return (
      <Link
        to={link.to}
        className={`relative px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
          active
            ? "text-white bg-brand-gradient shadow-popPink"
            : "text-gray-700 hover:text-brand-purpleDeep hover:bg-purple-50"
        }`}
      >
        <span className="inline-flex items-center gap-2">
          <span>{link.icon}</span>
          {link.name}
        </span>
      </Link>
    );
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-soft" : "bg-white/75 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-brand-gradient grid place-items-center shadow-popPink group-hover:animate-wiggle">
                <span className="font-display font-bold text-white text-lg">B</span>
              </div>
              <div className="leading-tight">
                <div className="font-display font-bold text-lg sm:text-xl text-gradient">Big Win</div>
                <div className="text-[10px] text-gray-500 -mt-1 hidden sm:block tracking-wide">
                  feel the lucky vibe
                </div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.slice(0, 4).map((link) => (<DesktopLink key={link.name} link={link} />))}
            </div>

            <div className="hidden md:flex items-center">
              {auth.isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full bg-white border-2 border-purple-100 hover:border-brand-pink shadow-soft transition active:scale-95"
                >
                  <img
                    className="h-8 w-8 rounded-full ring-2 ring-brand-pink/40 object-cover"
                    src={`https://ui-avatars.com/api/?name=${auth.userInfo?.name || "U"}&background=9333EA&color=fff&bold=true`}
                    alt="avatar"
                  />
                  <span className="text-sm font-medium text-gray-700">Logout</span>
                  <FaSignOutAlt className="text-brand-pink" />
                </button>
              ) : (
                <Link
                  to="/signin"
                  className="flex items-center gap-2 px-5 py-2 rounded-full bg-brand-gradient text-white text-sm font-semibold shadow-popPink hover:-translate-y-0.5 transition active:scale-95"
                >
                  <FaSignInAlt /> Sign in
                </Link>
              )}
            </div>

            <button
              ref={buttonRef}
              onClick={() => setIsOpen((o) => !o)}
              className={`md:hidden inline-flex items-center justify-center w-11 h-11 rounded-2xl transition active:scale-95 shadow-soft ${
                isOpen
                  ? "bg-brand-gradient text-white shadow-popPink"
                  : "bg-white border-2 border-purple-100 text-brand-purpleDeep"
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-20 bg-purple-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Mobile drawer */}
      <div
        ref={menuRef}
        className={`md:hidden fixed inset-x-0 top-16 z-30 transition-all duration-300 origin-top ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
        }`}
      >
        <div className="mx-3 mt-2 rounded-3xl bg-white border border-purple-100 shadow-soft overflow-hidden">
          {/* drawer hero */}
          <div className="relative bg-brand-gradient text-white px-5 py-4 overflow-hidden">
            <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-white/15 blur-2xl" />
            <div className="relative flex items-center gap-3">
              {auth.isLoggedIn ? (
                <>
                  <img
                    className="h-11 w-11 rounded-2xl ring-2 ring-white/50 object-cover"
                    src={`https://ui-avatars.com/api/?name=${auth.userInfo?.name || "U"}&background=ffffff&color=9333EA&bold=true`}
                    alt="avatar"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] uppercase tracking-wider text-white/80">Welcome back</div>
                    <div className="font-display font-bold text-lg truncate">
                      {auth.userInfo?.name || "Player"}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="h-11 w-11 rounded-2xl bg-white/20 grid place-items-center backdrop-blur">
                    <FaSignInAlt className="text-white text-lg" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] uppercase tracking-wider text-white/80">Welcome to Big Win</div>
                    <div className="font-display font-bold text-lg">Sign in to play</div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* nav links */}
          <div className="p-3 space-y-1.5">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              return (
                <Link
                  key={link.name}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-2xl transition active:scale-[0.98] ${
                    active
                      ? "bg-purple-50 ring-2 ring-brand-purple/20"
                      : "hover:bg-purple-50/50"
                  }`}
                >
                  <span className={`w-10 h-10 rounded-xl grid place-items-center text-white shadow-soft bg-gradient-to-br ${link.tone}`}>
                    {link.icon}
                  </span>
                  <span className={`flex-1 font-semibold ${active ? "text-brand-purpleDeep" : "text-gray-700"}`}>
                    {link.name}
                  </span>
                  <FaArrowRight className={`text-sm ${active ? "text-brand-pink" : "text-gray-300"}`} />
                </Link>
              );
            })}
          </div>

          {/* drawer footer action */}
          <div className="px-3 pb-3 pt-1">
            {auth.isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-sunshine-gradient text-white font-semibold shadow-popOrange active:scale-95"
              >
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <Link
                to="/signin"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand-gradient text-white font-semibold shadow-popPink active:scale-95"
              >
                <FaSignInAlt /> Sign in / Sign up
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;

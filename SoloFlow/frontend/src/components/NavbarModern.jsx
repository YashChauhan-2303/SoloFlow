import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, Settings, Bell, Search, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';
import Button from './ui/Button';

const NavbarModern = () => {
  const navigate = useNavigate();
  const { user_id } = useParams();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const userMenuRef = useRef(null);
  const notificationRef = useRef(null);

  const navItems = [
    { label: 'Dashboard', path: `/${user_id}/dashboard`, icon: '📊' },
    { label: 'Clients', path: `/${user_id}/clients`, icon: '👥' },
    { label: 'Projects', path: `/${user_id}/projects`, icon: '📁' },
    { label: 'Invoices', path: `/${user_id}/invoice`, icon: '💳' },
    { label: 'Stats', path: `/${user_id}/stats`, icon: '📈' },
  ];

  const isActive = (path) => location.pathname === path;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleProfile = () => {
    navigate(`/${user_id}/profile`);
    setIsUserMenuOpen(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.15 } },
  };

  return (
    <motion.nav
      className="sticky top-0 z-50 glass bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate(`/${user_id}/dashboard`)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-lg font-bold text-slate-100 hidden sm:block">SoloFlow</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-2 rounded-lg transition-smooth relative font-medium text-sm
                  ${isActive(item.path)
                    ? 'text-purple-400'
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
                whileHover={{ x: 2 }}
              >
                {item.label}
                {isActive(item.path) && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                    layoutId="activeNav"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search Bar (hidden on mobile) */}
            <div className="hidden lg:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 group hover:border-purple-500/30 transition-smooth">
              <Search size={16} className="text-slate-500 group-hover:text-purple-400 transition-smooth" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="bg-transparent outline-none text-sm text-slate-300 placeholder-slate-600 w-32"
              />
            </div>

            {/* Notifications */}
            <motion.div
              ref={notificationRef}
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-lg hover:bg-slate-800 transition-smooth relative"
              >
                <Bell size={20} className="text-slate-400 hover:text-slate-200 transition-smooth" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
              <AnimatePresence>
                {isNotificationOpen && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-700">
                      <h3 className="font-semibold text-slate-100">Notifications</h3>
                    </div>
                    <div className="p-4 text-slate-400 text-sm">
                      <p>No new notifications</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* User Menu */}
            <motion.div
              ref={userMenuRef}
              className="relative"
              whileHover={{ scale: 1.05 }}
            >
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-smooth"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden"
                  >
                    <button
                      onClick={handleProfile}
                      className="w-full px-4 py-2.5 text-left text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors flex items-center gap-2 border-t border-slate-700"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-smooth"
              whileTap={{ scale: 0.95 }}
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-slate-300" />
              ) : (
                <Menu size={20} className="text-slate-300" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="md:hidden border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 rounded-lg transition-smooth text-left font-medium
                      ${isActive(item.path)
                        ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-400'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                      }
                    `}
                    whileHover={{ x: 4 }}
                  >
                    {item.icon} {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default NavbarModern;

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, BarChart3, Bell, User, Menu, X } from 'lucide-react'
import { NavLink, useParams } from 'react-router-dom'
import { useNotification } from '../contexts/NotificationContext'

const navItems = [
  { label: 'Dashboard', path: 'dashboard', icon: LayoutDashboard },
  { label: 'Clients', path: 'clients', icon: Users },
  { label: 'Statistics', path: 'statistics', icon: BarChart3 },
]

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user_id } = useParams()
  const notificationCtx = useNotification()
  const { toggleDrawer = () => {}, notifications = [] } = notificationCtx || {}

  return (
    <nav className="sticky top-0 z-50 h-16 w-full bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* ── Logo ── */}
        <NavLink to="/" className="flex items-center gap-2.5 group" aria-label="SoloFlow home">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 shadow-lg shadow-violet-500/20"
          >
            <span className="text-sm font-bold text-white select-none">S</span>
          </motion.div>
          <span className="hidden sm:block text-lg font-semibold text-slate-100 tracking-tight">
            SoloFlow
          </span>
        </NavLink>

        {/* ── Desktop Navigation ── */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={`/${user_id}/${path}`}
              className="relative"
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.04)' }}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150
                    ${isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-x-2 -bottom-[1px] h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>

        {/* ── Right Section ── */}
        <div className="flex items-center gap-1.5">
          {/* Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDrawer}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-white/[0.06] hover:text-slate-200"
            aria-label="Show notifications"
          >
            <Bell size={18} strokeWidth={1.8} />
            {notifications.length > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#0a0a0f]/80 animate-pulse" />
            )}
          </motion.button>

          {/* User Profile */}
          <NavLink
            to={`/${user_id}/userprofile`}
            aria-label="User profile"
          >
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-150
                  ${isActive
                    ? 'bg-gradient-to-br from-violet-500/20 to-indigo-500/20 text-violet-400 ring-1 ring-violet-500/30'
                    : 'text-slate-400 hover:bg-white/[0.06] hover:text-slate-200'
                  }`}
              >
                <User size={18} strokeWidth={1.8} />
              </motion.div>
            )}
          </NavLink>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-white/[0.06] hover:text-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="md:hidden overflow-hidden border-b border-white/[0.06] bg-[#0a0a0f]/95 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl space-y-1 px-4 pb-4 pt-2 sm:px-6">
              {navItems.map(({ label, path, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={`/${user_id}/${path}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {({ isActive }) => (
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150
                        ${isActive
                          ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-white ring-1 ring-inset ring-violet-500/20'
                          : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                        }`}
                    >
                      <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                      {label}
                    </motion.div>
                  )}
                </NavLink>
              ))}

              {/* Mobile Profile Link */}
              <NavLink
                to={`/${user_id}/userprofile`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {({ isActive }) => (
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150
                      ${isActive
                        ? 'bg-gradient-to-r from-violet-500/10 to-indigo-500/10 text-white ring-1 ring-inset ring-violet-500/20'
                        : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                      }`}
                  >
                    <User size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                    Profile
                  </motion.div>
                )}
              </NavLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
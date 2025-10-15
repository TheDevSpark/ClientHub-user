'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Briefcase, FileText, User, Menu, X, Moon, Sun, Bell, LogOut } from 'lucide-react'
import { useTheme } from '../ThemeContext'

export default function Navbar() {
  const { isDarkMode, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/case', label: 'My Cases', icon: Briefcase },
    { href: '/documents', label: 'Documents', icon: FileText },
    { href: '/profile', label: 'Profile', icon: User },
  ]

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <nav
        className={`${
          isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-gray-200'
        } text-sm border-b transition-colors px-1 sm:px-7 duration-200 fixed w-full z-50`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 ${
                  isDarkMode ? 'bg-[#6366f1]' : 'bg-indigo-600'
                } rounded-[20px] flex items-center justify-center`}
              >
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <span
                className={`text-[15px] font-[400] hidden sm:block ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                ClientHub
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-4 py-2 rounded-[15px] transition-colors ${
                      isActive
                        ? `${
                            isDarkMode
                              ? 'bg-[#6366f1] text-white'
                              : 'bg-indigo-600 text-white'
                          }`
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-[#6366f1]'
                        : 'text-gray-500 hover:bg-blue-50 hover:text-[#4f46e5]'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 transition-colors duration-200
                  ${
                    isDarkMode
                      ? 'text-white hover:bg-gray-800 hover:rounded-[15px]'
                      : 'text-gray-800 hover:bg-blue-50 hover:text-[#4f46e5] hover:rounded-[15px]'
                  }
                `}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Notifications */}
              <button
                className={`relative p-2 rounded-lg ${
                  isDarkMode
                    ? 'text-white hover:bg-gray-800'
                    : 'text-gray-800 hover:bg-blue-50 hover:text-[#4f46e5]'
                } transition-colors`}
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Avatar */}
              <div
                className={`lg:flex items-center gap-2 px-3 py-1 rounded-[15px] transition-colors duration-200
                  ${isDarkMode ? 'hover:bg-gray-800 text-white' : 'hover:bg-blue-50 hover:text-[#4f46e5]'}
                `}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold
                    ${isDarkMode ? 'bg-gray-800 text-[#4f46e5]' : 'bg-indigo-100 text-[#4f46e5]'}
                  `}
                >
                  SJ
                </div>
                <span className="hidden lg:inline text-sm font-medium">Sarah J.</span>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMenu}
                className={`lg:hidden p-2 rounded-lg ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-500'
                }`}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar - from right below navbar */}
        <div
          className={`lg:hidden fixed top-16 right-0 h-full w-64 border-l z-40
            ${isDarkMode ? 'bg-[#18181b] border-[#27272a]' : 'bg-white border-gray-200'}
            shadow-lg transform transition-transform duration-300 ease-in-out
            ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          `}
        >
          <div className="flex flex-col h-full p-4">
            {/* Menu Items */}
            <div className="flex flex-col gap-1 mb-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[15px] transition-colors ${
                      isActive
                        ? `${
                            isDarkMode
                              ? 'bg-[#6366f1] text-white'
                              : 'bg-indigo-600 text-white'
                          }`
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Logout */}
            <button
              className={`flex items-center gap-3 px-4 py-3 rounded-[15px] w-full mt-auto
                ${isDarkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-500 hover:bg-gray-100'}
                transition-colors`}
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}

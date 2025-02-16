"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn, user } = useUser()

  const navItems = [
    { name: "Product", href: "/products" },
    { name: "About", href: "/about" },
    { name: "Content", href: "/content" },
    { name: "Dashboard", href: "/dashboard" },
  ]

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-white">YourCompany</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">Hello, {user.firstName}</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <>
                <SignInButton>
                  <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Sign Up
                  </button>
                </SignUpButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isSignedIn ? (
              <div className="flex items-center px-5">
                <span className="text-sm text-gray-300">Hello, {user.firstName}</span>
                <UserButton afterSignOutUrl="/" />
              </div>
            ) : (
              <div className="flex flex-col space-y-3 px-5">
                <SignInButton>
                  <button className="text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="w-full text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar


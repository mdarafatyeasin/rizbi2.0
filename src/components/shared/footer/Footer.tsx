import type React from "react"
import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden text-gray-300 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-2xl font-bold text-white">
              RizbiHubs
            </Link>
            <p className="mt-2 text-sm text-gray-400">Middle Badda link Road Comilla para Dhaka</p>
            <p className="mt-2 text-sm text-gray-400">01877782648</p>
          </div>
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a
              href="https://www.facebook.com/share/1KwgGUAeYt/"
              aria-label="Facebook"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a
              href="https://x.com/MDYounusIs77086?t=qScDcmalUsSLHm87eUNzfQ&s=09"
              aria-label="Twitter"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
          </div>
          <div className="flex items-center">
            <input
              type="email"
              placeholder="Subscribe to our newsletter"
              className="py-2 px-4 rounded-l-full bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="bg-blue-600 text-white rounded-r-full p-2 hover:bg-blue-700 transition-colors">
              <Mail className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">&copy; 2023 ShopNest. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">
              Terms
            </Link>
            <Link href="/contact" className="text-sm text-gray-400 hover:text-white hover:underline transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


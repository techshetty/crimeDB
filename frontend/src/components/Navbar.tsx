'use client'
import Link from 'next/link'

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <Link 
            href="/" 
            className="text-xl font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            CrimeDB-V1.0
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
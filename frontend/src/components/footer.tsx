'use client'
import { Shield } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-lg font-semibold text-blue-600">CrimeDB</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2 text-sm text-gray-500">
              <p>© {currentYear} CrimeDB. All rights reserved.</p>
              <p>Built by Pratheek and Manvith</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
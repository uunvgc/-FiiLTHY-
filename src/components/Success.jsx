import { useEffect } from 'react'
import { Crown, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Success() {
  return (
    <div className="min-h-screen bg-fiilthy-black flex items-center justify-center">
      <div className="text-center animate-glow">
        <div className="text-8xl mb-6">👑</div>
        <h1 className="text-5xl font-black text-fiilthy-gold mb-4">
          WELCOME TO THE EMPIRE
        </h1>
        <p className="text-gray-400 text-xl mb-8">
          Your crown has been secured.
        </p>
        <div className="flex items-center justify-center gap-2 text-green-400 mb-8">
          <CheckCircle className="w-6 h-6" />
          <span>Payment successful • Check your email</span>
        </div>
        <Link
          to="/dashboard"
          className="btn-gold inline-block"
        >
          Enter Your Empire
        </Link>
      </div>
    </div>
  )
}

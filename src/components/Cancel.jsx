import { Crown, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Cancel() {
  return (
    <div className="min-h-screen bg-fiilthy-black flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl mb-6 opacity-50">👑</div>
        <h1 className="text-5xl font-black text-white mb-4">
          The Crown Awaits
        </h1>
        <p className="text-gray-400 text-xl mb-8">
          When you're ready to build your empire,<br />
          we'll be here.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-fiilthy-gold hover:text-white transition-colors text-lg"
        >
          <ArrowLeft className="w-5 h-5" />
          Return to FIILTHY
        </Link>
      </div>
    </div>
  )
}

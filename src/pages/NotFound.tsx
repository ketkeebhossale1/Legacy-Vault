import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import AnimatedBlobs from '../components/AnimatedBlobs'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <AnimatedBlobs subtle />
      <div className="relative z-10 text-center max-w-md fade-in-up">
        <p
          className="text-7xl font-bold mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            background: 'linear-gradient(135deg, #1a8f8f, #2aacac)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </p>
        <h1 className="text-2xl font-semibold text-slate-800 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
          Page not found
        </h1>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          This vault path doesn&apos;t exist. It may have been moved, or the link is incorrect.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/home">
            <Button><Home size={15} /> Go Home</Button>
          </Link>
          <Link to="/my-legacy">
            <Button variant="secondary"><ArrowLeft size={15} /> My Legacy</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

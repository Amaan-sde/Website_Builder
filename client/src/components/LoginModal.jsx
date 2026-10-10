import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import axios from "axios"
import { serverUrl } from '../App'
function LoginModal({ open, onClose }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }
    if (open) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  if (!open) return null

  const handleGoogleAuth = async () => {
    try {
      setLoading(true)
      const result = await signInWithPopup(auth, provider)
      const { data } = await axios.post(
        `${serverUrl}/api/auth/google`,
        {
          name: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL
        },
        { withCredentials: true }
      )
      console.log('Login successful:', data)
      setMessage('Logged in successfully!')
      setTimeout(() => {
        onClose?.()
      }, 1000)
    } catch (err) {
      console.error('Google Auth Error:', err)
      if (err.code === 'auth/popup-closed-by-user') {
        return // User closed popup without signing in
      }
      setMessage(err.response?.data?.message || err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setMessage('Please use Google Sign-In to continue.')
  }

  return (
    <AnimatePresence>
      <motion.div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className='relative w-full max-w-md rounded-2xl bg-[#0d0d0f] border border-white/10 p-8 shadow-2xl shadow-purple-900/20 text-white'
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >

          <button
            onClick={onClose}
            aria-label='Close modal'
            className='absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              strokeWidth={2}
              viewBox='0 0 24 24'
            >
              <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
            </svg>
          </button>


          <div className='text-center mb-6'>
            <div className='inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3'>
              GenWeb.ai
            </div>
            <h2 className='text-2xl font-bold tracking-tight'>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className='text-sm text-zinc-400 mt-1'>
              {isSignUp
                ? 'Start building AI-powered websites in minutes'
                : 'Sign in to access your AI generated websites'}
            </p>
          </div>


          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm text-center ${message.includes('success')
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}
            >
              {message}
            </div>
          )}


          <button
            type='button'
            onClick={handleGoogleAuth}
            disabled={loading}
            className='w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer'
          >
            <svg className='w-4 h-4' viewBox='0 0 24 24'>
              <path
                fill='#4285F4'
                d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
              />
              <path
                fill='#34A853'
                d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
              />
              <path
                fill='#FBBC05'
                d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z'
              />
              <path
                fill='#EA4335'
                d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z'
              />
            </svg>
            Continue with Google
          </button>

          <div className='flex items-center my-5'>
            <div className='flex-1 border-t border-white/10'></div>
            <span className='px-3 text-xs text-zinc-500 uppercase tracking-wider'>or</span>
            <div className='flex-1 border-t border-white/10'></div>
          </div>


          <form onSubmit={handleSubmit} className='space-y-4'>
            {isSignUp && (
              <div>
                <label className='block text-xs font-medium text-zinc-400 mb-1.5'>Full Name</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='John Doe'
                  className='w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-zinc-500'
                />
              </div>
            )}

            <div>
              <label className='block text-xs font-medium text-zinc-400 mb-1.5'>Email Address</label>
              <input
                type='email'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='you@example.com'
                className='w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-zinc-500'
              />
            </div>

            <div>
              <label className='block text-xs font-medium text-zinc-400 mb-1.5'>Password</label>
              <input
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='••••••••'
                className='w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-white placeholder-zinc-500'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-medium text-sm transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer mt-2'
            >
              {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Toggle between Sign In / Sign Up */}
          <div className='mt-6 text-center text-xs text-zinc-400'>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type='button'
              onClick={() => {
                setIsSignUp(!isSignUp)
                setMessage('')
              }}
              className='text-blue-400 hover:text-blue-300 font-medium ml-1 cursor-pointer transition-colors'
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default LoginModal
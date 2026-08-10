'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, ArrowRight } from 'lucide-react'
import emailjs from '@emailjs/browser'
import * as THREE from 'three'

// Web3Forms Configuration
const WEB3FORMS_URL = 'https://api.web3forms.com/submit'
const ACCESS_KEY = '3b227acb-f76a-4120-8568-797ad9dd59b5'

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')

    try {
      // 1. Submit to Web3Forms
      const res = await fetch(WEB3FORMS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          email: email,
          subject: 'New Waitlist Signup for Primescore Dashboard',
          from_name: 'Primescore Waitlist',
        }),
      })

      if (res.status === 200) {
        // Send Premium Welcome Email via EmailJS (Waitlist specific account)
        try {
          await emailjs.send(
            'service_z29eucm',
            'template_7fkqtv5',
            {
              from_email: email,
              to_email: email, // Keeping just in case
            },
            '4OCw45XN2GQNAs8uy'
          )
        } catch (emailError) {
          console.error('EmailJS Error:', emailError)
        }

        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch (err) {
      console.error('Submit Error:', err)
      setStatus('error')
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center bg-white px-4 sm:px-6 relative overflow-hidden selection:bg-brandNavy/10">
      
      {/* Ultra-Premium Background Effects (Safe & Intense 3D Blue-Green Flares) */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.04] pointer-events-none" />
      <div className="absolute top-0 w-full h-[600px] bg-gradient-to-b from-brandNavy/[0.06] to-transparent pointer-events-none" />
      
      {/* Intense Safe 3D Blue & Green Light Flares */}
      <div className="absolute top-[10%] left-[15%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-gradient-to-br from-brandBlue/25 to-cyan-500/10 rounded-full filter blur-[130px] pointer-events-none animate-pulse opacity-90" style={{ animationDuration: '6s' }} />
      <div className="absolute bottom-[10%] right-[15%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-gradient-to-tr from-[#10b981]/25 to-emerald-400/10 rounded-full filter blur-[130px] pointer-events-none animate-pulse opacity-90" style={{ animationDuration: '9s' }} />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-brandNavy/[0.04] blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-3xl w-full text-center relative z-10"
      >


        <h1 className="text-5xl sm:text-[80px] font-medium tracking-tight text-brandNavy mb-8 leading-[1.05]">
          The new standard in <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-brandNavy to-brandNavy/60">credit resolution.</span>
        </h1>

        <p className="text-lg sm:text-xl text-textSecondary mb-14 max-w-2xl mx-auto font-light leading-relaxed">
          We are launching the entirely rebuilt Primescore Dashboard. 
          Join the exclusive waitlist today to secure a <strong className="text-brandNavy font-semibold">40% discount on your first payment</strong>.
        </p>

        {/* Premium "Launching soon..." typing animation */}
        <div className="flex justify-center items-baseline mb-16 text-3xl sm:text-5xl font-light text-brandNavy tracking-tight select-none">
          <span>Launching soon</span>
          <span className="inline-flex w-12 text-left ml-1">
            <motion.span
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.2, 0.8, 1] }}
            >.</motion.span>
            <motion.span
              animate={{ opacity: [0, 0, 1, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.2, 0.4, 0.8, 1] }}
            >.</motion.span>
            <motion.span
              animate={{ opacity: [0, 0, 0, 1, 1, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, times: [0, 0.2, 0.4, 0.6, 0.8, 1] }}
            >.</motion.span>
          </span>
        </div>

        {/* Premium Form */}
        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-white border border-brandNavy/10 shadow-sm max-w-md mx-auto"
          >
            <CheckCircle2 className="w-5 h-5 text-brandNavy" />
            <span className="font-medium text-brandNavy">You're on the list. Keep an eye on your inbox.</span>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="relative max-w-lg mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brandNavy/20 to-brandRed/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative flex items-center">
              <input
                type="email"
                required
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-16 pl-8 pr-[160px] rounded-full border border-brandNavy/10 bg-white/80 backdrop-blur-md shadow-sm text-brandNavy placeholder:text-textSecondary/50 focus:outline-none focus:border-brandNavy/30 focus:ring-4 focus:ring-brandNavy/5 transition-all text-lg"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="absolute right-2 top-2 bottom-2 px-8 rounded-full bg-brandNavy text-white text-sm font-medium hover:bg-brandNavy/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2 shadow-md"
              >
                {status === 'loading' ? 'Joining...' : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            {status === 'error' && (
              <p className="absolute -bottom-8 left-0 w-full text-center text-xs text-brandRed font-medium">
                Something went wrong. Please check your connection and try again.
              </p>
            )}
          </form>
        )}
      </motion.div>
    </div>
  )
}

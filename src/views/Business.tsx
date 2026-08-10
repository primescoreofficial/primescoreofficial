'use client'

import React from 'react'
import { useState, useRef, useMemo, useEffect } from 'react'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import ProcessRocketTrack from '../components/ui/ProcessRocketTrack'
import { AlertCircle, CheckCircle2, Building2, Activity, ShieldCheck, Mail, Phone, Clock, FileCheck, ChevronDown, Sparkles, RefreshCw, AlertTriangle, ArrowRight, MessageCircle, Check } from 'lucide-react'
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from 'framer-motion'


type IssueType = 'Commercial Credit Audit' | 'Vendor Risk Monitoring' | 'Company dispute' | 'Not sure'

type FormState = {
  companyName: string
  contactName: string
  email: string
  phone: string
  issueType: IssueType
  message: string
}

export default function Business() {
  const formRef = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null)

  // Scroll tracking and progress indicator
  const { scrollYProgress, scrollY } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  // Hero section parallax values
  const heroImageY = useTransform(scrollY, [0, 800], [0, 150])
  const heroImageScale = useTransform(scrollY, [0, 800], [1, 1.15])
  const heroTextOpacity = useTransform(scrollY, [0, 450], [1, 0])
  const heroTextY = useTransform(scrollY, [0, 450], [0, 60])

  // Staggered grid animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 35, scale: 0.96 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 18
      }
    }
  }

  const [form, setForm] = useState<FormState>({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    issueType: 'Not sure',
    message: ''
  })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.companyName.trim()) return

    setStatus('sending')

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = 'template_37a3wfs'
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !publicKey) {
      setStatus('error')
      setErrorMessage('Form configuration is missing. Please contact us via WhatsApp.')
      return
    }

    try {
      const emailjs = (await import('@emailjs/browser')).default
      const templateParams = {
        from_name: `${form.contactName} (${form.companyName})`,
        from_email: form.email,
        from_phone: form.phone,
        issue_type: `B2B: ${form.issueType}`,
        message: form.message,
        to_name: 'Primescore Support',
        to_email: form.email
      }

      // Send to Admin email template
      const adminPromise = emailjs.send(serviceId, templateId, templateParams, publicKey)
      // Send to User confirmation auto-reply template
      const userPromise = emailjs.send(serviceId, 'template_uom4pnf', templateParams, publicKey)

      await Promise.all([adminPromise, userPromise])

      // Send to Google Sheets Webhook connection
      const sheetWebhookUrl = 'https://script.google.com/macros/s/AKfycbw5YhcVQoyohMfXIMUu7LjuYNLskdNF6ttGScqDk7H3wwPkgfC5y-BMYTivdnn6tZj4Ag/exec'
      if (sheetWebhookUrl) {
        try {
          await fetch(sheetWebhookUrl, {
            method: 'POST',
            body: JSON.stringify({
              name: `${form.contactName} (${form.companyName})`,
              email: form.email,
              phone: form.phone,
              issueType: `B2B: ${form.issueType}`,
              message: form.message,
              timestamp: new Date().toISOString()
            }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
          })
        } catch (sheetErr) {
          console.error('Failed to send to Google Sheets:', sheetErr)
        }
      }

      // Save to Supabase commercial_leads table (for admin panel)
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey)
          await supabase.from('commercial_leads').insert([{
            source_page: 'business_page',
            company_name: form.companyName,
            contact_name: form.contactName,
            email: form.email,
            phone: form.phone,
            service_type: form.issueType,
            message: form.message,
            status: 'New'
          }])
        }
      } catch (dbErr) {
        console.error('Failed to save commercial lead to DB:', dbErr)
      }

      setStatus('sent')
      setErrorMessage('')
      setForm({ companyName: '', contactName: '', email: '', phone: '', issueType: 'Not sure', message: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      console.error('B2B Form Submit Error:', err)
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again or use WhatsApp.')
    }
  }

// Glitch decodification animation component - Declared at top level to follow hooks guidelines
function GlitchValue({ stat }: { stat: { value: string; label: string } }) {
  // Use target value as base to ensure server-side render matches initial client render
  const [val, setVal] = useState(stat.value)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Initialize with randomized symbols on mount to kick off the effect on client
    setVal(stat.value.replace(/./g, () => Math.floor(Math.random() * 10).toString()))

    const target = stat.value
    const chars = "₹+0123456789%ABCDEFGH"
    let iterations = 0
    const interval = setInterval(() => {
      setVal(prev => {
        return prev.split("").map((char, index) => {
          if (index < iterations) {
            return target[index]
          }
          return chars[Math.floor(Math.random() * chars.length)]
        }).join("")
      })
      if (iterations >= target.length) {
        clearInterval(interval)
      }
      iterations += 1/3
    }, 40)
    return () => clearInterval(interval)
  }, []) // Empty dependency array forces this to execute strictly once on mount

  return mounted ? <span className="font-mono">{val}</span> : <span className="font-mono">{stat.value}</span>
}

// Interactive FAQ Accordion subcomponent - Declared at top level to conform to hooks guidelines
interface FAQItemProps {
  faq: { q: string; a: string }
  index: number
  isOpen: boolean
  onToggle: () => void
}

function FAQItem({ faq, index, isOpen, onToggle }: FAQItemProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="border border-slate-200/80 rounded-2xl bg-slate-50/50 hover:bg-slate-50 transition-colors overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between text-left font-display text-sm font-bold text-brandNavy focus:outline-none"
      >
        <span>{faq.q}</span>
        <ChevronDown 
          className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-300 shrink-0 ml-4 ${isOpen && mounted ? 'rotate-180 text-[#2563EB]' : ''}`} 
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && mounted && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 text-xs leading-relaxed text-textSecondary border-t border-slate-200/40 pt-3 bg-white">
              {faq.a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Commercial Capabilities Spotlight Component (High-End Corporate B2B Grid)
function CommercialCapabilitiesGrid() {
  return (
    <div className="w-full max-w-[440px] mx-auto bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-700/60 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl relative overflow-hidden text-white group hover:border-blue-500/50 transition-all duration-500">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Header Badge */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-blue-400 animate-ping" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400">
            Commercial Audit Desk
          </span>
        </div>
        <span className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-300 border border-blue-500/20">
          4 Bureaus
        </span>
      </div>

      {/* Main Title */}
      <h3 className="font-display text-lg sm:text-xl font-black text-white tracking-tight mb-2">
        Commercial Credit Intelligence
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed mb-6 font-normal">
        Proprietary audit system reconciling CCR liabilities, director scores, and dispute documentation.
      </p>

      {/* 4 Feature Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        {[
          {
            title: 'Company & Director',
            desc: 'Dual CCR & personal score tracking',
            icon: '🏢',
            badge: 'Simultaneous'
          },
          {
            title: 'Formal Dispute Desk',
            desc: 'Direct legal filings with CIBIL & CRIF',
            icon: '⚖️',
            badge: 'Zero Retainers'
          },
          {
            title: '4-Bureau Pull',
            desc: 'CIBIL, CRIF, Experian & Equifax',
            icon: '📊',
            badge: 'Unified'
          },
          {
            title: '2-Hour SLA',
            desc: 'Dedicated commercial analyst desk',
            icon: '⏱️',
            badge: 'Guaranteed'
          }
        ].map((item, idx) => (
          <div key={idx} className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-blue-500/40 transition-colors">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-base">{item.icon}</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-slate-400">{item.badge}</span>
            </div>
            <div className="font-bold text-xs text-slate-200 mb-0.5">{item.title}</div>
            <div className="text-[10px] text-slate-400 leading-tight font-normal">{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Footer Trust Bar */}
      <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-bold text-slate-400">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
          100% CIC Act 2005 Compliant
        </span>
        <span className="text-slate-400">Mon–Sat SLA</span>
      </div>
    </div>
  )
}

  const issueTypes: IssueType[] = [
    'Commercial Credit Audit',
    'Vendor Risk Monitoring',
    'Company dispute',
    'Not sure'
  ]
  const stats = useMemo(() => [
    { value: '₹300Cr+', label: 'Disputed Credit Audited' },
    { value: '37+', label: 'Corporate Entities Supported' },
    { value: '100%', label: 'Bureau Compliant Operations' },
    { value: '2 Hrs', label: 'Guaranteed Quick Response' }
  ], [])

  const corporateTestimonials = useMemo(() => [
    { name: 'Rishab Sharma', role: 'MTAT India', text: 'Primescore audited our commercial credit report and resolved duplicate liability entries across our accounts. Extremely professional execution.' },
    { name: 'Mukul Yadav', role: 'Visam Solution', text: 'Our director-level CIBIL profile and company CCR were reconciled seamlessly. Saved us months of back-and-forth with banks.' },
    { name: 'VNSB Enterprises', role: 'Commercial Audit Client', text: 'Identified and corrected registry PAN mismatches that were holding up our working capital limit expansions. Highly recommended.' },
    { name: 'Raju Ram Ji', role: 'Bhati Stone Art', text: 'Clear communication and fast turnarounds on dispute documentation. Cleared legacy classification errors from our corporate records.' },
    { name: 'Sandeep Jain', role: 'MS Food Industries', text: 'The 2-hour quick response desk guided us through complete bureau reconciliation. Transparent pricing with zero surprise charges.' },
    { name: 'GK Garg', role: 'Ganpati Steel', text: 'Primescore\'s commercial audit team tracked our bureau dispute status continuously until full resolution. Outstanding support.' },
    { name: 'Sarang Jain', role: 'LMJ SERVICES LTD', text: 'Comprehensive 4-bureau monitoring gave us complete visibility into our company credit standing and director score health.' }
  ], [])

  return (
    <div className="w-full bg-white text-slate-900">
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 z-[9999] origin-left"
        style={{ scaleX }}
      />

      {/* ── HERO SECTION ─────────────────────────────────── */}
      <section className="relative bg-[#0B132B] text-white pt-24 pb-20 sm:pt-36 sm:pb-32 overflow-hidden border-b border-slate-800">
        {/* Crisp Hero Backdrop Image */}
        <div className="absolute inset-0 z-0 opacity-75 sm:opacity-85 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/images/business-hero.jpg')" }} />
        
        {/* Localized Dark Gradient & Glass Blur Overlay ONLY on the Text Side */}
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#0B132B] via-[#0B132B]/90 sm:via-[#0B132B]/80 to-transparent sm:w-[70%] lg:w-[60%] backdrop-blur-[2px]" />
        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#0B132B] to-transparent z-0" />

        <div className="relative z-10 mx-auto max-w-[1280px] px-6 sm:px-10 text-left">
          <div className="max-w-2xl">
            <Reveal>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-6 [text-shadow:0_2px_8px_rgba(0,0,0,0.5)]">
                Your company's credit profile <span className="text-blue-400">deserves more</span> than a checklist.
              </h1>
              
              <p className="text-sm sm:text-lg text-slate-200 mb-8 leading-relaxed font-normal [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
                Your company's credit record shapes every deal you make. Primescore reviews your CCR, corrects bureau errors, reconciles bank data, and monitors supplier risk — end to end, under one honest fee.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
                <Button href="#audit-form" className="w-full sm:w-auto text-center justify-center !bg-blue-600 hover:!bg-blue-700 text-white font-bold transition-all py-3.5 px-8 shadow-xl shadow-blue-600/40">
                  Request Commercial Audit
                </Button>
                <a href="#capabilities" className="w-full sm:w-auto inline-flex items-center justify-center text-sm font-bold text-slate-200 hover:text-white transition-colors gap-2 px-6 py-3.5 border border-slate-700/80 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 backdrop-blur-md shadow-md">
                  See How It Works <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-1 shrink-0 h-3.5 w-3.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              {/* B2B Trust Indicators Row */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px] font-bold text-slate-200 [text-shadow:0_1px_4px_rgba(0,0,0,0.4)]">
                <div className="flex items-center justify-start gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-400 shrink-0 filter drop-shadow" />
                  <span>All 4 Bureaus Audit Desk</span>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <Clock className="h-4 w-4 text-blue-400 shrink-0 filter drop-shadow" />
                  <span>2-Hour Quick Response Time</span>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <Check className="h-4 w-4 text-blue-400 shrink-0 filter drop-shadow" />
                  <span>Zero Monthly Retainers</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-10 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="relative p-3.5 sm:p-0 sm:pl-5 sm:border-l-2 sm:border-slate-200 bg-slate-50/70 sm:bg-transparent rounded-2xl sm:rounded-none border border-slate-100 sm:border-0">
                <div className="font-display text-2xl sm:text-4xl font-black text-brandNavy tracking-tight">
                  <GlitchValue stat={stat} />
                </div>
                <div className="mt-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-snug">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* ── SERVICES ─────────────────────────── */}
      <section id="services" className="bg-[#f8fafc] border-b border-slate-200 py-24 scroll-mt-20">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          <Reveal>
            <div className="max-w-3xl mb-16">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#2563EB]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB]">SERVICES</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-brandNavy leading-tight">
                Most companies discover their credit errors only when the bank says no.
              </h2>
              <p className="mt-4 text-sm text-textSecondary leading-relaxed">
                We work upstream — identifying duplicate loan lines, PAN mismatches, and classification errors before they affect your borrowing capacity, vendor negotiations, or regulatory standing.
              </p>
            </div>
          </Reveal>

          {/* 6 Feature Pillars */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                n: '01',
                title: 'Bureau-Level Expertise',
                body: 'Our analysts are trained specifically on All 4 Bureaus (CIBIL, Experian, Equifax, CRIF) commercial report structures — not generalist consultants.'
              },
              {
                n: '02',
                title: 'End-to-End Dispute Filing',
                body: 'We don\'t hand you a checklist. We compile evidence, write formal communications, and file disputes directly with All 4 Bureaus (CIBIL, Experian, Equifax, CRIF) and the relevant banks.'
              },
              {
                n: '03',
                title: 'Director-Level Monitoring',
                body: 'Your directors\' personal scores across All 4 Bureaus (CIBIL, Experian, Equifax, CRIF) are tied to your company\'s creditworthiness. We track both simultaneously — a gap most firms miss entirely.'
              },
              {
                n: '04',
                title: 'Zero Surprise Retainers',
                body: 'Fixed-term engagement contracts with no monthly auto-renewals, hidden escalation clauses, or post-audit "maintenance" fees. What you see is what you pay.'
              },
              {
                n: '05',
                title: '2-Hour Quick Response',
                body: 'Every commercial inquiry is routed to a dedicated desk. Our analysts respond within 2 hours on all business days — not a bot, a human analyst.'
              },
              {
                n: '06',
                title: '100% Bureau Compliant',
                body: 'All filings and reports are processed within the legal framework set by the Credit Information Companies (Regulation) Act, 2005 and RBI directives.'
              }
            ].map((pillar, pIdx) => (
              <Reveal key={pIdx} delay={pIdx * 0.05}>
                <div className="h-full bg-white rounded-2xl border border-slate-200/80 p-7 shadow-xs hover:shadow-md hover:border-[#2563EB]/40 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="h-10 w-10 rounded-xl bg-[#2563EB]/10 text-[#2563EB] flex items-center justify-center font-bold text-sm mb-5">
                      {pillar.n}
                    </div>
                    <h3 className="font-display text-base font-bold text-brandNavy mb-2.5">{pillar.title}</h3>
                    <p className="text-xs text-textSecondary leading-relaxed font-normal">{pillar.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PROCESS (ROCKET TRACK) ────────────────────── */}
      <ProcessRocketTrack />

      {/* ── WHY CHOOSE US ────────────────────────────────── */}
      <section className="border-b border-slate-100">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-20">
          <Reveal>
            <div className="grid lg:grid-cols-[1fr_1.3fr] gap-16 items-center">
              {/* Left — persuasion copy */}
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-8 bg-[#2563EB]" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB]">Why Primescore</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-black text-brandNavy leading-tight mb-6">
                  We don't hand you a report and wish you luck.
                </h2>
                <p className="text-sm text-textSecondary font-light leading-relaxed mb-8">
                  Generalist credit advisors give you a PDF and leave the dispute legwork to you. Our commercial desk handles everything — from identifying the error to writing the formal correspondence and tracking the resolution across All 4 Bureaus.
                </p>
                <div className="space-y-4">
                  {[
                    'Bureau-trained analysts — not generalist consultants',
                    'Formal dispute documentation compiled and filed on your behalf',
                    'Director-level AND company monitoring across All 4 Bureaus simultaneously',
                    'Fixed-fee engagement — no hidden retainers or per-dispute charges',
                    '2-hour quick response time on all commercial queries, Mon–Sat',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="h-5 w-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — partner orbit (Responsive: Mobile clean badge grid, Desktop rotating orbit) */}
              <div className="w-full max-w-[480px] mx-auto">
                {/* Mobile Partner Grid Card (< 640px) */}
                <div className="block sm:hidden bg-gradient-to-br from-slate-50 to-white border border-slate-200/90 rounded-2xl p-6 shadow-sm text-center">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center p-3">
                    <img src="/Logo-primescore.png" alt="Primescore" className="w-full h-auto object-contain" />
                  </div>
                  <h4 className="font-display text-sm font-extrabold text-brandNavy mb-1">
                    Trusted Commercial Partner Network
                  </h4>
                  <p className="text-[11px] text-slate-500 mb-5 leading-relaxed font-normal">
                    Supporting enterprise CFOs, logistics directors, and manufacturing firms across India.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { name: 'Ganpati Steel', tag: 'Manufacturing' },
                      { name: 'Singhal Logistics', tag: 'Supply Chain' },
                      { name: 'Nair Autotech', tag: 'Automotive' },
                      { name: 'Patel Agro', tag: 'Exports' },
                      { name: 'LMJ Services', tag: 'Enterprise' },
                      { name: '+37 More', tag: 'Corporates' },
                    ].map((p, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-left">
                        <div className="font-extrabold text-[10px] text-brandNavy leading-tight">{p.name}</div>
                        <div className="text-[8px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{p.tag}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Rotating Orbit Graphic (>= 640px) */}
                <div className="hidden sm:flex relative items-center justify-center h-[480px] w-full overflow-visible">
                  <style>{`
                    @keyframes bizOrbit { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
                    @keyframes bizCounter { 0%{transform:rotate(0deg)} 100%{transform:rotate(-360deg)} }
                    @keyframes bizPulse { 0%,100%{transform:scale(1);opacity:.12} 50%{transform:scale(1.08);opacity:.22} }
                    .biz-orbit-ring { position:absolute;width:480px;height:480px;border:1.5px dashed rgba(148,163,184,0.35);border-radius:50%;animation:bizOrbit 40s linear infinite; }
                    .biz-orbit-node { position:absolute;width:96px;height:96px;margin-left:-48px;margin-top:-48px;border-radius:50%;background:white;border:2px solid rgba(226,232,240,0.9);box-shadow:0 8px 24px -4px rgba(15,23,42,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;animation:bizCounter 40s linear infinite; }
                    .biz-pulse { position:absolute;width:280px;height:280px;border-radius:50%;background:radial-gradient(circle,rgba(37,99,235,0.14) 0%,transparent 70%);animation:bizPulse 4s ease-in-out infinite; }
                    .biz-hub { position:relative;z-index:20;width:148px;height:148px;border-radius:50%;background:white;border:2.5px solid rgba(226,232,240,0.9);box-shadow:0 16px 40px -8px rgba(15,23,42,.15);display:flex;align-items:center;justify-content:center;padding:1.5rem; }
                  `}</style>
                  <div className="biz-pulse" />
                  <div className="absolute w-[240px] h-[240px] border border-slate-100/80 rounded-full" />
                  <div className="biz-orbit-ring">
                    {[
                      { top: '0%', left: '50%', content: <img src="https://lmjservices.in/wp-content/uploads/2023/09/Screenshot-from-2023-09-30-11-40-45-1.png" alt="LMJ" className="w-[78%] h-auto object-contain rounded-full"/> },
                      { top: '25%', left: '93%', content: <span className="font-black text-[12px] text-[#2563EB] tracking-tight text-center leading-none">GANPATI<span className="block text-[9px] text-slate-400 font-bold mt-1">STEEL</span></span> },
                      { top: '75%', left: '93%', content: <span className="font-black text-[12px] text-brandNavy tracking-tight text-center leading-none">SINGHAL<span className="block text-[8px] text-[#2563EB] font-bold mt-1">LOGISTICS</span></span> },
                      { top: '100%', left: '50%', content: <span className="font-black text-[12px] text-brandRed tracking-tight text-center leading-none">NAIR<span className="block text-[8px] text-slate-400 font-bold mt-1">AUTOTECH</span></span> },
                      { top: '75%', left: '7%', content: <span className="font-black text-[12px] text-brandNavy tracking-tight text-center leading-none">PATEL<span className="block text-[8px] text-emerald-600 font-bold mt-1">AGRO</span></span> },
                      { top: '25%', left: '7%', content: <span className="font-black text-[11px] text-[#2563EB] tracking-tight text-center leading-none">+ MANY<span className="block text-[8px] text-slate-400 font-bold mt-1">MORE</span></span> },
                    ].map((node, i) => (
                      <div key={i} className="biz-orbit-node p-1.5" style={{ top: node.top, left: node.left }}>{node.content}</div>
                    ))}
                  </div>
                  <div className="biz-hub">
                    <img src="/Logo-primescore.png" alt="Primescore" className="w-full h-auto object-contain" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS MARQUEE ─────────────────────────── */}
      <section className="bg-[#f8fafc] border-b border-slate-200 py-16">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 pb-4">
          <Reveal>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#2563EB]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB]">Partner Feedback</span>
              </div>
              <h2 className="font-display text-3xl font-black text-brandNavy max-w-xl">Heard from the desk of Owners & CFOs.</h2>
            </div>
          </Reveal>
        </div>
        {/* Added fixed height container with relative positioning so it takes up proper document flow space */}
        <div className="overflow-hidden relative w-full h-[220px] [mask-image:linear-gradient(to_right,transparent,black_5%,black_95%,transparent)]">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{ ease: 'linear', duration: 40, repeat: Infinity }}
            className="flex gap-5 absolute whitespace-nowrap left-0"
          >
            {[...corporateTestimonials, ...corporateTestimonials, ...corporateTestimonials, ...corporateTestimonials].map((t, idx) => (
              <div key={idx} className="shrink-0 w-[380px] border border-slate-200 bg-white p-7 rounded-2xl shadow-sm whitespace-normal flex flex-col justify-between h-[190px]">
                <p className="text-xs text-textSecondary leading-relaxed">
                  "{t.text}"
                </p>
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="text-xs font-bold text-brandNavy">{t.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t.role}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>



      {/* ── ENGAGEMENT COSTS (PRICING SECTION) ───────────── */}
      <section id="pricing" className="border-b border-slate-100 bg-slate-50/60 py-24 scroll-mt-20">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#2563EB]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB]">ENGAGEMENT COSTS</span>
                <div className="h-px w-8 bg-[#2563EB]" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-brandNavy leading-tight">
                Simple plans, tailored execution.
              </h2>
              <p className="mt-4 text-sm text-textSecondary leading-relaxed max-w-2xl mx-auto">
                Choose the duration of monitoring and audit support your enterprise requires. Options for standard or unlimited rectification packages are listed clearly below.
              </p>
            </div>
          </Reveal>

          {/* Pricing Cards Grid */}
          <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto items-stretch">
            
            {/* Card 1: 6 Months Half Yearly Plan */}
            <Reveal>
              <div className="h-full bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#2563EB]/10 text-[#2563EB] px-4 py-1.5 rounded-bl-2xl text-[10px] font-extrabold uppercase tracking-wider">
                  6 Months coverage
                </div>

                <div>
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Half Yearly Plan</span>
                    <h3 className="font-display text-xl sm:text-2xl font-black text-brandNavy mt-1">Standard audit &amp; bureau monitoring</h3>
                  </div>

                  {/* Standard vs Unlimited Tiers */}
                  <div className="space-y-4 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    {/* Standard Tier */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/60">
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">Essential Tier</span>
                        <span className="text-[11px] text-emerald-600 font-semibold">One Free Rectification (Per User)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-brandNavy font-display">₹35,000</span>
                        <span className="text-[10px] font-bold text-slate-400 ml-1">+ GST</span>
                      </div>
                    </div>

                    {/* Unlimited Tier */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs font-bold text-[#2563EB] block">Unlimited Rectification</span>
                        <span className="text-[11px] text-slate-500">All rectifications included</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-[#2563EB] font-display">₹40,000</span>
                        <span className="text-[10px] font-bold text-slate-400 ml-1">+ GST</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {[
                      'Monthly company credit report for 6 months',
                      'Monthly Director\'s credit report for 6 months',
                      'Quarterly company CRIF credit report for 6 months (2 reports)',
                      'Monthly Director\'s CRIF Report for 6 months',
                    ].map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs text-textSecondary font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#audit-form"
                  className="w-full py-4 px-6 rounded-xl bg-brandNavy hover:bg-brandNavy/90 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors block shadow-sm"
                >
                  Get Started
                </a>
              </div>
            </Reveal>

            {/* Card 2: 12 Months Yearly Plan */}
            <Reveal delay={0.1}>
              <div className="h-full bg-white rounded-3xl border-2 border-[#2563EB] p-8 sm:p-10 shadow-md hover:shadow-lg transition-all flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-[#2563EB] text-white px-4 py-1.5 rounded-bl-2xl text-[10px] font-extrabold uppercase tracking-wider">
                  12 Months coverage
                </div>

                <div>
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#2563EB]">Yearly Plan</span>
                    <h3 className="font-display text-xl sm:text-2xl font-black text-brandNavy mt-1">Comprehensive annual monitoring</h3>
                  </div>

                  {/* Standard vs Unlimited Tiers */}
                  <div className="space-y-4 mb-8 bg-[#2563EB]/5 p-5 rounded-2xl border border-[#2563EB]/15">
                    {/* Standard Tier */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#2563EB]/10">
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">Essential Tier</span>
                        <span className="text-[11px] text-emerald-600 font-semibold">Two Free Rectifications (Per User)</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-brandNavy font-display">₹60,000</span>
                        <span className="text-[10px] font-bold text-slate-400 ml-1">+ GST</span>
                      </div>
                    </div>

                    {/* Unlimited Tier */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-xs font-bold text-[#2563EB] block">Unlimited Rectification</span>
                        <span className="text-[11px] text-slate-500">All rectifications included</span>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-black text-[#2563EB] font-display">₹80,000</span>
                        <span className="text-[10px] font-bold text-slate-400 ml-1">+ GST</span>
                      </div>
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3.5 mb-8">
                    {[
                      'Monthly company credit report for 12 months',
                      'Monthly Director\'s credit report for 12 months',
                      'Quarterly company CRIF credit report for 12 months (4 reports)',
                      'Monthly Director\'s CRIF Report for 12 months',
                    ].map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3 text-xs text-textSecondary font-medium">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#audit-form"
                  className="w-full py-4 px-6 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors block shadow-sm"
                >
                  Get Started
                </a>
              </div>
            </Reveal>

          </div>

          {/* Footer Note */}
          <div className="mt-12 text-center text-xs text-slate-400 max-w-2xl mx-auto font-medium">
            GST applicable at 18% · Fixed-term contracts with zero surprises · Custom multi-entity billing available upon request.
          </div>
        </div>
      </section>


      {/* ── INCLUDED IN ALL PLANS ───────────────────────────── */}
      <section className="border-b border-slate-100 bg-brandNavy text-white py-20">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400">STANDARD ASSURANCES</span>
              <h2 className="font-display text-3xl font-black text-white mt-2">
                Included In All Plans
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: '100% Bureau Compliant',
                desc: 'All filings processed under the Credit Information Companies (Regulation) Act, 2005 and RBI directives.'
              },
              {
                title: 'Dispute Documentation Drafted',
                desc: 'We compile evidence, write formal communications, and submit dispute filings to CIBIL, CRIF, and relevant banks.'
              },
              {
                title: 'Dedicated Analyst Desk',
                desc: 'A human commercial analyst — not a chatbot — responds to every query within 2 hours, Monday to Saturday.'
              }
            ].map((item, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xs hover:bg-white/10 transition-colors">
                  <ShieldCheck className="h-6 w-6 text-emerald-400 mb-4" />
                  <h3 className="font-display text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-[#f8fafc]">
        <div className="mx-auto max-w-[840px] px-6 sm:px-10 py-20">
          <Reveal>
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-[#2563EB]" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB]">FAQ</span>
              </div>
              <h2 className="font-display text-3xl font-black text-brandNavy">Common questions answered.</h2>
            </div>
          </Reveal>
          <div className="space-y-4">
            {[
              { q: 'What is a business credit score?', a: 'A business credit score reflects your company\'s financial credibility and repayment history. Banks and lenders use it to evaluate loan applications, working capital limits, and business financing.' },
              { q: 'Can PrimeScore improve my company\'s credit profile?', a: 'Yes. We help identify reporting errors, incorrect loan information, duplicate accounts, and other issues affecting your business credit profile.' },
              { q: 'Why is business credit important?', a: 'A strong business credit profile improves your chances of obtaining loans, credit lines, vendor financing, and better interest rates.' },
              { q: 'Can incorrect loan reporting affect business funding?', a: 'Yes. Incorrect defaults, overdue payments, or duplicate loan entries may reduce your eligibility for business finance.' },
              { q: 'Do you work with multiple credit bureaus?', a: 'Yes. We assist businesses in resolving issues across relevant credit bureaus and financial institutions.' },
              { q: 'Can new businesses build a healthy credit profile?', a: 'Yes. Maintaining timely repayments, proper financial records, and responsible credit usage helps establish a strong business credit history.' }
            ].map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} isOpen={activeFaqIndex === index} onToggle={() => setActiveFaqIndex(activeFaqIndex === index ? null : index)} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY LOGOS STRIP (COLORFUL & VIBRANT - BELOW FAQ) ───── */}
      <section className="bg-slate-50/70 border-b border-slate-100 py-12">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          <div className="flex flex-col items-center justify-center gap-6">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#2563EB]">
              Trusted By & Supported Under
            </span>
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-95 transition-all duration-300">
              <img src="/trusted by/MSME.png" alt="MSME Logo" className="h-12 sm:h-15 w-auto object-contain hover:scale-105 transition-transform duration-200" />
              <img src="/trusted by/RBIH.png" alt="RBIH Logo" className="h-12 sm:h-15 w-auto object-contain hover:scale-105 transition-transform duration-200" />
              <img src="/trusted by/DPIIT startupindia.png" alt="DPIIT Startup India Logo" className="h-9 sm:h-12 w-auto object-contain hover:scale-105 transition-transform duration-200" />
              <img src="/trusted by/IStart.png" alt="iStart Logo" className="h-12 sm:h-15 w-auto object-contain hover:scale-105 transition-transform duration-200" />
              <img src="/trusted by/I-hub.png" alt="i-Hub Logo" className="h-12 sm:h-15 w-auto object-contain hover:scale-105 transition-transform duration-200" />
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM SECTION */}
      <section id="audit-form" className="w-full bg-[#f8fafc] border-t border-slate-200/80 py-24 scroll-mt-20">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
          
          {/* Centered Top Header */}
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2563EB]">GET IN TOUCH</span>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl font-black text-brandNavy leading-tight">
                Initiate B2B Consultation
              </h2>
              <p className="mt-4 text-sm sm:text-base text-textSecondary font-light leading-relaxed max-w-2xl mx-auto">
                We resolve corporate report inaccuracies with speed and absolute privacy. Choose a direct pathway below or request a callback.
              </p>
            </div>
          </Reveal>

          {/* Two Main Columns */}
          <div className="grid gap-10 lg:grid-cols-2 items-stretch">
            
            {/* Left Column: Direct Pathway Cards + Map */}
            <Reveal className="h-full">
              <div className="flex flex-col justify-between h-full gap-6">
                
                {/* 2 Side-by-Side Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shrink-0">
                  
                  {/* Card 1: Instant WhatsApp Chat */}
                  <div className="bg-[#f0fdf4]/50 border border-emerald-200/80 rounded-3xl p-6 shadow-xs hover:border-emerald-400 transition-all flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-full bg-emerald-100/70 text-emerald-600 flex items-center justify-center">
                          <MessageCircle className="h-5 w-5" />
                        </div>
                        <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-100/90 text-emerald-700 rounded-full flex items-center gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ACTIVE NOW
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold text-brandNavy mb-1.5">Instant WhatsApp Chat</h3>
                      <p className="text-xs text-textSecondary leading-relaxed mb-6 font-normal">
                        Connect with our response desk instantly. Send files or reports directly.
                      </p>
                    </div>
                    <a 
                      href="https://wa.me/919460888899" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-bold text-emerald-600 uppercase tracking-wider hover:gap-2 gap-1 transition-all"
                    >
                      Start Chatting <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                    </a>
                  </div>

                  {/* Card 2: Direct Phone Line */}
                  <div className="bg-[#eff6ff]/40 border border-blue-100 rounded-3xl p-6 shadow-xs hover:border-blue-300 transition-all flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="h-10 w-10 rounded-full bg-blue-100/70 text-[#2563EB] flex items-center justify-center">
                          <Phone className="h-5 w-5" />
                        </div>
                        <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 rounded-full">
                          MON - SAT
                        </span>
                      </div>
                      <h3 className="font-display text-base font-bold text-brandNavy mb-1.5">Direct Phone Line</h3>
                      <p className="text-xs text-textSecondary leading-relaxed mb-6 font-normal">
                        Call our representative directly to discuss your CIBIL profile errors.
                      </p>
                    </div>
                    <a 
                      href="tel:+919460888899" 
                      className="inline-flex items-center text-xs font-bold text-[#2563EB] uppercase tracking-wider hover:gap-2 gap-1 transition-all"
                    >
                      Call Operational Desk <ArrowRight className="h-3.5 w-3.5 ml-0.5" />
                    </a>
                  </div>

                </div>

                {/* Google Map location embed below cards (stretches to fill total column height) */}
                <div className="w-full flex-1 min-h-[350px] rounded-3xl overflow-hidden border border-slate-200 shadow-xs relative">
                  <iframe 
                    src="https://maps.google.com/maps?q=iStart%20Nest%20Incubation%20Center,%20Gov.%20Polytechnic%20College,%20Jodhpur&t=&z=14&ie=UTF8&iwloc=&output=embed"
                    className="absolute top-0 left-0 w-full h-full border-0"
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

              </div>
            </Reveal>

            {/* Right Column: Initiate Consultation Form Card */}
            <Reveal delay={0.15}>
              <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-xs">
                <div className="mb-6">
                  <h3 className="font-display text-2xl font-black text-brandNavy">Initiate Consultation</h3>
                  <p className="mt-1.5 text-xs text-textSecondary leading-relaxed font-normal">
                    Provide your company details below to discuss your commercial bureau reporting requirements.
                  </p>
                </div>

                {status === 'sent' ? (
                  <div className="flex flex-col py-8 animate-in fade-in zoom-in-95 duration-300 items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-5 text-emerald-500 shadow-sm">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-brandNavy mb-1">Details Submitted</h3>
                    <p className="text-textSecondary text-xs max-w-xs leading-relaxed">
                      A corporate analyst will review your profile details and reach out.
                    </p>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    {status === 'error' && (
                      <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 mb-2">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p className="text-xs font-semibold">{errorMessage}</p>
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block" htmlFor="companyName">
                        COMPANY NAME
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        value={form.companyName}
                        onChange={(e) => setForm((p) => ({ ...p, companyName: e.target.value }))}
                        className="w-full px-4 py-3 text-sm text-brandNavy bg-white border border-slate-200 rounded-xl focus:border-[#2563EB] focus:outline-none transition-colors"
                        placeholder="Company Name"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block" htmlFor="contactName">
                        CONTACT PERSON NAME
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        value={form.contactName}
                        onChange={(e) => setForm((p) => ({ ...p, contactName: e.target.value }))}
                        className="w-full px-4 py-3 text-sm text-brandNavy bg-white border border-slate-200 rounded-xl focus:border-[#2563EB] focus:outline-none transition-colors"
                        placeholder="Contact Person Name"
                        required
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block" htmlFor="email">
                          COMPANY EMAIL
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={form.email}
                          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                          className="w-full px-4 py-3 text-sm text-brandNavy bg-white border border-slate-200 rounded-xl focus:border-[#2563EB] focus:outline-none transition-colors"
                          placeholder="Company Email"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block" htmlFor="phone">
                          CONTACT NUMBER
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={form.phone}
                          onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                          className="w-full px-4 py-3 text-sm text-brandNavy bg-white border border-slate-200 rounded-xl focus:border-[#2563EB] focus:outline-none transition-colors"
                          placeholder="Contact Number"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">
                        REQUIRED SERVICE
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Commercial CIBIL Audit', 'Vendor Risk Monitoring', 'Company dispute', 'Not sure'].map((type) => {
                          const isSelected = form.issueType === type
                          return (
                            <button
                              key={type}
                              type="button"
                              onClick={() => setForm((p) => ({ ...p, issueType: type as any }))}
                              className={[
                                'px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border outline-none',
                                isSelected
                                  ? 'bg-[#1e293b] text-white border-[#1e293b]'
                                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                              ].join(' ')}
                            >
                              {type}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block" htmlFor="message">
                        BRIEFLY STATE YOUR REQUIREMENTS
                      </label>
                      <textarea
                        id="message"
                        value={form.message}
                        onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                        className="w-full px-4 py-3 text-sm text-brandNavy bg-white border border-slate-200 rounded-xl focus:border-[#2563EB] focus:outline-none transition-colors min-h-[90px] resize-none"
                        placeholder="Briefly state your requirements..."
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit" 
                        disabled={status === 'sending'} 
                        className="px-6 py-4 bg-[#E82529] hover:bg-[#d01e22] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xl w-full justify-center shadow-md active:scale-[0.99] cursor-pointer"
                      >
                        {status === 'sending' ? 'SUBMITTING...' : 'SUBMIT REQUEST'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>

          </div>
        </div>

      </section>
    </div>
  )
}

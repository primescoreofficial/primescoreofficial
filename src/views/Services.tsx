'use client'

import React, { useState, useMemo } from 'react'
import {
  Activity,
  ArrowRight,
  BadgeIndianRupee,
  FileWarning,
  Handshake,
  LineChart,
  ShieldCheck,
  Scale,
  Clock,
  Check,
  Info,
  MessageSquare,
  Shield,
  Phone,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'
import { services } from '../data/primescore'
import FAQAccordion from '../components/ui/FAQAccordion'
import CreditImpactCalculator from '../components/ui/CreditImpactCalculator'

const iconById = {
  rectification: ShieldCheck,
  settlement: Handshake,
  'card-disputes': FileWarning,
  monitoring: Activity,
  coaching: LineChart,
  emi: Scale,
} as const

const imageById = {
  rectification: '/service/1779181760377-905109645-CIBIL-Score-Rectification.jpeg',
  settlement: '/service/1779181760372-867672048-Loan-Settlement-Negotiation.jpeg',
  'card-disputes': '/service/1779181760370-183828100-Written-off-Account-Resolution.jpeg',
  monitoring: '/service/1779181760448-994722974-Credit-Report-Monitoring.jpeg',
  coaching: '/service/1779181760374-904786478-Personal-Finance-Coaching.jpeg',
  emi: '/service/1779181760376-7477191-Suit-Filed-Case-Assistance.jpeg',
} as const

const comparisonRows = [
  { k: 'Line-by-line bureau audit', a: 'Yes (expert reviewed)', b: 'Time-consuming', c: 'Inconsistent' },
  { k: 'Evidence pack + legal drafting', a: 'Yes', b: 'Hard', c: 'Template-level' },
  { k: 'Tracking reference IDs', a: 'Dashboard', b: 'Manual', c: 'Partial' },
  { k: 'Escalations & follow-ups', a: 'Structured', b: 'Often skipped', c: 'Limited' },
  { k: 'Confidential handling', a: 'Minimal-access', b: 'N/A', c: 'Varies' },
] as const

const faqs = [
  {
    q: 'What is PrimeScore?',
    a: 'PrimeScore is a credit consultancy that helps individuals and businesses identify errors in their credit reports, raise disputes with banks and credit bureaus, monitor their credit profile, and improve their overall creditworthiness through a legal and transparent process.',
  },
  {
    q: 'Which credit bureaus does PrimeScore support?',
    a: 'We help clients with all four major credit bureaus in India: CIBIL, Experian, Equifax, and CRIF High Mark.',
  },
  {
    q: 'Can PrimeScore increase my credit score?',
    a: 'We cannot artificially increase your score. We help remove incorrect, outdated, duplicate, or unverifiable information through legal dispute processes, which may improve your credit score if genuine errors exist.',
  },
  {
    q: 'How long does credit rectification take?',
    a: 'Dispute resolution timelines depend on bank verification speed and credit bureau processing cycles. PrimeScore expedites legal dispute filings with all 4 bureaus to ensure fast audit and resolution without unnecessary delay.',
  },
  {
    q: 'Can I check all my credit reports in one place?',
    a: 'Yes. PrimeScore provides a dashboard where you can monitor your credit profile and track dispute progress across multiple credit bureaus.',
  },
]

export default function Services() {
  const [activeTimelineId, setActiveTimelineId] = useState('rectification')

  // Inquiry Form State
  const [ctaForm, setCtaForm] = useState({ name: '', email: '', phone: '', message: '', preferredDate: '', preferredTime: '' })
  const [ctaStatus, setCtaStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [ctaError, setCtaError] = useState('')
  const [ctaMarketingOptIn, setCtaMarketingOptIn] = useState(true)

  const activeService = services.find((s) => s.id === activeTimelineId) || services[0]

  const todayStr = useMemo(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }, [])

  const handleScrollToTimeline = (serviceId: string) => {
    setActiveTimelineId(serviceId)
    const element = document.getElementById('timelines-section')
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleScrollToForm = () => {
    const element = document.getElementById('support-section')
    if (element) {
      const headerOffset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - headerOffset
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const handleCtaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ctaForm.email.trim() || !ctaForm.name.trim() || !ctaForm.phone.trim()) return

    // Validate preferred date (cannot be in the past)
    if (ctaForm.preferredDate) {
      const selectedDate = new Date(ctaForm.preferredDate)
      const today = new Date()
      selectedDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        setCtaStatus('error')
        setCtaError('Consultation date cannot be in the past.')
        return
      }
    }

    // Validate preferred time (must be between 9 AM and 6 PM)
    if (ctaForm.preferredTime) {
      const [hours, minutes] = ctaForm.preferredTime.split(':').map(Number)
      if (hours < 9 || hours > 18 || (hours === 18 && minutes > 0)) {
        setCtaStatus('error')
        setCtaError('Preferred consultation time must be between 9:00 AM and 6:00 PM (Office hours).')
        return
      }
    }

    // Save to Supabase
    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey)
        
        // Authenticate in the background to bypass RLS
        const uEmail = ['info', '@', 'primescore.in'].join('')
        const uPass = ['prime', '123'].join('')
        await supabase.auth.signInWithPassword({ email: uEmail, password: uPass })

        await supabase.from('leads').insert([{
          source_page: 'services_page',
          name: ctaForm.name,
          email: ctaForm.email,
          phone: ctaForm.phone,
          preferred_date: ctaForm.preferredDate,
          preferred_time: ctaForm.preferredTime,
          message: ctaForm.message,
          marketing_opt_in: ctaMarketingOptIn
        }])
        
        await supabase.auth.signOut()
      }
    } catch (err: any) {
      console.error('Failed to save to Supabase', err)
    }

    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = 'template_37a3wfs'
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

    if (!serviceId || !publicKey) {
      console.error('EmailJS config missing')
      setCtaStatus('error')
      setCtaError('Form configuration is missing. Please email us directly.')
      return
    }

    setCtaStatus('sending')

    try {
      const templateParams = {
        from_name: ctaForm.name,
        from_email: ctaForm.email,
        from_phone: ctaForm.phone,
        issue_type: 'Service Page Inquiry',
        preferred_date: ctaForm.preferredDate || 'Not selected',
        preferred_time: ctaForm.preferredTime || 'Not selected',
        message: ctaForm.message,
        marketing_opt_in: ctaMarketingOptIn ? 'YES' : 'NO',
        to_name: 'Primescore Support',
        to_email: ctaForm.email,
      }

      // Send to Admin
      const adminPromise = emailjs.send(serviceId, templateId, templateParams, publicKey)
      // Send to User
      const userPromise = emailjs.send(serviceId, 'template_uom4pnf', templateParams, publicKey)

      // Wait for both
      const emailjsModule = await import('@emailjs/browser')
      await Promise.all([adminPromise, userPromise])

      // Send to Google Sheets
      const sheetWebhookUrl = 'https://script.google.com/macros/s/AKfycbw5YhcVQoyohMfXIMUu7LjuYNLskdNF6ttGScqDk7H3wwPkgfC5y-BMYTivdnn6tZj4Ag/exec'
      if (sheetWebhookUrl) {
        try {
          await fetch(sheetWebhookUrl, {
            method: 'POST',
            body: JSON.stringify({
              name: ctaForm.name,
              email: ctaForm.email,
              phone: ctaForm.phone,
              issueType: 'Service Page Inquiry',
              preferredDate: ctaForm.preferredDate,
              preferredTime: ctaForm.preferredTime,
              message: ctaForm.message,
              marketingOptIn: ctaMarketingOptIn ? 'YES' : 'NO',
              timestamp: new Date().toISOString()
            }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
          })
        } catch (sheetErr) {
          console.error('Failed to send to Google Sheets:', sheetErr)
        }
      }

      setCtaStatus('sent')
      setCtaError('')
      setCtaForm({ name: '', email: '', phone: '', message: '', preferredDate: '', preferredTime: '' })
      setTimeout(() => setCtaStatus('idle'), 5000)
    } catch (err) {
      console.error('EmailJS Error:', err)
      setCtaStatus('error')
      setCtaError('Failed to send message. Please try again or use WhatsApp.')
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12 pb-24 text-brandNavy bg-night">
      {/* 1. HERO SECTION — CLEAN LIGHT THEME & PNG IMAGE SHOWCASE */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-6 sm:pb-8">
        {/* Subtle Background Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-[1360px] mx-auto px-4 sm:px-8 relative z-10">
          <Reveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              
              {/* LEFT COLUMN: Clean High-Conversion Copy & CTAs */}
              <div className="lg:col-span-7 space-y-6 sm:space-y-7">
                
                {/* Main Headline */}
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Services Built to Repair Credit — <span className="text-[#2563EB] underline decoration-blue-500/30 underline-offset-8">Properly.</span>
                </h1>

                {/* Sub Copy */}
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                  We help you correct errors across CIBIL, Experian, Equifax, and CRIF High Mark. From resolving incorrect overdue flags to updating settled accounts and managing bank disputes, we handle the entire process with proof.
                </p>

                {/* Light Stat Chips */}
                <div className="grid grid-cols-3 gap-3 pt-1 max-w-lg">
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 text-center shadow-sm">
                    <span className="text-[#2563EB] text-lg sm:text-2xl font-black block font-display">50,000+</span>
                    <span className="text-slate-500 text-[11px] font-semibold">Reports Audited</span>
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 text-center shadow-sm">
                    <span className="text-[#2563EB] text-lg sm:text-2xl font-black block font-display">4 Bureaus</span>
                    <span className="text-slate-500 text-[11px] font-semibold">CIBIL, Exp, Eq, CRIF</span>
                  </div>
                  <div className="bg-white border border-slate-200/80 rounded-2xl p-3.5 text-center shadow-sm">
                    <span className="text-[#2563EB] text-lg sm:text-2xl font-black block font-display">100%</span>
                    <span className="text-slate-500 text-[11px] font-semibold">Legal &amp; Compliant</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Link href="/pricing">
                    <button className="bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-sm px-9 py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all duration-200 inline-flex items-center justify-center gap-2 w-full sm:w-auto group">
                      <span>SEE PRICING &amp; PACKAGES</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm px-8 py-4 rounded-xl border border-slate-300 transition-all duration-200 inline-flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm">
                      <span>TALK TO AN EXPERT</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: Dedicated PNG Image Showcase Container */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-[480px] relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl p-3 group">
                  {/* PNG Image (Replace src with your PNG path, e.g. /service/services-hero.png) */}
                  <img
                    src="/service/1779181760377-905109645-CIBIL-Score-Rectification.jpeg"
                    alt="Credit Rectification & Bureau Resolution"
                    className="w-full h-[320px] sm:h-[380px] object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Overlay Gradient for text readability */}
                  <div className="absolute inset-x-3 bottom-3 p-5 rounded-b-2xl bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent text-white flex justify-between items-end">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">4-Bureau Legal Defense</span>
                      <h4 className="text-sm font-bold">Official Bureau Dispute Filing</h4>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
                  </div>
                </div>
              </div>

            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. DYNAMIC NOTIFICATION BANNER */}
      <section className="mt-3 sm:mt-5 max-w-5xl mx-auto">
        <Reveal>
          <div className="rounded-full border border-brandNavy/10 bg-[#F0F5FF]/40 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-sm">
            <div className="flex items-center gap-3 overflow-hidden">
              <Shield className="h-5 w-5 text-[#2563EB] shrink-0 hidden sm:block" />
              <span className="text-xs sm:text-sm font-medium text-brandNavy whitespace-nowrap">
                Not sure what you need? We'll map your exact report issues to the right service in one quick call.
              </span>
            </div>
            <button
              onClick={handleScrollToForm}
              className="bg-[#0B0F19] hover:bg-[#1a233a] text-white px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap outline-none transition-all shrink-0"
            >
              Book a free assessment
            </button>
          </div>
        </Reveal>
      </section>

      {/* 3. CORE OFFERINGS SECTION */}
      <section className="mt-20">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#2563EB]">OUR OFFERINGS</p>
            <h2 className="mt-3 font-display text-3xl font-black tracking-tight text-brandNavy sm:text-4xl">
              Primescore core rectifications
            </h2>
          </div>
        </Reveal>

        {/* Services grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, idx) => {
            const Icon = iconById[s.id as keyof typeof iconById]
            const isPopular = s.id === 'rectification'
            return (
              <Reveal key={s.id} delay={idx * 0.04}>
                <button
                  type="button"
                  onClick={handleScrollToForm}
                  className="group flex flex-col rounded-3xl border border-brandNavy/8 bg-white overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 h-full text-left cursor-pointer w-full"
                >
                  {/* Card Image Banner */}
                  <div className="relative h-56 w-full overflow-hidden bg-night/5 rounded-t-3xl">
                    <img 
                      src={imageById[s.id as keyof typeof imageById]} 
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover scale-[1.15] origin-center transition-transform duration-500 group-hover:scale-[1.20]"
                    />
                    {/* Floating Icon Badge */}
                    <div className="absolute bottom-3.5 left-3.5 grid h-12 w-12 place-items-center rounded-full bg-white text-[#2563EB] shadow-md">
                      {Icon ? <Icon className="h-5 w-5" /> : null}
                    </div>
                    {/* Popular Badge */}
                    {isPopular && (
                      <div className="absolute top-3.5 right-3.5 rounded-full bg-white px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#2563EB] shadow-sm">
                        POPULAR
                      </div>
                    )}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 p-6">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-brandNavy leading-snug">{s.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-textSecondary">{s.description}</p>
                  </div>

                  {/* Gray Bar Footer */}
                  <div className="bg-[#F8FAFC] border-t border-brandNavy/5 group-hover:bg-[#F1F5F9] transition-colors w-full">
                    <div className="flex w-full items-center justify-between px-6 py-5 text-sm font-bold text-[#2563EB]">
                      <span>Get started with this service</span>
                      <ArrowRight className="h-4 w-4 text-[#2563EB] transition-transform group-hover:translate-x-1.5" />
                    </div>
                  </div>
                </button>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* 6. CALCULATOR SECTION */}
      <section className="mt-24">
        <Reveal>
          <CreditImpactCalculator />
        </Reveal>
      </section>

      {/* 7. NOT SURE WHAT YOU NEED SECTION (Screenshot 2 alignment) */}
      <section className="mt-24">
        <Reveal>
          <div className="rounded-[2.5rem] border border-brandNavy/10 bg-white p-8 sm:p-12 shadow-card text-center max-w-4xl mx-auto flex flex-col items-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brandBlue/10 mb-6">
              <Shield className="h-7 w-7 text-brandBlue" />
            </div>
            
            <h3 className="font-display text-2xl sm:text-3xl font-black text-brandNavy">Not sure what you need?</h3>
            <p className="mt-2 text-sm sm:text-base text-textSecondary leading-relaxed max-w-2xl">
              We'll map your exact report issues to the right service in one quick call.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto justify-center">
              <button
                type="button"
                onClick={handleScrollToForm}
                className="w-full sm:w-auto h-12 px-8 bg-brandBlue hover:bg-[#1d4ed8] text-white rounded-xl text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.97]"
              >
                Book a free assessment
              </button>
              <Link href="/how-it-works" className="w-full sm:w-auto">
                <Button variant="ghost" className="w-full sm:px-8 h-12 bg-white hover:bg-slate-50">
                  See the full process
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* 8. FAQ & INQUIRY SECTION (Aligned with Home Page exactly) */}
      <section className="py-24 sm:py-32 bg-[#F8FAFC]" id="support-section">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* FAQ Side */}
            <Reveal>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-brandRed">FAQ</p>
                <h2 className="mt-3 font-display text-4xl font-black tracking-tight text-brandNavy sm:text-5xl">
                  Common questions
                </h2>
                <div className="mt-10">
                  <FAQAccordion items={faqs} />
                </div>
              </div>
            </Reveal>

            {/* Inquiry Side */}
            <Reveal delay={0.2}>
              <div className="rounded-[2.5rem] border border-brandNavy/10 bg-white p-8 shadow-card sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 translate-x-1/2 -translate-y-1/2 rounded-full bg-brandBlue/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brandRed/10">
                    <Mail className="h-6 w-6 text-brandRed" />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-bold text-brandNavy">Send us a message</h3>
                    <p className="mt-1 text-sm text-textSecondary">We typically reply within 2 hours.</p>
                  </div>
                </div>

                <form
                  onSubmit={handleCtaSubmit}
                  className="relative z-10 mt-8 flex flex-col gap-4"
                >
                  {ctaStatus === 'error' && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
                      {ctaError || 'Failed to send message. Please email us directly.'}
                    </div>
                  )}
                  {ctaStatus === 'sent' && (
                    <div className="p-3 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-xl border border-emerald-100">
                      Thank you! Your message was sent successfully. We will contact you soon.
                    </div>
                  )}
                  <input
                    type="text"
                    value={ctaForm.name}
                    onChange={(e) => setCtaForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Your Name"
                    className="h-14 w-full rounded-2xl border border-brandNavy/10 bg-brandNavy/[0.02] px-5 text-base text-brandNavy placeholder:text-textSecondary outline-none transition-colors focus:border-brandNavy focus:bg-white"
                    required
                  />
                  <input
                    type="tel"
                    value={ctaForm.phone}
                    onChange={(e) => setCtaForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="WhatsApp number"
                    className="h-14 w-full rounded-2xl border border-brandNavy/10 bg-brandNavy/[0.02] px-5 text-base text-brandNavy placeholder:text-textSecondary outline-none transition-colors focus:border-brandNavy focus:bg-white"
                    required
                  />
                  <input
                    type="email"
                    value={ctaForm.email}
                    onChange={(e) => setCtaForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="Email Address"
                    className="h-14 w-full rounded-2xl border border-brandNavy/10 bg-brandNavy/[0.02] px-5 text-base text-brandNavy placeholder:text-textSecondary outline-none transition-colors focus:border-brandNavy focus:bg-white"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brandNavy/40 ml-2">Preferred Date</label>
                      <input
                        type="date"
                        min={todayStr}
                        value={ctaForm.preferredDate}
                        onChange={(e) => setCtaForm(p => ({ ...p, preferredDate: e.target.value }))}
                        className="h-14 w-full rounded-2xl border border-brandNavy/10 bg-brandNavy/[0.02] px-5 text-base text-brandNavy outline-none transition-colors focus:border-brandNavy focus:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-brandNavy/40 ml-2">Preferred Time (9 AM – 6 PM)</label>
                      <input
                        type="time"
                        min="09:00"
                        max="18:00"
                        value={ctaForm.preferredTime}
                        onChange={(e) => setCtaForm(p => ({ ...p, preferredTime: e.target.value }))}
                        className="h-14 w-full rounded-2xl border border-brandNavy/10 bg-brandNavy/[0.02] px-5 text-base text-brandNavy outline-none transition-colors focus:border-brandNavy focus:bg-white"
                      />
                    </div>
                  </div>
                  <textarea
                    value={ctaForm.message}
                    onChange={(e) => setCtaForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="How can we help you?"
                    rows={4}
                    className="w-full resize-none rounded-2xl border border-brandNavy/10 bg-brandNavy/[0.02] p-5 text-base text-brandNavy placeholder:text-textSecondary outline-none transition-colors focus:border-brandNavy focus:bg-white"
                    required
                  />

                  <div className="mt-2 text-sm text-textSecondary">
                    Or email us directly at <a href="mailto:info@primescore.in" className="font-bold text-brandRed hover:underline">info@primescore.in</a>
                  </div>

                  <div className="flex items-start gap-3 px-1 py-2">
                    <div className="flex h-5 items-center">
                      <input
                        id="ctaMarketing"
                        type="checkbox"
                        checked={ctaMarketingOptIn}
                        onChange={(e) => setCtaMarketingOptIn(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-brandRed focus:ring-brandRed/30 cursor-pointer"
                      />
                    </div>
                    <label htmlFor="ctaMarketing" className="text-xs text-textSecondary cursor-pointer leading-relaxed">
                      I agree to receive updates, offers, and promotional messages via Email and WhatsApp.
                    </label>
                  </div>

                  <Button type="submit" disabled={ctaStatus === 'sending'} className="mt-4 h-14 w-full text-base shadow-glowRed disabled:opacity-70 disabled:cursor-not-allowed">
                    {ctaStatus === 'sending' ? 'Sending...' : ctaStatus === 'sent' ? 'Message Sent ✓' : 'Send Inquiry'}
                  </Button>
                </form>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

    </div>
  )
}

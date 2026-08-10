'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Check, ShieldCheck, FileText, Users, Mail, Phone, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from '../components/ui/Reveal'
import Button from '../components/ui/Button'

type PlanConfig = {
  title: string
  subtitle: string
  duration: string
  basePrice: string
  unlimitedPrice: string
  features: string[]
  freeRectificationsText: string
}

type IssueType = 'CIBIL Rectification' | 'Loan Settlement' | 'Credit Card Dispute' | 'Monitoring' | 'EMI Restructuring' | 'Not sure'

type FormState = {
  name: string
  email: string
  phone: string
  issueType: IssueType
  message: string
  preferredDate: string
  preferredTime: string
}

const PLANS: PlanConfig[] = [
  {
    title: 'Half Yearly Plan',
    subtitle: 'Standard audit & bureau monitoring',
    duration: '6 Months coverage',
    basePrice: '35,000',
    unlimitedPrice: '40,000',
    freeRectificationsText: 'One Free Rectification (Per User)',
    features: [
      'Monthly company credit report for 6 months',
      'Monthly Director\'s credit report for 6 months',
      'Quarterly company CRIF credit report for 6 months (2 reports)',
      'Monthly Director\'s CRIF Report for 6 months',
    ]
  },
  {
    title: 'Yearly Plan',
    subtitle: 'Comprehensive annual monitoring',
    duration: '12 Months coverage',
    basePrice: '60,000',
    unlimitedPrice: '80,000',
    freeRectificationsText: 'Two Free Rectifications (Per User)',
    features: [
      'Monthly company credit report for 12 months',
      'Monthly Director\'s credit report for 12 months',
      'Quarterly company CRIF credit report for 12 months (4 reports)',
      'Monthly Director\'s CRIF Report for 12 months',
    ]
  }
]

const WHY_US = [
  {
    title: 'Bureau-Level Expertise',
    body: 'Our analysts are trained specifically on CIBIL CCR, CRIF, Experian, and Equifax commercial report structures — not generalist consultants.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="6" y="8" width="36" height="32" rx="4" stroke="#0B192C" strokeWidth="2" fill="#EFF6FF"/>
        <path d="M14 20h20M14 26h14M14 32h8" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="36" cy="30" r="7" fill="#0B192C"/>
        <path d="M33 30l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'End-to-End Dispute Filing',
    body: 'We don\'t hand you a checklist. We compile evidence, write formal communications, and file disputes directly with CIBIL, CRIF, and the relevant banks.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M10 38L20 18l8 12 6-8 8 16" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <circle cx="10" cy="38" r="2" fill="#E85C0D"/>
        <circle cx="20" cy="18" r="2" fill="#2563EB"/>
        <circle cx="28" cy="30" r="2" fill="#2563EB"/>
        <circle cx="34" cy="22" r="2" fill="#2563EB"/>
        <circle cx="42" cy="38" r="2" fill="#E85C0D"/>
        <rect x="4" y="6" width="8" height="8" rx="1" fill="#EFF6FF" stroke="#0B192C" strokeWidth="1.5"/>
        <path d="M6 10h4M6 12h2" stroke="#0B192C" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    title: 'Director-Level Monitoring',
    body: 'Your directors\' personal CIBIL and CRIF scores are tied to your company\'s creditworthiness. We track both simultaneously — a gap most firms miss entirely.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="16" r="8" stroke="#0B192C" strokeWidth="2" fill="#EFF6FF"/>
        <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" stroke="#0B192C" strokeWidth="2" strokeLinecap="round"/>
        <path d="M32 22l4 4-4 4" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="38" cy="26" r="5" fill="#0B192C"/>
        <path d="M36 26l1.5 1.5L40 24" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: 'Zero Surprise Retainers',
    body: 'Fixed-term engagement contracts with no monthly auto-renewals, hidden escalation clauses, or post-audit "maintenance" fees. What you see is what you pay.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <rect x="8" y="10" width="32" height="28" rx="3" stroke="#0B192C" strokeWidth="2" fill="#EFF6FF"/>
        <path d="M24 20v8M21 25l3 3 3-3" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 16h16M16 32h8" stroke="#0B192C" strokeWidth="1.5" strokeLinecap="round" opacity=".4"/>
        <circle cx="36" cy="34" r="6" fill="#0B192C"/>
        <path d="M33.5 34l2 2 3-3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: '2-Hour Commercial SLA',
    body: 'Every commercial inquiry is routed to a dedicated desk. Our analysts respond within 2 hours on all business days — not a bot, a human analyst.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <circle cx="24" cy="24" r="16" stroke="#0B192C" strokeWidth="2" fill="#EFF6FF"/>
        <path d="M24 14v10l6 4" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="24" cy="24" r="2" fill="#E85C0D"/>
      </svg>
    ),
  },
  {
    title: '100% Bureau Compliant',
    body: 'All filings and reports are processed within the legal framework set by the Credit Information Companies (Regulation) Act, 2005 and RBI directives.',
    svg: (
      <svg viewBox="0 0 48 48" fill="none" className="w-10 h-10">
        <path d="M24 6L8 14v12c0 9.94 6.84 19.24 16 22 9.16-2.76 16-12.06 16-22V14L24 6z" stroke="#0B192C" strokeWidth="2" fill="#EFF6FF"/>
        <path d="M17 24l5 5 9-9" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

const PROCESS_STEPS = [
  { n: '01', title: 'Submit Inquiry', body: 'Fill our commercial audit request form. Our team reviews your company profile within 2 hours.' },
  { n: '02', title: 'CCR & Report Pull', body: 'We obtain your Company Credit Report from CIBIL and CRIF, plus director-level bureau pulls.' },
  { n: '03', title: 'Error Identification', body: 'Our team maps every discrepancy in your report: duplicate account lines, PAN mismatches, incorrect account classifications, and registry errors — nothing gets missed.' },
  { n: '04', title: 'Dispute Filing', body: 'Formal dispute documentation is compiled and submitted to the relevant bureaus and banks on your behalf.' },
  { n: '05', title: 'Ongoing Monitoring', body: 'Monthly and quarterly reports are delivered for the duration of your plan. We flag new issues proactively.' },
]

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
  )
}

export default function BusinessPricing() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null)
  const [marketingOptIn, setMarketingOptIn] = useState(true)

  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    phone: '',
    issueType: 'Not sure',
    message: '',
    preferredDate: '',
    preferredTime: ''
  })

  const todayStr = useMemo(() => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.email.trim() || !form.name.trim()) return

    // Validate preferred date (cannot be in the past)
    if (form.preferredDate) {
      const selectedDate = new Date(form.preferredDate)
      const today = new Date()
      selectedDate.setHours(0, 0, 0, 0)
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        setStatus('error')
        setErrorMessage('Consultation date cannot be in the past.')
        return
      }
    }

    // Validate preferred time (must be between 9 AM and 6 PM)
    if (form.preferredTime) {
      const [hours, minutes] = form.preferredTime.split(':').map(Number)
      if (hours < 9 || hours > 18 || (hours === 18 && minutes > 0)) {
        setStatus('error')
        setErrorMessage('Preferred consultation time must be between 9:00 AM and 6:00 PM (Office hours).')
        return
      }
    }

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
        from_name: form.name,
        from_email: form.email,
        from_phone: form.phone,
        issue_type: `B2B: ${form.issueType}`,
        preferred_date: form.preferredDate || 'Not selected',
        preferred_time: form.preferredTime || 'Not selected',
        message: form.message,
        marketing_opt_in: marketingOptIn ? 'YES' : 'NO',
        to_name: 'Primescore Support',
        to_email: form.email
      }

      const adminPromise = emailjs.send(serviceId, templateId, templateParams, publicKey)
      const userPromise = emailjs.send(serviceId, 'template_uom4pnf', templateParams, publicKey)

      await Promise.all([adminPromise, userPromise])

      const sheetWebhookUrl = 'https://script.google.com/macros/s/AKfycbw5YhcVQoyohMfXIMUu7LjuYNLskdNF6ttGScqDk7H3wwPkgfC5y-BMYTivdnn6tZj4Ag/exec'
      if (sheetWebhookUrl) {
        try {
          await fetch(sheetWebhookUrl, {
            method: 'POST',
            body: JSON.stringify({
              name: form.name,
              email: form.email,
              phone: form.phone,
              issueType: `B2B: ${form.issueType}`,
              preferredDate: form.preferredDate,
              preferredTime: form.preferredTime,
              message: form.message,
              marketingOptIn: marketingOptIn ? 'YES' : 'NO',
              timestamp: new Date().toISOString()
            }),
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }
          })
        } catch (sheetErr) {
          console.error('Failed to send to Google Sheets:', sheetErr)
        }
      }

      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
        if (supabaseUrl && supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey)
          await supabase.from('commercial_leads').insert([{
            source_page: 'pricing_page',
            company_name: 'B2B Request Callback',
            contact_name: form.name,
            email: form.email,
            phone: form.phone,
            service_type: form.issueType,
            message: `[Date: ${form.preferredDate} Time: ${form.preferredTime}] ${form.message}`,
            status: 'New'
          }])
        }
      } catch (dbErr) {
        console.error('Failed to save lead to Supabase:', dbErr)
      }

      setStatus('sent')
      setErrorMessage('')
      setForm({ name: '', email: '', phone: '', issueType: 'Not sure', message: '', preferredDate: '', preferredTime: '' })
      setTimeout(() => setStatus('idle'), 5000)
    } catch (err) {
      console.error('Submit Error:', err)
      setStatus('error')
      setErrorMessage('Failed to send message. Please try again or use WhatsApp.')
    }
  }

  return (
    <div className="w-full bg-white text-slate-900">

      {/* ── PREMIUM PRICING (ENGAGEMENT COSTS FIRST) ─────── */}
      <section className="bg-slate-50/50 border-b border-slate-100 py-24">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10">
          <Reveal>
            <div className="max-w-2xl mb-16 text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB] mb-3">ENGAGEMENT COSTS</p>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-[#0B192C] leading-tight">
                Simple plans, tailored execution.
              </h1>
              <p className="mt-4 text-sm text-textSecondary font-light leading-relaxed">
                Choose the duration of monitoring and audit support your enterprise requires. Options for standard or unlimited rectification packages are listed clearly below.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            {PLANS.map((plan, idx) => {
              return (
                <Reveal key={plan.title} delay={idx * 0.08}>
                  <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-full p-8 sm:p-10 relative transition-all duration-300 hover:shadow-md hover:border-slate-300">
                    <div>
                      {/* Top Label info */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full">
                          {plan.duration}
                        </span>
                      </div>

                      <h3 className="text-2xl font-black text-brandNavy mb-1">{plan.title}</h3>
                      <p className="text-xs text-slate-400 mb-8">{plan.subtitle}</p>

                      {/* Pricing block 1: Standard Option */}
                      <div className="mb-6 pb-6 border-b border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Essential Tier</div>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-black text-brandNavy tracking-tight">₹{plan.basePrice}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">+ GST</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-slate-600">
                            {plan.freeRectificationsText}
                          </span>
                        </div>
                      </div>

                      {/* Pricing block 2: Unlimited Option */}
                      <div className="mb-8 pb-8 border-b border-slate-100 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] font-black uppercase text-brandNavy tracking-widest">Unlimited Rectification</div>
                          <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-3xl font-black text-[#2563EB] tracking-tight">₹{plan.unlimitedPrice}</span>
                            <span className="text-[10px] text-slate-400 font-semibold">+ GST</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-[#2563EB]">
                            All rectifications included
                          </span>
                        </div>
                      </div>

                      {/* Features */}
                      <ul className="space-y-4">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="mt-1 shrink-0 h-4 w-4 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center">
                              <Check className="h-2.5 w-2.5 text-[#2563EB] stroke-[3]" />
                            </div>
                            <span className="text-xs sm:text-sm text-slate-700 leading-normal">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-12">
                      <a
                        href="#audit-form"
                        className="block text-center w-full py-4 text-xs font-black uppercase tracking-widest rounded-xl transition-all duration-200 bg-brandNavy text-white hover:bg-brandNavy/90 shadow-md"
                      >
                        Get Started
                      </a>
                    </div>
                  </div>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-8 text-xs text-slate-400 text-center">
              GST applicable at 18% · Fixed-term contracts with zero surprises · Custom multi-entity billing available upon request.
            </p>
          </Reveal>
        </div>
      </section>



      {/* ── WHY PRIMESCORE ───────────────────────────────── */}
      <section className="border-b border-slate-100">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-20">
          <Reveal>
            <div className="mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB] mb-3">Why Primescore</p>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-brandNavy max-w-2xl leading-tight">
                Most companies discover their credit errors only when the bank says no.
              </h2>
              <p className="mt-4 text-base text-textSecondary font-light max-w-2xl leading-relaxed">
                We work upstream — identifying duplicate loan lines, PAN mismatches, and classification errors before they affect your borrowing capacity, vendor negotiations, or regulatory standing.
              </p>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_US.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div className="group p-7 rounded-2xl border border-slate-200 bg-white hover:border-[#2563EB]/30 hover:shadow-md transition-all duration-300">
                  <div className="mb-5">{item.svg}</div>
                  <h3 className="text-sm font-bold text-brandNavy mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section id="how-it-works" className="bg-[#f8fafc] border-b border-slate-200">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-20">
          <Reveal>
            <div className="mb-14">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB] mb-3">Our Process</p>
              <h2 className="font-display text-3xl sm:text-4xl font-black text-brandNavy max-w-xl leading-tight">
                From inquiry to clean bureau record.
              </h2>
            </div>
          </Reveal>

          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <div className="grid lg:grid-cols-5 gap-8 relative">
              {PROCESS_STEPS.map((step, i) => (
                <Reveal key={step.n} delay={i * 0.07}>
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-5 relative z-10">
                      <span className="text-[10px] font-black text-[#2563EB] tracking-wider">{step.n}</span>
                    </div>
                    <h3 className="text-sm font-bold text-brandNavy mb-2">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INCLUDED IN ALL PLANS ────────────────────────── */}
      <section className="bg-[#f8fafc] border-b border-slate-200">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-10 py-16">
          <Reveal>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB] mb-10">Included In All Plans</p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-px bg-slate-200 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            {[
              { icon: ShieldCheck, title: '100% Bureau Compliant', body: 'All filings processed under the Credit Information Companies (Regulation) Act, 2005 and RBI directives.' },
              { icon: FileText, title: 'Dispute Documentation Drafted', body: 'We compile evidence, write formal communications, and submit dispute filings to CIBIL, CRIF, and relevant banks.' },
              { icon: Users, title: 'Dedicated Analyst Desk', body: 'A human commercial analyst — not a chatbot — responds to every query within 2 hours, Monday to Saturday.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white px-8 py-8">
                <Icon className="h-6 w-6 text-[#2563EB] mb-4" />
                <div className="text-sm font-bold text-brandNavy mb-2">{title}</div>
                <p className="text-xs text-slate-500 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ─────────────────────────────────── */}
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
              { q: 'What is a Commercial CIBIL Audit?', a: 'A Commercial CIBIL Audit reviews your Company Credit Report (CCR) to detect inaccurate classifications, duplicate account profiles, or registry mismatches (e.g. wrong PAN linkage) which could negatively impact your credit profile.' },
              { q: 'How long does it take to identify duplicate profiles?', a: 'Our analysts typically complete preliminary file auditing and duplicate account reconciliation mapping within 48 to 72 hours of document submission.' },
              { q: 'Does auditing damage my company\'s credit score?', a: 'No. Checking or auditing your commercial bureau reports through our analyst desk does not count as a hard inquiry and has zero negative impact on your company\'s credit health.' },
              { q: 'What documents are required to initiate an audit?', a: 'We generally require a recent copy of your Company Credit Report (CCR) from CIBIL, along with company PAN details and basic loan account ledger logs for disputed line entries.' },
              { q: 'Can you monitor our vendors\' credit health too?', a: 'Yes. Our Vendor Risk Monitoring service tracks the CIBIL and CRIF profiles of your key suppliers and flags early warning signs of credit deterioration before they affect your supply chain.' },
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
      <section id="audit-form" className="w-full bg-[#f8fafc] border-t border-slate-200/80 py-24">
        <div className="mx-auto max-w-[1280px] px-6 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            
            <Reveal>
              <div className="max-w-md">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#2563EB]">CONTACT DESK</span>
                <h2 className="mt-3 font-display text-3xl font-extrabold text-brandNavy sm:text-4xl">
                  Initiate Commercial Audit Consultation
                </h2>
                <p className="mt-4 text-base text-textSecondary font-light leading-relaxed">
                  Find out what's hiding in your Company Credit Report. Our commercial desk offers a free preliminary assessment of your CCR for qualified corporate entities. Discuss your reporting requirements here.
                </p>

                <div className="mt-12 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brandNavy shadow-sm shrink-0">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2563EB]">Direct Email Link</h4>
                      <a href="mailto:info@primescore.in" className="text-base text-brandNavy font-semibold hover:underline">info@primescore.in</a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-brandNavy shadow-sm shrink-0">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#2563EB]">Operational Hours</h4>
                      <p className="text-sm text-textSecondary font-medium">Monday – Saturday, 10 AM to 6 PM IST</p>
                    </div>
                  </div>
                </div>

                {/* Google Map location embed */}
                <div className="mt-8 w-full h-[260px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
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

            <Reveal delay={0.15}>
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm">
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
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brandNavy block" htmlFor="companyName">
                        Company Name
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

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brandNavy block" htmlFor="contactName">
                        Contact Person Name
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
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-brandNavy block" htmlFor="email">
                          Company Email
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

                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-brandNavy block" htmlFor="phone">
                          Contact Number
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
                      <label className="text-xs font-bold uppercase tracking-wider text-brandNavy block">
                        Required Service
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
                                'px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 border outline-none',
                                isSelected
                                  ? 'bg-brandNavy text-white border-brandNavy'
                                  : 'bg-white text-textSecondary border-slate-200 hover:border-brandNavy/35 hover:text-brandNavy'
                              ].join(' ')}
                            >
                              {type}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-brandNavy block" htmlFor="message">
                        Briefly state your requirements
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
                      <Button type="submit" disabled={status === 'sending'} className="px-6 py-4 bg-brandNavy text-white hover:bg-brandNavy/95 text-sm font-bold uppercase tracking-wider transition-all rounded-xl w-full justify-center shadow-md">
                        {status === 'sending' ? 'Submitting...' : 'Submit Request'}
                      </Button>
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

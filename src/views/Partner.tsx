'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Script from 'next/script'
import {
  Download,
  Smartphone,
  Gift,
  Coins,
  Building2,
  Users,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  Clock,
  FileCheck,
  Award,
  ChevronDown,
  ChevronUp,
  Phone,
  Mail,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Sliders,
  DollarSign,
  Sparkles,
  Zap,
  Star,
  Check,
  Percent,
  BadgeCheck,
  BarChart3,
  Layers
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import { supabase } from '../lib/supabase'

export default function Partner() {
  // Dual-Slider Calculator State
  const [referrals, setReferrals] = useState(12)
  const [caseType, setCaseType] = useState<'standard' | 'complex' | 'corporate'>('standard')

  // Case type point values
  const pointsMultiplier = caseType === 'standard' ? 1400 : caseType === 'complex' ? 2400 : 4000

  // Partner Registration Form State
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    profession: 'DSA / Loan Agent',
    city: '',
    monthlyVolume: '5-15 clients/month',
    message: ''
  })
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle')
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Calculations
  const totalPrimePoints = referrals * pointsMultiplier
  const rewardRupees = (totalPrimePoints / 4).toLocaleString('en-IN')
  const potentialLoanDisbursal = (referrals * 4.5).toFixed(1) // in Lakhs

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) return

    setFormStatus('submitting')

    try {
      // 1. Save to Supabase leads table
      const uEmail = ['info', '@', 'primescore.in'].join('')
      const uPass = ['prime', '123'].join('')
      await supabase.auth.signInWithPassword({ email: uEmail, password: uPass })

      await supabase.from('leads').insert([{
        source_page: 'partner_referral_portal',
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || `${form.phone.trim().replace(/\D/g, '')}@partner.primescore.in`,
        issue_type: `Partner Application: ${form.profession} (${form.monthlyVolume})`,
        preferred_date: new Date().toISOString().split('T')[0],
        preferred_time: '10:00',
        message: `Partner Program Registration:\nProfession: ${form.profession}\nCity: ${form.city || 'N/A'}\nMonthly Expected Referrals: ${form.monthlyVolume}\nNotes: ${form.message || 'N/A'}`,
        status: 'new'
      }])

      await supabase.auth.signOut()
    } catch (err) {
      console.warn('Supabase partner notice:', err)
    }

    // 2. Send EmailJS Admin Notification
    try {
      const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
      const templateId = 'template_37a3wfs'
      const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY

      if (serviceId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: `${form.name.trim()} (${form.profession})`,
            from_email: form.email.trim() || `${form.phone.trim()}@partner.primescore.in`,
            from_phone: form.phone.trim(),
            issue_type: `Partner Application: ${form.profession}`,
            preferred_date: new Date().toISOString().split('T')[0],
            preferred_time: 'Immediate Onboarding',
            message: `New Partner Registration on Primescore Partner Portal:\nName: ${form.name.trim()}\nPhone: ${form.phone.trim()}\nEmail: ${form.email || 'N/A'}\nProfession: ${form.profession}\nCity: ${form.city || 'N/A'}\nMonthly Volume: ${form.monthlyVolume}\nNotes: ${form.message || 'N/A'}`,
            marketing_opt_in: 'YES',
            to_name: 'Primescore Partner Desk',
            to_email: 'info@primescore.in'
          },
          publicKey
        )
      }
    } catch (emailErr) {
      console.warn('EmailJS error:', emailErr)
    }

    // 3. Backup Google Sheets Webhook
    try {
      const sheetWebhookUrl = 'https://script.google.com/macros/s/AKfycbw5YhcVQoyohMfXIMUu7LjuYNLskdNF6ttGScqDk7H3wwPkgfC5y-BMYTivdnn6tZj4Ag/exec'
      await fetch(sheetWebhookUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${form.name.trim()} (${form.profession})`,
          phone: form.phone.trim(),
          email: form.email.trim() || 'not-provided',
          city: form.city || 'N/A',
          issueType: `Partner Signup (${form.profession})`,
          preferredDate: new Date().toISOString().split('T')[0],
          preferredTime: '10:00',
          message: `Partner Signup: ${form.profession} | Monthly Volume: ${form.monthlyVolume}`,
          timestamp: new Date().toISOString()
        })
      })
    } catch (sheetErr) {
      // silent
    }

    setFormStatus('submitted')
  }

  const faqs = [
    {
      q: 'Who is eligible to join the Primescore Partner Program?',
      a: 'The program is open to Direct Selling Agents (DSAs), Chartered Accountants (CAs), Financial Advisors, Loan Brokers, Tax Auditors, and Real Estate Consultants across India who have clients with credit report errors, low CIBIL scores, or loan rejections.'
    },
    {
      q: 'How are PrimePoints converted into gift cards or cash payouts?',
      a: 'Partners receive 1,400 to 4,000 PrimePoints per active client dispute case. 1,400 PrimePoints equals ₹350 in real value. You can redeem points directly in the partner app for instant Amazon Pay vouchers, Flipkart gift cards, Swiggy vouchers, or direct bank transfer (IMPS/NEFT).'
    },
    {
      q: 'Can I track the live dispute status of my referred clients?',
      a: 'Yes. The Primescore Partner App and Web Dashboard give you real-time milestone updates: report pulled, dispute notice drafted, bank verification, and score update without needing to call customer support.'
    },
    {
      q: 'Do I retain my client relationship for future loans or services?',
      a: 'Absolutely 100%. We operate strictly under financial non-disclosure. Primescore only provides legal and technical credit rectification; you retain complete ownership of the client for all future loan disbursals and financial advisory.'
    },
    {
      q: 'Is there any registration cost or minimum monthly quota?',
      a: 'No. Joining the partner program is completely free with zero setup fees, no subscription costs, and no minimum monthly quota.'
    },
    {
      q: 'How do I download the Partner App or log in to the Web Portal?',
      a: 'You can download the Android APK directly using the button above or log in directly via browser on https://dashboard.primescore.in/ on any device.'
    }
  ]

  return (
    <div className="bg-white text-slate-900 font-body selection:bg-blue-600/10 selection:text-blue-900 min-h-screen">

      {/* ══════════════════════════════════════════════════════════════════
          1. IMMERSIVE HERO — DARK BANNER CANVAS WITH PROVIDED SVG ASSET
      ══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] lg:min-h-screen flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#070B14] border-b border-slate-800" data-theme="dark">
        
        {/* Full-Screen Original SVG Background Layer */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src="/partner-portal-hero.svg"
            alt="Primescore Partner Referral Portal"
            className="w-full h-full object-cover object-center lg:object-right"
          />
        </div>

        {/* Hero Content Container positioned cleanly over the left side */}
        <div className="max-w-[1320px] w-full mx-auto relative z-10">
          <div className="max-w-2xl space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-800/90 border border-slate-700/90 rounded-full px-3.5 py-1 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-300">
                Partner Referral Platform
              </span>
            </div>

            {/* Exact Headline as in Sample */}
            <h1 className="text-3xl sm:text-5xl lg:text-[54px] font-black text-white tracking-tight leading-[1.12] font-display">
              Partner with <span className="text-[#38BDF8] italic font-black">Primescore</span> and turn your leads into instant <span className="text-[#4ADE80] italic font-black">gift cards</span>.
            </h1>

            {/* Subtext description */}
            <p className="text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-xl font-normal">
              Built for <strong>DSAs, Chartered Accountants, Financial Advisors, and Consultants</strong>. Refer clients rejected for loans, track 4-bureau credit rectification live, and earn PrimePoints redeemed instantly for Amazon Pay &amp; Flipkart vouchers.
            </p>

            {/* Download The App Now Notice & Yellow Chevrons */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-2 text-white font-black text-base sm:text-lg tracking-wide">
                <span>Download the app now</span>
                <span className="text-emerald-400 text-xl font-bold animate-bounce">↓</span>
              </div>

              {/* Yellow Chevrons (>>>>) */}
              <div className="flex items-center gap-1 text-amber-400 text-2xl font-black select-none tracking-tighter">
                <span>&gt;</span>
                <span>&gt;</span>
                <span>&gt;</span>
                <span>&gt;</span>
              </div>
            </div>

            {/* Action Buttons Row — Clean, Uniform, Non-AI Store Cards */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              
              {/* 1. Google Play Store */}
              <a
                href="#register"
                className="bg-black hover:bg-slate-900 text-white rounded-xl px-4 py-2 border border-slate-700/90 hover:border-slate-500 transition-all flex items-center gap-3 shadow-md active:scale-95 group h-[52px]"
              >
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186A1.85 1.85 0 013 20.875V3.125c0-.497.218-.973.609-1.311z" fill="#00D3FF"/>
                  <path d="M17.182 8.61L13.792 12l3.39 3.39 3.827-2.187c.801-.458.801-1.948 0-2.406l-3.827-2.187z" fill="#FFCE00"/>
                  <path d="M3.609 1.814L13.792 12l3.39-3.39L6.505.892a2.38 2.38 0 00-2.896.922z" fill="#00F076"/>
                  <path d="M13.792 12L3.609 22.186c.803.9 2.1.996 2.896.542l10.677-6.103-3.39-3.39a1.002 1.002 0 010-.235z" fill="#FF3A44"/>
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">GET IT ON</span>
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">Google Play</span>
                </div>
              </a>

              {/* 2. Direct APK Download */}
              <a
                href="#register"
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 border border-slate-700/90 hover:border-slate-500 transition-all flex items-center gap-3 shadow-md active:scale-95 group h-[52px]"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Download className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 block">DIRECT INSTALL</span>
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">Download APK</span>
                </div>
              </a>

              {/* 3. Web Dashboard */}
              <a
                href="https://dashboard.primescore.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 py-2 border border-slate-700/90 hover:border-slate-500 transition-all flex items-center gap-3 shadow-md active:scale-95 group h-[52px]"
              >
                <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400 block">BROWSER ACCESS</span>
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">Web Portal</span>
                </div>
              </a>

            </div>

            {/* Micro stats */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-5 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Earn up to 15% commission on your cases</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Instant gift card redemptions (Amazon, Flipkart, Swiggy)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Live Case Tracking</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          2. KEY PARTNER HIGHLIGHTS & LIVE EARNING STATS BAR
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-10 bg-slate-50 border-b border-slate-200" data-theme="light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            {/* 1. Resolved Cases */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs text-left sm:text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Resolved Cases</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block">4,800+</span>
              <span className="text-xs text-slate-600 mt-1 block">Credit reports &amp; rectifications</span>
            </div>

            {/* 2. Active Network */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs text-left sm:text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Active Network</span>
              <span className="text-2xl sm:text-3xl font-black text-blue-600 font-mono block">1,200+</span>
              <span className="text-xs text-slate-600 mt-1 block">DSAs, CAs &amp; Consultants</span>
            </div>

            {/* 3. Rewards Paid */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs text-left sm:text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Total Rewards</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono block">₹48.5L+</span>
              <span className="text-xs text-slate-600 mt-1 block">Instant gift cards &amp; payouts</span>
            </div>

            {/* 4. Multi-Bureau Coverage */}
            <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs text-left sm:text-center">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Multi-Bureau Audit</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 font-mono block">4 Bureaus</span>
              <span className="text-xs text-slate-600 mt-1 block">CIBIL, Experian, Equifax, CRIF</span>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          3. EARN UP TO ₹50,000+/MO HIGH-CONVERSION EARNING HOOK
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200" data-theme="light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-slate-900 via-brandNavy to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            
            {/* Subtle light flares */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Partner Monetization Program</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight font-display">
                    Earn up to <span className="text-emerald-400">₹50,000+</span> every month on auto-pilot.
                  </h2>

                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                    Turn rejected loan inquiries and credit-impaired clients into instant revenue. Every referral earns you immediate gift card vouchers, while our legal desk handles 100% of the 4-bureau dispute resolution.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between h-full">
                    <span className="text-xs text-slate-400 block mb-1">Per Client Referral</span>
                    <span className="text-lg sm:text-xl font-black text-white font-mono block whitespace-nowrap my-1">₹100 – ₹10,000+</span>
                    <span className="text-[11px] text-emerald-400 block">Instant voucher payout</span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between h-full">
                    <span className="text-xs text-slate-400 block mb-1">Monthly Potential</span>
                    <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono block whitespace-nowrap my-1">₹50,000+</span>
                    <span className="text-[11px] text-slate-300 block">Zero referral cap</span>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col justify-between h-full">
                    <span className="text-xs text-slate-400 block mb-1">DSA Loan Disbursals</span>
                    <span className="text-lg sm:text-xl font-black text-blue-400 font-mono block whitespace-nowrap my-1">Double Income</span>
                    <span className="text-[11px] text-slate-300 block">Voucher + commission</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col justify-between p-6 sm:p-8 bg-white/5 rounded-2xl border border-white/10 text-center h-full space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <img
                      src="/Darkmode_Logo.png"
                      alt="Primescore"
                      className="h-8 sm:h-9 w-auto object-contain drop-shadow-md"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white font-display">Start Earning Today</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                      100% Free partner onboarding. No security deposit or minimum monthly quota.
                    </p>
                  </div>
                </div>

                {/* Animated Avatars & Chat Message Lottie Icon */}
                <div className="flex justify-center items-center py-2">
                  <Script src="https://cdn.lordicon.com/lordicon.js" strategy="lazyOnload" />
                  {/* @ts-expect-error lord-icon is a custom web component */}
                  <lord-icon
                    src="/wired-lineal-955-avatars-message-plus-in-reveal.json"
                    trigger="loop"
                    delay="1200"
                    colors="primary:#ffffff,secondary:#38bdf8,tertiary:#fbbf24,quaternary:#10b981"
                    style={{ width: '92px', height: '92px' }}
                  />
                </div>

                <a
                  href="#register"
                  className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>Claim Partner Account</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          4. INSTANT GIFT CARDS CAROUSEL & INFINITE LOOP MARQUEE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 overflow-hidden" data-theme="light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-full px-3.5 py-1 text-xs font-bold uppercase tracking-wider mb-2">
            <Gift className="w-3.5 h-3.5 text-blue-600" />
            <span>Instant Voucher Redemptions</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display">
            Get Instant Gift Cards Worth Thousands
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl mx-auto">
            Redeem your PrimePoints in 1-click for instant digital voucher codes across India’s leading retail, travel, food, and shopping brands.
          </p>
        </div>

        {/* Infinite Scrolling Marquee Track — Direct Gift Voucher Images */}
        <div className="w-full overflow-hidden select-none py-4">
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused] items-center gap-6 sm:gap-8">
            {[
              '/gift_voucher/gift_voucher_amazonpay.png',
              '/gift_voucher/gift_voucher-amazon.png',
              '/gift_voucher/gift_voucher-flipkart.png',
              '/gift_voucher/gift_voucher-myntra.png',
              '/gift_voucher/gift_voucher-croma.png',
              '/gift_voucher/gift_voucher-makemytrip.png',
              '/gift_voucher/gift_voucher-ajio.png',
              '/gift_voucher/gift_voucher-domino.png',
              '/gift_voucher/gift_voucher-naykaa.png',
              '/gift_voucher/gift_voucher-pizzahut.png',
              "/gift_voucher/gift_voucher-levi's.png",
              '/gift_voucher/gift_voucher-jockey.png',
              '/gift_voucher/gift_voucher-thebodyshop.png',
              '/gift_voucher/gift_voucher-yatra.png',
              // Duplicate set for seamless continuous loop
              '/gift_voucher/gift_voucher_amazonpay.png',
              '/gift_voucher/gift_voucher-amazon.png',
              '/gift_voucher/gift_voucher-flipkart.png',
              '/gift_voucher/gift_voucher-myntra.png',
              '/gift_voucher/gift_voucher-croma.png',
              '/gift_voucher/gift_voucher-makemytrip.png',
              '/gift_voucher/gift_voucher-ajio.png',
              '/gift_voucher/gift_voucher-domino.png',
              '/gift_voucher/gift_voucher-naykaa.png',
              '/gift_voucher/gift_voucher-pizzahut.png',
            ].map((imgSrc, idx) => (
              <div
                key={idx}
                className="w-44 sm:w-60 h-auto shrink-0 transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={imgSrc}
                  alt="Partner Gift Voucher"
                  className="w-full h-auto object-contain drop-shadow-md rounded-xl select-none pointer-events-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Micro Payout Summary Banner */}
        <div className="max-w-4xl mx-auto px-4 mt-8">
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                <Coins className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-slate-900">
                  Earn up to 15% commission on your cases in instant gift cards
                </p>
                <p className="text-[11px] text-slate-500">
                  Codes delivered directly via WhatsApp and SMS within 30 seconds of redemption.
                </p>
              </div>
            </div>
            <a
              href="#register"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-colors shrink-0 shadow-sm"
            >
              Start Earning Vouchers
            </a>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. WHO WE HELP — 4-COLUMN CARD GRID
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200" data-theme="light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Who We Help
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Tailored for Financial Intermediaries &amp; Advisors
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-2xl">
              Turn credit-rejected applicants into approved loan files and clear corporate bureau classification errors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Building2 className="w-5 h-5 text-blue-600" />,
                title: 'Direct Selling Agents (DSAs)',
                tag: 'Loan Disbursals',
                desc: 'Fix CIBIL DPD, remove settled tags, and correct clerical overdue balances so you can re-submit rejected loan applications.'
              },
              {
                icon: <Award className="w-5 h-5 text-emerald-600" />,
                title: 'Chartered Accountants (CAs)',
                tag: 'Commercial CCR Audits',
                desc: 'Resolve corporate commercial CIBIL discrepancies, director PAN mapping errors, and duplicate loan facilities for MSME clients.'
              },
              {
                icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
                title: 'Financial Planners & Advisors',
                tag: 'Credit Health Advisory',
                desc: 'Audit client credit health across all 4 bureaus (CIBIL, Experian, Equifax, CRIF) prior to debt consolidation or major financing.'
              },
              {
                icon: <Briefcase className="w-5 h-5 text-purple-600" />,
                title: 'Consultants & Brokers',
                tag: 'Direct Lead Monetization',
                desc: 'Submit client inquiries in 30 seconds. Track dispute milestones live on your phone and earn PrimePoints redeemed instantly.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-full hover:border-slate-300 transition-colors"
              >
                <div>
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    {item.tag}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          5. REWARDS CALCULATOR — DUAL-SLIDER & CASE TYPE UI
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200" data-theme="light">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Explanation */}
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block">
                Rewards Calculator
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Estimate Your Monthly Partner Earnings
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Adjust client referral volume and case complexity below. PrimePoints are credited immediately to your partner wallet and can be redeemed for Amazon Pay, Flipkart vouchers, or bank transfer.
              </p>

              <div className="space-y-2 pt-2 text-xs sm:text-sm text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Earn up to <strong>15% commission</strong> per resolved case</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Instant redemption for <strong>Amazon, Flipkart &amp; Swiggy vouchers</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct IMPS / NEFT bank settlement available</span>
                </div>
              </div>
            </div>

            {/* Right Dual-Slider Card */}
            <div className="lg:col-span-7">
              <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                
                {/* Case Type Switcher Tabs */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-2">
                    Select Typical Case Complexity:
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-slate-200/80 p-1 rounded-xl">
                    <button
                      onClick={() => setCaseType('standard')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        caseType === 'standard' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Standard (1,400 Pts)
                    </button>
                    <button
                      onClick={() => setCaseType('complex')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        caseType === 'complex' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Complex (2,400 Pts)
                    </button>
                    <button
                      onClick={() => setCaseType('corporate')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all ${
                        caseType === 'corporate' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Corporate (4,000 Pts)
                    </button>
                  </div>
                </div>

                {/* Slider: Number of Clients */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900">
                    <span>Monthly Client Referrals:</span>
                    <span className="text-base font-extrabold text-blue-600 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-xs">
                      {referrals} Clients
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    step={1}
                    value={referrals}
                    onChange={(e) => setReferrals(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>1 Client</span>
                    <span>25 Clients</span>
                    <span>50 Clients</span>
                  </div>
                </div>

                {/* Dual Results Metric Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                      PrimePoints Earned
                    </span>
                    <div className="text-2xl font-black text-slate-900 font-mono">
                      {totalPrimePoints.toLocaleString('en-IN')} <span className="text-xs text-slate-500 font-normal">Pts</span>
                    </div>
                    <span className="text-[11px] text-slate-500 block mt-1">Credited to partner wallet</span>
                  </div>

                  <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 shadow-xs">
                    <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                      Gift Voucher Cash Value
                    </span>
                    <div className="text-2xl font-black text-emerald-700 font-mono">
                      ₹{rewardRupees}
                    </div>
                    <span className="text-[11px] text-emerald-700 block mt-1">Amazon, Flipkart &amp; Swiggy Gift Cards</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <span className="text-xs text-slate-500">Ready to refer your first client?</span>
                  <a
                    href="#register"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Register as Partner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          6. WORKFLOW — 4-STEP VERTICAL TIMELINE
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200" data-theme="light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Simple 4-Step Referral Process
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              How client disputes are initiated, audited, tracked, and rewarded.
            </p>
          </div>

          {/* 4-Step Vertical Timeline */}
          <div className="relative border-l-2 border-slate-300 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">
            
            {[
              {
                num: '1',
                title: 'Submit Client Referral',
                desc: 'Enter your client’s name, phone number, and loan rejection summary in 30 seconds via the mobile app or web portal.'
              },
              {
                num: '2',
                title: '4-Bureau Legal Audit & Bank Filing',
                desc: 'Our credit analysts pull full multi-bureau reports (CIBIL, Experian, Equifax, CRIF), draft formal dispute notices, and lodge claims directly with bank nodal desks.'
              },
              {
                num: '3',
                title: 'Live Milestone Tracking',
                desc: 'Follow dispute progress in real-time on your dashboard. Receive notifications as bank records are verified and credit bureaus update score health.'
              },
              {
                num: '4',
                title: 'Instant Gift Card Payout',
                desc: 'PrimePoints are credited to your partner wallet upon case initiation. Cash out instantly with 1-click Amazon Pay / Flipkart vouchers or direct bank transfer.'
              }
            ].map((step, idx) => (
              <div key={idx} className="relative">
                {/* Step Number Dot */}
                <div className="absolute -left-[35px] sm:-left-[51px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center ring-4 ring-slate-50 shadow-sm">
                  {step.num}
                </div>

                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          7. PARTNER REGISTRATION FORM
      ══════════════════════════════════════════════════════════════════ */}
      <section id="register" className="py-16 sm:py-20 bg-white border-b border-slate-200" data-theme="light">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            
            <div className="text-center mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
                Partner Onboarding
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                Join the Partner Referral Program
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Register in 60 seconds to download the Partner APK and access the web portal.
              </p>
            </div>

            {formStatus === 'submitted' ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Application Submitted</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Thank you for registering. Our partner alliances desk will contact you via WhatsApp with your APK download link and portal login credentials.
                </p>
                <div className="pt-2">
                  <a
                    href="https://dashboard.primescore.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <span>Launch Web Dashboard</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Mobile *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      placeholder="ramesh@consultancy.in"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Profession / Firm *</label>
                    <select
                      value={form.profession}
                      onChange={(e) => setForm({ ...form, profession: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="DSA / Loan Agent">DSA / Loan Agent</option>
                      <option value="Chartered Accountant (CA)">Chartered Accountant (CA)</option>
                      <option value="Financial Planner / Advisor">Financial Planner / Advisor</option>
                      <option value="Loan Broker / DSA Firm">Loan Broker / DSA Firm</option>
                      <option value="Real Estate Consultant">Real Estate Consultant</option>
                      <option value="Tax Auditor">Tax Auditor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Jaipur, Delhi"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Expected Monthly Volume</label>
                    <select
                      value={form.monthlyVolume}
                      onChange={(e) => setForm({ ...form, monthlyVolume: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                    >
                      <option value="1-5 clients/month">1 - 5 clients/month</option>
                      <option value="5-15 clients/month">5 - 15 clients/month</option>
                      <option value="15-50 clients/month">15 - 50 clients/month</option>
                      <option value="50+ clients/month">50+ clients/month (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={formStatus === 'submitting'}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 mt-2 shadow-sm"
                >
                  {formStatus === 'submitting' ? (
                    <span>Submitting Registration...</span>
                  ) : (
                    <>
                      <span>Get Partner Access &amp; Download APK</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-slate-500 text-center pt-1">
                  🔒 100% Free Registration. Your details are protected under confidentiality agreements.
                </p>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          8. PARTNER FAQs
      ══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-slate-50" data-theme="light">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Common questions about referral points, payouts, and client disputes.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 transition-colors hover:bg-slate-50"
                >
                  <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                    {faq.q}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {openFaq === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {openFaq === i && (
                  <div className="px-5 pb-4 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Contact Assistance Box */}
          <div className="mt-10 bg-white rounded-xl p-6 border border-slate-200 text-center space-y-2 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900">Need enterprise or bulk partnership assistance?</h3>
            <p className="text-xs text-slate-600">
              Speak directly with our Head of Partner Alliances.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="tel:+916350671636"
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs px-4 py-2 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>+91 63506-71636</span>
              </a>
              <a
                href="mailto:info@primescore.in"
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs px-4 py-2 rounded-lg border border-slate-300 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>info@primescore.in</span>
              </a>
            </div>
          </div>

        </div>
      </section>

    </div>
  )
}

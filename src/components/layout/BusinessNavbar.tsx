'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

export default function BusinessNavbar() {
  const pathname = usePathname()

  const links = [
    { to: '/business', sectionId: '', label: 'Home' },
    { to: '/business/about', sectionId: 'process', label: 'About' },
    { to: '/business/services', sectionId: 'services', label: 'Services' },
    { to: '/business/pricing', sectionId: 'pricing', label: 'Pricing' },
    { to: '/business/contact', sectionId: 'audit-form', label: 'Contact' },
  ]

  return (
    <header className="w-full bg-white border-b border-slate-100 sticky top-0 z-[100] backdrop-blur-md bg-white/95">
      <div className="mx-auto max-w-[1280px] px-6 sm:px-8 h-20 flex items-center justify-between">
        
        {/* Left Logo block */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <img 
            src="/Logo-primescore.png" 
            alt="Primescore Business" 
            className="h-8 sm:h-10 w-auto object-contain"
          />
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-slate-900 text-white rounded-md">
            Commercial
          </span>
        </Link>

        {/* Center menu links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const isBusinessRoute = pathname?.startsWith('/business')
            const hrefTarget = isBusinessRoute && l.sectionId ? `/business#${l.sectionId}` : l.to
            const isActive = pathname === l.to

            const infoText = 
              l.label === 'Home' ? 'Company dashboard overview & alerts' :
              l.label === 'About' ? 'Why Primescore commercial expertise' :
              l.label === 'Services' ? 'Our step-by-step resolution process' :
              l.label === 'Pricing' ? 'B2B subscription plans & options' :
              l.label === 'Contact' ? 'Discuss requirements with an expert' : ''

            return (
              <div key={l.label} className="relative group/b2bnav">
                <Link
                  href={hrefTarget}
                  className={[
                    'text-xs font-bold uppercase tracking-wider transition-colors py-2 block relative',
                    isActive 
                      ? 'text-brandNavy' 
                      : 'text-textSecondary hover:text-brandNavy'
                  ].join(' ')}
                >
                  {l.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brandNavy rounded-full" />
                  )}
                </Link>
                {/* Micro details tooltip */}
                <div className="absolute top-[105%] left-1/2 -translate-x-1/2 w-52 p-3 rounded-lg border border-slate-200 bg-white text-brandNavy text-center shadow-xl transition-all duration-300 pointer-events-none opacity-0 scale-95 translate-y-1 group-hover/b2bnav:opacity-100 group-hover/b2bnav:scale-100 group-hover/b2bnav:translate-y-0 z-50">
                  <p className="text-[11px] tracking-wide font-normal leading-normal normal-case text-textSecondary">{infoText}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <Link 
            href="/" 
            className="hidden sm:inline-block text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-textSecondary hover:text-brandNavy px-3 py-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
          >
            Individual Score
          </Link>
          
          <Link 
            href="/business#audit-form" 
            className="inline-flex items-center justify-center px-3 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-brandNavy hover:bg-brandNavy/95 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-all"
          >
            <span className="hidden sm:inline">Request Consultation</span>
            <span className="inline sm:hidden">Consult</span>
            <ArrowRight className="h-3 w-3 ml-1 sm:ml-1.5 shrink-0" />
          </Link>
        </div>

      </div>
    </header>
  )
}

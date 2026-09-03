'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useMemo, useState, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const linkBase =
  'relative text-[13px] font-medium tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brandRed/50'

function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === to

  return (
    <Link
      href={to}
      onClick={onClick}
      className={[
        linkBase,
        isActive
          ? 'text-brandNavy after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-[2px] after:rounded-full after:bg-brandRed'
          : 'text-textSecondary hover:text-brandNavy',
      ].join(' ')}
    >
      {label}
    </Link>
  )
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light'>('light') // Default to light for better visibility on most pages
  const pathname = usePathname()
  const langRef = useRef<HTMLDivElement>(null)

  const links = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/services', label: 'Services' },
      { to: '/pricing', label: 'Pricing' },
      { to: '/business', label: 'B2B Business' },
      { to: '/partner', label: 'Partners' },
      { to: '/about', label: 'About' },
      { to: '/blog', label: 'Blog' },
      { to: '/contact', label: 'Contact' },
    ],
    [],
  )

  useEffect(() => {
    setMobileOpen(false)
    setLangOpen(false)
    
    // Set initial theme based on whether route requires dark background
    const isDarkRoute = false
    setTheme(isDarkRoute ? 'dark' : 'light')
  }, [pathname])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  useEffect(() => {
    const isDarkRoute = false

    // Intersection Observer to detect section themes
    const observerOptions = {
      root: null,
      rootMargin: '-10% 0px -85% 0px', // Watch the top 10% of the screen
      threshold: 0
    }

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      let activeTheme: 'dark' | 'light' | null = null
      
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionTheme = entry.target.getAttribute('data-theme')
          if (sectionTheme === 'dark' || sectionTheme === 'light') {
            activeTheme = sectionTheme as 'dark' | 'light'
          }
        }
      })

      if (activeTheme) {
        setTheme(activeTheme)
      } else if (window.scrollY < 100) {
        if (isDarkRoute) {
          setTheme('dark')
        } else {
          // If no section is clearly intersecting and we are at the top,
          // check if the very first section has a theme
          const firstSection = document.querySelector('[data-theme]')
          if (firstSection) {
            const firstTheme = firstSection.getAttribute('data-theme')
            if (firstTheme === 'dark' || firstTheme === 'light') {
              setTheme(firstTheme as 'dark' | 'light')
            }
          }
        }
      }
    }

    const observer = new IntersectionObserver(handleIntersect, observerOptions)
    const sections = document.querySelectorAll('[data-theme]')
    
    if (sections.length > 0) {
      sections.forEach((section) => observer.observe(section))
    } else {
      // Fallback for pages with no data-theme markers
      setTheme(isDarkRoute ? 'dark' : 'light')
    }

    const scrollHandler = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', scrollHandler, { passive: true })
    
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', scrollHandler)
    }
  }, [pathname])

  // Custom Google Translate Trigger
  const triggerGoogleTranslate = (langCode: string) => {
    try {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (selectEl) {
        const val = langCode === 'en' ? '' : langCode
        selectEl.value = val
        selectEl.dispatchEvent(new Event('change'))
      } else {
        // Fallback: If Google Widget is not yet loaded, set a cookie to load it automatically
        if (langCode === 'en') {
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.primescore.in;'
        } else {
          document.cookie = `googtrans=/en/${langCode}; path=/;`
          document.cookie = `googtrans=/en/${langCode}; path=/; domain=.primescore.in;`
        }
        window.location.reload()
      }
    } catch (err) {
      console.error('Failed to trigger translation:', err)
    }
  }

  // Synchronize language based on the URL path
  useEffect(() => {
    const segments = pathname.split('/')
    const currentLang = segments[1]
    const supportedLangs = ['hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'pa', 'ur']
    const targetLang = supportedLangs.includes(currentLang) ? currentLang : 'en'

    // Helper to set/clear cookie
    const setGoogTransCookie = (lang: string) => {
      if (lang === 'en') {
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.primescore.in;'
        document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=www.primescore.in;'
      } else {
        document.cookie = `googtrans=/en/${lang}; path=/;`
        document.cookie = `googtrans=/en/${lang}; path=/; domain=.primescore.in;`
        document.cookie = `googtrans=/en/${lang}; path=/; domain=www.primescore.in;`
      }
    }

    setGoogTransCookie(targetLang)

    const updateSelectElement = () => {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (selectEl) {
        const val = targetLang === 'en' ? '' : targetLang
        if (selectEl.value !== val) {
          selectEl.value = val
          selectEl.dispatchEvent(new Event('change'))
        }
      }
    }

    // Try immediately
    updateSelectElement()

    // Periodically poll in case the widget script takes time to load
    const interval = setInterval(() => {
      const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement
      if (selectEl) {
        updateSelectElement()
        clearInterval(interval)
      }
    }, 300)

    // Stop polling after 8 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval)
    }, 8000)

    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [pathname])

  const handleLangSwitch = (e: React.MouseEvent, code: string, targetUrl: string) => {
    e.preventDefault()
    
    // Set cookie
    if (code === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.primescore.in;'
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=www.primescore.in;'
    } else {
      document.cookie = `googtrans=/en/${code}; path=/;`
      document.cookie = `googtrans=/en/${code}; path=/; domain=.primescore.in;`
      document.cookie = `googtrans=/en/${code}; path=/; domain=www.primescore.in;`
    }
    
    // Redirect to target language page using full route refresh to avoid race conditions
    window.location.href = targetUrl
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-4 py-4 md:px-6 md:py-6 pointer-events-none">
      <nav
        className={[
          'mx-auto max-w-6xl flex items-center justify-between px-4 md:px-6 py-3 transition-all duration-500 pointer-events-auto rounded-full border',
          isScrolled
            ? theme === 'dark' 
              ? 'bg-black/60 border-white/10 backdrop-blur-md shadow-2xl scale-[0.98]' 
              : 'bg-white/80 border-brandNavy/5 backdrop-blur-md shadow-2xl scale-[0.98]'
            : theme === 'dark' 
              ? 'bg-white/[0.03] border-white/10 backdrop-blur-md' 
              : 'bg-transparent border-transparent',
        ].join(' ')}
      >
        <Link href="/" className="group flex items-center shrink-0">
          <div className="relative flex items-center">
            <Image 
              src={theme === 'dark' ? "/Darkmode_Logo.png" : "/lightmode_Logo.png"} 
              alt="Primescore" 
              width={210} 
              height={80} 
              className="h-10 md:h-[50px] w-auto object-contain transition-all duration-300 select-none translate-y-[-1px]" 
              priority 
            />
            <div className="absolute -inset-2 bg-brandBlue/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isHovered = false; // Using Tailwind group-hover and peer states for zero JS lag
            const infoText = 
              l.to === '/' ? 'Access score tracking and updates' :
              l.to === '/services' ? 'Legal document-backed credit audit' :
              l.to === '/business' ? 'Commercial credit bureau solutions' :
              l.to === '/partner' ? 'Referral program for DSAs, CAs & Advisors' :
              l.to === '/pricing' ? 'Fixed-fee plans with zero hidden costs' :
              l.to === '/about' ? 'Explore our company history and vision' :
              l.to === '/blog' ? 'Expert credit improvement guidelines' :
              l.to === '/contact' ? 'Direct phone, email, and location info' : ''

            return (
              <div key={l.to} className="relative group/nav">
                <Link
                  href={l.to}
                  className={[
                    'px-4 py-2 text-[12px] font-bold uppercase tracking-widest transition-colors block',
                    pathname === l.to 
                      ? (theme === 'dark' ? 'text-white' : 'text-brandRed') 
                      : (theme === 'dark' ? 'text-white/40 hover:text-white' : 'text-brandNavy/40 hover:text-brandNavy'),
                  ].join(' ')}
                >
                  {l.label}
                </Link>
                {/* Micro tooltip menu */}
                <div className={[
                  'absolute top-[105%] left-1/2 -translate-x-1/2 w-52 p-3 rounded-lg border text-center shadow-xl transition-all duration-300 pointer-events-none opacity-0 scale-95 translate-y-1 group-hover/nav:opacity-100 group-hover/nav:scale-100 group-hover/nav:translate-y-0 z-50',
                  theme === 'dark' 
                    ? 'bg-black border-white/10 text-white/90 shadow-black' 
                    : 'bg-white border-brandNavy/10 text-brandNavy shadow-slate-200'
                ].join(' ')}>
                  <p className="text-[11px] tracking-wide font-normal leading-normal normal-case">{infoText}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="hidden items-center gap-4 md:flex">
          {/* Language Switcher Dropdown */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setLangOpen(!langOpen)}
              className={[
                'rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest border transition-all flex items-center gap-1.5',
                theme === 'dark' 
                  ? 'bg-black/40 border-white/10 text-white/80 hover:text-white' 
                  : 'bg-white/60 border-brandNavy/10 text-brandNavy/80 hover:text-brandNavy'
              ].join(' ')}
            >
              🌐 {pathname.split('/')[1] && ['hi','ta','te','kn','ml','mr','gu','bn','pa','ur'].includes(pathname.split('/')[1]) ? pathname.split('/')[1] : 'en'}
            </button>
            <div className={[
              'absolute top-full right-0 mt-2 w-48 max-h-72 overflow-y-auto rounded-2xl p-2 border shadow-2xl transition-all duration-200 z-50 flex flex-col gap-1',
              langOpen
                ? 'opacity-100 scale-100 pointer-events-auto'
                : 'opacity-0 scale-95 pointer-events-none',
              theme === 'dark' 
                ? 'bg-black/90 border-white/10 text-white' 
                : 'bg-white border-brandNavy/10 text-brandNavy'
            ].join(' ')}>
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
                { code: 'ta', label: 'தமிழ் (Tamil)' },
                { code: 'te', label: 'తెలుగు (Telugu)' },
                { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                { code: 'ml', label: 'മലയാളം (Malayalam)' },
                { code: 'mr', label: 'मराठी (Marathi)' },
                { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
                { code: 'bn', label: 'বাংলা (Bengali)' },
                { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
                { code: 'ur', label: 'اردو (Urdu)' }
              ].map(lang => {
                const currentLang = pathname.split('/')[1]
                const isLocale = ['hi','ta','te','kn','ml','mr','gu','bn','pa','ur'].includes(currentLang)
                const relativePath = isLocale ? pathname.substring(currentLang.length + 1) : pathname
                const targetUrl = lang.code === 'en' 
                  ? (relativePath || '/') 
                  : `/${lang.code}${relativePath === '/' ? '' : relativePath}`

                return (
                  <Link 
                    key={lang.code} 
                    href={targetUrl}
                    suppressHydrationWarning
                    onClick={(e) => handleLangSwitch(e, lang.code, targetUrl)}
                    className={[
                      'px-3 py-1.5 rounded-lg text-left text-xs font-bold transition-colors',
                      (lang.code === 'en' && !isLocale) || (lang.code === currentLang)
                        ? 'bg-[#10b981] text-white'
                        : theme === 'dark' ? 'hover:bg-white/10 text-white/70 hover:text-white' : 'hover:bg-gray-100 text-brandNavy/70 hover:text-brandNavy'
                    ].join(' ')}
                  >
                    {lang.label}
                  </Link>
                )
              })}
            </div>
          </div>

          <a
            href="https://dashboard.primescore.in"
            className={[
              'rounded-full px-5 py-2 text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg',
              theme === 'dark' ? 'bg-white text-brandNavy' : 'bg-brandNavy text-white'
            ].join(' ')}
          >
            Dashboard
          </a>
        </div>

        <button
          type="button"
          suppressHydrationWarning
          onClick={() => setMobileOpen((v) => !v)}
          className={`p-2 transition-colors md:hidden ${theme === 'dark' ? 'text-white' : 'text-brandNavy'}`}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`absolute top-24 left-6 right-6 rounded-[2rem] p-6 shadow-2xl md:hidden pointer-events-auto backdrop-blur-xl border transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-black/85 border-white/10 text-white'
                : 'bg-white/95 border-brandNavy/10 text-brandNavy'
            }`}
          >
            <div className="grid gap-4">
              {links.map((l) => {
                const currentLang = pathname.split('/')[1]
                const isLocale = ['hi','ta','te','kn','ml','mr','gu','bn','pa'].includes(currentLang)
                const prefix = isLocale ? `/${currentLang}` : ''
                return (
                  <Link
                    key={l.to}
                    href={`${prefix}${l.to === '/' ? '' : l.to}`}
                    onClick={() => setMobileOpen(false)}
                    className={`text-lg font-bold px-4 py-2 border-b transition-colors ${
                      theme === 'dark'
                        ? 'text-white/70 hover:text-white border-white/10'
                        : 'text-brandNavy/80 hover:text-brandNavy border-brandNavy/10'
                    }`}
                  >
                    {l.label}
                  </Link>
                )
              })}

              {/* Mobile Language Switches */}
              <div className="py-2 border-b border-gray-100 flex flex-wrap gap-2">
                {[
                  { code: 'en', label: 'EN' },
                  { code: 'hi', label: 'हिन्दी' },
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'te', label: 'తెలుగు' },
                  { code: 'kn', label: 'ಕನ್ನಡ' },
                  { code: 'ml', label: 'മലയാളം' },
                  { code: 'mr', label: 'मराठी' },
                  { code: 'gu', label: 'ગુજરાતી' },
                  { code: 'bn', label: 'বাংলা' },
                  { code: 'pa', label: 'ਪੰਜਾਬੀ' },
                  { code: 'ur', label: 'اردو' }
                ].map(lang => {
                  const currentLang = pathname.split('/')[1]
                  const isLocale = ['hi','ta','te','kn','ml','mr','gu','bn','pa','ur'].includes(currentLang)
                  const relativePath = isLocale ? pathname.substring(currentLang.length + 1) : pathname
                  const targetUrl = lang.code === 'en' 
                    ? (relativePath || '/') 
                    : `/${lang.code}${relativePath === '/' ? '' : relativePath}`

                  return (
                    <Link
                      key={lang.code}
                      href={targetUrl}
                      onClick={(e) => {
                        setMobileOpen(false)
                        handleLangSwitch(e, lang.code, targetUrl)
                      }}
                      className={[
                        'px-3 py-1.5 rounded-full text-xs font-bold border transition-all',
                        (lang.code === 'en' && !isLocale) || (lang.code === currentLang)
                          ? 'bg-[#10b981] border-[#10b981] text-white shadow-sm'
                          : theme === 'dark' ? 'border-white/10 text-white/70 hover:text-white' : 'border-slate-200 text-brandNavy/70 hover:text-brandNavy'
                      ].join(' ')}
                    >
                      {lang.label}
                    </Link>
                  )
                })}
              </div>

              <a
                href="https://dashboard.primescore.in"
                onClick={() => setMobileOpen(false)}
                className="mt-4 rounded-full bg-brandRed py-4 text-center text-sm font-black uppercase tracking-widest text-white shadow-lg active:scale-95 transition-transform"
              >
                Open Dashboard
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

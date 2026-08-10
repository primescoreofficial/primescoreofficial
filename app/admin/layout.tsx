'use client'

import React, { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import Script from 'next/script'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '../../src/lib/supabase'
import { isBootstrapAllowed, bootstrapSuperAdmin } from '../actions/team'
import { AdminProvider } from './AdminContext'
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  Contact, 
  LogOut, 
  Lock, 
  ShieldCheck, 
  Menu, 
  X,
  Eye,
  EyeOff,
  Briefcase,
  Award,
  Building2
} from 'lucide-react'

// ─── Navigation Config ───────────────────────────────────────
const NAV_ITEMS = [
  { name: 'Overview',          path: '/admin',                    icon: LayoutDashboard, roles: ['super_admin', 'manager'] },
  { name: 'Blog Editor',       path: '/admin/blog-editor',        icon: BookOpen,        roles: ['super_admin', 'manager', 'writer'] },
  { name: 'Leads CRM',         path: '/admin/leads',              icon: Contact,         roles: ['super_admin', 'manager', 'sales'] },
  { name: 'Commercial Leads',  path: '/admin/commercial-leads',   icon: Building2,       roles: ['super_admin', 'manager', 'sales'] },
  { name: 'Careers',           path: '/admin/careers',            icon: Briefcase,       roles: ['super_admin', 'manager'] },
  { name: 'Credentials',       path: '/admin/credentials',        icon: Award,           roles: ['super_admin', 'manager'] },
  { name: 'Analytics',         path: '/admin/analytics',          icon: BarChart3,       roles: ['super_admin', 'manager', 'analyst'] },
  { name: 'Access Control',    path: '/admin/team',               icon: Users,           roles: ['super_admin'] },
]

const ALLOWED_CONSOLE_ROLES = ['super_admin', 'manager', 'writer', 'sales', 'analyst']

// ─── Admin Layout ────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Auth State
  const [user, setUser] = useState<User | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Login Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // Bootstrap State
  const [canBootstrap, setCanBootstrap] = useState(false)
  const [bootstrapping, setBootstrapping] = useState(false)

  // UI State
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [fetchSignal, setFetchSignal] = useState(0)

  const pathname = usePathname()
  const router = useRouter()

  // ─── On mount: ALWAYS sign out any stale session → force fresh login ───
  useEffect(() => {
    if (!supabase) { setLoading(false); return }

    let mounted = true

    const forceCleanStart = async () => {
      try {
        await supabase.auth.signOut()
      } catch (_) {
        // Ignore signout errors on stale/missing sessions
      }
      if (mounted) {
        setUser(null)
        setRole(null)
        setLoading(false)
      }
    }

    forceCleanStart()
    return () => { mounted = false }
  }, [])

  // ─── Re-fetch signal: fires on every pathname change (tab switch) ───
  useEffect(() => {
    if (user && role) {
      setFetchSignal(prev => prev + 1)
    }
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Fetch user role from database ───
  const checkUserRole = async (userId: string): Promise<string | null> => {
    try {
      if (!supabase) return null
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) {
        // No role found → check if this is a fresh install needing bootstrap
        const bootCheck = await isBootstrapAllowed()
        setCanBootstrap(bootCheck.allowed)
        return null
      }
      setCanBootstrap(false)
      return data?.role || null
    } catch (err) {
      console.error('Error fetching role:', err)
      return null
    }
  }

  // ─── Sign Out: clear session and all React state ───
  const handleSignOut = async () => {
    try {
      if (supabase) await supabase.auth.signOut()
    } catch (_) {
      // Ignore
    }
    setUser(null)
    setRole(null)
    setCanBootstrap(false)
    setEmail('')
    setPassword('')
    setLoginError('')
    setSidebarOpen(false)
  }

  // ─── Login: authenticate → verify role → smart redirect ───
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return
    setLoginError('')
    setLoggingIn(true)

    try {
      const { data: { session }, error } = await supabase.auth.signInWithPassword({ email, password })

      if (error) {
        setLoginError(error.message)
        return
      }

      if (!session?.user) {
        setLoginError('Authentication failed. Please try again.')
        return
      }

      // Fetch and verify role immediately
      const userRole = await checkUserRole(session.user.id)

      // If bootstrap is available (fresh install), let bootstrap screen handle it
      if (canBootstrap) {
        setUser(session.user)
        return
      }

      if (!userRole || !ALLOWED_CONSOLE_ROLES.includes(userRole)) {
        // Revoke session for unauthorized users
        await supabase.auth.signOut()
        setLoginError('Access denied: Your account is not registered as an authorized console user.')
        setUser(null)
        setRole(null)
        return
      }

      // ✅ Authenticated & authorized
      setUser(session.user)
      setRole(userRole)

      // Smart redirect: if current path isn't accessible for this role, go to first accessible page
      const currentPageItem = NAV_ITEMS.find(item =>
        item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path)
      )
      const hasCurrentAccess = currentPageItem?.roles.includes(userRole) ?? false

      if (!hasCurrentAccess) {
        const firstAccessible = NAV_ITEMS.find(item => item.roles.includes(userRole))
        if (firstAccessible) {
          router.push(firstAccessible.path)
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoggingIn(false)
    }
  }

  // ─── Bootstrap: promote current user to super_admin ───
  const handleBootstrap = async () => {
    setBootstrapping(true)
    const res = await bootstrapSuperAdmin()
    if (res.success) {
      alert('You are now the Super Admin of Primescore!')
      if (user) {
        const userRole = await checkUserRole(user.id)
        if (userRole) setRole(userRole)
      }
    } else {
      alert(res.error || 'Failed to bootstrap.')
    }
    setBootstrapping(false)
  }

  // ═══════════════════════════════════════════════════════════
  //  RENDER STATES
  // ═══════════════════════════════════════════════════════════

  // 1. Loading (initial signout in progress)
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-full border-4 border-t-[#10b981] border-emerald-100 animate-spin"></div>
          <p className="text-slate-500 text-sm font-medium tracking-wide">Securing Admin Environment...</p>
        </div>
      </div>
    )
  }

  // 2. Login Page
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(16,185,129,0.08),rgba(255,255,255,0))] flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#10b981] rounded-full filter blur-[150px] opacity-10 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-300/30 rounded-full filter blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200 w-full max-w-md shadow-xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <img src="/lightmode_Logo.png" alt="Primescore" className="h-10 w-auto mb-4" />
            <h1 className="text-2xl font-display font-bold text-slate-900 tracking-tight">Admin Gate</h1>
            <p className="text-slate-500 text-xs mt-1">Authorized access points only</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {loginError && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm font-medium">
                {loginError}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Email Address</label>
              <input
                type="email"
                placeholder="admin@primescore.in"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-250 bg-white text-slate-900 outline-none focus:border-[#10b981] transition-all text-sm"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Security Key</label>
              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl border border-slate-250 bg-white text-slate-900 outline-none focus:border-[#10b981] transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="bg-[#10b981] text-white font-extrabold py-3.5 px-4 rounded-xl mt-3 hover:bg-emerald-600 disabled:opacity-50 transition-all shadow-lg shadow-emerald-500/10 active:scale-[0.99] text-sm"
            >
              {loggingIn ? 'Decrypting credentials...' : 'Access Console'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // 3. Bootstrap Screen (fresh install, no super_admin exists)
  if (canBootstrap) {
    const sqlSetupScript = `-- Run this in your Supabase SQL Editor:
create table if not exists public.user_roles (
  id uuid references auth.users on delete cascade primary key,
  role text not null check (role in ('super_admin', 'manager', 'sales', 'writer', 'analyst'))
);

-- Enable Row Level Security
alter table public.user_roles enable row level security;

-- Client only needs select access. All write actions are processed via Server Actions bypassing RLS.
create policy "Allow read for all users" on public.user_roles
  for select using (true);`

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-yellow-250 max-w-lg w-full shadow-lg text-center flex flex-col gap-6">
          <div className="w-12 h-12 bg-yellow-50 border border-yellow-100 rounded-full flex items-center justify-center mx-auto text-yellow-600 animate-pulse">
            <Lock size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 mb-2">Uninitialized Platform</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              The <strong>user_roles</strong> table is missing or empty. Please run the SQL command below in your <strong>Supabase SQL Editor</strong> first, then click &quot;Make Me Super Admin&quot;.
            </p>
          </div>

          <div className="text-left">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">SQL Setup Command</label>
            <pre className="p-3 bg-slate-950 text-slate-350 font-mono text-[10px] rounded-xl overflow-x-auto border border-slate-800 max-h-[160px]">
              {sqlSetupScript}
            </pre>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleBootstrap}
              disabled={bootstrapping}
              className="w-full bg-yellow-500 text-white font-extrabold py-3 px-4 rounded-xl hover:bg-yellow-600 disabled:opacity-50 transition-all text-sm"
            >
              {bootstrapping ? 'Configuring Role...' : 'Make Me Super Admin'}
            </button>
            <button
              onClick={handleSignOut}
              className="text-xs text-slate-400 hover:text-slate-600 font-bold transition-colors py-1"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 4. Access Denied (user authenticated but no valid console role)
  const hasConsoleAccess = ALLOWED_CONSOLE_ROLES.includes(role || '')

  if (!hasConsoleAccess) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-full flex items-center justify-center mb-6 text-red-500">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Access Restrained</h1>
        <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
          Your account ({user?.email || email}) does not have authorization to view this panel interface.
        </p>
        <div className="flex flex-col gap-3 items-center w-full max-w-xs">
          <button
            onClick={handleSignOut}
            className="w-full bg-white text-slate-500 border border-slate-250 hover:text-slate-900 py-2.5 rounded-xl transition-colors text-sm font-semibold shadow-sm"
          >
            Sign Out / Switch Account
          </button>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════
  //  5. AUTHENTICATED ADMIN PANEL
  // ═══════════════════════════════════════════════════════════

  // Only show tabs the user's role has access to
  const visibleNavItems = NAV_ITEMS.filter(item => item.roles.includes(role || ''))

  // Check if current path is authorized for this role
  const isAuthorized = (() => {
    if (role === 'super_admin') return true
    const currentItem = NAV_ITEMS.find(item =>
      item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path)
    )
    return currentItem ? currentItem.roles.includes(role || '') : true
  })()

  const currentNavItem = NAV_ITEMS.find(item =>
    item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path)
  )
  const currentModuleName = currentNavItem?.name || 'this panel'

  return (
    <AdminProvider value={{ fetchSignal, role }}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row relative z-50 font-sans">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-0VV0R0ELZS" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-0VV0R0ELZS');
        `}</Script>

        {/* Mobile Top Bar */}
        <div className="lg:hidden w-full bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link href="/admin" className="flex items-center gap-3">
            <img src="/lightmode_Logo.png" alt="Primescore" className="h-6 w-auto" />
            <span className="text-md font-bold tracking-tight text-slate-900">Portal</span>
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 text-slate-500 hover:text-slate-900 transition-colors">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <aside className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-6 h-screen sticky top-0`}>
          <div className="flex flex-col gap-8">
            {/* Logo / Title */}
            <Link href="/admin" className="hidden lg:flex items-center gap-3 py-2">
              <img src="/lightmode_Logo.png" alt="Primescore" className="h-8 w-auto" />
              <span className="text-lg font-bold tracking-tight text-slate-900">Admin</span>
            </Link>

            {/* Navigation Links — only visible/accessible tabs */}
            <nav className="flex flex-col gap-1.5">
              {visibleNavItems.map((item) => {
                const Icon = item.icon
                const isActive = item.path === '/admin' ? pathname === '/admin' : pathname.startsWith(item.path)
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all relative group ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-600 transition-colors'} />
                      {item.name}
                    </div>
                    {isActive && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-600"></div>}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* User Footer Profile */}
          <div className="flex flex-col gap-4 border-t border-slate-200 pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold text-sm">
                {email[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 font-semibold tracking-wider uppercase">{role?.replace('_', ' ') || 'Guest'}</p>
                <p className="text-xs text-slate-600 font-medium truncate">{email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-100 hover:bg-red-50 transition-all text-xs font-semibold"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Background shadow for mobile sidebar */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden"
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-6 sm:p-8 lg:p-10 relative overflow-y-auto max-h-screen">
          {isAuthorized ? (
            children
          ) : (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.03),transparent_50%)] pointer-events-none"></div>
              <div className="w-16 h-16 bg-rose-50 border border-rose-100 rounded-2xl flex items-center justify-center mb-6 text-rose-500 shadow-sm">
                <Lock size={28} className="animate-pulse" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2">Module Locked</h1>
              <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                Your current account role (<span className="font-semibold text-slate-700 capitalize">{role?.replace('_', ' ') || 'Guest'}</span>) is restricted from viewing the <span className="font-semibold text-slate-700">{currentModuleName}</span> module.
              </p>
              <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                Please contact a Super Admin or manager if you believe this is an error or if you need access privileges.
              </p>
            </div>
          )}
        </main>
      </div>
    </AdminProvider>
  )
}

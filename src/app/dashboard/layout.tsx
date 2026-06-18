'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, SkipForward, Palmtree, PlusCircle, FileText, LogOut, Menu, User, ShoppingBag, Milk } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/skip', icon: SkipForward, label: 'Skip Day' },
  { href: '/dashboard/vacation', icon: Palmtree, label: 'Vacation' },
  { href: '/dashboard/extra', icon: PlusCircle, label: 'Extra Milk' },
  { href: '/dashboard/bills', icon: FileText, label: 'My Bills' },
  { href: '/shop', icon: ShoppingBag, label: 'Farm Shop' },
  { href: '/account', icon: User, label: 'Account' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [profileName, setProfileName] = useState('Customer')
  const [profilePhone, setProfilePhone] = useState('')
  const [status, setStatus] = useState<string>('active')

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/customer/dashboard')
        const data = await res.json()
        if (data.success && data.profile) {
          setProfileName(data.profile.full_name || 'Customer')
          setProfilePhone(data.profile.phone || '')
          if (data.subscription) {
            setStatus(data.subscription.status)
          }
        }
      } catch (err) {
        console.error('Failed to load layout profile details')
      }
    }
    fetchProfile()
  }, [])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex bg-cream-50 font-body text-brown-800">
      
      {/* Desktop Sidebar (lg:flex) */}
      <aside className="hidden lg:flex flex-col w-64 bg-cream-100 fixed top-0 bottom-0 left-0 z-30 border-r border-border shadow-shadow shadow-md">
        
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-border/60">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-brown-800 shadow-sm transition-transform duration-500 group-hover:rotate-[360deg]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4.5 h-4.5">
                <path d="M5 10c0-2 2-3 4-3h6c2 0 4 1 4 3" />
                <path d="M5 10v6c0 2 2 3 4 3h6c2 0 4-1 4-3v-6" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-black text-brown-800 leading-tight">Amruth Milk</p>
              <p className="text-[9px] text-amber-600 font-black uppercase tracking-wider">Subscriber Panel</p>
            </div>
          </Link>
        </div>

        {/* Customer Profile Banner */}
        <div className="px-6 py-5 border-b border-border/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cream-200 text-brown-800 font-extrabold text-sm flex items-center justify-center flex-shrink-0 border border-border">
              {profileName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold text-brown-800 truncate">{profileName}</p>
              <p className="text-[10px] font-semibold text-brown-600 truncate">{profilePhone}</p>
            </div>
          </div>
          <div className="mt-3">
            {status === 'active' && (
              <span className="text-[9px] font-black uppercase tracking-wider text-green-600 bg-green-50 border border-green-200 rounded-full px-2.5 py-0.5 inline-block">
                ● Active Plan
              </span>
            )}
            {status === 'paused' && (
              <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-0.5 inline-block">
                ● Paused Plan
              </span>
            )}
            {status === 'pending_payment' && (
              <span className="text-[9px] font-black uppercase tracking-wider text-red-500 bg-red-50 border border-red-200 rounded-full px-2.5 py-0.5 inline-block">
                ● Payment Due
              </span>
            )}
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Customer Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold transition-all duration-150',
                  isActive 
                    ? 'bg-cream-200 text-brown-800 border-l-[3.5px] border-amber-500 shadow-sm' 
                    : 'text-brown-600 hover:bg-cream-50 hover:text-brown-800'
                )}
              >
                <Icon size={16} className={isActive ? 'text-amber-500' : 'text-brown-600'} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout block */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-sm font-extrabold text-brown-400 hover:bg-red-50 hover:text-red-500 transition-colors border-none bg-transparent cursor-pointer text-left"
          >
            <LogOut size={16} /> 
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col min-w-0 pb-20 lg:pb-0">
        
        {/* Mobile Header Bar */}
        <div className="lg:hidden sticky top-0 z-20 bg-cream-100 px-4 py-3 flex items-center justify-between border-b border-border shadow-sm">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-brown-800 shadow-sm">
              <Milk size={14} />
            </div>
            <span className="text-sm font-black text-brown-800 font-display">Amruth Milk</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-brown-600 truncate max-w-[80px]">{profileName}</span>
            <button
              onClick={handleLogout}
              className="p-1 rounded bg-cream-200 border border-border text-brown-600 hover:text-red-500 bg-transparent"
              aria-label="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* Page children container */}
        <div className="flex-1 p-5 md:p-8 animate-fade-in">
          {children}
        </div>

        {/* Mobile Bottom Tab Bar */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-warm-white border-t border-border flex z-30 shadow-[0_-4px_16px_rgba(180,140,60,0.08)]" aria-label="Mobile Bottom Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-0.5 py-3 text-brown-400 hover:text-amber-500 transition-colors min-w-0",
                  isActive && "text-amber-500 font-bold"
                )}
              >
                <Icon size={18} />
                <span className="text-[9px] font-black truncate">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </main>
    </div>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Truck,
  Users,
  CreditCard,
  Package,
  BarChart2,
  LogOut,
  Globe,
  Menu,
  X,
  Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/utils/supabase/client'

const adminNavItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/delivery', icon: Truck, label: "Today's Delivery" },
  { href: '/admin/customers', icon: Users, label: 'Customers' },
  { href: '/admin/billing', icon: CreditCard, label: 'Billing' },
  { href: '/admin/products', icon: Package, label: 'Capacity Management' },
  { href: '/admin/reports', icon: BarChart2, label: 'Reports' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen flex bg-cream-50 font-body text-brown-800">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-cream-100 border-r border-border sticky top-0 h-screen z-30 flex-shrink-0 shadow-shadow shadow-md">
        
        {/* Sidebar Header */}
        <div className="px-6 py-8 border-b border-border/60">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-brown-800 shadow-md group-hover:rotate-[360deg] transition-all duration-500">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5">
                <path d="M5 10c0-2 2-3 4-3h6c2 0 4 1 4 3" />
                <path d="M5 10v6c0 2 2 3 4 3h6c2 0 4-1 4-3v-6" />
              </svg>
            </div>
            <div>
              <p className="text-base font-black text-brown-800 leading-none tracking-tight">Amruth</p>
              <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mt-1">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" aria-label="Admin Navigation">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold transition-all duration-150 relative group',
                  isActive
                    ? 'bg-cream-200 text-brown-800 border-l-[3.5px] border-amber-500 shadow-sm'
                    : 'text-brown-600 hover:bg-cream-50 hover:text-brown-800'
                )}
              >
                <Icon size={18} className={isActive ? 'text-amber-500' : 'text-brown-600'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-border/60 bg-cream-50/20">
          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black text-brown-600 hover:bg-cream-50 hover:text-brown-800 transition-all"
            >
              <Globe size={16} />
              <span>View Landing Site</span>
            </Link>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-xs font-black text-red-500 hover:bg-red-50 transition-all text-left cursor-pointer border-none bg-transparent"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <div
            className="w-72 bg-cream-100 text-brown-800 h-full flex flex-col shadow-2xl border-r border-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Header */}
            <div className="px-6 py-6 border-b border-border/60 flex items-center justify-between">
              <Link href="/admin" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-amber-400 flex items-center justify-center text-brown-800 shadow-md">
                  🥛
                </div>
                <div>
                  <p className="text-base font-black text-brown-800 leading-none">Amruth</p>
                  <p className="text-[10px] text-amber-600 font-black uppercase tracking-widest mt-1">Admin Panel</p>
                </div>
              </Link>
              <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-brown-600 hover:text-brown-800 cursor-pointer bg-transparent border-none outline-none">
                <X size={22} />
              </button>
            </div>

            {/* Mobile Nav */}
            <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-extrabold transition-all',
                      isActive ? 'bg-cream-200 text-brown-800 shadow-sm border-l-[3.5px] border-amber-500' : 'text-brown-600 hover:bg-cream-50 hover:text-brown-800'
                    )}
                  >
                    <Icon size={18} className={isActive ? 'text-amber-500' : 'text-brown-600'} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Footer */}
            <div className="p-5 border-t border-border/60 bg-cream-50/20">
              <div className="flex flex-col gap-1.5">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black text-brown-600 hover:bg-cream-50 hover:text-brown-800 transition-all"
                >
                  <Globe size={16} />
                  <span>View Landing Site</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-xl w-full text-xs font-black text-red-500 hover:bg-red-50 transition-all text-left cursor-pointer border-none bg-transparent"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content wrapper */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header Bar */}
        <header className="lg:hidden bg-cream-100 text-brown-800 px-6 py-4 flex items-center justify-between border-b border-border sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="text-brown-600 hover:text-brown-800 cursor-pointer transition-colors bg-transparent border-none outline-none"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
            <span className="text-base font-black tracking-tight text-brown-800">Amruth Admin</span>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-5 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}

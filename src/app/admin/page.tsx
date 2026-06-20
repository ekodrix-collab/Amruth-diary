import { createClient } from '@/utils/supabase/server'
import {
  Users, Wallet, Map, Droplets, CreditCard, Umbrella, PlusCircle, UserPlus,
  Package, Database, CheckCircle2, ShieldCheck, Activity, Search
} from 'lucide-react'

// Forces the page to be dynamically rendered to always fetch live counts
export const dynamic = 'force-dynamic'

export default async function AdminDashboardHome() {
  const supabase = await createClient()

  // Fetch all basic counts in parallel
  const [
    { count: totalCustomers },
    { count: totalSubscriptions },
    { count: totalProducts },
    { count: waitlistCount }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('waitlist').select('*', { count: 'exact', head: true }),
  ])

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            Dashboard
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Real-time overview of your database metrics.</p>
        </div>
        
        {/* Status Pills */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white border border-green-100 rounded-xl px-3 py-2 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600"><Database size={16}/></div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Database</p>
              <p className="text-xs font-bold text-green-600">Connected</p>
            </div>
          </div>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Customers" value={totalCustomers || 0} icon={Users} color="blue" />
        <MetricCard title="Active Subscriptions" value={totalSubscriptions || 0} icon={Wallet} color="sky" />
        <MetricCard title="Products in Catalog" value={totalProducts || 0} icon={Package} color="amber" />
        <MetricCard title="Waitlisted" value={waitlistCount || 0} icon={UserPlus} color="red" />
      </div>

      {/* QUICK LINKS GRID */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/customers" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-[#0066cc] hover:bg-blue-50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-[#0066cc] flex items-center justify-center group-hover:bg-[#0066cc] group-hover:text-white transition-colors"><Users size={20}/></div>
            <div>
              <p className="text-sm font-bold text-slate-800">Customers</p>
              <p className="text-xs font-medium text-slate-500">Manage profiles</p>
            </div>
          </a>
          <a href="/admin/subscriptions" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-[#0066cc] hover:bg-blue-50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors"><Wallet size={20}/></div>
            <div>
              <p className="text-sm font-bold text-slate-800">Subscriptions</p>
              <p className="text-xs font-medium text-slate-500">Manage plans</p>
            </div>
          </a>
          <a href="/admin/deliveries" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-[#0066cc] hover:bg-blue-50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-600 group-hover:text-white transition-colors"><Map size={20}/></div>
            <div>
              <p className="text-sm font-bold text-slate-800">Deliveries</p>
              <p className="text-xs font-medium text-slate-500">Dispatch tracking</p>
            </div>
          </a>
          <a href="/admin/billing" className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-[#0066cc] hover:bg-blue-50 transition-colors group">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors"><CreditCard size={20}/></div>
            <div>
              <p className="text-sm font-bold text-slate-800">Billing</p>
              <p className="text-xs font-medium text-slate-500">Payments & Invoices</p>
            </div>
          </a>
        </div>
      </div>

    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  const colorMap: any = {
    blue: { bg: 'bg-blue-50', text: 'text-[#0066cc]' },
    green: { bg: 'bg-green-50', text: 'text-green-600' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-500' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-500' },
    red: { bg: 'bg-red-50', text: 'text-red-500' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-500' },
  }
  const c = colorMap[color]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
      <div className="flex justify-between items-start mb-4">
        <div className={`w-10 h-10 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
      </div>
      <div>
        <p className="text-3xl font-black text-slate-800">{value}</p>
        <p className="text-xs font-bold text-slate-500 mt-1">{title}</p>
      </div>
    </div>
  )
}

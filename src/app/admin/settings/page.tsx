'use client'

import { useState, useEffect } from 'react'
import {
  Settings, Save, X, Activity, Users, MapPin, Tag, Database, Link,
  Search, ArrowUpRight, ArrowDownRight, ChevronRight, CheckCircle2,
  Bell, Shield, CreditCard, Building2, UserPlus, FileDown, RefreshCw, AlertTriangle
} from 'lucide-react'
import { ResponsiveContainer, LineChart, Line } from 'recharts'

// --- MOCK DATA ---
const sparklineDataBlue = [{ v: 2 }, { v: 2 }, { v: 2 }, { v: 3 }, { v: 3 }, { v: 3 }, { v: 3 }]
const sparklineDataGreen = [{ v: 10 }, { v: 12 }, { v: 12 }, { v: 13 }, { v: 14 }, { v: 14 }, { v: 14 }]
const sparklineDataPurple = [{ v: 2 }, { v: 2 }, { v: 3 }, { v: 3 }, { v: 4 }, { v: 4 }, { v: 4 }]
const sparklineDataSky = [{ v: 100 }, { v: 100 }, { v: 99 }, { v: 100 }, { v: 100 }, { v: 100 }, { v: 100 }]
const sparklineDataAmber = [{ v: 1 }, { v: 2 }, { v: 3 }, { v: 4 }, { v: 5 }, { v: 6 }, { v: 7 }]
const sparklineDataRed = [{ v: 1 }, { v: 1 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: 2 }, { v: 2 }]

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('General')
  
  // Form State
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [allowWaitlist, setAllowWaitlist] = useState(true)
  const [autoApprove, setAutoApprove] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-800">
            <Settings size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Platform Settings</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">Configure core application behaviors, roles, and integrations.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 shadow-sm transition-all"><X size={16} /> Discard</button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#0066cc] rounded-xl text-xs font-bold text-white bg-[#0066cc] hover:bg-blue-700 shadow-sm transition-all">
            <Save size={16} /> Save Changes
          </button>
        </div>
      </div>

      {/* METRICS GRID WITH SPARKLINES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <MetricCard title="Active Staff" value="3 Users" subtext="Admin, Managers" trend="+ 1" isUp icon={Users} color="blue" sparkData={sparklineDataBlue} />
        <MetricCard title="Delivery Zones" value="14" subtext="Active pin codes" trend="+ 2" isUp icon={MapPin} color="green" sparkData={sparklineDataGreen} />
        <MetricCard title="Pricing Plans" value="4 Plans" subtext="Standard & Custom" trend="+ 1" isUp icon={Tag} color="purple" sparkData={sparklineDataPurple} />
        <MetricCard title="System Status" value="Online" subtext="100% Uptime" trend="Stable" isUp icon={Activity} color="sky" sparkData={sparklineDataSky} />
        <MetricCard title="Last Backup" value="03:00 AM" subtext="Today (Success)" trend="Fixed" isUp={false} icon={Database} color="amber" sparkData={sparklineDataAmber} />
        <MetricCard title="Integrations" value="2 Active" subtext="Stripe, Twilio" trend="Fixed" isUp icon={Link} color="red" sparkData={sparklineDataRed} />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
        
        {/* LEFT COLUMN: SETTINGS INTERFACE */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[500px]">
          
          {/* Vertical Tabs Sidebar */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 bg-slate-50/50 p-4 space-y-1">
            <TabButton icon={Building2} label="General" active={activeTab === 'General'} onClick={() => setActiveTab('General')} />
            <TabButton icon={Users} label="Staff & Roles" active={activeTab === 'Staff & Roles'} onClick={() => setActiveTab('Staff & Roles')} />
            <TabButton icon={MapPin} label="Delivery Zones" active={activeTab === 'Delivery Zones'} onClick={() => setActiveTab('Delivery Zones')} />
            <TabButton icon={CreditCard} label="Billing & Tax" active={activeTab === 'Billing & Tax'} onClick={() => setActiveTab('Billing & Tax')} />
            <TabButton icon={Bell} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
            <TabButton icon={Link} label="Integrations" active={activeTab === 'Integrations'} onClick={() => setActiveTab('Integrations')} />
            <div className="pt-4 mt-4 border-t border-slate-200/60">
              <TabButton icon={Shield} label="Security" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
            </div>
          </div>

          {/* Form Content Area */}
          <div className="flex-1 p-6 lg:p-8">
            <h2 className="text-lg font-black text-slate-800 mb-6">{activeTab} Settings</h2>

            {activeTab === 'General' && (
              <div className="space-y-8 max-w-xl">
                
                {/* Text Inputs */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Business Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Farm/Business Name</label>
                      <input type="text" defaultValue="Amruth Dairy" className="w-full px-3 py-2 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Support Email</label>
                      <input type="email" defaultValue="support@amruthdairy.com" className="w-full px-3 py-2 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Contact Phone</label>
                      <input type="text" defaultValue="+91 98765 43210" className="w-full px-3 py-2 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Currency</label>
                      <select className="w-full px-3 py-2 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                        <option>INR (₹)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Platform Behavior</h3>
                  
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">Maintenance Mode</span>
                      <span className="text-[10px] font-medium text-slate-500 mt-0.5">Disable customer app access for updates.</span>
                    </div>
                    <ToggleSwitch checked={maintenanceMode} onChange={() => setMaintenanceMode(!maintenanceMode)} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">Allow Waitlist Signups</span>
                      <span className="text-[10px] font-medium text-slate-500 mt-0.5">Let new users join the queue when capacity is full.</span>
                    </div>
                    <ToggleSwitch checked={allowWaitlist} onChange={() => setAllowWaitlist(!allowWaitlist)} />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800">Auto-Approve Deliveries</span>
                      <span className="text-[10px] font-medium text-slate-500 mt-0.5">Skip manual verification if delivery boy marks complete.</span>
                    </div>
                    <ToggleSwitch checked={autoApprove} onChange={() => setAutoApprove(!autoApprove)} />
                  </div>

                </div>

              </div>
            )}

            {activeTab !== 'General' && (
              <div className="flex flex-col items-center justify-center h-full opacity-50">
                <Settings size={48} className="text-slate-300 mb-4" />
                <p className="text-sm font-bold text-slate-400">Settings module for {activeTab} goes here.</p>
              </div>
            )}
            
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Admin Activity Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-6">System Activity</h2>
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
              
              <ActivityItem 
                user="Admin (You)" 
                action="Updated Pricing Plan" 
                detail="Changed Standard from ₹60 to ₹65."
                time="2 hours ago" 
                color="blue"
              />
              <ActivityItem 
                user="System" 
                action="Database Backup" 
                detail="Successfully backed up 2.4GB data."
                time="03:00 AM" 
                color="amber"
              />
              <ActivityItem 
                user="Manager (Rahul)" 
                action="Added Delivery Zone" 
                detail="Pin code 560102 added."
                time="Yesterday" 
                color="green"
              />
              
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-3 gap-3">
              <QuickActionButton icon={UserPlus} label="Invite Staff" color="blue" />
              <QuickActionButton icon={MapPin} label="Edit Zones" color="emerald" />
              <QuickActionButton icon={Database} label="Backup Now" color="amber" />
              <QuickActionButton icon={Link} label="API Keys" color="purple" />
              <QuickActionButton icon={FileDown} label="Logs Export" color="slate" />
              <QuickActionButton icon={AlertTriangle} label="Clear Cache" color="red" />
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}

// --- SUBCOMPONENTS ---

function MetricCard({ title, value, subtext, trend, isUp, icon: Icon, color, sparkData }: any) {
  const colorMap: any = {
    blue: { bg: 'bg-blue-50', text: 'text-[#0066cc]', stroke: '#0066cc' },
    green: { bg: 'bg-green-50', text: 'text-green-600', stroke: '#22c55e' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-500', stroke: '#f59e0b' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-500', stroke: '#8b5cf6' },
    red: { bg: 'bg-red-50', text: 'text-red-500', stroke: '#ef4444' },
    sky: { bg: 'bg-sky-50', text: 'text-sky-500', stroke: '#0ea5e9' },
  }
  const c = colorMap[color]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[140px]">
      <div className="flex justify-between items-start mb-2 relative z-10">
        <div className={`w-8 h-8 rounded-xl ${c.bg} ${c.text} flex items-center justify-center`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-bold text-slate-500 mb-0.5">{title}</p>
        <p className="text-xl font-black text-slate-800">{value}</p>
        <div className="flex flex-col mt-1">
          <span className="text-[9px] font-bold text-slate-400">{subtext}</span>
          {trend && (
             <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-0.5 ${trend === 'Fixed' || trend === 'Stable' ? 'text-slate-400' : isUp === false ? 'text-red-500' : 'text-green-600'}`}>
              {trend !== 'Fixed' && trend !== 'Stable' && (isUp === false ? <ArrowDownRight size={10}/> : <ArrowUpRight size={10}/>)}
              {trend}
            </span>
          )}
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[40px] pointer-events-none">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line type="monotone" dataKey="v" stroke={c.stroke} strokeWidth={2} dot={{ r: 2, fill: c.stroke, strokeWidth: 1, stroke: '#fff' }} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function TabButton({ icon: Icon, label, active, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold ${
        active 
          ? 'bg-white shadow-sm border border-slate-200 text-[#0066cc]' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 border border-transparent'
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  )
}

function ToggleSwitch({ checked, onChange }: any) {
  return (
    <div 
      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-[#0066cc]' : 'bg-slate-300'}`}
      onClick={onChange}
    >
      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  )
}

function ActivityItem({ user, action, detail, time, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-[#0066cc] border-white',
    amber: 'bg-amber-50 text-amber-500 border-white',
    green: 'bg-green-50 text-green-600 border-white',
  }
  return (
    <div className="relative flex items-start gap-4">
      <div className={`absolute left-0 w-6 h-6 rounded-full border-4 z-10 flex items-center justify-center bg-white ${colorMap[color].split(' ')[1]}`}>
        <div className={`w-2 h-2 rounded-full ${colorMap[color].split(' ')[0] === 'bg-blue-50' ? 'bg-[#0066cc]' : colorMap[color].split(' ')[0] === 'bg-amber-50' ? 'bg-amber-500' : 'bg-green-600'}`} />
      </div>
      <div className="ml-8 flex flex-col">
        <span className="text-[11px] font-bold text-slate-800">{user} <span className="font-medium text-slate-500 ml-1">{action}</span></span>
        <span className="text-[10px] text-slate-500 mt-0.5">{detail}</span>
        <span className="text-[9px] font-bold text-slate-400 mt-1">{time}</span>
      </div>
    </div>
  )
}

function QuickActionButton({ icon: Icon, label, color }: any) {
  const colorMap: any = {
    blue: 'bg-blue-50 text-[#0066cc] hover:bg-[#0066cc] border-blue-100',
    emerald: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-600 border-purple-100',
    amber: 'bg-amber-50 text-amber-500 hover:bg-amber-500 border-amber-100',
    sky: 'bg-sky-50 text-sky-500 hover:bg-sky-500 border-sky-100',
    slate: 'bg-slate-50 text-slate-600 hover:bg-slate-600 border-slate-200',
    red: 'bg-red-50 text-red-500 hover:bg-red-500 border-red-100',
  }
  return (
    <button className="flex flex-col items-center justify-center p-3 text-center rounded-xl bg-white border border-slate-100 hover:border-slate-200 shadow-sm transition-all group">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors mb-2 ${colorMap[color]} group-hover:text-white border`}>
        <Icon size={14} />
      </div>
      <span className="text-[9px] font-bold text-slate-600 leading-tight">{label}</span>
    </button>
  )
}

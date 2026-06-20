'use client'

import { Plus, Search, Filter } from 'lucide-react'

interface AdminHeaderProps {
  title: string;
  description: string;
  icon: any; // Lucide icon component
  actionLabel?: string;
  onAction?: () => void;
  onSearch?: (term: string) => void;
}

export function AdminHeader({ title, description, icon: Icon, actionLabel, onAction, onSearch }: AdminHeaderProps) {
  return (
    <div className="flex flex-col gap-6 mb-6">
      {/* Top Row: Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0066cc]">
            <Icon size={24} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{description}</p>
          </div>
        </div>
        
        {actionLabel && (
          <button 
            onClick={onAction}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#0066cc] text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-sm transition-all"
          >
            <Plus size={16} /> {actionLabel}
          </button>
        )}
      </div>

      {/* Bottom Row: Search & Filters (Standard for all CRUD pages) */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={`Search ${title.toLowerCase()}...`}
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" 
          />
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Filter size={16} /> Filters
        </button>
      </div>
    </div>
  )
}

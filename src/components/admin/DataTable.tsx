'use client'

import { ReactNode } from 'react'
import { Square, ChevronRight, Edit2, Trash2, Eye, Search } from 'lucide-react'

export interface ColumnDef<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
}

export function DataTable<T extends { id: string | number }>({ data, columns, isLoading, onEdit, onDelete, onView }: DataTableProps<T>) {
  
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-100 border-t-[#0066cc] rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-bold text-slate-500">Loading data...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Search size={24} className="text-slate-300" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No records found</h3>
        <p className="text-xs font-medium text-slate-500 mt-1">There is no data to display here yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="py-4 px-4 w-12 text-center"><Square size={14} className="text-slate-300 mx-auto"/></th>
              {columns.map((col, idx) => (
                <th key={idx} className={`py-4 px-4 text-[10px] uppercase font-bold text-slate-500 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>
                  {col.header}
                </th>
              ))}
              {(onEdit || onDelete || onView) && (
                <th className="py-4 px-4 text-[10px] uppercase font-bold text-slate-500 text-right">Actions</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50 transition-colors group">
                <td className="py-4 px-4 text-center"><Square size={14} className="text-slate-200 group-hover:text-slate-400 mx-auto cursor-pointer transition-colors"/></td>
                {columns.map((col, idx) => (
                  <td key={idx} className={`py-4 px-4 ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}`}>
                    {col.cell ? col.cell(row) : (row as any)[col.accessorKey as string]}
                  </td>
                ))}
                {(onEdit || onDelete || onView) && (
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {onView && (
                        <button onClick={() => onView(row)} className="p-1.5 text-slate-400 hover:text-[#0066cc] hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                          <Eye size={14}/>
                        </button>
                      )}
                      {onEdit && (
                        <button onClick={() => onEdit(row)} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={14}/>
                        </button>
                      )}
                      {onDelete && (
                        <button onClick={() => onDelete(row)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={14}/>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="border-t border-slate-100 p-4 flex items-center justify-between text-[11px] font-bold text-slate-500 bg-slate-50/50">
        <span>Showing {data.length} records</span>
        <div className="flex items-center gap-2">
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-white text-slate-400 transition-colors"><ChevronRight size={14} className="rotate-180"/></button>
          <span className="px-2">Page 1 of 1</span>
          <button className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-white text-slate-400 transition-colors"><ChevronRight size={14}/></button>
        </div>
      </div>
    </div>
  )
}

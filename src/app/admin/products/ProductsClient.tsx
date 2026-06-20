'use client'

import { Package } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock_available: number;
  is_active: boolean;
}

export function ProductsClient({ data }: { data: Product[] }) {
  const columns: ColumnDef<Product>[] = [
    { header: 'Product Name', accessorKey: 'name' },
    { header: 'Category', accessorKey: 'category' },
    { header: 'Price', align: 'right', cell: (row) => `₹${row.price}` },
    { header: 'Stock', accessorKey: 'stock_available', align: 'right' },
    { header: 'Status', align: 'center', cell: (row) => <StatusBadge status={row.is_active ? 'Active' : 'Inactive'} /> },
  ]

  return (
    <div>
      <AdminHeader title="Products & Inventory" description="Manage product catalog, pricing, and stock levels." icon={Package} actionLabel="Add Product" />
      <DataTable data={data} columns={columns} />
    </div>
  )
}

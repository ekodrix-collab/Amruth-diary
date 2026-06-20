'use client'

import { Wallet } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { DataTable, ColumnDef } from '@/components/admin/DataTable'
import { StatusBadge } from '@/components/admin/StatusBadge'

interface SubscriptionData {
  id: string;
  start_date: string;
  status: string;
  current_quantity_litres: number;
  profiles: { full_name: string };
  subscription_plans: { name: string };
}

export function SubscriptionsClient({ data }: { data: SubscriptionData[] }) {
  const columns: ColumnDef<SubscriptionData>[] = [
    { header: 'Customer', cell: (row) => row.profiles?.full_name || 'Unknown' },
    { header: 'Plan', cell: (row) => row.subscription_plans?.name || 'Custom Plan' },
    { header: 'Qty (L)/Day', align: 'right', cell: (row) => `${row.current_quantity_litres} L` },
    { header: 'Start Date', cell: (row) => new Date(row.start_date).toLocaleDateString() },
    { header: 'Status', align: 'center', cell: (row) => <StatusBadge status={row.status} /> },
  ]

  return (
    <div>
      <AdminHeader title="Subscriptions" description="Manage recurring milk delivery plans." icon={Wallet} actionLabel="New Subscription" />
      <DataTable data={data} columns={columns} />
    </div>
  )
}

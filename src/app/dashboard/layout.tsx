import { AdminSidebar, AdminMobileTopBar } from './AdminNav'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#0B0C0F' }}>
      <AdminSidebar />
      <AdminMobileTopBar />
      <div className="lg:pl-60">
        {children}
      </div>
    </div>
  )
}

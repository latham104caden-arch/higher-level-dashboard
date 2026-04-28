import { Sidebar, MobileTopBar } from './Sidebar'

export default function DemoDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: '#0B0C0F' }}>
      <Sidebar />
      <MobileTopBar />
      <div className="lg:pl-60">
        {children}
      </div>
    </div>
  )
}

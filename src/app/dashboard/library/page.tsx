import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { AdminNav } from '../AdminNav'
import AdLibraryTool from './AdLibraryTool'

export default async function AdLibraryPage() {
  const session = await getSession()
  if (!session) redirect('/')
  if (session.role === 'client') redirect('/client')

  return (
    <div className="min-h-screen" style={{ background: '#0B0C0F' }}>
      <AdminNav />

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
        <div className="mb-10">
          <p className="text-xs font-medium mb-3" style={{ color: '#5C606C' }}>Agency Tools</p>
          <h1 className="font-serif italic text-3xl sm:text-4xl tracking-tight mb-2" style={{ color: '#F4F5F8' }}>Ad Library</h1>
          <p className="text-base" style={{ color: '#8A8F98' }}>
            Search any competitor and launch into Meta Ad Library with filters pre-built — active, video, image, inactive, multi-country. Plus one-click intel for every client.
          </p>
        </div>

        <AdLibraryTool />
      </main>
    </div>
  )
}

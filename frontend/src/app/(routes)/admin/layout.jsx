"use client";

import AdminSidePanel from '@/app/components/AdminSidePanel.jsx'
import { Menu, X } from 'lucide-react'
import React, { useState } from 'react'

const AdminlayoutPage = ({children}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="relative flex h-screen min-h-0 w-full min-w-0 overflow-hidden">
      <aside className="hidden h-full w-64 shrink-0 border-r lg:block">
        <AdminSidePanel />
      </aside>

      {isSidebarOpen ? (
        <>
          <button
            type="button"
            aria-label="Close admin navigation"
            className="absolute inset-0 z-40 bg-slate-950/40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 z-50 w-64 border-r bg-white shadow-xl lg:hidden">
            <div className="flex h-14 items-center justify-end border-b px-3">
              <button
                type="button"
                aria-label="Close admin navigation"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>
            <AdminSidePanel onNavigate={() => setIsSidebarOpen(false)} />
          </aside>
        </>
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="sticky top-0 z-30 flex h-14 shrink-0 items-center border-b bg-white px-3 lg:hidden">
          <button
            type="button"
            aria-label="Open admin navigation"
            aria-expanded={isSidebarOpen}
            onClick={() => setIsSidebarOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            <Menu size={20} />
            <span>Menu</span>
          </button>
        </div>
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  )
}

export default AdminlayoutPage

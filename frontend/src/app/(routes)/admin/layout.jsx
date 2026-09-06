import AdminSidePanel from '@/app/components/AdminSidePanel.jsx'
import React from 'react'

const AdminlayoutPage = ({children}) => {
  return (
    <div className='flex h-screen'>
        <div className="w-64 h-full"><AdminSidePanel/></div>
        <div className='w-full bg-cyan-200'>{children}</div>
      
    </div>
  )
}

export default AdminlayoutPage

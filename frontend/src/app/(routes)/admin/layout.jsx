import AdminSidePanel from '@/app/components/AdminSidePanel.jsx'
import React from 'react'

const AdminlayoutPage = ({children}) => {
  return (
    <div className='flex h-screen'>
        <div className="w-64 h-full border-r"><AdminSidePanel/></div>
        <div className='w-full'>{children}</div>
      
    </div>
  )
}

export default AdminlayoutPage

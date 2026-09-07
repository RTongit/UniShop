import React from 'react'
import Navbar from './Navbar.js'

const AuthLoadingShell = () => {
  return (
        <div className="min-h-screen bg-white">

            {/* Your normal navbar */}
            <Navbar />

            {/* Auth loading */}
            <main className="min-h-[calc(100vh-91px)] flex items-center justify-center">

                <div className="text-center">

                    <div className="w-10 h-10 mx-auto border-6 border-gray-200 border-t-black rounded-full animate-spin" />

                    <p className="mt-5 text-lg font-semibold text-gray-700">
                        Starting UniShop...
                    </p>

                    <p className="mt-1 text-sm text-gray-400">
                        Connecting to the server
                    </p>

                </div>

            </main>

        </div>
  )
}

export default AuthLoadingShell

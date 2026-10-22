import { Toaster } from "sonner"
import AuthCheckComponent from "./components/AuthCheckComponent.js"
import Navbar from "./components/Navbar.js"
import "./globals.css"
import {Poppins} from "next/font/google"

export const metadata = {
  title : "Uni Shop",
  description : "Come and use Uni Shop.Your one stop shop"
}
const poppins = Poppins({
  subsets : ["latin"],
  weight : ["400","500","600","700"]
})

export default function RootLayout({children}) {
  return (
    <html lang="en" className={poppins.className}>
      <body>
        <Toaster position="top-center"/>
        <AuthCheckComponent>
          <Navbar/>
          {children}
        </AuthCheckComponent>
      </body>
    </html>
  )
}
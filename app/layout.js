import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { AppProvider } from '../context/AppContext'
import { NotificationProvider } from '../context/NotificationContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'TaskTrail - Bug Tracker',
  description: 'A comprehensive bug tracking and task management application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </AppProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  )
}
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import './globals.css'

import { Inter, Space_Grotesk } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const inter= Inter({
  subsets: ['latin'],
  weight: ['100','200','300','400','500','600','700','800','900'],

  variable: '--font-inter'
})

const SpaceGrotesk= Space_Grotesk({
  subsets: ['latin'],
  weight: ['300','400','500','600','700'],
  variable: '--font-inter-spaceGrotesk'
})

export const metadata: Metadata = {
  title: 'DevFlow Application',
  description: 'Une plateforme communautaire où les développeurs peuvent poser des questions, partager leurs connaissances et collaborer sur des problèmes techniques. Grâce à un système de votes et de tags, les utilisateurs trouvent rapidement les meilleures réponses et solutions',
  icons: {
    icon: '/public/assets/images/site-logo.svg'
  }

}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
    appearance={{
      elements: {
        formButtonPrimary: 'primary-gradient',
        footerActionLink : 'primary-text-gradient hover :text-primary-500'
      
      }
    }}>
      <html lang="en">
      
        <body className={`${inter.variable}  ${SpaceGrotesk.variable}`}> 
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import "../styles/prism.css";

import { Inter, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-spaceGrotesk",
});

export const metadata: Metadata = {
  title: "Ensias bDarija Application",
  description:
    "Une plateforme communautaire où les développeurs peuvent poser des questions, partager leurs connaissances et collaborer sur des problèmes techniques. Grâce à un système de votes et de tags, les utilisateurs trouvent rapidement les meilleures réponses et solutions.",
  icons: {
    icon: "/public/assets/images/site-logo.svg",
  },
  openGraph: {
    title: "Ensias bDarija Application",
    description:
      "Une plateforme communautaire où les développeurs peuvent poser des questions et collaborer sur des problèmes techniques.",
    url: "https://ton-site.com",
    type: "website",
    images: [
      {
        url: "/public/assets/images/metadata.png", // Remplace avec le chemin de ton image
        width: 1200,
        height: 630,
        alt: "Ensias bDarija - Plateforme communautaire pour développeurs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ensias bDarija Application",
    description:
      "Une plateforme communautaire où les développeurs peuvent poser des questions et collaborer sur des problèmes techniques.",
    images: ["/public/assets/images/metadata.png"],
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable}  ${spaceGrotesk.variable} overflow-x-hidden`}
      >
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: "primary-gradient",
              footerActionLink: "primary-text-gradient hover :text-primary-500",
            },
          }}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}

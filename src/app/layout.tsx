import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, Fira_Code } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

// SEO Metadata
export const metadata: Metadata = {
  metadataBase: new URL("https://chiragkumar.dev"),
  title: {
    default: "Chirag Kumar | SDE 2 at Junglee Games | Full Stack Engineer",
    template: "%s | Chirag Kumar",
  },
  description:
    "Portfolio of Chirag Kumar - SDE 2 at Junglee Games with 2.5+ years of experience building scalable systems, payment integrations, and gamification features impacting 800K+ users. Expert in Node.js, React.js, Next.js, and TypeScript.",
  keywords: [
    "Chirag Kumar",
    "Full Stack Engineer",
    "Frontend Engineer",
    "SDE 2",
    "Junglee Games",
    "React.js",
    "Next.js",
    "Node.js",
    "TypeScript",
    "JavaScript",
    "Portfolio",
    "Software Engineer",
    "Web Developer",
    "MERN Stack",
    "Gurugram",
  ],
  authors: [{ name: "Chirag Kumar", url: "https://chiragkumar.dev" }],
  creator: "Chirag Kumar",
  publisher: "Chirag Kumar",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chiragkumar.dev",
    siteName: "Chirag Kumar Portfolio",
    title: "Chirag Kumar | SDE 2 at Junglee Games | Full Stack Engineer",
    description:
      "Portfolio of Chirag Kumar - SDE 2 at Junglee Games building scalable systems for 800K+ users. Expert in Node.js, React.js, Next.js, TypeScript.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chirag Kumar - Full Stack Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chirag Kumar | SDE 2 at Junglee Games",
    description:
      "Full Stack Engineer building scalable systems for 800K+ users",
    creator: "@ChiragKrKashya1",
    images: ["/og-image.png"],
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://chiragkumar.dev",
  },
};

export const viewport: Viewport = {
  themeColor: "#f8fafc",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Chirag Kumar",
  url: "https://chiragkumar.dev",
  image: "https://chiragkumar.dev/profile.png",
  sameAs: [
    "https://www.linkedin.com/in/chirag-kr/",
    "https://github.com/chirag1261",
    "https://twitter.com/ChiragKrKashya1",
  ],
  jobTitle: "SDE 2 — Full Stack Engineer",
  worksFor: {
    "@type": "Organization",
    name: "Junglee Games",
  },
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Vellore Institute of Technology",
    },
    {
      "@type": "CollegeOrUniversity",
      name: "Kristu Jayanti College",
    },
  ],
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "React.js",
    "Next.js",
    "Node.js",
    "Nest.js",
    "MongoDB",
    "AWS",
    "Distributed Systems",
    "System Design",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${firaCode.variable} antialiased`}
      >
        <ThemeProvider>
          <SmoothScroll>
            <div className="relative min-h-screen">
              <Navbar />
              <main>{children}</main>
              <Footer />
            </div>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata } from 'next'
import { Sora, DM_Sans, JetBrains_Mono, Caveat } from 'next/font/google'
import Script from 'next/script'
import '../src/index.css'
import { ConditionalHeader, ConditionalFooter } from '../src/components/layout/ConditionalHeaderFooter'
import Preloader from '../src/components/ui/Preloader'
import AnalyticsTracker from '../src/components/layout/AnalyticsTracker'

const sora = Sora({ subsets: ['latin'], variable: '--font-inter' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-outfit' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' })

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-0VV0R0ELZS'
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID || 'y063uog05n'
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1540216978146277'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.primescore.in'),
  title: {
    default: 'Primescore — Fix Your CIBIL Score. Unlock Your Future.',
    template: '%s | Primescore',
  },
  description:
    'Primescore is India’s leading CIBIL repair and correction agency. We dispute credit report errors, remove illegitimate defaults, and boost your credit score legally in 90 days. Trusted by 50,000+ Indians.',
  keywords: [
    'credit repair India', 
    'CIBIL score repair', 
    'credit rectification services', 
    'boost CIBIL score', 
    'remove CIBIL defaults', 
    'Primescore', 
    'credit score improvement India',
    'cibil repair agency',
    'cibil correction agency',
    'cibil rectification agency',
    'cibil repair services',
    'cibil score rectification services',
    'cibil score repair agency near me',
    'primescore financial',
    'prime score financial',
    'primescore fintech private limited'
  ],
  manifest: '/manifest.json',
  themeColor: '#0B132B',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Primescore',
  },
  icons: {
    icon: '/primescore-logo-tab.png',
    apple: '/primescore-logo-tab.png',
  },
  openGraph: {
    title: 'Primescore — Credit Rectification Experts',
    description: 'Fix your credit score legally and unlock your financial future.',
    siteName: 'Primescore',
    type: 'website',
    locale: 'en_IN',
    url: 'https://www.primescore.in',
    images: [{ url: '/lightmode_Logo.png', width: 1200, height: 630, alt: 'Primescore' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Primescore — Fix Your CIBIL Score',
    description: 'Dispute credit errors and boost your CIBIL score legally in 90 days.',
    images: ['/lightmode_Logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
  },
  alternates: {
    canonical: 'https://www.primescore.in',
    languages: {
      'en-IN': 'https://www.primescore.in',
      'hi-IN': 'https://www.primescore.in/hi',
      'ta-IN': 'https://www.primescore.in/ta',
      'te-IN': 'https://www.primescore.in/te',
      'kn-IN': 'https://www.primescore.in/kn',
      'ml-IN': 'https://www.primescore.in/ml',
      'mr-IN': 'https://www.primescore.in/mr',
      'gu-IN': 'https://www.primescore.in/gu',
      'bn-IN': 'https://www.primescore.in/bn',
      'pa-IN': 'https://www.primescore.in/pa',
      'ur-IN': 'https://www.primescore.in/ur',
    }
  },
}

// Organization JSON-LD Schema — tells Google AI exactly who Primescore is
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Primescore',
  url: 'https://www.primescore.in',
  logo: 'https://www.primescore.in/lightmode_Logo.png',
  description: 'Primescore is an iStart (Govt. of Rajasthan) recognized startup providing expert credit rectification, CIBIL score repair, and financial advisory services across India.',
  foundingDate: '2022',
  areaServed: 'IN',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91-6350671636',
    contactType: 'customer service',
    email: 'info@primescore.in',
    availableLanguage: ['English', 'Hindi'],
  },
  sameAs: [
    'https://www.primescore.in',
  ],
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'IN',
    addressRegion: 'Rajasthan',
  },
}

// WebSite schema — enables Google Sitelinks Search Box in AI results
const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Primescore',
  url: 'https://www.primescore.in',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://www.primescore.in/blog?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

// Global FAQ Schema — powers expandable FAQ boxes in Google AI Overviews
const globalFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is credit rectification?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Credit rectification is a legal process of identifying and disputing errors, outdated entries, or illegitimate defaults in your CIBIL or credit report. Primescore handles the end-to-end process including report analysis, formal dispute filing with credit bureaus, and follow-ups.',
      },
    },
    {
      '@type': 'Question',
      name: 'How long does CIBIL score repair take?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Credit rectification typically takes 60–90 days for bureaus like CIBIL, Experian, and Equifax to process disputes and update records. Primescore monitors the process and follows up on your behalf.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is credit rectification legal in India?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Credit rectification is fully legal and governed by the Credit Information Companies (Regulation) Act, 2005. Primescore follows a strict legal and document-backed process for all disputes.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much does Primescore charge for credit repair?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Primescore offers transparent pricing with no hidden fees. Visit our pricing page at primescore.in/pricing for the latest plans.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can Primescore help with settled loan entries on CIBIL?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Primescore specializes in disputing "Settled" and "Written-Off" entries that are outdated or incorrect. We coordinate directly with banks and credit bureaus to update these statuses legally.',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${caveat.variable}`}>
      <head>
        {/* JSON-LD Structured Data for Google AI Search */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(globalFaqSchema) }}
        />
      </head>
      <body className="relative min-h-screen bg-night font-body text-brandNavy">
        {/* Google Analytics 4 */}
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { page_path: window.location.pathname });
        `}</Script>

        {/* Microsoft Clarity */}
        <Script id="microsoft-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${CLARITY_ID}");
        `}</Script>

        {/* Meta Pixel (Facebook Pixel) */}
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}</Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>

        <Preloader />
        
        {/* Invisible Google Translate Element */}
        <div id="google_translate_element" style={{ display: 'none' }} />
        <Script id="google-translate-config" strategy="afterInteractive">{`
          window.googleTranslateElementInit = function() {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false
            }, 'google_translate_element');
          }
        `}</Script>
        <Script src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />

        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-heroRadial" />
          <div className="absolute inset-0 bg-dots opacity-[0.4]" />
        </div>
        <AnalyticsTracker />
        <ConditionalHeader />
        <main className="relative w-full">
          {children}
        </main>
        <ConditionalFooter />
      </body>
    </html>
  )
}

import type { Metadata } from 'next'
import Partner from '../../src/views/Partner'

export const metadata: Metadata = {
  title: 'Partner Referral Program | Primescore DSA & CA Referral Portal',
  description:
    'Turn rejected loan leads into instant gift cards. The dedicated referral platform for DSAs, Chartered Accountants, Financial Advisors, and Consultants.',
  keywords: [
    'primescore partner portal',
    'dsa referral program',
    'ca credit repair referral',
    'loan agent partner app',
    'financial advisor referral',
    'cibil dispute partner program'
  ],
  openGraph: {
    title: 'Partner with Primescore — Referral Platform for DSAs, CAs & Advisors',
    description: 'Turn your client leads into instant gift cards with live case tracking.',
    images: [{ url: '/Primescore Partner Portal.svg', width: 1200, height: 630, alt: 'Primescore Partner Portal' }],
  },
}

export default function PartnerPage() {
  return <Partner />
}

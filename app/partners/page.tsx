import type { Metadata } from 'next'
import Partner from '../../src/views/Partner'

export const metadata: Metadata = {
  title: 'Partner Referral Program | Primescore DSA & CA Referral Portal',
  description:
    'Turn rejected loan leads into instant gift cards. The dedicated referral platform for DSAs, Chartered Accountants, Financial Advisors, and Consultants.',
}

export default function PartnersPage() {
  return <Partner />
}

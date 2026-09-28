import type { Metadata } from 'next'
import Script from 'next/script'
import CityService from '../../../../src/views/CityService'
import { ALL_CITY_SLUGS, getCityBySlug, formatCityName } from '../../../../src/data/cities'

type Props = { params: Promise<{ city: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const cityInfo = getCityBySlug(city)
  const cityName = cityInfo?.name || formatCityName(city)
  const stateInfo = cityInfo?.state ? `, ${cityInfo.state}` : ''
  return {
    title: `Credit Rectification in ${cityName} — CIBIL Score Repair Experts`,
    description: `Primescore provides expert credit rectification services in ${cityName}${stateInfo}. Fix CIBIL errors, remove defaults, and improve your credit score in 90 days. Free consultation available.`,
    alternates: {
      canonical: `https://www.primescore.in/services/credit-rectification/${city}`,
    },
    openGraph: {
      title: `Credit Rectification in ${cityName} | Primescore`,
      description: `Fix CIBIL errors and remove illegitimate defaults in ${cityName}. Expert credit rectification services by Primescore.`,
      url: `https://www.primescore.in/services/credit-rectification/${city}`,
    },
  }
}

export async function generateStaticParams() {
  return ALL_CITY_SLUGS.map(city => ({ city }))
}

export default async function CityServicePage({ params }: Props) {
  const { city } = await params
  const cityInfo = getCityBySlug(city)
  const cityName = cityInfo?.name || formatCityName(city)

  // LocalBusiness + Service Schema for Google AI Overviews & Local Search
  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'FinancialService'],
    name: `Primescore — Credit Rectification in ${cityName}`,
    description: `Expert CIBIL score repair and credit rectification services in ${cityName}. Primescore helps residents dispute credit errors, remove illegitimate defaults, and improve creditworthiness legally.`,
    url: `https://www.primescore.in/services/credit-rectification/${city}`,
    telephone: '+91-6350671636',
    email: 'info@primescore.in',
    areaServed: {
      '@type': 'City',
      name: cityName,
      addressCountry: 'IN',
    },
    serviceType: 'Credit Rectification',
    provider: {
      '@type': 'Organization',
      name: 'Primescore',
      url: 'https://www.primescore.in',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Credit Rectification Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'CIBIL Report Analysis',
            description: 'Comprehensive audit of your CIBIL, Experian, and Equifax reports to identify errors.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Legal Dispute Filing',
            description: 'Formal legal dispute filings with credit bureaus and financial institutions.',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Default Removal',
            description: 'Removal of illegitimate "Settled" and "Written-Off" entries from credit reports.',
          },
        },
      ],
    },
    // FAQ specific to this city for AI Overviews
    mainEntity: [
      {
        '@type': 'Question',
        name: `How can I fix my CIBIL score in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Primescore provides professional credit rectification services in ${cityName}. We analyze your credit reports, identify errors, and file formal disputes with credit bureaus on your behalf. The process typically takes 60–90 days.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is there a credit repair service in ${cityName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. Primescore serves clients in ${cityName} with expert CIBIL score repair and credit rectification. Contact us at info@primescore.in or call +91-6350671636 for a free consultation.`,
        },
      },
    ],
  }

  return (
    <>
      <Script
        id={`local-business-schema-${city}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <CityService city={city} />
    </>
  )
}

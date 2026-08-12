import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Primescore — Credit Rectification & 4-Bureau Audit',
    short_name: 'Primescore',
    description: 'India’s leading credit rectification agency. Dispute credit report errors, remove defaults, and monitor scores across CIBIL, Experian, Equifax & CRIF.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFFFFF',
    theme_color: '#0B132B',
    orientation: 'portrait',
    scope: '/',
    categories: ['finance', 'business', 'productivity'],
    icons: [
      {
        src: '/primescore-logo-tab.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/primescore-logo-tab.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}

import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-static'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const CITIES = [
  'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar',
  'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Jhunjhunu', 'Chittorgarh', 'Jaisalmer', 'Nagaur',
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
  'Pune', 'Lucknow', 'Kanpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna',
  'Vadodara', 'Ghaziabad', 'Ludhiana'
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.primescore.in'
  
  const locales = ['hi', 'ta', 'te', 'kn', 'ml', 'mr', 'gu', 'bn', 'pa', 'ur']

  const coreRoutes = [
    '',
    '/services',
    '/business',
    '/partner',
    '/pricing',
    '/about',
    '/blog',
    '/contact',
    '/tools/ifsc',
    '/tools/emi',
    '/tools/emi-comparison',
    '/tools/gst',
    '/tools/sip',
    '/tools/fd',
    '/privacy',
    '/terms'
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : route.startsWith('/tools') ? 0.9 : 0.8,
  }))

  // Generate localized versions for core routes
  const localizedCoreRoutes = locales.flatMap(locale => 
    [
      '',
      '/services',
      '/pricing',
      '/about',
      '/blog',
      '/contact'
    ].map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 0.9 : 0.7,
    }))
  )

  const cityRoutes = CITIES.map(city => ({
    url: `${baseUrl}/services/credit-rectification/${city.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  let blogRoutes: any[] = []
  let localizedBlogRoutes: any[] = []
  
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { data: blogs } = await supabase.from('blogs').select('slug, published_at')

    blogRoutes = (blogs || []).map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.published_at || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    localizedBlogRoutes = locales.flatMap(locale => 
      (blogs || []).map(post => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.published_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }))
    )
  }

  return [...coreRoutes, ...localizedCoreRoutes, ...cityRoutes, ...blogRoutes, ...localizedBlogRoutes]
}

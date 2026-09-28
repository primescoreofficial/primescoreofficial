
'use client'

import { useState, useEffect, useMemo } from 'react'
import { MapPin, Search, ChevronRight, Loader2, Building2, ChevronDown, Globe } from 'lucide-react'
import Link from 'next/link'
import { supabase } from '../../src/lib/supabase'
import Navbar from '../../src/components/layout/Navbar'
import Footer from '../../src/components/layout/Footer'
import Reveal from '../../src/components/ui/Reveal'

import { STATE_CITIES } from '../../src/data/cities'

const ALL_STATES = Object.keys(STATE_CITIES).sort()
const SEO_CITIES: Record<string, string[]> = STATE_CITIES

export default function LocationsPage() {
  const [cityData, setCityData] = useState<Record<string, string[]>>(SEO_CITIES)
  const [expandedStates, setExpandedStates] = useState<string[]>([])
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<{state: string, city: string}[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Fetch cities for a state on expansion
  const toggleState = async (state: string) => {
    if (expandedStates.includes(state)) {
      setExpandedStates(prev => prev.filter(s => s !== state))
      return
    }

    setExpandedStates(prev => [...prev, state])

    // If we only have SEO cities or nothing, fetch the full list for this state
    if ((!cityData[state] || cityData[state].length <= 10) && supabase) {
      setLoadingStates(prev => ({ ...prev, [state]: true }))
      
      const { data, error } = await supabase
        .from('banks')
        .select('city')
        .eq('state', state)
      
      if (!error && data) {
        // Deduplicate and normalize
        const unique = Array.from(new Set(data.map(item => {
          const raw = item.city.trim()
          return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase()
        }))).sort()
        
        setCityData(prev => ({ ...prev, [state]: unique }))
      }
      setLoadingStates(prev => ({ ...prev, [state]: false }))
    }
  }

  // Handle Search with Debounce (Server-side search)
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length < 3) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      if (supabase) {
        const { data, error } = await supabase
          .from('banks')
          .select('state, city')
          .ilike('city', `%${searchQuery}%`)
          .limit(20)
        
        if (!error && data) {
          const unique = data.reduce((acc: any[], curr) => {
            const formattedCity = curr.city.trim().charAt(0).toUpperCase() + curr.city.trim().slice(1).toLowerCase()
            if (!acc.find(x => x.city === formattedCity && x.state === curr.state)) {
              acc.push({ state: curr.state, city: formattedCity })
            }
            return acc
          }, [])
          setSearchResults(unique)
        }
      }
      setIsSearching(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-32 pb-16 border-b border-gray-100 bg-gray-50/50" data-theme="light">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-2 text-[#10b981] font-bold text-sm uppercase tracking-wider mb-4">
              <Globe className="h-4 w-4" />
              <span>India's Largest Credit Network</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Service Locations
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-10">
              Find authorized credit rectification support in your city. Select your state or search below.
            </p>
          </Reveal>

          <div className="max-w-xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#10b981] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search your city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all shadow-sm"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 text-[#10b981] animate-spin" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Directory */}
      <section className="py-16 min-h-[60vh]" data-theme="light">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {searchQuery.trim().length >= 3 ? (
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Search Results</h3>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {searchResults.map((res, i) => (
                    <Link
                      key={i}
                      href={`/services/credit-rectification/${res.city.toLowerCase().replace(/\s+/g, '-')}`}
                      className="p-4 border border-gray-100 rounded-2xl bg-white hover:border-[#10b981] hover:shadow-sm transition-all group"
                    >
                      <p className="text-xs font-bold text-gray-400 mb-1">{res.state}</p>
                      <p className="text-gray-900 font-bold group-hover:text-[#10b981]">Credit Rectification in {res.city}</p>
                    </Link>
                  ))}
                </div>
              ) : !isSearching && (
                <div className="text-center py-12 bg-gray-50 rounded-3xl">
                  <p className="text-gray-500">No cities found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-4">
              {ALL_STATES.sort().map((state) => {
                const isOpen = expandedStates.includes(state)
                const cities = cityData[state] || []
                const isLoading = loadingStates[state]

                return (
                  <div key={state} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm hover:border-gray-200 transition-all">
                    <button
                      onClick={() => toggleState(state)}
                      className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#10b981]/10' : 'bg-gray-50'}`}>
                          <MapPin className={`h-5 w-5 ${isOpen ? 'text-[#10b981]' : 'text-gray-400'}`} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{state}</h2>
                      </div>
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-8 border-t border-gray-50 animate-in fade-in slide-in-from-top-2">
                        {isLoading ? (
                          <div className="flex items-center gap-2 py-6 text-gray-400 justify-center">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm font-medium">Fetching verified cities...</span>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-6 gap-y-3 mt-6">
                            {cities.map((city) => (
                              <Link
                                key={city}
                                href={`/services/credit-rectification/${city.toLowerCase().replace(/\s+/g, '-')}`}
                                className="group flex items-center gap-2 text-[13px] text-gray-600 hover:text-[#10b981] transition-colors py-1"
                              >
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-200 group-hover:bg-[#10b981] transition-colors shrink-0" />
                                <span className="truncate">Credit Rectification in {city}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Trust CTA */}
      <section className="py-16" data-theme="light">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="p-10 rounded-[2.5rem] bg-gray-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#10b981]/10 blur-[100px] pointer-events-none"></div>
            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-bold mb-4 tracking-tight">Don't See Your City?</h3>
              <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
                Primescore serves clients in every corner of India through our digital-first process. If your city isn't listed, contact us for a free remote consultation.
              </p>
              <Link href="/contact" className="inline-flex items-center gap-2 bg-[#10b981] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#0da673] transition-all group">
                Free Consultation <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

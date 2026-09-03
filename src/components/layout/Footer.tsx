import Link from 'next/link'
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube, FaXTwitter, FaThreads } from 'react-icons/fa6'
import { ChevronRight } from 'lucide-react'

const footerLink = 'text-sm text-textSecondary hover:text-brandNavy transition-colors duration-200'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-brandNavy/8" data-theme="light">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center">
              <img src="/Logo-primescore.png" alt="Primescore" className="w-auto" style={{ height: '64px', width: 'auto' }} />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-textSecondary">
              Most platforms stop at your score. We go further — finding every error, filing every dispute, fixing your credit health across all bureaus.
            </p>

            <div className="mt-6 flex items-center gap-4 text-textSecondary">
              <a href="https://www.facebook.com/profile.php?id=61561478021964" target="_blank" rel="noopener noreferrer" className="hover:text-[#1877F2] transition-colors"><FaFacebook className="h-5 w-5" /></a>
              <a href="https://x.com/Primescore_in" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors"><FaXTwitter className="h-5 w-5" /></a>
              <a href="http://instagram.com/primescore.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#E4405F] transition-colors"><FaInstagram className="h-5 w-5" /></a>
              <a href="http://linkedin.com/company/primescore" target="_blank" rel="noopener noreferrer" className="hover:text-[#0A66C2] transition-colors"><FaLinkedin className="h-5 w-5" /></a>
              <a href="http://www.youtube.com/@PrimeScore-In" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF0000] transition-colors"><FaYoutube className="h-5 w-5" /></a>
              <a href="http://threads.com/@primescore.in" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors"><FaThreads className="h-5 w-5" /></a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-2">
            {/* Platform */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brandNavy">Platform</div>
              <div className="mt-4 grid gap-2.5">
                <Link className={footerLink} href="/services">Services</Link>
                <Link className={footerLink} href="/business">For Business</Link>
                <Link className={footerLink} href="/partner">Partner Program</Link>
                <Link className={footerLink} href="/pricing">Pricing</Link>
                <Link className={footerLink} href="/blog">Blog</Link>
                <Link className={footerLink} href="/dashboard">Dashboard</Link>
              </div>
            </div>

            {/* Company */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brandNavy">Company</div>
              <div className="mt-4 grid gap-2.5">
                <Link className={footerLink} href="/about">About</Link>
                <Link className={footerLink} href="/contact">Contact</Link>
                <Link className={footerLink} href="/careers">Careers</Link>
                <Link className={footerLink} href="/privacy">Privacy Policy</Link>
                <Link className={footerLink} href="/terms">Terms of Service</Link>
                <Link className={footerLink} href="/refund-policy">Refund Policy</Link>
                <Link className={footerLink} href="/cancellation-policy">Cancellation Policy</Link>
              </div>
            </div>

            {/* Tools */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-brandNavy">Tools</div>
              <div className="mt-4 grid gap-2.5">
                <Link className={footerLink} href="/tools/emi">EMI Calculator</Link>
                <Link className={footerLink} href="/tools/emi-comparison">EMI Comparison</Link>
                <Link className={footerLink} href="/tools/gst">GST Calculator</Link>
                <Link className={footerLink} href="/tools/sip">SIP Calculator</Link>
                <Link className={footerLink} href="/tools/fd">FD Calculator</Link>
                <Link className={footerLink} href="/tools/ifsc">IFSC Code Finder</Link>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-brandNavy">Get in touch</div>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2.5">
                <a className={footerLink} href="mailto:info@primescore.in">info@primescore.in</a>
                <a className={footerLink} href="tel:+916350671636">+91 63506-71636</a>
                <a className={footerLink} href="tel:+916377643115">+91 63776-43115</a>

                <div className="mt-3 text-[13px] text-textSecondary leading-relaxed">
                  iStart Nest Incubation Center<br />
                  Gov. Polytechnic College,<br />
                  Jodhpur (Raj.) – 342001
                </div>
              </div>

              <div className="h-32 w-full overflow-hidden rounded-xl border border-brandNavy/10 bg-brandNavy/5">
                <iframe
                  src="https://maps.google.com/maps?q=iStart%20Nest%20Incubation%20Center,%20Gov.%20Polytechnic%20College,%20Jodhpur&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  className="h-full w-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Local SEO Cities */}
        <div className="mt-16 pt-12 border-t border-brandNavy/8">
          <div className="text-xs font-semibold uppercase tracking-wider text-brandNavy mb-6">Service Locations</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-y-3 gap-x-4">
            {[
              'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar',
              'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Jhunjhunu', 'Chittorgarh', 'Jaisalmer', 'Nagaur',
              'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 'Kolkata', 'Surat',
              'Pune', 'Lucknow', 'Kanpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna',
              'Vadodara', 'Ghaziabad', 'Ludhiana'
            ].map((city) => (
              <Link
                key={city}
                href={`/services/credit-rectification/${city.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-[11px] text-textSecondary hover:text-[#10b981] transition-colors"
              >
                Credit Rectification in {city}
              </Link>
            ))}
            <Link
              href="/locations"
              className="text-[11px] font-bold text-brandRed hover:underline transition-colors flex items-center gap-1"
            >
              View All Cities <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-brandNavy/8 pt-8 text-xs text-textSecondary sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <div className="font-bold text-brandNavy">PRIMESCORE FINTECH PRIVATE LIMITED</div>
            <div className="font-mono text-[11px] text-textSecondary/90 font-semibold">CIN: U70200RJ2025PTC102685 • DPIIT Recognition: DIPP20068</div>
            <div className="mt-1 text-textSecondary/70">© {new Date().getFullYear()} Primescore. All rights reserved.</div>
          </div>
          <div className="max-w-md text-left sm:text-right leading-relaxed text-textSecondary/80">
            Primescore is an independent credit consultancy and is not a credit bureau or NBFC. We assist users with bureau audits, error identification, and formal dispute documentation.
          </div>
        </div>
      </div>
    </footer>
  )
}

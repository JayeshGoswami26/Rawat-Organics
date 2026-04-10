'use client'

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="bg-emerald-950 w-full rounded-t-3xl mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-12 py-24">
        {/* Brand */}
        <div className="space-y-6">
          <div className="text-2xl font-headline font-black text-emerald-50">Rawat Organics</div>
          <p className="text-emerald-50/70 text-sm tracking-wide leading-relaxed">
            Cultivating the essence of nature through ancient wisdom and modern precision.
          </p>
          <div className="flex gap-3">
            {['instagram', 'linkedin', 'twitter'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-9 h-9 rounded-full border border-emerald-50/20 flex items-center justify-center text-emerald-50/50 hover:text-emerald-50 hover:border-emerald-50/50 transition-all duration-300"
                aria-label={social}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {social === 'instagram'
                    ? 'photo_camera'
                    : social === 'linkedin'
                    ? 'business_center'
                    : 'rss_feed'}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div className="space-y-6">
          <h5 className="text-emerald-50 font-bold uppercase tracking-widest text-xs">Explore</h5>
          <ul className="space-y-4">
            {['Sustainability', 'Press', 'Legal', 'Privacy'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-emerald-50/70 hover:text-emerald-50 transition-all duration-200 hover:translate-x-1 inline-block text-sm"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="space-y-6">
          <h5 className="text-emerald-50 font-bold uppercase tracking-widest text-xs">Connect</h5>
          <ul className="space-y-4">
            {['Instagram', 'LinkedIn', 'Twitter'].map((item) => (
              <li key={item}>
                <a
                  href="#"
                  className="text-emerald-50/70 hover:text-emerald-50 transition-all duration-200 hover:translate-x-1 inline-block text-sm"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Location */}
        <div className="space-y-6">
          <h5 className="text-emerald-50 font-bold uppercase tracking-widest text-xs">Atelier Location</h5>
          <p className="text-emerald-50/70 text-sm leading-relaxed">
            The Highland Estates,<br />
            Plot 12, Valley Route,<br />
            Organic Meadows, UK
          </p>
          <a
            href="mailto:hello@rawatorganics.com"
            className="text-emerald-50/70 hover:text-emerald-50 text-sm transition-colors"
          >
            hello@rawatorganics.com
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-12 py-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-emerald-50/50">
        <span>© 2024 Rawat Organics. Cultivating Essence.</span>
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 hover:text-white transition-colors duration-200"
        >
          Back to top
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_upward</span>
        </button>
      </div>
    </footer>
  )
}

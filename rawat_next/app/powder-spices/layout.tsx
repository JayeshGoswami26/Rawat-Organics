import React from 'react'

export default function PowderSpicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed font-body">
      <nav className="fixed top-0 w-full z-50 bg-surface/70 backdrop-blur-md shadow-sm shadow-primary/5 flex justify-between items-center px-8 py-6 font-headline tracking-tight text-primary">
        <div className="text-2xl font-bold tracking-widest uppercase">Rawat Organics</div>
        <div className="hidden md:flex items-center gap-12">
          <a className="text-secondary hover:text-primary transition-colors" href="/">Home</a>
          <a className="text-secondary hover:text-primary transition-colors" href="/whole-spices">Whole Spices</a>
          <a className="text-primary border-b-2 border-primary pb-1" href="/powder-spices">Powder Spices</a>
        </div>
        <a
          href="mailto:hello@rawatorganics.com"
          className="hidden md:inline-flex px-6 py-2.5 rounded-full bg-primary-container text-on-primary-container font-headline text-sm font-bold hover:scale-105 transition-all"
        >
          Inquire
        </a>
      </nav>

      {children}

      <footer className="w-full mt-20 bg-emerald-950 px-12 py-16">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm">
          <div>
            <div className="text-xl font-headline font-black text-emerald-50 mb-4">Rawat Organics</div>
            <p className="text-emerald-50/60 leading-relaxed">
              Rooted in heritage, driven by purity. The finest botanicals from earth to your kitchen.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-3">
              {['Our Story', 'Sustainability', 'Shipping'].map(l => (
                <a key={l} className="text-emerald-50/60 hover:text-emerald-50 transition-colors" href="#">{l}</a>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {['Wholesale', 'Contact', 'Privacy'].map(l => (
                <a key={l} className="text-emerald-50/60 hover:text-emerald-50 transition-colors" href="#">{l}</a>
              ))}
            </div>
          </div>
          <div className="md:text-right">
            <p className="text-emerald-50/40 text-xs">© 2024 Rawat Organics. Cultivating Purity.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import React from 'react';

export default function WholeSpicesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed font-body">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#fafaf5]/70 dark:bg-[#021c10]/70 backdrop-blur-md shadow-sm shadow-[#1a1c19]/5 flex justify-between items-center px-8 py-6 max-w-full font-headline tracking-tight text-[#021c10] dark:text-[#fafaf5]">
        <div className="text-2xl font-bold tracking-widest uppercase">Rawat Organics</div>
        <div className="hidden md:flex items-center gap-12">
          <a className="text-[#6c5b4e] dark:text-[#fafaf5]/60 hover:text-[#021c10] dark:hover:text-[#fafaf5] transition-colors" href="/">Home</a>
          <a className="text-[#021c10] dark:text-[#fafaf5] border-b-2 border-[#021c10] dark:border-[#fafaf5] pb-1" href="/whole-spices">Whole Spices</a>
          <a className="text-[#6c5b4e] dark:text-[#fafaf5]/60 hover:text-[#021c10] dark:hover:text-[#fafaf5] transition-colors" href="/powder-spices">Powder Spices</a>
        </div>
        <div className="flex items-center gap-6">
          <button className="hover:opacity-80 transition-opacity hover:scale-105 duration-300 ease-in-out text-primary">
            <span className="material-symbols-outlined">shopping_bag</span>
          </button>
          <button className="hover:opacity-80 transition-opacity hover:scale-105 duration-300 ease-in-out text-primary">
            <span className="material-symbols-outlined">person</span>
          </button>
        </div>
      </nav>

      {children}

      {/* Footer */}
      <footer className="w-full mt-20 bg-[#fafaf5] dark:bg-[#131900] grid grid-cols-1 md:grid-cols-3 gap-12 px-12 py-16 max-w-7xl mx-auto border-t border-[#021c10]/5 text-sm leading-relaxed text-[#021c10] dark:text-[#fafaf5]">
        <div className="fade-in duration-500">
          <div className="text-xl font-bold text-[#021c10] dark:text-[#fafaf5] mb-6">Rawat Organics</div>
          <p className="text-[#6c5b4e] dark:text-[#fafaf5]/70 max-w-xs">
            Rooted in heritage, driven by purity. We bring the world&apos;s finest botanicals from the earth to your kitchen.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 fade-in duration-500">
          <div className="flex flex-col gap-4">
            <a className="text-[#6c5b4e] dark:text-[#fafaf5]/70 hover:text-[#021c10] dark:hover:text-white transition-all" href="#">Our Story</a>
            <a className="text-[#6c5b4e] dark:text-[#fafaf5]/70 hover:text-[#021c10] dark:hover:text-white transition-all" href="#">Sustainability</a>
            <a className="text-[#6c5b4e] dark:text-[#fafaf5]/70 hover:text-[#021c10] dark:hover:text-white transition-all" href="#">Shipping</a>
          </div>
          <div className="flex flex-col gap-4">
            <a className="text-[#6c5b4e] dark:text-[#fafaf5]/70 hover:text-[#021c10] dark:hover:text-white transition-all" href="#">Wholesale</a>
            <a className="text-[#6c5b4e] dark:text-[#fafaf5]/70 hover:text-[#021c10] dark:hover:text-white transition-all" href="#">Contact</a>
          </div>
        </div>
        <div className="fade-in duration-500 md:text-right">
          <p className="text-[#6c5b4e] dark:text-[#fafaf5]/70 mb-6">© 2024 Rawat Organics. Cultivating Purity.</p>
          <div className="flex gap-6 md:justify-end">
            <span className="material-symbols-outlined text-[#6c5b4e] hover:text-[#021c10] cursor-pointer">social_leaderboard</span>
            <span className="material-symbols-outlined text-[#6c5b4e] hover:text-[#021c10] cursor-pointer">camera_alt</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

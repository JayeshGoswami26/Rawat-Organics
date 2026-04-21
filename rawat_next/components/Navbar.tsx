'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => {
      // On home page, wait until past hero before showing backdrop
      // On inner pages, always show backdrop
      setScrolled(!isHome || window.scrollY > window.innerHeight * 1.75)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [isHome])

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Whole Spices', href: '/whole-spices' },
    { label: 'Powder Spices', href: '/powder-spices' },
    { label: 'Our Story', href: isHome ? '#story' : '/#story' },
    { label: 'Contact', href: isHome ? '#contact' : '/#contact' },
  ]

  const isActive = (href: string) =>
    href !== '/' && pathname.startsWith(href.replace('#', '').split('#')[0])

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface/90 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-10 py-5 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <Link
          href="/"
          className={`text-xl font-headline font-bold tracking-tighter transition-colors duration-300 ${
            scrolled ? 'text-primary' : 'text-white'
          }`}
        >
          Rawat Organic
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7 font-headline tracking-tight font-semibold text-sm">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`relative transition-colors duration-300 group ${
                scrolled
                  ? isActive(link.href)
                    ? 'text-primary'
                    : 'text-on-surface/70 hover:text-primary'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
              <span
                className={`absolute -bottom-1 left-0 h-px bg-current transition-all duration-300 ${
                  isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <Link
            href={isHome ? '#contact' : '/#contact'}
            className={`hidden md:inline-flex px-6 py-2.5 rounded-full font-headline text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              scrolled
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm'
            }`}
          >
            Inquire
          </Link>

          {/* Hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className={`transition-colors ${scrolled ? 'text-primary' : 'text-white'}`}>
              {mobileOpen ? (
                <span className="material-symbols-outlined">close</span>
              ) : (
                <span className="material-symbols-outlined">menu</span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-surface/98 backdrop-blur-xl border-t border-outline-variant/20 px-6 pb-6 overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-4">
              {links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-on-surface font-headline font-semibold text-base py-3 border-b border-outline-variant/20 transition-colors ${
                    isActive(link.href) ? 'text-primary' : 'hover:text-primary'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href={isHome ? '#contact' : '/#contact'}
                className="mt-3 px-6 py-3 bg-primary text-primary-fixed rounded-full font-headline font-bold text-sm text-center"
                onClick={() => setMobileOpen(false)}
              >
                Inquire Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

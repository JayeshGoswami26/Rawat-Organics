'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      // The hero is 300vh tall. We transition the nav when we scroll past it.
      // 2.8 * window.innerHeight triggers right as the 'Our Story' section comes up.
      setScrolled(window.scrollY > window.innerHeight * 2.8)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // check immediately on mount
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Home', href: '#' },
    { label: 'Our Story', href: '#story' },
    { label: 'Collection', href: '#collection' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <motion.nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-surface/80 backdrop-blur-xl shadow-sm'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <div className="flex justify-between items-center w-full px-6 md:px-10 py-5 max-w-screen-2xl mx-auto">
        {/* Logo */}
        <a
          href="#"
          className={`text-xl font-headline font-bold tracking-tighter transition-colors duration-300 ${
            scrolled ? 'text-primary' : 'text-white'
          }`}
        >
          Rawat Organics
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8 font-headline tracking-tight font-semibold text-sm">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`relative transition-colors duration-300 group ${
                scrolled
                  ? 'text-on-surface/70 hover:text-primary'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-px bg-current transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex items-center gap-4">
          <a
            href="#contact"
            className={`hidden md:inline-flex px-6 py-2.5 rounded-full font-headline text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
              scrolled
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-white/15 text-white border border-white/25 hover:bg-white/25 backdrop-blur-sm'
            }`}
          >
            Inquire
          </a>

          {/* Hamburger */}
          <button
            className="md:hidden text-white"
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
            className="md:hidden bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 px-6 pb-6 overflow-hidden"
          >
            <div className="flex flex-col gap-4 pt-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-on-surface font-headline font-semibold text-base py-2 border-b border-outline-variant/20"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                className="mt-2 px-6 py-3 bg-primary-container text-on-primary-container rounded-full font-headline font-bold text-sm text-center"
                onClick={() => setMobileOpen(false)}
              >
                Inquire Now
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

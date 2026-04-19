'use client'

import React, { useRef, useLayoutEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame,
} from 'framer-motion'

interface VelocityMapping {
  input: [number, number]
  output: [number, number]
}

interface VelocityTextProps {
  children: React.ReactNode
  baseVelocity: number
  className?: string
  damping?: number
  stiffness?: number
  numCopies?: number
  velocityMapping?: VelocityMapping
  parallaxClassName?: string
  scrollerClassName?: string
  parallaxStyle?: React.CSSProperties
  scrollerStyle?: React.CSSProperties
}

interface ScrollVelocityProps {
  texts: React.ReactNode[]
  velocity?: number
  className?: string
  damping?: number
  stiffness?: number
  numCopies?: number
  velocityMapping?: VelocityMapping
  parallaxClassName?: string
  scrollerClassName?: string
  parallaxStyle?: React.CSSProperties
  scrollerStyle?: React.CSSProperties
}

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>): number {
  const [width, setWidth] = useState(0)
  useLayoutEffect(() => {
    function update() {
      if (ref.current) setWidth(ref.current.offsetWidth)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [ref])
  return width
}

function wrap(min: number, max: number, v: number): number {
  const range = max - min
  const mod = (((v - min) % range) + range) % range
  return mod + min
}

function VelocityText({
  children,
  baseVelocity,
  className = '',
  damping = 50,
  stiffness = 400,
  numCopies = 6,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
}: VelocityTextProps) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness })
  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false }
  )

  const copyRef = useRef<HTMLSpanElement>(null)
  const copyWidth = useElementWidth(copyRef)

  const x = useTransform(baseX, v => {
    if (copyWidth === 0) return '0px'
    return `${wrap(-copyWidth, 0, v)}px`
  })

  const directionFactor = useRef<number>(1)
  useAnimationFrame((_t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000)
    if (velocityFactor.get() < 0) directionFactor.current = -1
    else if (velocityFactor.get() > 0) directionFactor.current = 1
    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    baseX.set(baseX.get() + moveBy)
  })

  const spans = []
  for (let i = 0; i < numCopies; i++) {
    spans.push(
      <span className={`flex-shrink-0 ${className}`} key={i} ref={i === 0 ? copyRef : null}>
        {children}
      </span>
    )
  }

  return (
    <div className={`relative overflow-hidden ${parallaxClassName ?? ''}`} style={parallaxStyle}>
      <motion.div
        className={`flex whitespace-nowrap ${scrollerClassName ?? ''}`}
        style={{ x, ...scrollerStyle }}
      >
        {spans}
      </motion.div>
    </div>
  )
}

export const ScrollVelocity: React.FC<ScrollVelocityProps> = ({
  texts = [],
  velocity = 80,
  className = '',
  damping,
  stiffness,
  numCopies,
  velocityMapping,
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle,
}) => {
  return (
    <div>
      {texts.map((text, index) => (
        <VelocityText
          key={index}
          className={className}
          baseVelocity={index % 2 !== 0 ? -velocity : velocity}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}
        </VelocityText>
      ))}
    </div>
  )
}

export default ScrollVelocity

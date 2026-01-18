"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useRef } from "react"

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100])

  return (
    <section
      ref={containerRef}
      id="prophecy"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <motion.div
        style={{ opacity, y }}
        className="relative z-10 mx-auto max-w-5xl text-center"
      >
        {/* Decorative element */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mx-auto mb-8 flex h-px w-24 bg-gold"
        />

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="font-serif text-5xl font-light leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl"
        >
          <span className="block text-balance">COMMERCE IS</span>
          <span className="block text-balance">NO LONGER A</span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 1 }}
            className="block bg-gradient-to-r from-gold to-accent bg-clip-text text-balance text-transparent"
          >
            GUESSING GAME.
          </motion.span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mx-auto mt-8 max-w-2xl font-mono text-sm leading-relaxed tracking-wide text-muted-foreground md:text-base"
        >
          Wall Street trades on truth. Merchants trade on hope.
          <br />
          <span className="text-foreground">Predictify</span> turns global sentiment into inventory certainty.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mx-auto mt-12 flex max-w-lg flex-wrap items-center justify-center gap-8"
        >
          <div className="text-center">
            <span className="block font-mono text-2xl font-light text-accent">42</span>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Days Early</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="block font-mono text-2xl font-light text-gold">82%</span>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Accuracy</span>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <span className="block font-mono text-2xl font-light text-foreground">$2.4M</span>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Protected</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Scroll to explore
          </span>
          <ChevronDown className="h-5 w-5 text-gold" />
        </motion.div>
      </motion.div>
    </section>
  )
}

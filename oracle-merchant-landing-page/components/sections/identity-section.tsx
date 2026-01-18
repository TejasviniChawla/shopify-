"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Eye, Sparkles, ArrowRight, TrendingUp, Shield, Zap } from "lucide-react"

export function IdentitySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  return (
    <section
      ref={containerRef}
      id="identity"
      className="relative min-h-screen px-6 py-32"
    >
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-6xl"
      >
        {/* Section intro */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-gold">
            <Sparkles className="h-3 w-3" />
            Introducing
          </span>

          <h2 className="mt-8 font-serif text-5xl font-light tracking-tight text-foreground md:text-7xl">
            The <span className="bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">Informed</span> Merchant
          </h2>

          <p className="mx-auto mt-6 max-w-2xl font-mono text-base text-muted-foreground md:text-lg">
            Stop trading on hope. Start trading on truth.
          </p>
        </motion.div>

        {/* Comparison: Before and After */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Before - Reactive */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-muted/30 bg-muted/5 p-8"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-muted/10 blur-3xl" />

            <div className="relative">
              <span className="inline-block rounded-full border border-muted/50 bg-muted/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Before
              </span>

              <h3 className="mt-6 font-serif text-2xl font-medium text-muted-foreground md:text-3xl">
                The Reactive Merchant
              </h3>

              <ul className="mt-8 space-y-4">
                {[
                  "Learns about crises from headlines",
                  "Adjusts prices after margins are hit",
                  "Orders inventory based on gut feeling",
                  "Scrambles when supply chains break",
                  "Always playing catch-up",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50" />
                    <span className="font-mono text-sm text-muted-foreground">{item}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 border-t border-muted/20 pt-6">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/50">
                  Result
                </span>
                <p className="mt-2 font-serif text-lg text-muted-foreground">
                  Lost margins. Lost customers. Lost sleep.
                </p>
              </div>
            </div>
          </motion.div>

          {/* After - Informed */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative overflow-hidden rounded-3xl border border-accent/30 bg-accent/5 p-8"
          >
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />

            <div className="relative">
              <span className="inline-block rounded-full border border-accent/50 bg-accent/10 px-3 py-1 font-mono text-xs uppercase tracking-widest text-accent">
                After Predictify
              </span>

              <h3 className="mt-6 font-serif text-2xl font-medium text-foreground md:text-3xl">
                The Informed Merchant
              </h3>

              <ul className="mt-8 space-y-4">
                {[
                  { text: "Sees risks 42 days before they hit", icon: Eye },
                  { text: "Adjusts pricing before costs change", icon: TrendingUp },
                  { text: "Orders inventory based on real signals", icon: Sparkles },
                  { text: "Reroutes shipments before disruptions", icon: Shield },
                  { text: "Always one step ahead", icon: Zap },
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent/20">
                      <item.icon className="h-3 w-3 text-accent" />
                    </div>
                    <span className="font-mono text-sm text-foreground">{item.text}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-8 border-t border-accent/20 pt-6">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">
                  Result
                </span>
                <p className="mt-2 font-serif text-lg text-foreground">
                  Protected margins. Loyal customers. Peaceful nights.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="mb-8 font-mono text-sm text-muted-foreground">
            Wall Street has traded on prediction markets for years.
            <br />
            <span className="text-foreground">Now Main Street can too.</span>
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-accent/50 bg-transparent px-8 py-4 font-mono text-sm uppercase tracking-widest text-foreground transition-all hover:border-accent hover:shadow-lg hover:shadow-accent/20"
          >
            <span className="relative z-10 transition-colors group-hover:text-accent-foreground">
              See How It Works
            </span>
            <ArrowRight className="relative z-10 h-4 w-4 transition-all group-hover:translate-x-1 group-hover:text-accent-foreground" />
            <div className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 group-hover:translate-x-0" />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  )
}

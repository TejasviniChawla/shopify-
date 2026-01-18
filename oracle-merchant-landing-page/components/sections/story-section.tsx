"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { AlertTriangle, Sparkles } from "lucide-react"

export function StorySection() {
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
      id="story"
      className="relative min-h-screen px-6 py-32"
    >
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-7xl"
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-gold">
            Chapter II
          </span>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl">
            The Tragedy of Sloane
          </h2>
        </motion.div>

        {/* Split screen comparison */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* The Post-Mortem */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative overflow-hidden rounded-2xl border border-destructive/20 bg-destructive/5 p-8"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-destructive/10 blur-3xl transition-all group-hover:bg-destructive/20" />
            
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-destructive">
                    The Post-Mortem
                  </span>
                  <h3 className="font-serif text-xl font-medium text-foreground">
                    Trading on Hope
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                  In 2024, the Red Sea crisis cost Sloane&apos;s Sustainable Textiles{" "}
                  <span className="font-semibold text-destructive">$85,000</span> in lost orders.
                </p>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                  She waited for the news.
                </p>
                <p className="border-l-2 border-destructive/50 pl-4 font-serif text-lg italic text-foreground">
                  The News is a post-mortem.
                </p>
              </div>

              {/* Timeline visual */}
              <div className="mt-8 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-destructive" />
                <div className="h-0.5 flex-1 bg-gradient-to-r from-destructive to-transparent" />
                <span className="font-mono text-xs text-muted-foreground">Event Occurs</span>
                <div className="h-0.5 flex-1 bg-muted" />
                <div className="h-2 w-2 rounded-full bg-muted" />
              </div>
              <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">
                <span>Crisis Hits</span>
                <span>+14 Days: News Reports</span>
              </div>
            </div>
          </motion.div>

          {/* The Prophecy */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group relative overflow-hidden rounded-2xl border border-accent/20 bg-accent/5 p-8"
          >
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent/10 blur-3xl transition-all group-hover:bg-accent/20" />
            
            <div className="relative">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">
                    The Oracle Edge
                  </span>
                  <h3 className="font-serif text-xl font-medium text-foreground">
                    Trading on Truth
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-accent">42 days</span> before the ships diverted,
                  Polymarket showed an 82% probability of transit drops.
                </p>
                <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                  The Oracle Merchant saw the signal.
                </p>
                <p className="border-l-2 border-accent/50 pl-4 font-serif text-lg italic text-foreground">
                  Before the storm hit.
                </p>
              </div>

              {/* Timeline visual */}
              <div className="mt-8 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent" />
                <div className="h-0.5 flex-1 bg-gradient-to-r from-accent to-gold" />
                <span className="font-mono text-xs text-accent">Signal Detected</span>
                <div className="h-0.5 flex-1 bg-gold" />
                <div className="h-2 w-2 rounded-full bg-gold" />
              </div>
              <div className="mt-2 flex justify-between font-mono text-xs text-muted-foreground">
                <span className="text-accent">-42 Days: Oracle Alert</span>
                <span>Crisis Hits</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom stat */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-4 rounded-full border border-border bg-card/50 px-8 py-4 backdrop-blur-sm">
            <span className="font-mono text-sm text-muted-foreground">Potential Savings</span>
            <span className="font-mono text-2xl font-light text-accent">$85,000</span>
            <div className="h-6 w-px bg-border" />
            <span className="font-mono text-sm text-muted-foreground">Lead Time</span>
            <span className="font-mono text-2xl font-light text-gold">42 days</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

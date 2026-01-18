"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Activity, Zap, Shield, TrendingUp } from "lucide-react"

function HeatmapCell({ delay, intensity }: { delay: number; intensity: number }) {
  const colors = [
    "bg-accent/20",
    "bg-accent/40",
    "bg-accent/60",
    "bg-accent/80",
    "bg-accent",
  ]
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay }}
      className={`h-8 w-full rounded-sm ${colors[intensity]} transition-all hover:scale-110`}
    />
  )
}

function ProbabilityHeatmap() {
  const grid = [
    [0, 1, 2, 3, 4, 3, 2, 1],
    [1, 2, 3, 4, 4, 4, 3, 2],
    [2, 3, 4, 4, 4, 4, 4, 3],
    [3, 4, 4, 4, 4, 4, 4, 4],
    [2, 3, 4, 4, 4, 4, 3, 3],
    [1, 2, 3, 3, 3, 3, 2, 2],
  ]

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-6">
      <div className="mb-4 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Probability Heatmap
        </span>
        <span className="font-mono text-xs text-accent">Live Simulation</span>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <HeatmapCell
              key={`${i}-${j}`}
              delay={i * 0.05 + j * 0.02}
              intensity={cell}
            />
          ))
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent/20" />
          <span className="font-mono text-xs text-muted-foreground">Low Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-accent" />
          <span className="font-mono text-xs text-muted-foreground">High Risk</span>
        </div>
      </div>
    </div>
  )
}

export function SimGymSection() {
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
      id="simgym"
      className="relative min-h-screen px-6 py-32"
    >
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-6xl"
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
            Chapter IV
          </span>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl">
            SimGym
          </h2>
          <p className="mx-auto mt-4 max-w-2xl font-mono text-sm text-muted-foreground">
            Friction Mapping: We don&apos;t just predict events—we simulate their impact
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Heatmap visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <ProbabilityHeatmap />

            {/* Simulation stats */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Scenarios Run
                </span>
                <p className="mt-1 font-mono text-2xl font-light text-accent">1,000</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Black Swans
                </span>
                <p className="mt-1 font-mono text-2xl font-light text-gold">47</p>
              </div>
            </div>
          </motion.div>

          {/* Description cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-4"
          >
            {/* Main description */}
            <div className="rounded-xl border border-border/50 bg-background/60 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <Activity className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-medium text-foreground">
                  Predictive Friction Analysis
                </h3>
              </div>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                SimGym runs <span className="text-foreground">1,000 black-swan scenarios</span> on
                your store&apos;s UI. If shipping delays hit 30 days, we automatically adjust your
                &ldquo;Estimated Delivery&rdquo; and dynamic pricing to protect your margins.
              </p>
            </div>

            {/* Feature mini-cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/30 p-4 text-center">
                <Zap className="mb-2 h-6 w-6 text-accent" />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Auto-Adjust
                </span>
                <p className="mt-1 font-serif text-sm text-foreground">Delivery Times</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/30 p-4 text-center">
                <Shield className="mb-2 h-6 w-6 text-gold" />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Protect
                </span>
                <p className="mt-1 font-serif text-sm text-foreground">Profit Margins</p>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/30 p-4 text-center">
                <TrendingUp className="mb-2 h-6 w-6 text-accent" />
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Dynamic
                </span>
                <p className="mt-1 font-serif text-sm text-foreground">Pricing</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

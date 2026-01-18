"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Volume2, Pause, Play, Check, Activity, Zap, Shield, TrendingUp, Sparkles } from "lucide-react"

function AudioWaveform({ isPlaying }: { isPlaying: boolean }) {
  return (
    <div className="flex h-12 items-center gap-0.5">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-accent"
          initial={{ height: 4 }}
          animate={{
            height: isPlaying
              ? [4, Math.random() * 40 + 8, 4]
              : 4 + Math.sin(i * 0.3) * 4,
          }}
          transition={{
            duration: isPlaying ? 0.3 : 0,
            repeat: isPlaying ? Infinity : 0,
            delay: i * 0.02,
          }}
        />
      ))}
    </div>
  )
}

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
      className={`h-6 w-full rounded-sm ${colors[intensity]} transition-all hover:scale-110`}
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
  ]

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Risk Heatmap
        </span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-accent">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
          Live
        </span>
      </div>
      <div className="grid grid-cols-8 gap-1">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <HeatmapCell
              key={`${i}-${j}`}
              delay={i * 0.03 + j * 0.01}
              intensity={cell}
            />
          ))
        )}
      </div>
      <div className="mt-3 flex items-center justify-between font-mono text-xs text-muted-foreground">
        <span>Low Risk</span>
        <span>High Risk</span>
      </div>
    </div>
  )
}

export function DemoSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80, 0, 0, -80])

  return (
    <section
      ref={containerRef}
      id="demo"
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
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-accent">
            <Sparkles className="h-3 w-3" />
            See It In Action
          </span>

          <h2 className="mt-6 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Your Daily Intelligence Briefing
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-muted-foreground">
            Every morning, Predictify analyzes global markets and delivers actionable insights in 60 seconds.
          </p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Voice Briefing Player */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/60 p-8 backdrop-blur-xl"
          >
            {/* Background glow */}
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />

            <div className="relative">
              {/* Player header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                    <Volume2 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Morning Briefing
                    </span>
                    <p className="font-serif text-lg text-foreground">ElevenLabs Voice AI</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {isPlaying ? "Playing..." : "00:42"}
                </span>
              </div>

              {/* Waveform visualization */}
              <div className="mb-6 flex items-center justify-center rounded-xl bg-card/50 p-4">
                <AudioWaveform isPlaying={isPlaying} />
              </div>

              {/* Transcript */}
              <div className="mb-6 rounded-xl border border-border/50 bg-card/30 p-5">
                <p className="font-serif text-base italic leading-relaxed text-foreground md:text-lg">
                  &ldquo;Good morning. <span className="text-accent">Suez risk is at 78%</span>.
                  I suggest rerouting your September silk shipment to air-freight.
                  Cost increase: $2,400. Potential savings if disruption occurs: <span className="text-gold">$18,000</span>.
                  Shall I execute?&rdquo;
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between">
                {/* Play button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card transition-all hover:bg-card/80 hover:shadow-lg hover:shadow-accent/10"
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5 text-foreground" />
                  ) : (
                    <Play className="ml-0.5 h-5 w-5 text-foreground" />
                  )}
                </button>

                {/* Confirm execution button */}
                <motion.button
                  onClick={() => setIsConfirmed(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative overflow-hidden rounded-full px-6 py-3 font-mono text-xs uppercase tracking-widest transition-all ${
                    isConfirmed
                      ? "bg-accent text-accent-foreground"
                      : "border border-accent/50 bg-transparent text-foreground hover:border-accent hover:shadow-lg hover:shadow-accent/20"
                  }`}
                >
                  {isConfirmed ? (
                    <span className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      Executed
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10 transition-colors group-hover:text-accent-foreground">
                        Confirm Action
                      </span>
                      <div className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 group-hover:translate-x-0" />
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* SimGym Risk Simulation */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            {/* Heatmap */}
            <ProbabilityHeatmap />

            {/* Simulation stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Scenarios Analyzed
                </span>
                <p className="mt-1 font-mono text-2xl font-light text-accent">1,000+</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Black Swan Events
                </span>
                <p className="mt-1 font-mono text-2xl font-light text-gold">47</p>
              </div>
            </div>

            {/* What SimGym Does */}
            <div className="rounded-xl border border-border/50 bg-background/60 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <Activity className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-serif text-lg font-medium text-foreground">
                  SimGym: Stress-Test Your Store
                </h3>
              </div>
              <p className="font-mono text-sm leading-relaxed text-muted-foreground">
                We run <span className="text-foreground">1,000 black-swan scenarios</span> on your store.
                If shipping delays hit 30 days, we auto-adjust your delivery estimates and pricing to protect margins.
              </p>
            </div>

            {/* Feature mini-cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                <Zap className="mb-2 h-5 w-5 text-accent" />
                <span className="font-mono text-xs text-muted-foreground">Auto-Adjust</span>
                <span className="font-serif text-sm text-foreground">Delivery</span>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                <Shield className="mb-2 h-5 w-5 text-gold" />
                <span className="font-mono text-xs text-muted-foreground">Protect</span>
                <span className="font-serif text-sm text-foreground">Margins</span>
              </div>
              <div className="flex flex-col items-center rounded-xl border border-border/50 bg-card/30 p-3 text-center">
                <TrendingUp className="mb-2 h-5 w-5 text-accent" />
                <span className="font-mono text-xs text-muted-foreground">Dynamic</span>
                <span className="font-serif text-sm text-foreground">Pricing</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

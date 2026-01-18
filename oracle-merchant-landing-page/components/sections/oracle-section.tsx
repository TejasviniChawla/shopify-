"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { Volume2, Pause, Play, Check } from "lucide-react"

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

export function OracleSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [100, 0, 0, -100])

  return (
    <section
      ref={containerRef}
      id="oracle"
      className="relative min-h-screen px-6 py-32"
    >
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-4xl"
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
            Chapter III
          </span>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl">
            The Morning Briefing
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-mono text-sm text-muted-foreground">
            ElevenLabs-powered voice intelligence delivers your daily briefing
          </p>
        </motion.div>

        {/* Glassmorphic audio player */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/60 p-8 backdrop-blur-xl md:p-12"
        >
          {/* Background glow */}
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-gold/20 blur-3xl" />

          <div className="relative">
            {/* Player header */}
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                  <Volume2 className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Daily Suggestion
                  </span>
                  <p className="font-serif text-lg text-foreground">Voice Briefing</p>
                </div>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {isPlaying ? "Playing..." : "00:42"}
              </span>
            </div>

            {/* Waveform visualization */}
            <div className="mb-8 flex items-center justify-center rounded-xl bg-card/50 p-6">
              <AudioWaveform isPlaying={isPlaying} />
            </div>

            {/* Transcript */}
            <div className="mb-8 rounded-xl border border-border/50 bg-card/30 p-6">
              <p className="font-serif text-lg italic leading-relaxed text-foreground md:text-xl">
                &ldquo;Good morning, Sarah. Suez risk is at{" "}
                <span className="text-accent">82%</span>. I suggest rerouting the
                September silk shipment to air-freight. Shall I execute?&rdquo;
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
              {/* Play button */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex h-14 w-14 items-center justify-center rounded-full border border-border bg-card transition-all hover:bg-card/80 hover:shadow-lg hover:shadow-accent/10"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-foreground" />
                ) : (
                  <Play className="ml-1 h-6 w-6 text-foreground" />
                )}
              </button>

              {/* Confirm execution button */}
              <motion.button
                onClick={() => setIsConfirmed(true)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`group relative overflow-hidden rounded-full px-8 py-4 font-mono text-sm uppercase tracking-widest transition-all ${
                  isConfirmed
                    ? "bg-accent text-accent-foreground"
                    : "border border-accent/50 bg-transparent text-foreground hover:border-accent hover:shadow-lg hover:shadow-accent/20"
                }`}
              >
                {isConfirmed ? (
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Execution Confirmed
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 transition-colors group-hover:text-accent-foreground">
                      Confirm Execution
                    </span>
                    <div className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 group-hover:translate-x-0" />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

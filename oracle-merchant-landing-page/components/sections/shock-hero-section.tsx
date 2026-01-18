"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

function MassiveCounter({ target, duration = 2000, delay = 0 }: { target: number; duration?: number; delay?: number }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  useEffect(() => {
    if (!started) return
    const steps = 60
    const increment = target / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, duration / steps)
    return () => clearInterval(timer)
  }, [started, target, duration])

  return <span className="tabular-nums">{count}</span>
}

export function ShockHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [phase, setPhase] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  // Sequence the reveal
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Show "Trump won."
      setTimeout(() => setPhase(2), 2000),  // Show "Polymarket knew"
      setTimeout(() => setPhase(3), 3500),  // Show the number
      setTimeout(() => setPhase(4), 5000),  // Show the question
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <section
      ref={containerRef}
      id="prophecy"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      <motion.div
        style={{ opacity, y, scale }}
        className="relative z-10 mx-auto max-w-6xl text-center"
      >
        {/* Phase 1: The shocking statement */}
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-4"
          >
            <h1 className="font-serif text-5xl font-light text-foreground md:text-7xl lg:text-8xl">
              Trump won.
            </h1>
          </motion.div>
        )}

        {/* Phase 2: The reveal */}
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <p className="font-mono text-xl text-muted-foreground md:text-2xl">
              Polymarket knew{" "}
              <span className="text-accent font-semibold">3 weeks</span> before the polls closed.
            </p>
          </motion.div>
        )}

        {/* Phase 3: The massive number */}
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="my-12"
          >
            <div className="relative inline-block">
              {/* Glow effect behind number */}
              <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full scale-150" />

              <span className="relative block font-mono text-[12rem] font-bold leading-none text-accent md:text-[16rem] lg:text-[20rem]">
                <MassiveCounter target={89} delay={0} />
                <span className="text-[6rem] md:text-[8rem] lg:text-[10rem]">%</span>
              </span>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-4 font-mono text-lg text-muted-foreground md:text-xl"
            >
              prediction accuracy on election night
            </motion.p>
          </motion.div>
        )}

        {/* Phase 4: The hook */}
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mt-8"
          >
            <div className="mx-auto max-w-3xl rounded-2xl border border-gold/30 bg-gold/5 p-8 backdrop-blur-sm">
              <p className="font-serif text-2xl font-light text-foreground md:text-3xl lg:text-4xl">
                What if your <span className="text-gold">inventory decisions</span> had this accuracy?
              </p>
              <p className="mt-4 font-mono text-sm text-muted-foreground md:text-base">
                The same prediction markets that called the election now power commerce intelligence.
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Scroll indicator - only show after full reveal */}
      {phase >= 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              See what else they predicted
            </span>
            <ChevronDown className="h-5 w-5 text-accent" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}

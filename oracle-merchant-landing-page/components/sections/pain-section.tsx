"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { TrendingDown, Clock, AlertTriangle } from "lucide-react"

function AnimatedCounter({ value, prefix = "", suffix = "", delay = 0 }: { value: number; prefix?: string; suffix?: string; delay?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        const duration = 2000
        const steps = 60
        const increment = value / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= value) {
            setCount(value)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current * 10) / 10)
          }
        }, duration / steps)
        return () => clearInterval(timer)
      }, delay * 1000)
      return () => clearTimeout(timeout)
    }
  }, [isVisible, value, delay])

  return (
    <motion.span
      onViewportEnter={() => setIsVisible(true)}
      className="tabular-nums"
    >
      {prefix}{count.toFixed(1)}{suffix}
    </motion.span>
  )
}

export function PainSection() {
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
      id="pain"
      className="relative min-h-screen px-6 py-32"
    >
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-5xl"
      >
        {/* The big shocking stat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-destructive">
              <AlertTriangle className="h-3 w-3" />
              The Hidden Cost
            </span>
          </motion.div>

          <h2 className="font-serif text-6xl font-light tracking-tight text-foreground md:text-8xl lg:text-9xl">
            <span className="bg-gradient-to-r from-destructive to-destructive/70 bg-clip-text text-transparent">
              $<AnimatedCounter value={3.4} suffix="B" />
            </span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 font-mono text-lg text-muted-foreground md:text-xl"
          >
            lost by e-commerce merchants to supply chain surprises in 2024
          </motion.p>
        </motion.div>

        {/* The reason why */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="font-serif text-2xl font-light leading-relaxed text-foreground md:text-3xl">
            They waited for the news.
          </p>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-4 border-l-4 border-destructive/50 py-4 pl-6 text-left font-serif text-xl italic text-muted-foreground md:text-2xl"
          >
            The news is a post-mortem.
          </motion.p>
        </motion.div>

        {/* Three pain points */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid gap-6 md:grid-cols-3"
        >
          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm transition-all hover:border-destructive/30">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-destructive/5 blur-2xl transition-all group-hover:bg-destructive/10" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground">Reactive Pricing</h3>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                Margins collapse when costs spike unexpectedly. By the time you adjust, customers are gone.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm transition-all hover:border-destructive/30">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-destructive/5 blur-2xl transition-all group-hover:bg-destructive/10" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <Clock className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground">Blind Inventory</h3>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                Over-ordered for demand that never came. Under-stocked when it did. Always a step behind.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/40 p-6 backdrop-blur-sm transition-all hover:border-destructive/30">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-destructive/5 blur-2xl transition-all group-hover:bg-destructive/10" />
            <div className="relative">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="font-serif text-lg font-medium text-foreground">Crisis Mode</h3>
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                Every global event is a fire drill. Scrambling to find alternatives while competitors adapt.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Transition statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20 text-center"
        >
          <p className="font-mono text-sm uppercase tracking-widest text-muted-foreground">
            There&apos;s a better way
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

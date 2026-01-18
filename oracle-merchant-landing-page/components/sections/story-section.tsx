"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { User, TrendingDown, TrendingUp, Package, DollarSign } from "lucide-react"

function AnimatedMoney({ value, delay = 0 }: { value: number; delay?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timeout = setTimeout(() => {
        const duration = 1500
        const steps = 50
        const increment = value / steps
        let current = 0
        const timer = setInterval(() => {
          current += increment
          if (current >= value) {
            setCount(value)
            clearInterval(timer)
          } else {
            setCount(Math.floor(current))
          }
        }, duration / steps)
        return () => clearInterval(timer)
      }, delay)
      return () => clearTimeout(timeout)
    }
  }, [isVisible, value, delay])

  return (
    <motion.span
      onViewportEnter={() => setIsVisible(true)}
      className="tabular-nums"
    >
      ${count.toLocaleString()}
    </motion.span>
  )
}

export function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80, 0, 0, -80])

  return (
    <section
      ref={containerRef}
      id="story"
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
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2 font-mono text-xs uppercase tracking-widest text-gold">
            <User className="h-3 w-3" />
            Real Merchant Story
          </span>

          <h2 className="mt-6 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
            Meet Sarah
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-muted-foreground">
            Owner of a sustainable textiles shop on Shopify. This is her story from 2024.
          </p>
        </motion.div>

        {/* The Timeline Story */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent md:left-1/2" />

          {/* Timeline events */}
          <div className="space-y-12">
            {/* Event 1: Prediction detected */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative flex flex-col md:flex-row md:items-center"
            >
              <div className="absolute left-6 top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent md:left-1/2 md:-translate-x-1/2">
                <div className="h-2 w-2 rounded-full bg-accent-foreground" />
              </div>
              <div className="ml-16 md:ml-0 md:w-1/2 md:pr-12 md:text-right">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">October 3, 2024</span>
                <h3 className="mt-2 font-serif text-xl font-medium text-foreground">Signal Detected</h3>
                <p className="mt-2 font-mono text-sm text-muted-foreground">
                  Polymarket shows <span className="text-accent">82% probability</span> of Red Sea shipping disruption.
                  Predictify alerts Sarah instantly.
                </p>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </motion.div>

            {/* Event 2: Sarah takes action */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative flex flex-col md:flex-row md:items-center"
            >
              <div className="absolute left-6 top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gold md:left-1/2 md:-translate-x-1/2">
                <div className="h-2 w-2 rounded-full bg-background" />
              </div>
              <div className="hidden md:block md:w-1/2" />
              <div className="ml-16 md:ml-0 md:w-1/2 md:pl-12">
                <span className="font-mono text-xs uppercase tracking-widest text-gold">October 5, 2024</span>
                <h3 className="mt-2 font-serif text-xl font-medium text-foreground">Action Taken</h3>
                <p className="mt-2 font-mono text-sm text-muted-foreground">
                  Sarah pre-orders 3 months of silk inventory from an alternate supplier.
                  Locks in current pricing with <span className="text-gold">one click</span>.
                </p>
              </div>
            </motion.div>

            {/* Event 3: Crisis hits */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative flex flex-col md:flex-row md:items-center"
            >
              <div className="absolute left-6 top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-destructive md:left-1/2 md:-translate-x-1/2">
                <div className="h-2 w-2 rounded-full bg-destructive-foreground" />
              </div>
              <div className="ml-16 md:ml-0 md:w-1/2 md:pr-12 md:text-right">
                <span className="font-mono text-xs uppercase tracking-widest text-destructive">November 19, 2024</span>
                <h3 className="mt-2 font-serif text-xl font-medium text-foreground">Crisis Hits</h3>
                <p className="mt-2 font-mono text-sm text-muted-foreground">
                  Red Sea attacks begin. <span className="text-destructive">Shipping costs triple overnight.</span>
                  CNN reports the story. Sarah&apos;s competitors panic.
                </p>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </motion.div>

            {/* Event 4: Outcome */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="relative flex flex-col md:flex-row md:items-center"
            >
              <div className="absolute left-6 top-6 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-accent md:left-1/2 md:-translate-x-1/2">
                <div className="h-2 w-2 rounded-full bg-accent-foreground" />
              </div>
              <div className="hidden md:block md:w-1/2" />
              <div className="ml-16 md:ml-0 md:w-1/2 md:pl-12">
                <span className="font-mono text-xs uppercase tracking-widest text-accent">Result</span>
                <h3 className="mt-2 font-serif text-xl font-medium text-foreground">Protected</h3>
                <p className="mt-2 font-mono text-sm text-muted-foreground">
                  Sarah had inventory when others didn&apos;t.
                  While competitors raised prices 40%, she kept hers stable and <span className="text-accent">captured market share</span>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* The Result Card */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-20"
        >
          <div className="relative overflow-hidden rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/10 via-background to-gold/10 p-8 md:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl" />

            <div className="relative">
              <div className="mb-8 text-center">
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Sarah&apos;s Predictify Advantage
                </span>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                      <Package className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <span className="block font-mono text-3xl font-light text-accent md:text-4xl">
                    <AnimatedMoney value={85000} />
                  </span>
                  <span className="mt-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    In Losses Prevented
                  </span>
                </div>

                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/20">
                      <TrendingUp className="h-6 w-6 text-gold" />
                    </div>
                  </div>
                  <span className="block font-mono text-3xl font-light text-gold md:text-4xl">
                    +23%
                  </span>
                  <span className="mt-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Q4 Revenue Growth
                  </span>
                </div>

                <div className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                      <DollarSign className="h-6 w-6 text-accent" />
                    </div>
                  </div>
                  <span className="block font-mono text-3xl font-light text-foreground md:text-4xl">
                    0
                  </span>
                  <span className="mt-2 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Missed Orders
                  </span>
                </div>
              </div>

              <div className="mt-10 text-center">
                <p className="font-serif text-lg italic text-muted-foreground">
                  &ldquo;I knew about the crisis 47 days before my competitors.
                  That&apos;s not luck. That&apos;s <span className="text-foreground">Predictify</span>.&rdquo;
                </p>
                <p className="mt-3 font-mono text-xs text-muted-foreground">
                  — Sarah, Sustainable Textiles Shop Owner
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

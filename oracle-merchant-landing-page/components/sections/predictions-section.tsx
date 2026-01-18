"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Ship, DollarSign, Package, TrendingUp } from "lucide-react"

interface PredictionProps {
  icon: React.ReactNode
  event: string
  probability: string
  daysEarly: number
  impact: string
  delay: number
}

function Prediction({ icon, event, probability, daysEarly, impact, delay }: PredictionProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const duration = 1500
      const steps = 40
      const increment = daysEarly / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= daysEarly) {
          setCount(daysEarly)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isVisible, daysEarly])

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      onViewportEnter={() => setIsVisible(true)}
      className="group relative"
    >
      <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-background/60 p-6 backdrop-blur-xl transition-all hover:border-accent/30 hover:shadow-xl hover:shadow-accent/10">
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
          {icon}
        </div>

        {/* Event */}
        <h3 className="font-serif text-lg font-medium text-foreground md:text-xl">
          {event}
        </h3>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-4">
          <div className="rounded-full bg-accent/10 px-3 py-1">
            <span className="font-mono text-sm font-semibold text-accent">{probability}</span>
          </div>
          <span className="font-mono text-xs text-muted-foreground">probability</span>
        </div>

        {/* Days early - big number */}
        <div className="mt-6 flex items-baseline gap-2">
          <span className="font-mono text-4xl font-bold text-accent md:text-5xl">{count}</span>
          <span className="font-mono text-sm text-muted-foreground">days early</span>
        </div>

        {/* Impact */}
        <p className="mt-4 font-mono text-xs text-muted-foreground">
          <span className="text-foreground">Impact:</span> {impact}
        </p>
      </div>
    </motion.div>
  )
}

export function PredictionsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60])

  const predictions = [
    {
      icon: <Ship className="h-6 w-6 text-accent" />,
      event: "Red Sea Shipping Crisis",
      probability: "82%",
      daysEarly: 47,
      impact: "Shipping costs tripled overnight",
    },
    {
      icon: <DollarSign className="h-6 w-6 text-accent" />,
      event: "US-China Tariff Increase",
      probability: "78%",
      daysEarly: 20,
      impact: "Consumer goods prices spiked 15%",
    },
    {
      icon: <Package className="h-6 w-6 text-accent" />,
      event: "West Coast Port Congestion",
      probability: "91%",
      daysEarly: 37,
      impact: "Delivery delays up to 3 weeks",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-accent" />,
      event: "Fed Rate Decision",
      probability: "94%",
      daysEarly: 12,
      impact: "Consumer spending patterns shifted",
    },
  ]

  return (
    <section
      ref={containerRef}
      className="relative px-6 py-24"
    >
      <motion.div
        style={{ opacity, y }}
        className="mx-auto max-w-6xl"
      >
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <h2 className="font-serif text-3xl font-light text-foreground md:text-4xl">
            Events that <span className="text-accent">moved markets</span>
          </h2>
          <p className="mt-4 font-mono text-sm text-muted-foreground">
            All predicted weeks before they hit the news
          </p>
        </motion.div>

        {/* Predictions grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {predictions.map((pred, i) => (
            <Prediction key={i} {...pred} delay={i * 0.1} />
          ))}
        </div>

        {/* Bottom connector */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-16 text-center"
        >
          <p className="font-mono text-sm text-muted-foreground">
            Every one of these events cost merchants who didn&apos;t see them coming.
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}

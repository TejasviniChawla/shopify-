"use client"

import React from "react"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { Brain, Link, ArrowRight } from "lucide-react"

interface FeatureCardProps {
  icon: React.ReactNode
  badge: string
  title: string
  description: string
  features: string[]
  delay: number
  accentColor: "accent" | "gold"
}

function FeatureCard({
  icon,
  badge,
  title,
  description,
  features,
  delay,
  accentColor,
}: FeatureCardProps) {
  const colorClasses = {
    accent: {
      bg: "bg-accent/10",
      border: "border-accent/20",
      text: "text-accent",
      glow: "bg-accent/20",
    },
    gold: {
      bg: "bg-gold/10",
      border: "border-gold/20",
      text: "text-gold",
      glow: "bg-gold/20",
    },
  }

  const colors = colorClasses[accentColor]

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay }}
      className={`group relative overflow-hidden rounded-2xl border ${colors.border} bg-background/60 p-8 backdrop-blur-sm transition-all hover:shadow-xl`}
    >
      {/* Background glow */}
      <div
        className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${colors.glow} blur-3xl transition-all group-hover:h-40 group-hover:w-40`}
      />

      <div className="relative">
        {/* Badge */}
        <span
          className={`inline-block rounded-full ${colors.bg} px-3 py-1 font-mono text-xs uppercase tracking-widest ${colors.text}`}
        >
          {badge}
        </span>

        {/* Icon */}
        <div
          className={`mt-6 flex h-14 w-14 items-center justify-center rounded-2xl ${colors.bg}`}
        >
          {icon}
        </div>

        {/* Title */}
        <h3 className="mt-6 font-serif text-2xl font-medium text-foreground">
          {title}
        </h3>

        {/* Description */}
        <p className="mt-4 font-mono text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {/* Features list */}
        <ul className="mt-6 space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-center gap-3">
              <div className={`h-1.5 w-1.5 rounded-full ${accentColor === 'accent' ? 'bg-accent' : 'bg-gold'}`} />
              <span className="font-mono text-sm text-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <button
          className={`mt-8 flex items-center gap-2 font-mono text-sm uppercase tracking-widest ${colors.text} transition-all hover:gap-4`}
        >
          Learn More
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

export function FinancialSection() {
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
      id="financial"
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
            Chapter V
          </span>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl">
            The Financial Rail
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-mono text-sm text-muted-foreground">
            Powered by Solana & Gemini for programmable certainty
          </p>
        </motion.div>

        {/* Feature cards */}
        <div className="grid gap-8 md:grid-cols-2">
          <FeatureCard
            icon={<Brain className="h-7 w-7 text-gold" />}
            badge="Gemini AI"
            title="The Economic Translator"
            description="Transform complex market signals into actionable commerce insights. Gemini-powered analysis translates prediction market data into plain-language recommendations."
            features={[
              "Real-time sentiment analysis",
              "Multi-market correlation mapping",
              "Natural language insights",
              "Automated decision trees",
            ]}
            delay={0.2}
            accentColor="gold"
          />

          <FeatureCard
            icon={<Link className="h-7 w-7 text-accent" />}
            badge="Solana"
            title="Programmable Certainty"
            description="Lock in your margins with automated hedging contracts on Solana. When prediction thresholds are met, smart contracts execute your pre-defined strategy."
            features={[
              "Sub-second execution",
              "Transparent on-chain logic",
              "Automated hedging triggers",
              "Zero-trust verification",
            ]}
            delay={0.4}
            accentColor="accent"
          />
        </div>

        {/* Bottom integration visual */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Seamless Integration
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
            {["Polymarket", "Shopify", "Solana", "Gemini", "ElevenLabs"].map(
              (partner, i) => (
                <motion.div
                  key={partner}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  className="rounded-full border border-border/50 bg-card/30 px-6 py-3 font-mono text-sm text-muted-foreground transition-all hover:border-gold/50 hover:text-foreground"
                >
                  {partner}
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

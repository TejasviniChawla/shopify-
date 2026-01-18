"use client"

import { motion } from "framer-motion"
import { Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CareersPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6">
      {/* Background gradients */}
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />

      {/* Navigation back */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute top-8 left-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
      </motion.div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-foreground"
      >
        <Eye className="h-8 w-8 text-background" />
      </motion.div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl lg:text-6xl">
          hi, looking for{" "}
          <span className="bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
            summer internship
          </span>
        </h1>

        <p className="mt-6 font-mono text-lg text-muted-foreground md:text-xl">
          please hire us for more easter eggs like this lol sorry
        </p>
      </motion.div>

      {/* Decorative element */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-12 flex h-px w-24 bg-gold"
      />
    </div>
  )
}

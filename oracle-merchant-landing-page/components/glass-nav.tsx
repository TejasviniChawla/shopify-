"use client"

import { motion } from "framer-motion"
import { Eye } from "lucide-react"

export function GlassNav() {
  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between rounded-full border border-border/50 bg-background/60 px-6 py-3 backdrop-blur-xl">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
              <Eye className="h-5 w-5 text-background" />
            </div>
            <span className="font-serif text-lg font-semibold tracking-wide text-foreground">
              Predictify
            </span>
          </div>

          {/* Navigation Links */}
          <div className="hidden items-center gap-6 lg:flex">
            <a href="#prophecy" className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
              Predictions
            </a>
            <a href="#identity" className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
              Solution
            </a>
            <a href="#story" className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
              Proof
            </a>
            <a href="#demo" className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
              Demo
            </a>
            <a href="#technology" className="font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
              Technology
            </a>
          </div>

          {/* CTA Button */}
          <button className="group relative overflow-hidden rounded-full bg-foreground px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-background transition-all hover:shadow-lg hover:shadow-accent/20">
            <span className="relative z-10">Request Access</span>
            <div className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-300 group-hover:translate-x-0" />
            <span className="absolute inset-0 z-10 flex items-center justify-center font-mono text-xs uppercase tracking-widest text-accent-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Request Access
            </span>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

"use client"

import { motion } from "framer-motion"
import { Eye, ArrowRight } from "lucide-react"

export function FooterSection() {
  return (
    <footer className="relative overflow-hidden px-6 py-32">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/5 to-transparent" />

      <div className="relative mx-auto max-w-6xl">
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-24 text-center"
        >
          <h2 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-6xl">
            Ready to trade on{" "}
            <span className="bg-gradient-to-r from-gold to-accent bg-clip-text text-transparent">
              truth
            </span>
            ?
          </h2>
          <p className="mx-auto mt-6 max-w-lg font-mono text-sm text-muted-foreground">
            Join the merchants who see the future before it becomes the news.
          </p>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative mt-8 overflow-hidden rounded-full bg-foreground px-10 py-5 font-mono text-sm uppercase tracking-widest text-background transition-all hover:shadow-xl hover:shadow-accent/20"
          >
            <span className="relative z-10 flex items-center gap-3 transition-colors group-hover:text-accent-foreground">
              Request Early Access
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 -translate-x-full bg-accent transition-transform duration-500 group-hover:translate-x-0" />
          </motion.button>
        </motion.div>

        {/* Footer content */}
        <div className="grid gap-12 border-t border-border/50 pt-12 md:grid-cols-4">
          {/* Logo and tagline */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground">
                <Eye className="h-5 w-5 text-background" />
              </div>
              <span className="font-serif text-lg font-semibold tracking-wide text-foreground">
                Predictify
              </span>
            </div>
            <p className="mt-4 max-w-sm font-mono text-sm leading-relaxed text-muted-foreground">
              Transforming global sentiment into inventory certainty. Commerce is
              no longer a guessing game.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground">
              Product
            </h4>
            <ul className="mt-4 space-y-3">
              {["Features", "Pricing", "Integration", "API Docs"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-foreground">
              Company
            </h4>
            <ul className="mt-4 space-y-3">
              {["About", "Blog", "Careers", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="font-mono text-xs text-muted-foreground">
            © 2026 Predictify. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy
            </a>
            <a
              href="#"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms
            </a>
            <a
              href="#"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

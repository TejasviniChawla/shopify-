"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { useRef, useState } from "react"
import { 
  ChevronDown, 
  ShoppingBag, 
  BarChart3, 
  Bot, 
  Coins,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  CheckCircle2,
  ArrowRight,
  Cpu,
  MessageSquare,
  ShieldCheck
} from "lucide-react"

interface SponsorCardProps {
  icon: React.ReactNode
  badge: string
  badgeColor: "gold" | "accent" | "blue" | "purple"
  title: string
  subtitle: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  delay: number
}

function SponsorCard({
  icon,
  badge,
  badgeColor,
  title,
  subtitle,
  isOpen,
  onToggle,
  children,
  delay,
}: SponsorCardProps) {
  const badgeColors = {
    gold: "bg-gold/10 text-gold border-gold/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  }

  const glowColors = {
    gold: "bg-gold/20",
    accent: "bg-accent/20",
    blue: "bg-blue-500/20",
    purple: "bg-purple-500/20",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border/50 bg-background/60 backdrop-blur-sm"
    >
      {/* Background glow */}
      <div
        className={`absolute -right-12 -top-12 h-32 w-32 rounded-full ${glowColors[badgeColor]} blur-3xl transition-all duration-500 ${isOpen ? "h-48 w-48 opacity-100" : "opacity-50"}`}
      />

      {/* Header - clickable */}
      <button
        onClick={onToggle}
        className="relative flex w-full items-center justify-between gap-4 p-6 text-left transition-colors hover:bg-card/30"
      >
        <div className="flex items-center gap-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${badgeColors[badgeColor].replace('text-', 'bg-').split(' ')[0]}/10`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className={`inline-block rounded-full border px-3 py-0.5 font-mono text-xs uppercase tracking-widest ${badgeColors[badgeColor]}`}>
                {badge}
              </span>
            </div>
            <h3 className="mt-1 font-serif text-xl font-medium text-foreground">
              {title}
            </h3>
            <p className="font-mono text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </button>

      {/* Content */}
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          opacity: isOpen ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <div className="border-t border-border/50 p-6">{children}</div>
      </motion.div>
    </motion.div>
  )
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5">{icon}</div>
      <span className="font-mono text-sm text-muted-foreground">{text}</span>
    </div>
  )
}

export function SponsorSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [openCard, setOpenCard] = useState<string | null>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [60, 0, 0, -60])

  const toggleCard = (id: string) => {
    setOpenCard(openCard === id ? null : id)
  }

  return (
    <section
      ref={containerRef}
      id="technology"
      className="relative px-6 py-32"
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
          className="mb-12 text-center"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-gold">
            Technical Deep Dive
          </span>
          <h2 className="mt-4 font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
            How It Works
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-muted-foreground">
            Click to explore the technology powering Predictify
          </p>
        </motion.div>

        {/* Sponsor Cards */}
        <div className="flex flex-col gap-4">
          {/* Shopify Track */}
          <SponsorCard
            icon={<ShoppingBag className="h-6 w-6 text-gold" />}
            badge="Shopify"
            badgeColor="gold"
            title="AI-Powered Merchant Superpowers"
            subtitle="Commerce intelligence meets predictive analytics"
            isOpen={openCard === "shopify"}
            onToggle={() => toggleCard("shopify")}
            delay={0.1}
          >
            <div className="space-y-6">
              <p className="font-mono text-sm leading-relaxed text-foreground">
                Predictify transforms how merchants operate by connecting <span className="text-gold">real-time prediction market signals</span> directly to actionable commerce decisions.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    <span className="font-mono text-xs uppercase tracking-widest text-gold">AI Actions</span>
                  </div>
                  <ul className="space-y-2">
                    <FeatureItem icon={<CheckCircle2 className="h-4 w-4 text-gold" />} text="Auto-generate campaign copy from market trends" />
                    <FeatureItem icon={<CheckCircle2 className="h-4 w-4 text-gold" />} text="Dynamic pricing based on supply signals" />
                    <FeatureItem icon={<CheckCircle2 className="h-4 w-4 text-gold" />} text="Smart inventory re-ordering suggestions" />
                  </ul>
                </div>
                
                <div className="rounded-xl border border-border/50 bg-card/30 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-gold" />
                    <span className="font-mono text-xs uppercase tracking-widest text-gold">Commerce Intel</span>
                  </div>
                  <ul className="space-y-2">
                    <FeatureItem icon={<CheckCircle2 className="h-4 w-4 text-gold" />} text="World events → demand predictions" />
                    <FeatureItem icon={<CheckCircle2 className="h-4 w-4 text-gold" />} text="Supply chain risk monitoring" />
                    <FeatureItem icon={<CheckCircle2 className="h-4 w-4 text-gold" />} text="One-click action implementation" />
                  </ul>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gold/5 px-4 py-3 border border-gold/20">
                <Zap className="h-4 w-4 text-gold" />
                <span className="font-mono text-xs text-gold">
                  Small merchants gain Wall Street-level insights without the complexity
                </span>
              </div>
            </div>
          </SponsorCard>

          {/* Amplitude Track */}
          <SponsorCard
            icon={<BarChart3 className="h-6 w-6 text-accent" />}
            badge="Amplitude"
            badgeColor="accent"
            title="Self-Improving Product Loop"
            subtitle="Behavioral data → AI insights → adaptive experience"
            isOpen={openCard === "amplitude"}
            onToggle={() => toggleCard("amplitude")}
            delay={0.2}
          >
            <div className="space-y-6">
              <p className="font-mono text-sm leading-relaxed text-foreground">
                We implement the <span className="text-accent">Amplitude-style analytics loop</span>: tracking user behavior, feeding it to AI, and adapting the product experience in real-time.
              </p>
              
              {/* Event Schema */}
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-accent" />
                  <span className="font-mono text-xs uppercase tracking-widest text-accent">Event Schema</span>
                </div>
                <div className="grid gap-2 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-accent/20 px-2 py-0.5 text-accent">market_risk_viewed</span>
                    <span className="text-muted-foreground">→ Track which risks merchants explore</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-accent/20 px-2 py-0.5 text-accent">action_applied</span>
                    <span className="text-muted-foreground">→ Log when AI suggestions are used</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-accent/20 px-2 py-0.5 text-accent">suggestion_dismissed</span>
                    <span className="text-muted-foreground">→ Learn from rejected recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-accent/20 px-2 py-0.5 text-accent">hedge_executed</span>
                    <span className="text-muted-foreground">→ Track financial actions taken</span>
                  </div>
                </div>
              </div>

              {/* The Loop */}
              <div className="flex items-center justify-center gap-2 py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-accent/5">
                  <Users className="h-6 w-6 text-accent" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-accent/5">
                  <BarChart3 className="h-6 w-6 text-accent" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-accent/20 bg-accent/5">
                  <Sparkles className="h-6 w-6 text-accent" />
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                  <Zap className="h-6 w-6 text-gold" />
                </div>
              </div>
              <div className="flex justify-center gap-8 font-mono text-xs text-muted-foreground">
                <span>Behavior</span>
                <span>Analytics</span>
                <span>AI</span>
                <span>Adapt</span>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-accent/5 px-4 py-3 border border-accent/20">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="font-mono text-xs text-accent">
                  AI reorders suggestions based on past behavior — not just rules
                </span>
              </div>
            </div>
          </SponsorCard>

          {/* Foresters Track */}
          <SponsorCard
            icon={<Bot className="h-6 w-6 text-purple-400" />}
            badge="Foresters"
            badgeColor="purple"
            title="Multi-Agent Orchestration"
            subtitle="3+ specialized AI agents with state handoffs"
            isOpen={openCard === "foresters"}
            onToggle={() => toggleCard("foresters")}
            delay={0.3}
          >
            <div className="space-y-6">
              <p className="font-mono text-sm leading-relaxed text-foreground">
                Complex commerce decisions require <span className="text-purple-400">multiple specialized perspectives</span>. Our multi-agent system orchestrates 4 AI agents with clear state handoffs.
              </p>
              
              {/* Agent Pipeline */}
              <div className="space-y-3">
                <div className="flex items-start gap-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                    <span className="font-mono text-sm font-bold text-purple-400">1</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-medium text-foreground">Signal Analyst Agent</h4>
                    <p className="font-mono text-xs text-muted-foreground">
                      Interprets prediction market data and extracts commerce-relevant implications
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-xs text-purple-400">Input: Raw market data</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-xs text-purple-400">Output: Risk signals</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                    <span className="font-mono text-sm font-bold text-purple-400">2</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-medium text-foreground">Merchant Strategist Agent</h4>
                    <p className="font-mono text-xs text-muted-foreground">
                      Translates signals into specific small-business commerce actions
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-xs text-purple-400">Input: Risk signals</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-xs text-purple-400">Output: Action proposals</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-purple-500/20 bg-purple-500/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
                    <span className="font-mono text-sm font-bold text-purple-400">3</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-medium text-foreground">Feasibility Agent</h4>
                    <p className="font-mono text-xs text-muted-foreground">
                      Validates actions against constraints: budget, seasonality, brand fit
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-xs text-purple-400">Input: Actions + constraints</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="rounded bg-purple-500/20 px-2 py-0.5 font-mono text-xs text-purple-400">Output: Validated plan</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-xl border border-gold/20 bg-gold/5 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/20">
                    <span className="font-mono text-sm font-bold text-gold">4</span>
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-medium text-foreground">Creative Agent</h4>
                    <p className="font-mono text-xs text-muted-foreground">
                      Produces final copy, campaign assets, and implementation steps
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="rounded bg-gold/20 px-2 py-0.5 font-mono text-xs text-gold">Input: Validated plan</span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="rounded bg-gold/20 px-2 py-0.5 font-mono text-xs text-gold">Output: Ready to deploy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-purple-500/5 px-4 py-3 border border-purple-500/20">
                <MessageSquare className="h-4 w-4 text-purple-400" />
                <span className="font-mono text-xs text-purple-400">
                  Full communication log available for agent decision transparency
                </span>
              </div>
            </div>
          </SponsorCard>

          {/* Solana Track */}
          <SponsorCard
            icon={<Coins className="h-6 w-6 text-[#14F195]" />}
            badge="Solana"
            badgeColor="accent"
            title="Programmable Certainty"
            subtitle="Lock in margins with on-chain hedging"
            isOpen={openCard === "solana"}
            onToggle={() => toggleCard("solana")}
            delay={0.4}
          >
            <div className="space-y-6">
              <p className="font-mono text-sm leading-relaxed text-foreground">
                When Predictify sees risk, you can <span className="text-accent">lock in protection on Solana</span>. Our integration uses Solana Pay for instant, low-cost hedge transactions.
              </p>
              
              <div className="rounded-xl border border-accent/20 bg-accent/5 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Coins className="h-5 w-5 text-accent" />
                  <span className="font-mono text-sm font-medium text-accent">How Solana Hedging Works</span>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-mono text-xs font-bold text-accent">1</div>
                    <div>
                      <p className="font-mono text-sm text-foreground">Predictify detects high-probability risk (e.g., shipping delays at 78%)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-mono text-xs font-bold text-accent">2</div>
                    <div>
                      <p className="font-mono text-sm text-foreground">Click "Hedge" to generate a Solana Pay QR code</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-mono text-xs font-bold text-accent">3</div>
                    <div>
                      <p className="font-mono text-sm text-foreground">Scan with Phantom/Solflare wallet to deposit USDC</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/20 font-mono text-xs font-bold text-gold">4</div>
                    <div>
                      <p className="font-mono text-sm text-foreground">If risk materializes, hedge pays out automatically via smart contract</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="flex flex-col items-center rounded-lg border border-border/50 bg-card/30 p-3 text-center">
                  <Zap className="mb-1 h-5 w-5 text-accent" />
                  <span className="font-mono text-xs text-muted-foreground">Sub-second</span>
                  <span className="font-serif text-sm text-foreground">Execution</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-border/50 bg-card/30 p-3 text-center">
                  <Cpu className="mb-1 h-5 w-5 text-accent" />
                  <span className="font-mono text-xs text-muted-foreground">Transparent</span>
                  <span className="font-serif text-sm text-foreground">On-chain</span>
                </div>
                <div className="flex flex-col items-center rounded-lg border border-border/50 bg-card/30 p-3 text-center">
                  <ShieldCheck className="mb-1 h-5 w-5 text-accent" />
                  <span className="font-mono text-xs text-muted-foreground">Zero-trust</span>
                  <span className="font-serif text-sm text-foreground">Verification</span>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-accent/5 px-4 py-3 border border-accent/20">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span className="font-mono text-xs text-accent">
                  USDC payments via Solana Pay — no complex DeFi knowledge required
                </span>
              </div>
            </div>
          </SponsorCard>
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="font-mono text-xs text-muted-foreground">
            Built with{" "}
            <span className="text-gold">Gemini</span> for AI reasoning •{" "}
            <span className="text-accent">ElevenLabs</span> for voice briefings •{" "}
            <span className="text-foreground">Polymarket</span> for prediction data
          </p>
        </motion.div>
      </motion.div>
    </section>
  )
}


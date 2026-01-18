"use client"

import { useScroll, useTransform } from "framer-motion"
import { useRef, useMemo } from "react"

import { MarbleGlobe } from "@/components/marble-globe"
import { GlassNav } from "@/components/glass-nav"
import { ShockHeroSection } from "@/components/sections/shock-hero-section"
import { PredictionsSection } from "@/components/sections/predictions-section"
import { PainSection } from "@/components/sections/pain-section"
import { IdentitySection } from "@/components/sections/identity-section"
import { StorySection } from "@/components/sections/story-section"
import { DemoSection } from "@/components/sections/demo-section"
import { SponsorSection } from "@/components/sections/sponsor-section"
import { FooterSection } from "@/components/sections/footer-section"

export default function OracleMerchantPage() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Transform scroll progress to different glow colors for the globe
  const glowColor = useTransform(
    scrollYProgress,
    [0, 0.1, 0.2, 0.3, 0.4, 0.55, 0.7, 0.85, 1],
    [
      "#00FF41", // Green - Shock Hero
      "#00FF41", // Green - Predictions
      "#EF4444", // Red - Pain
      "#C9A962", // Gold - Identity
      "#C9A962", // Gold - Story
      "#00FF41", // Green - Demo
      "#C9A962", // Gold - Sponsors
      "#00FF41", // Green - Footer
      "#00FF41", // Green - End
    ]
  )

  // Get the current glow color as a string for the globe component
  const currentGlowColor = useMemo(() => {
    return "#00FF41" // Default, will be animated via useTransform
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background">
      {/* 3D Marble Globe Background */}
      <MarbleGlobeWrapper glowColorMotion={glowColor} scrollProgress={scrollYProgress} />

      {/* Glassmorphic Navigation */}
      <GlassNav />

      {/* Main Content */}
      <main>
        {/* 1. SHOCK VALUE: Trump won. Polymarket knew. 89% */}
        <ShockHeroSection />

        {/* 2. MORE PREDICTIONS: Commerce-relevant events */}
        <PredictionsSection />

        {/* 3. THE PAIN: Industry-wide losses from not knowing */}
        <PainSection />

        {/* 4. THE PROMISE: Become an Informed Merchant */}
        <IdentitySection />

        {/* 5. THE PROOF: Sarah's story - one compelling case */}
        <StorySection />

        {/* 6. THE DEMO: Voice briefing + SimGym visualization */}
        <DemoSection />

        {/* 7. THE TECH: Sponsor-specific features for judging */}
        <SponsorSection />

        {/* 8. THE ASK: CTA + Footer */}
        <FooterSection />
      </main>
    </div>
  )
}

// Wrapper component to handle motion values
import { MotionValue, useMotionValueEvent } from "framer-motion"
import { useState } from "react"

function MarbleGlobeWrapper({
  glowColorMotion,
  scrollProgress
}: {
  glowColorMotion: MotionValue<string>
  scrollProgress: MotionValue<number>
}) {
  const [glowColor, setGlowColor] = useState("#00FF41")
  const [progress, setProgress] = useState(0)

  useMotionValueEvent(glowColorMotion, "change", (latest) => {
    setGlowColor(latest)
  })

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    setProgress(latest)
  })

  return <MarbleGlobe glowColor={glowColor} scrollProgress={progress} />
}

"use client"

import { useScroll, useTransform } from "framer-motion"
import { useRef, useMemo } from "react"

import { MarbleGlobe } from "@/components/marble-globe"
import { GlassNav } from "@/components/glass-nav"
import { HeroSection } from "@/components/sections/hero-section"
import { StorySection } from "@/components/sections/story-section"
import { OracleSection } from "@/components/sections/oracle-section"
import { SimGymSection } from "@/components/sections/simgym-section"
import { FinancialSection } from "@/components/sections/financial-section"
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
    [0, 0.2, 0.4, 0.6, 0.8, 1],
    [
      "#C9A962", // Gold - Hero
      "#EF4444", // Red - Story (tragedy)
      "#00FF41", // Green - Oracle
      "#00FF41", // Green - SimGym
      "#C9A962", // Gold - Financial
      "#00FF41", // Green - Footer
    ]
  )

  // Get the current glow color as a string for the globe component
  const currentGlowColor = useMemo(() => {
    return "#C9A962" // Default, will be animated via useTransform
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background">
      {/* 3D Marble Globe Background */}
      <MarbleGlobeWrapper glowColorMotion={glowColor} scrollProgress={scrollYProgress} />

      {/* Glassmorphic Navigation */}
      <GlassNav />

      {/* Main Content */}
      <main>
        <HeroSection />
        <StorySection />
        <OracleSection />
        <SimGymSection />
        <FinancialSection />
        <SponsorSection />
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
  const [glowColor, setGlowColor] = useState("#C9A962")
  const [progress, setProgress] = useState(0)

  useMotionValueEvent(glowColorMotion, "change", (latest) => {
    setGlowColor(latest)
  })

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    setProgress(latest)
  })

  return <MarbleGlobe glowColor={glowColor} scrollProgress={progress} />
}

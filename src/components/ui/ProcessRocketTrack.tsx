'use client'

import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import {
  Rocket,
  ArrowRight,
  FileText,
  Search,
  FileCheck,
  ShieldCheck,
  Clock,
  Check
} from 'lucide-react'

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Submit Inquiry',
    description: 'Fill our commercial audit request form. Our team reviews your company profile within 2 hours.',
    iconTag: 'Form & SLA',
    icon: FileText
  },
  {
    step: '02',
    title: 'CCR & Report Pull',
    description: 'We obtain your Company Credit Report from All 4 Bureaus (CIBIL, Experian, Equifax, CRIF), plus director-level pulls.',
    iconTag: '4 Bureaus',
    icon: Search
  },
  {
    step: '03',
    title: 'Error Identification',
    description: 'Our team maps every discrepancy in your report: duplicate account lines, PAN mismatches, incorrect account classifications, and registry errors — nothing gets missed.',
    iconTag: 'Audit Desk',
    icon: FileCheck
  },
  {
    step: '04',
    title: 'Dispute Filing',
    description: 'Formal dispute documentation is compiled and submitted to All 4 Bureaus (CIBIL, Experian, Equifax, CRIF) and relevant banks on your behalf.',
    iconTag: 'Direct Legal',
    icon: ShieldCheck
  },
  {
    step: '05',
    title: 'Ongoing Monitoring',
    description: 'Monthly and quarterly reports are delivered for the duration of your plan. We flag new issues proactively.',
    iconTag: '24/7 Desk',
    icon: Clock
  }
]

export default function ProcessRocketTrack() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const prevPRef = useRef(0)
  
  const [rocketPos, setRocketPos] = useState({ x: 240, y: 275, rotate: 0 })
  const [isBackward, setIsBackward] = useState(false)
  const [totalPathLength, setTotalPathLength] = useState(2000)

  // Scroll tracking with Framer Motion
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  })

  // Physics spring for silky smooth 60fps inertia
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 75,
    damping: 25,
    restDelta: 0.0001
  })

  // Hardware accelerated horizontal slide for track container (0% to -46%)
  const trackX = useTransform(smoothProgress, [0, 1], ['0%', '-46%'])

  // Measure path length on mount
  useEffect(() => {
    if (pathRef.current) {
      const len = pathRef.current.getTotalLength()
      if (len > 0) setTotalPathLength(len)
    }
  }, [])

  // Subscribe to smoothProgress updates to calculate EXACT SVG path position and scroll direction
  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (p) => {
      if (!pathRef.current) return
      const len = totalPathLength
      const currentLen = Math.max(0, Math.min(len, p * len))

      // Detect scroll direction (forward vs backward)
      if (p < prevPRef.current - 0.002) {
        setIsBackward(true)
      } else if (p > prevPRef.current + 0.002) {
        setIsBackward(false)
      }
      prevPRef.current = p
      
      // Get exact point on SVG curve
      const pt = pathRef.current.getPointAtLength(currentLen)
      const ptAhead = pathRef.current.getPointAtLength(Math.min(len, currentLen + 5))
      
      // Calculate exact tangent angle of the curve
      const dx = ptAhead.x - pt.x
      const dy = ptAhead.y - pt.y
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)

      setRocketPos({
        x: pt.x,
        y: 235 + pt.y, // 235px is the top offset of the middle SVG channel
        rotate: angle
      })
    })

    return () => unsubscribe()
  }, [smoothProgress, totalPathLength])

  // SVG progress path dashoffset
  const pathDashoffset = useTransform(smoothProgress, [0, 1], [totalPathLength, 0])

  return (
    <>
      {/* ── MOBILE / TABLET VERTICAL TIMELINE LAYOUT (< 1024px) ── */}
      <section id="process-mobile" className="block lg:hidden w-full bg-[#FCFCFC] border-b border-slate-200 py-16 scroll-mt-20">
        <div className="mx-auto max-w-[1280px] px-6">
          {/* Header */}
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-[#2563EB]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB]">OUR PROCESS</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-[#0A2342] leading-tight">
              From inquiry to clean bureau record.
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
              A structured, 5-step commercial audit & dispute resolution workflow engineered for speed, accuracy, and bureau compliance.
            </p>
          </div>

          {/* Vertical Process Steps */}
          <div className="relative border-l-2 border-dashed border-blue-200 ml-4 pl-6 space-y-6">
            {PROCESS_STEPS.map((item, idx) => {
              const IconComp = item.icon
              return (
                <div key={item.step} className="relative bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs">
                  {/* Step Badge Node on Vertical Line */}
                  <div className="absolute -left-[37px] top-4 h-7 w-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-mono text-[10px] font-bold shadow-md border-2 border-white">
                    {item.step}
                  </div>

                  <div className="flex items-center justify-between mb-2.5">
                    <span className="px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 rounded-md">
                      {item.iconTag}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Step {idx + 1} of 5</span>
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <IconComp className="h-4 w-4 text-[#2563EB] shrink-0" />
                    <h3 className="font-display text-sm font-bold text-[#0A2342]">{item.title}</h3>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {item.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── DESKTOP PINNED HORIZONTAL ROCKET TRACK (>= 1024px) ── */}
      <section id="process" ref={containerRef} className="hidden lg:block relative h-[300vh] border-b border-slate-200 bg-[#FCFCFC] scroll-mt-20">
        
        {/* Pinned Viewport Stage */}
        <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">
          
          {/* Header */}
          <div className="mx-auto max-w-[1280px] w-full px-6 sm:px-10 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-px w-8 bg-[#2563EB]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#2563EB]">OUR PROCESS</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-black text-[#0A2342] leading-tight">
              From inquiry to clean bureau record.
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500 font-normal leading-relaxed max-w-2xl">
              A structured, 5-step commercial audit & dispute resolution workflow engineered for speed, accuracy, and bureau compliance.
            </p>
          </div>

          {/* Horizontal Scrolling Canvas Stage (600px height so cards fit full descriptions without truncation or edge clipping) */}
          <div className="relative w-full h-[600px] overflow-hidden py-4">
            
            {/* Hardware Accelerated Sliding Track Wrapper */}
            <motion.div
              style={{
                x: trackX,
                willChange: 'transform'
              }}
              className="absolute left-0 top-0 h-full w-[2300px] pointer-events-none"
            >
              {/* Middle Wavy SVG Path Line (Positioned in z-20 channel at Y=235px) */}
              <div className="absolute top-[235px] left-0 w-[2100px] h-[80px] z-20 pointer-events-none">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 2100 80" preserveAspectRatio="none">
                  {/* Dashed Background Wave */}
                  <path
                    d="M 240 40 Q 440 0, 640 40 T 1040 40 T 1440 40 T 1840 40"
                    fill="none"
                    stroke="#CBD5E1"
                    strokeWidth="3.5"
                    strokeDasharray="8 8"
                  />
                  {/* Active Blue Progress Wave Path */}
                  <motion.path
                    ref={pathRef}
                    d="M 240 40 Q 440 0, 640 40 T 1040 40 T 1440 40 T 1840 40"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="4.5"
                    strokeDasharray={totalPathLength}
                    style={{ strokeDashoffset: pathDashoffset }}
                  />
                </svg>
              </div>

              {/* Flying Rocket Icon (Locked 100% onto the blue SVG line in z-30) */}
              <div
                style={{
                  left: `${rocketPos.x}px`,
                  top: `${rocketPos.y}px`,
                  transform: `translate(-50%, -50%) rotate(${rocketPos.rotate + (isBackward ? 225 : 45)}deg)`,
                  willChange: 'left, top, transform'
                }}
                className="absolute z-30 pointer-events-none transition-transform duration-100 ease-out"
              >
                <div className="relative flex items-center justify-center">
                  {/* Rocket Boost Trail Emission at the Rear */}
                  <span className="absolute -bottom-2 -left-2.5 h-3 w-5 bg-gradient-to-r from-amber-400 via-orange-500 to-blue-500 rounded-full animate-pulse opacity-90 blur-[1px] transform -rotate-45" />
                  <div className="h-12 w-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-2xl border-2 border-white ring-4 ring-blue-500/30">
                    <Rocket className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Alternating Step Cards (Sized w-[350px] h-[225px] for 100% full text visibility) */}
              <div className="absolute inset-0 pointer-events-auto z-10">
                {PROCESS_STEPS.map((item, idx) => {
                  const stepThreshold = idx / 4
                  
                  // Alternating layout: EVEN indices (0, 2, 4) sit ABOVE the wave line at top=10px; ODD indices (1, 3) sit BELOW at top=330px
                  const isTopCard = idx % 2 === 0
                  const cardLeft = 180 + idx * 400
                  const cardTop = isTopCard ? 10 : 330

                  return (
                    <StepCardItem
                      key={item.step}
                      item={item}
                      idx={idx}
                      cardLeft={cardLeft}
                      cardTop={cardTop}
                      smoothProgress={smoothProgress}
                      threshold={stepThreshold}
                    />
                  )
                })}
              </div>

            </motion.div>

          </div>

        </div>
      </section>
    </>
  )
}

function StepCardItem({
  item,
  idx,
  cardLeft,
  cardTop,
  smoothProgress,
  threshold
}: {
  item: typeof PROCESS_STEPS[0]
  idx: number
  cardLeft: number
  cardTop: number
  smoothProgress: any
  threshold: number
}) {
  const IconComp = item.icon

  // Smooth active highlight threshold
  const isReachedTransform = useTransform(smoothProgress, [threshold - 0.08, threshold], [0, 1])
  const cardScale = useTransform(smoothProgress, [threshold - 0.08, threshold], [0.98, 1.03])
  const borderOpacity = useTransform(smoothProgress, [threshold - 0.08, threshold], [0.75, 1])

  const [isReached, setIsReached] = useState(false)

  useEffect(() => {
    const unsub = isReachedTransform.on('change', (v) => {
      setIsReached(v >= 0.8)
    })
    return () => unsub()
  }, [isReachedTransform])

  return (
    <motion.div
      style={{
        left: `${cardLeft}px`,
        top: `${cardTop}px`,
        opacity: borderOpacity,
        scale: cardScale,
        willChange: 'transform, opacity'
      }}
      className={`absolute w-[350px] min-h-[225px] bg-white border rounded-2xl p-5 shadow-xs transition-all duration-300 flex flex-col justify-between group ${
        isReached
          ? 'border-[#2563EB] ring-4 ring-[#2563EB]/15 shadow-xl bg-gradient-to-b from-blue-50/30 to-white'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Enhanced Step Number Badge & Tag */}
        <div className="flex items-center justify-between mb-3">
          <div className={`h-10 w-10 rounded-xl font-extrabold text-sm flex items-center justify-center font-mono transition-all duration-300 shadow-md ${
            isReached
              ? 'bg-[#2563EB] text-white ring-4 ring-blue-500/25 scale-105'
              : 'bg-[#0A2342] text-white'
          }`}>
            {isReached ? (
              <Check className="h-5 w-5 stroke-[3] text-white" />
            ) : (
              item.step
            )}
          </div>
          <span className={`px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-md transition-colors ${
            isReached ? 'bg-blue-100 text-[#2563EB]' : 'bg-slate-100 text-slate-600'
          }`}>
            {item.iconTag}
          </span>
        </div>

        {/* Step Title & Description */}
        <div className="flex items-center gap-2 mb-1.5">
          <IconComp className={`h-4 w-4 shrink-0 transition-colors ${isReached ? 'text-[#2563EB]' : 'text-slate-400'}`} />
          <h3 className={`font-display text-sm font-black transition-colors ${isReached ? 'text-[#2563EB]' : 'text-[#0A2342]'}`}>
            {item.title}
          </h3>
        </div>
        
        {/* Full Unclipped Description Text */}
        <p className="text-xs text-slate-500 leading-relaxed font-normal">
          {item.description}
        </p>
      </div>

      {/* Step Footer Indicator */}
      <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
        <span className={isReached ? 'text-[#2563EB] font-extrabold' : ''}>
          {isReached ? '✓ Step Verified' : `Step ${idx + 1} of 5`}
        </span>
        <ArrowRight className={`h-3.5 w-3.5 transition-all ${isReached ? 'text-[#2563EB] translate-x-0.5' : 'text-slate-300'}`} />
      </div>
    </motion.div>
  )
}

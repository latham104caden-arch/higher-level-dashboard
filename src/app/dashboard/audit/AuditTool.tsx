'use client'

import { useState } from 'react'
import type { AuditResult, Finding, BusinessType, DetectedElements } from '@/app/api/audit/route'

const TYPE_CONFIG: Record<BusinessType, { label: string; emoji: string; color: string; desc: string }> = {
  ecommerce: { label: 'Ecommerce', emoji: '🛒', color: '#21D19F', desc: 'Product page, ATC, checkout, deals & offers' },
  service:   { label: 'Local Service', emoji: '🔧', color: '#A0CFFF', desc: 'Lead form quality, local trust, response speed' },
  saas:      { label: 'SaaS / Software', emoji: '💻', color: '#A78BFA', desc: 'Trial CTA, pricing clarity, demo flow' },
  unknown:   { label: 'General', emoji: '🌐', color: '#A0A4B8', desc: 'General website audit' },
}

const CATEGORY_META: Record<string, { emoji: string; color: string }> = {
  speed:       { emoji: '⚡', color: '#A0CFFF' },
  seo:         { emoji: '🔍', color: '#45B69C' },
  conversion:  { emoji: '🎯', color: '#21D19F' },
  trust:       { emoji: '🛡️', color: '#F59E0B' },
  tracking:    { emoji: '📡', color: '#A78BFA' },
  adReadiness: { emoji: '🚀', color: '#F97316' },
}

// ── Layout Blueprint Components ───────────────────────────────────────────────

function BlueprintSection({
  label, icon, status, tip, children,
}: {
  label: string; icon: string; status: 'pass' | 'warn' | 'fail' | 'neutral'; tip?: string; children?: React.ReactNode
}) {
  const colors = {
    pass:    { bg: 'rgba(33,209,159,0.06)',  border: 'rgba(33,209,159,0.2)',  badge: '#21D19F',  icon: '✓' },
    warn:    { bg: 'rgba(245,158,11,0.06)',  border: 'rgba(245,158,11,0.2)',  badge: '#F59E0B',  icon: '⚠' },
    fail:    { bg: 'rgba(239,68,68,0.06)',   border: 'rgba(239,68,68,0.2)',   badge: '#EF4444',  icon: '✗' },
    neutral: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.1)', badge: '#484D6D',  icon: '·' },
  }
  const c = colors[status]
  return (
    <div className="rounded-xl p-4" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span className="text-sm">{icon}</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>{label}</span>
        </div>
        <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: `${c.badge}20`, color: c.badge }}>
          {c.icon} {status === 'pass' ? 'Found' : status === 'fail' ? 'Missing' : status === 'warn' ? 'Weak' : 'Optional'}
        </span>
      </div>
      {tip && <p className="text-xs mt-1" style={{ color: '#7B82A0' }}>{tip}</p>}
      {children}
    </div>
  )
}

function ServiceLayoutBlueprint({ d }: { d: DetectedElements }) {
  const formStatus = d.hasForm ? (d.formFieldCount <= 4 ? 'pass' : d.formFieldCount <= 7 ? 'warn' : 'fail') : 'fail'
  const formTip = d.hasForm
    ? d.formFieldCount <= 4 ? `${d.formFieldCount} fields — perfect. Keep it lean.`
    : d.formFieldCount <= 7 ? `${d.formFieldCount} fields — getting long. Cut to Name, Phone, Service.`
    : `${d.formFieldCount}+ fields — way too many. Long forms kill lead gen. 3 fields max for first touch.`
    : 'No form found. Add one above the fold — Name, Phone, Service Type is all you need.'

  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: '#484D6D' }}>
        Recommended Service Business Page Layout — Top to Bottom
      </p>

      {/* 1. Hero */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(160,207,255,0.15)', color: '#A0CFFF' }}>SECTION 1</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Hero — Above the Fold</span>
          <span className="text-xs ml-auto" style={{ color: '#484D6D' }}>Most critical section</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Clear Headline" icon="📢" status={d.hasCTA ? 'pass' : 'fail'}
            tip={d.hasCTA ? 'CTA language found — good.' : 'Your headline should state exactly what you do and who you serve. "Trusted Window Cleaning in [City]" > "Welcome to Our Site".'} />
          <BlueprintSection label="Phone (Click-to-Call)" icon="📞" status={d.hasClickToCall ? 'pass' : d.hasPhone ? 'warn' : 'fail'}
            tip={d.hasClickToCall ? 'Click-to-call link active. Mobile visitors can tap to call instantly.' : d.hasPhone ? 'Phone found but not linked. Wrap in <a href="tel:..."> for mobile.' : 'Add a phone number linked as tel: — #1 conversion action for service businesses.'} />
          <BlueprintSection label="Primary CTA Button" icon="🎯" status={d.hasCTA ? 'pass' : 'fail'}
            tip={d.hasCTA ? 'CTA found.' : '"Get a Free Quote" or "Book Now" button should be visible without scrolling.'} />
          <BlueprintSection label="Hero Image / Background" icon="🖼️" status="neutral"
            tip="Use a real photo of your team, truck, or completed work — never stock photos. Builds instant trust." />
        </div>
      </div>

      {/* 2. Trust Bar */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>SECTION 2</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Trust Bar — Instant Credibility</span>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          <BlueprintSection label="Licensed & Insured" icon="🛡️" status={d.hasLicensed ? 'pass' : 'fail'}
            tip={d.hasLicensed ? 'Credentials mentioned — keep it prominent.' : 'This is the #1 objection for service businesses. Add "Licensed & Insured" with your license number.'} />
          <BlueprintSection label="Years in Business" icon="📅" status={d.hasYearsExp ? 'pass' : 'warn'}
            tip={d.hasYearsExp ? 'Experience mentioned.' : '"15 Years in Business" or "Serving Since 2009" — anchors trust immediately.'} />
          <BlueprintSection label="Rating / Review Count" icon="⭐" status={d.hasReviews ? 'pass' : 'fail'}
            tip={d.hasReviews ? 'Review signals found.' : 'Show your Google star rating and review count right here. "4.9 ★ | 200+ Reviews"'} />
        </div>
      </div>

      {/* 3. Services */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(33,209,159,0.15)', color: '#21D19F' }}>SECTION 3</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Services — What You Offer</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Service List with Icons" icon="🔧" status="neutral"
            tip="List your core services with icons and 1-line descriptions. 3–6 services max — don't overwhelm." />
          <BlueprintSection label="Service Area / Coverage" icon="📍" status={d.hasLocalSignal ? 'pass' : 'warn'}
            tip={d.hasLocalSignal ? 'Local signals found.' : 'State your service area clearly. "Serving [City], [City], and [County]" helps local SEO and trust.'} />
        </div>
      </div>

      {/* 4. Lead Form */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA' }}>SECTION 4</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Lead Form — The Money Section</span>
        </div>
        <div className="p-4 space-y-3">
          <BlueprintSection label="Quote / Contact Form" icon="📋" status={formStatus} tip={formTip} />
          <div className="grid grid-cols-3 gap-3">
            {['Name', 'Phone Number', 'Service Needed'].map((field, i) => (
              <div key={i} className="rounded-lg px-3 py-2 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs font-bold" style={{ color: '#E8ECFF' }}>{field}</p>
                <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>Required</p>
              </div>
            ))}
          </div>
          <BlueprintSection label="Response Time Promise" icon="⏱️" status={d.hasFastResponsePromise ? 'pass' : 'warn'}
            tip={d.hasFastResponsePromise ? 'Response commitment found.' : 'Add "We respond within 1 hour" above the submit button. Dramatically increases form completions.'} />
          <BlueprintSection label="Guarantee Below Form" icon="✅" status={d.hasGuarantee ? 'pass' : 'warn'}
            tip={d.hasGuarantee ? 'Guarantee found.' : '"100% Satisfaction Guaranteed or we come back free" — put this right under the submit button.'} />
        </div>
      </div>

      {/* 5. Social Proof */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(249,115,22,0.15)', color: '#F97316' }}>SECTION 5</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Social Proof — Reviews & Work</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Customer Testimonials" icon="💬" status={d.hasReviews ? 'pass' : 'fail'}
            tip={d.hasReviews ? 'Reviews detected.' : 'Add 3–5 specific testimonials with the customer name, city, and the job they had done.'} />
          <BlueprintSection label="Before & After Photos" icon="📸" status="neutral"
            tip="Before/after photos of your work do more than any copywriting. Add a gallery of real jobs." />
          <BlueprintSection label="Video Testimonial" icon="🎥" status={d.hasVideo ? 'pass' : 'neutral'}
            tip={d.hasVideo ? 'Video content found.' : 'A 30-second customer video on mobile converts better than any written review.'} />
          <BlueprintSection label="Team / Owner Photo" icon="👤" status={d.hasTeamPhoto ? 'pass' : 'warn'}
            tip={d.hasTeamPhoto ? 'Team content found.' : 'People hire people. A photo of you or your crew with a short bio builds massive trust.'} />
        </div>
      </div>

      {/* 6. Secondary CTA */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(33,209,159,0.15)', color: '#21D19F' }}>SECTION 6</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Secondary CTA — Catch Scrollers</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Repeat CTA / Form" icon="🎯" status={d.hasCTA ? 'pass' : 'fail'}
            tip="Repeat your CTA at the bottom for anyone who scrolled past the hero. 'Ready to Get Started? Get Your Free Quote →'" />
          <BlueprintSection label="Online Booking Option" icon="📅" status={d.hasOnlineBooking ? 'pass' : 'neutral'}
            tip={d.hasOnlineBooking ? 'Online booking found.' : 'Consider adding Calendly or Jobber scheduling. Lets leads self-book outside business hours.'} />
        </div>
      </div>

      {/* 7. Footer */}
      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(160,164,184,0.15)', color: '#A0A4B8' }}>FOOTER</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Footer — Contact & Trust</span>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          <BlueprintSection label="NAP (Name, Address, Phone)" icon="📍" status={d.hasAddress && d.hasPhone ? 'pass' : 'warn'}
            tip="Google requires consistent NAP across your site and directory listings for local SEO." />
          <BlueprintSection label="Service Area Cities" icon="🗺️" status={d.hasLocalSignal ? 'pass' : 'warn'}
            tip="List every city you serve in the footer. Each mention helps local SEO." />
          <BlueprintSection label="Live Chat Widget" icon="💬" status={d.hasLiveChat ? 'pass' : 'neutral'}
            tip={d.hasLiveChat ? 'Chat widget found.' : 'Tawk.to is free and captures people who won\'t call or fill a form.'} />
        </div>
      </div>
    </div>
  )
}

function EcomLayoutBlueprint({ d }: { d: DetectedElements }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: '#484D6D' }}>
        Recommended Ecommerce Product Page Layout — Top to Bottom
      </p>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(33,209,159,0.15)', color: '#21D19F' }}>SECTION 1</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Product Hero — Above the Fold</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Product Images (3+)" icon="🖼️" status="neutral" tip="Show every angle. Lifestyle + white background. First image determines ATC rate more than anything." />
          <BlueprintSection label="Price + Deal Visible" icon="💰" status={d.hasPrice && d.hasDiscount ? 'pass' : d.hasPrice ? 'warn' : 'fail'}
            tip={d.hasPrice && d.hasDiscount ? 'Price and deal visible.' : d.hasPrice ? 'Price found but no deal. Add a crossed-out original price next to the sale price.' : 'No price visible above fold. Visitors need to see cost before they commit.'} />
          <BlueprintSection label="Add to Cart Button" icon="🛒" status={d.hasATC ? 'pass' : 'fail'}
            tip={d.hasATC ? 'ATC button found.' : 'The ATC button should be large, high-contrast, and above the fold. This is your main conversion point.'} />
          <BlueprintSection label="Urgency / Scarcity Signal" icon="⏰" status={d.hasUrgency ? 'pass' : 'warn'}
            tip={d.hasUrgency ? 'Urgency signals found.' : '"Only 8 left" or a sale countdown adds FOMO and increases ATC rate 10–25%.'} />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>SECTION 2</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Trust Signals Near ATC</span>
        </div>
        <div className="p-4 grid grid-cols-3 gap-3">
          <BlueprintSection label="Free Shipping" icon="🚚" status={d.hasFreeShipping ? 'pass' : 'warn'} tip={d.hasFreeShipping ? 'Free shipping messaging found.' : '80% of buyers expect it. If you offer it, make it the first thing they see near the ATC button.'} />
          <BlueprintSection label="Money-Back Guarantee" icon="✅" status={d.hasGuarantee ? 'pass' : 'warn'} tip={d.hasGuarantee ? 'Guarantee found.' : '"30-Day Returns" next to ATC removes the biggest barrier for cold traffic.'} />
          <BlueprintSection label="Secure Checkout Badge" icon="🔒" status={d.isHttps ? 'pass' : 'fail'} tip={d.isHttps ? 'HTTPS active.' : 'No SSL — Meta will not run ads here and buyers will not trust their card details.'} />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA' }}>SECTION 3</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Social Proof + Reviews</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Customer Reviews (30+)" icon="⭐" status={d.hasReviews ? 'pass' : 'fail'} tip={d.hasReviews ? 'Reviews found.' : 'Reviews are the single biggest driver of purchase decisions for cold traffic.'} />
          <BlueprintSection label="Bundle / Upsell Offer" icon="📦" status={d.hasBundleDeal ? 'pass' : 'warn'} tip={d.hasBundleDeal ? 'Bundle offers found.' : '"Buy 2, Save 15%" shown just below ATC increases AOV with minimal friction.'} />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(160,164,184,0.15)', color: '#A0A4B8' }}>CHECKOUT</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Checkout Flow</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Multiple Payment Options" icon="💳" status={d.hasPaymentOptions ? 'pass' : 'warn'} tip={d.hasPaymentOptions ? 'Payment options found.' : 'Add PayPal, Apple Pay, and Afterpay. Each reduces abandoned carts.'} />
          <BlueprintSection label="Return Policy Clear" icon="↩️" status={d.hasReturnPolicy ? 'pass' : 'warn'} tip={d.hasReturnPolicy ? 'Return policy visible.' : 'Repeat your return policy on the checkout page. Reduces last-second bail-outs.'} />
        </div>
      </div>
    </div>
  )
}

function SaasLayoutBlueprint({ d }: { d: DetectedElements }) {
  return (
    <div className="space-y-2">
      <p className="text-xs uppercase tracking-widest font-bold mb-4" style={{ color: '#484D6D' }}>
        Recommended SaaS Landing Page Layout — Top to Bottom
      </p>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA' }}>SECTION 1</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Hero — Value Prop + CTA</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Free Trial CTA" icon="🎯" status={d.hasFreeTrial ? 'pass' : 'fail'} tip={d.hasFreeTrial ? 'Free trial messaging found.' : '"Start free trial" is the highest-converting CTA for SaaS cold traffic.'} />
          <BlueprintSection label="No Credit Card Required" icon="💳" status={d.hasNoCC ? 'pass' : 'warn'} tip={d.hasNoCC ? '"No credit card" messaging found.' : 'This removes the #1 friction point. Adds 30–50% more trial signups.'} />
          <BlueprintSection label="Hero Demo Image/Video" icon="🎥" status={d.hasVideo ? 'pass' : 'warn'} tip={d.hasVideo ? 'Video found.' : 'A product screenshot or 60-second demo video doubles conversion rate for SaaS pages.'} />
          <BlueprintSection label="Outcome-Led Headline" icon="📢" status={d.hasCTA ? 'pass' : 'warn'} tip="Lead with the outcome, not the feature. 'Close deals faster' > 'A CRM for teams.'" />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(33,209,159,0.15)', color: '#21D19F' }}>SECTION 2</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Social Proof + Logo Wall</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Customer Logo Wall" icon="🏢" status={d.hasLogoWall ? 'pass' : 'warn'} tip={d.hasLogoWall ? 'Logo wall found.' : '"Trusted by 500+ companies" with logos is the fastest trust builder for SaaS.'} />
          <BlueprintSection label="User Count / Proof Number" icon="👥" status="neutral" tip='"Join 12,000+ teams" — quantified proof that others trust you.' />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}>SECTION 3</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Features + How It Works</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Feature / Benefit List" icon="✨" status={d.hasFeatureList ? 'pass' : 'warn'} tip={d.hasFeatureList ? 'Feature list found.' : '3-column feature grid with icons. Lead with benefits not specs.'} />
          <BlueprintSection label="Integrations Section" icon="🔗" status={d.hasIntegrations ? 'pass' : 'warn'} tip={d.hasIntegrations ? 'Integrations found.' : 'Show Slack, Zapier, HubSpot logos. Buyers want to know it fits their stack.'} />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <span className="text-xs font-black px-2 py-0.5 rounded" style={{ background: 'rgba(160,164,184,0.15)', color: '#A0A4B8' }}>BOTTOM CTA</span>
          <span className="text-sm font-black" style={{ color: '#E8ECFF' }}>Pricing + Final CTA</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          <BlueprintSection label="Pricing Section" icon="💰" status={d.hasPricing ? 'pass' : 'warn'} tip={d.hasPricing ? 'Pricing found.' : 'Transparent pricing pre-qualifies leads and builds trust.'} />
          <BlueprintSection label="Demo / Sales CTA" icon="📅" status={d.hasDemo ? 'pass' : 'warn'} tip={d.hasDemo ? 'Demo CTA found.' : '"Book a Demo" as secondary CTA catches buyers who aren\'t ready to trial.'} />
        </div>
      </div>
    </div>
  )
}

// ── Score Ring ────────────────────────────────────────────────────────────────

function ScoreRing({ score, grade, color }: { score: number; grade: string; color: string }) {
  const r = 52
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  return (
    <div className="relative flex items-center justify-center" style={{ width: 148, height: 148 }}>
      <svg width="148" height="148" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
        <circle cx="74" cy="74" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
        <circle cx="74" cy="74" r={r} fill="none" stroke={color} strokeWidth="9"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
      </svg>
      <div className="flex flex-col items-center z-10">
        <span className="text-5xl font-black leading-none" style={{ color }}>{grade}</span>
        <span className="text-xs font-bold mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{score}/100</span>
      </div>
    </div>
  )
}

// ── Finding Row ───────────────────────────────────────────────────────────────

function FindingRow({ f, color }: { f: Finding; color: string }) {
  const s = f.status === 'pass'
    ? { bg: 'rgba(33,209,159,0.1)', color: '#21D19F', icon: '✓' }
    : f.status === 'warn'
    ? { bg: 'rgba(245,158,11,0.1)', color: '#F59E0B', icon: '⚠' }
    : { bg: 'rgba(239,68,68,0.1)', color: '#EF4444', icon: '✗' }

  return (
    <div className="px-5 py-4 flex items-start gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <span className="text-xs font-black w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: s.bg, color: s.color }}>{s.icon}</span>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <p className="text-sm font-bold" style={{ color: '#E8ECFF' }}>{f.label}</p>
          <span className="text-xs font-bold ml-3 flex-shrink-0" style={{ color: f.points === f.maxPoints ? color : f.points > 0 ? '#F59E0B' : '#EF4444' }}>
            {f.points}/{f.maxPoints}
          </span>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: '#7B82A0' }}>{f.detail}</p>
        <div className="mt-1.5 flex gap-0.5">
          {Array.from({ length: Math.min(f.maxPoints, 20) }).map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full" style={{ background: i < Math.min(f.points, 20) ? color : 'rgba(255,255,255,0.08)', maxWidth: 8 }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Category Card ─────────────────────────────────────────────────────────────

function CategoryCard({ categoryKey, score, label, description, findings, expanded, onToggle }: {
  categoryKey: string; score: number; label: string; description: string
  findings: Finding[]; expanded: boolean; onToggle: () => void
}) {
  const { emoji, color } = CATEGORY_META[categoryKey] || { emoji: '📊', color: '#A0A4B8' }
  const passes = findings.filter(f => f.status === 'pass').length
  const fails = findings.filter(f => f.status === 'fail').length
  const warns = findings.filter(f => f.status === 'warn').length

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={onToggle}>
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>{emoji}</div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm mb-0.5" style={{ color: '#E8ECFF' }}>{label}</p>
          <p className="text-xs mb-2" style={{ color: '#484D6D' }}>{description}</p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}80, ${color})` }} />
            </div>
            <span className="text-sm font-black flex-shrink-0" style={{ color }}>{score}</span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            {passes > 0 && <span className="text-xs" style={{ color: '#21D19F' }}>✓ {passes} pass</span>}
            {warns > 0 && <span className="text-xs" style={{ color: '#F59E0B' }}>⚠ {warns} warn</span>}
            {fails > 0 && <span className="text-xs" style={{ color: '#EF4444' }}>✗ {fails} fail</span>}
          </div>
        </div>
        <span style={{ color: '#2A2F4A', fontSize: 11 }}>{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {findings.map((f, i) => <FindingRow key={i} f={f} color={color} />)}
        </div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

type ActiveTab = 'scores' | 'layout' | 'screenshot'

export default function AuditTool() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>('conversion')
  const [activeTab, setActiveTab] = useState<ActiveTab>('scores')

  async function runAudit() {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
      setExpanded('conversion')
      setActiveTab('scores')
    } catch (e: any) {
      setError(e.message || 'Audit failed. Check the URL and try again.')
    } finally {
      setLoading(false)
    }
  }

  const categoryOrder = ['conversion', 'trust', 'speed', 'seo', 'tracking', 'adReadiness'] as const
  const typeConf = result ? TYPE_CONFIG[result.businessType] : null
  const hasScreenshot = result?.screenshotBase64

  return (
    <div className="space-y-8">
      {/* URL Input */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-sm font-bold mb-3" style={{ color: '#E8ECFF' }}>Enter a website or landing page URL</p>
        <div className="flex gap-3">
          <input
            type="text" value={url} onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && runAudit()}
            placeholder="https://thehydrashop.com"
            className="flex-1 px-4 py-3 rounded-xl text-sm font-bold outline-none"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#E8ECFF' }}
          />
          <button onClick={runAudit} disabled={loading || !url.trim()}
            className="px-6 py-3 rounded-xl text-sm font-black transition-all"
            style={{ background: 'rgba(33,209,159,0.12)', border: '1px solid rgba(33,209,159,0.3)', color: '#21D19F', opacity: !url.trim() ? 0.4 : 1, cursor: loading || !url.trim() ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Auditing…' : 'Audit Site →'}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: '#484D6D' }}>
          Auto-detects Ecommerce / Service / SaaS and runs a tailored audit. Takes 10–20 seconds.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl p-10 flex flex-col items-center gap-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {['Fetching page', 'Detecting business type', 'Analyzing HTML', 'Running PageSpeed + screenshot', 'Scoring'].map((step, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i > 0 && <span style={{ color: '#2A2F4A' }}>→</span>}
                <span className="text-xs" style={{ color: '#484D6D' }}>{step}</span>
              </div>
            ))}
          </div>
          <div className="w-64 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div className="h-1 rounded-full w-3/5" style={{ background: 'linear-gradient(90deg, #21D19F, #45B69C)', animation: 'pulse 1.5s ease-in-out infinite' }} />
          </div>
          <p className="text-xs" style={{ color: '#484D6D' }}>Fetching PageSpeed score + mobile screenshot — takes 15–20 seconds</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <p className="font-bold text-sm" style={{ color: '#EF4444' }}>⚠ Audit failed</p>
          <p className="text-xs mt-1" style={{ color: '#7B82A0' }}>{error}</p>
        </div>
      )}

      {/* Results */}
      {result && typeConf && (
        <div className="space-y-6">

          {/* Overall Score Header */}
          <div className="rounded-2xl p-7 relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full blur-3xl opacity-8" style={{ background: result.gradeColor }} />

            {/* Type badge */}
            <div className="flex items-center gap-2 mb-6 relative">
              <span className="text-xs font-black px-3 py-1.5 rounded-full flex items-center gap-2"
                style={{ background: `${typeConf.color}15`, color: typeConf.color, border: `1px solid ${typeConf.color}30` }}>
                {typeConf.emoji} {typeConf.label} Detected
              </span>
              <span className="text-xs" style={{ color: '#484D6D' }}>{result.businessTypeConfidence} · {typeConf.desc}</span>
            </div>

            <div className="flex items-center gap-8 relative">
              <ScoreRing score={result.scores.overall} grade={result.grade} color={result.gradeColor} />
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#484D6D' }}>Overall Score</p>
                <h2 className="text-xl font-black mb-0.5 truncate" style={{ color: '#E8ECFF' }}>{result.pageTitle}</h2>
                <p className="text-xs mb-4 truncate" style={{ color: '#484D6D' }}>{result.url}</p>
                <div className="grid grid-cols-3 gap-3">
                  {categoryOrder.map(key => {
                    const cat = result.categories[key]
                    const meta = CATEGORY_META[key]
                    return (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-sm flex-shrink-0">{meta.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-xs truncate" style={{ color: '#7B82A0' }}>{cat.label}</span>
                            <span className="text-xs font-black ml-1 flex-shrink-0" style={{ color: meta.color }}>{cat.score}</span>
                          </div>
                          <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-1 rounded-full" style={{ width: `${cat.score}%`, background: meta.color }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Nav */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', width: 'fit-content' }}>
            {[
              { id: 'scores' as ActiveTab, label: '📊 Scores' },
              { id: 'layout' as ActiveTab, label: `🏗️ Page Layout` },
              ...(hasScreenshot ? [{ id: 'screenshot' as ActiveTab, label: '📸 Screenshot' }] : []),
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={activeTab === tab.id
                  ? { background: 'rgba(33,209,159,0.12)', color: '#21D19F', border: '1px solid rgba(33,209,159,0.2)' }
                  : { color: '#7B82A0', border: '1px solid transparent' }}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Scores Tab */}
          {activeTab === 'scores' && (
            <div className="space-y-5">
              {/* Priority Fixes */}
              {result.topFixes.length > 0 && (
                <div className="rounded-2xl p-7" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  <p className="font-black text-sm mb-4" style={{ color: '#EF4444' }}>🔥 Priority Fixes — Ranked by Impact</p>
                  <div className="space-y-4">
                    {result.topFixes.map((fix, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="text-xs font-black w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ background: fix.priority === 1 ? 'rgba(239,68,68,0.2)' : fix.priority === 2 ? 'rgba(245,158,11,0.15)' : 'rgba(160,164,184,0.1)', color: fix.priority === 1 ? '#EF4444' : fix.priority === 2 ? '#F59E0B' : '#A0A4B8' }}>
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-black" style={{ color: '#E8ECFF' }}>{fix.fix}</p>
                          <p className="text-xs leading-relaxed mt-0.5" style={{ color: '#7B82A0' }}>{fix.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Breakdown */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#484D6D' }}>{typeConf.label} Audit — Category Breakdown</p>
                <div className="space-y-3">
                  {categoryOrder.map(key => (
                    <CategoryCard key={key} categoryKey={key}
                      score={result.categories[key].score} label={result.categories[key].label}
                      description={result.categories[key].description} findings={result.categories[key].findings}
                      expanded={expanded === key} onToggle={() => setExpanded(expanded === key ? null : key)} />
                  ))}
                </div>
              </div>

              {/* Ad Impact */}
              <div className="rounded-2xl p-7" style={{ background: 'rgba(33,209,159,0.04)', border: '1px solid rgba(33,209,159,0.12)' }}>
                <p className="font-black text-sm mb-3" style={{ color: '#21D19F' }}>🚀 Should You Run Ads to This {typeConf.label} Site?</p>
                {result.scores.adReadiness >= 80 ? (
                  <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                    <span style={{ color: '#21D19F', fontWeight: 700 }}>Yes — this site is ad-ready. </span>
                    {result.businessType === 'ecommerce' && 'Pixel installed, deals and trust signals in place, checkout is configured. Scale spend confidently.'}
                    {result.businessType === 'service' && 'Pixel installed, form is simple, trust signals are strong. Cold ad traffic should convert well here.'}
                    {result.businessType === 'saas' && 'Pixel installed, trial offer present, credibility established. Ready for paid traffic.'}
                    {result.businessType === 'unknown' && 'Core requirements are in place. Run traffic and watch the data.'}
                  </p>
                ) : result.scores.adReadiness >= 55 ? (
                  <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                    <span style={{ color: '#F59E0B', fontWeight: 700 }}>Run carefully — fix priority issues first. </span>
                    Check the Page Layout tab to see exactly what sections need to be added or improved before scaling spend.
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed" style={{ color: '#7B82A0' }}>
                    <span style={{ color: '#EF4444', fontWeight: 700 }}>Don&apos;t run ads to this page yet. </span>
                    Critical gaps will cause near-zero conversion. Fix the Priority Fixes and build out the Page Layout blueprint first.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Layout Tab */}
          {activeTab === 'layout' && (
            <div>
              {result.businessType === 'service' && <ServiceLayoutBlueprint d={result.detectedElements} />}
              {result.businessType === 'ecommerce' && <EcomLayoutBlueprint d={result.detectedElements} />}
              {result.businessType === 'saas' && <SaasLayoutBlueprint d={result.detectedElements} />}
              {result.businessType === 'unknown' && (
                <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="font-black text-sm mb-2" style={{ color: '#E8ECFF' }}>Business type unclear</p>
                  <p className="text-xs" style={{ color: '#7B82A0' }}>The audit couldn't determine if this is a service, ecommerce, or SaaS site. The layout blueprint will appear once a type is detected.</p>
                </div>
              )}
            </div>
          )}

          {/* Screenshot Tab */}
          {activeTab === 'screenshot' && hasScreenshot && (
            <div className="space-y-4">
              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="font-black text-sm" style={{ color: '#E8ECFF' }}>Mobile Screenshot</p>
                    <p className="text-xs mt-0.5" style={{ color: '#484D6D' }}>Captured by Google PageSpeed — what a mobile visitor sees</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(160,207,255,0.1)', color: '#A0CFFF', border: '1px solid rgba(160,207,255,0.2)' }}>
                    📱 Mobile View
                  </span>
                </div>
                <div className="p-6 flex justify-center">
                  <div className="relative" style={{ maxWidth: 380 }}>
                    {/* Phone frame */}
                    <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: '2px solid rgba(255,255,255,0.12)', background: '#000' }}>
                      {/* Notch */}
                      <div className="flex justify-center pt-2 pb-1" style={{ background: '#111' }}>
                        <div className="w-20 h-5 rounded-full" style={{ background: '#1a1a1a' }} />
                      </div>
                      <img
                        src={result.screenshotBase64!}
                        alt="Mobile screenshot"
                        style={{ width: '100%', display: 'block' }}
                      />
                    </div>
                    {/* Annotation overlays based on score */}
                    {result.scores.conversion < 60 && (
                      <div className="absolute top-16 right-0 translate-x-full ml-3 w-40 pl-3">
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                          <p className="text-xs font-black" style={{ color: '#EF4444' }}>⚠ Weak CTA area</p>
                          <p className="text-xs mt-0.5" style={{ color: '#7B82A0' }}>Conversion needs work</p>
                        </div>
                      </div>
                    )}
                    {result.scores.trust < 60 && (
                      <div className="absolute bottom-24 right-0 translate-x-full ml-3 w-40 pl-3">
                        <div className="rounded-lg p-2.5" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
                          <p className="text-xs font-black" style={{ color: '#F59E0B' }}>⚠ Missing trust signals</p>
                          <p className="text-xs mt-0.5" style={{ color: '#7B82A0' }}>See Page Layout tab</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Visual notes */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="font-black text-sm mb-3" style={{ color: '#E8ECFF' }}>First Impression Checklist</p>
                  {[
                    { label: 'CTA visible without scrolling', status: result.detectedElements.hasCTA },
                    { label: 'Phone number easy to find', status: result.detectedElements.hasPhone },
                    { label: result.businessType === 'service' ? 'Trust credentials shown' : result.businessType === 'ecommerce' ? 'Product & price visible' : 'Free trial prominent', status: result.businessType === 'service' ? result.detectedElements.hasLicensed : result.businessType === 'ecommerce' ? result.detectedElements.hasPrice : result.detectedElements.hasFreeTrial },
                    { label: 'Reviews / social proof', status: result.detectedElements.hasReviews },
                    { label: 'Tracking pixel installed', status: result.detectedElements.hasMetaPixel },
                    { label: 'Secure (HTTPS)', status: result.detectedElements.isHttps },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 mb-2">
                      <span className="text-xs w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: item.status ? 'rgba(33,209,159,0.15)' : 'rgba(239,68,68,0.15)', color: item.status ? '#21D19F' : '#EF4444' }}>
                        {item.status ? '✓' : '✗'}
                      </span>
                      <span className="text-xs" style={{ color: item.status ? '#E8ECFF' : '#7B82A0' }}>{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="font-black text-sm mb-3" style={{ color: '#E8ECFF' }}>Performance at a Glance</p>
                  {[
                    { label: 'Speed Score', value: `${result.scores.speed}/100`, color: result.scores.speed >= 80 ? '#21D19F' : result.scores.speed >= 60 ? '#F59E0B' : '#EF4444' },
                    { label: 'SEO Score', value: `${result.scores.seo}/100`, color: result.scores.seo >= 80 ? '#21D19F' : result.scores.seo >= 60 ? '#F59E0B' : '#EF4444' },
                    { label: 'Conversion Score', value: `${result.scores.conversion}/100`, color: result.scores.conversion >= 80 ? '#21D19F' : result.scores.conversion >= 60 ? '#F59E0B' : '#EF4444' },
                    { label: 'Trust Score', value: `${result.scores.trust}/100`, color: result.scores.trust >= 80 ? '#21D19F' : result.scores.trust >= 60 ? '#F59E0B' : '#EF4444' },
                    { label: 'Tracking Score', value: `${result.scores.tracking}/100`, color: result.scores.tracking >= 80 ? '#21D19F' : result.scores.tracking >= 60 ? '#F59E0B' : '#EF4444' },
                    { label: 'Ad Readiness', value: `${result.scores.adReadiness}/100`, color: result.scores.adReadiness >= 80 ? '#21D19F' : result.scores.adReadiness >= 60 ? '#F59E0B' : '#EF4444' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between mb-2">
                      <span className="text-xs" style={{ color: '#7B82A0' }}>{item.label}</span>
                      <span className="text-xs font-black" style={{ color: item.color }}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

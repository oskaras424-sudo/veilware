'use client'

import { useEffect, useRef, useState } from 'react'
import { MagneticPanel, useMagneticPanel } from './magnetic-panel'
import { ArrowDown, ArrowRight, Bell, Box, ChevronDown, Code2, Cpu, EyeOff, Headphones, LockKeyhole, Menu, RefreshCw, ShieldCheck, Sparkles, Zap } from 'lucide-react'

const crimson = '#ff334a'
const DISCORD_INVITE = 'https://discord.com/invite/P9Rkd2KMPD'
const DISCORD_LOGO = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4LolVsSvYyHrC4rH84SEg61GsA01Dh.png'
const VEILWARE_LOGO = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9242e430-1360-46fa-9351-1fa170562f7e-RUNH1ejiJItyIHQwpvAUWXyHg9LXtJ.png'

const features = [
  { icon: ShieldCheck, title: 'Undetected by Design', copy: 'The software starts with a stealth-first approach rather than adding it later.' },
  { icon: Cpu, title: 'Optimized Performance', copy: 'The code is kept lean so it does not get in the way of the rest of your system.' },
  { icon: EyeOff, title: 'Privacy First', copy: 'We do not use telemetry, and we do not trade away your privacy for convenience.' },
  { icon: Zap, title: 'Fast Updates', copy: 'When something changes, we work on a response so you are not left waiting.' },
  { icon: RefreshCw, title: 'Always Maintained', copy: 'The team keeps working on the tools instead of leaving old builds behind.' },
  { icon: Headphones, title: 'Community Support', copy: 'The Discord community is the place to get help from the team and other users.' },
  { icon: LockKeyhole, title: 'Secure Builds', copy: 'Each release is signed and verified so you can check what you are running.' },
  { icon: Code2, title: 'Modern Stack', copy: 'We use supported technologies and keep the stack practical to maintain.' },
]

const products = [
  { icon: Box, title: 'Roblox Executor', copy: 'A high-quality Roblox executor currently in development.' },
  { icon: Sparkles, title: 'Fortnite External', copy: 'A premium, undetected external currently in development.' },
  { icon: Bell, title: 'Temp Spoofer', copy: 'A temporary spoofer currently in development.' },
]

const faqs = [
  ['Is Veilware safe to use?', 'Every release is signed, verified, and tested before publication. We prioritize privacy and never collect personal data. Still, any third-party software carries some risk, so read the guidance in the Discord community before using it.'],
  ['How do I get access to Veilware products?', 'Start with the Discord invite on this page. The team will walk you through the onboarding steps and let you know which products are available to members.'],
  ['How often are updates released?', 'Updates go out when they are needed, whether that means a fix, a compatibility patch, or a new feature. The latest changes will be listed in the Updates section.'],
  ['What if I run into a problem?', 'Open a ticket in the Discord support channel. Someone from the team will help you work through the problem step by step.'],
  ['Does Veilware store any of my data?', 'No. We do not track usage, collect telemetry, or store personal information. More detail is available in the community resources.'],
  ['Which platforms are supported?', 'Most tools target Windows first because that is where most of the community plays. Some products may also work on Mac or Linux. Check the product channel for current support details and known issues, or ask the team if you are unsure.'],
]

function Logo() {
  return <a href="#home" className="brand" aria-label="Veilware home"><img src={VEILWARE_LOGO} alt="Veilware logo" /><span>VEIL<span>WARE</span></span></a>
}

 function ScrollReveal({ children, className = '', magnetic = false, maxMovement = 8 }: { children: React.ReactNode; className?: string; magnetic?: boolean; maxMovement?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const magneticRef = useMagneticPanel<HTMLDivElement>(magnetic, maxMovement)
  useEffect(() => {
   const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.disconnect() } }, { threshold: 0.12 })
   if (ref.current) observer.observe(ref.current)
   return () => observer.disconnect()
  }, [])
  const setRefs = (element: HTMLDivElement | null) => {
   ref.current = element
   if (magnetic) magneticRef.current = element
  }
  return <div ref={setRefs} className={`reveal ${magnetic ? 'magnetic-panel' : ''} ${className}`}>{children}</div>
 }

export default function VeilwareSite() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
 useEffect(() => {
  const cursorElement = document.createElement('div')
  cursorElement.className = 'cursor'
  cursorElement.setAttribute('aria-hidden', 'true')
  cursorElement.appendChild(document.createElement('i'))
  document.body.appendChild(cursorElement)

  let frame = 0
  let pointerX = -100
  let pointerY = -100
  let pending = false
  const render = () => {
   pending = false
   cursorElement.style.transform = `translate(${pointerX}px, ${pointerY}px)`
  }
  const move = (event: MouseEvent) => {
   pointerX = event.clientX
   pointerY = event.clientY
   cursorElement.classList.add('ready')
   if (!pending) {
    pending = true
    frame = requestAnimationFrame(render)
   }
  }
  window.addEventListener('mousemove', move, { passive: true })
  return () => {
   window.removeEventListener('mousemove', move)
   cancelAnimationFrame(frame)
   cursorElement.remove()
  }
 }, [])

  const go = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  return <main className="veilware-site">
    <header className="site-header"><div className="nav-wrap"><Logo /><nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">{[['home','Home'],['features','Features'],['products','Products'],['updates','Updates'],['faq','FAQ'],['support','Support']].map(([id, label]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</nav><a className="discord small" href={DISCORD_INVITE} target="_blank" rel="noreferrer"> <img src={DISCORD_LOGO} alt="" /> <span>Join Discord</span></a><button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"><Menu size={21} /></button></div></header>

    <section id="home" className="hero"><div className="hero-effects" aria-hidden="true"><div className="orb orb-a" /><div className="orb orb-b" /></div><div className="grid-lines" aria-hidden="true" /><div className="hero-content"><img className="hero-logo" src={VEILWARE_LOGO} alt="Veilware logo" /><h1><span>VEIL</span><b>WARE</b></h1><p className="hero-tagline">Undetected tools, built for play.</p><p className="hero-copy">Veilware is a community for people who want capable tools without the noise. We care about privacy, steady updates, and software that does its job.</p><div className="hero-actions"><a className="discord" href={DISCORD_INVITE} target="_blank" rel="noreferrer"><img src={DISCORD_LOGO} alt="" /> Join Our Discord</a><button className="outline-button" onClick={() => go('features')}>Explore <ArrowDown size={16} /></button></div><div className="trust"><ShieldCheck size={14} /> PRIVACY-FIRST <span>•</span> BUILT WITH THE COMMUNITY</div></div><button className="scroll-cue" onClick={() => go('features')} aria-label="Scroll to features"><span /></button></section>

    <section id="features" className="section feature-section"><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; FEATURES</div><h2>Made to keep a low <em>profile</em></h2><p>Each tool follows the same approach: keep it private, keep it reliable,<br className="desktop" /> and keep improving it when the platform changes.</p></ScrollReveal><div className="feature-grid">{features.map(({ icon: Icon, title, copy }, i) => <ScrollReveal magnetic maxMovement={8} className="feature-card" key={title}><div className="icon-box"><Icon size={21} /></div><h3>{title}</h3><p>{copy}</p></ScrollReveal>)}</div></section>

    <section id="products" className="section products-section"><div className="product-bg" aria-hidden="true" /><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; THE VEILWARE COLLECTION</div><h2><span>OUR</span> <em>PRODUCTS</em></h2><p>These are the tools we are working on now. Each one is being built with the same care<br className="desktop" /> for privacy, reliability, and day-to-day performance.</p><div className="coming">● &nbsp; IN DEVELOPMENT</div></ScrollReveal><div className="product-grid">{products.map(({ icon: Icon, title, copy }) => <ScrollReveal magnetic maxMovement={7} className="product-card" key={title}><div className="card-top"><div className="icon-box"><Icon size={20} /></div><span>SOON</span></div><h3>{title}</h3><p>{copy}</p></ScrollReveal>)}</div></section>

    <section id="updates" className="section updates-section"><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; UPDATES</div><h2>Nothing new <em>yet</em></h2><p>There is no announcement to share right now. When there is, you will find it here<br className="desktop" /> and in the Discord community.</p></ScrollReveal><ScrollReveal magnetic maxMovement={6} className="empty-card"><div className="icon-box"><Bell size={22} /></div><p>For the first product and community announcements, check the Veilware Discord.</p></ScrollReveal></section>

    <section id="faq" className="section faq-section"><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; FAQ</div><h2>A few common <em>questions</em></h2><p>Here are the basics to know before you join the Veilware community.</p></ScrollReveal><div className="faq-list">{faqs.map(([question, answer], i) => <MagneticPanel maxMovement={5} className={`faq-item ${activeFaq === i ? 'active' : ''}`} key={question}><button type="button" onClick={() => setActiveFaq(current => current === i ? null : i)} aria-expanded={activeFaq === i} aria-controls={`faq-answer-${i}`}><span>{question}</span><span className="plus" aria-hidden="true">+</span></button><div id={`faq-answer-${i}`} className="faq-answer"><p>{answer}</p></div></MagneticPanel>)}</div></section>

    <section id="support" className="support-section"><ScrollReveal magnetic maxMovement={6} className="support-card"><div className="support-icon">◉</div><div className="eyebrow">● &nbsp; COMMUNITY</div><h2>Find us on <em>Discord</em></h2><p>Ask questions, get help from the team, and hear about releases as they happen.<br className="desktop" /> The community is the best place to keep up with Veilware.</p><a className="discord" href={DISCORD_INVITE} target="_blank" rel="noreferrer"><img src={DISCORD_LOGO} alt="" /> Join Our Discord <ArrowRight size={16} /></a></ScrollReveal></section>

    <footer><div className="footer-wrap"><div><Logo /><p>VEILWARE builds private gaming tools and keeps the community close to the work.</p><a className="social" aria-label="Discord" href={DISCORD_INVITE} target="_blank" rel="noreferrer"><img src={DISCORD_LOGO} alt="" /></a></div><div className="footer-links"><div><small>NAVIGATION</small>{['home','features','products','updates','faq','support'].map(id => <button key={id} onClick={() => go(id)}>{id[0].toUpperCase() + id.slice(1)}</button>)}</div><div><small>RESOURCES</small><a href={DISCORD_INVITE} target="_blank" rel="noreferrer">Discord Community</a><a href={DISCORD_INVITE} target="_blank" rel="noreferrer">Support Channel</a><button onClick={() => go('updates')}>Updates</button><button onClick={() => go('faq')}>FAQ</button></div></div></div><div className="copyright">© 2026 VEILWARE. Made with care.</div></footer>
  </main>
}

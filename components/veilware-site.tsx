'use client'

import { useEffect, useState } from 'react'
import { ArrowDown, ArrowRight, Bell, Box, ChevronDown, Code2, Cpu, EyeOff, Headphones, LockKeyhole, Menu, RefreshCw, ShieldCheck, Sparkles, Zap } from 'lucide-react'

const crimson = '#ff334a'
const DISCORD_INVITE = 'https://discord.com/invite/P9Rkd2KMPD'
const DISCORD_LOGO = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-4LolVsSvYyHrC4rH84SEg61GsA01Dh.png'
const VEILWARE_LOGO = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9242e430-1360-46fa-9351-1fa170562f7e-RUNH1ejiJItyIHQwpvAUWXyHg9LXtJ.png'

const features = [
  { icon: ShieldCheck, title: 'Undetected by Design', copy: 'Built with stealth-first architecture to stay ahead of detection systems.' },
  { icon: Cpu, title: 'Optimized Performance', copy: 'Lightweight code that runs smooth without dragging down your system.' },
  { icon: EyeOff, title: 'Privacy First', copy: 'Your data stays yours. No telemetry, no compromises.' },
  { icon: Zap, title: 'Fast Updates', copy: 'Rapid response to changes so you stay up and running without downtime.' },
  { icon: RefreshCw, title: 'Always Maintained', copy: 'Continuous improvements and active development from a dedicated team.' },
  { icon: Headphones, title: 'Community Support', copy: 'Real help from real people in our active Discord community, 24/7.' },
  { icon: LockKeyhole, title: 'Secure Builds', copy: 'Signed and verified releases so you always know what you are running.' },
  { icon: Code2, title: 'Modern Stack', copy: 'Crafted with current, well-supported technologies for long-term reliability.' },
]

const products = [
  { icon: Box, title: 'Roblox Executor', copy: 'High quality roblox executor' },
  { icon: Sparkles, title: 'Fortnite External', copy: 'Our premium undetected external' },
  { icon: Bell, title: 'Temp Spoofer', copy: 'Best temp spoofer on the market' },
]

const faqs = [
  ['Is Veilware safe to use?', 'Every release is signed, verified, and tested before publication. We prioritize privacy and never collect personal data. That said, using any third-party software carries some risk, and we encourage you to review our guidance in the Discord community before use.'],
  ['How do I get access to Veilware products?', 'Join our Discord community using the invitation link on this page. From there you can follow the onboarding steps, meet the team, and get access to the products available to members.'],
  ['How often are updates released?', 'We ship updates as soon as they are needed — whether that is a fix, a compatibility patch, or a new feature. You can always find the latest changes in the Updates section on this page.'],
  ['What if I run into a problem?', 'Our support team and community are active in Discord. Open a ticket in the support channel and a team member will help you troubleshoot step by step.'],
  ['Does Veilware store any of my data?', 'No. Veilware is built privacy-first. We do not track usage, collect telemetry, or store personal information. You can review our approach in the community resources.'],
  ['Which platforms are supported?', 'Most of our tools are built for Windows first, since that is where the majority of our community plays. That said, some products may also work on Mac or Linux, so it is always worth checking the channel for whichever product you are interested in. We list supported platforms and any known quirks there, and the team is happy to confirm if you are unsure.'],
]

function Logo() {
  return <a href="#home" className="brand" aria-label="Veilware home"><img src={VEILWARE_LOGO} alt="Veilware logo" /><span>VEIL<span>WARE</span></span></a>
}

function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>
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

  const move = (event: MouseEvent) => {
   cursorElement.classList.add('ready')
   cursorElement.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`
  }
  window.addEventListener('mousemove', move)
  return () => {
   window.removeEventListener('mousemove', move)
   cursorElement.remove()
  }
 }, [])

  const go = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  return <main className="veilware-site">
       <header className="site-header"><div className="nav-wrap"><Logo /><nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">{[['home','Home'],['features','Features'],['products','Products'],['updates','Updates'],['faq','FAQ'],['support','Support']].map(([id, label]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</nav><a className="discord small" href={DISCORD_INVITE} target="_blank" rel="noreferrer"> <img src={DISCORD_LOGO} alt="" /> <span>Join Discord</span></a><button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"><Menu size={21} /></button></div></header>

    <section id="home" className="hero"><div className="hero-effects" aria-hidden="true"><div className="orb orb-a" /><div className="orb orb-b" /></div><div className="grid-lines" aria-hidden="true" /><div className="hero-content"><img className="hero-logo" src={VEILWARE_LOGO} alt="Veilware logo" /><h1><span>VEIL</span><b>WARE</b></h1><p className="hero-tagline">Best <em>undetected</em> softwares.</p><p className="hero-copy">Welcome to the Veilware community. We build premium,<br className="desktop" /> undetected software with a relentless focus on quality, privacy, and performance.</p><div className="hero-actions"><a className="discord" href={DISCORD_INVITE} target="_blank" rel="noreferrer"><img src={DISCORD_LOGO} alt="" /> Join Our Discord</a><button className="outline-button" onClick={() => go('features')}>Explore <ArrowDown size={16} /></button></div><div className="trust"><ShieldCheck size={14} /> PRIVACY-FIRST <span>•</span> COMMUNITY-DRIVEN</div></div><button className="scroll-cue" onClick={() => go('features')} aria-label="Scroll to features"><span /></button></section>

    <section id="features" className="section feature-section"><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; FEATURES</div><h2>Engineered to stay <em>invisible</em></h2><p>Every Veilware product is built around the same promise — reliable,<br className="desktop" /> undetected, and crafted with care.</p></ScrollReveal><div className="feature-grid">{features.map(({ icon: Icon, title, copy }, i) => <ScrollReveal className="feature-card" key={title}><div className="icon-box"><Icon size={21} /></div><h3>{title}</h3><p>{copy}</p></ScrollReveal>)}</div></section>

    <section id="products" className="section products-section"><div className="product-bg" aria-hidden="true" /><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; THE VEILWARE COLLECTION</div><h2><span>OUR</span> <em>PRODUCTS</em></h2><p>A focused collection of tools designed with the same attention to privacy,<br className="desktop" /> precision, and performance that defines Veilware.</p><div className="coming">● &nbsp; COMING SOON</div></ScrollReveal><div className="product-grid">{products.map(({ icon: Icon, title, copy }) => <ScrollReveal className="product-card" key={title}><div className="card-top"><div className="icon-box"><Icon size={20} /></div><span>SOON</span></div><h3>{title}</h3><p>{copy}</p></ScrollReveal>)}</div></section>

    <section id="updates" className="section updates-section"><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; UPDATES</div><h2>No <em>updates</em> yet</h2><p>There is nothing new to share right now. Announcements will appear here<br className="desktop" /> when they are ready.</p></ScrollReveal><ScrollReveal className="empty-card"><div className="icon-box"><Bell size={22} /></div><p>Keep an eye on the Veilware Discord for the first product and community announcements.</p></ScrollReveal></section>

    <section id="faq" className="section faq-section"><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; FAQ</div><h2>Questions, <em>answered</em></h2><p>Everything you need to know before joining the Veilware community.</p></ScrollReveal><div className="faq-list">{faqs.map(([question, answer], i) => <div className={`faq-item ${activeFaq === i ? 'active' : ''}`} key={question}><button type="button" onClick={() => setActiveFaq(current => current === i ? null : i)} aria-expanded={activeFaq === i} aria-controls={`faq-answer-${i}`}><span>{question}</span><span className="plus" aria-hidden="true">+</span></button><div id={`faq-answer-${i}`} className="faq-answer"><p>{answer}</p></div></div>)}</div></section>

    <section id="support" className="support-section"><ScrollReveal className="support-card"><div className="support-icon">◉</div><div className="eyebrow">● &nbsp; COMMUNITY</div><h2>Join <em>the</em> Veilware Discord</h2><p>Talk directly with the team, get fast support, and be the first to hear<br className="desktop" /> about new releases. Our community is where everything happens.</p><a className="discord" href={DISCORD_INVITE} target="_blank" rel="noreferrer"><img src={DISCORD_LOGO} alt="" /> Join Our Discord <ArrowRight size={16} /></a></ScrollReveal></section>

    <footer><div className="footer-wrap"><div><Logo /><p>VEILWARE builds premium, undetected software with a focus on privacy, performance, and a community that has your back.</p><a className="social" aria-label="Discord" href={DISCORD_INVITE} target="_blank" rel="noreferrer"><img src={DISCORD_LOGO} alt="" /></a></div><div className="footer-links"><div><small>NAVIGATION</small>{['home','features','products','updates','faq','support'].map(id => <button key={id} onClick={() => go(id)}>{id[0].toUpperCase() + id.slice(1)}</button>)}</div><div><small>RESOURCES</small><a href={DISCORD_INVITE} target="_blank" rel="noreferrer">Discord Community</a><a href={DISCORD_INVITE} target="_blank" rel="noreferrer">Support Channel</a><button onClick={() => go('updates')}>Changelog</button><button onClick={() => go('faq')}>FAQ</button></div></div></div><div className="copyright">© 2026 VEILWARE. Built with intent.</div></footer>
  </main>
}

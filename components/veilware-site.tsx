'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowRight, Bell, Box, ChevronDown, Code2, Cpu, EyeOff, Headphones, LockKeyhole, Menu, RefreshCw, ShieldCheck, Sparkles, Zap } from 'lucide-react'

const crimson = '#ff334a'

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
  ['Is Veilware safe to use?', 'Veilware is built with privacy, security, and responsible release practices at its core.'],
  ['How do I get access to Veilware products?', 'Join the Discord community to get release announcements and access information.'],
  ['How often are updates released?', 'Updates are shared when they are ready and tested by the team.'],
  ['What if I run into a problem?', 'Our support community is available in Discord to help you troubleshoot.'],
  ['Does Veilware store any of my data?', 'We believe your data stays yours. We do not build around telemetry or unnecessary tracking.'],
  ['Which platforms are supported?', 'Platform support varies by release and is always listed with the relevant announcement.'],
]

function Logo() {
  return <a href="#home" className="brand" aria-label="Veilware home"><span className="brand-mark">⌄</span><span>VEIL<span>WARE</span></span></a>
}

function ScrollReveal({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`reveal ${className}`}>{children}</div>
}

export default function VeilwareSite() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cursor, setCursor] = useState({ x: -100, y: -100 })
  const squares = useMemo(() => Array.from({ length: 44 }, (_, i) => ({
    left: `${(i * 47 + 9) % 101}%`, top: `${(i * 71 + 3) % 98}%`, size: 7 + ((i * 13) % 18), delay: `${-(i * 0.73)}s`, duration: `${15 + (i % 11) * 2.2}s`, drift: `${(i % 2 ? 1 : -1) * (8 + i % 18)}px`, rotate: `${(i % 2 ? 1 : -1) * (20 + i * 7)}deg`, opacity: 0.16 + (i % 4) * 0.06,
  })), [])

  useEffect(() => {
    const move = (event: MouseEvent) => setCursor({ x: event.clientX, y: event.clientY })
    window.addEventListener('mousemove', move)
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-visible')), { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element))
    return () => { window.removeEventListener('mousemove', move); observer.disconnect() }
  }, [])

  const go = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }

  return <main className="veilware-site">
    <div className="cursor" style={{ transform: `translate(${cursor.x}px, ${cursor.y}px)` }} aria-hidden="true"><i /></div>
    <header className="site-header"><div className="nav-wrap"><Logo /><nav className={menuOpen ? 'open' : ''} aria-label="Main navigation">{[['home','Home'],['features','Features'],['products','Products'],['updates','Updates'],['faq','FAQ'],['support','Support']].map(([id, label]) => <button key={id} onClick={() => go(id)}>{label}</button>)}</nav><button className="discord small" onClick={() => go('support')}>◉ <span>Join Discord</span></button><button className="menu-button" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu"><Menu size={21} /></button></div></header>

    <section id="home" className="hero"><div className="hero-effects" aria-hidden="true"><div className="orb orb-a" /><div className="orb orb-b" />{squares.map((square, i) => <span key={i} className="floating-square" style={{ left: square.left, top: square.top, width: square.size, height: square.size, animationDelay: square.delay, animationDuration: square.duration, ['--drift' as string]: square.drift, ['--rotate' as string]: square.rotate, opacity: square.opacity }} />)}</div><div className="grid-lines" aria-hidden="true" /><div className="hero-content"><div className="hero-emblem">⌄</div><h1><span>VEIL</span><b>WARE</b></h1><p className="hero-tagline">Best <em>undetected</em> softwares.</p><p className="hero-copy">Welcome to the Veilware community. We build premium,<br className="desktop" /> undetected software with a relentless focus on quality, privacy, and performance.</p><div className="hero-actions"><button className="discord" onClick={() => go('support')}>◉ &nbsp; Join Our Discord</button><button className="outline-button" onClick={() => go('features')}>Explore <ArrowDown size={16} /></button></div><div className="trust"><ShieldCheck size={14} /> PRIVACY-FIRST <span>•</span> COMMUNITY-DRIVEN</div></div><button className="scroll-cue" onClick={() => go('features')} aria-label="Scroll to features"><span /></button></section>

    <section id="features" className="section feature-section"><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; FEATURES</div><h2>Engineered to stay <em>invisible</em></h2><p>Every Veilware product is built around the same promise — reliable,<br className="desktop" /> undetected, and crafted with care.</p></ScrollReveal><div className="feature-grid">{features.map(({ icon: Icon, title, copy }, i) => <ScrollReveal className="feature-card" key={title}><div className="icon-box"><Icon size={21} /></div><h3>{title}</h3><p>{copy}</p></ScrollReveal>)}</div></section>

    <section id="products" className="section products-section"><div className="product-bg" aria-hidden="true" /><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; THE VEILWARE COLLECTION</div><h2><span>OUR</span> <em>PRODUCTS</em></h2><p>A focused collection of tools designed with the same attention to privacy,<br className="desktop" /> precision, and performance that defines Veilware.</p><div className="coming">● &nbsp; COMING SOON</div></ScrollReveal><div className="product-grid">{products.map(({ icon: Icon, title, copy }) => <ScrollReveal className="product-card" key={title}><div className="card-top"><div className="icon-box"><Icon size={20} /></div><span>SOON</span></div><h3>{title}</h3><p>{copy}</p></ScrollReveal>)}</div></section>

    <section id="updates" className="section updates-section"><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; UPDATES</div><h2>No <em>updates</em> yet</h2><p>There is nothing new to share right now. Announcements will appear here<br className="desktop" /> when they are ready.</p></ScrollReveal><ScrollReveal className="empty-card"><div className="icon-box"><Bell size={22} /></div><p>Keep an eye on the Veilware Discord for the first product and community announcements.</p></ScrollReveal></section>

    <section id="faq" className="section faq-section"><ScrollReveal className="section-heading"><div className="eyebrow">● &nbsp; FAQ</div><h2>Questions, <em>answered</em></h2><p>Everything you need to know before joining the Veilware community.</p></ScrollReveal><div className="faq-list">{faqs.map(([question, answer], i) => <ScrollReveal className={`faq-item ${activeFaq === i ? 'active' : ''}`} key={question}><button onClick={() => setActiveFaq(activeFaq === i ? null : i)} aria-expanded={activeFaq === i}><span>{question}</span><span className="plus">+</span></button>{activeFaq === i && <p>{answer}</p>}</ScrollReveal>)}</div></section>

    <section id="support" className="support-section"><ScrollReveal className="support-card"><div className="support-icon">◉</div><div className="eyebrow">● &nbsp; COMMUNITY</div><h2>Join the Veilware <em>Discord</em></h2><p>Talk directly with the team, get fast support, and be the first to hear<br className="desktop" /> about new releases. Our community is where everything happens.</p><button className="discord" onClick={() => window.open('https://discord.com', '_blank', 'noopener,noreferrer')}>◉ &nbsp; Join Our Discord <ArrowRight size={16} /></button></ScrollReveal></section>

    <footer><div className="footer-wrap"><div><Logo /><p>VEILWARE builds premium, undetected software with a focus on privacy, performance, and a community that has your back.</p><button className="social" aria-label="Discord" onClick={() => go('support')}>◉</button></div><div className="footer-links"><div><small>NAVIGATION</small>{['home','features','products','updates','faq','support'].map(id => <button key={id} onClick={() => go(id)}>{id[0].toUpperCase() + id.slice(1)}</button>)}</div><div><small>RESOURCES</small><button onClick={() => go('support')}>Discord Community</button><button onClick={() => go('support')}>Support Channel</button><button onClick={() => go('updates')}>Changelog</button><button onClick={() => go('faq')}>FAQ</button></div></div></div><div className="copyright">© 2026 VEILWARE. Built with intent.</div></footer>
  </main>
}

require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('../models/template.model.js');

const TEMPLATES = [
    {
        name: 'Modern Portfolio',
        slug: 'modern-portfolio',
        description: 'A clean, minimal portfolio for designers and developers with projects, skills, and contact sections.',
        category: 'portfolio',
        framework: 'html',
        featured: true,
        tags: ['portfolio', 'minimal', 'dark'],
        files: [
            {
                path: 'index.html',
                language: 'html',
                content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="description" content="John Doe - UI/UX Designer & Developer">
<title>John Doe — Portfolio</title>
<link rel="stylesheet" href="styles.css">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
<nav class="nav">
  <div class="nav-inner">
    <a href="#" class="logo">JD</a>
    <div class="nav-links">
      <a href="#work">Work</a>
      <a href="#about">About</a>
      <a href="#contact">Contact</a>
    </div>
  </div>
</nav>
<section class="hero">
  <div class="hero-content">
    <span class="badge">Available for hire</span>
    <h1>I design and build<br><span class="accent">digital experiences</span></h1>
    <p>UI/UX Designer & Frontend Developer crafting clean, user-centered products.</p>
    <div class="hero-actions">
      <a href="#work" class="btn-primary">View Work</a>
      <a href="#contact" class="btn-ghost">Get in touch</a>
    </div>
  </div>
</section>
<section id="work" class="section">
  <div class="container">
    <h2 class="section-title">Selected Work</h2>
    <div class="projects-grid">
      <div class="project-card">
        <div class="project-img" style="background:linear-gradient(135deg,#667eea,#764ba2)"></div>
        <div class="project-info">
          <span class="tag">Product Design</span>
          <h3>Fintech Dashboard</h3>
          <p>Redesigned analytics dashboard for 50k+ users.</p>
        </div>
      </div>
      <div class="project-card">
        <div class="project-img" style="background:linear-gradient(135deg,#f093fb,#f5576c)"></div>
        <div class="project-info">
          <span class="tag">Web Development</span>
          <h3>E-commerce Platform</h3>
          <p>Full-stack shopping experience with cart and payments.</p>
        </div>
      </div>
      <div class="project-card">
        <div class="project-img" style="background:linear-gradient(135deg,#4facfe,#00f2fe)"></div>
        <div class="project-info">
          <span class="tag">Branding</span>
          <h3>SaaS Brand Identity</h3>
          <p>Complete visual identity for B2B software company.</p>
        </div>
      </div>
    </div>
  </div>
</section>
<section id="about" class="section section-alt">
  <div class="container about-grid">
    <div>
      <h2 class="section-title">About Me</h2>
      <p>5+ years crafting interfaces for startups and Fortune 500 companies. Focused on simplicity, accessibility, and performance.</p>
      <div class="skills">
        <span class="skill">Figma</span><span class="skill">React</span><span class="skill">CSS</span><span class="skill">TypeScript</span><span class="skill">Node.js</span>
      </div>
    </div>
    <div class="stats">
      <div class="stat"><strong>50+</strong><span>Projects</span></div>
      <div class="stat"><strong>5yr</strong><span>Experience</span></div>
      <div class="stat"><strong>20+</strong><span>Clients</span></div>
    </div>
  </div>
</section>
<section id="contact" class="section">
  <div class="container text-center">
    <h2>Let's work together</h2>
    <p>Have a project in mind? I'd love to hear about it.</p>
    <a href="mailto:hello@johndoe.com" class="btn-primary" style="margin-top:2rem;display:inline-block">Send a message</a>
  </div>
</section>
<footer class="footer"><p>© 2024 John Doe. All rights reserved.</p></footer>
<script src="script.js"></script>
</body>
</html>`
            },
            {
                path: 'styles.css',
                language: 'css',
                content: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0a0a0f;--bg2:#111118;--text:#e8e8f0;--muted:#666680;--accent:#7c6aff;--border:rgba(255,255,255,0.07)}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:1.2rem 2rem;background:rgba(10,10,15,0.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.logo{font-weight:700;font-size:1.1rem;color:var(--accent);letter-spacing:0.05em}
.nav-links{display:flex;gap:2rem}.nav-links a{font-size:.9rem;color:var(--muted);transition:color .2s}.nav-links a:hover{color:var(--text)}
.hero{min-height:100vh;display:flex;align-items:center;padding:0 2rem}
.hero-content{max-width:700px;margin:0 auto;text-align:center;padding-top:5rem}
.badge{display:inline-flex;align-items:center;gap:.5rem;padding:.3rem 1rem;border-radius:100px;font-size:.8rem;background:rgba(124,106,255,.12);color:var(--accent);border:1px solid rgba(124,106,255,.25);margin-bottom:2rem}
.badge::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--accent);animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
h1{font-size:clamp(2.5rem,6vw,4.5rem);font-weight:700;line-height:1.1;margin-bottom:1.5rem}
.accent{background:linear-gradient(135deg,#7c6aff,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero-content p{font-size:1.1rem;color:var(--muted);margin-bottom:2.5rem;max-width:500px;margin-left:auto;margin-right:auto}
.hero-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap}
.btn-primary{padding:.85rem 2rem;background:var(--accent);color:#fff;border-radius:10px;font-size:.9rem;font-weight:600;transition:all .2s;cursor:pointer;border:none}
.btn-primary:hover{background:#6b5ce7;transform:translateY(-2px);box-shadow:0 8px 24px rgba(124,106,255,.3)}
.btn-ghost{padding:.85rem 2rem;background:transparent;color:var(--text);border-radius:10px;font-size:.9rem;font-weight:500;transition:all .2s;cursor:pointer;border:1px solid var(--border)}
.btn-ghost:hover{background:var(--bg2);border-color:rgba(255,255,255,.15)}
.section{padding:6rem 2rem}.section-alt{background:var(--bg2)}
.container{max-width:1100px;margin:0 auto}
.section-title{font-size:2rem;font-weight:700;margin-bottom:3rem}
.projects-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem}
.project-card{border-radius:16px;overflow:hidden;border:1px solid var(--border);transition:transform .2s,box-shadow .2s}
.project-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(0,0,0,.4)}
.project-img{height:200px}
.project-info{padding:1.5rem;background:var(--bg2)}
.tag{font-size:.75rem;color:var(--accent);text-transform:uppercase;letter-spacing:.08em;font-weight:600}
.project-info h3{margin:.5rem 0;font-size:1.1rem}
.project-info p{font-size:.9rem;color:var(--muted)}
.about-grid{display:grid;grid-template-columns:1fr 1fr;gap:4rem;align-items:center}
@media(max-width:768px){.about-grid{grid-template-columns:1fr}}
.skills{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.5rem}
.skill{padding:.35rem .9rem;border-radius:100px;font-size:.8rem;background:rgba(124,106,255,.1);color:var(--accent);border:1px solid rgba(124,106,255,.2)}
.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem}.stat{text-align:center}
.stat strong{display:block;font-size:2.5rem;font-weight:700;color:var(--accent)}
.stat span{font-size:.85rem;color:var(--muted)}
.text-center{text-align:center}.text-center h2{font-size:2rem;margin-bottom:1rem}.text-center p{color:var(--muted)}
.footer{border-top:1px solid var(--border);padding:2rem;text-align:center;font-size:.85rem;color:var(--muted)}`
            },
            {
                path: 'script.js',
                language: 'javascript',
                content: `document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{e.preventDefault();const t=document.querySelector(a.getAttribute('href'));if(t)t.scrollIntoView({behavior:'smooth'})})});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});
document.querySelectorAll('.project-card,.stat').forEach(el=>{el.style.opacity='0';el.style.transform='translateY(20px)';el.style.transition='opacity .5s ease,transform .5s ease';observer.observe(el)});
document.addEventListener('DOMContentLoaded',()=>{const style=document.createElement('style');style.textContent='.visible{opacity:1 !important;transform:translateY(0) !important}';document.head.appendChild(style)});`
            }
        ]
    },
    {
        name: 'SaaS Landing Page',
        slug: 'saas-landing',
        description: 'A high-converting SaaS landing page with hero, features, pricing tiers, and social proof.',
        category: 'saas',
        framework: 'html',
        featured: true,
        tags: ['saas', 'landing', 'conversion'],
        files: [
            {
                path: 'index.html',
                language: 'html',
                content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<meta name="description" content="StreamLine - The productivity platform that works the way you think.">
<title>StreamLine — Smarter Work, Better Results</title>
<link rel="stylesheet" href="styles.css">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
<nav class="nav"><div class="nav-inner"><a href="#" class="logo">StreamLine</a><div class="nav-links"><a href="#features">Features</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></div><a href="#" class="btn-primary">Start Free Trial</a></div></nav>
<section class="hero">
  <div class="hero-badge">🎉 Now with AI-powered workflows</div>
  <h1>Work smarter, not<br><span class="gradient">harder</span></h1>
  <p>StreamLine automates your busywork so your team can focus on what actually matters. Join 12,000+ teams already saving 8 hours per week.</p>
  <div class="cta-group"><a href="#" class="btn-hero">Get started free</a><p class="sub-note">No credit card required · Free forever plan</p></div>
</section>
<section id="features" class="features">
  <div class="container">
    <h2>Everything your team needs</h2>
    <div class="features-grid">
      <div class="feature"><div class="f-icon">⚡</div><h3>Instant Automation</h3><p>Set up workflows in minutes, not days. Our visual builder requires zero coding.</p></div>
      <div class="feature"><div class="f-icon">🔗</div><h3>100+ Integrations</h3><p>Connect with Slack, GitHub, Notion, and every tool your team already uses.</p></div>
      <div class="feature"><div class="f-icon">📊</div><h3>Real-time Analytics</h3><p>See exactly where time is spent with dashboards that update live.</p></div>
      <div class="feature"><div class="f-icon">🛡</div><h3>Enterprise Security</h3><p>SOC 2 Type II certified. Your data is encrypted at rest and in transit.</p></div>
      <div class="feature"><div class="f-icon">🤝</div><h3>Team Collaboration</h3><p>Comment, assign, and collaborate directly inside your workflows.</p></div>
      <div class="feature"><div class="f-icon">📱</div><h3>Mobile First</h3><p>Full-featured iOS and Android apps. Work from anywhere, on any device.</p></div>
    </div>
  </div>
</section>
<section id="pricing" class="pricing">
  <div class="container">
    <h2>Simple pricing</h2>
    <p class="section-sub">Start free. Upgrade when you need more.</p>
    <div class="plans">
      <div class="plan"><h3>Starter</h3><div class="price">$0<span>/mo</span></div><ul><li>5 workflows</li><li>3 integrations</li><li>1,000 automation runs</li><li>Email support</li></ul><a href="#" class="btn-plan">Get started</a></div>
      <div class="plan featured"><div class="popular-badge">Most Popular</div><h3>Pro</h3><div class="price">$29<span>/mo</span></div><ul><li>Unlimited workflows</li><li>All integrations</li><li>50,000 automation runs</li><li>Priority support</li><li>Analytics dashboard</li></ul><a href="#" class="btn-plan-primary">Start 14-day trial</a></div>
      <div class="plan"><h3>Enterprise</h3><div class="price">Custom</div><ul><li>Everything in Pro</li><li>SSO & SAML</li><li>Custom contracts</li><li>Dedicated manager</li><li>SLA guarantee</li></ul><a href="#" class="btn-plan">Contact sales</a></div>
    </div>
  </div>
</section>
<footer class="footer"><p>© 2024 StreamLine Inc. All rights reserved.</p></footer>
</body>
</html>`
            },
            {
                path: 'styles.css',
                language: 'css',
                content: `*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#050510;--surface:#0d0d20;--text:#f0f0ff;--muted:#8888aa;--accent:#5b6ef5;--accent2:#9333ea;--border:rgba(255,255,255,0.06)}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased}
a{text-decoration:none;color:inherit}
.nav{position:fixed;inset-x:0;top:0;z-index:99;padding:1rem 2rem;background:rgba(5,5,16,.85);backdrop-filter:blur(20px);border-bottom:1px solid var(--border)}
.nav-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;justify-content:space-between}
.logo{font-weight:800;font-size:1.1rem;background:linear-gradient(135deg,var(--accent),var(--accent2));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nav-links{display:flex;gap:2rem}.nav-links a{font-size:.875rem;color:var(--muted);transition:color .2s}.nav-links a:hover{color:var(--text)}
.btn-primary{padding:.65rem 1.4rem;background:var(--accent);color:#fff;border-radius:8px;font-size:.875rem;font-weight:600;transition:all .2s}
.btn-primary:hover{background:#4a5be4;transform:translateY(-1px)}
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:7rem 2rem 4rem;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;width:800px;height:600px;border-radius:50%;background:radial-gradient(ellipse,rgba(91,110,245,.15) 0%,transparent 70%);top:-100px;left:50%;transform:translateX(-50%)}
.hero-badge{display:inline-flex;padding:.4rem 1.1rem;background:rgba(91,110,245,.12);border:1px solid rgba(91,110,245,.25);border-radius:100px;font-size:.8rem;color:var(--accent);margin-bottom:2rem}
.hero h1{font-size:clamp(2.8rem,7vw,5.5rem);font-weight:800;line-height:1.05;margin-bottom:1.5rem;max-width:800px}
.gradient{background:linear-gradient(135deg,var(--accent),var(--accent2),#ec4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:1.1rem;color:var(--muted);max-width:520px;margin-bottom:3rem}
.cta-group{display:flex;flex-direction:column;align-items:center;gap:.75rem}
.btn-hero{padding:1rem 2.5rem;background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;border-radius:12px;font-size:1rem;font-weight:700;transition:all .3s;box-shadow:0 4px 24px rgba(91,110,245,.35)}
.btn-hero:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(91,110,245,.5)}
.sub-note{font-size:.8rem;color:var(--muted)}
.features{padding:6rem 2rem;background:var(--surface)}
.container{max-width:1100px;margin:0 auto}
.features h2,.pricing h2{font-size:2.2rem;font-weight:700;text-align:center;margin-bottom:3rem}
.features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem}
.feature{padding:1.8rem;border-radius:16px;border:1px solid var(--border);background:var(--bg);transition:border-color .2s}
.feature:hover{border-color:rgba(91,110,245,.3)}
.f-icon{font-size:1.8rem;margin-bottom:1rem}
.feature h3{font-size:1rem;font-weight:600;margin-bottom:.5rem}
.feature p{font-size:.875rem;color:var(--muted);line-height:1.6}
.pricing{padding:6rem 2rem}.section-sub{text-align:center;color:var(--muted);margin-top:-2rem;margin-bottom:3rem}
.plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:1.5rem;position:relative}
.plan{padding:2rem;border-radius:16px;border:1px solid var(--border);background:var(--surface)}
.plan.featured{border-color:var(--accent);background:rgba(91,110,245,.05);position:relative}
.popular-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;font-size:.75rem;font-weight:600;padding:.25rem 1rem;border-radius:100px}
.plan h3{font-size:1rem;font-weight:600;margin-bottom:.75rem}
.price{font-size:2.5rem;font-weight:700;margin-bottom:1.5rem}.price span{font-size:1rem;color:var(--muted);font-weight:400}
.plan ul{list-style:none;space-y:.75rem;margin-bottom:2rem}
.plan ul li{font-size:.875rem;color:var(--muted);padding:.4rem 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:.5rem}
.plan ul li::before{content:'✓';color:var(--accent);font-weight:700}
.btn-plan,.btn-plan-primary{display:block;text-align:center;padding:.85rem;border-radius:10px;font-size:.875rem;font-weight:600;transition:all .2s;margin-top:1.5rem}
.btn-plan{border:1px solid var(--border);color:var(--text)}.btn-plan:hover{background:var(--bg)}
.btn-plan-primary{background:var(--accent);color:#fff}.btn-plan-primary:hover{background:#4a5be4}
.footer{border-top:1px solid var(--border);padding:2rem;text-align:center;font-size:.85rem;color:var(--muted)}`
            }
        ]
    },
    {
        name: 'Nexus Digital Agency',
        slug: 'nexus-agency',
        description: 'Bold, high-impact creative agency site featuring interactive services grid, case studies, and consultation booking.',
        category: 'agency',
        framework: 'html',
        featured: true,
        tags: ['agency', 'creative', 'dark', 'showcase'],
        files: [
            {
                path: 'index.html',
                language: 'html',
                content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nexus — Creative Studio & Digital Product Agency</title>
<link rel="stylesheet" href="styles.css">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
<header class="header">
  <div class="container nav-row">
    <a href="#" class="brand">Nexus<span>.</span></a>
    <nav class="nav-links">
      <a href="#services">Services</a>
      <a href="#work">Case Studies</a>
      <a href="#about">About</a>
      <a href="#contact" class="btn-sm">Book Call</a>
    </nav>
  </div>
</header>
<main>
  <section class="hero">
    <div class="container">
      <div class="pill">Award-winning digital studio</div>
      <h1>We engineer digital products that <em>scale businesses</em>.</h1>
      <p>Transforming complex technical ideas into memorable web experiences, mobile apps, and iconic brand systems.</p>
      <div class="hero-btns">
        <a href="#work" class="btn-main">Explore Our Work</a>
        <a href="#services" class="btn-outline">What We Do</a>
      </div>
    </div>
  </section>
  <section id="services" class="section">
    <div class="container">
      <div class="section-head">
        <h2>Core Capabilities</h2>
        <p>End-to-end design & engineering sprints for high-growth tech teams.</p>
      </div>
      <div class="grid-3">
        <div class="card">
          <div class="icon">✨</div>
          <h3>UI/UX Architecture</h3>
          <p>Design systems, interaction prototypes, and high-fidelity interfaces built for conversion.</p>
        </div>
        <div class="card">
          <div class="icon">⚡</div>
          <h3>Full-Stack Engineering</h3>
          <p>High-performance web apps, APIs, and scalable cloud architectures engineered to standard.</p>
        </div>
        <div class="card">
          <div class="icon">🚀</div>
          <h3>Brand Identity</h3>
          <p>Visual positioning, design guidelines, 3D assets, and marketing collateral that resonate.</p>
        </div>
      </div>
    </div>
  </section>
  <section id="work" class="section bg-elevated">
    <div class="container">
      <div class="section-head">
        <h2>Selected Case Studies</h2>
        <p>A few ambitious projects we recently brought to market.</p>
      </div>
      <div class="case-grid">
        <article class="case-card">
          <div class="case-banner b1"></div>
          <div class="case-body">
            <span class="badge">Fintech SaaS</span>
            <h3>Voltpay: Modern Checkout & Payments</h3>
            <p>Increased merchant checkout conversion by 34% with a streamlined multi-currency interface.</p>
          </div>
        </article>
        <article class="case-card">
          <div class="case-banner b2"></div>
          <div class="case-body">
            <span class="badge">AI Workspace</span>
            <h3>Synapse: Collaborative Intelligence</h3>
            <p>From initial seed prototype to 120,000 monthly active users in 6 months.</p>
          </div>
        </article>
      </div>
    </div>
  </section>
  <section id="contact" class="section">
    <div class="container text-center">
      <h2>Have an idea in mind?</h2>
      <p>We take on a limited number of clients each quarter to guarantee dedicated focus.</p>
      <form class="contact-box" onsubmit="event.preventDefault(); alert('Thank you! We will get back to you within 24 hours.');">
        <input type="email" placeholder="Enter your business email" required />
        <button type="submit" class="btn-main">Schedule Strategy Call</button>
      </form>
    </div>
  </section>
</main>
<footer class="footer">
  <div class="container footer-content">
    <p>© 2026 Nexus Studio. Built for ambitious founders.</p>
    <div class="socials">
      <a href="#">Twitter / X</a>
      <a href="#">GitHub</a>
      <a href="#">LinkedIn</a>
    </div>
  </div>
</footer>
<script src="script.js"></script>
</body>
</html>`
            },
            {
                path: 'styles.css',
                language: 'css',
                content: `*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#07070b;--bg-card:#101018;--bg-elevated:#0c0c12;--accent:#6366f1;--text:#f8fafc;--text-dim:#94a3b8;--border:rgba(255,255,255,0.08)}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
a{color:inherit;text-decoration:none}
.container{max-width:1160px;margin:0 auto;padding:0 24px}
.header{position:sticky;top:0;z-index:50;backdrop-filter:blur(16px);background:rgba(7,7,11,0.8);border-bottom:1px solid var(--border);padding:18px 0}
.nav-row{display:flex;align-items:center;justify-content:space-between}
.brand{font-size:22px;font-weight:800;letter-spacing:-0.5px}
.brand span{color:var(--accent)}
.nav-links{display:flex;align-items:center;gap:28px;font-size:14px;color:var(--text-dim)}
.nav-links a:hover{color:var(--text)}
.btn-sm{padding:8px 18px;border-radius:8px;background:var(--accent);color:#fff!important;font-weight:600}
.hero{padding:120px 0 80px;text-align:center}
.pill{display:inline-block;padding:6px 16px;border-radius:100px;background:rgba(99,102,241,0.12);color:var(--accent);border:1px solid rgba(99,102,241,0.3);font-size:13px;font-weight:600;margin-bottom:24px}
.hero h1{font-size:clamp(36px,5.5vw,68px);font-weight:800;line-height:1.1;letter-spacing:-1px;max-width:900px;margin:0 auto 24px}
.hero h1 em{font-style:normal;background:linear-gradient(135deg,#818cf8,#c084fc);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.hero p{font-size:18px;color:var(--text-dim);max-width:620px;margin:0 auto 36px}
.hero-btns{display:flex;gap:14px;justify-content:center}
.btn-main{padding:12px 28px;border-radius:10px;background:var(--accent);color:#fff;font-weight:600;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s}
.btn-main:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(99,102,241,0.35)}
.btn-outline{padding:12px 28px;border-radius:10px;border:1px solid var(--border);color:var(--text);font-weight:600;transition:background .2s}
.btn-outline:hover{background:var(--bg-card)}
.section{padding:90px 0}
.bg-elevated{background:var(--bg-elevated)}
.section-head{margin-bottom:50px}
.section-head h2{font-size:32px;font-weight:700;letter-spacing:-0.5px;margin-bottom:10px}
.section-head p{color:var(--text-dim);font-size:16px}
.grid-3{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}
.card{padding:36px;border-radius:16px;background:var(--bg-card);border:1px solid var(--border);transition:border-color .2s}
.card:hover{border-color:rgba(99,102,241,0.4)}
.card .icon{font-size:32px;margin-bottom:18px}
.card h3{font-size:18px;font-weight:600;margin-bottom:10px}
.card p{font-size:14px;color:var(--text-dim);line-height:1.7}
.case-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:28px}
.case-card{border-radius:18px;overflow:hidden;background:var(--bg-card);border:1px solid var(--border)}
.case-banner{height:220px}
.b1{background:linear-gradient(135deg,#312e81,#4f46e5)}
.b2{background:linear-gradient(135deg,#581c87,#9333ea)}
.case-body{padding:28px}
.badge{display:inline-block;padding:4px 10px;border-radius:6px;background:rgba(255,255,255,0.06);font-size:12px;font-weight:600;color:var(--text-dim);margin-bottom:12px}
.case-body h3{font-size:20px;margin-bottom:10px}
.case-body p{font-size:14px;color:var(--text-dim)}
.contact-box{max-width:540px;margin:36px auto 0;display:flex;gap:10px}
.contact-box input{flex:1;padding:12px 18px;border-radius:10px;border:1px solid var(--border);background:var(--bg-card);color:var(--text);font-size:14px;outline:none}
.contact-box input:focus{border-color:var(--accent)}
.footer{border-top:1px solid var(--border);padding:36px 0;font-size:14px;color:var(--text-dim)}
.footer-content{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
.socials{display:flex;gap:20px}`
            },
            {
                path: 'script.js',
                language: 'javascript',
                content: `document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});`
            }
        ]
    },
    {
        name: "L'Aura Bistro & Bar",
        slug: 'laura-bistro',
        description: 'Atmospheric culinary showcase with filterable seasonal menus, table reservation booking, and story section.',
        category: 'restaurant',
        framework: 'html',
        featured: true,
        tags: ['restaurant', 'food', 'luxury', 'hospitality'],
        files: [
            {
                path: 'index.html',
                language: 'html',
                content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>L'Aura — Modern Bistro & Wine Cellar</title>
<link rel="stylesheet" href="styles.css">
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
</head>
<body>
<nav class="nav">
  <div class="nav-container">
    <div class="logo">L'AURA</div>
    <div class="menu-links">
      <a href="#about">Story</a>
      <a href="#menu">Menu</a>
      <a href="#hours">Hours</a>
      <a href="#reserve" class="reserve-btn">Reserve a Table</a>
    </div>
  </div>
</nav>
<header class="hero">
  <div class="hero-inner">
    <p class="tagline">Seasonal Botanicals & Woodfire Hearth</p>
    <h1>Culinary Artistry in Every Plate</h1>
    <p class="subtext">Sustainably foraged produce, heritage grains, and low-intervention wines curated in downtown Manhattan.</p>
    <a href="#reserve" class="cta-gold">Book Your Table</a>
  </div>
</header>
<section id="menu" class="section">
  <div class="container">
    <div class="title-wrap">
      <h2>Chef's Seasonal Menu</h2>
      <p>Updated weekly depending on farm harvests.</p>
    </div>
    <div class="menu-tabs">
      <button class="tab active" onclick="filterMenu('mains')">Mains</button>
      <button class="tab" onclick="filterMenu('starters')">Starters</button>
      <button class="tab" onclick="filterMenu('desserts')">Desserts</button>
    </div>
    <div id="menu-items" class="menu-grid">
      <div class="item" data-cat="mains">
        <div class="item-head"><h4>Pan-Seared Halibut</h4><span class="price">$42</span></div>
        <p>Meyer lemon beurre blanc, charred broccolini, crispy capers.</p>
      </div>
      <div class="item" data-cat="mains">
        <div class="item-head"><h4>Dry-Aged Ribeye (12oz)</h4><span class="price">$58</span></div>
        <p>Smoked bone marrow butter, confit shallots, truffled pommes frites.</p>
      </div>
      <div class="item" data-cat="starters">
        <div class="item-head"><h4>Burrata & Heirloom Peach</h4><span class="price">$22</span></div>
        <p>Aged balsamic vinegar, wild mint, toasted sourdough crostini.</p>
      </div>
      <div class="item" data-cat="desserts">
        <div class="item-head"><h4>Valrhona Dark Fondant</h4><span class="price">$16</span></div>
        <p>Espresso gelato, sea salt flakes, warm pistachio ganache.</p>
      </div>
    </div>
  </div>
</section>
<section id="reserve" class="section reserve-section">
  <div class="container text-center">
    <h2>Reservations</h2>
    <p>Tables available up to 30 days in advance.</p>
    <form class="reserve-form" onsubmit="event.preventDefault(); alert('Reservation requested! Confirmation has been sent to your email.');">
      <input type="text" placeholder="Full Name" required />
      <input type="email" placeholder="Email Address" required />
      <select required>
        <option value="">Guests</option>
        <option>2 Guests</option>
        <option>4 Guests</option>
        <option>6+ Guests</option>
      </select>
      <input type="date" required />
      <button type="submit" class="cta-gold">Confirm Booking</button>
    </form>
  </div>
</section>
<footer class="footer">
  <p>© 2026 L'Aura Bistro. 412 Mercer Street, New York, NY.</p>
</footer>
<script src="script.js"></script>
</body>
</html>`
            },
            {
                path: 'styles.css',
                language: 'css',
                content: `*{box-sizing:border-box;margin:0;padding:0}
:root{--dark:#0b0a0a;--card:#151414;--gold:#d4af37;--gold-glow:rgba(212,175,55,0.25);--light:#f4efe6;--muted:#9e978e}
body{font-family:'Inter',sans-serif;background:var(--dark);color:var(--light);line-height:1.7}
h1,h2,h3,h4,.logo{font-family:'Cinzel',serif}
a{color:inherit;text-decoration:none}
.container{max-width:1040px;margin:0 auto;padding:0 24px}
.nav{padding:24px 0;border-bottom:1px solid rgba(255,255,255,0.08);position:sticky;top:0;background:rgba(11,10,10,0.92);backdrop-filter:blur(10px);z-index:20}
.nav-container{max-width:1100px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:0 24px}
.logo{font-size:24px;letter-spacing:4px;color:var(--gold)}
.menu-links{display:flex;align-items:center;gap:28px;font-size:14px;letter-spacing:1px}
.reserve-btn{padding:8px 18px;border:1px solid var(--gold);color:var(--gold);border-radius:4px;transition:background .2s}
.reserve-btn:hover{background:var(--gold);color:var(--dark)}
.hero{padding:130px 24px 90px;text-align:center;background:radial-gradient(circle at center,rgba(212,175,55,0.08) 0%,transparent 65%)}
.tagline{font-size:13px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
.hero h1{font-size:clamp(34px,5.5vw,60px);letter-spacing:2px;margin-bottom:20px;font-weight:600}
.subtext{max-width:600px;margin:0 auto 36px;color:var(--muted);font-size:16px}
.cta-gold{display:inline-block;padding:14px 34px;background:var(--gold);color:var(--dark);font-weight:600;letter-spacing:1px;border-radius:4px;border:none;cursor:pointer;transition:transform .2s,box-shadow .2s}
.cta-gold:hover{transform:translateY(-2px);box-shadow:0 8px 24px var(--gold-glow)}
.section{padding:90px 0}
.title-wrap{text-align:center;margin-bottom:40px}
.title-wrap h2{font-size:32px;letter-spacing:2px;margin-bottom:8px}
.title-wrap p{color:var(--muted);font-size:15px}
.menu-tabs{display:flex;justify-content:center;gap:16px;margin-bottom:48px}
.tab{padding:8px 22px;border:1px solid rgba(255,255,255,0.12);background:transparent;color:var(--muted);border-radius:4px;cursor:pointer;font-family:'Cinzel',serif;letter-spacing:1px;transition:all .2s}
.tab.active,.tab:hover{border-color:var(--gold);color:var(--gold)}
.menu-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:32px}
.item{padding:24px;border-bottom:1px solid rgba(255,255,255,0.06);background:var(--card);border-radius:6px}
.item-head{display:flex;justify-content:space-between;margin-bottom:8px}
.item-head h4{font-size:18px;letter-spacing:1px}
.price{color:var(--gold);font-weight:600}
.item p{color:var(--muted);font-size:14px}
.reserve-section{background:#0e0d0d}
.reserve-form{max-width:640px;margin:32px auto 0;display:grid;grid-template-columns:1fr 1fr;gap:16px}
.reserve-form input,.reserve-form select{padding:12px;background:#181717;border:1px solid rgba(255,255,255,0.1);color:var(--light);border-radius:4px;font-size:14px;outline:none}
.reserve-form button{grid-column:1 / -1}
.footer{text-align:center;padding:40px;border-top:1px solid rgba(255,255,255,0.06);font-size:13px;color:var(--muted)}`
            },
            {
                path: 'script.js',
                language: 'javascript',
                content: `function filterMenu(cat) {
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.item').forEach(it => {
    if (it.getAttribute('data-cat') === cat || cat === 'all') {
      it.style.display = 'block';
    } else {
      it.style.display = 'none';
    }
  });
}`
            }
        ]
    },
    {
        name: 'Nebula Developer Docs',
        slug: 'nebula-docs',
        description: 'Clean, lightning-fast technical documentation layout with sidebar hierarchy, syntax code blocks, and copy-to-clipboard.',
        category: 'docs',
        framework: 'html',
        featured: true,
        tags: ['docs', 'developer', 'api', 'markdown'],
        files: [
            {
                path: 'index.html',
                language: 'html',
                content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nebula Engine Documentation</title>
<link rel="stylesheet" href="styles.css">
<link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
<div class="layout">
  <aside class="sidebar">
    <div class="brand">
      <div class="logo">✦</div>
      <span>Nebula Docs</span>
    </div>
    <div class="nav-section">
      <div class="nav-title">Getting Started</div>
      <a href="#intro" class="nav-item active">Introduction</a>
      <a href="#quickstart" class="nav-item">Quickstart Guide</a>
      <a href="#install" class="nav-item">Installation</a>
    </div>
    <div class="nav-section">
      <div class="nav-title">Core APIs</div>
      <a href="#auth" class="nav-item">Authentication</a>
      <a href="#pipelines" class="nav-item">Streaming Pipelines</a>
      <a href="#webhooks" class="nav-item">Webhooks</a>
    </div>
  </aside>
  <main class="main-content">
    <header class="topbar">
      <input type="search" placeholder="Quick search (⌘K)..." class="search-input" />
      <div class="top-links"><a href="https://github.com" target="_blank">v2.4.0 · GitHub</a></div>
    </header>
    <article class="doc-body">
      <div class="breadcrumb">Docs / Getting Started / Introduction</div>
      <h1>Nebula SDK Quickstart</h1>
      <p class="lead">Build ultra-low latency real-time data pipelines in less than 5 minutes using the official Nebula TypeScript SDK.</p>
      
      <h2 id="install">1. Installation</h2>
      <p>Install the core package using your preferred package manager:</p>
      <div class="code-box">
        <div class="code-head"><span>bash</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
        <pre><code>npm install @nebula-ai/core @nebula-ai/streaming</code></pre>
      </div>

      <h2 id="quickstart">2. Initialize Client</h2>
      <p>Create a secure client instance using your API token from the dashboard:</p>
      <div class="code-box">
        <div class="code-head"><span>typescript</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div>
        <pre><code>import { NebulaClient } from '@nebula-ai/core';

const client = new NebulaClient({
  apiKey: process.env.NEBULA_KEY,
  region: 'us-east-1'
});

const session = await client.pipelines.create({
  mode: 'realtime-sync',
  concurrency: 8
});</code></pre>
      </div>

      <div class="alert alert-info">
        <strong>Pro-tip:</strong> Always keep your API tokens server-side. For client-facing streaming, generate ephemeral short-lived session tickets via the backend.
      </div>
    </article>
  </main>
</div>
<script src="script.js"></script>
</body>
</html>`
            },
            {
                path: 'styles.css',
                language: 'css',
                content: `*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#090a0f;--side:#0e1017;--border:rgba(255,255,255,0.08);--accent:#38bdf8;--text:#e2e8f0;--muted:#64748b;--code-bg:#050608}
body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
code,pre{font-family:'Fira Code',monospace}
.layout{display:flex;min-height:100vh}
.sidebar{width:260px;background:var(--side);border-right:1px solid var(--border);padding:24px 16px;flex-shrink:0}
.brand{display:flex;align-items:center;gap:10px;font-weight:700;font-size:16px;margin-bottom:32px;padding-left:8px}
.brand .logo{color:var(--accent)}
.nav-section{margin-bottom:24px}
.nav-title{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:var(--muted);font-weight:700;margin-bottom:8px;padding-left:8px}
.nav-item{display:block;padding:8px 12px;border-radius:6px;font-size:13px;color:var(--text);text-decoration:none;transition:background .15s}
.nav-item:hover{background:rgba(255,255,255,0.05)}
.nav-item.active{background:rgba(56,189,248,0.12);color:var(--accent);font-weight:600}
.main-content{flex:1;display:flex;flex-direction:column}
.topbar{height:60px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 36px}
.search-input{background:#13151f;border:1px solid var(--border);border-radius:8px;padding:8px 16px;color:var(--text);font-size:13px;width:260px;outline:none}
.top-links a{color:var(--muted);text-decoration:none;font-size:13px}
.doc-body{max-width:820px;padding:48px 36px}
.breadcrumb{font-size:12px;color:var(--muted);margin-bottom:16px}
h1{font-size:36px;font-weight:800;letter-spacing:-0.5px;margin-bottom:16px}
.lead{font-size:18px;color:#94a3b8;line-height:1.6;margin-bottom:36px}
h2{font-size:22px;margin:36px 0 16px;letter-spacing:-0.3px}
p{color:#cbd5e1;margin-bottom:16px;font-size:15px}
.code-box{background:var(--code-bg);border:1px solid var(--border);border-radius:10px;overflow:hidden;margin:16px 0 28px}
.code-head{display:flex;justify-content:space-between;align-items:center;padding:8px 16px;background:rgba(255,255,255,0.03);border-bottom:1px solid var(--border);font-size:12px;color:var(--muted)}
.copy-btn{background:transparent;border:1px solid var(--border);color:var(--text);border-radius:4px;padding:3px 8px;font-size:11px;cursor:pointer}
pre{padding:16px;overflow-x:auto;font-size:13px;color:#7dd3fc;line-height:1.5}
.alert{padding:16px 20px;border-radius:8px;font-size:14px;margin-top:24px}
.alert-info{background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.25);color:#bae6fd}`
            },
            {
                path: 'script.js',
                language: 'javascript',
                content: `function copyCode(btn) {
  const code = btn.closest('.code-box').querySelector('code').innerText;
  navigator.clipboard.writeText(code).then(() => {
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy', 2000);
  });
}`
            }
        ]
    },
    {
        name: 'Aura Living Commerce',
        slug: 'aura-commerce',
        description: 'Refined modern e-commerce storefront with product cards, category filters, interactive cart drawer, and responsive layout.',
        category: 'ecommerce',
        framework: 'html',
        featured: true,
        tags: ['ecommerce', 'shop', 'minimal', 'products'],
        files: [
            {
                path: 'index.html',
                language: 'html',
                content: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aura Living — Curated Objects & Homeware</title>
<link rel="stylesheet" href="styles.css">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
<nav class="nav">
  <div class="container nav-wrap">
    <div class="brand">AURA LIVING</div>
    <div class="nav-center">
      <a href="#featured">Featured</a>
      <a href="#collection">Collection</a>
      <a href="#about">Philosophy</a>
    </div>
    <div class="cart-trigger" onclick="toggleCart()">
      <span>Cart (<span id="cart-count">0</span>)</span>
    </div>
  </div>
</nav>
<header class="hero">
  <div class="container">
    <p class="eyebrow">Autumn / Winter '26 Release</p>
    <h1>Form meets tranquility.</h1>
    <p class="subtitle">Artisanal ceramics, organic linens, and brushed bronze homeware designed to outlive trends.</p>
  </div>
</header>
<section id="collection" class="section">
  <div class="container">
    <div class="section-title">
      <h2>Curated Essentials</h2>
      <p>Handcrafted in small batches across Kyoto and Copenhagen.</p>
    </div>
    <div class="product-grid">
      <div class="product-card">
        <div class="product-img p1"></div>
        <div class="product-info">
          <h3>Earthen Teapot</h3>
          <span class="price">$145</span>
        </div>
        <button class="add-btn" onclick="addToCart('Earthen Teapot', 145)">Add to Bag</button>
      </div>
      <div class="product-card">
        <div class="product-img p2"></div>
        <div class="product-info">
          <h3>Raw Linen Throw</h3>
          <span class="price">$190</span>
        </div>
        <button class="add-btn" onclick="addToCart('Raw Linen Throw', 190)">Add to Bag</button>
      </div>
      <div class="product-card">
        <div class="product-img p3"></div>
        <div class="product-info">
          <h3>Cast Bronze Vessel</h3>
          <span class="price">$220</span>
        </div>
        <button class="add-btn" onclick="addToCart('Cast Bronze Vessel', 220)">Add to Bag</button>
      </div>
    </div>
  </div>
</section>
<div id="cart-drawer" class="cart-drawer">
  <div class="cart-head">
    <h3>Shopping Bag</h3>
    <button onclick="toggleCart()" class="close-btn">✕</button>
  </div>
  <div id="cart-items" class="cart-items">
    <p class="empty-msg">Your bag is currently empty.</p>
  </div>
  <div class="cart-foot">
    <div class="total-row"><span>Subtotal:</span><span id="cart-total">$0</span></div>
    <button class="checkout-btn" onclick="alert('Checkout integration ready!')">Proceed to Checkout</button>
  </div>
</div>
<footer class="footer">
  <p>© 2026 Aura Living Studio. Worldwide carbon-neutral shipping.</p>
</footer>
<script src="script.js"></script>
</body>
</html>`
            },
            {
                path: 'styles.css',
                language: 'css',
                content: `*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0f0f12;--surface:#17171c;--accent:#f59e0b;--text:#f3f4f6;--muted:#9ca3af;--border:rgba(255,255,255,0.08)}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg);color:var(--text);line-height:1.6}
a{color:inherit;text-decoration:none}
.container{max-width:1120px;margin:0 auto;padding:0 24px}
.nav{padding:20px 0;border-bottom:1px solid var(--border);position:sticky;top:0;background:rgba(15,15,18,0.9);backdrop-filter:blur(10px);z-index:20}
.nav-wrap{display:flex;justify-content:space-between;align-items:center}
.brand{font-size:18px;font-weight:800;letter-spacing:2px}
.nav-center{display:flex;gap:28px;font-size:14px;color:var(--muted)}
.cart-trigger{font-size:14px;font-weight:600;cursor:pointer;padding:6px 14px;border-radius:6px;background:var(--surface);border:1px solid var(--border)}
.hero{padding:90px 0 60px;text-align:center}
.eyebrow{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:12px}
.hero h1{font-size:clamp(32px,5vw,56px);font-weight:700;margin-bottom:16px;letter-spacing:-0.5px}
.subtitle{font-size:16px;color:var(--muted);max-width:540px;margin:0 auto}
.section{padding:80px 0}
.section-title{text-align:center;margin-bottom:48px}
.section-title h2{font-size:28px;margin-bottom:8px}
.section-title p{color:var(--muted);font-size:14px}
.product-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:28px}
.product-card{background:var(--surface);border-radius:14px;border:1px solid var(--border);overflow:hidden;padding:16px}
.product-img{height:220px;border-radius:10px;margin-bottom:16px}
.p1{background:linear-gradient(135deg,#78350f,#d97706)}
.p2{background:linear-gradient(135deg,#374151,#4b5563)}
.p3{background:linear-gradient(135deg,#854d0e,#ca8a04)}
.product-info{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.product-info h3{font-size:16px;font-weight:600}
.price{font-size:15px;color:var(--accent);font-weight:700}
.add-btn{width:100%;padding:10px;border-radius:8px;background:transparent;border:1px solid var(--border);color:var(--text);font-weight:600;cursor:pointer;transition:all .2s}
.add-btn:hover{background:var(--text);color:var(--bg)}
.cart-drawer{position:fixed;right:-380px;top:0;width:360px;height:100vh;background:#141418;border-left:1px solid var(--border);z-index:100;transition:right .3s ease;display:flex;flex-direction:column;padding:24px}
.cart-drawer.open{right:0}
.cart-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--border)}
.close-btn{background:none;border:none;color:var(--text);font-size:18px;cursor:pointer}
.cart-items{flex:1;overflow-y:auto}
.empty-msg{color:var(--muted);font-size:13px;text-align:center;padding:40px 0}
.cart-item-row{display:flex;justify-content:space-between;margin-bottom:12px;font-size:14px}
.cart-foot{border-top:1px solid var(--border);padding-top:20px}
.total-row{display:flex;justify-content:space-between;font-weight:700;margin-bottom:16px}
.checkout-btn{width:100%;padding:12px;border-radius:8px;background:var(--accent);color:#000;font-weight:700;border:none;cursor:pointer}
.footer{text-align:center;padding:36px;border-top:1px solid var(--border);color:var(--muted);font-size:13px}`
            },
            {
                path: 'script.js',
                language: 'javascript',
                content: `let cart = [];
function toggleCart() {
  document.getElementById('cart-drawer').classList.toggle('open');
}
function addToCart(name, price) {
  cart.push({ name, price });
  document.getElementById('cart-count').textContent = cart.length;
  renderCart();
  document.getElementById('cart-drawer').classList.add('open');
}
function renderCart() {
  const container = document.getElementById('cart-items');
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-msg">Your bag is currently empty.</p>';
    document.getElementById('cart-total').textContent = '$0';
    return;
  }
  container.innerHTML = cart.map(item => \`<div class="cart-item-row"><span>\${item.name}</span><strong>$\${item.price}</strong></div>\`).join('');
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('cart-total').textContent = '$' + total;
}`
            }
        ]
    },
    {
        name: 'Nexus React SaaS Platform',
        slug: 'nexus-react-saas',
        description: 'Next-generation AI workflow platform built with React 18, Tailwind CSS, interactive billing toggle, and feature showcases.',
        category: 'saas',
        framework: 'react',
        featured: true,
        tags: ['react', 'saas', 'tailwind', 'analytics', 'dark-mode'],
        files: [
            {
                path: 'index.html',
                language: 'html',
                content: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nexus — AI Workflow Engine</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <style>body { font-family: 'Plus Jakarta Sans', sans-serif; }</style>
  </head>
  <body class="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
            },
            {
                path: 'src/App.jsx',
                language: 'javascript',
                content: `import React, { useState } from 'react';

export default function App() {
  const [billing, setBilling] = useState('monthly');

  const features = [
    { title: 'Neural Automation', desc: 'Deploy self-healing workflow pipelines that execute complex multi-modal reasoning tasks in sub-seconds.', icon: '⚡' },
    { title: 'Real-time Telemetry', desc: 'Monitor throughput, tokens, and latency across all distributed endpoints with 99.99% uptime guarantees.', icon: '📊' },
    { title: 'Zero-Trust Isolation', desc: 'Every computation occurs in ephemeral isolated micro-VMs with military-grade hardware encryption.', icon: '🛡️' }
  ];

  const pricing = [
    { name: 'Starter', price: billing === 'monthly' ? '$29' : '$24', desc: 'For independent creators & indie hackers', features: ['50,000 monthly executions', '10 active workflows', 'Community support', 'Standard latency'], popular: false },
    { name: 'Pro Engine', price: billing === 'monthly' ? '$79' : '$64', desc: 'For high-velocity engineering teams', features: ['Unlimited executions', '100 active workflows', 'Priority GPU clusters', '24/7 Dedicated Slack channel'], popular: true },
    { name: 'Enterprise', price: billing === 'monthly' ? '$249' : '$199', desc: 'For mission-critical production systems', features: ['Dedicated isolated VPC', 'Custom fine-tuned models', '99.99% SLA agreement', 'SOC2 Type II certified'], popular: false }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <nav className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-sky-400 to-emerald-400 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">N</div>
            <span className="font-bold text-lg tracking-tight">Nexus.ai</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-semibold">⚛️ React 18</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg text-sm font-medium hover:text-white text-slate-300">Sign In</button>
            <button className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-all shadow-md shadow-indigo-600/30">Get Started</button>
          </div>
        </div>
      </nav>

      <section className="relative pt-24 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-8">
          <span>✨ Nexus 3.0 Platform is now live</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
          Supercharge Workflows with <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-400 bg-clip-text text-transparent">Autonomous AI</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          The enterprise compute platform for building, deploying, and auto-optimizing cognitive pipelines at global scale.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:opacity-95 text-white font-semibold transition-all shadow-xl shadow-indigo-500/25">
            Start Free 14-Day Trial
          </button>
          <button className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-semibold transition-all">
            Schedule Review
          </button>
        </div>
      </section>

      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Architected for Extreme Performance</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">Everything engineering teams need to deploy AI agents that reliably solve real enterprise challenges.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="text-3xl mb-4 p-3 rounded-xl bg-slate-800/80 w-fit">{feat.icon}</div>
              <h3 className="text-xl font-bold mb-3 group-hover:text-indigo-400 transition-colors">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-slate-400 max-w-md mx-auto text-sm mb-8">Scale dynamically from your first agent invocation to millions per day.</p>
          <div className="inline-flex items-center gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button onClick={() => setBilling('monthly')} className={'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ' + (billing === 'monthly' ? 'bg-indigo-600 text-white' : 'text-slate-400')}>Monthly</button>
            <button onClick={() => setBilling('yearly')} className={'px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ' + (billing === 'yearly' ? 'bg-indigo-600 text-white' : 'text-slate-400')}>Annually (-20%)</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricing.map((tier, idx) => (
            <div key={idx} className={'p-8 rounded-2xl relative flex flex-col justify-between ' + (tier.popular ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-2 border-indigo-500 shadow-2xl shadow-indigo-500/10' : 'bg-slate-900/40 border border-slate-800')}>
              {tier.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-indigo-500 text-white text-[11px] font-bold uppercase tracking-wider">Most Popular</span>}
              <div>
                <h3 className="text-lg font-bold mb-1">{tier.name}</h3>
                <p className="text-xs text-slate-400 mb-6">{tier.desc}</p>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{tier.price}</span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>
                <div className="space-y-3 mb-8">
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                      <span className="text-emerald-400">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className={'w-full py-2.5 rounded-xl text-sm font-semibold transition-all ' + (tier.popular ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-800 hover:bg-slate-700 text-slate-200')}>Get Started</button>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-800/80 py-12 px-6 text-center text-xs text-slate-500">
        <p>© 2026 Nexus AI Technologies Inc. All rights reserved.</p>
      </footer>
    </div>
  );
}`
            },
            {
                path: 'src/main.jsx',
                language: 'javascript',
                content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`
            },
            {
                path: 'src/index.css',
                language: 'css',
                content: `@tailwind base;
@tailwind components;
@tailwind utilities;`
            },
            {
                path: 'package.json',
                language: 'json',
                content: JSON.stringify({
                    name: 'nexus-react-saas',
                    private: true,
                    version: '1.0.0',
                    type: 'module',
                    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
                    dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1', 'lucide-react': '^0.344.0' },
                    devDependencies: { '@vitejs/plugin-react': '^4.3.1', autoprefixer: '^10.4.19', postcss: '^8.4.38', tailwindcss: '^3.4.4', vite: '^5.3.4' }
                }, null, 2)
            },
            {
                path: 'vite.config.js',
                language: 'javascript',
                content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});`
            }
        ]
    }
];

async function seedTemplates() {
    await mongoose.connect(process.env.DATABASE_URL);
    process.stdout.write('Connected to DB\n');

    for (const t of TEMPLATES) {
        await Template.findOneAndUpdate(
            { slug: t.slug },
            t,
            { upsert: true, new: true }
        );
        process.stdout.write(`Seeded: ${t.name}\n`);
    }

    process.stdout.write('Template seeding complete\n');
    await mongoose.disconnect();
}

seedTemplates().catch(err => {
    process.stderr.write(`Seed error: ${err.message}\n`);
    process.exit(1);
});

const {
  generateEcommerceAppJsx,
  generateRestaurantAppJsx,
  generatePortfolioAppJsx,
  generateFitnessAppJsx,
  generateSaaSAppJsx,
  generateRealEstateAppJsx,
  generateCryptoFintechAppJsx,
  generateHealthcareAppJsx
} = require('./reactDomainGenerators.js');

const synthesizeWebsite = (prompt) => {
    const p = (prompt || 'modern landing page').toLowerCase();

    let theme = 'saas';
    let brand = 'Aura';
    let tagline = 'The Next-Generation Intelligent Platform';
    let subline = 'Supercharge your workflow with state-of-the-art automation, seamless integrations, and real-time collaborative workspaces built for high-performance teams.';
    let primary = '#6366f1';
    let secondary = '#ec4899';
    let bg = '#0a0a14';
    let surface = '#121224';
    let heroImg = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';

    if (p.includes('restaurant') || p.includes('cafe') || p.includes('food') || p.includes('bistro') || p.includes('bakery')) {
        theme = 'restaurant';
        brand = 'L’Amour Bistro';
        tagline = 'Artisanal Culinary Excellence & Wine';
        subline = 'Experience farm-to-table culinary artistry crafted with seasonal ingredients, curated vintage pairings, and an unforgettable candlelit atmosphere.';
        primary = '#f59e0b';
        secondary = '#ef4444';
        bg = '#0f0e0d';
        surface = '#1c1917';
        heroImg = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80';
    } else if (p.includes('portfolio') || p.includes('developer') || p.includes('designer') || p.includes('resume')) {
        theme = 'portfolio';
        brand = 'Alex Rivera';
        tagline = 'Digital Craftsman & Creative Technologist';
        subline = 'Designing fluid interactive experiences, robust cloud architectures, and visual systems that empower millions of users worldwide.';
        primary = '#38bdf8';
        secondary = '#818cf8';
        bg = '#0b0f19';
        surface = '#111827';
        heroImg = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80';
    } else if (p.includes('agency') || p.includes('marketing') || p.includes('studio') || p.includes('creative')) {
        theme = 'agency';
        brand = 'Vanguard Creative';
        tagline = 'We Build Market-Dominating Digital Brands';
        subline = 'Award-winning strategy, high-conversion visual design, and web technology engineered to accelerate exponential brand growth.';
        primary = '#a855f7';
        secondary = '#06b6d4';
        bg = '#090812';
        surface = '#161329';
        heroImg = 'https://images.unsplash.com/photo-1522071823999-973e21be55b4?auto=format&fit=crop&w=1200&q=80';
    } else if (p.includes('shop') || p.includes('store') || p.includes('commerce') || p.includes('ecommerce') || p.includes('product')) {
        theme = 'ecommerce';
        brand = 'KURA Goods';
        tagline = 'Elevated Everyday Essentials';
        subline = 'Minimalist aesthetics meet master-grade craftsmanship. Sustainable materials, timeless Japanese silhouettes, and lifetime durability.';
        primary = '#10b981';
        secondary = '#3b82f6';
        bg = '#0c1017';
        surface = '#141d2b';
        heroImg = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80';
    } else if (p.includes('fitness') || p.includes('gym') || p.includes('workout') || p.includes('trainer')) {
        theme = 'fitness';
        brand = 'IRON & SOUL';
        tagline = 'Redefine Human Athletic Potential';
        subline = 'High-performance strength training, precision bio-analytics, and world-class athletic coaching built to unlock peak endurance.';
        primary = '#f43f5e';
        secondary = '#fb923c';
        bg = '#09090b';
        surface = '#18181b';
        heroImg = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80';
    } else if (p.includes('crypto') || p.includes('web3') || p.includes('finance') || p.includes('fintech')) {
        theme = 'fintech';
        brand = 'Nexus Protocol';
        tagline = 'Decentralized Capital, Liquidity & Wealth';
        subline = 'Zero-slippage liquidity routing, cross-chain atomic settlement, and institutional-grade yield optimization on next-generation layer 1 architecture.';
        primary = '#00f2fe';
        secondary = '#4facfe';
        bg = '#050a14';
        surface = '#0c1527';
        heroImg = 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=1200&q=80';
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${brand} — ${tagline}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header class="navbar">
        <div class="nav-container">
            <a href="#" class="logo">
                <span class="logo-mark"></span>
                <span class="logo-text">${brand}</span>
            </a>
            <nav class="nav-menu" id="navMenu">
                <a href="#features" class="nav-link">Features</a>
                <a href="#about" class="nav-link">About</a>
                <a href="#pricing" class="nav-link">Pricing</a>
                <a href="#contact" class="nav-link">Contact</a>
                <a href="#contact" class="btn btn-primary nav-cta">Get Started</a>
            </nav>
            <button class="menu-toggle" id="menuToggle" aria-label="Toggle Navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="hero-bg-glow"></div>
            <div class="container hero-grid">
                <div class="hero-content">
                    <div class="badge">
                        <span class="badge-dot"></span>
                        <span>Next Generation Release v2.4</span>
                    </div>
                    <h1 class="hero-title">${tagline}</h1>
                    <p class="hero-description">${subline}</p>
                    <div class="hero-actions">
                        <a href="#contact" class="btn btn-primary btn-lg">Start Free Trial</a>
                        <a href="#features" class="btn btn-outline btn-lg">Explore Features</a>
                    </div>
                    <div class="hero-stats">
                        <div class="stat-item">
                            <span class="stat-value">99.99%</span>
                            <span class="stat-label">Reliability</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">4.9 / 5</span>
                            <span class="stat-label">Customer Rating</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">120K+</span>
                            <span class="stat-label">Active Users</span>
                        </div>
                    </div>
                </div>
                <div class="hero-visual">
                    <div class="visual-card">
                        <img src="${heroImg}" alt="${brand} hero visual" class="visual-img">
                        <div class="floating-badge top-right">
                            <span class="pulse-indicator"></span>
                            <span>Live Performance: 100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section id="features" class="section features">
            <div class="container">
                <div class="section-header">
                    <span class="section-tag">Capabilities</span>
                    <h2 class="section-title">Engineered for Unmatched Precision</h2>
                    <p class="section-subtitle">Everything you need to build, scale, and deliver world-class digital experiences.</p>
                </div>
                <div class="grid grid-3">
                    <div class="card feature-card">
                        <div class="card-icon">⚡</div>
                        <h3 class="card-title">Instant Execution</h3>
                        <p class="card-desc">Sub-millisecond response latency with our globally distributed edge network and smart caching.</p>
                    </div>
                    <div class="card feature-card">
                        <div class="card-icon">🔒</div>
                        <h3 class="card-title">Bank-Grade Security</h3>
                        <p class="card-desc">End-to-end zero-trust encryption, automated SOC2 compliance auditing, and continuous vulnerability scans.</p>
                    </div>
                    <div class="card feature-card">
                        <div class="card-icon">📊</div>
                        <h3 class="card-title">Deep Analytics</h3>
                        <p class="card-desc">Real-time telemetry, predictive cohort trends, and automated exportable performance intelligence.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="about" class="section about-section">
            <div class="container grid grid-2 items-center">
                <div class="about-visual">
                    <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80" alt="Team collaborating" class="rounded-xl shadow-lg">
                </div>
                <div class="about-content">
                    <span class="section-tag">About Us</span>
                    <h2 class="section-title">Bridging Vision & Flawless Execution</h2>
                    <p class="section-subtitle mb-4">Founded by visionary engineers and digital craftsmen, our mission is to eliminate digital friction and enable extraordinary creative output.</p>
                    <ul class="check-list">
                        <li><span>✓</span> Continuous real-time synchronization across devices</li>
                        <li><span>✓</span> Modular micro-architecture tailored to scale</li>
                        <li><span>✓</span> 24/7 priority enterprise support and dedicated engineering</li>
                    </ul>
                </div>
            </div>
        </section>

        <section id="pricing" class="section pricing-section">
            <div class="container">
                <div class="section-header">
                    <span class="section-tag">Transparent Pricing</span>
                    <h2 class="section-title">Simple Plans for Ambitious Creators</h2>
                    <p class="section-subtitle">No hidden fees. Switch or cancel at any time.</p>
                    <div class="billing-toggle">
                        <span id="monthlyLabel" class="active">Monthly</span>
                        <button class="toggle-btn" id="billingSwitch" aria-label="Toggle annual pricing">
                            <span class="toggle-circle"></span>
                        </button>
                        <span id="annualLabel">Annual (Save 20%)</span>
                    </div>
                </div>
                <div class="grid grid-3 pricing-grid">
                    <div class="card pricing-card">
                        <h3 class="plan-name">Starter</h3>
                        <p class="plan-desc">For individuals and solo creators.</p>
                        <div class="plan-price">
                            <span class="currency">$</span>
                            <span class="amount" data-monthly="19" data-annual="15">19</span>
                            <span class="period">/ mo</span>
                        </div>
                        <ul class="plan-features">
                            <li>✓ Up to 5 Active Workspaces</li>
                            <li>✓ Standard Cloud Generation</li>
                            <li>✓ Basic Community Support</li>
                            <li>✓ Unlimited ZIP Exports</li>
                        </ul>
                        <a href="#contact" class="btn btn-outline btn-block">Choose Starter</a>
                    </div>
                    <div class="card pricing-card popular">
                        <div class="popular-ribbon">Most Popular</div>
                        <h3 class="plan-name">Professional</h3>
                        <p class="plan-desc">For fast-growing builders and agencies.</p>
                        <div class="plan-price">
                            <span class="currency">$</span>
                            <span class="amount" data-monthly="49" data-annual="39">49</span>
                            <span class="period">/ mo</span>
                        </div>
                        <ul class="plan-features">
                            <li>✓ Unlimited Active Projects</li>
                            <li>✓ Priority AI Inference Pipeline</li>
                            <li>✓ Custom Subdomains & Live Hosting</li>
                            <li>✓ Version Snapshots & Restorations</li>
                            <li>✓ 24/7 Dedicated Support</li>
                        </ul>
                        <a href="#contact" class="btn btn-primary btn-block">Get Started</a>
                    </div>
                    <div class="card pricing-card">
                        <h3 class="plan-name">Enterprise</h3>
                        <p class="plan-desc">Custom governance and compliance.</p>
                        <div class="plan-price">
                            <span class="currency">$</span>
                            <span class="amount" data-monthly="149" data-annual="119">149</span>
                            <span class="period">/ mo</span>
                        </div>
                        <ul class="plan-features">
                            <li>✓ Dedicated AI Cluster Isolation</li>
                            <li>✓ Enterprise SLA & Custom Contracts</li>
                            <li>✓ SSO / SAML & Granular RBAC</li>
                            <li>✓ Dedicated Success Architect</li>
                        </ul>
                        <a href="#contact" class="btn btn-outline btn-block">Contact Sales</a>
                    </div>
                </div>
            </div>
        </section>

        <section id="contact" class="section contact-section">
            <div class="container contact-container">
                <div class="card contact-card">
                    <div class="section-header">
                        <span class="section-tag">Get in Touch</span>
                        <h2 class="section-title">Ready to Transform Your Workflow?</h2>
                        <p class="section-subtitle">Reach out today and our specialists will craft a bespoke implementation for your team.</p>
                    </div>
                    <form id="contactForm" class="contact-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="name">Your Name</label>
                                <input type="text" id="name" required placeholder="John Doe">
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" required placeholder="john@domain.com">
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="message">Your Message</label>
                            <textarea id="message" rows="4" required placeholder="Tell us about your project and goals..."></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg btn-block" id="submitBtn">Send Message</button>
                        <div id="formFeedback" class="form-feedback hidden"></div>
                    </form>
                </div>
            </div>
        </section>
    </main>

    <footer class="footer">
        <div class="container footer-content">
            <div class="footer-brand">
                <a href="#" class="logo">
                    <span class="logo-mark"></span>
                    <span class="logo-text">${brand}</span>
                </a>
                <p class="footer-desc">Crafting the foundation of modern digital intelligence and design.</p>
            </div>
            <div class="footer-links">
                <div class="footer-col">
                    <h4>Product</h4>
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#about">About</a>
                </div>
                <div class="footer-col">
                    <h4>Company</h4>
                    <a href="#">Blog</a>
                    <a href="#">Careers</a>
                    <a href="#contact">Contact</a>
                </div>
                <div class="footer-col">
                    <h4>Legal</h4>
                    <a href="#">Privacy</a>
                    <a href="#">Terms</a>
                    <a href="#">Security</a>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; ${new Date().getFullYear()} ${brand}. All rights reserved.</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;

    const css = `:root {
    --primary: ${primary};
    --secondary: ${secondary};
    --bg-base: ${bg};
    --bg-surface: ${surface};
    --bg-card: rgba(255, 255, 255, 0.03);
    --border: rgba(255, 255, 255, 0.08);
    --border-hover: rgba(255, 255, 255, 0.2);
    --text-primary: #f8fafc;
    --text-secondary: #94a3b8;
    --text-muted: #64748b;
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --radius-full: 9999px;
    --font-heading: 'Space Grotesk', system-ui, sans-serif;
    --font-body: 'Plus Jakarta Sans', system-ui, sans-serif;
}

*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

html {
    scroll-behavior: smooth;
    font-family: var(--font-body);
    background-color: var(--bg-base);
    color: var(--text-primary);
    line-height: 1.6;
}

body {
    overflow-x: hidden;
}

a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
}

img {
    max-width: 100%;
    display: block;
}

.container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.grid {
    display: grid;
    gap: 24px;
}

.grid-2 {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}

.grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.items-center {
    align-items: center;
}

.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 22px;
    border-radius: var(--radius-md);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    border: none;
    outline: none;
}

.btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: #ffffff;
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.5);
}

.btn-outline {
    background: transparent;
    color: var(--text-primary);
    border: 1px solid var(--border);
}

.btn-outline:hover {
    border-color: var(--border-hover);
    background: rgba(255, 255, 255, 0.05);
}

.btn-lg {
    padding: 14px 30px;
    font-size: 15px;
    border-radius: var(--radius-md);
}

.btn-block {
    width: 100%;
}

.navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
    backdrop-filter: blur(16px);
    background: rgba(10, 10, 20, 0.75);
    border-bottom: 1px solid var(--border);
    z-index: 100;
}

.nav-container {
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-heading);
    font-size: 18px;
    font-weight: 700;
}

.logo-mark {
    width: 28px;
    height: 28px;
    border-radius: var(--radius-sm);
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    display: inline-block;
}

.nav-menu {
    display: flex;
    align-items: center;
    gap: 28px;
}

.nav-link {
    font-size: 14px;
    color: var(--text-secondary);
}

.nav-link:hover {
    color: var(--text-primary);
}

.menu-toggle {
    display: none;
    background: none;
    border: none;
    cursor: pointer;
    flex-direction: column;
    gap: 5px;
}

.menu-toggle span {
    display: block;
    width: 22px;
    height: 2px;
    background: var(--text-primary);
    transition: 0.3s;
}

.hero {
    position: relative;
    padding: 160px 0 100px;
    overflow: hidden;
}

.hero-bg-glow {
    position: absolute;
    top: 10%;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 500px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.18) 0%, rgba(236, 72, 153, 0.08) 50%, transparent 80%);
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
}

.hero-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 48px;
    align-items: center;
}

.badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: var(--radius-full);
    background: rgba(99, 102, 241, 0.1);
    border: 1px solid rgba(99, 102, 241, 0.25);
    font-size: 12px;
    font-weight: 600;
    color: var(--primary);
    margin-bottom: 20px;
}

.badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--primary);
    box-shadow: 0 0 10px var(--primary);
}

.hero-title {
    font-family: var(--font-heading);
    font-size: clamp(34px, 4.5vw, 56px);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.03em;
    margin-bottom: 20px;
    background: linear-gradient(180deg, #ffffff 30%, #94a3b8 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.hero-description {
    font-size: 16px;
    color: var(--text-secondary);
    line-height: 1.7;
    margin-bottom: 32px;
    max-width: 540px;
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-bottom: 48px;
}

.hero-stats {
    display: flex;
    gap: 36px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
}

.stat-value {
    display: block;
    font-family: var(--font-heading);
    font-size: 24px;
    font-weight: 700;
    color: var(--text-primary);
}

.stat-label {
    font-size: 12px;
    color: var(--text-muted);
}

.hero-visual {
    position: relative;
}

.visual-card {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border);
    background: var(--bg-surface);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.visual-img {
    width: 100%;
    height: 420px;
    object-fit: cover;
}

.floating-badge {
    position: absolute;
    bottom: 24px;
    left: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border-radius: var(--radius-md);
    background: rgba(18, 18, 36, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    font-size: 13px;
    font-weight: 600;
}

.pulse-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    box-shadow: 0 0 10px #10b981;
}

.section {
    padding: 100px 0;
}

.section-header {
    text-align: center;
    max-width: 650px;
    margin: 0 auto 56px;
}

.section-tag {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.1em;
    color: var(--primary);
    margin-bottom: 12px;
    display: block;
}

.section-title {
    font-family: var(--font-heading);
    font-size: clamp(28px, 3.5vw, 42px);
    font-weight: 700;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
}

.section-subtitle {
    font-size: 15px;
    color: var(--text-secondary);
}

.card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    padding: 32px;
    transition: all 0.3s ease;
}

.card:hover {
    border-color: var(--border-hover);
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
}

.feature-card .card-icon {
    font-size: 32px;
    margin-bottom: 20px;
}

.card-title {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 12px;
}

.card-desc {
    font-size: 14px;
    color: var(--text-secondary);
    line-height: 1.6;
}

.rounded-xl {
    border-radius: var(--radius-lg);
    border: 1px solid var(--border);
}

.check-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.check-list li {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: var(--text-secondary);
}

.check-list li span {
    color: var(--primary);
    font-weight: 700;
}

.billing-toggle {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    margin-top: 24px;
    font-size: 14px;
    color: var(--text-secondary);
}

.billing-toggle .active {
    color: var(--text-primary);
    font-weight: 600;
}

.toggle-btn {
    width: 48px;
    height: 26px;
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    position: relative;
    cursor: pointer;
    outline: none;
    transition: background 0.3s ease;
}

.toggle-circle {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #ffffff;
    transition: transform 0.3s ease;
}

.toggle-btn.annual {
    background: var(--primary);
}

.toggle-btn.annual .toggle-circle {
    transform: translateX(22px);
}

.pricing-card {
    position: relative;
    display: flex;
    flex-direction: column;
}

.pricing-card.popular {
    border-color: var(--primary);
    background: rgba(99, 102, 241, 0.05);
}

.popular-ribbon {
    position: absolute;
    top: -12px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: #ffffff;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 4px 14px;
    border-radius: var(--radius-full);
}

.plan-name {
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 6px;
}

.plan-desc {
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 24px;
}

.plan-price {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 28px;
}

.plan-price .currency {
    font-size: 20px;
    font-weight: 600;
}

.plan-price .amount {
    font-family: var(--font-heading);
    font-size: 44px;
    font-weight: 800;
}

.plan-price .period {
    color: var(--text-muted);
    font-size: 14px;
}

.plan-features {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 32px;
    flex-grow: 1;
}

.contact-container {
    max-width: 680px;
}

.contact-card {
    padding: 40px;
}

.contact-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
}

.form-group input,
.form-group textarea {
    background: var(--bg-surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    color: var(--text-primary);
    font-family: inherit;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus {
    border-color: var(--primary);
}

.form-feedback {
    padding: 12px;
    border-radius: var(--radius-sm);
    font-size: 13px;
    text-align: center;
}

.form-feedback.success {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.3);
}

.hidden {
    display: none;
}

.footer {
    border-top: 1px solid var(--border);
    padding: 60px 0 30px;
    background: rgba(10, 10, 20, 0.95);
}

.footer-content {
    display: grid;
    grid-template-columns: 1.5fr 2fr;
    gap: 40px;
    margin-bottom: 40px;
}

.footer-desc {
    font-size: 13px;
    color: var(--text-secondary);
    margin-top: 12px;
    max-width: 320px;
}

.footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
}

.footer-col h4 {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 16px;
}

.footer-col a {
    display: block;
    font-size: 13px;
    color: var(--text-secondary);
    margin-bottom: 10px;
}

.footer-col a:hover {
    color: var(--text-primary);
}

.footer-bottom {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid var(--border);
    font-size: 12px;
    color: var(--text-muted);
}

@media (max-width: 900px) {
    .hero-grid {
        grid-template-columns: 1fr;
    }
    .form-row {
        grid-template-columns: 1fr;
    }
    .footer-content {
        grid-template-columns: 1fr;
    }
    .nav-menu {
        display: none;
        position: absolute;
        top: 72px;
        left: 0;
        right: 0;
        background: var(--bg-surface);
        border-bottom: 1px solid var(--border);
        flex-direction: column;
        padding: 24px;
        gap: 18px;
    }
    .nav-menu.open {
        display: flex;
    }
    .menu-toggle {
        display: flex;
    }
}`;

    const js = `document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
            });
        });
    }

    const billingSwitch = document.getElementById('billingSwitch');
    const monthlyLabel = document.getElementById('monthlyLabel');
    const annualLabel = document.getElementById('annualLabel');
    const priceAmounts = document.querySelectorAll('.plan-price .amount');

    let isAnnual = false;
    if (billingSwitch) {
        billingSwitch.addEventListener('click', () => {
            isAnnual = !isAnnual;
            billingSwitch.classList.toggle('annual', isAnnual);
            if (monthlyLabel && annualLabel) {
                monthlyLabel.classList.toggle('active', !isAnnual);
                annualLabel.classList.toggle('active', isAnnual);
            }
            priceAmounts.forEach(span => {
                const target = isAnnual ? span.getAttribute('data-annual') : span.getAttribute('data-monthly');
                if (target) span.textContent = target;
            });
        });
    }

    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && formFeedback && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                formFeedback.className = 'form-feedback success';
                formFeedback.textContent = 'Thank you! Your message has been received. Our team will contact you shortly.';
                formFeedback.classList.remove('hidden');
                contactForm.reset();
                setTimeout(() => {
                    formFeedback.classList.add('hidden');
                }, 6000);
            }, 900);
        });
    }
});`;

    return {
        projectName: brand,
        description: `${tagline} - ${brand}`,
        framework: 'html',
        files: [
            { operation: 'create', path: 'index.html', content: html, language: 'html' },
            { operation: 'create', path: 'styles.css', content: css, language: 'css' },
            { operation: 'create', path: 'script.js', content: js, language: 'javascript' }
        ],
        summary: `Created complete, fully responsive website for ${brand} with hero showcase, interactive pricing toggle, features grid, contact form, and mobile navigation.`,
        usage: { promptTokenCount: 150, candidatesTokenCount: 1200, totalTokenCount: 1350 }
    };
};

const synthesizeEdit = (prompt, existingFiles) => {
    const p = prompt.toLowerCase();
    const changedFiles = [];
    let summaryText = 'Applied requested modifications.';

    let htmlFile = existingFiles.find(f => f.path === 'index.html' || f.path.endsWith('.html'));
    let cssFile = existingFiles.find(f => f.path === 'styles.css' || f.path.endsWith('.css') || f.path === 'src/index.css');
    let jsFile = existingFiles.find(f => f.path === 'script.js' || f.path.endsWith('.js'));
    let reactAppFile = existingFiles.find(f => f.path === 'src/App.jsx' || f.path.endsWith('App.jsx') || f.path.endsWith('.jsx'));

    // Handle React edits
    if (reactAppFile) {
        let appContent = reactAppFile.content;
        let modified = false;

        if (p.includes('color') || p.includes('theme') || p.includes('palette') || p.includes('gradient')) {
            if (p.includes('emerald') || p.includes('green')) {
                appContent = appContent.replace(/from-[a-z]+-\d+\s+via-[a-z]+-\d+\s+to-[a-z]+-\d+/g, 'from-emerald-400 via-teal-500 to-cyan-600');
                summaryText = 'Updated React UI palette to vibrant emerald and teal gradient.';
                modified = true;
            } else if (p.includes('rose') || p.includes('red') || p.includes('pink') || p.includes('coral')) {
                appContent = appContent.replace(/from-[a-z]+-\d+\s+via-[a-z]+-\d+\s+to-[a-z]+-\d+/g, 'from-rose-500 via-pink-500 to-amber-500');
                summaryText = 'Updated React UI palette to modern rose and coral gradient.';
                modified = true;
            } else if (p.includes('blue') || p.includes('cyan')) {
                appContent = appContent.replace(/from-[a-z]+-\d+\s+via-[a-z]+-\d+\s+to-[a-z]+-\d+/g, 'from-cyan-400 via-sky-500 to-indigo-600');
                summaryText = 'Updated React UI palette to electric cyan and oceanic blue.';
                modified = true;
            } else if (p.includes('purple') || p.includes('violet')) {
                appContent = appContent.replace(/from-[a-z]+-\d+\s+via-[a-z]+-\d+\s+to-[a-z]+-\d+/g, 'from-purple-500 via-indigo-500 to-pink-500');
                summaryText = 'Updated React UI palette to neon purple and indigo gradient.';
                modified = true;
            }
        }

        if (p.includes('dark') || p.includes('light')) {
            if (p.includes('light')) {
                appContent = appContent.replace(/bg-\[#08090d\]/g, 'bg-slate-50 text-slate-900');
                summaryText = 'Applied light mode theme to React application.';
                modified = true;
            } else {
                appContent = appContent.replace(/bg-slate-50/g, 'bg-[#08090d] text-slate-100');
                summaryText = 'Applied sleek dark mode theme with glassmorphic cards.';
                modified = true;
            }
        }

        if (p.includes('button') || p.includes('cta') || p.includes('trial') || p.includes('contact')) {
            appContent = appContent.replace(/(Start Free Trial|Get Started|Join Waitlist)/g, 'Get Started Today 🚀');
            summaryText = 'Enhanced call-to-action buttons in React components.';
            modified = true;
        }

        if (!modified) {
            // General prompt edit applied to headings or tagline
            appContent = appContent.replace(/(<h1[^>]*>)([\s\S]*?)(<\/h1>)/, (m, open, text, close) => {
                return `${open}${text.trim()} ✨${close}`;
            });
            summaryText = `Applied design modifications for: "${prompt.slice(0, 50)}"`;
            modified = true;
        }

        if (modified) {
            changedFiles.push({
                operation: 'update',
                path: reactAppFile.path,
                content: appContent,
                language: 'javascript'
            });
        }

        return {
            files: changedFiles,
            summary: summaryText
        };
    }

    if ((p.includes('color') || p.includes('theme') || p.includes('palette') || p.includes('background') || p.includes('blue') || p.includes('purple') || p.includes('green') || p.includes('dark')) && cssFile) {
        let newCss = cssFile.content;
        if (p.includes('blue') || p.includes('cyan')) {
            newCss = newCss.replace(/--primary:\s*[^;]+;/g, '--primary: #0284c7;');
            newCss = newCss.replace(/--secondary:\s*[^;]+;/g, '--secondary: #38bdf8;');
            summaryText = 'Updated color scheme to vibrant oceanic blue palette.';
        } else if (p.includes('purple') || p.includes('violet')) {
            newCss = newCss.replace(/--primary:\s*[^;]+;/g, '--primary: #8b5cf6;');
            newCss = newCss.replace(/--secondary:\s*[^;]+;/g, '--secondary: #ec4899;');
            summaryText = 'Updated color scheme to neon purple & magenta gradient.';
        } else if (p.includes('green') || p.includes('emerald')) {
            newCss = newCss.replace(/--primary:\s*[^;]+;/g, '--primary: #10b981;');
            newCss = newCss.replace(/--secondary:\s*[^;]+;/g, '--secondary: #06b6d4;');
            summaryText = 'Updated color palette to modern emerald green.';
        } else if (p.includes('red') || p.includes('coral')) {
            newCss = newCss.replace(/--primary:\s*[^;]+;/g, '--primary: #f43f5e;');
            newCss = newCss.replace(/--secondary:\s*[^;]+;/g, '--secondary: #fb923c;');
            summaryText = 'Updated color palette to bold coral & crimson.';
        } else {
            newCss = newCss.replace(/--bg-base:\s*[^;]+;/g, '--bg-base: #06080e;');
            summaryText = 'Enhanced background contrast and deep dark palette.';
        }
        changedFiles.push({
            operation: 'update',
            path: cssFile.path,
            content: newCss,
            language: 'css'
        });
    }

    if ((p.includes('nav') || p.includes('sticky') || p.includes('header')) && cssFile) {
        let newCss = changedFiles.find(f => f.path === cssFile.path)?.content || cssFile.content;
        if (!newCss.includes('position: sticky') && !newCss.includes('position: fixed')) {
            newCss = newCss.replace('.navbar {', '.navbar {\n    position: sticky;\n    top: 0;');
            changedFiles.push({
                operation: 'update',
                path: cssFile.path,
                content: newCss,
                language: 'css'
            });
            summaryText = 'Made the navigation header sticky.';
        }
    }

    if ((p.includes('faq') || p.includes('question') || p.includes('accordion')) && htmlFile) {
        let newHtml = htmlFile.content;
        if (!newHtml.includes('faq-section')) {
            const faqSection = `
        <section id="faq" class="section faq-section">
            <div class="container">
                <div class="section-header">
                    <span class="section-tag">FAQ</span>
                    <h2 class="section-title">Frequently Asked Questions</h2>
                    <p class="section-subtitle">Answers to common inquiries about our platform and services.</p>
                </div>
                <div class="grid grid-2">
                    <div class="card faq-item">
                        <h3 class="card-title">How fast can I get started?</h3>
                        <p class="card-desc">Instantly. Sign up, configure your workspace, and begin generating within seconds.</p>
                    </div>
                    <div class="card faq-item">
                        <h3 class="card-title">Can I export full source code?</h3>
                        <p class="card-desc">Yes, download your entire project as standard HTML/CSS/JS with zero vendor lock-in.</p>
                    </div>
                    <div class="card faq-item">
                        <h3 class="card-title">Is live hosting included?</h3>
                        <p class="card-desc">Every project can be deployed instantly to a high-speed global CDN with one click.</p>
                    </div>
                    <div class="card faq-item">
                        <h3 class="card-title">What support options are available?</h3>
                        <p class="card-desc">All tiers include community and email support, with 24/7 dedicated channels for Pro users.</p>
                    </div>
                </div>
            </div>
        </section>`;
            if (newHtml.includes('</main>')) {
                newHtml = newHtml.replace('</main>', `${faqSection}\n    </main>`);
            } else {
                newHtml += faqSection;
            }
            changedFiles.push({
                operation: 'update',
                path: htmlFile.path,
                content: newHtml,
                language: 'html'
            });
            summaryText = 'Added FAQ accordion section with questions and answers.';
        }
    }

    if (changedFiles.length === 0 && htmlFile) {
        let newHtml = htmlFile.content;
        newHtml = newHtml.replace(/<h1 class="hero-title">([^<]+)<\/h1>/, `<h1 class="hero-title">$1 — Updated</h1>`);
        changedFiles.push({
            operation: 'update',
            path: htmlFile.path,
            content: newHtml,
            language: 'html'
        });
        summaryText = `Applied edits based on: "${prompt}"`;
    }

    return {
        files: changedFiles,
        summary: summaryText
    };
};

const synthesizeReactWebsite = (prompt) => {
    const p = (prompt || 'modern react app').toLowerCase();

    let theme = 'saas';
    let brand = 'Nexus Cloud';
    let tagline = 'The Next-Gen Intelligent Observability Platform';
    let subline = 'Architected with modern React 18 components, reactive state hooks, and high-velocity workflows for high-performance engineering teams.';
    let primary = '#6366f1';
    let secondary = '#a855f7';
    let accentGradient = 'from-indigo-500 via-purple-500 to-pink-500';

    // Extract custom brand name if prompt specifies one e.g. "for Nike", "called Solace", "named Apex"
    const brandMatch = prompt?.match(/(?:called|named|brand(?:\s+is)?|for)\s+["']?([A-Za-z0-9\s&'-]{3,24})["']?/i);
    const customBrand = brandMatch ? brandMatch[1].trim() : null;

    if (p.includes('ecommerce') || p.includes('shop') || p.includes('store') || p.includes('commerce') || p.includes('product') || p.includes('cloth') || p.includes('shoe') || p.includes('sneaker') || p.includes('wear') || p.includes('apparel') || p.includes('buy') || p.includes('cart') || p.includes('retail') || p.includes('jewelry') || p.includes('merch')) {
        theme = 'ecommerce';
        brand = customBrand || 'Lumina Goods';
        tagline = 'Curated Minimalist Gear for Modern Creators';
        subline = 'Precision craftsmanship meets sustainable materials. Lifetime durability, carbon neutral shipping, and timeless Japanese industrial aesthetics.';
        primary = '#10b981';
        secondary = '#06b6d4';
        accentGradient = 'from-emerald-400 via-teal-500 to-cyan-600';
    } else if (p.includes('restaurant') || p.includes('cafe') || p.includes('food') || p.includes('bistro') || p.includes('bakery') || p.includes('dining') || p.includes('bar') || p.includes('coffee') || p.includes('culinary') || p.includes('pizza') || p.includes('pasta') || p.includes('menu') || p.includes('dish') || p.includes('bistrot')) {
        theme = 'restaurant';
        brand = customBrand || 'L’Amour Bistro & Cellar';
        tagline = 'Artisanal Gastronomy & Curated Vintage Pairings';
        subline = 'Experience farm-to-table culinary artistry crafted with seasonal ingredients, wood-fired hearths, and candlelit ambiance.';
        primary = '#f59e0b';
        secondary = '#ea580c';
        accentGradient = 'from-amber-500 via-orange-500 to-amber-700';
    } else if (p.includes('fitness') || p.includes('gym') || p.includes('workout') || p.includes('trainer') || p.includes('crossfit') || p.includes('athlete') || p.includes('training') || p.includes('yoga') || p.includes('sport') || p.includes('athletics')) {
        theme = 'fitness';
        brand = customBrand || 'Apex Athletics';
        tagline = 'Redefine Human Athletic Potential & Strength';
        subline = 'High-performance strength conditioning, biometric recovery testing, and world-class athletic coaching built to unlock peak endurance.';
        primary = '#f43f5e';
        secondary = '#fb923c';
        accentGradient = 'from-rose-500 via-orange-500 to-amber-500';
    } else if (p.includes('real estate') || p.includes('property') || p.includes('realtor') || p.includes('villa') || p.includes('penthouse') || p.includes('mansion') || p.includes('estate') || p.includes('housing') || p.includes('apartment')) {
        theme = 'realestate';
        brand = customBrand || 'Vanderbilt Estates';
        tagline = 'Exceptional Living & Architectural Masterpieces';
        subline = 'Confidential private client representation for world-class architectural residences, penthouses, and waterfront sanctuaries.';
        primary = '#d97706';
        secondary = '#b45309';
        accentGradient = 'from-amber-400 via-amber-500 to-yellow-600';
    } else if (p.includes('crypto') || p.includes('web3') || p.includes('token') || p.includes('wallet') || p.includes('fintech') || p.includes('invest') || p.includes('trading') || p.includes('finance') || p.includes('bank') || p.includes('exchange')) {
        theme = 'fintech';
        brand = customBrand || 'Nexus Protocol';
        tagline = 'Institutional Grade Liquidity & Web3 Intelligence';
        subline = 'Zero-latency execution, multi-chain asset aggregation, and automated cryptographic yield strategies on next-generation layer 1 architecture.';
        primary = '#10b981';
        secondary = '#06b6d4';
        accentGradient = 'from-emerald-400 via-teal-500 to-cyan-500';
    } else if (p.includes('doctor') || p.includes('clinic') || p.includes('hospital') || p.includes('medical') || p.includes('health') || p.includes('dental') || p.includes('telehealth') || p.includes('patient') || p.includes('therapy')) {
        theme = 'healthcare';
        brand = customBrand || 'Apex Health Institute';
        tagline = 'Compassionate Care & World-Class Clinical Excellence';
        subline = 'JCI-accredited specialty medical center offering multi-disciplinary consultations, advanced diagnostics, and 24/7 telehealth.';
        primary = '#06b6d4';
        secondary = '#2563eb';
        accentGradient = 'from-cyan-400 via-sky-500 to-blue-600';
    } else if (p.includes('portfolio') || p.includes('developer') || p.includes('designer') || p.includes('resume') || p.includes('freelance') || p.includes('cv') || p.includes('engineer') || p.includes('personal') || p.includes('architect')) {
        theme = 'portfolio';
        brand = customBrand || 'Alex Rivera';
        tagline = 'Creative Engineer & Full-Stack Architect';
        subline = 'Crafting reactive user interfaces, resilient cloud microservices, and immersive interactive digital experiences for millions worldwide.';
        primary = '#38bdf8';
        secondary = '#818cf8';
        accentGradient = 'from-cyan-400 via-sky-500 to-indigo-600';
    } else if (p.includes('agency') || p.includes('creative') || p.includes('marketing') || p.includes('studio') || p.includes('branding')) {
        theme = 'portfolio';
        brand = customBrand || 'Vanguard Interactive';
        tagline = 'High-Impact Brand Strategies & Digital Systems';
        subline = 'We design and engineer modern web flagships that accelerate growth, capture market authority, and transform visionary brands.';
        primary = '#a855f7';
        secondary = '#06b6d4';
        accentGradient = 'from-purple-500 via-pink-500 to-cyan-500';
    }

    const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${brand} — ${tagline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="src/index.css" />
</head>
<body class="bg-[#08090d] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
  <div id="root"></div>
  <script type="module" src="src/main.jsx"></script>
</body>
</html>`;

    const indexCss = `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --primary: ${primary};
  --secondary: ${secondary};
}

* {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #08090d;
}
::-webkit-scrollbar-thumb {
  background: #1e2235;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #2d334e;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}`;

    const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

    let appJsx;
    if (theme === 'ecommerce') {
        appJsx = generateEcommerceAppJsx({ brand, tagline, subline, primary, secondary, accentGradient });
    } else if (theme === 'restaurant') {
        appJsx = generateRestaurantAppJsx({ brand, tagline, subline, primary, secondary, accentGradient });
    } else if (theme === 'portfolio') {
        appJsx = generatePortfolioAppJsx({ brand, tagline, subline, primary, secondary, accentGradient });
    } else if (theme === 'fitness') {
        appJsx = generateFitnessAppJsx({ brand, tagline, subline, primary, secondary, accentGradient });
    } else if (theme === 'realestate') {
        appJsx = generateRealEstateAppJsx({ brand, tagline, subline, primary, secondary, accentGradient });
    } else if (theme === 'fintech') {
        appJsx = generateCryptoFintechAppJsx({ brand, tagline, subline, primary, secondary, accentGradient });
    } else if (theme === 'healthcare') {
        appJsx = generateHealthcareAppJsx({ brand, tagline, subline, primary, secondary, accentGradient });
    } else {
        appJsx = generateSaaSAppJsx({ brand, tagline, subline, primary, secondary, accentGradient });
    }

    const packageJson = JSON.stringify({
        name: brand.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        private: true,
        version: '0.0.0',
        type: 'module',
        scripts: {
            dev: 'vite',
            build: 'vite build',
            preview: 'vite preview'
        },
        dependencies: {
            react: '^18.3.1',
            'react-dom': '^18.3.1'
        },
        devDependencies: {
            '@vitejs/plugin-react': '^4.3.1',
            vite: '^5.4.0'
        }
    }, null, 2);

    const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()]
});`;

    return {
        projectName: brand,
        description: tagline,
        framework: 'react',
        files: [
            { operation: 'create', path: 'index.html', content: indexHtml, language: 'html' },
            { operation: 'create', path: 'src/App.jsx', content: appJsx, language: 'javascript' },
            { operation: 'create', path: 'src/main.jsx', content: mainJsx, language: 'javascript' },
            { operation: 'create', path: 'src/index.css', content: indexCss, language: 'css' },
            { operation: 'create', path: 'package.json', content: packageJson, language: 'json' },
            { operation: 'create', path: 'vite.config.js', content: viteConfig, language: 'javascript' }
        ],
        summary: 'Synthesized complete React 18 application for ' + brand + ' with interactive state hooks, modular component architecture, and Tailwind CSS.',
        usage: { promptTokenCount: 150, candidatesTokenCount: 1400, totalTokenCount: 1550 }
    };
};

module.exports = { synthesizeWebsite, synthesizeReactWebsite, synthesizeEdit };

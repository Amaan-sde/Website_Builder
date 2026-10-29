const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const { synthesizeWebsite, synthesizeReactWebsite, synthesizeEdit } = require('./syntheticGenerator.js');

let genAI = null;

const getClient = () => {
    const key = process.env.GEMINI_API_KEY;
    if (!key || key === 'your_gemini_api_key_here') {
        return null;
    }
    if (!genAI) {
        genAI = new GoogleGenerativeAI(key);
    }
    return genAI;
};

const fileOperationSchema = {
    type: SchemaType.OBJECT,
    properties: {
        operation: {
            type: SchemaType.STRING,
            enum: ['create', 'update', 'delete'],
            description: 'The file operation to perform'
        },
        path: {
            type: SchemaType.STRING,
            description: 'Relative file path, e.g. index.html or src/styles.css'
        },
        content: {
            type: SchemaType.STRING,
            description: 'Full file content for create/update operations'
        },
        language: {
            type: SchemaType.STRING,
            description: 'Language identifier: html, css, javascript, json'
        }
    },
    required: ['path', 'content']
};

const generationResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
        projectName: {
            type: SchemaType.STRING,
            description: 'A clean, concise project name'
        },
        description: {
            type: SchemaType.STRING,
            description: 'Brief description of the generated website'
        },
        framework: {
            type: SchemaType.STRING,
            enum: ['html', 'react'],
            description: 'Framework used: html or react'
        },
        files: {
            type: SchemaType.ARRAY,
            items: fileOperationSchema,
            description: 'Array of files to create'
        },
        summary: {
            type: SchemaType.STRING,
            description: 'Human-readable summary of what was built'
        }
    },
    required: ['projectName', 'description', 'framework', 'files', 'summary']
};

const editResponseSchema = {
    type: SchemaType.OBJECT,
    properties: {
        files: {
            type: SchemaType.ARRAY,
            items: fileOperationSchema,
            description: 'Only the files that need to change'
        },
        summary: {
            type: SchemaType.STRING,
            description: 'Human-readable description of what changed'
        }
    },
    required: ['files', 'summary']
};

const GENERATION_SYSTEM_PROMPT = `You are an elite web developer building production-quality websites.
Generate complete, working HTML/CSS/JavaScript websites based on user descriptions.
Rules:
- Always generate real, complete, working code — no placeholders, no lorem ipsum for critical content
- Use modern CSS (custom properties, flexbox, grid, clamp for fluid typography)
- Make websites fully responsive (mobile-first)  
- Include smooth micro-animations and hover states
- Use system font stacks or Google Fonts via CDN link tag
- Generate beautiful, premium designs with proper visual hierarchy
- All JavaScript must be vanilla JS — no frameworks in the output
- Split into multiple files: index.html, styles.css, script.js at minimum
- Every image must use a real Unsplash URL relevant to the content
- All navigation links must be functional (smooth scroll or anchor)
- Include a proper meta description and viewport tag
- Ensure proper semantic HTML (header, nav, main, section, footer, article)
- Generate NO code comments in any output file
- Color palettes must be curated and professional — avoid generic primary colors`;

const EDIT_SYSTEM_PROMPT = `You are an elite web developer making precise, targeted edits to an existing website project.
Rules:
- ONLY modify files that need to change for the requested edit
- Do NOT touch files unrelated to the request
- Preserve all existing content not mentioned in the request
- Make minimal, surgical changes
- Maintain the existing design language and code style
- Return only the files that actually changed
- Generate NO code comments in any output file`;

const detectDomainProfile = (prompt) => {
    const p = (prompt || '').toLowerCase();

    if (p.includes('ecommerce') || p.includes('e-commerce') || p.includes('shop') || p.includes('store') || p.includes('cart') || p.includes('cloth') || p.includes('shoe') || p.includes('sneaker') || p.includes('product') || p.includes('apparel') || p.includes('fashion') || p.includes('boutique') || p.includes('merch') || p.includes('retail') || p.includes('checkout') || p.includes('jewelry')) {
        return {
            domain: 'ecommerce',
            name: 'E-Commerce Online Store',
            accentGradient: 'from-emerald-400 via-teal-500 to-cyan-600',
            palette: 'Dark luxury or crisp minimal aesthetics with emerald green (#10b981) or vibrant coral (#f43f5e) accents and dark slate (#080a10) canvas',
            instructions: [
                'MUST implement a complete shopping experience with real product catalog (minimum 6 items with Unsplash photos, prices, ratings, discount badges)',
                'MUST implement category filter buttons (All, Footwear, Apparel, Accessories, etc.) and search filter input with state',
                'MUST implement a slide-over cart drawer with item count badge, quantity (+/-) controls, remove item, subtotal, and promo discount input (e.g. SAVE20)',
                'MUST implement a Checkout modal with shipping address inputs, card fields, and order confirmation celebration screen',
                'MUST implement Wishlist heart state toggle and Quick View product specs modal',
                'CRITICAL: NEVER generate a generic SaaS page with "Start Free Trial" for an e-commerce prompt!'
            ]
        };
    }

    if (p.includes('restaurant') || p.includes('cafe') || p.includes('food') || p.includes('bistro') || p.includes('bakery') || p.includes('dining') || p.includes('bar') || p.includes('coffee') || p.includes('pizza') || p.includes('pasta') || p.includes('culinary') || p.includes('bistrot') || p.includes('menu') || p.includes('table') || p.includes('chef')) {
        return {
            domain: 'restaurant',
            name: 'Artisanal Restaurant & Dining',
            accentGradient: 'from-amber-500 via-orange-500 to-amber-700',
            palette: 'Warm culinary luxury with deep obsidian / espresso canvas (#0d0b09), warm gold and amber accents (#f59e0b, #d97706), and serif typography',
            instructions: [
                'MUST implement a categorized menu with interactive tabs (e.g. Chef Specials, Starters, Handmade Pasta & Mains, Wood-Fired Pizza, Dolci)',
                'MUST include dietary tags on dishes (🌱 Vegan, 🌾 Gluten-Free, ⭐ Signature, 🌶️ Spicy)',
                'MUST implement an interactive Table Reservation modal with guest count (1-8), date/time picker, seating area (Main Dining, Patio, Wine Cellar), and confirmed booking card',
                'MUST implement a Dish Details modal with ingredients and pairing recommendations',
                'CRITICAL: NEVER generate a generic SaaS page for a culinary/restaurant prompt!'
            ]
        };
    }

    if (p.includes('fitness') || p.includes('gym') || p.includes('workout') || p.includes('trainer') || p.includes('crossfit') || p.includes('training') || p.includes('yoga') || p.includes('athletics') || p.includes('athlete') || p.includes('pilates')) {
        return {
            domain: 'fitness',
            name: 'Athletic Gym & High-Performance Fitness',
            accentGradient: 'from-rose-500 via-orange-500 to-amber-500',
            palette: 'High-contrast athletic dark mode: coal/slate 950 canvas (#09090b), electric lime (#84cc16) or high-energy rose/amber accents, bold typography',
            instructions: [
                'MUST implement an interactive weekly class schedule with day switcher (Mon-Sat) showing class names (HIIT, Strength, Yoga, Boxing), intensity, and spots remaining',
                'MUST implement a real-time "Reserve Spot" button on classes with instant confirmation modal/toast',
                'MUST implement an interactive membership pricing calculator with Monthly vs Annual billing toggle (saving 20%)',
                'MUST include trainer/coach showcase with credentials, specialties, and bio modals',
                'CRITICAL: NEVER generate a generic SaaS page for a fitness/gym prompt!'
            ]
        };
    }

    if (p.includes('real estate') || p.includes('property') || p.includes('realtor') || p.includes('villa') || p.includes('penthouse') || p.includes('mansion') || p.includes('estate') || p.includes('housing') || p.includes('apartment')) {
        return {
            domain: 'realestate',
            name: 'Luxury Real Estate & Architectural Properties',
            accentGradient: 'from-amber-400 via-amber-500 to-yellow-600',
            palette: 'Sophisticated architectural luxury: deep navy/charcoal canvas (#070a12), warm champagne gold (#eab308) and slate accents, spacious elegant layouts',
            instructions: [
                'MUST implement luxury property listings with category filters (Modern Villas, Penthouses, Seaside Estates, Alpine Chalets) and price filter slider',
                'MUST implement an interactive Monthly Mortgage Calculator slider widget (Home Price, Down Payment %, Loan Term -> live monthly payment calculation)',
                'MUST implement a "Schedule Private VIP Tour" booking modal with calendar date, time slot, and confirmed tour pass voucher',
                'MUST implement property specs modal with bed, bath, and square footage details',
                'CRITICAL: NEVER generate a generic SaaS page for a real estate prompt!'
            ]
        };
    }

    if (p.includes('crypto') || p.includes('web3') || p.includes('token') || p.includes('wallet') || p.includes('fintech') || p.includes('invest') || p.includes('trading') || p.includes('finance') || p.includes('bank') || p.includes('exchange')) {
        return {
            domain: 'fintech',
            name: 'Decentralized Finance & Next-Gen Fintech',
            accentGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
            palette: 'High-tech dark glassmorphism: obsidian canvas (#050811), cyber emerald (#10b981) and neon cyan glowing accents, monospace telemetry',
            instructions: [
                'MUST implement a live ticker tape bar with simulated prices (BTC, ETH, SOL, AVAX) and positive/negative percentages',
                'MUST implement an interactive Token Swap engine (swap USD/ETH with live conversion rate, slippage tolerance settings, and swap success modal)',
                'MUST implement an interactive Portfolio asset allocation breakdown (ETH, BTC, SOL) with total value and 24h P&L',
                'MUST implement a recent transaction ledger with status filters (Completed, Pending)',
                'CRITICAL: NEVER generate a generic landing page for a fintech/crypto prompt!'
            ]
        };
    }

    if (p.includes('doctor') || p.includes('clinic') || p.includes('hospital') || p.includes('medical') || p.includes('health') || p.includes('dental') || p.includes('telehealth') || p.includes('patient') || p.includes('therapy')) {
        return {
            domain: 'healthcare',
            name: 'Specialty Medical Center & Telehealth',
            accentGradient: 'from-cyan-400 via-sky-500 to-blue-600',
            palette: 'Clean, trustworthy clinical design: deep slate canvas (#080d1a), crisp medical cyan (#06b6d4) and sapphire blue accents',
            instructions: [
                'MUST implement a physician directory with department filter tabs (Cardiology, Dermatology, Neurology, Orthopedics, Pediatrics)',
                'MUST implement an interactive "Book Consultation" wizard with doctor selection, preferred date/time slot, and confirmed appointment pass',
                'MUST include 24/7 emergency telehealth triage banner and clinical trust badges (JCI, HIPAA)',
                'CRITICAL: NEVER generate a generic SaaS page for a clinic/hospital prompt!'
            ]
        };
    }

    if (p.includes('portfolio') || p.includes('developer') || p.includes('designer') || p.includes('resume') || p.includes('freelance') || p.includes('cv') || p.includes('engineer') || p.includes('personal') || p.includes('agency') || p.includes('studio')) {
        return {
            domain: 'portfolio',
            name: 'Creative Technologist & Design Studio Portfolio',
            accentGradient: 'from-cyan-400 via-sky-500 to-indigo-600',
            palette: 'Bold editorial minimalism: stark dark canvas (#07090e), electric violet or neon cyan accents, oversized typography, sleek showcase cards',
            instructions: [
                'MUST implement filterable case studies by domain (Full-Stack, Mobile UX, AI Systems, Design Systems)',
                'MUST implement an interactive case study detail modal with architecture stack and metrics',
                'MUST implement an interactive skills matrix with proficiency badges',
                'MUST implement a project inquiry estimator with budget range selector'
            ]
        };
    }

    return {
        domain: 'saas',
        name: 'Next-Gen Intelligent SaaS Platform',
        accentGradient: 'from-indigo-500 via-purple-500 to-pink-500',
        palette: 'Modern dark obsidian canvas (#08090d), vibrant indigo and purple gradients (#6366f1, #a855f7), glassmorphism cards',
        instructions: [
            'MUST implement interactive live telemetry dashboard with time window switcher (24h, 7d, 30d, 1y) updating ARR, active nodes, and P99 latency',
            'MUST implement interactive pricing tiers with Monthly vs Annual billing toggle (saving 20%)',
            'MUST implement interactive feature matrix with toggleable views',
            'MUST make all buttons, tabs, and filters truly interactive with React state'
        ]
    };
};

const generateWebsite = async (prompt, framework = 'react', timeoutMs = 60000) => {
    const client = getClient();
    if (!client) {
        return framework === 'react' ? synthesizeReactWebsite(prompt) : synthesizeWebsite(prompt);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const modelNames = [process.env.GEMINI_MODEL || 'gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
    const isReact = framework === 'react';
    const domainProfile = detectDomainProfile(prompt);

    const systemInstruction = isReact
        ? `You are an elite React engineer building production-grade web applications.
Generate complete, working React 18 applications with modern modular components and Tailwind CSS.
Domain Application Target: ${domainProfile.name}
Visual Identity & Palette: ${domainProfile.palette}

Procedural Requirements:
1. Generate real, production-ready code with no placeholders or lorem ipsum.
2. Index.html: Include Tailwind CDN, Plus Jakarta Sans font, title tag, and <div id="root"></div>.
3. In src/App.jsx, implement realistic, working interactive state machines (useState, useMemo):
${domainProfile.instructions.map(ins => '   - ' + ins).join('\n')}
4. Define: const accentGradient = '${domainProfile.accentGradient}'; inside App() to avoid ReferenceError.
5. Create src/main.jsx with ReactDOM createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
6. Create src/index.css with modern design variables and custom scrollbar.
7. Create package.json with standard Vite React scripts and dependencies.
8. Use Tailwind utility classes extensively for glassmorphism, responsive grids, and gradients.
9. Make all navigation links, buttons, drawers, and modals interactive with real state or smooth scroll.
10. Generate NO code comments in any file.`
        : GENERATION_SYSTEM_PROMPT;

    const fullPrompt = isReact
        ? `Create a complete React 18 application for: "${prompt}"

Target Domain: ${domainProfile.name}
Bespoke Palette: ${domainProfile.palette}

Follow the full engineering procedure:
- UX Architecture: ${domainProfile.instructions[0]}
- State & Interactivity: Include working modals, state hooks, tabs, and workflows.
- Generate index.html, src/App.jsx, src/main.jsx, src/index.css, and package.json.
- Make it visually breathtaking with Tailwind CSS, responsive layouts, and interactive state.`
        : `Create a complete website: ${prompt}\n\nGenerate all necessary files (index.html, styles.css, script.js, and any additional files).\nMake it visually stunning, fully responsive, and production-ready.`;

    for (const modelName of modelNames) {
        try {
            const model = client.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: generationResponseSchema,
                    temperature: 0.7,
                    maxOutputTokens: 16384
                },
                systemInstruction
            }, { timeout: 45000 });

            const result = await model.generateContent(fullPrompt);
            clearTimeout(timer);

            const text = result.response.text();
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch (_) {
                const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*$/gi, '').trim();
                parsed = JSON.parse(cleaned);
            }

            if (!parsed.files || !Array.isArray(parsed.files)) {
                continue;
            }

            const cleanFiles = parsed.files.map(f => ({
                operation: f.operation || 'create',
                path: (f.path || '').replace(/^[./\\]+/, ''),
                content: f.content || f.code || f.file_content || '',
                language: f.language || (f.path?.endsWith('.jsx') ? 'javascript' : f.path?.endsWith('.css') ? 'css' : 'html')
            })).filter(f => f.path && f.content && f.content.trim().length > 0);

            if (cleanFiles.length === 0) {
                continue;
            }

            return {
                projectName: parsed.projectName || 'My Project',
                description: parsed.description || '',
                framework: parsed.framework || (isReact ? 'react' : 'html'),
                files: cleanFiles,
                summary: parsed.summary || 'Generated application files.',
                usage: result.response.usageMetadata
            };
        } catch (err) {
            console.warn(`[GeminiService] Model ${modelName} generation failed:`, err.message);
            continue;
        }
    }
    clearTimeout(timer);
    console.info('[GeminiService] AI generation fell back to synthetic generator');
    return isReact ? synthesizeReactWebsite(prompt) : synthesizeWebsite(prompt);
};

const editWebsite = async (prompt, existingFiles, conversationHistory = [], timeoutMs = 60000) => {
    const client = getClient();
    if (!client) {
        return synthesizeEdit(prompt, existingFiles);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const modelNames = [process.env.GEMINI_MODEL || 'gemini-3.5-flash', 'gemini-3.5-flash'];
    const relevantFiles = selectRelevantFiles(existingFiles, prompt);
    const fileContext = relevantFiles.map(f => `=== ${f.path} ===\n${f.content}`).join('\n\n');
    const historyContext = conversationHistory.slice(-6).map(m => `${m.role}: ${m.content}`).join('\n');
    const fullPrompt = `Current project files:\n${fileContext}\n\nRecent conversation:\n${historyContext}\n\nUser request: ${prompt}\n\nReturn only the files that need to change.`;

    for (const modelName of modelNames) {
        try {
            const model = client.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: editResponseSchema,
                    temperature: 0.5,
                    maxOutputTokens: 16384
                },
                systemInstruction: EDIT_SYSTEM_PROMPT
            }, { timeout: 40000 });

            const result = await model.generateContent(fullPrompt);
            clearTimeout(timer);

            const text = result.response.text();
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch (_) {
                const cleaned = text.replace(/```(?:json)?\s*/gi, '').replace(/```\s*$/gi, '').trim();
                parsed = JSON.parse(cleaned);
            }

            if (!parsed.files || !Array.isArray(parsed.files)) {
                continue;
            }

            const cleanFiles = parsed.files.map(f => ({
                operation: f.operation || 'update',
                path: (f.path || '').replace(/^[./\\]+/, ''),
                content: f.content || f.code || f.file_content || '',
                language: f.language || (f.path?.endsWith('.jsx') ? 'javascript' : f.path?.endsWith('.css') ? 'css' : 'html')
            })).filter(f => f.path && (f.operation === 'delete' || (f.content && f.content.trim().length > 0)));

            if (cleanFiles.length === 0) {
                continue;
            }

            return {
                files: cleanFiles,
                summary: parsed.summary || 'Applied requested edits.',
                usage: result.response.usageMetadata
            };
        } catch (err) {
            console.warn(`[GeminiService] Model ${modelName} edit failed:`, err.message);
            continue;
        }
    }
    clearTimeout(timer);
    console.info('[GeminiService] AI edit fell back to synthetic edit generator');
    return synthesizeEdit(prompt, existingFiles);
};

const selectRelevantFiles = (files, prompt) => {
    const lower = prompt.toLowerCase();
    const styleKeywords = ['color', 'style', 'font', 'background', 'theme', 'dark', 'light', 'spacing', 'padding', 'margin'];
    const scriptKeywords = ['button', 'click', 'animation', 'toggle', 'menu', 'modal', 'form', 'submit', 'validate'];
    const htmlKeywords = ['section', 'layout', 'header', 'footer', 'nav', 'hero', 'card', 'content', 'text', 'heading'];

    const wantsStyle = styleKeywords.some(k => lower.includes(k));
    const wantsScript = scriptKeywords.some(k => lower.includes(k));
    const wantsHtml = htmlKeywords.some(k => lower.includes(k));

    return files.filter(f => {
        const ext = f.path.split('.').pop();
        if (ext === 'html' && (wantsHtml || (!wantsStyle && !wantsScript))) return true;
        if (ext === 'css' && (wantsStyle || (!wantsScript))) return true;
        if ((ext === 'js' || ext === 'javascript') && wantsScript) return true;
        if (files.length <= 5) return true;
        return false;
    });
};

module.exports = { generateWebsite, editWebsite };

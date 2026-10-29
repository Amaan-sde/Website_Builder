const Project = require('../models/project.model.js');
const ProjectFile = require('../models/projectFile.model.js');
const ProjectVersion = require('../models/projectVersion.model.js');

const bundleWebsite = (files, framework) => {
    const fileMap = {};
    files.forEach(f => {
        fileMap[f.path] = f.content || '';
    });

    const isReact = framework === 'react' || Object.keys(fileMap).some(p => p.endsWith('.jsx'));
    if (!isReact) {
        let html = fileMap['index.html'] || fileMap['/index.html'] || '';
        if (!html) {
            return '<!DOCTYPE html><html><body style="font-family:sans-serif;background:#0a0a14;color:#f8fafc;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><h2>Site index.html not found</h2></body></html>';
        }

        html = html.replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi, (match) => {
            const hrefMatch = match.match(/href=["']([^"']+)["']/i);
            if (!hrefMatch) return match;
            const href = hrefMatch[1].replace(/^\.\//, '').replace(/^\//, '');
            if (fileMap[href] !== undefined) {
                return `<style data-bundle="${href}">\n${fileMap[href]}\n</style>`;
            }
            return match;
        });

        html = html.replace(/<script\s+[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (match, src) => {
            if (/^https?:\/\//i.test(src) || src.startsWith('//')) {
                return match;
            }
            const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
            if (fileMap[cleanSrc] !== undefined) {
                return `<script data-bundle="${cleanSrc}">\n${fileMap[cleanSrc]}\n<\/script>`;
            }
            return match;
        });

        if (fileMap['styles.css'] && !html.includes('data-bundle="styles.css"')) {
            if (html.includes('</head>')) {
                html = html.replace('</head>', `<style data-bundle="styles.css">\n${fileMap['styles.css']}\n</style></head>`);
            } else {
                html = `<style data-bundle="styles.css">\n${fileMap['styles.css']}\n</style>` + html;
            }
        }

        if (fileMap['script.js'] && !html.includes('data-bundle="script.js"')) {
            if (html.includes('</body>')) {
                html = html.replace('</body>', `<script data-bundle="script.js">\n${fileMap['script.js']}\n<\/script></body>`);
            } else {
                html += `<script data-bundle="script.js">\n${fileMap['script.js']}\n<\/script>`;
            }
        }

        return html;
    }

    const cssContent = fileMap['src/index.css'] || fileMap['index.css'] || fileMap['styles.css'] || fileMap['src/styles.css'] || '';

    const jsxFiles = Object.keys(fileMap).filter(k => (k.endsWith('.jsx') || k.endsWith('.js')) && !k.includes('vite.config'));
    jsxFiles.sort((a, b) => {
        if (a.toLowerCase().includes('main') || a.toLowerCase().includes('index.')) return 1;
        if (b.toLowerCase().includes('main') || b.toLowerCase().includes('index.')) return -1;
        if (a.toLowerCase().includes('app.')) return 1;
        if (b.toLowerCase().includes('app.')) return -1;
        return 0;
    });

    let combinedJsx = '';
    for (const p of jsxFiles) {
        if (p.toLowerCase().includes('main.') && jsxFiles.some(f => f.toLowerCase().includes('app.'))) continue;
        let c = fileMap[p] || '';
        c = c.replace(/import\s+React(?:\s*,\s*\{[^}]*\})?\s+from\s+['"][^'"]+['"];?/g, '');
        c = c.replace(/import\s+\{[^}]*\}\s+from\s+['"](?:react|react-dom|react-dom\/client)['"];?/g, '');
        c = c.replace(/import\s*\{([^}]+)\}\s*from\s*['"][^'"]*lucide-react['"];?/g, 'const { $1 } = window.LucideProxy;');
        c = c.replace(/import\s+([A-Za-z0-9_]+)\s+from\s*['"][^'"]*lucide-react['"];?/g, 'const $1 = window.LucideProxy.$1;');
        c = c.replace(/import\s+[^;]+from\s+['"][^'"]*lucide-react['"];?/g, '');
        c = c.replace(/import\s+[^;]+from\s+['"][^'"]*(?:framer-motion|motion\/react)['"];?/g, '');
        c = c.replace(/import\s+['"][^'"]+\.css['"];?/g, '');
        c = c.replace(/import\s+[\w\s{},*]+\s+from\s+['"][^'"]+['"];?/g, '');
        c = c.replace(/export\s+default\s+function\s+([A-Za-z0-9_]+)/g, 'function $1');
        c = c.replace(/export\s+default\s+function\s*\(/g, 'function App(');
        c = c.replace(/export\s+default\s+/g, 'const App = ');
        c = c.replace(/export\s+(const|let|var|function)\s+/g, '$1 ');
        combinedJsx += '\n' + c + '\n';
    }

    let htmlTemplate = fileMap['index.html'] || fileMap['/index.html'] || '';
    const titleMatch = htmlTemplate.match(/<title>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1] : 'React Live Preview';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${pageTitle}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            primary: '#6366f1',
            secondary: '#a855f7',
            accent: '#06b6d4'
          },
          fontFamily: {
            sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          }
        }
      }
    };
  </script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; padding: 0; background-color: #08090d; }
    ${cssContent}
  </style>
</head>
<body class="bg-[#08090d] text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
  <div id="root"></div>
  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer, createContext, Fragment, forwardRef } = React;

    // Bulletproof Lucide SVG Icon Catalog
    const LUCIDE_PATHS = {
      Sparkles: '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>',
      ArrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
      ArrowLeft: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
      Check: '<path d="M20 6 9 17l-5-5"/>',
      CheckCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
      CheckCircle2: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
      Star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
      Zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
      Shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
      Menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
      X: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
      ChevronRight: '<path d="m9 18 6-6-6-6"/>',
      ChevronDown: '<path d="m6 9 6 6 6-6"/>',
      ChevronLeft: '<path d="m15 18-6-6 6-6"/>',
      ChevronUp: '<path d="m18 15-6-6-6 6"/>',
      Search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
      ExternalLink: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/>',
      Code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
      Globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
      User: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
      Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
      Heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
      Copy: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
      Flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
      Rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
      Lock: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
      Mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
      Phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
      Github: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
      Layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.9a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.65-8.58 3.9a2 2 0 0 1-1.66 0L2 12.65"/><path d="m22 17.65-8.58 3.9a2 2 0 0 1-1.66 0L2 17.65"/>',
      Play: '<polygon points="6 3 20 12 6 21 6 3"/>',
      RefreshCw: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
      Send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
      ShoppingBag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
      ShoppingCart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
      Plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
      Minus: '<path d="M5 12h14"/>',
      Trash2: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>',
      Truck: '<rect width="16" height="13" x="1" y="6" rx="2"/><polygon points="17 8 20 8 23 11 23 16 17 16 17 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>',
      ShieldCheck: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/>',
      SlidersHorizontal: '<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
      Filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
      Calendar: '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
      Clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
      MapPin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
      CreditCard: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
      TrendingUp: '<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>'
    };

    function createLucideIcon(name) {
      return forwardRef(function LucideIconComponent({ size = 20, className = '', strokeWidth = 2, color = 'currentColor', style = {}, ...props }, ref) {
        const rawSvg = LUCIDE_PATHS[name] || '<polygon points=\"12 2 15 9 22 12 15 15 12 22 9 15 2 12 9 9 12 2\"/>';
        return (
          <svg
            ref={ref}
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
            dangerouslySetInnerHTML={{ __html: rawSvg }}
            {...props}
          />
        );
      });
    }

    // Expose all icon identifiers into global window scope
    const lucideIcons = {};
    for (const key of Object.keys(LUCIDE_PATHS)) {
      window[key] = createLucideIcon(key);
      lucideIcons[key] = window[key];
    }

    // Universal proxy for any other PascalCase icon
    window.LucideProxy = new Proxy(lucideIcons, {
      get(target, prop) {
        if (!target[prop] && typeof prop === 'string' && /^[A-Z]/.test(prop)) {
          target[prop] = createLucideIcon(prop);
          window[prop] = target[prop];
        }
        return target[prop] || createLucideIcon('Sparkles');
      }
    });

    // Framer motion proxy
    const motion = new Proxy({}, {
      get(target, prop) {
        return forwardRef(function MotionShim({ initial, animate, transition, whileHover, whileTap, whileInView, exit, ...props }, ref) {
          return React.createElement(prop, { ref, ...props });
        });
      }
    });
    const AnimatePresence = ({ children }) => React.createElement(React.Fragment, null, children);

    // Global theme variables to prevent ReferenceError in AI-generated components
    window.accentGradient = 'from-indigo-500 via-purple-500 to-pink-500';
    window.primary = '#6366f1';
    window.secondary = '#a855f7';
    window.brand = 'Nexus AI';

    // Error Boundary
    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      componentDidCatch(error, info) {
        console.error("Preview caught error:", error, info);
      }
      render() {
        if (this.state.hasError) {
          return (
            <div style={{ padding: '32px', color: '#f87171', background: '#0f172a', minHeight: '100vh', fontFamily: 'sans-serif' }}>
              <div style={{ maxWidth: '600px', margin: '40px auto', background: '#1e293b', padding: '24px', borderRadius: '16px', border: '1px solid #ef4444' }}>
                <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: 'bold' }}>⚠️ Render Error in Preview</h2>
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#cbd5e1' }}>{this.state.error?.message || 'An error occurred while mounting this component.'}</p>
                <button
                  onClick={() => this.setState({ hasError: false, error: null })}
                  style={{ background: '#6366f1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
                >
                  Retry Render
                </button>
              </div>
            </div>
          );
        }
        return this.props.children;
      }
    }

    // Injected React Application Source Code
    ${combinedJsx}

    // Mount to DOM
    const mountNode = document.getElementById('root');
    if (mountNode) {
      const TargetComponent = typeof App !== 'undefined' ? App : () => (
        <div className="min-h-screen flex items-center justify-center p-6 text-slate-400 font-mono text-sm">
          No default App component found. Export default function App() to preview.
        </div>
      );
      const root = ReactDOM.createRoot(mountNode);
      root.render(
        <ErrorBoundary>
          <TargetComponent />
        </ErrorBoundary>
      );
    }
  </script>
</body>
</html>`;
};

exports.deployProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const files = await ProjectFile.find({ project: project._id }).lean();
        if (files.length === 0) {
            return res.status(400).json({ message: 'Cannot deploy an empty project' });
        }

        const host = req.get('host');
        const protocol = req.protocol;
        const liveUrl = `${protocol}://${host}/site/${project._id}`;

        project.status = 'published';
        project.isPublic = true;
        project.deploymentUrl = liveUrl;
        project.deploymentProvider = 'genweb-edge';
        project.lastEditedAt = new Date();
        await project.save();

        await ProjectVersion.create({
            project: project._id,
            label: `Deployment ${new Date().toLocaleDateString()}`,
            snapshot: files.map(f => ({ path: f.path, content: f.content, language: f.language })),
            triggeredBy: 'deploy'
        });

        return res.json({
            message: 'Website deployed successfully',
            deploymentUrl: liveUrl,
            project
        });
    } catch (err) {
        return res.status(500).json({ message: 'Deployment failed' });
    }
};

exports.unpublishProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        project.status = 'draft';
        project.isPublic = false;
        project.deploymentUrl = null;
        await project.save();

        return res.json({ message: 'Project unpublished', project });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to unpublish project' });
    }
};

exports.servePublicSite = async (req, res) => {
    try {
        const { id, assetPath } = req.params;
        const project = await Project.findById(id).lean();

        if (!project) {
            return res.status(404).send(renderErrorPage('404 Not Found', 'The requested website does not exist.'));
        }

        if (project.status !== 'published' && !project.isPublic) {
            return res.status(403).send(renderErrorPage('Site Unpublished', 'This website is currently private or in draft mode.'));
        }

        const files = await ProjectFile.find({ project: project._id }).lean();
        if (files.length === 0) {
            return res.status(404).send(renderErrorPage('No Content', 'This website does not have any published files yet.'));
        }

        if (!assetPath || assetPath === 'index.html') {
            const bundledHtml = bundleWebsite(files, project.framework);
            res.setHeader('Content-Type', 'text/html; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=30');
            return res.send(bundledHtml);
        }

        const cleanPath = assetPath.replace(/^\//, '');
        const targetFile = files.find(f => f.path === cleanPath || f.path === `/${cleanPath}`);

        if (!targetFile) {
            return res.status(404).send('Asset not found');
        }

        const mimeTypes = {
            css: 'text/css; charset=utf-8',
            js: 'application/javascript; charset=utf-8',
            json: 'application/json; charset=utf-8',
            html: 'text/html; charset=utf-8'
        };
        const ext = cleanPath.split('.').pop().toLowerCase();
        res.setHeader('Content-Type', mimeTypes[ext] || 'text/plain; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=120');
        return res.send(targetFile.content);
    } catch (err) {
        return res.status(500).send(renderErrorPage('Server Error', 'Failed to render published site.'));
    }
};

const renderErrorPage = (title, message) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} — GenWeb</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #080810;
            color: #f8fafc;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }
        .card {
            background: #121224;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 40px;
            max-width: 440px;
            text-align: center;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        h1 { font-size: 24px; margin-bottom: 12px; }
        p { color: #94a3b8; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }
        a {
            display: inline-block;
            background: #6366f1;
            color: #fff;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="card">
        <h1>${title}</h1>
        <p>${message}</p>
        <a href="http://localhost:5173">Back to GenWeb</a>
    </div>
</body>
</html>`;

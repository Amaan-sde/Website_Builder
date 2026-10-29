import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import {
    Play, Eye, Code2, Columns, Smartphone, Tablet, Monitor,
    RotateCw, ExternalLink, Download, Rocket, Sparkles, Send,
    Save, FileCode, Folder, FolderOpen, ChevronRight, ChevronDown,
    Check, Copy, History, X, MessageSquare, Layers, Settings,
    ArrowLeft, CheckCircle2, AlertCircle, Terminal, Globe, Search,
    PanelLeftClose, PanelLeftOpen
} from 'lucide-react';

const VIEW_MODE = { SPLIT: 'split', PREVIEW: 'preview', CODE: 'code' };
const VIEWPORT = { desktop: '100%', tablet: '768px', mobile: '375px' };

const LANG_MAP = {
    html: 'html', css: 'css', javascript: 'javascript',
    js: 'javascript', jsx: 'javascript', ts: 'typescript',
    tsx: 'typescript', json: 'json', md: 'markdown'
};

const detectLang = (path) => {
    const ext = path?.split('.').pop() || 'html';
    return LANG_MAP[ext] || 'plaintext';
};

const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ago`;
};

// Rock-solid React 18 & HTML5 Preview Bundler
const bundlePreviewHtml = (fileContentsMap, framework) => {
    const isReact = framework === 'react' || Object.keys(fileContentsMap).some(p => p.endsWith('.jsx'));

    if (!isReact) {
        let html = fileContentsMap['index.html'] || fileContentsMap['/index.html'] || '';
        if (!html) {
            return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;background:#08090d;color:#94a3b8;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;"><div style="text-align:center;"><h2 style="color:#e2e8f0;margin-bottom:8px;">No index.html found</h2><p style="font-size:14px;color:#64748b;">Create or generate an index.html file to view live preview</p></div></body></html>`;
        }

        html = html.replace(/<link\s+[^>]*rel=["']stylesheet["'][^>]*>/gi, (match) => {
            const hrefMatch = match.match(/href=["']([^"']+)["']/i);
            if (!hrefMatch) return match;
            const href = hrefMatch[1].replace(/^\.\//, '').replace(/^\//, '');
            const cssContent = fileContentsMap[href];
            if (cssContent !== undefined) {
                return `<style data-inlined="${href}">\n${cssContent}\n</style>`;
            }
            return match;
        });

        html = html.replace(/<script\s+[^>]*src=["']([^"']+)["'][^>]*>\s*<\/script>/gi, (match, src) => {
            if (/^https?:\/\//i.test(src) || src.startsWith('//')) return match;
            const cleanSrc = src.replace(/^\.\//, '').replace(/^\//, '');
            const jsContent = fileContentsMap[cleanSrc];
            if (jsContent !== undefined) {
                return `<script data-inlined="${cleanSrc}">\n${jsContent}\n<\/script>`;
            }
            return match;
        });

        if (fileContentsMap['styles.css'] && !html.includes('data-inlined="styles.css"')) {
            html = html.includes('</head>')
                ? html.replace('</head>', `<style data-inlined="styles.css">\n${fileContentsMap['styles.css']}\n</style></head>`)
                : `<style data-inlined="styles.css">\n${fileContentsMap['styles.css']}\n</style>` + html;
        }

        if (fileContentsMap['script.js'] && !html.includes('data-inlined="script.js"')) {
            html = html.includes('</body>')
                ? html.replace('</body>', `<script data-inlined="script.js">\n${fileContentsMap['script.js']}\n<\/script></body>`)
                : html + `<script data-inlined="script.js">\n${fileContentsMap['script.js']}\n<\/script>`;
        }

        return html;
    }

    const cssContent = fileContentsMap['src/index.css'] || fileContentsMap['index.css'] || fileContentsMap['styles.css'] || fileContentsMap['src/styles.css'] || '';

    const jsxFiles = Object.keys(fileContentsMap).filter(k => (k.endsWith('.jsx') || k.endsWith('.js')) && !k.includes('vite.config'));
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
        let c = fileContentsMap[p] || '';
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

    let htmlTemplate = fileContentsMap['index.html'] || fileContentsMap['/index.html'] || '';
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

  <div id="compile-error-banner" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:#090d16;color:#f87171;padding:32px;font-family:system-ui;z-index:99999;overflow:auto;">
    <div style="max-width:700px;margin:40px auto;background:#131b2e;padding:24px;border-radius:16px;border:1px solid #ef4444;box-shadow:0 25px 50px rgba(0,0,0,0.5);">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
        <span style="font-size:24px;">⚠️</span>
        <h2 style="margin:0;font-size:18px;font-weight:700;color:#fca5a5;">Compilation Error in Preview</h2>
      </div>
      <pre id="compile-error-text" style="font-family:monospace;background:#060a12;padding:16px;border-radius:10px;font-size:13px;line-height:1.5;white-space:pre-wrap;color:#fecaca;overflow-x:auto;"></pre>
      <div style="margin-top:20px;display:flex;gap:12px;">
        <button onclick="window.location.reload()" style="background:#6366f1;color:#fff;border:none;padding:8px 16px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;">
          Retry Preview
        </button>
      </div>
    </div>
  </div>

  <script>
    window.addEventListener('error', function(e) {
      const banner = document.getElementById('compile-error-banner');
      const text = document.getElementById('compile-error-text');
      if (banner && text) {
        banner.style.display = 'block';
        text.innerText = (e.message || 'Syntax/runtime error') + (e.lineno ? '\\nLine: ' + e.lineno + ':' + e.colno : '');
      }
    });
  </script>

  <script type="text/babel">
    const { useState, useEffect, useRef, useMemo, useCallback, useContext, useReducer, createContext, Fragment, forwardRef } = React;

    // Universal Lucide SVG Catalog
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

    const lucideIcons = {};
    for (const key of Object.keys(LUCIDE_PATHS)) {
      window[key] = createLucideIcon(key);
      lucideIcons[key] = window[key];
    }

    window.LucideProxy = new Proxy(lucideIcons, {
      get(target, prop) {
        if (!target[prop] && typeof prop === 'string' && /^[A-Z]/.test(prop)) {
          target[prop] = createLucideIcon(prop);
          window[prop] = target[prop];
        }
        return target[prop] || createLucideIcon('Sparkles');
      }
    });

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

    class ErrorBoundary extends React.Component {
      constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
      }
      static getDerivedStateFromError(error) {
        return { hasError: true, error };
      }
      componentDidCatch(error, info) {
        console.error("Preview render exception:", error, info);
      }
      render() {
        if (this.state.hasError) {
          return (
            <div style={{ padding: '32px', color: '#f87171', background: '#090d16', minHeight: '100vh', fontFamily: 'system-ui' }}>
              <div style={{ maxWidth: '650px', margin: '40px auto', background: '#131b2e', padding: '24px', borderRadius: '16px', border: '1px solid #ef4444', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ fontSize: '20px' }}>⚠️</span>
                  <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#fca5a5' }}>Preview Render Error</h2>
                </div>
                <p style={{ margin: '0 0 16px', fontSize: '14px', color: '#cbd5e1', lineHeight: '1.5' }}>
                  {this.state.error?.message || 'A runtime exception was thrown while rendering your application.'}
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => this.setState({ hasError: false, error: null })}
                    style={{ background: '#6366f1', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                  >
                    Retry Render
                  </button>
                </div>
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

export default function Workspace() {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [files, setFiles] = useState([]);
    const [fileContents, setFileContents] = useState({});
    const [activeFile, setActiveFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [openTabs, setOpenTabs] = useState([]);
    const [unsaved, setUnsaved] = useState(false);
    const [saving, setSaving] = useState(false);
    const [viewport, setViewport] = useState('desktop');
    const [viewMode, setViewMode] = useState(VIEW_MODE.SPLIT);
    const [showAiChat, setShowAiChat] = useState(true);
    const [showFileTree, setShowFileTree] = useState(true);
    const [messages, setMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [generating, setGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [generationStatus, setGenerationStatus] = useState('');
    const [streamingFile, setStreamingFile] = useState(null);
    const [versions, setVersions] = useState([]);
    const [showVersions, setShowVersions] = useState(false);
    const [loadingProject, setLoadingProject] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [previewKey, setPreviewKey] = useState(1);

    const chatEndRef = useRef(null);
    const editorRef = useRef(null);
    const autoSaveTimer = useRef(null);
    const generationTriggered = useRef(false);

    const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://3.110.167.167:3000';

    const bundledHtml = useMemo(() => {
        return bundlePreviewHtml(fileContents, project?.framework);
    }, [fileContents, project?.framework]);

    // Choose default active file: for React, prefer src/App.jsx over index.html!
    const selectOptimalActiveFile = useCallback((fileList, currentActive) => {
        if (currentActive && fileList.some(f => f.path === currentActive.path)) {
            return currentActive;
        }
        const reactApp = fileList.find(f => f.path === 'src/App.jsx' || f.path === 'App.jsx');
        if (reactApp) return reactApp;
        const mainJsx = fileList.find(f => f.path === 'src/main.jsx');
        if (mainJsx) return mainJsx;
        const indexHtml = fileList.find(f => f.path === 'index.html');
        if (indexHtml) return indexHtml;
        return fileList[0] || null;
    }, []);

    const loadProject = useCallback(async () => {
        try {
            setLoadingProject(true);
            const [projRes, filesRes, convRes] = await Promise.all([
                api.get(`/api/projects/${projectId}`),
                api.get(`/api/projects/${projectId}/files`),
                api.get(`/api/generate/conversation/${projectId}`)
            ]);
            setProject(projRes.data);
            const currentFiles = filesRes.data || [];
            setFiles(currentFiles);

            const msgs = convRes.data?.messages || [];
            setMessages(msgs.filter(m => m.role !== 'system').map(m => ({
                role: m.role,
                content: m.content,
                filesChanged: m.filesChanged
            })));

            if (currentFiles.length > 0) {
                const contentsRes = await Promise.all(
                    currentFiles.map(f => api.get(`/api/projects/${projectId}/files/content`, { params: { path: f.path } }))
                );
                const map = {};
                currentFiles.forEach((f, idx) => {
                    map[f.path] = contentsRes[idx].data?.content || '';
                });
                setFileContents(map);

                const defaultFile = selectOptimalActiveFile(currentFiles, null);
                if (defaultFile) {
                    setActiveFile(defaultFile);
                    setFileContent(map[defaultFile.path] || '');
                    setOpenTabs([defaultFile.path]);
                }
            }
        } catch (err) {
            if (err.response?.status === 404) {
                toast.error('Project not found');
                navigate('/dashboard');
            }
        } finally {
            setLoadingProject(false);
        }
    }, [projectId, navigate, selectOptimalActiveFile]);

    useEffect(() => {
        loadProject();
    }, [loadProject]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, generationStatus]);

    // Live AI Generation Pipeline (SSE)
    const runGenerationStream = useCallback(async (promptText, frameworkType) => {
        setGenerating(true);
        setGenerationStep(1);
        setGenerationStatus('Analyzing prompt & architecture requirements...');

        // Add to chat immediately
        setMessages(prev => [
            ...prev,
            { role: 'user', content: promptText },
            { role: 'assistant', content: 'Crafting your application architecture...', thinking: true }
        ]);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${serverUrl}/api/generate/website`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({
                    prompt: promptText,
                    projectId,
                    framework: frameworkType || project?.framework || 'react'
                })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: 'Generation failed' }));
                throw new Error(err.message || 'Generation failed');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let finalSummary = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop();

                for (const part of parts) {
                    const lines = part.split('\n');
                    let event = 'message';
                    let data = '';
                    for (const line of lines) {
                        if (line.startsWith('event: ')) event = line.slice(7);
                        if (line.startsWith('data: ')) data = line.slice(6);
                    }
                    if (!data) continue;

                    try {
                        const parsed = JSON.parse(data);
                        if (event === 'status') {
                            setGenerationStatus(parsed.message || 'Synthesizing application...');
                            if (parsed.step) setGenerationStep(parsed.step);
                        } else if (event === 'file') {
                            // File arrived live!
                            setStreamingFile(parsed.path);
                            setFileContents(prev => ({ ...prev, [parsed.path]: parsed.content }));
                            setFiles(prev => {
                                if (prev.some(f => f.path === parsed.path)) return prev;
                                return [...prev, { path: parsed.path, language: parsed.language, sizeBytes: parsed.sizeBytes }];
                            });

                            // If this is App.jsx or active file, update editor view immediately!
                            if (parsed.path === 'src/App.jsx' || !activeFile) {
                                setActiveFile({ path: parsed.path, language: parsed.language });
                                setFileContent(parsed.content);
                                setOpenTabs(prev => prev.includes(parsed.path) ? prev : [...prev, parsed.path]);
                            }
                        } else if (event === 'complete') {
                            finalSummary = parsed.summary;
                            if (parsed.projectName) {
                                setProject(p => ({ ...p, name: parsed.projectName, framework: parsed.framework || p?.framework }));
                            }
                            if (parsed.files && parsed.files.length > 0) {
                                const newMap = {};
                                parsed.files.forEach(f => { newMap[f.path] = f.content; });
                                setFileContents(newMap);
                                setFiles(parsed.files.map(f => ({ path: f.path, language: f.language, sizeBytes: f.sizeBytes })));

                                const optimal = selectOptimalActiveFile(parsed.files, null);
                                if (optimal) {
                                    setActiveFile(optimal);
                                    setFileContent(newMap[optimal.path] || '');
                                    setOpenTabs(prev => prev.includes(optimal.path) ? prev : [optimal.path, ...prev]);
                                }
                            }
                        } else if (event === 'error') {
                            throw new Error(parsed.message);
                        }
                    } catch (parseErr) {
                        if (parseErr.message && !parseErr.message.includes('JSON')) throw parseErr;
                    }
                }
            }

            setMessages(prev => prev.map((m, i) =>
                i === prev.length - 1 && m.thinking
                    ? { role: 'assistant', content: finalSummary || 'Website generated successfully!' }
                    : m
            ));

            setGenerationStep(4);
            setGenerationStatus('Website ready! Live preview compiled.');
            setPreviewKey(k => k + 1);
            toast.success('Website generated successfully!');
        } catch (err) {
            toast.error(err.message || 'Generation failed');
            setMessages(prev => prev.map((m, i) =>
                i === prev.length - 1 && m.thinking
                    ? { role: 'assistant', content: 'Generation failed: ' + err.message, error: true }
                    : m
            ));
        } finally {
            setGenerating(false);
            setStreamingFile(null);
            setTimeout(() => setGenerationStatus(''), 4000);
        }
    }, [projectId, project?.framework, activeFile, selectOptimalActiveFile, serverUrl]);

    // Handle auto-generate when triggered from Dashboard or Home
    useEffect(() => {
        if (!loadingProject && location.state?.autoGenerate && location.state?.prompt && !generationTriggered.current) {
            generationTriggered.current = true;
            const promptText = location.state.prompt;
            const frameworkType = location.state.framework || 'react';
            window.history.replaceState({}, '');
            runGenerationStream(promptText, frameworkType);
        }
    }, [loadingProject, location.state, runGenerationStream]);

    const openFile = (fileRef) => {
        setActiveFile(fileRef);
        setFileContent(fileContents[fileRef.path] || '');
        setUnsaved(false);
        if (!openTabs.includes(fileRef.path)) {
            setOpenTabs(prev => [...prev, fileRef.path]);
        }
    };

    const closeTab = (path, e) => {
        e?.stopPropagation();
        const nextTabs = openTabs.filter(t => t !== path);
        setOpenTabs(nextTabs);
        if (activeFile?.path === path) {
            if (nextTabs.length > 0) {
                const nextPath = nextTabs[nextTabs.length - 1];
                const nextFile = files.find(f => f.path === nextPath) || { path: nextPath };
                setActiveFile(nextFile);
                setFileContent(fileContents[nextPath] || '');
            } else {
                setActiveFile(null);
                setFileContent('');
            }
        }
    };

    const refreshPreview = useCallback(async () => {
        try {
            const { data: filesData } = await api.get(`/api/projects/${projectId}/files`);
            setFiles(filesData);
            const contentsRes = await Promise.all(
                filesData.map(f => api.get(`/api/projects/${projectId}/files/content`, { params: { path: f.path } }))
            );
            const map = {};
            filesData.forEach((f, i) => { map[f.path] = contentsRes[i].data?.content || ''; });
            setFileContents(map);
            if (activeFile && map[activeFile.path]) {
                setFileContent(map[activeFile.path]);
            }
            setPreviewKey(k => k + 1);
            toast.success('Preview reloaded');
        } catch {
            toast.error('Failed to reload preview');
        }
    }, [projectId, activeFile]);

    const handleEditorChange = (value) => {
        const val = value || '';
        setFileContent(val);
        setUnsaved(true);
        if (activeFile) {
            setFileContents(prev => ({ ...prev, [activeFile.path]: val }));
        }
        clearTimeout(autoSaveTimer.current);
        autoSaveTimer.current = setTimeout(() => saveFile(val), 1800);
    };

    const saveFile = async (content) => {
        if (!activeFile) return;
        try {
            setSaving(true);
            const textToSave = content !== undefined ? content : fileContent;
            await api.put(`/api/projects/${projectId}/files`, {
                path: activeFile.path,
                content: textToSave
            });
            setUnsaved(false);
        } catch {
            toast.error('Save failed');
        } finally {
            setSaving(false);
        }
    };

    const handleManualSave = async () => {
        clearTimeout(autoSaveTimer.current);
        await saveFile();
        toast.success('Saved');
    };

    const handleKeyDown = (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 's') {
            e.preventDefault();
            handleManualSave();
        }
    };

    const handleSendChat = async (e) => {
        e?.preventDefault();
        const text = chatInput.trim();
        if (!text || generating) return;

        setChatInput('');
        setGenerating(true);
        setGenerationStatus('Analyzing request & editing components...');

        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg, { role: 'assistant', content: 'Applying modifications...', thinking: true }]);

        try {
            const token = localStorage.getItem('token');
            const headers = { 'Content-Type': 'application/json' };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${serverUrl}/api/generate/chat`, {
                method: 'POST',
                headers,
                credentials: 'include',
                body: JSON.stringify({ prompt: text, projectId })
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: 'Request failed' }));
                throw new Error(err.message || 'Request failed');
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let buffer = '';
            let finalSummary = '';
            let changedFiles = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buffer += decoder.decode(value, { stream: true });
                const parts = buffer.split('\n\n');
                buffer = parts.pop();

                for (const part of parts) {
                    const lines = part.split('\n');
                    let event = 'message';
                    let data = '';
                    for (const line of lines) {
                        if (line.startsWith('event: ')) event = line.slice(7);
                        if (line.startsWith('data: ')) data = line.slice(6);
                    }
                    if (!data) continue;

                    try {
                        const parsed = JSON.parse(data);
                        if (event === 'status') {
                            setGenerationStatus(parsed.message);
                        } else if (event === 'file') {
                            setStreamingFile(parsed.path);
                            if (parsed.operation === 'delete') {
                                setFileContents(prev => {
                                    const next = { ...prev };
                                    delete next[parsed.path];
                                    return next;
                                });
                                setFiles(prev => prev.filter(f => f.path !== parsed.path));
                            } else {
                                setFileContents(prev => ({ ...prev, [parsed.path]: parsed.content }));
                                setFiles(prev => {
                                    if (prev.some(f => f.path === parsed.path)) return prev;
                                    return [...prev, { path: parsed.path, language: parsed.language, sizeBytes: parsed.sizeBytes }];
                                });
                                if (activeFile?.path === parsed.path) {
                                    setFileContent(parsed.content);
                                }
                            }
                        } else if (event === 'complete') {
                            finalSummary = parsed.summary;
                            changedFiles = parsed.filesChanged || [];
                        } else if (event === 'error') {
                            throw new Error(parsed.message);
                        }
                    } catch (parseErr) {
                        if (parseErr.message && !parseErr.message.includes('JSON')) throw parseErr;
                    }
                }
            }

            setMessages(prev => prev.map((m, i) =>
                i === prev.length - 1 && m.thinking
                    ? { role: 'assistant', content: finalSummary || 'Changes applied.', filesChanged }
                    : m
            ));

            setPreviewKey(k => k + 1);
            toast.success('Modifications applied');
        } catch (err) {
            toast.error(err.message || 'Edit failed');
            setMessages(prev => prev.map((m, i) =>
                i === prev.length - 1 && m.thinking
                    ? { role: 'assistant', content: 'Edit failed: ' + err.message, error: true }
                    : m
            ));
        } finally {
            setGenerating(false);
            setStreamingFile(null);
            setTimeout(() => setGenerationStatus(''), 4000);
        }
    };

    const handleExportZip = async () => {
        try {
            const zip = new JSZip();
            Object.entries(fileContents).forEach(([path, content]) => {
                zip.file(path, content);
            });
            const isReact = project?.framework === 'react' || Object.keys(fileContents).some(p => p.endsWith('.jsx'));
            if (isReact && !fileContents['package.json']) {
                zip.file('package.json', JSON.stringify({
                    name: (project?.name || 'react-app').toLowerCase().replace(/[^a-z0-9]/g, '-'),
                    private: true,
                    version: '0.0.0',
                    type: 'module',
                    scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
                    dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' },
                    devDependencies: { '@vitejs/plugin-react': '^4.3.1', vite: '^5.4.0' }
                }, null, 2));
            }
            if (isReact && !fileContents['vite.config.js']) {
                zip.file('vite.config.js', `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({\n  plugins: [react()]\n});`);
            }
            const blob = await zip.generateAsync({ type: 'blob' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${(project?.name || 'website').toLowerCase().replace(/[^a-z0-9]/g, '-')}.zip`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            toast.success('ZIP archive downloaded');
        } catch {
            toast.error('Failed to export ZIP');
        }
    };

    const handleOpenInNewTab = () => {
        const blob = new Blob([bundledHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    };

    const handleDeploy = async () => {
        try {
            setPublishing(true);
            const { data } = await api.post(`/api/projects/${projectId}/deploy`);
            setProject(data.project);
            setShowPublishModal(true);
            toast.success('Website deployed live!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Deployment failed');
        } finally {
            setPublishing(false);
        }
    };

    const handleUnpublish = async () => {
        try {
            setPublishing(true);
            const { data } = await api.post(`/api/projects/${projectId}/unpublish`);
            setProject(data.project);
            setShowPublishModal(false);
            toast.success('Site unpublished');
        } catch {
            toast.error('Failed to unpublish');
        } finally {
            setPublishing(false);
        }
    };

    const loadVersions = async () => {
        try {
            const { data } = await api.get(`/api/projects/${projectId}/versions`);
            setVersions(data);
            setShowVersions(true);
        } catch {
            toast.error('Failed to load version history');
        }
    };

    const restoreVersion = async (versionId) => {
        try {
            await api.post(`/api/projects/${projectId}/versions/${versionId}/restore`);
            toast.success('Version restored');
            setShowVersions(false);
            await loadProject();
        } catch {
            toast.error('Failed to restore version');
        }
    };

    if (loadingProject) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#07080e]">
                <div className="text-center">
                    <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-sm font-medium text-slate-300">Loading Workspace Studio...</p>
                    <p className="text-xs text-slate-500 mt-1">Mounting sandbox environment</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#07080e] text-slate-100 font-sans" onKeyDown={handleKeyDown}>
            {/* Top Navigation Bar */}
            <header className="h-14 border-b border-white/[0.08] bg-[#0c0e17] px-4 flex items-center justify-between shrink-0 z-30">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                        title="Back to Dashboard"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-white/10" />
                    <div className="flex items-center gap-2.5">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-indigo-500/20">
                            {project?.name ? project.name.charAt(0).toUpperCase() : 'G'}
                        </div>
                        <span className="text-sm font-semibold text-white tracking-tight hidden sm:block max-w-[200px] truncate">
                            {project?.name || 'My Project'}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            {project?.framework === 'react' || Object.keys(fileContents).some(p => p.endsWith('.jsx')) ? '⚛️ React 18' : '🌐 HTML5'}
                        </span>
                        {saving ? (
                            <span className="text-xs text-amber-400 flex items-center gap-1.5 ml-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" /> Saving...
                            </span>
                        ) : unsaved ? (
                            <span className="text-xs text-slate-400 flex items-center gap-1.5 ml-2" title="Unsaved changes (Press ⌘S)">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Unsaved
                            </span>
                        ) : (
                            <span className="text-xs text-emerald-400/80 flex items-center gap-1.5 ml-2">
                                <Check className="w-3 h-3" /> Saved
                            </span>
                        )}
                    </div>
                </div>

                {/* Viewport & View Mode Selectors */}
                <div className="flex items-center gap-2">
                    {/* View Mode Toggle */}
                    <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        <button
                            onClick={() => setViewMode(VIEW_MODE.SPLIT)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === VIEW_MODE.SPLIT ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Columns className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Split</span>
                        </button>
                        <button
                            onClick={() => setViewMode(VIEW_MODE.PREVIEW)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === VIEW_MODE.PREVIEW ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Eye className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Preview</span>
                        </button>
                        <button
                            onClick={() => setViewMode(VIEW_MODE.CODE)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${viewMode === VIEW_MODE.CODE ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Code2 className="w-3.5 h-3.5" />
                            <span className="hidden md:inline">Code</span>
                        </button>
                    </div>

                    {/* Viewport Size Controls (Visible in Preview or Split) */}
                    {(viewMode === VIEW_MODE.PREVIEW || viewMode === VIEW_MODE.SPLIT) && (
                        <div className="hidden lg:flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                            <button
                                onClick={() => setViewport('desktop')}
                                className={`p-1.5 rounded-lg transition-all ${viewport === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="Desktop (100%)"
                            >
                                <Monitor className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewport('tablet')}
                                className={`p-1.5 rounded-lg transition-all ${viewport === 'tablet' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="Tablet (768px)"
                            >
                                <Tablet className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setViewport('mobile')}
                                className={`p-1.5 rounded-lg transition-all ${viewport === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'}`}
                                title="Mobile (375px)"
                            >
                                <Smartphone className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Action Tools */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowAiChat(!showAiChat)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${showAiChat ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm' : 'text-slate-400 hover:text-white border-white/[0.06] hover:bg-white/[0.06]'}`}
                        title="Toggle AI Assistant"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="hidden sm:inline">AI Copilot</span>
                    </button>

                    <button
                        onClick={refreshPreview}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors border border-white/[0.06]"
                        title="Reload live preview"
                    >
                        <RotateCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={handleOpenInNewTab}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors border border-white/[0.06] hidden md:flex"
                        title="Open preview in new tab"
                    >
                        <ExternalLink className="w-3.5 h-3.5" />
                    </button>

                    <button
                        onClick={handleExportZip}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors hidden sm:flex"
                        title="Download ZIP"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export</span>
                    </button>

                    {project?.status === 'published' ? (
                        <button
                            onClick={() => setShowPublishModal(true)}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 hover:bg-emerald-500/25 transition-all shadow-md shadow-emerald-500/10"
                        >
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Live Site</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleDeploy}
                            disabled={publishing}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-95 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
                        >
                            {publishing ? (
                                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Rocket className="w-3.5 h-3.5" />
                            )}
                            <span>Publish</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Live Generation Progress HUD */}
            <AnimatePresence>
                {(generating || generationStatus) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-[#0c0e17] border-b border-indigo-500/30 px-6 py-3 flex items-center justify-between shrink-0 shadow-lg backdrop-blur-md z-20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 animate-pulse">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-indigo-200">AI Architect</span>
                                    {streamingFile && (
                                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                                            writing {streamingFile}
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-slate-300 font-medium mt-0.5">
                                    {generationStatus || 'Synthesizing application components...'}
                                </p>
                            </div>
                        </div>

                        {/* Visual Step Progress Tracker */}
                        <div className="hidden md:flex items-center gap-4 text-xs">
                            {[
                                { step: 1, label: 'Analysis' },
                                { step: 2, label: 'React Tree' },
                                { step: 3, label: 'Components' },
                                { step: 4, label: 'Live Preview' }
                            ].map(s => (
                                <div key={s.step} className="flex items-center gap-1.5">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${generationStep >= s.step ? 'bg-indigo-500 text-white' : 'bg-white/10 text-slate-400'}`}>
                                        {generationStep > s.step ? '✓' : s.step}
                                    </div>
                                    <span className={generationStep >= s.step ? 'text-indigo-200 font-medium' : 'text-slate-500'}>
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Studio Workspace Body */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Collapsible Left AI Assistant Drawer */}
                <AnimatePresence>
                    {showAiChat && (
                        <motion.aside
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 340, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="h-full border-r border-white/[0.08] bg-[#090b12] flex flex-col shrink-0 overflow-hidden z-20"
                        >
                            <div className="h-11 px-4 border-b border-white/[0.06] flex items-center justify-between shrink-0 bg-white/[0.02]">
                                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>AI Assistant</span>
                                </div>
                                <button
                                    onClick={() => setShowAiChat(false)}
                                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                                >
                                    <PanelLeftClose className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Chat Conversation History */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center py-10 px-2">
                                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-lg shadow-indigo-500/10">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-200 mb-1.5">Conversational Architect</h3>
                                        <p className="text-xs text-slate-400 max-w-xs mb-6">
                                            Describe edits or enhancements in plain English. The AI edits only the relevant React components.
                                        </p>
                                        <div className="space-y-2 w-full text-left">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-1">Quick Prompts</p>
                                            {[
                                                'Change color theme to electric cyan & dark mode',
                                                'Add an interactive pricing section with 3 tiers',
                                                'Make navigation sticky with glassmorphism',
                                                'Add customer testimonials with ratings'
                                            ].map(prompt => (
                                                <button
                                                    key={prompt}
                                                    onClick={() => setChatInput(prompt)}
                                                    className="w-full text-xs text-left p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.05] transition-all flex items-center justify-between group"
                                                >
                                                    <span className="truncate">{prompt}</span>
                                                    <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-indigo-400 shrink-0 ml-1" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    messages.map((msg, i) => (
                                        <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs shrink-0 font-bold ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-indigo-300 border border-white/10'}`}>
                                                {msg.role === 'user' ? user?.userName?.[0]?.toUpperCase() || 'U' : '✨'}
                                            </div>
                                            <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white/[0.05] text-slate-200 border border-white/[0.08] rounded-tl-none'}`}>
                                                <p className="whitespace-pre-wrap">{msg.content}</p>
                                                {msg.filesChanged && msg.filesChanged.length > 0 && (
                                                    <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                                                        <p className="text-[10px] font-semibold text-slate-400">Files updated:</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {msg.filesChanged.map(f => (
                                                                <span key={f.path} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-indigo-300 flex items-center gap-1">
                                                                    <span>{f.operation === 'delete' ? '🗑' : f.operation === 'create' ? '✨' : '✏️'}</span>
                                                                    <span>{f.path}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                                <div ref={chatEndRef} />
                            </div>

                            {/* Chat Input Bar */}
                            <div className="p-3 border-t border-white/[0.08] bg-[#0c0e17]">
                                <form onSubmit={handleSendChat} className="flex flex-col gap-2">
                                    <div className="relative rounded-xl bg-white/[0.04] border border-white/[0.1] focus-within:border-indigo-500/60 transition-colors p-2.5">
                                        <textarea
                                            value={chatInput}
                                            onChange={e => setChatInput(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendChat(e);
                                                }
                                            }}
                                            rows={2}
                                            placeholder="Ask AI Copilot to modify anything... (Enter to send)"
                                            disabled={generating}
                                            className="w-full bg-transparent text-xs text-white placeholder-slate-500 resize-none outline-none"
                                        />
                                        <div className="flex items-center justify-between pt-1">
                                            <span className="text-[10px] text-slate-500">Shift + Enter for newline</span>
                                            <button
                                                type="submit"
                                                disabled={!chatInput.trim() || generating}
                                                className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white transition-all shadow-md"
                                                title="Send instruction"
                                            >
                                                {generating ? (
                                                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                ) : (
                                                    <Send className="w-3.5 h-3.5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Center / Editor & Preview Arena */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Collapsible File Explorer Sidebar */}
                    {viewMode !== VIEW_MODE.PREVIEW && showFileTree && (
                        <div className="w-48 border-r border-white/[0.08] bg-[#090b12] flex flex-col shrink-0">
                            <div className="h-10 px-3 border-b border-white/[0.06] flex items-center justify-between text-xs font-semibold text-slate-300">
                                <div className="flex items-center gap-1.5">
                                    <Folder className="w-3.5 h-3.5 text-indigo-400" />
                                    <span>Explorer</span>
                                </div>
                                <button
                                    onClick={() => setShowFileTree(false)}
                                    className="p-1 rounded text-slate-500 hover:text-white"
                                    title="Collapse Explorer"
                                >
                                    <PanelLeftClose className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto py-1">
                                {files.map(file => {
                                    const isActive = activeFile?.path === file.path;
                                    const isReactFile = file.path.endsWith('.jsx');
                                    return (
                                        <button
                                            key={file.path}
                                            onClick={() => openFile(file)}
                                            className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors border-l-2 ${isActive ? 'bg-indigo-600/15 text-indigo-200 border-indigo-500 font-medium' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border-transparent'}`}
                                        >
                                            <FileCode className={`w-3.5 h-3.5 shrink-0 ${isReactFile ? 'text-cyan-400' : file.path.endsWith('.css') ? 'text-blue-400' : 'text-slate-500'}`} />
                                            <span className="truncate">{file.path}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Editor Panel */}
                    {viewMode !== VIEW_MODE.PREVIEW && (
                        <div className={`h-full flex flex-col overflow-hidden border-r border-white/[0.08] ${viewMode === VIEW_MODE.SPLIT ? 'w-1/2' : 'w-full'}`}>
                            {/* Editor Tabs Bar */}
                            <div className="h-10 border-b border-white/[0.08] bg-[#0c0e17] flex items-center justify-between px-2 overflow-x-auto shrink-0">
                                <div className="flex items-center gap-1 overflow-x-auto">
                                    {!showFileTree && (
                                        <button
                                            onClick={() => setShowFileTree(true)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] mr-1"
                                            title="Open Explorer"
                                        >
                                            <PanelLeftOpen className="w-3.5 h-3.5" />
                                        </button>
                                    )}
                                    {openTabs.map(tabPath => {
                                        const isTabActive = activeFile?.path === tabPath;
                                        const isReact = tabPath.endsWith('.jsx');
                                        return (
                                            <div
                                                key={tabPath}
                                                onClick={() => {
                                                    const f = files.find(file => file.path === tabPath) || { path: tabPath };
                                                    openFile(f);
                                                }}
                                                className={`group flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all border ${isTabActive ? 'bg-[#151928] text-white border-indigo-500/30 font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] border-transparent'}`}
                                            >
                                                <FileCode className={`w-3.5 h-3.5 ${isReact ? 'text-cyan-400' : tabPath.endsWith('.css') ? 'text-blue-400' : 'text-slate-500'}`} />
                                                <span>{tabPath.split('/').pop()}</span>
                                                {isTabActive && unsaved && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5" />
                                                )}
                                                <button
                                                    onClick={(e) => closeTab(tabPath, e)}
                                                    className="p-0.5 rounded text-slate-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={handleManualSave}
                                        disabled={!unsaved || saving}
                                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 disabled:opacity-40 transition-colors"
                                        title="Save File (⌘S)"
                                    >
                                        <Save className="w-3 h-3" />
                                        <span>Save</span>
                                    </button>
                                </div>
                            </div>

                            {/* Monaco Code Editor */}
                            <div className="flex-1 overflow-hidden relative bg-[#090b12]">
                                {activeFile ? (
                                    <Editor
                                        height="100%"
                                        language={detectLang(activeFile.path)}
                                        value={fileContent}
                                        onChange={handleEditorChange}
                                        onMount={ed => { editorRef.current = ed; }}
                                        theme="vs-dark"
                                        options={{
                                            fontSize: 13,
                                            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                                            lineNumbers: 'on',
                                            minimap: { enabled: false },
                                            scrollBeyondLastLine: false,
                                            wordWrap: 'on',
                                            tabSize: 2,
                                            automaticLayout: true,
                                            bracketPairColorization: { enabled: true },
                                            smoothScrolling: true,
                                            padding: { top: 12, bottom: 12 }
                                        }}
                                    />
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-500">
                                        <Code2 className="w-10 h-10 mb-3 opacity-40" />
                                        <p className="text-sm font-medium text-slate-300">No file opened</p>
                                        <p className="text-xs text-slate-500 mt-1">Select a file from the explorer or tabs</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Preview Panel */}
                    {viewMode !== VIEW_MODE.CODE && (
                        <div className={`h-full flex flex-col overflow-hidden bg-[#05060a] ${viewMode === VIEW_MODE.SPLIT ? 'w-1/2' : 'w-full'}`}>
                            {/* Browser Mock Chrome Bar */}
                            <div className="h-10 border-b border-white/[0.08] bg-[#0c0e17] px-4 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                                </div>

                                {/* URL Pill */}
                                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-xs font-mono text-slate-400 max-w-sm w-full mx-4">
                                    <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                                    <span className="truncate">https://preview.{project?.name ? project.name.toLowerCase().replace(/[^a-z0-9]/g, '-') : 'app'}.local</span>
                                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-semibold ml-auto shrink-0">SSL</span>
                                </div>

                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                                    <span>{viewport === 'desktop' ? '100% Fluid' : viewport === 'tablet' ? '768 × 1024' : '375 × 667'}</span>
                                </div>
                            </div>

                            {/* Viewport Frame Container */}
                            <div className="flex-1 flex items-center justify-center p-3 overflow-hidden bg-[#07080e]">
                                <div
                                    className="h-full transition-all duration-300 flex flex-col items-center justify-center"
                                    style={{
                                        width: VIEWPORT[viewport],
                                        maxWidth: '100%',
                                        borderRadius: viewport !== 'desktop' ? '20px' : '8px',
                                        overflow: 'hidden',
                                        boxShadow: viewport !== 'desktop' ? '0 25px 70px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1)' : 'none'
                                    }}
                                >
                                    <iframe
                                        key={previewKey}
                                        srcDoc={bundledHtml}
                                        title="Website Preview"
                                        className="w-full h-full border-none bg-[#08090d]"
                                        sandbox="allow-scripts allow-forms allow-modals allow-same-origin"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Version History Modal */}
            <AnimatePresence>
                {showVersions && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowVersions(false)}
                    >
                        <motion.div
                            className="w-full max-w-md rounded-2xl bg-[#0e111d] border border-white/10 p-6 shadow-2xl"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <History className="w-4 h-4 text-indigo-400" />
                                    <h3 className="text-sm font-bold text-white">Version Snapshots</h3>
                                </div>
                                <button onClick={() => setShowVersions(false)} className="p-1 rounded text-slate-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="py-4 max-h-80 overflow-y-auto space-y-2">
                                {versions.length === 0 ? (
                                    <p className="text-xs text-center text-slate-500 py-6">No snapshots saved yet</p>
                                ) : (
                                    versions.map(v => (
                                        <div key={v._id} className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-semibold text-slate-200">{v.label || 'Snapshot'}</p>
                                                <p className="text-[10px] text-slate-500 mt-0.5">{timeAgo(v.createdAt)} · {v.triggeredBy}</p>
                                            </div>
                                            <button
                                                onClick={() => restoreVersion(v._id)}
                                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                                            >
                                                Restore
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Deployment / Live Site Modal */}
                {showPublishModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-md"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowPublishModal(false)}
                    >
                        <motion.div
                            className="w-full max-w-md rounded-2xl bg-[#0e111d] border border-white/10 p-6 shadow-2xl"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <h3 className="text-sm font-bold text-white">Application Live on Global CDN</h3>
                                </div>
                                <button onClick={() => setShowPublishModal(false)} className="p-1 rounded text-slate-400 hover:text-white">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="py-5 space-y-4">
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    Your application has been deployed to the global edge network with instant caching, SSL certificate, and responsive rendering.
                                </p>
                                <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10">
                                    <input
                                        type="text"
                                        readOnly
                                        value={`${serverUrl}/site/${projectId}`}
                                        className="flex-1 bg-transparent text-xs text-indigo-300 font-mono outline-none px-2 select-all"
                                    />
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${serverUrl}/site/${projectId}`);
                                            toast.success('Live URL copied');
                                        }}
                                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <a
                                        href={`${serverUrl}/site/${projectId}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                                    >
                                        <span>Open in Browser</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                    <button
                                        onClick={handleUnpublish}
                                        disabled={publishing}
                                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                                    >
                                        Unpublish
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

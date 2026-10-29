require('dotenv').config();
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

const connectDb = require('./config/database.js');
const authRouter = require('./routes/auth.routes.js');
const userRouter = require('./routes/user.routes.js');
const projectRouter = require('./routes/project.routes.js');
const generateRouter = require('./routes/generate.routes.js');
const templateRouter = require('./routes/template.routes.js');
const billingRouter = require('./routes/billing.routes.js');
const deployCtrl = require('./controllers/deploy.controller.js');

const app = express();
const PORT = process.env.PORT || 3000;

connectDb();

const defaultAllowed = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:80',
    'http://127.0.0.1:80',
    'http://localhost',
    'http://3.110.221.10:5173',
    'http://3.110.221.10:80',
    'http://3.110.221.10'
];
const envAllowed = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()) : [];
const allowedOrigins = [...new Set([...defaultAllowed, ...envAllowed])];

app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false
}));

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    const cleanOrigin = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(cleanOrigin) || allowedOrigins.includes(origin)) return true;
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(cleanOrigin)) return true;
    if (/^https?:\/\/3\.110\.221\.10(:\d+)?$/.test(cleanOrigin)) return true;
    return false;
};

app.use(cors({
    origin: (origin, callback) => {
        if (isAllowedOrigin(origin)) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts. Please wait 15 minutes.' }
});

const generateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many generation requests. Please wait a moment.' }
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false
});

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/site/:id', deployCtrl.servePublicSite);
app.get('/site/:id/:assetPath', deployCtrl.servePublicSite);

app.use('/api/', apiLimiter);
app.use('/api/auth', authLimiter, authRouter);
app.use('/api/user', userRouter);
app.use('/api/projects', projectRouter);
app.use('/api/generate', generateLimiter, generateRouter);
app.use('/api/templates', templateRouter);
app.use('/api/billing', billingRouter);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
    res.status(status).json({ message });
});

app.listen(PORT, () => {
    process.stdout.write(`Server running on port ${PORT}\n`);
});

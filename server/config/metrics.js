const client = require('prom-client');

// Create a dedicated Prometheus Registry
const register = new client.Registry();

// Add default system & process metrics (CPU, Memory, Event Loop lag, Heap)
client.collectDefaultMetrics({
    register,
    prefix: 'genweb_',
    timeout: 5000
});

// Custom HTTP Metrics
const httpRequestDurationSeconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});
register.registerMetric(httpRequestDurationSeconds);

const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total count of HTTP requests handled by the server',
    labelNames: ['method', 'route', 'status_code']
});
register.registerMetric(httpRequestsTotal);

// Application-specific business telemetry
const aiGenerationsTotal = new client.Counter({
    name: 'genweb_ai_generations_total',
    help: 'Total number of AI code synthesis generations initiated',
    labelNames: ['status', 'type']
});
register.registerMetric(aiGenerationsTotal);

const deploymentsTotal = new client.Counter({
    name: 'genweb_deployments_total',
    help: 'Total number of edge website deployments',
    labelNames: ['status']
});
register.registerMetric(deploymentsTotal);

const githubSyncTotal = new client.Counter({
    name: 'genweb_github_sync_total',
    help: 'Total number of GitHub bidirectional sync operations (push/import)',
    labelNames: ['action', 'status']
});
register.registerMetric(githubSyncTotal);

// Normalize routes to avoid high-cardinality label explosions
const normalizeRoute = (req) => {
    let path = req.baseUrl ? `${req.baseUrl}${req.path}` : req.path || req.url || '';
    path = path.split('?')[0]; // remove query params
    // Replace MongoDB ObjectIDs or UUIDs with :id placeholder
    path = path.replace(/[0-9a-fA-F]{24}/g, ':id');
    path = path.replace(/[0-9a-fA-F-]{36}/g, ':uuid');
    return path || '/';
};

// Express Middleware for automatic request timing & counting
const metricsMiddleware = (req, res, next) => {
    // Skip Prometheus scrape requests themselves from skewing telemetry
    if (req.path === '/metrics') {
        return next();
    }

    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const durationSeconds = diff[0] + diff[1] / 1e9;
        const route = normalizeRoute(req);
        const statusCode = res.statusCode ? String(res.statusCode) : 'unknown';

        httpRequestsTotal.inc({
            method: req.method,
            route,
            status_code: statusCode
        });

        httpRequestDurationSeconds.observe({
            method: req.method,
            route,
            status_code: statusCode
        }, durationSeconds);
    });

    next();
};

module.exports = {
    register,
    metricsMiddleware,
    httpRequestDurationSeconds,
    httpRequestsTotal,
    aiGenerationsTotal,
    deploymentsTotal,
    githubSyncTotal
};

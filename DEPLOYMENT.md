# 🚀 GenWeb AI - Production Deployment & DevOps Architecture Guide

This document describes the high-availability production deployment topology, load balancing, real-time telemetry, and GitHub integration architecture for the **GenWeb AI Website Builder** college minor project.

---

## 🏛 Architecture Overview

```
                                  [ User Traffic ]
                                         │
                                         ▼
                     ┌────────────────────────────────────────┐
                     │         Nginx Layer-7 Reverse Proxy    │
                     │          & Round-Robin Load Balancer   │
                     │                 (Port 80)              │
                     └───────┬────────────────────────┬───────┘
                             │                        │
               ┌─────────────┴────────────┐           ▼
               │ /api/*, /site/*, /metrics│      / (Frontend)
               ▼                          ▼           │
     ┌──────────────────┐       ┌──────────────────┐  │
     │ Backend Replica 1│       │ Backend Replica 2│  │
     │  (Port 3000)     │       │  (Port 3000)     │  │
     └─────────┬────────┘       └─────────┬────────┘  │
               │                          │           ▼
               │    Prometheus Scrapes    │    ┌──────────────┐
               │         /metrics         │    │ Frontend SPA │
               └─────────────┬────────────┘    │  (Port 5173) │
                             ▼                 └──────────────┘
                    ┌──────────────────┐
                    │ Prometheus Engine│
                    │   (Port 9090)    │
                    └────────┬─────────┘
                             ▼
                    ┌──────────────────┐
                    │ Grafana Dashboard│
                    │   (Port 3002)    │
                    └──────────────────┘
```

---

## 📦 Service Breakdown

| Service | Container Name | Port | Description |
|---|---|---|---|
| **Nginx Proxy** | `genweb-nginx-lb` | `80:80` | Layer-7 Reverse Proxy, SSL termination ready, balances backend requests with `least_conn` strategy. |
| **Backend 1** | `genweb-backend-1` | `3000` (internal) | Primary Express REST API replica (Node.js 20+). |
| **Backend 2** | `genweb-backend-2` | `3000` (internal) | High-availability secondary API replica. |
| **Frontend** | `genweb-frontend` | `5173` | React 19 + Tailwind CSS + Monaco Editor single-page application. |
| **Prometheus** | `genweb-prometheus` | `9090:9090` | Timeseries metric scraper pulling `/metrics` telemetry every 10s. |
| **Grafana** | `genweb-grafana` | `3002:3000` | Real-time observability dashboard visualizing latency, throughput, memory, and error rates. |

---

## 🛠 Quickstart Deployment Commands

### 1. Clone & Setup Environment
Ensure your `.env` is configured with your MongoDB database connection and Gemini API key:
```bash
cp .env.example .env
```

### 2. Launch the Entire High-Availability Stack
```bash
docker compose -f docker-compose.prod.yml up -d --build
```

### 3. Check Container Health Status
```bash
docker compose -f docker-compose.prod.yml ps
```

---

## 📊 Telemetry & Observability Access

### 1. Prometheus Telemetry
- **Prometheus Web UI**: `http://<SERVER_IP>:9090`
- **Raw Metrics Endpoint**: `http://<SERVER_IP>/metrics`
  - `http_requests_total`: Total HTTP requests partitioned by HTTP method, route, and status code.
  - `http_request_duration_seconds`: Histogram of request response latency.
  - `genweb_ai_generations_total`: AI code generation counter.
  - `genweb_github_sync_total`: GitHub bidirectional push & import counter.
  - `genweb_nodejs_heap_size_used_bytes`: V8 engine memory usage.

### 2. Grafana Dashboards
- **URL**: `http://<SERVER_IP>:3002`
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin`
- The pre-provisioned dashboard **"GenWeb AI - Production Cluster Telemetry"** is immediately visible under Dashboards.

---

## 🎨 New Features Guide

### 1. In-Place Visual DOM Inspector & Zero-Token Synchronizer
- In the Workspace studio, click the **"Visual Edit"** toggle button in the top navigation bar.
- Hover over any rendered HTML/React element (heading, button, card, input) to highlight it.
- Click an element to open the floating **Visual Element Inspector**:
  - Edit text directly in the input box.
  - Toggle quick color palettes (Indigo, Purple, Cyan, Emerald, Rose, Amber, Slate, Gradient).
  - Adjust alignment (Left, Center, Right) and corner radius (MD, Pill, Flat).
  - Modify custom Tailwind CSS utility classes.
- **Zero-Token Guarantee**: All visual changes update both the live iframe DOM and the underlying React source code (`src/App.jsx` or active file) in memory and auto-saves without consuming LLM API tokens.

### 2. Bidirectional GitHub Integration
- Click the **"GitHub"** button in the top navigation bar.
- **Push to GitHub**:
  - Enter your GitHub Personal Access Token (PAT) with `repo` permissions.
  - Choose a repository name (e.g. `my-awesome-site`) and branch (`main`).
  - Click **Push to GitHub**. The system creates the GitHub repository automatically if it doesn't already exist, creates Git trees and commits, and updates the branch ref.
- **Import from GitHub**:
  - Switch to the "Import Repository" tab.
  - Enter any public or private GitHub repository URL (e.g. `owner/repo`).
  - Click **Import Repository**. Your workspace will snapshot current files for safety and load the GitHub source tree directly into your live editor.

### 3. One-Click ZIP Export
- Click **"Export"** in the top navigation bar to download a production-ready, standard Vite + React project ZIP archive containing:
  - Source components (`src/App.jsx`, `src/index.css`)
  - Clean `package.json` with React 18, Tailwind CSS, and Lucide icons
  - `vite.config.js` and `index.html`
  - Ready for immediate `npm install && npm run dev` on any local machine.

---

## 🧑‍💻 Project Academic Information
- **Institution**: Birla Institute of Applied Sciences (BIAS), Bhimtal
- **Project Title**: GenWeb AI - Next-Generation AI Website Builder & Visual Editor
- **Mentor**: Mr. Hem Bhatt, Assistant Professor, Dept. of CSE
- **Team**:
  1. Lakshita Pandey (Leader, Roll: 230050101095)
  2. Amaan Khan (Roll: 230050101015)
  3. Anushka Joshi (Roll: 230050101018)
  4. Harshit Dumka (Roll: 230050101061)
  5. Bhumika Padiyar (Roll: 230050101038)

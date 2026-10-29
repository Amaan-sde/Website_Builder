# Docker Guide for GenWeb.ai Website Builder

This guide provides complete instructions for containerizing, developing, and deploying both the **Frontend** and **Backend** of the GenWeb.ai Website Builder using Docker and Docker Compose.

---

## 🏗️ Architecture Overview

| Component | Base Image | Port | Description |
| :--- | :--- | :--- | :--- |
| **Backend API** | `node:20-alpine` | `3000` | Express REST API with Google Gemini 3.5 AI integration, MongoDB Atlas, and Firebase auth. |
| **Frontend Client** | `node:20-alpine` | `5173` | Pure Node.js container serving the optimized React 19 production build. |
| **Orchestration** | Docker Compose v2 | Bridge Network | Automated coordination between backend and frontend containers. |

---

## 📁 Docker Files Structure

```
Website_Builder/
├── docker-compose.yml         # Production orchestration (Backend + Frontend)
├── docker-compose.dev.yml     # Development orchestration (Live code reload + HMR)
├── .env.example               # Environment variables template
├── DOCKER.md                  # This documentation file
│
├── server/
│   ├── Dockerfile             # Clean Node.js Alpine Dockerfile
│   ├── .dockerignore          # Excludes node_modules, .env, git
│   └── package.json           # Includes "start": "node index.js"
│
└── client/
    ├── Dockerfile             # Clean Node.js Alpine Dockerfile
    ├── nginx.conf             # Optional Nginx template for custom reverse proxy setup
    ├── .dockerignore          # Excludes node_modules, dist, .env, git
    └── package.json           # Includes "start": "vite preview --host 0.0.0.0 --port 5173"
```

---

## 🚀 Quick Start (Production Mode)

### 1. Configure Environment Variables
Copy `.env.example` to `.env` in the root folder:
```bash
cd Website_Builder
cp .env.example .env
```
*(Verify your `DATABASE_URL` and `GEMINI_API_KEY` inside `.env`)*

### 2. Build & Launch Containers
```bash
docker compose up --build -d
```

### 3. Access the Application
- **Frontend App:** Open [http://localhost:5173](http://localhost:5173)
- **Backend API:** Open [http://localhost:3000/api/templates](http://localhost:3000/api/templates)

### 4. Manage Containers
```bash
# View real-time container logs
docker compose logs -f

# View running container status & health
docker compose ps

# Stop containers
docker compose down

# Stop and wipe volumes
docker compose down -v
```

---

## 🛠️ Development Mode (Live Hot Reloading)

When developing locally with Docker, use `docker-compose.dev.yml`. Any code changes in `./client/src` or `./server` will trigger automatic Hot-Module Replacement (HMR) or Nodemon restart inside the containers:

```bash
docker compose -f docker-compose.dev.yml up --build
```

- **Frontend (Vite HMR):** [http://localhost:5173](http://localhost:5173)
- **Backend (Nodemon):** [http://localhost:3000](http://localhost:3000)

---

## 📦 Running Containers Individually (Standalone)

### Backend Only

1. **Build the backend image:**
   ```bash
   cd Website_Builder/server
   docker build -t genweb-backend:latest .
   ```

2. **Run the backend container:**
   ```bash
   docker run -d \
     --name genweb-backend \
     -p 3000:3000 \
     --env-file .env \
     genweb-backend:latest
   ```

3. **Check container logs:**
   ```bash
   docker logs -f genweb-backend
   ```

---

### Frontend Only

1. **Build the frontend image:**
   ```bash
   cd Website_Builder/client
   docker build -t genweb-frontend:latest .
   ```

2. **Run the frontend container:**
   ```bash
   docker run -d \
     --name genweb-frontend \
     -p 5173:5173 \
     genweb-frontend:latest
   ```

---

## 🚢 Production Cloud Deployment (VPS / Ubuntu / AWS / DigitalOcean)

To deploy on a remote Linux server:

1. **Install Docker & Docker Compose on your VPS:**
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo usermod -aG docker $USER
   ```

2. **Clone your repository & navigate to `Website_Builder`:**
   ```bash
   git clone <your-repo-url>
   cd <your-repo-folder>/Website_Builder
   ```

3. **Create the `.env` file:**
   ```bash
   nano .env
   ```
   *Paste your production credentials, update `ALLOWED_ORIGINS` to include your domain (e.g. `https://yourdomain.com`).*

4. **Launch with Compose:**
   ```bash
   docker compose up --build -d
   ```

5. **(Optional) Setup SSL with Certbot / Reverse Proxy:**
   If using an external Nginx or Caddy reverse proxy for HTTPS:
   - Route `https://yourdomain.com` ➔ `http://127.0.0.1:80` (or `5173`)
   - Route `https://api.yourdomain.com` ➔ `http://127.0.0.1:3000`

---

## ⚙️ Environment Variables Reference

| Variable | Service | Default | Description |
| :--- | :--- | :--- | :--- |
| `PORT` | Backend | `3000` | Port Express listens on |
| `NODE_ENV` | Backend | `production` | Node runtime environment |
| `DATABASE_URL` | Backend | MongoDB URI | MongoDB connection string |
| `JWT_SECRET` | Backend | String | Secret key for JWT signing |
| `GEMINI_API_KEY` | Backend | API Key | Google Gemini AI Key |
| `GEMINI_MODEL` | Backend | `gemini-3.5-flash` | Gemini model name |
| `FIREBASE_PROJECT_ID`| Backend | `websitebuilder-ee244` | Firebase Project ID |
| `FIREBASE_WEB_API_KEY`| Backend | Web API Key | Firebase Web API Key |
| `ALLOWED_ORIGINS` | Backend | Localhost URLs | CORS whitelist |
| `VITE_SERVER_URL` | Frontend | `http://localhost:3000`| Backend API URL for client requests |
| `VITE_FIREBASE_API_KEY`| Frontend | Web API Key | Firebase API Key for client auth |

---

## 🔍 Troubleshooting

- **Port already in use:**
  If port `3000` or `5173` is already taken on your host machine, either terminate the process or remap the host port in `docker-compose.yml` (e.g. `"3001:3000"` or `"8080:80"`).
- **Frontend cannot reach backend:**
  Verify that `VITE_SERVER_URL` points to the URL accessible by the browser (e.g., `http://localhost:3000` or your VPS public IP / domain).
- **Rebuilding after changes:**
  Always append `--build` when rebuilding images:
  `docker compose up --build -d`

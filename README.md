# 🏛️ VillageVerse AI – An AI-Powered Digital Twin for Intelligent Village Development

[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Three.js](https://img.shields.io/badge/Three.js-3D_Twin-black?logo=three.js&logoColor=white)](https://threejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-4169E1?logo=postgresql&logoColor=white)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **VillageVerse AI** is a production-ready, government-grade full-stack web application designed for the **Department of Rural Development & Panchayat Raj, Government of Karnataka**. Modeled on **Shivalli Gram Panchayat, Mandya District, Karnataka (GP-KA-MND-042)**, it bridges physical village infrastructure with an interactive cyber-physical 3D Digital Twin, real-time IoT sensors, predictive AI simulation engines, and bilingual conversational interfaces (English & ಕನ್ನಡ).

---

## 🌟 Highlights & Key Capabilities

1. **True 3D Village Digital Twin**: Interactive 3D WebGL viewer (Three.js) with real geometry of administrative buildings, overhead water reservoirs, lake bunds, solar microgrids, schools, and hospitals, paired with Leaflet 2D GIS satellite view.
2. **What-If Policy & Infrastructure Simulator**: Interactive scenario sandbox allowing Panchayat Officers to simulate interventions (e.g. build 2 water tanks, add 50 kWp solar, repair 5 km roads) and observe instant recalculation of Village Health Score, budget outlay, and carbon impact.
3. **AI Crop Disease Diagnosis & Precision Agriculture**: Upload crop leaf images or input symptoms to receive instant CNN disease identification with treatment recommendations in both English and Kannada.
4. **IoT Water Leak Detection & Quality**: Acoustic pressure differential alarms, groundwater level monitoring, and WHO-compliant drinking water potability index (TDS, pH, turbidity).
5. **Decentralized Solar Microgrid**: Real-time load curve tracking 120 kWp community solar array and LoRaWAN smart streetlights with 38% energy savings.
6. **AI Grievance Redressal**: Citizens can submit geotagged complaints with photo uploads and voice memos; automated AI triages category, urgency score, and department assignment.
7. **Bilingual AI Village Chatbot**: Instant voice and text conversational assistant answering queries about water levels, mandi prices, and welfare schemes (PM-KUSUM, Jal Jeevan Mission, MGNREGA, Gruha Jyothi).
8. **UN SDG Compliance Dashboard**: Tracks 7 core United Nations Sustainable Development Goals (SDG 3, 4, 6, 7, 9, 11, 13) at the village level.
9. **Role-Based Access Control**: Tailored dashboards for **Admin**, **Panchayat Officer (PDO)**, **Engineer**, **Agriculture Officer**, **Healthcare Officer**, and **Citizen** with a 1-click switcher for hackathon demonstration.

---

## 📂 Project Structure

```
VillageVerse AI/
├── backend/                  # Production Node.js & Express.js REST API
│   ├── src/
│   │   ├── data/
│   │   │   └── villageStore.js   # Realistic Shivalli Gram Panchayat Data
│   │   ├── routes/
│   │   │   └── api.js            # Complete REST API for all 20 modules
│   │   └── server.js             # Express server + Socket.IO + Multer
│   ├── .env.example
│   └── package.json
│
├── frontend/                 # React 18 + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/           # FloatingChatbot, StatCard, Skeletons
│   │   │   └── layout/           # GovernmentBanner, Navbar, Sidebar, AppLayout
│   │   ├── context/              # AuthContext, LanguageContext, ThemeContext
│   │   ├── pages/                # All 20 Panchayat Module Pages + Auth
│   │   ├── services/             # Axios API Client & Fallback Mock Data
│   │   ├── types/                # Strict TypeScript interfaces
│   │   ├── App.tsx               # Route Definitions
│   │   ├── main.tsx
│   │   └── index.css             # Glassmorphism & Government Theme CSS
│   ├── netlify.toml              # Netlify Deployment Configuration
│   └── package.json
│
├── database/                 # Production PostgreSQL DDL Schema & Seeds
│   ├── schema.sql            # 15 Relational Tables with constraints & indexes
│   └── seed.sql              # Realistic Karnataka Village Sample Data
│
├── docs/                     # Full Documentation
│   ├── API_DOCUMENTATION.md  # Complete REST API reference
│   └── ARCHITECTURE.md       # System design & RBAC matrix
│
├── package.json              # Monorepo orchestration scripts
└── README.md
```

---

## ⚡ Quick Start (Run Locally in 2 Minutes)

### Prerequisites
- **Node.js** (v18 or higher; v24 recommended)
- **npm** or **pnpm**

### Step 1: Install Dependencies
```bash
# In the root project folder:
npm install
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### Step 2: Start Backend & Frontend Simultaneously
```bash
# From the root folder:
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000/api`
- **Backend Health Check**: `http://localhost:5000/health`

---

## 👥 Demo Role Credentials (Hackathon Evaluator Quick Access)

The app comes pre-seeded with test accounts for all departments. You can either log in with the credentials below or use the **"1-Click Role Login"** buttons on the login page:

| Role | Email | Password | Primary Module Focus |
|---|---|---|---|
| **Admin** | `admin@villageverse.gov.in` | `password123` | Complete Village Governance & Settings |
| **Panchayat Officer** | `panchayat@villageverse.gov.in` | `password123` | Development Planning & Grievances |
| **Engineer** | `engineer@villageverse.gov.in` | `password123` | Digital Twin, Roads & Works |
| **Agriculture Officer** | `agriculture@villageverse.gov.in` | `password123` | Soil Health, Crops & Mandi Rates |
| **Healthcare Officer** | `healthcare@villageverse.gov.in` | `password123` | PHC Telemedicine & Ambulances |
| **Citizen** | `citizen@villageverse.gov.in` | `password123` | Grievance Filing & Public Telemetry |

> 💡 **Hackathon Tip:** Once logged in, use the **"Role: [Role Name]"** dropdown in the top header ribbon to switch between officer views instantly without re-authenticating!

---

## 🌐 20 Panchayat Sidebar Modules Overview

| # | Module | Core Functionality |
|---|---|---|
| 01 | **Dashboard** | AI Village Health Score (86/100), Population, Households, Diurnal Weather, KPIs & Live Stream |
| 02 | **Digital Twin** | 3D Interactive WebGL Village Twin + 2D GIS Satellite Map with asset inspector |
| 03 | **Agriculture** | Sugarcane, Paddy, Ragi farmlands, Mandya APMC mandi rates, AI leaf disease diagnostics |
| 04 | **Water Resources** | Overhead reservoirs, borewell table depth, potability score (TDS, pH), acoustic leak alarms |
| 05 | **Roads & Works** | Bitumen & concrete pavement conditions, PCI score (81/100), pothole clustering, scheduled repairs |
| 06 | **Electricity** | 120 kWp solar microgrid, transformer heat and load telemetry, IoT streetlight dimming (38% power savings) |
| 07 | **Healthcare** | Primary Health Centre (PHC) bed vacancies, 108 GPS ambulances, cold-chain vaccines, IDSP disease radar |
| 08 | **Education** | GHPS schools, smart TV classrooms, 94.2% daily attendance, 100% verified midday meal logs |
| 09 | **Waste Management** | Ultrasonic IoT dustbin levels, Swachh Vahini electric autos, compost production (3,400 kg/mo) |
| 10 | **Environment** | Continuous optical AQI (42 Good), PM2.5/PM10, 12,450-tree census, net carbon negative status |
| 11 | **Disaster Prediction** | Cauvery basin flood modeling, KSNDMC pre-monsoon lightning sirens, cyclone shelters |
| 12 | **AI Future Prediction** | 7-day, 30-day, and 1-year forecasting across power, water, road decay, and crop health |
| 13 | **AI Development Planner** | ₹1.85 Cr annual budget allocation, project ranking, and social ROI optimizer |
| 14 | **What-If Simulation** | Live sliders for solar, trees, roads, check dams with instant reactive charts and health score gains |
| 15 | **Complaint Management** | Citizen grievance filing with photo and voice memo attachments, AI urgency classification, SLA tracking |
| 16 | **Sustainability Dashboard** | United Nations Sustainable Development Goals (SDG 3, 4, 6, 7, 9, 11, 13) monitoring |
| 17 | **AI Village Chatbot** | Floating and full-page conversational AI in Kannada and English for Gram Panchayat schemes |
| 18 | **Reports & Analytics** | One-click printable government DPR view and CSV/Excel exports |
| 19 | **User Management** | Role-based access control (Admin, Panchayat Officer, Engineer, Agriculture Officer, Healthcare Officer, Citizen) |
| 20 | **Settings** | Village coordinates, dark/light glassmorphism theme, database diagnostics, and backup utilities |

---

## 🚀 Cloud Deployment

### Frontend (Netlify)
1. Fork or push this repository to GitHub.
2. In [Netlify](https://www.netlify.com/): **Add new site** > **Import an existing project**.
3. Set **Base directory** to `frontend`.
4. Set **Build command** to `npm run build`.
5. Set **Publish directory** to `dist`.
6. Add Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
7. Click **Deploy Site**. The included `netlify.toml` automatically handles SPA routing and redirects!

### Backend (Render / Railway)
1. In [Render](https://render.com/): Create a new **Web Service**.
2. Connect your repository.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Set Environment Variables:
   - `PORT` = `5000`
   - `NODE_ENV` = `production`
   - `JWT_SECRET` = `your_secure_secret_key`
   - `DATABASE_URL` = `your_supabase_postgresql_url` (optional: works with zero-config in-memory store)

---

## 🗄️ Database Setup (Supabase / PostgreSQL)

1. Create a project in [Supabase](https://supabase.com/) or any PostgreSQL host.
2. Open the **SQL Editor**.
3. Run the DDL script in `database/schema.sql`.
4. Run the seed script in `database/seed.sql`.
5. Copy the connection string to `backend/.env` under `DATABASE_URL`.

---

## 📜 License & Acknowledgments

This platform is developed under the **MIT License**.  
Crafted with pride for smart rural transformation and self-reliant Gram Panchayats (*Atmanirbhar Gram Swaraj*).

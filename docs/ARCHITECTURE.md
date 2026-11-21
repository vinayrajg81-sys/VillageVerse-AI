# VillageVerse AI – System Architecture & Design Specification

## System Overview
**VillageVerse AI** is an AI-powered, government-grade Digital Twin platform engineered for intelligent village planning and Gram Panchayat administration. Modeled on **Shivalli Gram Panchayat, Mandya District, Karnataka**, the system bridges physical rural infrastructure with cyber-physical digital models through real-time IoT telemetry, AI simulation, and bilingual conversational interfaces.

```
+-----------------------------------------------------------------------------------+
|                           VILLAGEVERSE AI FRONTEND                                |
|  - React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion                    |
|  - 3D WebGL Digital Twin (Three.js) + 2D GIS Spatial Map (Leaflet)                 |
|  - 20 Departmental Modules + Bilingual Support (English / ಕನ್ನಡ)                  |
+------------------------------------------+----------------------------------------+
                                           | HTTP REST / WebSockets
                                           v
+-----------------------------------------------------------------------------------+
|                            EXPRESS.JS BACKEND RUNTIME                             |
|  - Node.js 24 + Express + Socket.IO + JWT Authentication                          |
|  - Multer File / Voice Memo Upload Handlers                                       |
|  - AI Decision Engine: Crop Disease CNN, Leak Acoustic, What-if Simulator          |
+------------------------------------------+----------------------------------------+
                                           | Database DDL / SQL Connectors
                                           v
+-----------------------------------------------------------------------------------+
|                           POSTGRESQL / SUPABASE DATABASE                          |
|  - 15 Relational Tables: Users, Digital Twin Assets, Farmlands, Water Telemetry,   |
|    Roads, Electricity Grid, Healthcare, Education, Waste, Environment, Disaster   |
+-----------------------------------------------------------------------------------+
```

---

## Departmental Coverage (All 20 Modules)
1. **Dashboard**: Composite Village Health Score (86/100), Population, Households, KPIs, Diurnal Weather, Activity Feed.
2. **Digital Twin**: 3D interactive village model with clickable asset mesh inspection + 2D satellite GIS.
3. **Agriculture**: Sugarcane, Paddy, Ragi farmlands, Mandya APMC mandi rates, AI leaf disease diagnostics.
4. **Water Resources**: Overhead reservoirs, borewell table depth, potability score (TDS, pH), acoustic leak alarms.
5. **Roads & Works**: Bitumen & concrete pavement conditions, PCI score (81/100), pothole clustering, scheduled repairs.
6. **Electricity**: 120 kWp solar microgrid, transformer heat and load telemetry, IoT streetlight dimming (38% power savings).
7. **Healthcare**: Primary Health Centre (PHC) bed vacancies, 108 GPS ambulances, cold-chain vaccines, IDSP disease radar.
8. **Education**: GHPS schools, smart TV classrooms, 94.2% daily attendance, 100% verified midday meal logs.
9. **Waste Management**: Ultrasonic IoT dustbin levels, Swachh Vahini electric autos, compost production (3,400 kg/mo).
10. **Environment**: Continuous optical AQI (42 Good), PM2.5/PM10, 12,450-tree census, net carbon negative status.
11. **Disaster Prediction**: Cauvery basin flood modeling, KSNDMC pre-monsoon lightning sirens, cyclone shelters.
12. **AI Future Prediction**: 7-day, 30-day, and 1-year forecasting across power, water, road decay, and crop health.
13. **AI Development Planner**: ₹1.85 Cr annual budget allocation, project ranking, and social ROI optimizer.
14. **What-If Simulation Sandbox**: Live sliders for solar, trees, roads, check dams with instant reactive charts and health score gains.
15. **Complaint Management**: Citizen grievance filing with photo and voice memo attachments, AI urgency classification, SLA tracking.
16. **Sustainability Dashboard**: United Nations Sustainable Development Goals (SDG 3, 4, 6, 7, 9, 11, 13) monitoring.
17. **AI Village Chatbot**: Floating and full-page conversational AI in Kannada and English for Gram Panchayat schemes.
18. **Reports & Analytics**: One-click printable government DPR view and CSV/Excel exports.
19. **User Management**: Role-based access control (Admin, Panchayat Officer, Engineer, Agriculture Officer, Healthcare Officer, Citizen).
20. **Settings**: Village coordinates, dark/light glassmorphism theme, database diagnostics, and backup utilities.

---

## Role-Based Access Control (RBAC) Matrix
| Module | Admin | Panchayat Officer | Engineer | Agri Officer | Health Officer | Citizen |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Core Dashboard | Full | Full | Full | Full | Full | Read |
| 3D Digital Twin | Edit | Edit | Edit | Read | Read | Read |
| Agriculture & Soil | Full | Read | Read | Full | Read | Read |
| Water Resources | Full | Full | Full | Read | Read | Read |
| Roads & Infrastructure | Full | Full | Full | Read | Read | Report |
| Electricity & Solar | Full | Full | Full | Read | Read | Read |
| Healthcare & PHC | Full | Full | Read | Read | Full | Read |
| Education & Midday Meal| Full | Full | Read | Read | Read | Read |
| Waste Management | Full | Full | Read | Read | Read | Read |
| Environment & AQI | Full | Full | Full | Full | Full | Read |
| Disaster Early Warning | Broadcast| Broadcast| Read | Read | Read | Read |
| Development Planner | Full | Full | Edit | Suggest | Suggest | Suggest |
| What-If Simulation | Full | Full | Full | Full | Full | Full |
| Complaint Management | Full | Assign | Inspect | Inspect | Inspect | File/Track |
| User Directory & Settings| Full | View | View | View | View | Profile |

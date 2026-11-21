# VillageVerse AI – REST API & WebSocket Documentation

**Base URL**: `http://localhost:5000/api`  
**Reference Gram Panchayat**: Shivalli Gram Panchayat, Mandya District, Karnataka (`GP-KA-MND-042`)  
**Authentication**: JWT Bearer token in `Authorization: Bearer <token>` header.

---

## 1. Authentication & Role Management
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Login with email/password or fast role selector. Returns JWT and user payload. |
| `POST` | `/api/auth/signup` | Register new Citizen / Panchayat officer account. |
| `POST` | `/api/auth/forgot-password` | Dispatch 6-digit verification OTP to registered mobile. |
| `POST` | `/api/auth/verify-otp` | Validate 6-digit OTP code (`849201`). |
| `GET` | `/api/auth/me` | Fetch currently authenticated user session. |
| `GET` | `/api/users` | List all registered village users and departmental roles. |
| `PUT` | `/api/users/:id/role` | Update officer role assignment. |

---

## 2. Core Dashboard
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/dashboard/stats` | Fetches Village Health Score (86/100), Population (4,820), Households (1,140), Department KPIs, Weather, and Live Activity Stream. |

---

## 3. Digital Twin & Spatial Infrastructure
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/digital-twin/assets` | Retrieve 3D/2D assets (buildings, tanks, lakes, borewells, roads, lights, solar). Query params: `category`, `status`. |
| `GET` | `/api/digital-twin/assets/:id` | Detailed telemetry, maintenance history, and AI recommendations for an asset. |
| `POST` | `/api/digital-twin/assets` | Register a new asset with GPS coordinates and 3D positioning. |

---

## 4. Agriculture & Soil Telemetry
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/agriculture` | Farmland distribution, crop acreage (Sugarcane, Paddy, Ragi, Banana, Mulberry), soil moisture sensors, and live Mandya APMC mandi rates. |
| `POST` | `/api/agriculture/crop-disease/detect` | AI Leaf diagnosis returning disease name, severity, and treatments in English & Kannada. |
| `POST` | `/api/agriculture/fertilizer-recommend` | Fertilizer dosage optimizer based on soil NPK values. |

---

## 5. Water Resources
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/water` | Reservoir levels, daily consumption (385 KLD), groundwater table depth (48.2 ft), and potability metrics (TDS, pH, turbidity). |
| `POST` | `/api/water/trigger-leak-scan` | Initiates acoustic IoT scan across 14.8 km distribution pipelines. |

---

## 6. Roads & Public Works
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/roads` | Road surface composition (28.6 km), PCI score (81/100), pothole clusters, and scheduled repairs. |
| `POST` | `/api/roads/report-damage` | Citizen/Engineer road damage report submission. |

---

## 7. Electricity & Solar Microgrid
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/electricity` | Daily power draw (5,400 kWh), 120 kWp community solar microgrid generation, transformer temperatures, and streetlight power savings. |

---

## 8. Healthcare & PHC Telemedicine
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/healthcare` | Shivalli PHC bed occupancy, doctor rosters, live 108 GPS ambulances, essential medicine stocks, and IDSP disease radar. |

---

## 9. Education & Anganwadis
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/education` | School enrollment (580 students), attendance rate (94.2%), literacy rate (82.5%), and midday meal verification status. |

---

## 10. Waste Management & EV Fleet
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/waste` | Smart dustbin ultrasonic fill levels, Swachh Vahini EV auto routes, and monthly organic compost yields. |
| `POST` | `/api/waste/dispatch-vehicle` | Dispatch vehicle re-route for urgent secondary collection. |

---

## 11. Environmental Quality & AQI
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/environment` | Real-time AQI (42 Good), PM2.5, PM10, ambient temperature, humidity, 12,450-tree census, and net-carbon negative status. |

---

## 12. Disaster Prediction & Early Warning
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/disaster` | Cauvery flood modeling, drought indices, KSNDMC lightning advisory, and safe evacuation shelter directory. |
| `POST` | `/api/disaster/broadcast-alert` | Simulates multi-channel emergency broadcast (Siren, SMS blast, WhatsApp bot). |

---

## 13. AI Future Predictive Horizons
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/forecast` | Multi-horizon predictive forecasts (7-day, 30-day, 1-year) across water, electricity, road decay, and crop health. |

---

## 14. AI Development Planner
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/planner` | Sanctioned budget (₹1.85 Cr), active project ranking, and social ROI scores. |
| `POST` | `/api/planner/projects` | Submit new capital project for Gram Sabha evaluation. |

---

## 15. What-If Simulation Sandbox
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/simulation/run` | Simulates capital policy parameters (solar kW, tree plantation count, road repairs km, check dams, hospitals). Returns predicted changes in village health, budget, carbon, and crop yield. |

---

## 16. Grievance Redressal / Complaints
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/complaints` | Fetch citizen complaints filtered by category, status, or priority. |
| `POST` | `/api/complaints` | Submit geotagged complaint with image and voice note attachments and AI priority auto-triaging. |
| `PATCH` | `/api/complaints/:id/status` | Advance grievance resolution status and record timeline notes. |

---

## 17. Sustainability & UN SDGs
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/sustainability` | UN SDG 2030 indicators (SDG 3, 4, 6, 7, 9, 11, 13) and carbon neutrality target tracking. |

---

## 18. Conversational AI Assistant
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/chatbot/message` | Natural language interface answering questions regarding village schemes, crops, water, and emergency contacts in English & Kannada. |

---

## 19. DPR Reports & Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/reports` | Comprehensive departmental performance summaries. |
| `POST` | `/api/reports/ai-summary` | Generates AI executive review for Gram Sabha meetings. |

---

## 20. System Settings & Backup
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/settings` | Village metadata, coordinates, and database health. |
| `POST` | `/api/settings/backup` | Create snapshot backup of telemetry store. |
| `POST` | `/api/settings/reset` | Restore demo baseline data. |

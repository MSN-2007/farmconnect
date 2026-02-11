# 📊 FarmConnect - Resource & Data Architecture Report

This report provides a comprehensive overview of the data sources, AI training methodologies, and technical infrastructure used to power the FarmConnect platform.

---

## 1. 🤖 AI Intelligence Engine (Assistant)

### **Current Implementation:**
The AI Assistant currently uses an **Expert-Defined Knowledge Base** (`KNOWLEDGE_BASE` in `ai-assistant.jsx`). This consists of high-quality, verified agricultural advice structured by categories like Irrigation, Pests, Seeds, and Market Strategy.

### **Production Strategy:**
In a full production environment, this is replaced by a **RAG (Retrieval-Augmented Generation)** framework:
- **Core Model:** Google Gemini Pro or GPT-4o.
- **Data Source:** We index thousands of PDF documents and research papers from:
  - **ICAR (Indian Council of Agricultural Research)**
  - **FAO (Food and Agriculture Organization of the UN)**
  - **State Agricultural Universities (PAU, TNAU, etc.)**
- **Process:** When a farmer asks a question, the AI retrieves the specific paragraph from the official Govt. guide and "rewrites" it in the farmer's local language.

---

## 2. 🔍 AI Lens (Pest & Disease Detection)

### **Training Data Origins:**
The AI Lens models are trained on massive, open-source and proprietary agricultural datasets.
- **Primary Source:** [PlantVillage Dataset](https://plantvillage.psu.edu/) (50,000+ images of healthy and diseased leaves).
- **Secondary Source:** [CGIAR Research Datasets](https://www.cgiar.org/) for specific tropical crops and soil conditions.
- **Synthetic Data:** We use Generative AI to create augmented images of pests in different lighting and angles to improve accuracy for low-quality mobile cameras.

### **Model Architecture:**
- **Technology:** TensorFlow.js / Lite.
- **Method:** **Transfer Learning** on a MobileNetV2 or EfficientNet backbone. These models are chosen because they are lightweight enough to run directly on a smartphone's processor without needing internet (Edge AI).

---

## 3. 📈 Market Prices & Telemetry

### **Current Implementation:**
We use a **Dynamic Probability Engine** (`generatePriceHistory` in `market-prices.jsx`) that simulates realistic price fluctuations based on seasonal trends and crop volatility.

### **Digital Resource Integrations:**
In production, the app connects to live APIs to pull real-time data:
1.  **Market Prices (Mandis):** [AGMARKNET API](https://agmarknet.gov.in/) (Govt. of India) and **NCDEX** for commodity futures.
2.  **Weather Data:** [OpenWeatherMap API](https://openweathermap.org/api) or **IBM The Weather Company** for precise GPS-based micro-climate forecasts.
3.  **Agri News:** [NewsAPI.org](https://newsapi.org/) filtered with farming-specific query tokens like `kisan`, `mandi`, `fertillizer limit`, and `monsoon arrival`.

---

## 4. 🗄️ Offline Data Architecture (The "Vault")

To ensure the app works in zero-signal zones, we use a multi-layered local storage system:

- **IndexedDB:** A browser-side database (`offline-data-manager.js`) that stores the heavy AI models (20MB+) and price history caches.
- **Service Workers:** Caches the UI (HTML/CSS/JS) so the website opens even without a network.
- **Data Packs:** We pre-pack 15 days of weather and 30 days of price trends into small JSON files that the farmer downloads once when they have Wi-Fi.

---

## 5. 🛠️ Technology Stack Overview

| Resource Layer | Technology Used |
| :--- | :--- |
| **Frontend Framework** | React 19 + Vite (Speed optimized) |
| **Styling** | Vanilla CSS + Tailwind (Nature-inspired aesthetics) |
| **Icons** | Lucide React |
| **Database (Loca)** | IndexedDB (Structured persistence) |
| **Charts & Graphs** | Custom SVG Data Mapping (Visual Analytics) |
| **AI Processing** | Client-side Logic + TensorFlow (Offline AI) |

---

## 🛡️ Data Ethics & Farmer Privacy
- **No Data Harvesting:** FarmConnect does not sell farm yield data to 3rd party insurers. 
- **Local First:** All image analysis for pests stays on the farmer's device; no photos are uploaded to the cloud unless the farmer explicitly shares them in the Community.
- **Transparency:** All expert advice mentions the source (e.g., "Advice derived from ICAR Wheat Handbook 2024").

---
*Report Generated: Feb 8, 2026*
*Architecture Version: 2.1.0-OfflineReady*

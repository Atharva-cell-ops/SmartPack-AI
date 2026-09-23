# SmartPack AI — Food Packaging Decision-Support & Barrier Engineering System

An industrial-grade decision-support and material screening platform for food packaging technologists, QA/QC teams, and agri-entrepreneurs. SmartPack AI calculates physicochemical barrier requirements, models barrier kinetics under varying storage and transit stresses, and determines optimal multi-layer substrate configurations.

---

## 🌟 Key Features

- **10-Stage Recommendation Pipeline**: Evaluates food sensitivities, storage ambient RH/temperature, transport vibration/shock, cost tolerances, and circularity goals.
- **Physical Barrier Kinematics**: Calibrated ASTM D3985 (OTR) and ASTM F1249 (WVTR) thresholds, water activity ($a_w$) equilibrium models, and respiration curves.
- **Hard Constraint Engine**: Automatically flags and rejects incompatible combinations (e.g. respiring fresh produce in hermetic zero-OTR aluminium foil).
- **12-Point Packaging Prescription Sheet**: Prescribes container format, substrate stack, thickness (gauge), seal technology, MAP gas flush composition, and cost/sustainability metrics.
- **Materials Specification Registry**: Database of commercial, multi-layer, and bio-based substrates with instant Technical Data Sheet (TDS) viewers.
- **Side-by-Side Comparator**: Matrix comparison of up to 3 packaging substrates with visual score benchmarks.
- **What-If Sensitivity Sandbox**: Dynamic stress-testing across temperature shifts, humidity ranges, transit durations, and cold-chain modes.
- **Package Integrity & Defect Audit**: Diagnostic module to benchmark current packaging against target requirements and identify root-cause failure modes.
- **Auditable Engineering Dossier**: Printable report summary with exportable JSON specifications.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `pnpm` / `yarn`

### Installation

1. **Clone your repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000` (or the port indicated in your console).

---

## 🛠️ Available Scripts

- `npm run dev` — Starts the Vite development server with HMR.
- `npm run build` — Builds production-ready client bundles into `dist/`.
- `npm run preview` — Locally preview the production build.
- `npm run lint` — Runs TypeScript compiler checks (`tsc --noEmit`).

---

## 📁 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Dev Server**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation**: [Motion](https://motion.dev/)

---

## ⚖️ Statutory & Technical Disclaimer

*Recommendations are for preliminary screening and engineering decision-support only. Physical laboratory validation (ASTM F1249 / ASTM D3985), food safety migration testing, and applicable statutory clearances (e.g., FSSAI, US FDA 21 CFR, EU 10/2011) must be conducted prior to commercial manufacturing.*

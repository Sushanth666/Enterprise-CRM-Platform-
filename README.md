<p align="center">
  <img src="assets/vedaflow-logo.svg" alt="VedaFlow Logo" width="380" />
</p>

<h1 align="center">VedaFlow — Sales Intelligence Platform</h1>

<p align="center">
  <strong>Modern Enterprise Sales Intelligence &amp; CRM Suite built for the Indian Business Ecosystem.</strong><br>
  <em>Derived from &ldquo;Veda&rdquo; (insight/knowledge) + &ldquo;Flow&rdquo; (deal velocity and operational agility).</em>
</p>

<p align="center">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.6-blue.svg" alt="TypeScript" /></a>
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-18.3-61dafb.svg" alt="React" /></a>
  <a href="https://redux-toolkit.js.org/"><img src="https://img.shields.io/badge/Redux_Toolkit-2.3-purple.svg" alt="Redux Toolkit" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8.svg" alt="Tailwind CSS" /></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Vitest-45_Tests_Passing-brightgreen.svg" alt="Vitest" /></a>
</p>

---

## 📌 Executive Summary

**VedaFlow** is an enterprise-grade Sales Intelligence and Customer Relationship Management (CRM) platform engineered specifically for Indian high-growth enterprises and multinationals. It consolidates lead tracking, visual deal pipeline progression, customer lifecycle valuation, task execution, and team quota performance into a unified, high-performance workspace.

### 🇮🇳 Built for Indian Enterprise Operations:
- **Currency & Denominations**: Native Indian Rupee formatting (`₹`) with intelligent Lakhs (`₹ L`) and Crores (`₹ Cr`) compact valuation.
- **Enterprise Ecosystem**: Localized company accounts (TCS, Reliance Retail, Infosys, Razorpay, HDFC, Bharti Airtel).
- **Timezone & Regional Operations**: IST (Asia/Kolkata) with regional sales hub tracking across Bengaluru, Mumbai, NCR (Gurugram/Noida), and Hyderabad.
- **Data Privacy & Governance**: DPDP Act 2023 compliance tags, 256-bit TLS encryption, and SOC2 Type II audit readiness.

---

## 🌟 Key Functional Modules

### 1. 🎯 Lead Management (`src/modules/leads`)
- **Lead Capture & Scoring**: Inbound lead recording with AI-weighted intent score (0–100 meter).
- **Lead Qualification Lifecycle**: Move leads through stages: *New*, *Contacted*, *Qualified*, *Proposal*, *Negotiation*, *Converted*, and *Unqualified*.
- **1-Click Conversion Workflow**: Seamlessly convert high-intent leads into pipeline opportunities and enterprise accounts with localized address pre-population.

### 2. 📊 Visual Sales Pipeline (`src/modules/pipeline`)
- **7-Stage Kanban Board**: *Discovery* → *Qualification* → *Proposal* → *Negotiation* → *Contract Sent* → *Closed Won* / *Closed Lost*.
- **Column Analytics**: Real-time aggregated pipeline value and opportunity count per stage.
- **Interactive Opportunity Cards**: Stage transitions, win confidence bars, priority flags (*Urgent*, *High*, *Medium*, *Low*), and assigned AE portraits.
- **Detailed Deal Modal**: Commercial terms, contract review, and automated win/loss probability calculation.

### 3. 🏢 Customer Directory & Health (`src/modules/customers`)
- **Enterprise Account Dossiers**: Annual Recurring Revenue (ARR), contract health score (0–100), key executive contacts, and industry vertical.
- **Tier Segmentation**: *Enterprise (Tier 1)*, *Mid-Market*, *Growth*, and *Startup*.
- **Unified Timeline**: View linked pipeline deals, pending deliverable tasks, and touchpoint activity history per account.

### 4. ✅ Task & Action Items (`src/modules/tasks`)
- **Status Workflow**: *To Do*, *In Progress*, and *Completed*.
- **Entity Linking**: Link tasks directly to Opportunities, Leads, or Customer Accounts.
- **Deadlines & Overdue Detection**: Smart due-date tracking with instant visual overdue warnings.

### 5. 📞 Omnichannel Activity Tracking (`src/modules/activities`)
- **Touchpoint Logging**: Record Calls, Video Demos, Email exchanges, Meeting notes, and Contract updates.
- **Audit History**: Complete chronological log of performer, duration, outcome, and timestamp.

### 6. 📈 Executive Analytics & Reporting (`src/modules/analytics`, `src/modules/dashboard`)
- **Top Executive KPIs**: ARR revenue, active pipeline volume, weighted win rate, and sales rep quota pace.
- **Recharts Data Visualizations**:
  - Revenue velocity trajectory (Interactive AreaChart comparing actual closed revenue vs quarterly target).
  - Pipeline stage volume & distribution (BarChart).
  - Lead attribution channels (Donut PieChart).
- **Rep Quota Leaderboard**: Real-time performance tracking and quota attainment for regional sales directors and account reps.

### 7. 🔐 Authentication & Session Security (`src/modules/auth`)
- **Custom Demo Access**:
  - Starts completely blank by default for real logins.
  - **Auto-Fill Demo Credentials**: 1-click fill for **Priya Nair** (*Enterprise AE, Bengaluru*) and **Rajesh Patel** (*SDR Lead, Mumbai*).
  - **Clear to Blank**: Instant form reset.
- **Session Persistence**: Stored via `localStorage` so refreshing the page (`F5`) stays logged in on the exact working tab.

### 8. 🚀 Next-Gen Enterprise Sales Accelerators (Newly Implemented)
- **⚡ AI Deal Velocity & Slip-Risk Meter (`src/core/utils/dealHealth.ts`)**:
  - Calculates real-time deal health score (0–100%) and categorizes velocity as 🟢 Healthy, 🟡 Attention, or 🔴 Slip Risk.
  - Analyzes days stagnant in stage, proximity to closing date, and probability drift.
  - Generates recommended execution playbooks and warning flags directly on Kanban cards and deal dossiers.
- **📜 GST-Compliant Commercial Quotation & Printable PDF (`src/modules/pipeline/GstQuotationModal.tsx`)**:
  - Commercial estimator supporting SAC Code `998313` (IT Software SaaS).
  - Toggles between Intra-state (CGST 9% + SGST 9%) and Inter-state (IGST 18%).
  - Generates formal Indian Tax Quotations with 1-click browser PDF print preview dialog.
- **💬 WhatsApp Enterprise Outreach & CRM Activity Sync (`src/modules/activities/WhatsAppModal.tsx`)**:
  - Direct 1-click WhatsApp web/app launch to client phone numbers.
  - Pre-crafted templates: Proposal Follow-Up, Tech Architecture Demo, and Contract Finalization.
  - Automatically records notes and timeline activities in Redux upon dispatch.
- **🤖 AI Meeting Transcript Summarizer (`src/modules/activities/AiTranscriptSummarizerModal.tsx`)**:
  - Extracts key objections, client budgets, timelines, decision makers, and action items from call recordings.
  - 1-click syncs extracted meeting dossiers directly into CRM activity feeds.
- **💰 Sales Commission & OTE Incentive Simulator (`src/modules/analytics/CommissionCalculatorWidget.tsx`)**:
  - Dynamic commission simulator with progressive tier accelerators (8% standard, 12% above 100% quota, 15% super-achiever).
  - Real-time deal projection slider showing immediate commission payouts for closing pipeline deals.
- **📅 Interactive Demo Slot & Meeting Scheduler (`src/modules/activities/MeetingSchedulerModal.tsx`)**:
  - IST-localized meeting booker with preset duration options (15m, 30m, 45m, 60m).
  - Generates instant Google Meet / Zoom invite links and automatically schedules a pre-demo preparation task in the CRM.
- **📊 Multi-Format Executive Analytics Export (`src/core/utils/exportReport.ts`, `ExportFormatModal.tsx`)**:
  - Interactive modal offering choice between **Microsoft Excel (CSV with UTF-8 BOM and ₹ currency preservation)** and **Printable Executive PDF Document**.

---

## 🎨 Visual Identity & Theme System

- **Brand Emblem**: Symmetrical, glowing copper infinity symbol (`∞`) in a rounded obsidian badge with top-left rim highlight.
- **Animated Browser Tab**: Continuous character-by-character marquee ticker (`VedaFlow - Sales Intelligence Platform • `) across the browser tab title.
- **Dynamic Themes**:
  - **Sunset Copper (Default)**: Deep obsidian & dark espresso background (`#140e0c`) paired with warm metallic copper and rose-bronze accents (`#ca5e3a`, `#e08a68`, `#f59e0b`).
  - **Sapphire Blue**: Crisp, high-contrast enterprise SaaS light mode (`#2563eb`).

---

## 🏗️ Domain-Driven Feature-Sliced Architecture

The codebase is organized into modular domain boundaries for maximum maintainability:

```
src/
├── app/                  # Application root & Redux store
│   ├── store/index.ts    # Typed Redux store, useDispatch, useSelector hooks
│   └── App.tsx           # Theme injector, layout provider, tab routing, tab marquee hook
├── core/                 # Shared foundational primitives & brand
│   ├── brand/            # VedaFlowLogo (Infinity emblem + typography)
│   ├── components/       # Reusable UI primitives (Button, Modal, Input, Badge, Card, Avatar, Toast)
│   ├── constants/        # Theme definitions (Sunset Copper, Sapphire Blue)
│   ├── hooks/            # useTabTitleMarquee (Browser tab ticker animation)
│   ├── types/            # TypeScript CRM domain models (crm.ts)
│   └── utils/            # Indian currency formatters (₹, L, Cr), date & stage helpers
├── layout/               # Application chrome
│   ├── Layout.tsx        # Responsive layout shell & mobile drawer
│   ├── Navbar.tsx        # Search, quick create, activity dropdown, user menu
│   └── Sidebar.tsx       # Collapsible navigation, active states, brand header
├── modules/              # Self-contained business domains
│   ├── auth/             # AuthPage, authSlice, UserProfileModal
│   ├── dashboard/        # MetricsSummary, RevenueChart, Funnel, TopDeals, RepLeaderboard
│   ├── leads/            # LeadManagementView, LeadList, LeadFormModal, LeadDetailModal, leadsSlice
│   ├── pipeline/         # PipelineBoard, PipelineColumn, DealCard, DealDetailModal, dealsSlice
│   ├── customers/        # CustomerList, CustomerProfileView, CustomerFormModal, customersSlice
│   ├── tasks/            # TaskList, TaskCard, TaskFormModal, tasksSlice
│   ├── activities/       # ActivityFeed, LogActivityModal, activitiesSlice
│   └── analytics/        # AnalyticsOverview, Leaderboard, Win-rate distribution
├── shared/               # Cross-cutting UI state
│   └── uiSlice.ts        # Tab state, sidebar toggle, modal orchestrator, toast manager
├── data/                 # Realistic Indian enterprise mock seed data
└── test/                 # 10 Vitest test suites (36 automated tests)
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation
```bash
# Clone repository and navigate to project root
git clone <repo-url>
cd "Enterprise CRM platform"

# Install project dependencies
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### Running Automated Tests
```bash
npm run test
```
Executes all 36 unit and integration test suites using Vitest with fake timers and jsdom.

### Building for Production
```bash
npm run build
```
Type-checks with `tsc -b` and bundles with Vite into optimized production assets inside `/dist`.

---

## 🛡️ License
Private Enterprise Platform — Copyright © 2026 VedaFlow Technologies India Pvt. Ltd. All Rights Reserved.

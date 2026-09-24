# Amerix Health Advisor

Amerix Health Advisor is a client-side health tracking application built with one HTML file, CSS, and vanilla JavaScript.

## Features

* **Multi-Theme Support:** Built-in Light Mode ("Acid Mint & Mist Gray") and Dark Mode ("Inkberry & Forest Graphite") with auto-detection for operating system preferences.
* **Authentication Simulation:** User registration and sign-in management stored locally with dynamic UI states.
* **Dashboard & Vitals Tracker:** Logs weight, height, age, and computes Body Mass Index (BMI) categories (Underweight, Normal, Overweight, Obese) dynamically.
* **Daily Habits Logging:** Tracks metrics including sleep hours, water/saline intake, step counts, and selected fasting protocols.
* **Interactive Fasting Timer:** Features a customizable dropdown protocol selector (OMAD, 2MAD, Autophagy Marathon, Extended) and real-time timer calculations with achievement badges and advice.
* **History & Data Export:** Complete log management with row deletions, history clearing, and options to export logs to CSV or JSON formats.
* **Prescriptive Health Advice Engine:** Dynamically renders health suggestions based on individual BMI calculations and recorded habit metrics.

---

## Technologies Used

* **HTML5:** Semantic document structure for a clean single-page application (SPA) layout.
* **CSS3:** Custom styles, responsive grid/flexbox layouts, and CSS variables for multi-theme switching.
* **JavaScript (ES6+):** Dynamic DOM manipulation, state management, event handling, and data processing.
* **Web Storage API (`localStorage`):** Client-side data persistence for user authentication, daily logs, timer state, and theme preferences.

---

## Learning Focus

* **Single-Page Application (SPA) Routing:** Implementing modular tab navigation and view switching without page reloads using pure JavaScript.
* **State Management & Data Persistence:** Handling client-side state, user sessions, and persistent log storage with `localStorage`[cite: 1].
* **Dynamic DOM Manipulation:** Real-time rendering of calculated metrics, visual progress bars, interactive timer badges, and log tables[cite: 1].
* **Theme System Architecture:** Leveraging CSS custom properties (`var()`) to seamlessly handle user-selected and OS-level color theme toggling[cite: 1].

---

## Breakdown Engine

The **Breakdown Engine** processes baseline measurements and daily habits to deliver continuous evaluation:

* **BMI Processing:** Converts user height and weight into Body Mass Index scores and categorizes them into standard clinical ranges (Underweight, Normal, Overweight, Obese)[cite: 1].
* **Habit Metric Evaluation:** Analyzes recorded values against daily target thresholds for hydration (water/saline), sleep duration, step count, and chosen fasting protocol[cite: 1].
* **Real-time Fasting Tracking:** Tracks continuous progress against set fast limits, dynamically calculating remaining durations and updating completion badges[cite: 1].
* **Prescriptive Advice Generation:** Matches computed metrics against health rules to display personalized lifestyle suggestions and actionable feedback[cite: 1].

---

## System Flow

```text
[ Welcome View / Landing ]
          │
          ├──> Select Log In / Sign Up ──> [ View 2: Authentication ]
          │                                        │
          │                                (Authentication Success)
          │                                        │
          ▼                                        ▼
[ View 3: Dashboard & Baseline Vitals ] <──────────┘
          │
          ├── (Submit Daily Habits Form) ──> [ View 4: Your Summary & Metrics ]
          │                                             │
          ├── (Navigate via Header Tab)                 ├──> [ View 5: Direct Advice Page ]
          │                                             │
          └──> [ View Fasting: Timer & Rules ]           └──> [ Export CSV / JSON Data ]




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

Landing: Guests view overall health tracking benefits and choose to log in or create an account[cite: 1].Authentication: User logs in or registers. The global navigation bar becomes accessible upon session validation[cite: 1].Dashboard: Users submit baseline parameters (weight, height, age) and daily habit numbers[cite: 1].Summary & Logs: Displays visual progress bars, metrics analysis, and complete historical table entries[cite: 1].Fasting Module: Active timer runs independently to track elapsed time against chosen protocol targets[cite: 1].Advice Page: Displays customized lifestyle advice corresponding to calculated health indicators[cite: 1].ArchitectureComponentResponsibility / FunctionTechnology / StorageUser Interface (UI)Responsive single-page layout (SPA) with CSS variables for light/dark theme switching[cite: 1].HTML5, CSS3[cite: 1]Application StateManages current active tab view, active user profile, baseline health data, and timers[cite: 1].JavaScript (ES6)[cite: 1]Data StorageClient-side persistence for accounts, daily log history, active fasting timers, and theme state[cite: 1].window.localStorage[cite: 1]Calculations EngineComputes live BMI values, progress bar percentages, and fast completion statistics[cite: 1].Native JavaScript Functions[cite: 1]Potential Future ImprovementsBackend Integration: Migrate authentication and data persistence from localStorage to a secure server and database architecture (e.g., Node.js / MySQL).Data Visualization: Integrate interactive charts (such as Chart.js) to visually plot weight trends, fasting history, and habits over time.Notification System: Implement browser Web Push notifications to remind users when fasting windows begin or end.Advanced Biometrics Tracking: Expand tracking metrics to include blood glucose, ketone levels, blood pressure, and micro-nutrient inputs.Author


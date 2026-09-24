# Amerix Health Advisor

Amerix Health Advisor is a single-page web application designed for metabolic optimization, intermittent fasting management, biological marker monitoring, and health tracking. Built using pure HTML, CSS, and JavaScript, the application operates entirely client-side, storing state across browser sessions via `localStorage`.

---

## Features

- **Multi-Theme Support:** Built-in Light Mode ("Acid Mint & Mist Gray") and Dark Mode ("Inkberry & Forest Graphite") with auto-detection for operating system preferences.
- **Authentication Simulation:** User registration and sign-in management stored locally with dynamic UI states.
- **Dashboard and Vitals Tracker:** Logs weight, height, and age, then computes Body Mass Index (BMI) categories dynamically.
- **Daily Habits Logging:** Tracks sleep hours, water or saline intake, step counts, and selected fasting protocols.
- **Interactive Fasting Timer:** Provides OMAD, 2MAD, Autophagy Marathon, and Extended protocols with real-time timer calculations, achievement badges, and advice.
- **History and Data Export:** Supports row deletion, history clearing, and CSV or JSON export.
- **Prescriptive Health Advice Engine:** Renders health suggestions based on BMI calculations and recorded habit metrics.

---

## Technologies Used

- **HTML5:** Semantic structure for the single-page application layout.
- **CSS3:** Responsive grid and flexbox layouts, CSS variables, animations, and theme switching.
- **JavaScript (ES6+):** DOM manipulation, state management, event handling, calculations, timer logic, and data processing.
- **Web Storage API (`localStorage`):** Client-side persistence for user authentication, daily logs, timer state, and theme preferences.

---

## Learning Focus

- **Single-Page Application Navigation:** Implementing tab navigation and view switching without page reloads using vanilla JavaScript.
- **State Management and Data Persistence:** Managing client-side state, user sessions, and log storage with `localStorage`.
- **Dynamic DOM Manipulation:** Rendering calculated metrics, progress bars, timer badges, advice, and history tables in real time.
- **Theme System Architecture:** Using CSS custom properties with user-selected and operating-system theme preferences.
- **Form and Data Handling:** Validating inputs, calculating derived values, and exporting structured data as CSV and JSON.

---

## Breakdown Engine

The **Breakdown Engine** processes baseline measurements and daily habits to provide continuous evaluation:

- **BMI Processing:** Converts height and weight into Body Mass Index scores and categories.
- **Habit Metric Evaluation:** Analyzes hydration, sleep duration, step count, and fasting protocol values against daily targets.
- **Real-Time Fasting Tracking:** Tracks progress against selected fasting limits, calculates remaining durations, and updates completion badges.
- **Prescriptive Advice Generation:** Matches computed metrics against health rules to display personalized lifestyle suggestions.

---

## System Flow

```text
[ Welcome View / Landing ]
          |
          +--> Select Log In / Sign Up --> [ Authentication ]
                                             |
                                             v
[ Dashboard and Baseline Vitals ] <----------+
          |
          +--> Daily Habits --> [ Summary and Metrics ]
          |
          +--> Fasting Timer and Rules
          |
          +--> Advice Page and Health Principles
          |
          `--> History and CSV / JSON Export
```

1. **Landing:** Guests choose to log in or create an account.
2. **Authentication:** Users register or sign in through the simulated local flow.
3. **Dashboard:** Users submit baseline parameters such as weight, height, and age.
4. **Summary and Logs:** The application displays progress bars, metric analysis, and historical entries.
5. **Fasting Module:** The timer tracks progress against the selected protocol.
6. **Advice Page:** The application displays guidance based on calculated health indicators.

## Architecture

| Component | Responsibility | Technology or Storage |
| --- | --- | --- |
| User interface | Responsive single-page layout with light and dark themes | HTML5 and CSS3 |
| Application state | Active view, user profile, baseline data, habits, and timers | JavaScript ES6+ |
| Data storage | Accounts, sessions, logs, fasting state, and theme preference | `window.localStorage` |
| Calculations engine | BMI values, progress percentages, and fasting statistics | Native JavaScript functions |

## Potential Future Improvements

- **Backend Integration:** Move authentication and data persistence from `localStorage` to a secure server and database architecture.
- **Data Visualization:** Add charts for weight trends, fasting history, and habits.
- **Notification System:** Add browser notifications for fasting milestones.
- **Advanced Biometrics Tracking:** Support blood glucose, ketone levels, blood pressure, and micronutrient inputs.

## Author

Branham Simiyu.

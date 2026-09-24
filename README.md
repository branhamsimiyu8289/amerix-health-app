# Amerix Health Advisor

Amerix Health Advisor is a client-side health and habit tracking application for recording baseline measurements, daily habits, fasting activity, and personalized wellness guidance. It is built as a single-page application with HTML, CSS, and vanilla JavaScript.

The application runs in the browser and stores demo data in `localStorage`. It does not currently use a backend, database, or external API.

## Features

- Simulated account creation and sign-in flow
- Responsive dashboard for baseline measurements and daily habits
- BMI calculation with Underweight, Normal, Overweight, and Obese categories
- Habit tracking for sleep, water or saline intake, steps, and fasting protocol
- Fasting timer with OMAD, 2MAD, Autophagy Marathon, and Extended protocols
- Light and dark themes with operating-system preference detection
- Summary views with progress indicators and habit history
- Personalized advice based on recorded health metrics
- CSV and JSON export for locally stored history
- Responsive desktop and mobile layout

## Technology Stack

- HTML5 for the application structure and accessible forms
- CSS3 for responsive layout, animations, themes, and visual styling
- Vanilla JavaScript (ES6+) for navigation, state, calculations, timers, and data export
- Browser `localStorage` for demo accounts, sessions, health data, history, fasting state, and theme preference
- Browser File and Blob APIs for CSV and JSON downloads

## Project Structure

```text
amerix-health-app/
|-- AmerixHealthApp.html  # Complete single-page application
|-- .env.example          # Placeholder environment configuration
|-- .gitignore            # Ignored local files and secrets
`-- README.md             # Project documentation
```

## System Flow

```text
Welcome view
    |
    v
Sign in or create an account
    |
    v
Dashboard and baseline vitals
    |
    +--> Daily habits and summary metrics
    +--> Fasting timer and completion status
    +--> Advice and health principles
    `--> History table and CSV/JSON export
```

## Run Locally

No dependencies or build tools are required.

### Option 1: Open the file directly

Open `AmerixHealthApp.html` in a modern browser.

### Option 2: Use a local HTTP server

From this project directory, run:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/AmerixHealthApp.html
```

Serving the file over HTTP is useful when testing downloads, browser storage, or behavior across devices on the same trusted network.

## Sample Output

After entering baseline data and submitting a daily check-in, the summary can show results similar to:

```text
Daily Summary
BMI: 23.4 - Normal
Sleep: 7.5 hours
Water: 8 glasses
Steps: 10,500
Fasting protocol: OMAD
Status: Step goal achieved
```

An exported JSON record has this general shape:

```json
{
  "weight": 72,
  "height": 175,
  "age": 30,
  "sleep": 7.5,
  "water": 8,
  "steps": 10500,
  "protocol": "OMAD"
}
```

The exact displayed values depend on the information entered by the user.

## Learning Focus and Build Practices

This project is intended to practise:

- Building a complete single-page interface without a framework
- Switching views and managing navigation without page reloads
- Managing application state with JavaScript and `localStorage`
- Calculating BMI and rendering derived metrics in the DOM
- Building form validation and clear success or error states
- Implementing timer logic, progress indicators, and completion summaries
- Designing a reusable theme system with CSS custom properties
- Exporting structured browser data as CSV and JSON files
- Organizing a small project with readable documentation and focused Git commits

## Breakdown Engine

The application evaluates the information entered by the user and updates the interface in real time:

- **BMI processing:** Converts height and weight into a BMI score and category.
- **Habit evaluation:** Compares sleep, hydration, and step values with the dashboard's daily targets.
- **Fasting tracking:** Measures progress against the selected fasting protocol and updates the timer state and completion summary.
- **Advice generation:** Uses the calculated metrics and recorded habits to display contextual wellness suggestions.

## Data Storage and Limitations

All application data is stored in the browser's `localStorage`. Clearing site data removes demo users, sessions, health information, history, timer state, and theme preferences.

The authentication flow is for learning purposes only. Passwords are stored in the browser and are not securely hashed. Do not use this implementation for production authentication, sensitive medical information, or clinical decisions.

The application is an educational prototype and is not a medical device or a replacement for professional medical advice.

## Environment File

The repository includes `.env.example` for possible future integrations. The current static application does not load `.env` files or make API requests. Never place real API keys in browser-side HTML or JavaScript.

## Future Improvements

- Add a secure backend and database for authentication and persistent records
- Replace simulated authentication with hashed passwords and session security
- Add automated tests for calculations, timers, forms, and exports
- Add charts for weight, habit, and fasting trends
- Add configurable API and health-target settings
- Add browser notifications for fasting milestones

## Author

Branham Simiyu

## License

No license file is currently included. Add a license before distributing or reusing this project publicly.

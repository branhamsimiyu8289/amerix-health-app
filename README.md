# Amerix Health Advisor

Amerix Health Advisor is a client-side health tracking application built with one HTML file, CSS, and vanilla JavaScript.

## Features

- Account creation and local sign-in flow
- Light and dark themes
- Baseline health tracking for weight, height, age, and BMI
- Daily habit logging for sleep, water, steps, and fasting protocol
- Intermittent fasting timer with progress and completion summary
- Health principles and personalized advice views
- Summary dashboard with habit history
- CSV and JSON history export
- Responsive desktop and mobile layout

## Project Files

```text
amerix-health-app/
├── AmerixHealthApp.html
├── .env.example
├── .gitignore
└── README.md
```

## Run Locally

No dependencies or build tools are required. Open `AmerixHealthApp.html` directly in a browser.

For a local server, run this from the project folder:

```powershell
python -m http.server 8000
```

Then visit:

```text
http://localhost:8000/AmerixHealthApp.html
```

## Data Storage

The application stores demo users, the active session, health data, habit history, fasting timer state, and theme preference in browser `localStorage`. Clearing browser site data removes the saved information.

## Environment Variables

The project includes `.env.example` and `.env` for future API or backend integrations. The current static HTML application does not load `.env` files and does not make API requests.

Never place a real API key directly in browser-side HTML or JavaScript. Use a backend service to protect provider credentials.

## GitHub Push

After creating an empty GitHub repository, run from this project folder:

```powershell
git add AmerixHealthApp.html README.md .gitignore .env.example
git commit -m "Initial Amerix Health Advisor app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/amerix-health-app.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username. The `.env` file is ignored and must not be committed.

## Security Notice

This is an educational prototype. Passwords are stored in browser `localStorage` and are not securely hashed. Do not use this authentication flow for production or sensitive medical data without a secure backend, encrypted storage, proper authentication, and privacy controls.

The application is not a medical device and does not replace professional medical advice.

// --- STORAGE KEYS ---
const STORAGE_KEYS = {
  USERS: 'aha_users_v2',
  ACTIVE_USER: 'aha_active_user_v2',
  HEALTH_DATA: 'aha_health_data_v2',
  HABITS: 'aha_habits_history_v2',
  FASTING_TIMER: 'aha_fasting_timer_v2',
  THEME: 'aha_theme'
};

// --- THEME ENGINE (LIGHT: ACID MINT + MIST GRAY | DARK: INKBERRY + FOREST GRAPHITE) ---
(function applyEarlyTheme() {
  try {
    const saved = localStorage.getItem('aha_theme');
    const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (systemDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initial);
  } catch (e) {}
})();

function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  const systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (systemDark ? 'dark' : 'light');
  applyTheme(theme);

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(STORAGE_KEYS.THEME, next);
    });
  }

  // Automatically respond to OS dark mode change if user hasn't chosen manually
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const icon = document.getElementById('themeToggleIcon');
  const text = document.getElementById('themeToggleText');
  const btn = document.getElementById('themeToggleBtn');

  if (theme === 'dark') {
    if (icon) icon.textContent = '☀️';
    if (text) text.textContent = 'Light';
    if (btn) btn.title = 'Switch to Light Mode (Acid Mint & Mist Gray)';
  } else {
    if (icon) icon.textContent = '🌙';
    if (text) text.textContent = 'Dark';
    if (btn) btn.title = 'Switch to Dark Mode (Inkberry & Forest Graphite)';
  }
}

// --- STATE ENGINE ---
const appState = {
  currentView: '1',
  users: loadStorage(STORAGE_KEYS.USERS, []),
  activeUser: loadStorage(STORAGE_KEYS.ACTIVE_USER, null),
  healthData: loadStorage(STORAGE_KEYS.HEALTH_DATA, null),
  habits: loadStorage(STORAGE_KEYS.HABITS, []),
  fastingTimer: loadStorage(STORAGE_KEYS.FASTING_TIMER, {
    isRunning: false,
    startTime: null,
    targetHours: 24,
    protocolName: 'OMAD (24 hours)',
    protocolIcon: '🔥',
    finishedDuration: null
  })
};

function loadStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
    return fallback;
  }
}

function saveStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error writing localStorage key', key, e);
  }
}

// --- 4-TAB NAVIGATION & VIEW ROUTER ---
function showStep(targetView) {
  const viewStr = String(targetView);

  // Auth validation for protected areas
  if ((viewStr === '3' || viewStr === '4' || viewStr === '5' || viewStr === 'fasting') && !appState.activeUser) {
    showAuthView('signin');
    showToast('signInToast', 'Please sign in or create an account first.', 'error');
    return;
  }

  appState.currentView = viewStr;

  // Hide all views
  const views = ['view-step-1', 'view-step-2', 'view-step-3', 'view-step-fasting', 'view-step-4', 'view-step-5'];
  views.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  // Reset active tabs
  const tabs = ['navTabWelcome', 'navTabDashboard', 'navTabFasting', 'navTabSummary'];
  tabs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });

  // Show target view & highlight the corresponding tab
  if (viewStr === '1') {
    document.getElementById('view-step-1').classList.add('active');
    document.getElementById('navTabWelcome').classList.add('active');
  } else if (viewStr === '2') {
    document.getElementById('view-step-2').classList.add('active');
    document.getElementById('navTabWelcome').classList.add('active');
  } else if (viewStr === '3') {
    document.getElementById('view-step-3').classList.add('active');
    document.getElementById('navTabDashboard').classList.add('active');
    populateDashboardFields();
  } else if (viewStr === 'fasting') {
    document.getElementById('view-step-fasting').classList.add('active');
    document.getElementById('navTabFasting').classList.add('active');
    updateTimerDisplay();
  } else if (viewStr === '4') {
    document.getElementById('view-step-4').classList.add('active');
    document.getElementById('navTabSummary').classList.add('active');
    renderSummaryView();
  } else if (viewStr === '5') {
    document.getElementById('view-step-5').classList.add('active');
    document.getElementById('navTabSummary').classList.add('active');
    renderAdviceView();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleStepNav(target) {
  if ((target === 3 || target === 4 || target === 'fasting') && !appState.activeUser) {
    showAuthView('signin');
    showToast('signInToast', 'Sign in to access this section.', 'error');
    return;
  }
  showStep(target);
}

// --- AUTHENTICATION & NAV VISIBILITY (ONLY VISIBLE WHEN LOGGED IN) ---
function showAuthView(type) {
  showStep(2);
  const signInCard = document.getElementById('authSignInCard');
  const signUpCard = document.getElementById('authSignUpCard');

  if (type === 'signup') {
    signInCard.style.display = 'none';
    signUpCard.style.display = 'block';
  } else {
    signInCard.style.display = 'block';
    signUpCard.style.display = 'none';
  }
}

function updateAuthHeaderUI() {
  const userBadge = document.getElementById('userBadge');
  const guestBadge = document.getElementById('guestBadge');
  const headerUsername = document.getElementById('headerUsername');
  const dashboardGreetingUser = document.getElementById('dashboardGreetingUser');
  const mainNavBar = document.getElementById('mainNavBar');

  if (appState.activeUser) {
    userBadge.style.display = 'inline-flex';
    guestBadge.style.display = 'none';
    headerUsername.textContent = appState.activeUser.username;
    if (dashboardGreetingUser) dashboardGreetingUser.textContent = appState.activeUser.username;

    // Navigation menu ONLY visible after user has signed up or logged in
    if (mainNavBar) mainNavBar.style.display = 'flex';
  } else {
    userBadge.style.display = 'none';
    guestBadge.style.display = 'inline-flex';

    // Navigation menu hidden when not logged in
    if (mainNavBar) mainNavBar.style.display = 'none';
  }
}

function showToast(elemId, message, type = 'success') {
  const el = document.getElementById(elemId);
  if (!el) return;
  el.textContent = message;
  el.className = `toast-msg ${type}`;
  setTimeout(() => {
    el.className = 'toast-msg';
  }, 5000);
}

// Sign In handler
document.getElementById('signInForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  const user = appState.users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

  if (!user) {
    showToast('signInToast', 'Invalid username or password. Please verify or create an account.', 'error');
    return;
  }

  appState.activeUser = { username: user.username, email: user.email };
  saveStorage(STORAGE_KEYS.ACTIVE_USER, appState.activeUser);
  updateAuthHeaderUI();
  document.getElementById('signInForm').reset();
  showToast('signInToast', `Welcome back, ${user.username}! Loading dashboard...`, 'success');

  setTimeout(() => {
    showStep(3); // Cascades to Dashboard and habits
  }, 450);
});

// Sign Up handler
document.getElementById('signUpForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('regEmail').value.trim();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;

  if (password.length < 4) {
    showToast('signUpToast', 'Password must be at least 4 characters.', 'error');
    return;
  }

  const existing = appState.users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    showToast('signUpToast', 'An account with that username or email already exists.', 'error');
    return;
  }

  const newUser = { email, username, password, createdAt: new Date().toISOString() };
  appState.users.push(newUser);
  saveStorage(STORAGE_KEYS.USERS, appState.users);

  appState.activeUser = { username, email };
  saveStorage(STORAGE_KEYS.ACTIVE_USER, appState.activeUser);
  updateAuthHeaderUI();
  document.getElementById('signUpForm').reset();
  showToast('signUpToast', 'Account created! Loading your dashboard...', 'success');

  setTimeout(() => {
    showStep(3); // Cascades to Dashboard and habits
  }, 450);
});

// Sign Out handler
document.getElementById('btnSignOut').addEventListener('click', () => {
  if (confirm('Are you sure you want to sign out?')) {
    appState.activeUser = null;
    saveStorage(STORAGE_KEYS.ACTIVE_USER, null);
    updateAuthHeaderUI();
    showStep(1);
  }
});

// Landing Page Buttons
document.getElementById('btnChooseSignIn').addEventListener('click', () => showAuthView('signin'));
document.getElementById('btnChooseSignUp').addEventListener('click', () => showAuthView('signup'));
document.getElementById('linkSwitchToSignUp').addEventListener('click', () => showAuthView('signup'));
document.getElementById('linkSwitchToSignIn').addEventListener('click', () => showAuthView('signin'));

// --- DASHBOARD & HABITS LOG (VIEW 3) ---
function populateDashboardFields() {
  if (appState.activeUser) {
    document.getElementById('dashboardGreetingUser').textContent = appState.activeUser.username;
  }
  if (appState.healthData) {
    if (appState.healthData.weight) document.getElementById('weightInput').value = appState.healthData.weight;
    if (appState.healthData.height) document.getElementById('heightInput').value = appState.healthData.height;
    if (appState.healthData.age) document.getElementById('ageInput').value = appState.healthData.age;
    updateLiveBmiPreview();
  }
}

function calculateBmi(weightKg, heightCm) {
  if (!weightKg || !heightCm || heightCm <= 0) return 0;
  const heightM = heightCm / 100;
  return Number((weightKg / (heightM * heightM)).toFixed(1));
}

function getBmiCategory(bmi) {
  if (!bmi || bmi <= 0) return { label: 'Not set', className: 'bmi-normal' };
  if (bmi < 18.5) return { label: 'Underweight', className: 'bmi-under' };
  if (bmi < 25.0) return { label: 'Normal / Healthy', className: 'bmi-normal' };
  if (bmi < 30.0) return { label: 'Overweight', className: 'bmi-over' };
  return { label: 'Obese (Unfatting Required)', className: 'bmi-obese' };
}

function updateLiveBmiPreview() {
  const weight = Number(document.getElementById('weightInput').value);
  const height = Number(document.getElementById('heightInput').value);
  const tag = document.getElementById('liveBmiTag');
  const val = document.getElementById('liveBmiVal');

  if (weight > 20 && height > 80) {
    const bmi = calculateBmi(weight, height);
    const cat = getBmiCategory(bmi);
    val.textContent = `${bmi} (${cat.label})`;
    tag.className = `bmi-badge ${cat.className}`;
    tag.style.display = 'inline-block';
  } else {
    tag.style.display = 'none';
  }
}

document.getElementById('weightInput').addEventListener('input', updateLiveBmiPreview);
document.getElementById('heightInput').addEventListener('input', updateLiveBmiPreview);

// Form submission: requires user to pick one radio
document.getElementById('combinedTrackingForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const fastingProtocolRadio = document.querySelector('input[name="fastingProtocol"]:checked');
  if (!fastingProtocolRadio) {
    alert('Please select a fasting protocol.');
    return;
  }
  const fastingProtocol = fastingProtocolRadio.value;

  const weight = Number(document.getElementById('weightInput').value);
  const height = Number(document.getElementById('heightInput').value);
  const age = Number(document.getElementById('ageInput').value);
  const bmi = calculateBmi(weight, height);

  // Save baseline data
  appState.healthData = { weight, height, age, bmi, lastUpdated: new Date().toISOString() };
  saveStorage(STORAGE_KEYS.HEALTH_DATA, appState.healthData);

  // Habit log
  const sleep = Number(document.getElementById('sleepInput').value);
  const water = Number(document.getElementById('waterInput').value);
  const steps = Number(document.getElementById('stepsInput').value);

  const habitEntry = {
    id: 'hab_' + Date.now(),
    timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sleep,
    water,
    steps,
    fastingProtocol,
    bmi: bmi || 'N/A',
    weight
  };

  appState.habits.push(habitEntry);
  saveStorage(STORAGE_KEYS.HABITS, appState.habits);

  // Reset habits inputs
  document.getElementById('sleepInput').value = '';
  document.getElementById('waterInput').value = '';
  document.getElementById('stepsInput').value = '';

  // Uncheck radio selection for fresh entries
  document.querySelectorAll('input[name="fastingProtocol"]').forEach(r => r.checked = false);

  // Loads and takes user to Summary
  showStep(4);
});

// --- YOUR SUMMARY (VIEW 4) ---
function renderSummaryView() {
  const latestHabit = appState.habits.length > 0 ? appState.habits[appState.habits.length - 1] : null;
  const health = appState.healthData || {};

  // BMI Metric
  const bmi = health.bmi || (latestHabit && typeof latestHabit.bmi === 'number' ? latestHabit.bmi : 0);
  const bmiValEl = document.getElementById('summaryBmiVal');
  const bmiBadgeEl = document.getElementById('summaryBmiBadge');
  const bmiFillEl = document.getElementById('summaryBmiFill');
  const bmiNoteEl = document.getElementById('summaryBmiNote');

  if (bmi > 0) {
    const cat = getBmiCategory(bmi);
    bmiValEl.textContent = bmi.toFixed(1);
    bmiBadgeEl.textContent = cat.label;
    bmiBadgeEl.className = `bmi-badge ${cat.className}`;
    const pct = Math.min(Math.max(((bmi - 15) / 20) * 100, 5), 100);
    bmiFillEl.style.width = pct + '%';
    if (bmi >= 25) {
      bmiFillEl.style.background = '#f97316';
      bmiNoteEl.textContent = 'Above optimal. Fasting advised.';
    } else if (bmi < 18.5) {
      bmiFillEl.style.background = '#eab308';
      bmiNoteEl.textContent = 'Underweight. Prioritize animal fats & protein.';
    } else {
      bmiFillEl.style.background = 'var(--acid-mint)';
      bmiNoteEl.textContent = 'Optimal range. Protect this frame.';
    }
  } else {
    bmiValEl.textContent = 'Not set';
    bmiBadgeEl.textContent = 'N/A';
    bmiFillEl.style.width = '0%';
    bmiNoteEl.textContent = 'Submit vitals on Dashboard.';
  }

  // Steps Metric
  const steps = latestHabit ? latestHabit.steps : 0;
  const stepsValEl = document.getElementById('summaryStepsVal');
  const stepsPctEl = document.getElementById('summaryStepsPct');
  const stepsFillEl = document.getElementById('summaryStepsFill');

  stepsValEl.textContent = steps.toLocaleString();
  const stepsPct = Math.min(Math.round((steps / 10000) * 100), 150);
  stepsPctEl.textContent = stepsPct + '%';
  stepsFillEl.style.width = Math.min(stepsPct, 100) + '%';
  stepsFillEl.style.background = steps >= 10000 ? 'var(--acid-mint)' : (steps >= 8000 ? '#84cc16' : '#f97316');

  // Water Metric
  const water = latestHabit ? latestHabit.water : 0;
  const waterValEl = document.getElementById('summaryWaterVal');
  const waterPctEl = document.getElementById('summaryWaterPct');
  const waterFillEl = document.getElementById('summaryWaterFill');

  waterValEl.innerHTML = `${water} <span style="font-size: 0.88rem; font-weight: 600;">glasses</span>`;
  const waterPct = Math.min(Math.round((water / 8) * 100), 150);
  waterPctEl.textContent = waterPct + '%';
  waterFillEl.style.width = Math.min(waterPct, 100) + '%';
  waterFillEl.style.background = water >= 8 ? '#0284c7' : '#f97316';

  // Sleep Metric
  const sleep = latestHabit ? latestHabit.sleep : 0;
  const sleepValEl = document.getElementById('summarySleepVal');
  const sleepScoreEl = document.getElementById('summarySleepScore');
  const sleepFillEl = document.getElementById('summarySleepFill');

  sleepValEl.innerHTML = `${sleep} <span style="font-size: 0.88rem; font-weight: 600;">hrs</span>`;
  if (sleep >= 7 && sleep <= 9) {
    sleepScoreEl.textContent = 'Optimal (100%)';
    sleepFillEl.style.width = '100%';
    sleepFillEl.style.background = 'var(--acid-mint)';
  } else if (sleep > 9) {
    sleepScoreEl.textContent = 'High (>9h)';
    sleepFillEl.style.width = '100%';
    sleepFillEl.style.background = '#0284c7';
  } else if (sleep >= 5) {
    sleepScoreEl.textContent = 'Fair';
    sleepFillEl.style.width = ((sleep / 8) * 100) + '%';
    sleepFillEl.style.background = '#f97316';
  } else {
    sleepScoreEl.textContent = 'Poor (<5h)';
    sleepFillEl.style.width = ((sleep / 8) * 100) + '%';
    sleepFillEl.style.background = '#dc2626';
  }

  document.getElementById('summaryProtocolVal').textContent = latestHabit ? latestHabit.fastingProtocol : 'None selected';
  document.getElementById('summaryTimestamp').textContent = latestHabit ? `Logged: ${latestHabit.timestamp}` : 'No entries yet';

  renderHistoryTable();
}

function renderHistoryTable() {
  const tbody = document.getElementById('historyTableBody');
  if (!appState.habits.length) {
    tbody.innerHTML = '<tr><td colspan="7" class="cell-empty" style="text-align: center; color: var(--muted); padding: 16px;">No habits logged yet. Record your day in Dashboard and habits.</td></tr>';
    return;
  }

  tbody.innerHTML = appState.habits.slice().reverse().map((entry) => `
    <tr class="history-row">
      <td class="cell-timestamp" data-label="Timestamp">
        <span class="timestamp-val">📅 <strong>${entry.timestamp}</strong></span>
        <button type="button" class="btn-delete-row mobile-only-delete" onclick="deleteHistoryEntry('${entry.id}')" title="Delete record" aria-label="Delete record">🗑️ Delete</button>
      </td>
      <td class="cell-sleep" data-label="Sleep">
        <span class="metric-cell-val">🛌 ${entry.sleep} <small>hrs</small></span>
      </td>
      <td class="cell-water" data-label="Water">
        <span class="metric-cell-val">💧 ${entry.water} <small>gl</small></span>
      </td>
      <td class="cell-steps" data-label="Steps">
        <span class="metric-cell-val">🚶 ${entry.steps.toLocaleString()}</span>
      </td>
      <td class="cell-bmi" data-label="BMI">
        <span class="metric-cell-val">⚖️ <strong>${entry.bmi}</strong></span>
      </td>
      <td class="cell-protocol" data-label="Fasting Protocol">
        <span class="bmi-badge bmi-normal">${entry.fastingProtocol}</span>
      </td>
      <td class="cell-action desktop-only-action" data-label="Action" style="text-align: right;">
        <button type="button" class="btn-delete-row" onclick="deleteHistoryEntry('${entry.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

window.deleteHistoryEntry = function(entryId) {
  if (confirm('Delete this entry from your history?')) {
    appState.habits = appState.habits.filter(h => h.id !== entryId);
    saveStorage(STORAGE_KEYS.HABITS, appState.habits);
    renderSummaryView();
  }
};

document.getElementById('btnClearHistory').addEventListener('click', () => {
  if (!appState.habits.length) {
    alert('History log is already empty.');
    return;
  }
  if (confirm('Are you sure you want to permanently clear your habits history?')) {
    appState.habits = [];
    saveStorage(STORAGE_KEYS.HABITS, appState.habits);
    renderSummaryView();
  }
});

document.getElementById('btnExportCsv').addEventListener('click', () => {
  if (!appState.habits.length) {
    alert('No habit records to export. Log an entry first!');
    return;
  }

  const headers = ['ID', 'Timestamp', 'Sleep (hours)', 'Water (glasses)', 'Steps', 'Fasting Protocol', 'BMI'];
  const rows = appState.habits.map(h => [
    `"${h.id}"`,
    `"${h.timestamp}"`,
    h.sleep,
    h.water,
    h.steps,
    `"${h.fastingProtocol}"`,
    h.bmi
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  downloadFile(csvContent, `amerix_health_history_${Date.now()}.csv`, 'text/csv;charset=utf-8;');
});

document.getElementById('btnExportJson').addEventListener('click', () => {
  if (!appState.habits.length) {
    alert('No habit records to export. Log an entry first!');
    return;
  }

  const payload = {
    user: appState.activeUser ? appState.activeUser.username : 'Anonymous',
    healthBaseline: appState.healthData,
    history: appState.habits,
    exportedAt: new Date().toISOString()
  };

  downloadFile(JSON.stringify(payload, null, 2), `amerix_health_data_${Date.now()}.json`, 'application/json');
});

function downloadFile(content, fileName, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

document.getElementById('btnSeeAdvice').addEventListener('click', () => {
  showStep(5);
});

// --- ADVICE VIEW (VIEW 5) ---
function renderAdviceView() {
  const name = appState.activeUser ? appState.activeUser.username : 'Friend';
  document.getElementById('adviceHeaderTitle').textContent = `Amerix's Direct Advice for ${name}`;

  const container = document.getElementById('adviceContainer');
  const latestHabit = appState.habits.length > 0 ? appState.habits[appState.habits.length - 1] : null;
  const health = appState.healthData || null;

  if (!latestHabit && !health) {
    container.innerHTML = `
      <div class="advice-card">
        <h3>📝 No Data Recorded Yet</h3>
        <p>Go to Dashboard and habits, enter your vitals and record your day. Amerix will assess your biological metrics and prescribe actionable guidance.</p>
      </div>
    `;
    return;
  }

  const cards = [];

  // 1. BMI Advice
  const bmi = health ? health.bmi : (latestHabit && typeof latestHabit.bmi === 'number' ? latestHabit.bmi : null);
  if (bmi) {
    if (bmi >= 30) {
      cards.push({
        title: '⚠️ Severe Metabolic Excess (BMI ' + bmi + ')',
        content: `Your BMI is in the obese zone. This is a direct threat to your cardiovascular integrity, joints, and hormone profile. Stop grazing immediately. Eliminate all seed oils, soft drinks, bread, and processed carbohydrates. Adopt OMAD (24 hours) or Extended fasts. Unfat yourself—your vitality depends on it.`
      });
    } else if (bmi >= 25) {
      cards.push({
        title: '⚖️ Excess Visceral Weight (BMI ' + bmi + ')',
        content: `Your BMI reveals excess adipose tissue. Visceral fat drives chronic systemic inflammation and blunts androgen receptivity. Eliminate liquid calories, enforce a strict 2MAD or OMAD protocol, and walk 10,000 steps minimum before your feeding window.`
      });
    } else if (bmi < 18.5) {
      cards.push({
        title: '🥩 Underweight Alert (BMI ' + bmi + ')',
        content: `Your BMI is below the healthy biological frame. You lack sufficient muscle density and reserves. Do not perform extended fasts. Prioritize pasture-raised eggs, bone broth, red meat, and healthy animal fats. Start progressive heavy compound lifting 3 times per week.`
      });
    } else {
      cards.push({
        title: '✅ Solid Metabolic Baseline (BMI ' + bmi + ')',
        content: `Your BMI is within the healthy human range. Guard this foundation. Focus now on progressive overload in the gym, maintaining low visceral fat, and dialing in micronutrient density.`
      });
    }
  }

  // 2. Sleep Advice
  if (latestHabit) {
    const sleep = latestHabit.sleep;
    if (sleep < 7) {
      cards.push({
        title: '🌙 Sleep Deficit (' + sleep + ' hours)',
        content: `Sleeping under 7 hours elevates cortisol and blunts insulin sensitivity the next day. Set a hard digital curfew: screens off by 8:30 PM, dim household lighting, and sleep by 9:30 PM. Recovery is non-negotiable.`
      });
    } else if (sleep <= 9) {
      cards.push({
        title: '🛌 Optimal Sleep Window (' + sleep + ' hours)',
        content: `Great sleep duration. Protect this 7–9 hour restorative window. Keep consistent bed and wake times every single day to anchor your circadian rhythm.`
      });
    } else {
      cards.push({
        title: '⏰ Oversleeping / Sluggishness (' + sleep + ' hours)',
        content: `You logged over 9 hours of sleep. If you wake up groggy, check your electrolyte balance, reduce late-night carbohydrates, and get immediate morning sunlight exposure.`
      });
    }

    // 3. Water Intake
    const water = latestHabit.water;
    if (water < 8) {
      cards.push({
        title: '💧 Dehydration Alert (' + water + ' glasses)',
        content: `You drank only ${water} glasses of water. Dehydration places strain on kidney filtration and slows metabolic fat breakdown. Increase to 8–10 glasses daily. Add a pinch of unrefined sea salt or Himalayan rock salt.`
      });
    } else {
      cards.push({
        title: '💧 Hydration Target Met (' + water + ' glasses)',
        content: `Strong hydration habit (${water} glasses). Continue spacing your water throughout the day. When fasting, saline water prevents headaches and electrolyte depletion.`
      });
    }

    // 4. Movement (Steps)
    const steps = latestHabit.steps;
    if (steps < 8000) {
      cards.push({
        title: '🚶‍♂️ Sedentary Warning (' + steps.toLocaleString() + ' steps)',
        content: `Your step count is below 8,000. Prolonged sitting stagnates circulation and blunts insulin sensitivity. Take brisk 15-minute walks during breaks. Reach 10,000 steps daily.`
      });
    } else {
      cards.push({
        title: '🔥 High Physical Output (' + steps.toLocaleString() + ' steps)',
        content: `Excellent movement discipline (${steps.toLocaleString()} steps). Daily walking depletes glycogen, enhances mitochondrial density, and optimizes fat oxidation without stressing your nervous system.`
      });
    }

    // 5. Fasting Protocol Guidance
    const protocol = latestHabit.fastingProtocol;
    if (protocol === 'OMAD (24 hours)') {
      cards.push({
        title: '⏳ Fasting Mastery: OMAD (24 hours)',
        content: `You are running OMAD (24 hours). Eat your single feast inside a 1-hour window. Pack your meal with animal protein, nutrient-dense fats (avocado, tallow, butter), and bone broth. Never break OMAD with seed oils or processed sweets.`
      });
    } else if (protocol === '2MAD (20:4, 18:6 or 14:8)') {
      cards.push({
        title: '⏳ Fasting Protocol: 2MAD (20:4, 18:6 or 14:8)',
        content: `2MAD is great for sustained strength and athletic energy. Keep your feeding window clean (e.g. 20:4 or 18:6). Strictly avoid snacking between the two meals.`
      });
    } else if (protocol === 'Autophagy Marathon (48 Hours)') {
      cards.push({
        title: '⚡ Autophagy Marathon (48 Hours)',
        content: `You are running a 48-Hour Autophagy Marathon. Your cells are in deep autophagy, recycling damaged proteins and senescent cells. Sip saline water regularly. If dizzy, take a grain of rock salt under your tongue. Break gently with bone broth.`
      });
    } else if (protocol === 'Extended (72 Hours)') {
      cards.push({
        title: '🧬 Extended Fast (72 Hours)',
        content: `72 hours triggers deep immune system rejuvenation and stem cell regeneration. Maintain electrolytes strictly with saline water. Do not rush your refeed—sip warm bone broth first, wait 2 hours, then eat light protein.`
      });
    } else {
      cards.push({
        title: '❌ Not Fasting',
        content: `You are not currently fasting. Constant grazing keeps insulin elevated 24/7, blocking lipolysis and denying your cells the rejuvenative benefits of autophagy. Start tomorrow with at least a 14:8 or 18:6 protocol.`
      });
    }
  }

  container.innerHTML = cards.map(c => `
    <div class="advice-card">
      <h3>${c.title}</h3>
      <p>${c.content}</p>
    </div>
  `).join('');
}

// --- INDEPENDENT FASTING TIMER & CUSTOM DROPDOWN ENGINE ---
let fastingInterval = null;

// Helper: precise message generator depending on whether goal was met + protocol
function getFastingCompletionAssessment(protocolName, targetHours, elapsedSeconds) {
  const targetSeconds = targetHours * 3600;
  const isGoalMet = elapsedSeconds >= targetSeconds;
  const elapsedFormatted = formatTime(elapsedSeconds);
  const targetFormatted = `${targetHours}h 00m`;
  const pctAchieved = Math.round((elapsedSeconds / targetSeconds) * 100);

  let advice = '';

  if (protocolName.includes('OMAD')) {
    if (isGoalMet) {
      advice = `🎯 OMAD GOAL CONQUERED! You completed ${elapsedFormatted} (target: ${targetFormatted}). Your insulin has flatlined for hours and glycogen stores are drained. Refeeding Protocol: Open a strict 1-hour eating window with pasture-raised eggs, bone broth, and grass-fed fatty meat. Absolutely zero seed oils, sugar, or wheat. You conquered the day.`;
    } else {
      const diff = formatTime(targetSeconds - elapsedSeconds);
      advice = `⏳ OMAD INCOMPLETE: You completed ${elapsedFormatted} out of ${targetFormatted} (fell short by ${diff}). While you initiated mild ketosis, you did not reach full 24-hour fat oxidation and deep glycogen depletion. Review what broke you: was it mental weakness, thirst, or lack of salt? Rehydrate with mineral salt, keep your refeed strictly animal-based, and conquer OMAD tomorrow.`;
    }
  } else if (protocolName.includes('2MAD')) {
    if (isGoalMet) {
      advice = `🎯 2MAD TARGET ACHIEVED! You completed ${elapsedFormatted} (target: ${targetFormatted}). Your digestive tract has had complete rest and systemic inflammation is down. Refeeding Protocol: Break fast with solid protein and healthy animal fat (e.g. steak & butter or boiled eggs). Structure your second meal 4 to 6 hours later. Do NOT graze continuously inside your eating window.`;
    } else {
      const diff = formatTime(targetSeconds - elapsedSeconds);
      advice = `⏳ 2MAD STOPPED EARLY: You completed ${elapsedFormatted} out of ${targetFormatted} (fell short by ${diff}). Hunger in an intermittent window is merely ghrelin spikes testing your mental frame. Next time, take a pinch of rock salt and drink warm water. Do not compensate by bingeing—eat your planned protein meal and reset.`;
    }
  } else if (protocolName.includes('Autophagy Marathon')) {
    if (isGoalMet) {
      advice = `🔥 48-HOUR AUTOPHAGY MARATHON CONQUERED! You completed ${elapsedFormatted} (target: ${targetFormatted}). Elite biological discipline! Your body has executed deep autophagy, clearing out senescent cells, damaged mitochondria, and dysfunctional proteins. Crucial Refeeding Rule: Break gently with 1 cup of warm bone broth and pink Himalayan salt. Wait 60 to 90 minutes before eating small portions of lean meat or eggs. Do NOT shock your gut with heavy solids or fiber.`;
    } else {
      const diff = formatTime(targetSeconds - elapsedSeconds);
      advice = `⏳ AUTOPHAGY MARATHON CUT SHORT: You completed ${elapsedFormatted} out of ${targetFormatted} (fell short by ${diff}). 48 hours requires supreme metabolic adaptability. Reaching ${elapsedFormatted} still triggered initial cellular cleanup and strong lipolysis. Analyze the bottleneck: electrolyte deficit or psychological craving? Sip bone broth, replenish sodium/potassium, and prepare for your next attempt.`;
    }
  } else if (protocolName.includes('Extended')) {
    if (isGoalMet) {
      advice = `⚡ 72-HOUR EXTENDED FAST MASTERED! You completed ${elapsedFormatted} (target: ${targetFormatted}). Supreme human resilience. You have stimulated hematopoietic stem cell renewal, purged old white blood cells, and transformed your metabolic flexibility. Critical Refeeding Protocol: Sip warm clear bone broth with sea salt slowly. Wait 2 hours. Have two soft-boiled eggs. Avoid all carbohydrates, dairy, and large steaks for the first 12 hours to prevent refeeding syndrome.`;
    } else {
      const diff = formatTime(targetSeconds - elapsedSeconds);
      advice = `⏳ 72-HOUR EXTENDED FAST STOPPED: You completed ${elapsedFormatted} out of ${targetFormatted} (fell short by ${diff}). Extended fasting past 48 hours is physically rigorous. Any fast lasting ${elapsedFormatted} has generated profound autophagy and visceral fat burning. Rehydrate with mineral saline water, break gently with warm broth, and take pride in the ground you conquered.`;
    }
  } else {
    if (isGoalMet) {
      advice = `🎯 FAST GOAL CONQUERED! You completed ${elapsedFormatted} (target: ${targetFormatted}). Insulin is baseline and ketones are elevated. Break your fast gently with whole proteins and saline water.`;
    } else {
      advice = `⏳ FAST ENDED EARLY: You completed ${elapsedFormatted} out of ${targetFormatted}. Rehydrate with mineral water, assess what triggered the break, and stay disciplined.`;
    }
  }

  return {
    isGoalMet,
    elapsedFormatted,
    targetFormatted,
    pctAchieved,
    advice
  };
}

function initFastingTimer() {
  const dropdownBtn = document.getElementById('dropdownTriggerBtn');
  const dropdownList = document.getElementById('customDropdownList');
  const selectedIcon = document.getElementById('selectedProtoIcon');
  const selectedTitle = document.getElementById('selectedProtoTitle');
  const dropdownItems = document.querySelectorAll('.dropdown-opt-item');

  const startBtn = document.getElementById('btnStartFast');
  const finishBtn = document.getElementById('btnFinishFast');
  const resultCard = document.getElementById('fastCompletionCard');
  const dismissBtn = document.getElementById('btnDismissResult');

  // Sync custom dropdown with saved state
  const currentTarget = appState.fastingTimer.targetHours || 24;
  const currentProto = appState.fastingTimer.protocolName || 'OMAD (24 hours)';
  const currentIcon = appState.fastingTimer.protocolIcon || '🔥';

  selectedTitle.textContent = currentProto;
  selectedIcon.textContent = currentIcon;

  dropdownItems.forEach(item => {
    if (Number(item.dataset.hours) === currentTarget) {
      item.classList.add('selected');
    } else {
      item.classList.remove('selected');
    }
  });

  // Toggle dropdown open/close when idle
  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (appState.fastingTimer.isRunning) return;
    const isOpen = dropdownList.classList.contains('show');
    if (isOpen) {
      dropdownList.classList.remove('show');
      dropdownBtn.classList.remove('open');
    } else {
      dropdownList.classList.add('show');
      dropdownBtn.classList.add('open');
    }
  });

  // Close dropdown on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('#customDropdownContainer')) {
      dropdownList.classList.remove('show');
      dropdownBtn.classList.remove('open');
    }
  });

  // Handle item selection with proper hover feedback
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      if (appState.fastingTimer.isRunning) return;

      dropdownItems.forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');

      const chosenHours = Number(item.dataset.hours);
      const chosenName = item.dataset.name;
      const chosenIcon = item.dataset.icon;

      selectedTitle.textContent = chosenName;
      selectedIcon.textContent = chosenIcon;

      appState.fastingTimer.targetHours = chosenHours;
      appState.fastingTimer.protocolName = chosenName;
      appState.fastingTimer.protocolIcon = chosenIcon;

      saveStorage(STORAGE_KEYS.FASTING_TIMER, appState.fastingTimer);

      dropdownList.classList.remove('show');
      dropdownBtn.classList.remove('open');
      updateTimerDisplay();
    });
  });

  // START Button: Starts the fast. Locked while running.
  startBtn.addEventListener('click', () => {
    if (appState.fastingTimer.isRunning) {
      alert('A fast is already running! You cannot start over until you click FINISH.');
      return;
    }

    appState.fastingTimer.isRunning = true;
    appState.fastingTimer.startTime = Date.now();
    delete appState.fastingTimer.finishedDuration;

    // Hide any previous completion card
    resultCard.style.display = 'none';

    saveStorage(STORAGE_KEYS.FASTING_TIMER, appState.fastingTimer);
    startTimerLoop();
  });

  // FINISH Button: Concludes fast, assesses goal completion, shows tailored feedback
  finishBtn.addEventListener('click', () => {
    if (!appState.fastingTimer.isRunning) {
      alert('No fast currently running. Select a protocol and click START.');
      return;
    }

    const elapsedSecs = Math.floor((Date.now() - appState.fastingTimer.startTime) / 1000);
    appState.fastingTimer.isRunning = false;
    appState.fastingTimer.finishedDuration = elapsedSecs;
    appState.fastingTimer.startTime = null;

    saveStorage(STORAGE_KEYS.FASTING_TIMER, appState.fastingTimer);
    clearInterval(fastingInterval);
    fastingInterval = null;

    const assessment = getFastingCompletionAssessment(
      appState.fastingTimer.protocolName || 'OMAD (24 hours)',
      appState.fastingTimer.targetHours || 24,
      elapsedSecs
    );

    // Display the detailed result card
    showFastingCompletionCard(assessment);

    updateTimerDisplay();
  });

  dismissBtn.addEventListener('click', () => {
    resultCard.style.display = 'none';
  });

  // Resume timer if page reloaded during active fast
  if (appState.fastingTimer.isRunning && appState.fastingTimer.startTime) {
    startTimerLoop();
  } else {
    updateTimerDisplay();
  }
}

function showFastingCompletionCard(assessment) {
  const card = document.getElementById('fastCompletionCard');
  const title = document.getElementById('completionCardTitle');
  const badge = document.getElementById('completionStatusBadge');
  const resProto = document.getElementById('resProtocolName');
  const resTarget = document.getElementById('resTargetDuration');
  const resActual = document.getElementById('resActualDuration');
  const resPct = document.getElementById('resPctAchieved');
  const resAdvice = document.getElementById('resAdviceText');

  resProto.textContent = appState.fastingTimer.protocolName || 'OMAD (24 hours)';
  resTarget.textContent = assessment.targetFormatted;
  resActual.textContent = assessment.elapsedFormatted;
  resPct.textContent = `${assessment.pctAchieved}%`;
  resAdvice.textContent = assessment.advice;

  if (assessment.isGoalMet) {
    card.className = 'fast-completion-card goal-met';
    title.textContent = '🎉 Fast Goal Achieved!';
    badge.className = 'completion-status-badge badge-met';
    badge.textContent = 'Goal Conquered';
  } else {
    card.className = 'fast-completion-card goal-missed';
    title.textContent = '⚠️ Fast Ended Short of Goal';
    badge.className = 'completion-status-badge badge-missed';
    badge.textContent = 'Goal Incomplete';
  }

  card.style.display = 'block';
  card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function startTimerLoop() {
  if (fastingInterval) clearInterval(fastingInterval);
  updateTimerDisplay();
  fastingInterval = setInterval(updateTimerDisplay, 1000);
}

function formatTime(totalSeconds) {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateTimerDisplay() {
  const displayEl = document.getElementById('fastingTimerDisplay');
  const statusLabel = document.getElementById('fastingStatusLabel');
  const progressBar = document.getElementById('fastingProgressBar');
  const startBtn = document.getElementById('btnStartFast');
  const finishBtn = document.getElementById('btnFinishFast');
  const dropdownBtn = document.getElementById('dropdownTriggerBtn');

  const targetHours = appState.fastingTimer.targetHours || 24;
  const targetSeconds = targetHours * 3600;

  let elapsedSeconds = 0;

  if (appState.fastingTimer.isRunning && appState.fastingTimer.startTime) {
    // Fast is actively running
    elapsedSeconds = Math.floor((Date.now() - appState.fastingTimer.startTime) / 1000);
    displayEl.textContent = formatTime(elapsedSeconds);

    const pct = Math.min(Math.round((elapsedSeconds / targetSeconds) * 100), 100);
    progressBar.style.width = pct + '%';

    // Cannot start over or change protocol mid-fast
    startBtn.disabled = true;
    finishBtn.disabled = false;
    dropdownBtn.disabled = true;
    dropdownBtn.title = 'Protocol locked while fast is running';

    if (elapsedSeconds >= targetSeconds) {
      statusLabel.textContent = `🎯 Fast goal reached (${targetHours}h)! In deep autophagy. Click FINISH when ready to refeed.`;
      progressBar.style.background = 'linear-gradient(90deg, #f59e0b, #10b981)';
    } else {
      const remainingSecs = Math.max(targetSeconds - elapsedSeconds, 0);
      statusLabel.textContent = `🔥 Fast in progress (${pct}%). Target: ${targetHours}h. Remaining: ${formatTime(remainingSecs)}. Stay hydrated.`;
      progressBar.style.background = 'linear-gradient(90deg, #2ee585, #0ea558)';
    }
  } else {
    // Fast is NOT running
    startBtn.disabled = false;
    finishBtn.disabled = true;
    dropdownBtn.disabled = false;
    dropdownBtn.title = 'Choose fasting protocol';

    if (appState.fastingTimer.finishedDuration) {
      elapsedSeconds = appState.fastingTimer.finishedDuration;
      displayEl.textContent = formatTime(elapsedSeconds);
      progressBar.style.width = '100%';
      progressBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
      statusLabel.textContent = `Last fast completed at ${formatTime(elapsedSeconds)}. Ready for your next fast? Choose protocol and click START.`;
    } else {
      displayEl.textContent = '00:00:00';
      progressBar.style.width = '0%';
      statusLabel.textContent = `Ready. Choose your fasting protocol and click START when your fast begins.`;
    }
  }
}

// --- INITIALIZATION ---
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateAuthHeaderUI();
  initFastingTimer();

  if (appState.activeUser) {
    showStep(3); // Logged in -> Dashboard and habits
  } else {
    showStep(1); // Default to Welcome
  }
});

const app = document.getElementById('app');

async function loadAmerixApp() {
  try {
    const response = await fetch('AmerixHealthApp.html');
    if (!response.ok) {
      throw new Error('Could not load AmerixHealthApp.html');
    }

    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const bodyContent = doc.body ? doc.body.innerHTML : '';
    app.innerHTML = bodyContent;

    const styles = doc.querySelectorAll('style');
    styles.forEach((styleTag) => {
      const newStyle = document.createElement('style');
      newStyle.textContent = styleTag.textContent;
      document.head.appendChild(newStyle);
    });

    const scripts = doc.querySelectorAll('script');
    scripts.forEach((scriptTag) => {
      const script = document.createElement('script');
      script.textContent = scriptTag.textContent;
      document.body.appendChild(script);
    });
  } catch (error) {
    app.innerHTML = `
      <div style="padding: 2rem; font-family: Arial, sans-serif; color: #111827;">
        <h2>Unable to load the Amerix app</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}

loadAmerixApp();

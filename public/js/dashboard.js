document.addEventListener('DOMContentLoaded', () => {
  const weatherBox = document.getElementById('weather-content');
  const cityEl = document.getElementById('weather-city');

  if (!weatherBox || !cityEl) {
    return;
  }

  const cityText = cityEl.textContent.trim().toLowerCase();

  if (!cityText || cityText === 'not set yet') {
    return;
  }

  fetch('/api/weather')
    .then((res) => res.json())
    .then((data) => {
      if (!data.ok) {
        weatherBox.innerHTML = `
          <p class="muted mb-0">
            ${data.message || 'Weather is not available now.'}
          </p>
        `;
        return;
      }

      const w = data.weather;

      const temp =
        typeof w.temperature === 'number' ? `${w.temperature}°C` : 'N/A';

      const feelsLike =
        typeof w.feelsLike === 'number' ? `${w.feelsLike}°C` : 'N/A';

      cityEl.textContent = w.city || cityEl.textContent;

      let hint = 'Have a good day.';
      if (typeof w.temperature === 'number') {
        if (w.temperature < 0) {
          hint = 'It is cold outside. Better do tasks inside.';
        } else if (w.temperature > 25) {
          hint = 'Warm weather. Good time for outside tasks.';
        }
      }

      weatherBox.innerHTML = `
        <p class="mb-1">
          <strong>${temp}</strong> — ${w.description}
        </p>
        <p class="muted mb-1">
          Feels like: ${feelsLike}
        </p>
        <p class="muted mb-0">
          ${hint}
        </p>
      `;
    })
    .catch((err) => {
      console.error('Weather fetch error:', err);
      weatherBox.innerHTML = `
        <p class="muted mb-0">
          Could not load weather now.
        </p>
      `;
    });
});

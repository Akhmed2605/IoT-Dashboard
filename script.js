const API_URL = "http://127.0.0.1:5000/data";
const POLL_INTERVAL_MS = 3000;
const MAX_POINTS = 25;

const temperatureValueEl = document.getElementById("temperatureValue");
const chartContext = document.getElementById("temperatureChart");

const temperatureChart = new Chart(chartContext, {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Temperatur",
        data: [],
        borderColor: "#e27d60",
        backgroundColor: "rgba(226, 125, 96, 0.25)",
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
        fill: true
      }
    ]
  },
  options: {
    animation: false,
    responsive: true,
    scales: {
      x: {
        ticks: { color: "#7f6758" },
        grid: { color: "rgba(145, 110, 86, 0.15)" }
      },
      y: {
        ticks: { color: "#7f6758" },
        grid: { color: "rgba(145, 110, 86, 0.15)" },
        title: {
          display: true,
          text: "°C",
          color: "#7f6758"
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: "#3e2a1f"
        }
      }
    }
  }
});

async function fetchTemperature() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }

    const { temperature } = await response.json();
    if (typeof temperature !== "number") {
      throw new Error("Temperature value missing or invalid");
    }

    updateDashboard(temperature);
  } catch (error) {
    console.error("Fehler beim Abrufen der Daten:", error);
  }
}

function updateDashboard(temperature) {
  temperatureValueEl.textContent = `${temperature.toFixed(1)} °C`;

  const timestamp = new Date().toLocaleTimeString("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const labels = temperatureChart.data.labels;
  const data = temperatureChart.data.datasets[0].data;

  labels.push(timestamp);
  data.push(temperature);

  if (labels.length > MAX_POINTS) {
    labels.shift();
    data.shift();
  }

  temperatureChart.update("none");
}

fetchTemperature();
setInterval(fetchTemperature, POLL_INTERVAL_MS);

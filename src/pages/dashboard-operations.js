// Operations Wall demo (needs the Chart.js UMD bundle): sparklines in the key figures, requests by region, service charts.
// Each <canvas data-ops-chart> is one chart; colors come from the theme tokens and follow theme and mode changes.
// The series come from a fixed seed, so a period always starts with the same values. Auto-refresh adds a point every 5 s.
(() => {
  const { Chart } = window;
  const { token, rgba, chartDefaults } = window.ArchitectUI;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  // Number of points and time between two points for each period
  const PERIODS = {
    "1h": { points: 30, step: 120e3, label: { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } },
    "24h": { points: 24, step: 3600e3, label: { hour: "2-digit", minute: "2-digit", hourCycle: "h23" } },
    "7d": { points: 28, step: 6 * 3600e3, label: { weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" } },
    "30d": { points: 30, step: 86400e3, label: { month: "short", day: "numeric" } },
  };

  // Level and spread of every series: key figures, services (thousand requests per minute), regions
  const LEVELS = {
    requests: [48, 5], errors: [0.45, 0.1], latency: [180, 22], sessions: [12.8, 1.1], orders: [1.3, 0.18],
    revenue: [7.6, 1.2], queue: [170, 45], cpu: [60, 7],
    checkout: [8.4, 0.9], search: [14, 1.8], payments: [3.2, 0.5], catalog: [11.6, 1.1], auth: [6.9, 0.7], notify: [2.4, 0.4],
    "eu-west": [18, 2.2], "us-east": [15, 1.8], "us-west": [9, 1.2], apac: [6, 1],
  };
  // Series that end with an outage: the last points fall almost to zero
  const OUTAGE = { notify: 5 };
  const REGIONS = [["eu-west", "EU West", "primary"], ["us-east", "US East", "info"], ["us-west", "US West", "success"], ["apac", "Asia Pacific", "warning"]];

  const period = () => document.querySelector('input[name="ops-period"]:checked')?.value || "1h";
  const regionSelect = document.getElementById("ops-region");
  const refreshSwitch = document.getElementById("ops-refresh");
  const updated = document.getElementById("ops-updated");

  // Small seeded random generator: the same key and period give the same numbers
  function generator(text) {
    let seed = [...text].reduce((hash, char) => Math.imul(hash ^ char.charCodeAt(0), 16777619), 2166136261) >>> 0;
    return () => {
      seed = (seed + 0x6d2b79f5) >>> 0;
      let t = seed;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // One point: a slow wave around the level plus noise
  function point(key, index, random) {
    const [level, spread] = LEVELS[key];
    const value = level + spread * (0.7 * Math.sin(index / 4 + level) + (random() - 0.5));
    return Math.max(0, Math.round(value * 100) / 100);
  }

  let state;

  function build() {
    const { points, step } = PERIODS[period()];
    const now = Date.now();
    state = { index: points, times: Array.from({ length: points }, (_, i) => now - (points - 1 - i) * step), series: {} };
    Object.keys(LEVELS).forEach((key) => {
      const random = generator(key + period());
      state.series[key] = { random, values: Array.from({ length: points }, (_, i) => point(key, i, random)) };
      const outage = OUTAGE[key];
      if (outage) state.series[key].values.splice(-outage, outage, ...Array(outage).fill(0.1));
    });
  }

  const labels = () => state.times.map((time) => new Date(time).toLocaleString("en-US", PERIODS[period()].label));

  const CHARTS = {
    spark: (canvas) => {
      const color = canvas.dataset.opsColor;
      return {
        type: "line",
        data: {
          labels: labels(),
          datasets: [{ data: state.series[canvas.dataset.opsKey].values, borderColor: token(color), backgroundColor: rgba(color, 0.15), fill: true }],
        },
        options: { layout: { padding: 2 }, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } } },
      };
    },
    service: (canvas) => {
      const color = canvas.dataset.opsColor;
      return {
        type: "bar",
        data: {
          labels: labels(),
          datasets: [{ label: "k req/min", data: state.series[canvas.dataset.opsKey].values, backgroundColor: rgba(color, 0.65), borderRadius: 2 }],
        },
        options: {
          plugins: { legend: { display: false } },
          scales: { x: { display: false }, y: { beginAtZero: true, ticks: { maxTicksLimit: 3 }, border: { display: false } } },
        },
      };
    },
    traffic: () => ({
      type: "line",
      data: {
        labels: labels(),
        datasets: REGIONS.map(([key, name, color]) => ({
          label: name, regionKey: key, data: state.series[key].values, borderColor: token(color), backgroundColor: token(color),
          hidden: Boolean(regionSelect.value) && regionSelect.value !== key,
        })),
      },
      options: {
        interaction: { mode: "index", intersect: false },
        plugins: { legend: { position: "top", labels: { boxWidth: 12 } } },
        scales: { x: { ticks: { maxTicksLimit: 8, maxRotation: 0 } }, y: { title: { display: true, text: "k req/min" } } },
      },
    }),
  };

  const charts = [];

  function render() {
    charts.splice(0).forEach((chart) => chart.destroy());
    chartDefaults(Chart);

    document.querySelectorAll("canvas[data-ops-chart]").forEach((canvas) => {
      const { type, data, options } = CHARTS[canvas.dataset.opsChart](canvas);
      charts.push(new Chart(canvas, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: reducedMotion.matches ? false : undefined,
          elements: { point: { radius: 0, hoverRadius: 3 }, line: { tension: 0.35, borderWidth: 2 } },
          ...options,
        },
      }));
    });
  }

  const stamp = () => {
    updated.textContent = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
  };

  // Moves every series one point forward and redraws without animation
  function tick() {
    state.times.push(state.times.at(-1) + PERIODS[period()].step);
    state.times.shift();
    Object.entries(state.series).forEach(([key, series]) => {
      series.values.push(OUTAGE[key] ? 0.1 : point(key, state.index, series.random));
      series.values.shift();
    });
    state.index += 1;
    const next = labels();
    charts.forEach((chart) => {
      chart.data.labels = next;
      chart.update("none");
    });
    stamp();
  }

  // Region filter: the events, the activity and the region lines of the chart
  function filterRegion() {
    const region = regionSelect.value;
    let shown = 0;
    document.querySelectorAll("[data-region]").forEach((item) => {
      const match = !region || item.dataset.region === region;
      item.classList.toggle("d-none", !match);
      if (match && item.matches("tr")) shown += 1;
    });
    document.getElementById("ops-events-count").textContent = shown;
    charts.forEach((chart) => {
      chart.data.datasets.forEach((dataset, index) => {
        if (dataset.regionKey) chart.setDatasetVisibility(index, !region || dataset.regionKey === region);
      });
      chart.update();
    });
  }

  build();
  render();
  stamp();

  document.querySelectorAll('input[name="ops-period"]').forEach((input) => input.addEventListener("change", () => {
    build();
    render();
    stamp();
  }));
  regionSelect.addEventListener("change", filterRegion);
  document.getElementById("ops-reload").addEventListener("click", tick);
  setInterval(() => {
    if (refreshSwitch.checked && !document.hidden) tick();
  }, 5000);
  document.addEventListener("aui:theme-change", render);
})();

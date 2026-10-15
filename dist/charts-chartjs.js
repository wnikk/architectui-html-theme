// Chart.js demo charts (needs the Chart.js UMD bundle). Draws every chart whose <canvas> exists on the page; colors come from the theme tokens.
// Chart height is set by the .aui-chart container (.aui-chart-sm, .aui-chart-lg).
(() => {
  const { Chart } = window;

  // Tokens are read on every render, so charts pick up theme and mode changes
  const css = () => getComputedStyle(document.documentElement);
  const token = (name) => css().getPropertyValue(`--bs-${name}`).trim();
  const rgba = (name, alpha) => `rgba(${token(`${name}-rgb`)}, ${alpha})`;

  const COLORS = ["danger", "warning", "yellow", "success", "info"];
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July"];
  const random = (count) => Array.from({ length: count }, () => Math.round(Math.random() * 100));

  const segments = () => ({
    labels: ["Red", "Orange", "Yellow", "Green", "Blue"],
    datasets: [{ label: "Dataset 1", data: random(5), backgroundColor: COLORS.map(token) }],
  });

  const bars = () => ({
    labels: MONTHS,
    datasets: [
      { label: "Dataset 1", data: random(7), backgroundColor: token("danger") },
      { label: "Dataset 2", data: random(7), backgroundColor: token("info") },
      { label: "Dataset 3", data: random(7), backgroundColor: token("success") },
    ],
  });

  const outlined = () => ({
    labels: MONTHS,
    datasets: [
      { label: "Dataset 1", data: random(7), backgroundColor: rgba("danger", 0.5), borderColor: token("danger"), borderWidth: 1 },
      { label: "Dataset 2", data: random(7), backgroundColor: rgba("info", 0.5), borderColor: token("info"), borderWidth: 1 },
    ],
  });

  const CHARTS = {
    "pie-chart": () => ({ type: "pie", data: segments() }),
    "doughnut-chart": () => ({ type: "doughnut", data: segments() }),
    "polar-chart": () => ({ type: "polarArea", data: segments() }),
    "radar-chart": () => ({
      type: "radar",
      data: {
        labels: [["Eating", "Dinner"], ["Drinking", "Water"], "Sleeping", ["Designing", "Graphics"], "Coding", "Cycling", "Running"],
        datasets: [
          { label: "My First dataset", data: random(7), backgroundColor: rgba("danger", 0.2), borderColor: token("danger"), pointBackgroundColor: token("danger") },
          { label: "My Second dataset", data: random(7), backgroundColor: rgba("info", 0.2), borderColor: token("info"), pointBackgroundColor: token("info") },
        ],
      },
    }),
    "chart-vert-bar": () => ({ type: "bar", data: bars() }),
    "chart-horiz-bar": () => ({ type: "bar", data: outlined(), options: { indexAxis: "y" } }),
    "line-chart": () => ({ type: "line", data: outlined(), options: { elements: { line: { tension: 0.4 } } } }),
    "stacked-bars-chart": () => ({ type: "bar", data: bars(), options: { scales: { x: { stacked: true }, y: { stacked: true } } } }),
  };

  const charts = [];

  function render() {
    charts.splice(0).forEach((chart) => chart.destroy());
    Chart.defaults.font.family = css().getPropertyValue("--bs-body-font-family").trim();
    Chart.defaults.color = css().getPropertyValue("--bs-secondary-color").trim();
    Chart.defaults.borderColor = css().getPropertyValue("--bs-border-color-translucent").trim();

    Object.entries(CHARTS).forEach(([id, config]) => {
      const canvas = document.getElementById(id);
      if (!canvas) {
        return;
      }
      const { type, data, options = {} } = config();
      charts.push(new Chart(canvas, {
        type,
        data,
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } }, ...options },
      }));
    });
  }

  render();
  document.addEventListener("aui:theme-change", render);
})();

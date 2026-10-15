// Графики Chart.js 4 с CDN. Модуль рисует каждый график, для которого на странице есть <canvas>:
// его подключают главная страница и страница ChartJS. Цвета берутся из токенов темы.
// Высоту задаёт контейнер .aui-chart (.aui-chart-sm, .aui-chart-lg).
import Chart from "chart.js/auto";

const css = getComputedStyle(document.documentElement);
const token = (name) => css.getPropertyValue(`--bs-${name}`).trim();
const rgba = (name, alpha) => `rgba(${token(`${name}-rgb`)}, ${alpha})`;

const COLORS = ["danger", "warning", "yellow", "success", "info"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July"];
const random = (count) => Array.from({ length: count }, () => Math.round(Math.random() * 100));

Chart.defaults.font.family = css.getPropertyValue("--bs-body-font-family").trim();
Chart.defaults.color = css.getPropertyValue("--bs-secondary-color").trim();

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

Object.entries(CHARTS).forEach(([id, config]) => {
  const canvas = document.getElementById(id);
  if (!canvas) {
    return;
  }
  const { type, data, options = {} } = config();
  new Chart(canvas, {
    type,
    data,
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "top" } }, ...options },
  });
});

// Страница уведомлений: конфигуратор Toast Bootstrap 5
import { refresh } from "./architectui.js";

const form = document.getElementById("toastForm");
const code = document.getElementById("toastCode");

const value = (name) => form.querySelector(`[name="${name}"]:checked`).value;

function settings() {
  return {
    title: document.getElementById("toastTitle").value.trim(),
    message: document.getElementById("toastMessage").value.trim() || "Toast message",
    color: value("toastColor"),
    position: value("toastPosition"),
    close: document.getElementById("toastClose").checked,
    autohide: document.getElementById("toastAutohide").checked,
    delay: Number(document.getElementById("toastDelay").value) || 5000,
  };
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function markup(s) {
  const close = s.close ? '\n    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' : "";
  const header = s.title
    ? `\n  <div class="toast-header">\n    <i data-lucide="bell" class="text-${s.color} me-2"></i>\n    <strong class="me-auto">${escapeHtml(s.title)}</strong>${close}\n  </div>`
    : "";
  return `<div class="toast border-start border-4 border-${s.color}" role="status" aria-live="polite" aria-atomic="true" data-bs-autohide="${s.autohide}" data-bs-delay="${s.delay}">${header}\n  <div class="toast-body">${escapeHtml(s.message)}</div>\n</div>`;
}

function container(position) {
  const selector = `.toast-container[data-position="${position}"]`;
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement("div");
    element.className = `toast-container position-fixed p-3 ${position}`;
    element.dataset.position = position;
    document.body.append(element);
  }
  return element;
}

function preview() {
  code.textContent = markup(settings());
}

function show() {
  const s = settings();
  const target = container(s.position);
  target.insertAdjacentHTML("beforeend", markup(s));
  const toast = target.lastElementChild;
  toast.addEventListener("hidden.bs.toast", () => toast.remove());
  refresh(toast);
  window.bootstrap.Toast.getOrCreateInstance(toast).show();
}

form.addEventListener("input", preview);
document.getElementById("toastShow").addEventListener("click", show);
document.getElementById("toastClear").addEventListener("click", () => {
  document.querySelectorAll(".toast-container[data-position] .toast").forEach((toast) => {
    window.bootstrap.Toast.getOrCreateInstance(toast).hide();
  });
});

preview();

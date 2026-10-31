/*!
 * =========================================================
 * ArchitectUI v6.2.37 - a theme layer on Bootstrap
 * =========================================================
 * https://github.com/wnikk/architectui-html-theme
 * Copyright (c) 2026 Wnikk
 * Released under the MIT License, see LICENSE
 * =========================================================
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */
// ArchitectUI guest script: pages for a visitor who is not signed in (sign in, sign up, password reset, errors).
// Load it instead of architectui.js: <script defer src="architectui-auth.js"></script>. It has no admin features
// (sidebar, header search, drop zone), and architectui.js has none of these. Its only global is window.ArchitectUI.
//
// Form flow, set with attributes:
//   [data-aui-auth]                    flow container with steps
//   [data-aui-auth-step="name"]        one step; every step except the first has the hidden attribute
//   form[data-aui-auth-form]           checks the fields, locks the form for the request, then opens
//     data-aui-auth-next="name"        the next step
//     data-aui-auth-delay="2000"       request time in ms (a demo without a server)
//     data-aui-auth-reject="000000"    a code that the demo request refuses
//   .otp[data-bs-otp]                  the Bootstrap 6 OTP input for a verification code (sent when complete)
//   [data-aui-auth-error]              message shown when the request refuses the code
//   [data-aui-auth-back="name"]        button that returns to a step
//   [data-aui-auth-resend]             button that sends the code again; data-aui-auth-timer="30" seconds
//   [data-aui-auth-echo="#id"]         shows the value of a field from an earlier step
//   [data-aui-auth-redirect="url"]     on a step: opens the address after a short pause
// Field checks use the Bootstrap 6 validation (data-bs-validate on the form); a refused form shakes
// with the animation-shake utility.
(() => {
  const root = document.documentElement;
  const STORAGE_KEY = "architectui";
  const systemDark = matchMedia("(prefers-color-scheme: dark)");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");

  // Mode: the same storage and rules as architectui.js
  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  }

  function applyMode() {
    const settings = readSettings();
    const theme = root.getAttribute("data-aui-theme") || "";
    const darkOnly = theme && (root.dataset.auiDarkOnly || "").split(" ").includes(theme);
    const mode = settings.mode || "light";
    const dark = darkOnly || mode === "dark" || (mode === "system" && systemDark.matches);
    root.setAttribute("data-bs-theme", dark ? "dark" : "light");
  }

  function toggleMode() {
    const settings = readSettings();
    settings.mode = root.getAttribute("data-bs-theme") === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // Storage is unavailable (private mode): the mode lasts until the page reloads
    }
    // The page cross-fades to the new mode (View Transitions API) where the browser has it
    if (document.startViewTransition && !reducedMotion.matches) {
      document.startViewTransition(applyMode).ready.catch(() => {});
    } else {
      applyMode();
    }
  }

  const refresh = () => window.lucide?.createIcons();
  // Icons in markup added later render by themselves
  const watch = () => new MutationObserver((records) => {
    if (records.some((record) => [...record.addedNodes].some((node) => node.nodeType === 1
      && (node.matches("i[data-lucide]") || node.querySelector("i[data-lucide]"))))) refresh();
  }).observe(document.body, { childList: true, subtree: true });

  // Steps
  const replay = (el, name) => {
    if (!el) return;
    el.classList.remove(name);
    void el.offsetWidth; // restart the animation
    el.classList.add(name);
  };

  // One countdown per button: a new start replaces the running one
  const timers = new WeakMap();

  function startTimer(button) {
    clearInterval(timers.get(button));
    const seconds = Number(button.dataset.auiAuthTimer) || 30;
    const counter = button.querySelector("[data-aui-auth-countdown]");
    let left = seconds;
    button.disabled = true;
    const tick = () => {
      if (counter) counter.textContent = left > 0 ? `(${left} s)` : "";
      if (left-- <= 0) {
        clearInterval(timer);
        button.disabled = false;
      }
    };
    const timer = setInterval(tick, 1000);
    timers.set(button, timer);
    tick();
  }

  function showStep(flow, name) {
    const next = flow.querySelector(`[data-aui-auth-step="${name}"]`);
    if (!next) return;
    flow.querySelectorAll("[data-aui-auth-step]").forEach((step) => { step.hidden = step !== next; });
    replay(next, "aui-auth-enter");
    flow.querySelectorAll("[data-aui-auth-echo]").forEach((el) => {
      el.textContent = document.querySelector(el.dataset.auiAuthEcho)?.value || "";
    });
    next.querySelectorAll("[data-aui-auth-resend]").forEach(startTimer);
    (next.querySelector("input:not([type=hidden])") || next.querySelector("h1, h2"))?.focus();
    if (next.dataset.auiAuthRedirect) setTimeout(() => location.assign(next.dataset.auiAuthRedirect), 1800);
  }

  // Request: the fieldset is disabled, the submit button shows its spinner
  function lock(form, busy) {
    form.querySelector("fieldset").disabled = busy;
    form.setAttribute("aria-busy", String(busy));
    form.querySelectorAll("[type=submit] .spinner-border").forEach((spinner) => { spinner.hidden = !busy; });
  }

  // The OTP input of a form, its real field and its value
  const otpOf = (form) => form.querySelector(".otp");
  const otpInput = (otp) => otp.querySelector("input");
  const codeOf = (form) => otpInput(otpOf(form)).value;

  function showCodeError(form, message) {
    otpOf(form).classList.add("is-invalid");
    const error = form.querySelector("[data-aui-auth-error]");
    if (error) {
      if (message) error.textContent = message;
      error.classList.add("d-block");
    }
    replay(otpOf(form), "animation-shake");
  }

  function clearCodeError(form) {
    otpOf(form)?.classList.remove("is-invalid");
    form.querySelector("[data-aui-auth-error]")?.classList.remove("d-block");
  }

  function clearCode(otp) {
    const input = otpInput(otp);
    const plugin = window.bootstrap?.OtpInput.getInstance(input);
    if (plugin) {
      plugin.clear();
      plugin.focus();
    } else {
      input.value = "";
      input.focus();
    }
  }

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-aui-auth-form]");
    if (!form) return;
    event.preventDefault();
    const otp = otpOf(form);
    if (otp) {
      const size = Number(otpInput(otp).maxLength) || 6;
      if (codeOf(form).length < size) {
        showCodeError(form, `Enter all ${size} digits.`);
        otpInput(otp).focus();
        return;
      }
    } else if (!form.checkValidity()) {
      replay(form, "animation-shake");
      form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
      return;
    }
    lock(form, true);
    setTimeout(() => {
      lock(form, false);
      if (otp && codeOf(form) === form.dataset.auiAuthReject) {
        showCodeError(form, form.querySelector("[data-aui-auth-error]")?.dataset.auiAuthMessage);
        clearCode(otp);
        return;
      }
      showStep(form.closest("[data-aui-auth]"), form.dataset.auiAuthNext);
    }, Number(form.dataset.auiAuthDelay) || 2000);
  });

  // A complete code sends the form; typing clears the error
  document.addEventListener("complete.bs.otpInput", (event) => {
    event.target.closest("form[data-aui-auth-form]")?.requestSubmit();
  });

  document.addEventListener("input.bs.otpInput", (event) => {
    const form = event.target.closest("form[data-aui-auth-form]");
    if (form) clearCodeError(form);
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-aui-toggle='mode'], [data-aui-auth-back], [data-aui-auth-resend]");
    if (!target) return;
    if (target.matches("[data-aui-toggle='mode']")) {
      toggleMode();
    } else if (target.matches("[data-aui-auth-back]")) {
      showStep(target.closest("[data-aui-auth]"), target.dataset.auiAuthBack);
    } else {
      startTimer(target);
    }
  });

  systemDark.addEventListener("change", applyMode);

  window.ArchitectUI = Object.freeze({ refresh });
  refresh();
  watch();
})();

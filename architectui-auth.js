// ArchitectUI guest script: pages for a visitor who is not signed in (sign in, sign up, password reset, errors).
// Load it instead of architectui.js: <script defer src="architectui-auth.js"></script>. It has no admin features
// (sidebar, settings panel), and architectui.js has none of these. Its only global is window.ArchitectUI.
//
// Form flow, set with attributes:
//   [data-aui-auth]                    flow container with steps
//   [data-aui-auth-step="name"]        one step; every step except the first has the hidden attribute
//   form[data-aui-auth-form]           checks the fields, locks the form for the request, then opens
//     data-aui-auth-next="name"        the next step
//     data-aui-auth-delay="2000"       request time in ms (a demo without a server)
//     data-aui-auth-reject="000000"    a code that the demo request refuses
//   [data-aui-otp]                     group of one-digit inputs for a verification code
//   [data-aui-auth-error]              message shown when the request refuses the code
//   [data-aui-auth-back="name"]        button that returns to a step
//   [data-aui-auth-resend]             button that sends the code again; data-aui-auth-timer="30" seconds
//   [data-aui-auth-echo="#id"]         shows the value of a field from an earlier step
//   [data-aui-auth-redirect="url"]     on a step: opens the address after a short pause
(() => {
  const root = document.documentElement;
  const STORAGE_KEY = "architectui";
  const systemDark = matchMedia("(prefers-color-scheme: dark)");

  // Mode: the same storage and rules as architectui.js, without the settings panel
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
    applyMode();
  }

  const refresh = () => window.lucide?.createIcons();

  // Steps
  const replay = (el, name) => {
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

  const codeOf = (form) => [...form.querySelectorAll("[data-aui-otp] input")].map((input) => input.value).join("");

  function showCodeError(form, message) {
    const inputs = form.querySelectorAll("[data-aui-otp] input");
    inputs.forEach((input) => input.classList.add("is-invalid"));
    const error = form.querySelector("[data-aui-auth-error]");
    if (error) {
      if (message) error.textContent = message;
      error.classList.add("d-block");
    }
    replay(form.querySelector("[data-aui-otp]"), "aui-auth-shake");
  }

  function clearCodeError(form) {
    form.querySelectorAll("[data-aui-otp] input").forEach((input) => input.classList.remove("is-invalid"));
    form.querySelector("[data-aui-auth-error]")?.classList.remove("d-block");
  }

  document.addEventListener("submit", (event) => {
    const form = event.target.closest("form[data-aui-auth-form]");
    if (!form) return;
    event.preventDefault();
    const otp = form.querySelector("[data-aui-otp]");
    if (otp) {
      const size = otp.querySelectorAll("input").length;
      if (codeOf(form).length < size) {
        showCodeError(form, `Enter all ${size} digits.`);
        [...otp.querySelectorAll("input")].find((input) => !input.value)?.focus();
        return;
      }
    } else if (!form.checkValidity()) {
      form.classList.add("was-validated");
      replay(form, "aui-auth-shake");
      form.querySelector("input:invalid, select:invalid, textarea:invalid")?.focus();
      return;
    }
    lock(form, true);
    setTimeout(() => {
      lock(form, false);
      if (otp && codeOf(form) === form.dataset.auiAuthReject) {
        showCodeError(form, form.querySelector("[data-aui-auth-error]")?.dataset.auiAuthMessage);
        otp.querySelectorAll("input").forEach((input) => { input.value = ""; });
        otp.querySelector("input").focus();
        return;
      }
      showStep(form.closest("[data-aui-auth]"), form.dataset.auiAuthNext);
    }, Number(form.dataset.auiAuthDelay) || 2000);
  });

  // Puts digits into the fields from the given one on, then focuses the first empty field or sends the form
  function fillCode(inputs, start, digits) {
    digits.split("").slice(0, inputs.length - start).forEach((digit, i) => { inputs[start + i].value = digit; });
    const empty = inputs.find((input) => !input.value);
    if (empty) empty.focus();
    else inputs[0].form.requestSubmit();
  }

  // Code input: one digit per field, the focus moves on; Backspace goes back. A pasted code, or a code that
  // the phone fills in from a message (autocomplete="one-time-code"), is spread over the fields.
  document.addEventListener("input", (event) => {
    const input = event.target;
    const otp = input.closest("[data-aui-otp]");
    if (!otp) return;
    const inputs = [...otp.querySelectorAll("input")];
    // A typed digit replaces the field, wherever the caret was; pasted or filled-in text is cleaned
    const typed = event.inputType === "insertText" && /^\d$/.test(event.data || "");
    const digits = typed ? event.data : input.value.replace(/\D/g, "");
    clearCodeError(input.form);
    if (digits.length > 1) {
      fillCode(inputs, inputs.indexOf(input), digits);
      return;
    }
    input.value = digits;
    if (digits) fillCode(inputs, inputs.indexOf(input), digits);
  });

  // A focused field selects its digit, so the next key replaces it
  document.addEventListener("focusin", (event) => {
    if (event.target.closest?.("[data-aui-otp]")) event.target.select();
  });

  document.addEventListener("keydown", (event) => {
    const input = event.target;
    const otp = input.closest?.("[data-aui-otp]");
    if (!otp) return;
    const inputs = [...otp.querySelectorAll("input")];
    const index = inputs.indexOf(input);
    if (event.key === "Backspace" && !input.value && index > 0) {
      inputs[index - 1].value = "";
      inputs[index - 1].focus();
      event.preventDefault();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputs[index - 1].focus();
      event.preventDefault();
    } else if (event.key === "ArrowRight" && index < inputs.length - 1) {
      inputs[index + 1].focus();
      event.preventDefault();
    }
  });

  document.addEventListener("paste", (event) => {
    const otp = event.target.closest?.("[data-aui-otp]");
    if (!otp) return;
    event.preventDefault();
    const digits = (event.clipboardData?.getData("text") || "").replace(/\D/g, "");
    const inputs = [...otp.querySelectorAll("input")];
    inputs.forEach((input) => { input.value = ""; });
    clearCodeError(event.target.form);
    fillCode(inputs, 0, digits);
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
})();

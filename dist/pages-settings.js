// Settings page: sections as Bootstrap tabs (the address keeps the open one, a select switches them on phones),
// forms with Bootstrap validation, sessions, integrations, API keys, the data export and the deletion of the account
// with a typed confirmation. A demo: changes stay until the page reloads, keys are random demo strings.
(() => {
  const root = document.getElementById("settings");
  if (!root) return;

  const select = document.getElementById("settingsSection");
  const toastEl = document.getElementById("settingsToast");
  const tabOf = (id) => root.querySelector(`[data-bs-target="#${id}"]`);

  function notify(text) {
    toastEl.querySelector("[data-toast-text]").textContent = text;
    window.bootstrap.Toast.getOrCreateInstance(toastEl).show();
  }

  function open(id, focus = false) {
    const tab = tabOf(id);
    if (!tab) return;
    window.bootstrap.Tab.getOrCreateInstance(tab).show();
    if (focus) document.getElementById(id).focus({ preventScroll: true });
  }

  // The open section is part of the address: #security opens Security
  root.addEventListener("shown.bs.tab", (event) => {
    const id = event.target.dataset.bsTarget.slice(1);
    select.value = id;
    try {
      history.replaceState(null, "", `#${id}`);
    } catch {
      // file:// may refuse; the section is open anyway
    }
  });
  select.addEventListener("change", () => open(select.value, true));
  addEventListener("hashchange", () => open(location.hash.slice(1)));
  if (location.hash) open(location.hash.slice(1));

  // Forms: Bootstrap validation, then a toast
  root.querySelectorAll("form[data-save]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (form.matches("[data-password]")) {
        const repeat = form.querySelector("#pwRepeat");
        repeat.setCustomValidity(repeat.value === form.querySelector("#pwNew").value ? "" : "mismatch");
      }
      form.classList.add("was-validated");
      if (!form.checkValidity()) {
        form.querySelector(":invalid")?.focus();
        return;
      }
      notify(form.dataset.save);
      if (form.matches("[data-password]")) {
        form.reset();
        form.classList.remove("was-validated");
      }
    });
  });
  root.querySelector("#pwRepeat").addEventListener("input", (event) => event.target.setCustomValidity(""));

  root.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    if (button.matches("[data-toast]")) {
      notify(button.dataset.toast);
    } else if (button.matches("[data-session-out]")) {
      button.closest("li").remove();
      notify("The device is signed out");
    } else if (button.matches("[data-sessions-out]")) {
      root.querySelectorAll("[data-sessions] [data-session-out]").forEach((b) => b.closest("li").remove());
      button.disabled = true;
      notify("All other devices are signed out");
    } else if (button.matches("[data-connect]")) {
      const on = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(on));
      button.textContent = on ? "Disconnect" : "Connect";
      button.classList.toggle("btn-outline-secondary", on);
      button.classList.toggle("btn-outline-primary", !on);
      button.closest("[data-integration]").querySelector("[data-connected]").classList.toggle("d-none", !on);
      notify(`${button.dataset.connect} ${on ? "connected" : "disconnected"}`);
    } else if (button.matches("[data-revoke]")) {
      const name = button.closest("tr").querySelector(".fw-bold").textContent;
      button.closest("tr").remove();
      notify(`Key revoked: ${name}`);
    } else if (button.matches("[data-export]")) {
      button.disabled = true;
      button.textContent = "Export requested";
      root.querySelector("[data-export-status]").classList.remove("d-none");
    } else if (button.matches("[data-delete-cancel]")) {
      root.querySelector("[data-delete-scheduled]").classList.add("d-none");
      root.querySelector("[data-delete-intro]").classList.remove("d-none");
      notify("The deletion is cancelled");
    }
  });

  // API key: name and access, then the new key once with a copy button
  const keyModalEl = document.getElementById("keyModal");
  const keyForm = keyModalEl.querySelector("[data-key-form]");
  const step = (name) => keyForm.querySelectorAll("[data-key-step]").forEach((s) => s.classList.toggle("d-none", s.dataset.keyStep !== name));
  keyModalEl.addEventListener("show.bs.modal", () => {
    keyForm.reset();
    keyForm.classList.remove("was-validated");
    step("form");
    keyForm.querySelector("[data-key-create]").classList.remove("d-none");
  });
  keyModalEl.addEventListener("shown.bs.modal", () => keyForm.querySelector("#keyName").focus());
  keyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    keyForm.classList.add("was-validated");
    if (!keyForm.checkValidity()) return;
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    const key = `aui_demo_${[...bytes].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
    keyForm.querySelector("[data-new-key]").value = key;
    step("done");
    keyForm.querySelector("[data-key-create]").classList.add("d-none");
    const row = document.createElement("tr");
    const cell = (html) => Object.assign(document.createElement("td"), html);
    const name = cell({});
    name.append(Object.assign(document.createElement("div"), { className: "fw-bold", textContent: keyForm.querySelector("#keyName").value.trim() }),
      Object.assign(document.createElement("div"), { className: "small text-body-secondary", textContent: "Created just now" }));
    const code = cell({});
    code.append(Object.assign(document.createElement("code"), { className: "text-nowrap", textContent: `${key.slice(0, 13)}…${key.slice(-4)}` }));
    const revoke = cell({ className: "text-end" });
    const revokeButton = Object.assign(document.createElement("button"), { type: "button", className: "btn btn-sm btn-outline-danger" });
    revokeButton.setAttribute("data-revoke", "");
    revokeButton.setAttribute("aria-label", `Revoke ${keyForm.querySelector("#keyName").value.trim()}`);
    const trash = Object.assign(document.createElement("i"), { className: "d-sm-none" });
    trash.setAttribute("data-lucide", "trash");
    revokeButton.append(trash, Object.assign(document.createElement("span"), { className: "d-none d-sm-inline", textContent: "Revoke" }));
    revoke.append(revokeButton);
    row.append(name, code, cell({ className: "d-none d-md-table-cell", textContent: keyForm.querySelector("#keyScope").value }),
      cell({ className: "d-none d-md-table-cell text-nowrap small text-body-secondary", textContent: "Never" }), revoke);
    root.querySelector("[data-keys]").prepend(row);
  });
  keyForm.querySelector("[data-copy-key]").addEventListener("click", async () => {
    const value = keyForm.querySelector("[data-new-key]").value;
    try {
      await navigator.clipboard.writeText(value);
      notify("The key is copied");
    } catch {
      keyForm.querySelector("[data-new-key]").select();
    }
  });

  // Deletion: the button works only with the typed word and the check mark
  const deleteModalEl = document.getElementById("deleteAccountModal");
  const deleteForm = deleteModalEl.querySelector("[data-delete-form]");
  const confirmField = deleteForm.querySelector("#deleteConfirm");
  const understand = deleteForm.querySelector("#deleteUnderstand");
  const submit = deleteForm.querySelector("[data-delete-submit]");
  const ready = () => {
    submit.disabled = !(confirmField.value.trim() === confirmField.dataset.expected && understand.checked);
  };
  deleteForm.addEventListener("input", ready);
  deleteModalEl.addEventListener("show.bs.modal", () => {
    deleteForm.reset();
    ready();
  });
  deleteModalEl.addEventListener("shown.bs.modal", () => confirmField.focus());
  deleteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (submit.disabled) return;
    const date = new Date(Date.now() + 30 * 86400000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    root.querySelector("[data-delete-date]").textContent = date;
    root.querySelector("[data-delete-intro]").classList.add("d-none");
    root.querySelector("[data-delete-scheduled]").classList.remove("d-none");
    window.bootstrap.Modal.getOrCreateInstance(deleteModalEl).hide();
    notify("The account is scheduled for deletion");
  });
})();

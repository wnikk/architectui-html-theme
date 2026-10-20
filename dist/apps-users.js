// Users page: search, role and status filters, pages of 10, add and edit in one modal form with Bootstrap validation,
// delete with a confirmation. The list lives in the browser: changes stay until the page reloads.
(() => {
  const root = document.getElementById("users");
  if (!root) return;

  const data = JSON.parse(document.getElementById("usersData").textContent);
  let users = data.users.map((u) => ({ ...u }));
  const roleOf = (id) => data.roles.find((r) => r.id === id) ?? { title: "", color: "secondary" };
  const statusOf = (id) => data.statuses.find((s) => s.id === id) ?? { title: "", color: "secondary" };
  const initials = (name) => name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();

  const PER_PAGE = 10;
  let page = 1;
  const filters = root.querySelector("[data-filters]");
  const rows = root.querySelector("[data-rows]");
  const empty = root.querySelector("[data-empty]");
  const summary = root.querySelector("[data-summary]");
  const pager = root.querySelector("[data-pager]");
  const template = document.getElementById("userRowTemplate");

  const formModalEl = document.getElementById("userModal");
  const form = formModalEl.querySelector("[data-user-form]");
  const formModal = () => window.bootstrap.Modal.getOrCreateInstance(formModalEl);
  const deleteModalEl = document.getElementById("userDeleteModal");
  const deleteModal = () => window.bootstrap.Modal.getOrCreateInstance(deleteModalEl);
  const toastEl = document.getElementById("userToast");
  let editing = null;
  let deleting = null;

  function notify(text) {
    toastEl.querySelector("[data-toast-text]").textContent = text;
    window.bootstrap.Toast.getOrCreateInstance(toastEl).show();
  }

  function visible() {
    const query = filters.query.value.trim().toLowerCase();
    const role = filters.role.value;
    const status = filters.status.value;
    return users.filter((u) => (!query || `${u.name} ${u.email}`.toLowerCase().includes(query))
      && (!role || u.role === role) && (!status || u.status === status));
  }

  // One row from the template of the page (partials/user-row.njk)
  function row(u) {
    const tr = template.content.firstElementChild.cloneNode(true);
    const field = (name) => tr.querySelector(`[data-field="${name}"]`);
    const role = roleOf(u.role);
    const status = statusOf(u.status);
    tr.dataset.user = u.id;
    const photo = field("photo");
    if (u.avatar) photo.src = `assets/images/avatars/${u.avatar}.jpg`;
    photo.classList.toggle("d-none", !u.avatar);
    field("initials").classList.toggle("d-none", Boolean(u.avatar));
    field("initials").textContent = initials(u.name);
    field("name").textContent = u.name;
    field("email").textContent = u.email;
    field("role").className = `badge bg-${role.color}-subtle text-${role.color}-emphasis`;
    field("role").textContent = role.title;
    field("team").textContent = u.team;
    field("status-dot").className = `d-inline-block p-1 rounded-circle bg-${status.color}`;
    field("status").textContent = status.title;
    const twoStep = field("two-step");
    twoStep.className = `d-inline-flex align-items-center gap-1 small ${u.twoStep ? "text-success-emphasis" : "text-body-secondary"}`;
    const icon = document.createElement("i");
    icon.setAttribute("data-lucide", u.twoStep ? "shield-check" : "shield-off");
    twoStep.replaceChildren(icon, Object.assign(document.createElement("span"), { textContent: u.twoStep ? "On" : "Off" }));
    field("last-active").textContent = u.lastActive;
    tr.querySelector('[data-action="edit"]').setAttribute("aria-label", `Edit ${u.name}`);
    const del = tr.querySelector('[data-action="delete"]');
    del.setAttribute("aria-label", `Delete ${u.name}`);
    del.disabled = u.role === "owner";
    if (del.disabled) del.title = "An owner cannot be deleted";
    else del.removeAttribute("title");
    return tr;
  }

  function pageButton(label, target, { current = false, disabled = false, icon = null } = {}) {
    const li = Object.assign(document.createElement("li"), { className: `page-item${current ? " active" : ""}${disabled ? " disabled" : ""}` });
    const button = Object.assign(document.createElement("button"), { type: "button", className: "page-link", disabled });
    button.dataset.page = target;
    if (icon) {
      button.setAttribute("aria-label", label);
      const i = document.createElement("i");
      i.setAttribute("data-lucide", icon);
      button.append(i);
    } else button.textContent = label;
    if (current) button.setAttribute("aria-current", "page");
    li.append(button);
    return li;
  }

  function render() {
    const list = visible();
    const pages = Math.max(1, Math.ceil(list.length / PER_PAGE));
    page = Math.min(page, pages);
    const start = (page - 1) * PER_PAGE;
    rows.replaceChildren(...list.slice(start, start + PER_PAGE).map(row));
    empty.classList.toggle("d-none", list.length > 0);
    rows.closest("table").classList.toggle("d-none", list.length === 0);
    summary.textContent = list.length
      ? `Showing ${start + 1}–${Math.min(start + PER_PAGE, list.length)} of ${list.length} users`
      : "No users";
    pager.replaceChildren(
      pageButton("Previous", page - 1, { disabled: page === 1, icon: "chevron-left" }),
      ...Array.from({ length: pages }, (_, i) => pageButton(String(i + 1), i + 1, { current: i + 1 === page })),
      pageButton("Next", page + 1, { disabled: page === pages, icon: "chevron-right" }),
    );
    pager.closest("nav").classList.toggle("d-none", pages < 2);
    for (const stat of document.querySelectorAll("#userStats [data-stat]")) {
      const id = stat.dataset.stat;
      stat.textContent = id === "all" ? users.length : users.filter((u) => u.status === id).length;
    }
  }

  // Form: the same modal adds and edits; the email must be unique
  function openForm(u = null) {
    editing = u;
    form.reset();
    form.classList.remove("was-validated");
    form.email.setCustomValidity("");
    form.name.setCustomValidity("");
    const isNew = !u;
    formModalEl.querySelector("#userModalTitle").textContent = isNew ? "Add user" : "Edit user";
    form.querySelector("[data-submit]").textContent = isNew ? "Add user" : "Save changes";
    form.querySelector("[data-new-only]").classList.toggle("d-none", !isNew);
    if (u) {
      form.name.value = u.name;
      form.email.value = u.email;
      form.role.value = u.role;
      form.team.value = u.team;
      form.status.value = u.status;
      form.twoStep.checked = u.twoStep;
    }
    formModal().show();
  }

  formModalEl.addEventListener("shown.bs.modal", () => form.name.focus());

  form.email.addEventListener("input", () => form.email.setCustomValidity(""));
  form.name.addEventListener("input", () => form.name.setCustomValidity(""));

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = form.email.value.trim().toLowerCase();
    const taken = users.some((u) => u.email.toLowerCase() === email && u !== editing);
    form.email.setCustomValidity(taken ? "taken" : "");
    // minlength checks typed text only; a pasted or filled value is checked here
    form.name.setCustomValidity(form.name.value.trim().length < 2 ? "short" : "");
    form.querySelector("[data-email-feedback]").textContent = taken ? "A user with this email already exists." : "Enter a valid email.";
    form.classList.add("was-validated");
    if (!form.checkValidity()) {
      form.querySelector(":invalid")?.focus();
      return;
    }
    const values = {
      name: form.name.value.trim(), email, role: form.role.value, team: form.team.value,
      status: form.status.value, twoStep: form.twoStep.checked,
    };
    if (editing) {
      Object.assign(editing, values);
      notify(`Changes saved: ${values.name}`);
    } else {
      users.unshift({ id: `u${Date.now()}`, avatar: 0, lastActive: values.status === "active" ? "Online now" : "Never", ...values });
      filters.reset();
      page = 1;
      notify(form.invite.checked ? `Invitation sent to ${email}` : `User added: ${values.name}`);
    }
    formModal().hide();
    render();
  });

  // Delete with a confirmation
  deleteModalEl.querySelector("[data-confirm-delete]").addEventListener("click", () => {
    if (!deleting) return;
    users = users.filter((u) => u !== deleting);
    notify(`User deleted: ${deleting.name}`);
    deleting = null;
    deleteModal().hide();
    render();
  });

  document.addEventListener("click", (event) => {
    const action = event.target.closest("[data-action]");
    const pageLink = event.target.closest("[data-page]");
    if (pageLink && root.contains(pageLink)) {
      page = Number(pageLink.dataset.page);
      render();
      rows.closest(".card").scrollIntoView({ block: "start", behavior: "smooth" });
      return;
    }
    if (!action || !root.contains(action)) return;
    const u = users.find((x) => x.id === action.closest("[data-user]")?.dataset.user);
    if (action.dataset.action === "add") openForm();
    else if (action.dataset.action === "edit" && u) openForm(u);
    else if (action.dataset.action === "delete" && u) {
      deleting = u;
      deleteModalEl.querySelector("[data-delete-name]").textContent = u.name;
      deleteModal().show();
    } else if (action.dataset.action === "reset") {
      filters.reset();
      page = 1;
      render();
    }
  });

  filters.addEventListener("input", () => {
    page = 1;
    render();
  });
  filters.addEventListener("submit", (event) => event.preventDefault());

  render();
})();

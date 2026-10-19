// Kanban demo: drag cards between columns (HTML drag and drop), or move them with the card menu (keyboard,
// touch screens). Add a card at the end of a column, filter by text and label. Changes stay until the page reloads.
(() => {
  const board = document.getElementById("kanban");
  if (!board) return;

  const template = document.getElementById("kanban-card-template");
  const search = document.getElementById("kanban-search");
  const labelFilter = document.getElementById("kanban-label");
  const status = document.getElementById("kanban-status");
  let dragged = null;
  let created = 0;

  const columns = () => [...board.querySelectorAll("[data-column]")];
  const listOf = (column) => column.querySelector("[data-kanban-list]");
  const titleOf = (column) => column.querySelector(`#kanban-${column.dataset.column}`).textContent;

  // Counters, limits and the disabled "Move to" item of the card's own column
  function update() {
    columns().forEach((column) => {
      const count = column.querySelectorAll("[data-card]").length;
      const badge = column.querySelector("[data-count]");
      const over = Boolean(column.dataset.limit) && count > Number(column.dataset.limit);
      badge.textContent = count;
      badge.classList.toggle("text-bg-danger", over);
      badge.classList.toggle("text-bg-secondary", !over);
      badge.title = over ? "More cards than the limit" : "";
      column.querySelectorAll("[data-move-to]").forEach((item) => {
        item.disabled = item.dataset.moveTo === column.dataset.column;
      });
    });
  }

  function filter() {
    const query = search.value.trim().toLowerCase();
    const label = labelFilter.value;
    board.querySelectorAll("[data-card]").forEach((card) => {
      const text = card.querySelector("[data-card-title]").textContent.toLowerCase();
      const match = (!query || text.includes(query)) && (!label || card.dataset.labels.split(" ").includes(label));
      card.classList.toggle("d-none", !match);
    });
  }

  // Drag and drop: the card moves live to the place under the pointer
  board.addEventListener("dragstart", (event) => {
    const card = event.target.closest?.("[data-card]");
    if (!card) return;
    dragged = card;
    card.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", card.dataset.card);
  });

  board.addEventListener("dragover", (event) => {
    const list = event.target.closest?.("[data-kanban-list]");
    if (!list || !dragged) return;
    event.preventDefault();
    board.querySelectorAll(".is-over").forEach((other) => other !== list && other.classList.remove("is-over"));
    list.classList.add("is-over");
    const before = [...list.querySelectorAll("[data-card]:not(.is-dragging)")].find((card) => {
      const box = card.getBoundingClientRect();
      return event.clientY < box.top + box.height / 2;
    });
    if (before) {
      if (before.previousElementSibling !== dragged) list.insertBefore(dragged, before);
    } else if (list.lastElementChild !== dragged) {
      list.append(dragged);
    }
  });

  board.addEventListener("drop", (event) => {
    if (event.target.closest?.("[data-kanban-list]")) event.preventDefault();
  });

  board.addEventListener("dragend", () => {
    if (!dragged) return;
    const column = dragged.closest("[data-column]");
    dragged.classList.remove("is-dragging");
    board.querySelectorAll(".is-over").forEach((list) => list.classList.remove("is-over"));
    status.textContent = `${dragged.querySelector("[data-card-title]").textContent}: ${titleOf(column)}`;
    dragged = null;
    update();
  });

  board.addEventListener("click", (event) => {
    // "Move to": the card goes to the end of that column and keeps the focus
    const item = event.target.closest("[data-move-to]");
    if (item) {
      const card = item.closest("[data-card]");
      const column = board.querySelector(`[data-column="${item.dataset.moveTo}"]`);
      listOf(column).append(card);
      update();
      card.focus();
      status.textContent = `${card.querySelector("[data-card-title]").textContent}: ${titleOf(column)}`;
      return;
    }

    const column = event.target.closest("[data-column]");
    const add = event.target.closest("[data-add-card]");
    const cancel = event.target.closest("[data-add-cancel]");
    if (add || cancel) {
      const form = column.querySelector("[data-add-form]");
      column.querySelector("[data-add-card]").classList.toggle("d-none", Boolean(add));
      form.classList.toggle("d-none", Boolean(cancel));
      if (add) form.querySelector("textarea").focus();
      else form.reset();
    }
  });

  // A new card from the template; its icons render by themselves (architectui.js watches new markup)
  board.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.target;
    const column = form.closest("[data-column]");
    const title = form.querySelector("textarea").value.trim();
    if (!title) return;
    const card = template.content.firstElementChild.cloneNode(true);
    created += 1;
    card.dataset.card = `card-new-${created}`;
    card.setAttribute("aria-label", title);
    card.querySelector("[data-card-title]").textContent = title;
    listOf(column).append(card);
    form.reset();
    form.querySelector("textarea").focus();
    update();
    filter();
    status.textContent = `${title}: ${titleOf(column)}`;
  });

  // Enter adds the card, Shift+Enter makes a new line, Escape closes the form
  board.addEventListener("keydown", (event) => {
    const field = event.target.closest?.("[data-add-form] textarea");
    if (!field) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      field.form.requestSubmit();
    } else if (event.key === "Escape") {
      field.closest("[data-column]").querySelector("[data-add-cancel]").click();
    }
  });

  search.addEventListener("input", filter);
  labelFilter.addEventListener("change", filter);
  update();
})();

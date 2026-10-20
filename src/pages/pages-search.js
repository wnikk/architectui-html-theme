// Search Results page: reads ?q= (a sample search when it is missing), finds the items of the index that contain every word, groups them by type with
// counts, and highlights the words with <mark>. A new search updates the address without a reload.
(() => {
  const root = document.getElementById("search");
  if (!root) return;

  const index = JSON.parse(document.getElementById("searchIndex").textContent);
  const types = Object.fromEntries(index.types.map((t) => [t.id, t]));
  const form = root.querySelector("[data-search-form]");
  const field = form.q;
  const results = root.querySelector("[data-results]");
  const empty = root.querySelector("[data-empty]");
  const summary = root.querySelector("[data-summary]");
  let type = "all";
  let found = [];

  const words = (query) => query.toLowerCase().split(/\s+/).filter(Boolean);
  const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Text with the words wrapped in <mark>, built from text nodes (no HTML from the index)
  function highlighted(text, list) {
    const span = document.createElement("span");
    if (!list.length) {
      span.textContent = text;
      return span;
    }
    const pattern = new RegExp(`(${list.map(escape).join("|")})`, "gi");
    text.split(pattern).forEach((part, i) => {
      span.append(i % 2 ? Object.assign(document.createElement("mark"), { className: "px-0", textContent: part }) : part);
    });
    return span;
  }

  function item(entry, list) {
    const li = Object.assign(document.createElement("li"), { className: "list-group-item d-flex gap-3 py-3 position-relative" });
    if (entry.avatar) {
      li.append(Object.assign(document.createElement("img"), {
        src: `assets/images/avatars/${entry.avatar}.jpg`, width: 40, height: 40, alt: "", className: "rounded-circle flex-shrink-0",
      }));
    } else {
      const box = Object.assign(document.createElement("span"), {
        className: "d-inline-flex align-items-center justify-content-center rounded-circle flex-shrink-0 bg-primary-subtle text-primary-emphasis",
      });
      box.style.cssText = "width: 40px; height: 40px";
      box.setAttribute("aria-hidden", "true");
      const icon = document.createElement("i");
      icon.setAttribute("data-lucide", types[entry.type].icon);
      box.append(icon);
      li.append(box);
    }
    const body = Object.assign(document.createElement("div"), { className: "overflow-hidden" });
    const link = Object.assign(document.createElement("a"), { href: entry.href, className: "fw-bold text-decoration-none stretched-link" });
    link.append(highlighted(entry.title, list));
    const text = Object.assign(document.createElement("div"), { className: "small text-body-secondary text-truncate" });
    text.append(highlighted(entry.text, list));
    const meta = Object.assign(document.createElement("div"), { className: "small d-flex flex-wrap align-items-center gap-2 mt-1" });
    meta.append(Object.assign(document.createElement("span"), { className: "badge bg-secondary-subtle text-secondary-emphasis", textContent: types[entry.type].title }));
    meta.append(highlighted(entry.meta, list));
    body.append(link, text, meta);
    li.append(body);
    return li;
  }

  function search(query) {
    const list = words(query);
    found = list.length
      ? index.items
        .filter((e) => list.every((w) => `${e.title} ${e.text} ${e.meta}`.toLowerCase().includes(w)))
        // A match in the title comes first; the order of the index stays inside each part
        .sort((a, b) => Number(!list.some((w) => a.title.toLowerCase().includes(w))) - Number(!list.some((w) => b.title.toLowerCase().includes(w))))
      : [];
    root.querySelector('[data-count="all"]').textContent = found.length;
    for (const t of index.types) root.querySelector(`[data-count="${t.id}"]`).textContent = found.filter((e) => e.type === t.id).length;
    render(query, list);
  }

  function render(query, list = words(query)) {
    const shown = found.filter((e) => type === "all" || e.type === type);
    results.replaceChildren(...shown.map((e) => item(e, list)));
    empty.classList.toggle("d-none", !list.length || shown.length > 0);
    root.querySelector("[data-empty-title]").textContent = `Nothing found for “${query}”`;
    summary.textContent = !list.length
      ? "Type a word to search the workspace."
      : `${found.length} ${found.length === 1 ? "result" : "results"} for “${query.trim()}”`;
  }

  root.querySelector("[data-types]").addEventListener("click", (event) => {
    const button = event.target.closest("[data-type]");
    if (!button) return;
    type = button.dataset.type;
    root.querySelectorAll("[data-type]").forEach((b) => {
      b.classList.toggle("active", b === button);
      b.setAttribute("aria-pressed", String(b === button));
    });
    render(field.value);
  });

  // A new search keeps the page: the address takes the words, Back returns to the previous search
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = field.value.trim();
    const url = new URL(location.href);
    url.searchParams.set("q", query);
    try {
      history.pushState({ q: query }, "", url);
    } catch {
      // file:// pages may refuse to change the address; the results still change
    }
    search(query);
  });

  addEventListener("popstate", () => {
    field.value = new URLSearchParams(location.search).get("q") ?? index.sample;
    search(field.value);
  });

  // Without ?q= the page shows the results of a sample search, so the look of the results is visible at once
  field.value = new URLSearchParams(location.search).get("q") ?? index.sample;
  search(field.value);
})();

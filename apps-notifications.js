// Notifications page: filters (All, Unread, Mentions, System), read and unread, remove, mark all as read, and the
// delivery settings form. The unread count is shown on the card and on the bell in the header. Changes stay until
// the page reloads.
(() => {
  const root = document.getElementById("notifications");
  if (!root) return;

  const feed = root.querySelector("[data-feed]");
  const empty = root.querySelector("[data-empty]");
  const toastEl = document.getElementById("notificationToast");
  let filter = "all";

  const items = () => [...feed.querySelectorAll("[data-notification]")];

  function notify(text) {
    toastEl.querySelector("[data-toast-text]").textContent = text;
    window.bootstrap.Toast.getOrCreateInstance(toastEl).show();
  }

  function setRead(item, read) {
    item.dataset.unread = String(!read);
    item.querySelector("[data-text]").classList.toggle("fw-bold", !read);
    item.querySelector("[data-dot]").classList.toggle("d-none", read);
    item.querySelector('[data-action="toggle-read"]').textContent = read ? "Mark as unread" : "Mark as read";
  }

  function update() {
    const unread = items().filter((i) => i.dataset.unread === "true").length;
    const badge = root.querySelector("[data-unread-badge]");
    badge.textContent = `${unread} new`;
    badge.classList.toggle("d-none", unread === 0);
    document.querySelectorAll("[data-notification-count]").forEach((count) => {
      count.textContent = unread;
      count.classList.toggle("d-none", unread === 0);
      count.closest("a")?.setAttribute("aria-label", unread ? `Notifications, ${unread} unread` : "Notifications");
    });
    root.querySelector('[data-action="read-all"]').disabled = unread === 0;

    let shown = 0;
    items().forEach((item) => {
      const match = filter === "all" || (filter === "unread" ? item.dataset.unread === "true" : item.dataset[filter] === "true");
      item.classList.toggle("d-none", !match);
      shown += match ? 1 : 0;
    });
    feed.querySelectorAll("[data-day]").forEach((day) => {
      day.classList.toggle("d-none", !day.querySelector("[data-notification]:not(.d-none)"));
    });
    empty.classList.toggle("d-none", shown > 0);
  }

  root.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-filter]");
    if (tab) {
      filter = tab.dataset.filter;
      root.querySelectorAll("[data-filter]").forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-pressed", String(t === tab));
      });
      update();
      return;
    }
    const action = event.target.closest("[data-action]");
    if (!action) return;
    const item = action.closest("[data-notification]");
    if (action.dataset.action === "read-all") {
      items().forEach((i) => setRead(i, true));
      notify("All notifications are marked as read");
    } else if (action.dataset.action === "toggle-read" && item) {
      setRead(item, item.dataset.unread === "true");
    } else if (action.dataset.action === "remove" && item) {
      window.bootstrap.Dropdown.getInstance(item.querySelector('[data-bs-toggle="dropdown"]'))?.hide();
      item.remove();
      notify("Notification removed");
    }
    update();
  });

  document.querySelector("[data-channels]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    notify("Delivery settings saved");
  });

  update();
})();

// Inbox demo: folders, search, a conversation as a chat, a reply box. On phones the list and the conversation
// take turns (Back returns to the list). Changes stay until the page reloads.
(() => {
  const inbox = document.getElementById("inbox");
  if (!inbox) return;

  const listPane = inbox.querySelector("[data-list-pane]");
  const threadPane = inbox.querySelector("[data-thread-pane]");
  const items = [...inbox.querySelectorAll("[data-conversation]")];
  const empty = inbox.querySelector("[data-empty]");
  const search = document.getElementById("inbox-search");
  const folderSelect = document.getElementById("inbox-folder");
  const reply = inbox.querySelector("[data-reply]");
  const field = reply.querySelector("textarea");
  const status = document.getElementById("inbox-status");
  const me = threadPane.querySelector(".aui-chat-message.is-own img")?.getAttribute("src") ?? "assets/images/avatars/1.jpg";
  let folder = "inbox";
  let current = items.find((item) => item.classList.contains("active"))?.dataset.conversation;

  const threadOf = (id) => threadPane.querySelector(`[data-thread="${id}"]`);
  const itemOf = (id) => inbox.querySelector(`[data-conversation="${id}"]`);
  const scrollDown = (id) => {
    const chat = threadOf(id)?.querySelector("[data-chat]");
    if (chat) chat.scrollTop = chat.scrollHeight;
  };

  function updateUnread() {
    const count = items.filter((item) => item.dataset.folder === "inbox" && item.dataset.unread === "true").length;
    inbox.querySelectorAll("[data-unread-count]").forEach((badge) => {
      badge.textContent = count;
      badge.classList.toggle("d-none", count === 0);
    });
  }

  function filter() {
    const query = search.value.trim().toLowerCase();
    let shown = 0;
    items.forEach((item) => {
      const inFolder = folder === "starred" ? item.dataset.starred === "true" : item.dataset.folder === folder;
      const match = inFolder && (!query || item.textContent.toLowerCase().includes(query));
      item.classList.toggle("d-none", !match);
      shown += match ? 1 : 0;
    });
    empty.classList.toggle("d-none", shown > 0);
  }

  function setFolder(id) {
    folder = id;
    folderSelect.value = id;
    inbox.querySelectorAll("[data-folder-link]").forEach((link) => {
      const on = link.dataset.folderLink === id;
      link.classList.toggle("active", on);
      link.setAttribute("aria-selected", String(on));
    });
    filter();
  }

  // Phones: the list or the conversation; from md both are visible
  function showThreadPane(open) {
    listPane.classList.toggle("d-none", open);
    listPane.classList.toggle("d-md-block", open);
    threadPane.classList.toggle("d-none", !open);
    threadPane.classList.toggle("d-flex", open);
  }

  function open(id) {
    current = id;
    items.forEach((item) => {
      const on = item.dataset.conversation === id;
      item.classList.toggle("active", on);
      item.setAttribute("aria-current", String(on));
    });
    threadPane.querySelectorAll("[data-thread]").forEach((thread) => {
      thread.classList.toggle("d-none", thread.dataset.thread !== id);
      thread.classList.toggle("d-flex", thread.dataset.thread === id);
    });
    const item = itemOf(id);
    item.dataset.unread = "false";
    item.querySelector("[data-unread-dot]").classList.add("d-none");
    item.querySelector("[data-subject]").classList.remove("fw-bold");
    updateUnread();
    showThreadPane(true);
    scrollDown(id);
  }

  inbox.addEventListener("click", (event) => {
    const item = event.target.closest("[data-conversation]");
    if (item) {
      open(item.dataset.conversation);
      return;
    }
    const link = event.target.closest("[data-folder-link]");
    if (link) {
      setFolder(link.dataset.folderLink);
      return;
    }
    if (event.target.closest("[data-back]")) {
      showThreadPane(false);
      itemOf(current)?.focus();
      return;
    }
    const star = event.target.closest("[data-star]");
    if (star) {
      const on = star.getAttribute("aria-pressed") !== "true";
      star.setAttribute("aria-pressed", String(on));
      star.classList.toggle("text-warning", on);
      star.classList.toggle("text-body-secondary", !on);
      itemOf(current).dataset.starred = String(on);
      filter();
      status.textContent = on ? "Starred" : "Star removed";
      return;
    }
    if (event.target.closest("[data-archive]")) {
      const item = itemOf(current);
      item.dataset.folder = "archive";
      filter();
      updateUnread();
      showThreadPane(false);
      status.textContent = "Moved to Archive";
    }
  });

  // A reply goes to the end of the open conversation
  reply.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = field.value.trim();
    if (!text || !current) return;
    const message = document.createElement("div");
    message.className = "aui-chat-message is-own";
    const avatar = Object.assign(document.createElement("img"), { src: me, width: 32, height: 32, alt: "" });
    const body = document.createElement("div");
    const bubble = Object.assign(document.createElement("div"), { className: "aui-chat-bubble", textContent: text });
    const time = Object.assign(document.createElement("div"), {
      className: "small text-body-secondary mt-1",
      textContent: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" }),
    });
    body.append(bubble, time);
    message.append(avatar, body);
    threadOf(current).querySelector("[data-chat]").append(message);
    scrollDown(current);
    reply.reset();
    field.focus();
    status.textContent = "Reply sent";
  });

  field.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      reply.requestSubmit();
    }
  });

  search.addEventListener("input", filter);
  folderSelect.addEventListener("change", () => setFolder(folderSelect.value));

  // Phones start on the list; wider screens show the first conversation next to it
  if (matchMedia("(max-width: 767.98px)").matches) showThreadPane(false);
  filter();
  updateUnread();
  if (current) scrollDown(current);
})();

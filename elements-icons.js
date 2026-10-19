// Icon catalogs: filter by name, copy the markup on click.
// Lucide is built into the page. Bootstrap Icons load from the CDN the first time their tab opens:
// the stylesheet and the icon list (name → code point) come from the URLs on the tab pane.
(() => {
  const toast = document.getElementById("iconCopied");
  const toastText = document.getElementById("iconCopiedText");

  // Search and copy for one grid of [data-icon] tiles
  function catalog({ grid, search, count, markup }) {
    const tiles = () => [...grid.querySelectorAll("[data-icon]")];

    search.addEventListener("input", () => {
      const query = search.value.trim().toLowerCase();
      let visible = 0;
      tiles().forEach((tile) => {
        const match = !query || tile.dataset.icon.includes(query);
        tile.classList.toggle("d-none", !match);
        visible += match ? 1 : 0;
      });
      count.textContent = visible;
    });

    grid.addEventListener("click", async (event) => {
      const tile = event.target.closest("[data-icon]");
      if (!tile) {
        return;
      }
      const text = markup(tile.dataset.icon);
      try {
        await navigator.clipboard.writeText(text);
        toastText.textContent = `Copied: ${text}`;
      } catch {
        toastText.textContent = text;
      }
      window.bootstrap.Toast.getOrCreateInstance(toast).show();
    });
  }

  catalog({
    grid: document.getElementById("iconGrid"),
    search: document.getElementById("iconSearch"),
    count: document.getElementById("iconCount"),
    markup: (name) => `<i data-lucide="${name}"></i>`,
  });

  // Bootstrap Icons
  const pane = document.getElementById("tab-content-1");
  const tab = document.querySelector('[href="#tab-content-1"]');
  const grid = document.getElementById("biGrid");
  const search = document.getElementById("biSearch");
  const count = document.getElementById("biCount");
  const status = document.getElementById("biStatus");
  let loading = null;

  catalog({ grid, search, count, markup: (name) => `<i class="bi bi-${name}"></i>` });

  const stylesheet = (href) => new Promise((resolve, reject) => {
    const link = Object.assign(document.createElement("link"), { rel: "stylesheet", href, crossOrigin: "anonymous" });
    link.addEventListener("load", resolve, { once: true });
    link.addEventListener("error", () => reject(new Error(`Stylesheet ${href}`)), { once: true });
    document.head.append(link);
  });

  async function loadBootstrapIcons() {
    const [names] = await Promise.all([
      fetch(pane.dataset.iconsList).then((response) => {
        if (!response.ok) throw new Error(`Icon list ${response.status}`);
        return response.json();
      }).then((list) => Object.keys(list).sort()),
      stylesheet(pane.dataset.iconsCss),
    ]);
    const tiles = names.map((name) => {
      const tile = Object.assign(document.createElement("button"), {
        type: "button",
        className: "btn btn-sm border rounded d-flex flex-column align-items-center gap-2 py-3 px-2",
      });
      tile.dataset.icon = name;
      const icon = Object.assign(document.createElement("i"), { className: `bi bi-${name} fs-4` });
      icon.setAttribute("aria-hidden", "true");
      const label = Object.assign(document.createElement("span"), { className: "small text-break lh-sm", textContent: name });
      tile.append(icon, label);
      return tile;
    });
    grid.replaceChildren(...tiles);
    count.textContent = names.length;
    search.disabled = false;
    status.remove();
  }

  tab?.addEventListener("shown.bs.tab", () => {
    loading ??= loadBootstrapIcons().catch(() => {
      loading = null;
      status.replaceChildren(Object.assign(document.createElement("span"), {
        className: "text-danger",
        textContent: "Bootstrap Icons could not be loaded from the CDN. Check the connection and open the tab again.",
      }));
    });
  });
})();

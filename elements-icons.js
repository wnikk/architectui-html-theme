// Icon catalog: filter by name, copy the markup on click
(() => {
  const grid = document.getElementById("iconGrid");
  const search = document.getElementById("iconSearch");
  const count = document.getElementById("iconCount");
  const tiles = [...grid.querySelectorAll("[data-icon]")];

  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    tiles.forEach((tile) => {
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
    const markup = `<i data-lucide="${tile.dataset.icon}"></i>`;
    try {
      await navigator.clipboard.writeText(markup);
      document.getElementById("iconCopiedText").textContent = `Copied: ${markup}`;
    } catch {
      document.getElementById("iconCopiedText").textContent = markup;
    }
    window.bootstrap.Toast.getOrCreateInstance(document.getElementById("iconCopied")).show();
  });
})();

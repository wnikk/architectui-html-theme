// Pricing page: the billing period switch shows monthly or yearly prices and billing notes (data-monthly / data-yearly).
(() => {
  const root = document.getElementById("pricing");
  if (!root) return;

  function show(period) {
    document.querySelectorAll("[data-price], [data-billed]").forEach((el) => {
      el.textContent = el.dataset[period];
    });
  }

  root.addEventListener("change", (event) => {
    if (event.target.name === "billing") show(event.target.value);
  });
  show(root.querySelector('[name="billing"]:checked').value);
})();

// My Profile demo: the form stays on the page and a toast confirms the save. A real project sends the form with fetch.
(() => {
  const form = document.getElementById("profile-form");
  const toast = document.getElementById("profile-saved");

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (toast) window.bootstrap?.Toast.getOrCreateInstance(toast).show();
  });
})();

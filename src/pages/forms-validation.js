// Bootstrap 6 form validation: a form with data-bs-validate shows the :user-invalid styles after the first
// interaction by itself. This script only keeps an invalid demo form from being sent.
(() => {
  document.querySelectorAll("form[data-bs-validate]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  });
})();

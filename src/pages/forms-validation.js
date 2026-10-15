// Страница валидации: стандартная проверка форм Bootstrap 5
document.querySelectorAll("form.needs-validation").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add("was-validated");
  });
});

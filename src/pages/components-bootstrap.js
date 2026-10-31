// Bootstrap Components page: the few things the data API does not do by itself.
// Indeterminate check: the state is a property, not an attribute. Spy nav: Bootstrap ScrollSpy comes from data-bs-spy.
(() => {
  document.querySelectorAll("[data-bs-indeterminate]").forEach((input) => {
    input.indeterminate = true;
  });
})();

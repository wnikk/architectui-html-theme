// Wizard demo: one form, one section per step. Next checks the current section with Bootstrap validation
// (.was-validated on the section), the stepper follows the steps, the last step shows a review of all answers.
// A real project sends the form with fetch on the last step.
(() => {
  const form = document.getElementById("wizard");
  if (!form) return;

  const steps = [...form.querySelectorAll("[data-wizard-step]")];
  const done = form.querySelector("[data-wizard-done]");
  const stepper = [...document.querySelectorAll("#wizard-stepper > li")];
  const nav = form.querySelector("[data-wizard-nav]");
  const back = form.querySelector("[data-wizard-back]");
  const skip = form.querySelector("[data-wizard-skip]");
  const nextLabel = form.querySelector("[data-wizard-next-label]");
  const counter = form.querySelector("[data-wizard-counter]");
  const invites = form.elements.invites;
  const TEAM_STEP = 2;
  let current = 0;

  const emails = () => invites.value.split(/[\s,;]+/).map((value) => value.trim()).filter(Boolean);

  // The invitation list is optional, but every address in it must look like an email address
  function checkInvites() {
    const wrong = emails().some((value) => !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value));
    invites.setCustomValidity(wrong ? "invalid" : "");
  }

  // Plays the step animation again (aui-animate-fade-in, off with reduced motion)
  function enter(section) {
    section.classList.remove("aui-animate-fade-in");
    void section.offsetWidth;
    section.classList.add("aui-animate-fade-in");
  }

  function review() {
    const data = new FormData(form);
    const people = emails().length;
    const values = {
      name: data.get("name"),
      url: `app.example.test/${data.get("url")}`,
      region: data.get("region"),
      size: data.get("size"),
      plan: data.get("plan"),
      period: data.get("period"),
      invites: people ? `${people} ${people === 1 ? "person" : "people"}` : "Nobody yet",
      role: people ? data.get("role") : "—",
    };
    form.querySelectorAll("[data-review]").forEach((field) => {
      field.textContent = values[field.dataset.review] || "—";
    });
  }

  function show(index, focus = true) {
    current = index;
    steps.forEach((step, i) => {
      step.hidden = i !== index;
    });
    stepper.forEach((item, i) => {
      item.classList.toggle("active", i === index);
      item.classList.toggle("done", i < index);
      if (i === index) item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    // d-none, not the hidden attribute: d-inline-flex on the button would win over [hidden]
    back.classList.toggle("d-none", index === 0);
    skip.classList.toggle("d-none", index !== TEAM_STEP);
    nextLabel.textContent = index === steps.length - 1 ? "Create workspace" : "Next";
    counter.textContent = `Step ${index + 1} of ${steps.length}`;
    if (index === steps.length - 1) review();
    if (focus) {
      enter(steps[index]);
      steps[index].querySelector("h5")?.focus({ preventScroll: true });
    }
  }

  function finish() {
    review();
    steps.forEach((step) => {
      step.hidden = true;
    });
    stepper.forEach((item) => {
      item.classList.remove("active");
      item.classList.add("done");
      item.removeAttribute("aria-current");
    });
    nav.classList.add("d-none");
    done.hidden = false;
    enter(done);
    done.querySelector("h5")?.focus({ preventScroll: true });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const step = steps[current];
    if (current === TEAM_STEP) checkInvites();
    const fields = [...step.querySelectorAll("input, select, textarea")];
    if (!fields.every((field) => field.checkValidity())) {
      step.classList.add("was-validated");
      fields.find((field) => !field.validity.valid)?.focus();
      return;
    }
    if (current < steps.length - 1) show(current + 1);
    else finish();
  });

  invites.addEventListener("input", checkInvites);

  back.addEventListener("click", () => show(current - 1));

  skip.addEventListener("click", () => {
    invites.value = "";
    checkInvites();
    show(current + 1);
  });

  form.querySelector("[data-wizard-restart]").addEventListener("click", () => {
    form.reset();
    steps.forEach((step) => step.classList.remove("was-validated"));
    done.hidden = true;
    nav.classList.remove("d-none");
    show(0);
  });

  show(0, false);
})();

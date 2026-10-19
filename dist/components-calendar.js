// FullCalendar 7 demo: the global bundle and the Bootstrap 5 theme plugin, which registers itself.
// Events are placed in the current month; their colors come from the ArchitectUI theme tokens.
(() => {
  const element = document.getElementById("calendar");

  if (element && window.FullCalendar) {
    const today = new Date();
    const day = (offset, time = "") => {
      const date = new Date(today.getFullYear(), today.getMonth(), offset);
      const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return time ? `${iso}T${time}` : iso;
    };
    const current = today.getDate();
    const { token } = window.ArchitectUI;
    // An event with "tone" takes that theme color and the text color the theme uses on it.
    // Other events use the primary color of the Bootstrap theme plugin.
    const paint = (event) => {
      const tone = event.tone ?? event.extendedProps?.tone;
      return tone ? { color: token(`--bs-${tone}`), contrastColor: token(`--aui-${tone}-contrast`) } : {};
    };

    const calendar = new window.FullCalendar.Calendar(element, {
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
      },
      navLinks: true,
      editable: true,
      dayMaxEvents: true,
      events: [
        { title: "All Day Event", start: day(1) },
        { title: "Long Event", start: day(7), end: day(10), tone: "success" },
        { groupId: "repeat", title: "Repeating Event", start: day(9, "16:00:00") },
        { groupId: "repeat", title: "Repeating Event", start: day(16, "16:00:00") },
        { title: "Conference", start: day(current - 1), end: day(current + 1), tone: "info" },
        { title: "Meeting", start: day(current, "10:30:00"), end: day(current, "12:30:00"), tone: "focus" },
        { title: "Lunch", start: day(current, "12:00:00") },
        { title: "Meeting", start: day(current, "14:30:00"), tone: "focus" },
        { title: "Happy Hour", start: day(current, "17:30:00"), tone: "warning" },
        { title: "Dinner", start: day(current, "20:00:00") },
        { title: "Birthday Party", start: day(current + 1, "07:00:00"), tone: "danger" },
        { title: "Click for Bootstrap", url: "https://getbootstrap.com/", start: day(28), tone: "alternate" },
      ].map((event) => ({ ...event, ...paint(event) })),
    });

    calendar.render();

    // A theme or mode change repaints the toned events in the new colors
    document.addEventListener("aui:theme-change", () => {
      calendar.getEvents().forEach((event) => {
        Object.entries(paint(event)).forEach(([prop, value]) => event.setProp(prop, value));
      });
    });
  }
})();

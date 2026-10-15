// Страница календаря: глобальный пакет FullCalendar 6 с CDN (подключён в <head> через front matter).
// События строятся от текущего месяца.
const element = document.getElementById("calendar");

if (element && window.FullCalendar) {
  const today = new Date();
  const day = (offset, time = "") => {
    const date = new Date(today.getFullYear(), today.getMonth(), offset);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return time ? `${iso}T${time}` : iso;
  };
  const current = today.getDate();
  const color = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--bs-${name}`).trim();

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
      { title: "Long Event", start: day(7), end: day(10), color: color("success") },
      { groupId: "repeat", title: "Repeating Event", start: day(9, "16:00:00") },
      { groupId: "repeat", title: "Repeating Event", start: day(16, "16:00:00") },
      { title: "Conference", start: day(current - 1), end: day(current + 1), color: color("info") },
      { title: "Meeting", start: day(current, "10:30:00"), end: day(current, "12:30:00"), color: color("focus") },
      { title: "Lunch", start: day(current, "12:00:00") },
      { title: "Meeting", start: day(current, "14:30:00"), color: color("focus") },
      { title: "Happy Hour", start: day(current, "17:30:00"), color: color("warning") },
      { title: "Dinner", start: day(current, "20:00:00") },
      { title: "Birthday Party", start: day(current + 1, "07:00:00"), color: color("danger") },
      { title: "Click for Bootstrap", url: "https://getbootstrap.com/", start: day(28), color: color("alternate") },
    ],
  });

  calendar.render();
}

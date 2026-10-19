// Demo board for the Kanban page: the spring release of an online store. Fixed values, the same on every build.
// Card: title, labels ([text, Bootstrap color]), avatars (assets/images/avatars/<n>.jpg), due date, checklist, counters.

const columns = [
  { id: "backlog", title: "Backlog", color: "secondary" },
  { id: "todo", title: "To do", color: "info" },
  { id: "progress", title: "In progress", color: "primary", limit: 3 },
  { id: "review", title: "Review", color: "warning", limit: 3 },
  { id: "done", title: "Done", color: "success" },
];

const cards = [
  ["backlog", "Saved carts for signed-in customers", [["Checkout", "primary"]], [5], "Nov 14", null, 0, 1],
  ["backlog", "Import supplier price lists from CSV", [["Catalog", "info"], ["Ops", "secondary"]], [9], null, [0, 4], 2, 0],
  ["backlog", "Gift cards: balance page", [["Checkout", "primary"]], [], null, null, 0, 0],
  ["backlog", "Research: same-day delivery partners", [["Research", "secondary"]], [2, 11], "Nov 21", null, 5, 2],
  ["todo", "Apple Pay button on the checkout page", [["Checkout", "primary"], ["Mobile", "warning"]], [1, 8], "Oct 28", [1, 5], 3, 1],
  ["todo", "Order emails in the new layout", [["Email", "success"]], [10], "Oct 30", [0, 3], 1, 2],
  ["todo", "Fix VAT rounding on invoices", [["Bug", "danger"], ["Billing", "info"]], [4], "Oct 24", null, 6, 0],
  ["progress", "Search: synonyms editor", [["Search", "info"]], [3, 12], "Oct 26", [3, 6], 8, 1],
  ["progress", "Accessibility review of the checkout", [["Checkout", "primary"], ["A11y", "success"]], [5], "Oct 27", [5, 9], 4, 3],
  ["progress", "Move product images to the CDN", [["Ops", "secondary"]], [2], "Oct 23", [7, 8], 2, 0],
  ["review", "Dark mode for the admin panel", [["Admin", "warning"]], [8, 1], "Oct 22", [6, 6], 11, 4],
  ["review", "Refund flow for partial orders", [["Billing", "info"], ["Bug", "danger"]], [11], "Oct 21", [4, 4], 7, 1],
  ["done", "Order tracking page", [["Checkout", "primary"]], [10, 3], null, [5, 5], 9, 2],
  ["done", "Faster category pages (cache)", [["Catalog", "info"]], [9], null, null, 3, 0],
  ["done", "Release notes for October", [["Docs", "secondary"]], [4], null, null, 1, 1],
].map(([column, title, labels, avatars, due, checklist, comments, files], i) => ({
  id: `card-${i + 1}`,
  column,
  title,
  labels,
  avatars,
  due,
  // The demo date is Oct 25: earlier dates are overdue
  overdue: Boolean(due) && column !== "done" && Number(due.split(" ")[1]) < 25 && due.startsWith("Oct"),
  checklist,
  comments,
  files,
}));

export default {
  columns: columns.map((column) => ({ ...column, cards: cards.filter((card) => card.column === column.id) })),
  labels: [...new Map(cards.flatMap((card) => card.labels).map(([text, color]) => [text, color])).entries()]
    .map(([text, color]) => ({ text, color }))
    .sort((a, b) => a.text.localeCompare(b.text)),
};

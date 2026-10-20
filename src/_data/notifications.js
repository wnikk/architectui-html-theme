// Demo notifications for the Notifications page and the bell in the header: what happened in the store workspace.
// Fixed values, the same on every build. kind: mention, comment, task, order, system, security, billing.

const kinds = {
  mention: { icon: "at-sign", color: "primary", label: "Mentions" },
  comment: { icon: "message-square", color: "info", label: "Comments" },
  task: { icon: "square-kanban", color: "success", label: "Tasks" },
  order: { icon: "shopping-cart", color: "warning", label: "Orders" },
  system: { icon: "server", color: "secondary", label: "System" },
  security: { icon: "shield-alert", color: "danger", label: "Security" },
  billing: { icon: "credit-card", color: "secondary", label: "Billing" },
};

// day, kind, unread, avatar (0 = icon of the kind), actor, text, details, time
const list = [
  ["Today", "mention", true, 11, "Maria Chen", "mentioned you in Order ORD-1048", "“@Alina can we send the lamp by express? The customer needs it before Friday.”", "10:42"],
  ["Today", "security", true, 0, "", "New sign-in from Chrome on macOS", "Lisbon, Portugal · 185.42.17.8. If it was not you, change the password.", "09:58"],
  ["Today", "task", true, 3, "Ruben Tillman", "moved “Apple Pay in the checkout” to Review", "Spring release board · 1 of 5 checks done", "09:31"],
  ["Today", "order", true, 0, "", "Refund requested for ORD-1043", "$56.40 · Lucas Meyer · reason: an item is missing", "08:15"],
  ["Today", "comment", false, 2, "Ella-Rose Henry", "commented on “Fix VAT rounding in invoices”", "“The rounding now follows the UK rules; please check INV-2291.”", "07:50"],
  ["Yesterday", "mention", false, 4, "Vinnie Wagstaff", "mentioned you in the Weekly report", "“@Alina the conversion rate is up 0.4 points after the new checkout.”", "17:20"],
  ["Yesterday", "system", false, 0, "", "Scheduled maintenance tonight, 02:00–03:00 UTC", "The search index is rebuilt; the store stays open.", "15:05"],
  ["Yesterday", "billing", false, 0, "", "Invoice INV-2291 is paid", "Bright Labs Ltd · $3,453.52", "12:40"],
  ["Yesterday", "task", false, 9, "Amara Okafor", "assigned you “Gift cards: balance page”", "Due Nov 14 · Checkout", "11:02"],
  ["Earlier this week", "comment", false, 5, "Sofia Rossi", "replied in the Inbox", "“Great service, thank you.” · Return of a damaged chair", "Oct 18"],
  ["Earlier this week", "security", false, 0, "", "Two-step sign-in is on for 18 of 26 users", "Ask the other 8 to turn it on in their profile.", "Oct 17"],
  ["Earlier this week", "system", false, 0, "", "Export of October orders is ready", "orders-2026-10.csv · 1.2 MB", "Oct 16"],
  ["Earlier this week", "order", false, 0, "", "Order ORD-1046 changed its delivery address", "Amara Okafor · 21 Harbor Street, floor 3", "Oct 15"],
];

const items = list.map(([day, kind, unread, avatar, actor, text, details, time], i) => ({
  id: `n${i + 1}`, day, kind, unread, avatar, actor, text, details, time, ...kinds[kind],
  mention: kind === "mention",
  system: ["system", "security", "billing"].includes(kind),
}));

// Channels per kind: email and browser on or off
const channels = [
  ["mention", true, true],
  ["comment", false, true],
  ["task", true, true],
  ["order", true, false],
  ["security", true, true],
  ["billing", true, false],
  ["system", false, false],
].map(([kind, email, browser]) => ({ kind, email, browser, ...kinds[kind] }));

export default {
  items,
  days: [...new Set(items.map((n) => n.day))],
  unread: items.filter((n) => n.unread).length,
  channels,
};

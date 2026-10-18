// Demo data for the Operations Wall page: an online store platform. Fixed values, the same on every build.
// The chart series are drawn by dashboard-operations.js; the keys here link a tile or a card to its series.

// Regions: id, name, status color and label, traffic share, p95 latency, error rate, chart color
const regions = [
  { id: "eu-west", name: "EU West", status: ["danger", "Incident"], share: 38, latency: "164 ms", errors: "0.61%", color: "primary" },
  { id: "us-east", name: "US East", status: ["warning", "Degraded"], share: 31, latency: "212 ms", errors: "0.48%", color: "info" },
  { id: "us-west", name: "US West", status: ["success", "Healthy"], share: 19, latency: "131 ms", errors: "0.22%", color: "success" },
  { id: "apac", name: "Asia Pacific", status: ["success", "Healthy"], share: 12, latency: "198 ms", errors: "0.19%", color: "warning" },
];

// Key figures: label, value, change, change color, trend color, trend direction
const kpis = [
  { key: "requests", label: "Requests / min", value: "48.2k", delta: "+6.4%", tone: "success", color: "primary", up: true },
  { key: "errors", label: "Error rate", value: "0.42%", delta: "−0.08 pp", tone: "success", color: "danger", up: false },
  { key: "latency", label: "p95 latency", value: "182 ms", delta: "+12 ms", tone: "warning", color: "warning", up: true },
  { key: "sessions", label: "Active sessions", value: "12,840", delta: "+3.1%", tone: "success", color: "info", up: true },
  { key: "orders", label: "Orders / hour", value: "1,326", delta: "+8.9%", tone: "success", color: "success", up: true },
  { key: "revenue", label: "Revenue today", value: "$184,320", delta: "+5.2%", tone: "success", color: "success", up: true },
  { key: "queue", label: "Queue depth", value: "214", delta: "+38", tone: "danger", color: "danger", up: true },
  { key: "cpu", label: "Average CPU", value: "61%", delta: "−4%", tone: "success", color: "secondary", up: false },
];

// Services: status color and label, uptime, p95 latency, requests per minute series key
const services = [
  { key: "checkout", name: "Checkout API", icon: "shopping-cart", status: ["success", "Operational"], uptime: "99.99%", latency: "142 ms", rpm: "8.4k" },
  { key: "search", name: "Search", icon: "search", status: ["success", "Operational"], uptime: "99.97%", latency: "96 ms", rpm: "14.1k" },
  { key: "payments", name: "Payments", icon: "credit-card", status: ["warning", "Degraded"], uptime: "99.82%", latency: "418 ms", rpm: "3.2k" },
  { key: "catalog", name: "Catalog", icon: "package", status: ["success", "Operational"], uptime: "99.99%", latency: "71 ms", rpm: "11.6k" },
  { key: "auth", name: "Accounts", icon: "user-round", status: ["success", "Operational"], uptime: "100%", latency: "54 ms", rpm: "6.9k" },
  { key: "notify", name: "Notifications", icon: "bell", status: ["danger", "Outage"], uptime: "98.71%", latency: "—", rpm: "0.4k" },
];

// Infrastructure load: label, percent, Bootstrap color
const capacity = [
  ["CPU", 61, "primary"],
  ["Memory", 74, "info"],
  ["Disk", 48, "success"],
  ["Network", 37, "secondary"],
  ["DB connections", 82, "warning"],
  ["Queue workers", 93, "danger"],
];

// Event log: newest first
const severities = {
  critical: ["danger", "Critical"],
  warning: ["warning", "Warning"],
  info: ["info", "Info"],
  resolved: ["success", "Resolved"],
};
const events = [
  ["14:31:08", "critical", "Notifications", "eu-west", "Mail provider rejects connections: 0 of 4 workers healthy", "On call: D. Novak"],
  ["14:29:42", "warning", "Payments", "us-east", "p95 latency 418 ms is over the 300 ms target", "H. Sato"],
  ["14:27:15", "warning", "Queue", "eu-west", "Order queue depth 214 messages, growing for 9 min", "Auto-scaling"],
  ["14:24:51", "info", "Checkout API", "us-west", "Deploy 2026.10.18-3 finished on 12 of 12 nodes", "CI"],
  ["14:22:03", "resolved", "Search", "apac", "Index lag is back under 5 s", "A. Okafor"],
  ["14:18:37", "warning", "Database", "us-east", "Connection pool at 82% of the limit", "Auto-scaling"],
  ["14:15:10", "info", "Catalog", "eu-west", "Price import: 18,204 items updated", "Scheduler"],
  ["14:11:46", "critical", "Payments", "us-east", "Card processor timeouts: 2.1% of requests", "On call: H. Sato"],
  ["14:08:29", "resolved", "Accounts", "us-west", "Login error rate back to normal", "L. Meyer"],
  ["14:05:02", "info", "CDN", "apac", "Cache hit ratio 96.4%", "Monitor"],
  ["14:01:55", "warning", "Checkout API", "us-west", "Error rate 1.2% on node co-07, node drained", "Auto-heal"],
  ["13:58:20", "info", "Search", "eu-west", "Synonyms dictionary reloaded", "M. Chen"],
].map(([time, severity, service, region, message, owner]) => ({
  time,
  color: severities[severity][0],
  severity: severities[severity][1],
  service,
  region,
  regionName: regions.find((item) => item.id === region).name,
  message,
  owner,
}));

// Activity feed: avatar number from assets/images/avatars, who, what, when
const activity = [
  [4, "Daniel Novak", "acknowledged the Notifications outage", "2 min ago", "eu-west"],
  [9, "Hana Sato", "opened incident INC-2291 for Payments", "4 min ago", "us-east"],
  [0, "Auto-scaling", "added 3 queue workers in EU West", "6 min ago", "eu-west"],
  [8, "Lucas Meyer", "approved deploy 2026.10.18-3", "11 min ago", "us-west"],
  [5, "Amara Okafor", "closed alert “Search index lag”", "13 min ago", "apac"],
  [1, "Maria Chen", "changed the error budget for Checkout to 0.1%", "21 min ago", "eu-west"],
  [10, "Omar Haddad", "restarted pods payments-api-4 and -5", "26 min ago", "us-east"],
  [2, "James Patel", "muted CDN alerts for Asia Pacific until 16:00", "34 min ago", "apac"],
  [11, "Elena Petrova", "added a runbook to the Queue depth alert", "41 min ago", "eu-west"],
  [12, "Noah Williams", "rotated the API keys of the mail provider", "52 min ago", "eu-west"],
].map(([avatar, name, text, time, region]) => ({ avatar, name, text, time, region }));

export default { regions, kpis, services, capacity, events, activity };

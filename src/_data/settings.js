// Demo data of the Settings page: the workspace of the store. Fixed values, the same on every build.
// API keys are demo strings (prefix aui_demo_), not real credentials.

export default {
  workspace: { name: "Northwind Home", slug: "northwind", owner: "alina.mclourd@northwind.test" },
  sections: [
    { id: "general", title: "General", icon: "sliders-horizontal", note: "Name, address and regional formats" },
    { id: "security", title: "Security", icon: "lock", note: "Password, two-step sign-in, sessions" },
    { id: "billing", title: "Billing", icon: "credit-card", note: "Plan, payment method, invoices" },
    { id: "integrations", title: "Integrations", icon: "plug", note: "Connected services" },
    { id: "api", title: "API keys", icon: "key-round", note: "Keys for scripts and services" },
    { id: "privacy", title: "Privacy & data", icon: "shield", note: "Export the data, delete the account", danger: true },
  ],
  sessions: [
    { device: "laptop", browser: "Chrome on macOS", place: "London, United Kingdom", time: "Active now", current: true },
    { device: "smartphone", browser: "Safari on iPhone", place: "London, United Kingdom", time: "2 hours ago" },
    { device: "laptop", browser: "Firefox on Windows", place: "Manchester, United Kingdom", time: "Oct 17" },
    { device: "tablet", browser: "Chrome on Android", place: "Lisbon, Portugal", time: "Oct 12" },
  ],
  invoices: [
    { id: "INV-2301", date: "Oct 1, 2026", amount: "$754.00", status: "Paid" },
    { id: "INV-2244", date: "Sep 1, 2026", amount: "$725.00", status: "Paid" },
    { id: "INV-2187", date: "Aug 1, 2026", amount: "$725.00", status: "Paid" },
    { id: "INV-2130", date: "Jul 1, 2026", amount: "$696.00", status: "Paid" },
  ],
  integrations: [
    { id: "chat", title: "Team chat", icon: "message-square", note: "Post alerts and daily reports to a channel.", connected: true },
    { id: "analytics", title: "Web analytics", icon: "chart-line", note: "Import visits and conversions every hour.", connected: true },
    { id: "payments", title: "Payments", icon: "credit-card", note: "Sync orders, refunds and payouts.", connected: true },
    { id: "email", title: "Email marketing", icon: "mail", note: "Send customer segments to campaigns.", connected: false },
    { id: "automation", title: "Automation", icon: "zap", note: "Start workflows on new orders and tickets.", connected: false },
    { id: "storage", title: "Cloud storage", icon: "cloud", note: "Save exports and invoices to a folder.", connected: false },
    { id: "webhooks", title: "Webhooks", icon: "webhook", note: "Call your endpoint on events.", connected: false },
  ],
  keys: [
    { id: "k1", name: "Reporting script", key: "aui_demo_7d1c…4f2a", scope: "Read", created: "Jun 3, 2026", used: "Today, 08:00" },
    { id: "k2", name: "Warehouse sync", key: "aui_demo_b92e…19c0", scope: "Read and write", created: "Mar 14, 2026", used: "Yesterday" },
    { id: "k3", name: "Old dashboard", key: "aui_demo_04aa…e7d3", scope: "Read", created: "Nov 2, 2025", used: "Aug 30, 2026" },
  ],
};

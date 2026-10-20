// Search index of the Search Results page: the pages of the menu and the demo data of other pages (users, orders,
// conversations). Built from the same data files, so a result always opens a page that shows it.

import { readFileSync } from "node:fs";
import users from "./users.js";
import orders from "./orders.js";
import inbox from "./inbox.js";

const menu = JSON.parse(readFileSync(new URL("./menu.json", import.meta.url), "utf8"));

const types = [
  { id: "page", title: "Pages", icon: "file-text" },
  { id: "user", title: "Users", icon: "users" },
  { id: "order", title: "Orders", icon: "shopping-cart" },
  { id: "conversation", title: "Conversations", icon: "inbox" },
];

const pages = menu.flatMap((group) => group.items.flatMap((item) => (item.children
  ? item.children.map((child) => ({ title: child.title, href: child.href, path: `${group.heading} › ${item.title}` }))
  : [{ title: item.title, href: item.href, path: group.heading }])))
  .map((p) => ({ type: "page", title: p.title, text: p.path, meta: p.href, href: p.href }));

const people = users.users.map((u) => ({
  type: "user", title: u.name, text: u.email, meta: `${u.roleTitle} · ${u.team} · ${u.statusTitle}`, href: "apps-users.html",
  avatar: u.avatar || null,
}));

const sales = orders.map((o) => ({
  type: "order", title: o.id, text: `${o.name} · ${o.amount}`, meta: `${o.status} · ${o.date}`, href: "tables-regular.html",
}));

const talks = inbox.conversations.map((c) => ({
  type: "conversation", title: c.subject, text: `${c.name} · ${c.preview}`, meta: `${c.time} · ${c.folder}`, href: "apps-inbox.html",
  avatar: c.avatar || null,
}));

export default {
  types,
  items: [...pages, ...people, ...sales, ...talks],
  suggestions: ["Maria", "ORD-1048", "invoice", "refund", "Admin", "Kanban"],
  // Shown when the page opens without ?q=: it finds a user, orders and a conversation
  sample: "Maria",
};

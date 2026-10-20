// Demo users for the Users page: the team of the store (people from the Kanban and Inbox pages among them).
// Fixed values, the same on every build. A user without a photo shows the initials.

const roles = [
  { id: "owner", title: "Owner", color: "primary" },
  { id: "admin", title: "Admin", color: "info" },
  { id: "editor", title: "Editor", color: "success" },
  { id: "viewer", title: "Viewer", color: "secondary" },
];

const statuses = [
  { id: "active", title: "Active", color: "success" },
  { id: "invited", title: "Invited", color: "warning" },
  { id: "suspended", title: "Suspended", color: "danger" },
];

const teams = ["Management", "Sales", "Support", "Finance", "Product", "Engineering", "Marketing"];

// name, email, avatar (0 = initials), role, team, status, two-step sign-in, last active
const list = [
  ["Alina Mclourd", "alina.mclourd@northwind.test", 1, "owner", "Management", "active", true, "Online now"],
  ["Noah Williams", "noah.williams@northwind.test", 12, "admin", "Engineering", "active", true, "5 min ago"],
  ["Elena Petrova", "elena.petrova@northwind.test", 0, "editor", "Product", "active", true, "1 hour ago"],
  ["Jonas Berg", "jonas.berg@northwind.test", 0, "editor", "Engineering", "active", false, "2 hours ago"],
  ["Maria Chen", "maria.chen@northwind.test", 11, "admin", "Support", "active", true, "Today, 09:12"],
  ["James Patel", "james.patel@northwind.test", 2, "viewer", "Finance", "invited", false, "Never"],
  ["Sofia Rossi", "sofia.rossi@northwind.test", 3, "editor", "Marketing", "active", true, "Yesterday"],
  ["Daniel Novak", "daniel.novak@northwind.test", 4, "editor", "Sales", "active", false, "Yesterday"],
  ["Amara Okafor", "amara.okafor@northwind.test", 5, "viewer", "Sales", "active", true, "Oct 18"],
  ["Lucas Meyer", "lucas.meyer@northwind.test", 8, "admin", "Finance", "active", true, "Oct 18"],
  ["Hana Sato", "hana.sato@northwind.test", 9, "editor", "Marketing", "suspended", false, "Sep 30"],
  ["Omar Haddad", "omar.haddad@northwind.test", 10, "viewer", "Support", "active", false, "Oct 17"],
  ["Priya Nair", "priya.nair@northwind.test", 0, "editor", "Product", "active", true, "Oct 17"],
  ["Tom Becker", "tom.becker@northwind.test", 0, "viewer", "Engineering", "invited", false, "Never"],
  ["Lea Moreau", "lea.moreau@northwind.test", 0, "editor", "Support", "active", true, "Oct 16"],
  ["Kenji Watanabe", "kenji.watanabe@northwind.test", 0, "admin", "Engineering", "active", true, "Oct 16"],
  ["Grace Kim", "grace.kim@northwind.test", 0, "viewer", "Marketing", "active", false, "Oct 15"],
  ["Mateo Silva", "mateo.silva@northwind.test", 0, "editor", "Sales", "suspended", false, "Aug 22"],
  ["Nora Lindqvist", "nora.lindqvist@northwind.test", 0, "viewer", "Finance", "active", true, "Oct 14"],
  ["Ahmed Karim", "ahmed.karim@northwind.test", 0, "editor", "Engineering", "active", true, "Oct 14"],
  ["Chloe Martin", "chloe.martin@northwind.test", 0, "viewer", "Support", "invited", false, "Never"],
  ["Ivan Petrov", "ivan.petrov@northwind.test", 0, "editor", "Product", "active", false, "Oct 12"],
  ["Zara Ahmed", "zara.ahmed@northwind.test", 0, "owner", "Management", "active", true, "Oct 12"],
  ["Felix Wagner", "felix.wagner@northwind.test", 0, "viewer", "Sales", "active", false, "Oct 10"],
  ["Mia Johansson", "mia.johansson@northwind.test", 0, "editor", "Marketing", "active", true, "Oct 9"],
  ["Leo Rossi", "leo.rossi@northwind.test", 0, "viewer", "Engineering", "suspended", false, "Jul 3"],
];

const users = list.map(([name, email, avatar, role, team, status, twoStep, lastActive], i) => ({
  id: `u${i + 1}`, name, email, avatar, role, team, status, twoStep, lastActive,
}));

// Title and color of the role and the status for the templates
const withLabels = (u) => {
  const r = roles.find((x) => x.id === u.role) ?? {};
  const s = statuses.find((x) => x.id === u.status) ?? {};
  return { ...u, roleTitle: r.title ?? "", roleColor: r.color ?? "secondary", statusTitle: s.title ?? "", statusColor: s.color ?? "secondary" };
};

const count = (status) => users.filter((u) => u.status === status).length;

export default {
  roles,
  statuses,
  teams,
  users: users.map(withLabels),
  stats: [
    { id: "all", title: "Total users", icon: "users", color: "primary", value: users.length },
    { id: "active", title: "Active", icon: "user-check", color: "success", value: count("active") },
    { id: "invited", title: "Invited", icon: "mail", color: "warning", value: count("invited") },
    { id: "suspended", title: "Suspended", icon: "user-x", color: "danger", value: count("suspended") },
  ],
};

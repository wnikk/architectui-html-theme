// Demo orders for the table pages. The list is the same on every build: no random values.
const customers = [
  ["Maria Chen", "maria.chen@northwind.test", 1],
  ["James Patel", "james@brightlabs.test", 2],
  ["Sofia Rossi", "s.rossi@lumen.test", 3],
  ["Daniel Novak", "daniel.novak@orbit.test", 4],
  ["Amara Okafor", "amara@harbor.test", 5],
  ["Lucas Meyer", "lucas.meyer@tandem.test", 8],
  ["Hana Sato", "hana.sato@kite.test", 9],
  ["Omar Haddad", "omar@cedar.test", 10],
  ["Elena Petrova", "elena.p@vector.test", 11],
  ["Noah Williams", "noah.w@summit.test", 12],
];

// Status label and Bootstrap color
const statuses = [
  ["Paid", "success"],
  ["Shipped", "info"],
  ["Pending", "warning"],
  ["Paid", "success"],
  ["Refunded", "secondary"],
  ["Paid", "success"],
  ["Failed", "danger"],
  ["Shipped", "info"],
];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const start = Date.UTC(2026, 9, 16);
const money = (cents) => "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });

export default Array.from({ length: 48 }, (_, i) => {
  const [name, email, avatar] = customers[(i * 7) % customers.length];
  const [status, color] = statuses[(i * 5) % statuses.length];
  const date = new Date(start - Math.floor(i * 0.6) * 86400000);
  const cents = 1900 + ((i * 7919) % 240000);
  return {
    id: `ORD-${1048 - i}`,
    name,
    email,
    avatar,
    status,
    color,
    date: `${months[date.getUTCMonth()]} ${date.getUTCDate()}, ${date.getUTCFullYear()}`,
    isoDate: date.toISOString().slice(0, 10),
    amount: money(cents),
    cents,
  };
});

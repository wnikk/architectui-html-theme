// Demo invoice for the Invoice page: an office order of Bright Labs (the customer from the Inbox page).
// Fixed values, the same on every build. Amounts are computed here, so the totals always add up.

const money = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" });

const items = [
  { title: "Office chair Aero", note: "Mesh back, graphite", qty: 4, price: 289 },
  { title: "Standing desk 140 × 70 cm", note: "Oak top, electric height", qty: 2, price: 549 },
  { title: "Desk lamp Halo", note: "LED, warm white", qty: 6, price: 49.9 },
  { title: "Dual monitor arm", note: "For screens up to 32 inches", qty: 4, price: 89 },
  { title: "Delivery and assembly", note: "London, floor 3", qty: 1, price: 120 },
].map((item) => ({ ...item, amount: item.qty * item.price }));

const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
const discount = Math.round(subtotal * 0.05 * 100) / 100;
const vat = Math.round((subtotal - discount) * 0.2 * 100) / 100;
const total = subtotal - discount + vat;

export default {
  number: "INV-2291",
  order: "ORD-1051",
  issued: "Oct 19, 2026",
  due: "Nov 2, 2026",
  terms: "Net 14",
  seller: {
    name: "Northwind Home Ltd",
    lines: ["14 Canal Street", "London E1 6AN, United Kingdom", "billing@northwind.test"],
    vat: "GB 987 6543 21",
  },
  billTo: {
    name: "James Patel",
    company: "Bright Labs Ltd",
    lines: ["21 Harbor Street, floor 3", "London E14 5AB, United Kingdom"],
    vat: "GB 123 4567 89",
  },
  shipTo: {
    name: "Bright Labs Ltd, reception",
    lines: ["21 Harbor Street, floor 3", "London E14 5AB, United Kingdom", "Mon–Fri, 09:00–17:00"],
  },
  bank: [
    ["Account name", "Northwind Home Ltd"],
    ["Sort code", "12-34-56"],
    ["Account", "00012345"],
    ["Reference", "INV-2291"],
  ],
  items: items.map((item) => ({ ...item, price: money.format(item.price), amount: money.format(item.amount) })),
  totals: [
    ["Subtotal", money.format(subtotal)],
    ["Partner discount 5%", "−" + money.format(discount)],
    ["VAT 20%", money.format(vat)],
  ],
  total: money.format(total),
};

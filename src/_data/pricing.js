// Demo plans for the Pricing page: an analytics workspace sold per month or per year (yearly = 20% less).
// Fixed values, the same on every build. Prices are per user and month; null = "Contact sales".

const money = (value) => (value === null ? "Custom" : Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`);
const yearly = (monthly) => (monthly === null ? null : Math.round(monthly * 0.8 * 100) / 100);

const plans = [
  {
    id: "free", title: "Free", icon: "sprout", note: "For one person who starts with dashboards.", monthly: 0,
    cta: "Start for free", ctaClass: "btn-outline-primary",
    features: ["1 user", "3 dashboards", "7 days of history", "Community support"],
  },
  {
    id: "starter", title: "Starter", icon: "rocket", note: "For a small team that shares its reports.", monthly: 12,
    cta: "Start a 14-day trial", ctaClass: "btn-outline-primary",
    features: ["Up to 10 users", "25 dashboards", "90 days of history", "Email alerts", "Email support"],
  },
  {
    id: "business", title: "Business", icon: "briefcase-business", note: "For teams that run the business on live data.", monthly: 29,
    cta: "Start a 14-day trial", ctaClass: "btn-primary", popular: true,
    features: ["Unlimited users", "Unlimited dashboards", "2 years of history", "Roles and two-step sign-in", "API access", "Priority support"],
  },
  {
    id: "enterprise", title: "Enterprise", icon: "building", note: "For large companies with their own security rules.", monthly: null,
    cta: "Contact sales", ctaClass: "btn-outline-primary",
    features: ["Everything in Business", "Single sign-on (SAML)", "Audit log", "Data region of your choice", "A dedicated manager"],
  },
].map((plan) => {
  const year = yearly(plan.monthly);
  const fixed = plan.monthly === null ? "Volume pricing for 100+ users" : plan.monthly === 0 ? "Free forever" : null;
  return {
    ...plan,
    priceMonthly: money(plan.monthly),
    priceYearly: money(year),
    billedMonthly: fixed ?? "Billed monthly",
    billedYearly: fixed ?? `Billed yearly: ${money(year * 12)} per user`,
    perUser: plan.monthly !== null,
  };
});

// Comparison: group, feature, value per plan (true = included, false = not, text = a limit)
const compare = [
  ["Workspace", "Users", ["1", "10", "Unlimited", "Unlimited"]],
  ["Workspace", "Dashboards", ["3", "25", "Unlimited", "Unlimited"]],
  ["Workspace", "Data history", ["7 days", "90 days", "2 years", "Unlimited"]],
  ["Workspace", "Data sources", ["2", "10", "50", "Unlimited"]],
  ["Features", "Scheduled reports", [false, true, true, true]],
  ["Features", "Email and browser alerts", [false, true, true, true]],
  ["Features", "Public links", [false, true, true, true]],
  ["Features", "API access", [false, false, true, true]],
  ["Security", "Roles", [false, false, true, true]],
  ["Security", "Two-step sign-in", [true, true, true, true]],
  ["Security", "Single sign-on (SAML)", [false, false, false, true]],
  ["Security", "Audit log", [false, false, false, true]],
  ["Support", "Help center", [true, true, true, true]],
  ["Support", "Email support", [false, true, true, true]],
  ["Support", "Response time", ["—", "2 business days", "4 hours", "1 hour"]],
].map(([group, title, values]) => ({ group, title, values }));

const faq = [
  ["Can I change the plan later?", "Yes. Upgrade at any time and pay only the difference for the rest of the period. A downgrade applies at the end of the period."],
  ["What happens after the trial?", "The workspace moves to the Free plan unless you choose a paid plan. Your dashboards stay; the ones above the Free limit become read-only."],
  ["How does yearly billing work?", "You pay for 12 months at once and save 20%. Users added during the year are billed for the months that remain."],
  ["Which payment methods do you take?", "Cards (Visa, Mastercard, American Express) and bank transfer for yearly plans. Enterprise plans can pay by invoice."],
  ["Can I cancel at any time?", "Yes. A monthly plan ends at the end of the month; a yearly plan gets a refund for the full months that remain."],
].map(([q, a]) => ({ q, a }));

export default { plans, compare, groups: [...new Set(compare.map((c) => c.group))], faq, saving: 20 };

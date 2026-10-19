// Demo inbox for the Inbox page: the support desk of an online store. Fixed values, the same on every build.
// Each conversation: the customer, folder, flags, a label and the messages (own = written by the signed-in user).

const me = { name: "Alina Mclourd", avatar: 1 };

const folders = [
  { id: "inbox", title: "Inbox", icon: "inbox" },
  { id: "starred", title: "Starred", icon: "star" },
  { id: "sent", title: "Sent", icon: "send" },
  { id: "drafts", title: "Drafts", icon: "file-pen-line" },
  { id: "archive", title: "Archive", icon: "archive" },
  { id: "spam", title: "Spam", icon: "shield-alert" },
];

const labels = [
  { id: "orders", title: "Orders", color: "primary" },
  { id: "billing", title: "Billing", color: "info" },
  { id: "returns", title: "Returns", color: "warning" },
  { id: "partners", title: "Partners", color: "success" },
];

const conversations = [
  {
    id: "c1", name: "Maria Chen", email: "maria.chen@northwind.test", avatar: 11, folder: "inbox", unread: false, starred: true, label: "orders",
    subject: "Order ORD-1048 has not arrived", time: "10:42",
    messages: [
      [false, "09:58", "Hello! I ordered a desk lamp a week ago (ORD-1048). Tracking still says “label created”. Can you check?"],
      [true, "10:15", "Hi Maria, thank you for the order number. The parcel left our warehouse yesterday; the carrier updates the tracking with a delay of one day."],
      [false, "10:31", "Thanks. Will it still arrive before Friday? It is a gift."],
      [true, "10:38", "Yes: the carrier promises Thursday. I added a priority note to the delivery."],
      [false, "10:42", "Perfect, thank you so much!"],
    ],
  },
  {
    id: "c2", name: "James Patel", email: "james@brightlabs.test", avatar: 2, folder: "inbox", unread: true, starred: false, label: "billing",
    subject: "VAT number on the invoice", time: "09:17",
    messages: [
      [false, "09:05", "Could you add our VAT number GB 123 4567 89 to invoice INV-2291? Our accountant needs it for the quarter."],
      [false, "09:17", "Also, is it possible to get the invoices of the last three months as one PDF?"],
    ],
  },
  {
    id: "c3", name: "Sofia Rossi", email: "s.rossi@lumen.test", avatar: 3, folder: "inbox", unread: false, starred: false, label: "returns",
    subject: "Return of a damaged chair", time: "Yesterday",
    messages: [
      [false, "16:20", "The chair arrived with a broken leg. I attach two photos. How do I return it?"],
      [true, "16:48", "I am sorry about that, Sofia. I created a free return label: you will get it by email in a few minutes. A new chair ships today."],
      [false, "17:02", "Great service, thank you."],
    ],
  },
  {
    id: "c4", name: "Daniel Novak", email: "daniel.novak@orbit.test", avatar: 4, folder: "inbox", unread: true, starred: true, label: "partners",
    subject: "Wholesale prices for 2027", time: "Oct 23",
    messages: [
      [false, "11:10", "Hi team, we plan the orders for next year. Can you send the wholesale price list for 2027?"],
      [true, "12:30", "Hi Daniel, the list is ready next week. I will send it together with the delivery schedule."],
    ],
  },
  {
    id: "c5", name: "Amara Okafor", email: "amara@harbor.test", avatar: 5, folder: "inbox", unread: false, starred: false, label: "orders",
    subject: "Change the delivery address", time: "Oct 22",
    messages: [
      [false, "08:45", "Please send order ORD-1046 to my office: 21 Harbor Street, floor 3."],
      [true, "09:02", "Done, Amara. The courier has the new address."],
    ],
  },
  {
    id: "c6", name: "Lucas Meyer", email: "lucas.meyer@tandem.test", avatar: 8, folder: "sent", unread: false, starred: false, label: "billing",
    subject: "Your refund is on its way", time: "Oct 21",
    messages: [
      [true, "14:10", "Hi Lucas, we refunded $56.40 for the missing item. The bank shows it within 3–5 business days."],
    ],
  },
  {
    id: "c7", name: "Hana Sato", email: "hana.sato@kite.test", avatar: 9, folder: "drafts", unread: false, starred: false, label: null,
    subject: "Draft: photos for the product page", time: "Oct 20",
    messages: [
      [true, "18:05", "Hi Hana, thank you for the photos. Could you also send them at 2000 px wide for the zoom view?"],
    ],
  },
  {
    id: "c8", name: "Omar Haddad", email: "omar@cedar.test", avatar: 10, folder: "archive", unread: false, starred: false, label: "returns",
    subject: "Exchange: size M to L", time: "Oct 18",
    messages: [
      [false, "10:00", "Can I exchange the jacket from size M to L?"],
      [true, "10:20", "Of course. Send the jacket back with the enclosed label; size L ships as soon as it arrives."],
      [false, "10:24", "Thanks, sending it today."],
    ],
  },
].map((conversation) => ({
  ...conversation,
  label: labels.find((label) => label.id === conversation.label) ?? null,
  preview: conversation.messages.at(-1)[2],
  messages: conversation.messages.map(([own, time, text]) => ({ own, time, text })),
}));

const count = (test) => conversations.filter(test).length;

export default {
  me,
  folders: folders.map((folder) => ({
    ...folder,
    unread: folder.id === "inbox" ? count((c) => c.folder === "inbox" && c.unread) : 0,
    total: folder.id === "starred" ? count((c) => c.starred) : count((c) => c.folder === folder.id),
  })),
  labels,
  conversations,
};

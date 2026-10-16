// DataTables 3 on a table rendered in the page. The Bootstrap 5 integration and the theme style it.
(() => {
  const table = document.getElementById("ordersTable");
  if (!table || !window.DataTable) return;

  new DataTable(table, {
    responsive: true,
    order: [[3, "desc"]],
    pageLength: 10,
    lengthMenu: [10, 25, 50],
    columnDefs: [
      // On a narrow screen the columns hide from the end of this list; hidden ones open in a row below
      { targets: 0, responsivePriority: 1 },
      { targets: 4, responsivePriority: 2 },
      { targets: 2, responsivePriority: 3 },
      { targets: 1, responsivePriority: 4 },
      { targets: 3, responsivePriority: 5 },
      // DataTables aligns dates to the right; the theme keeps them to the left, as in a regular table
      { targets: 3, className: "dt-left" },
      { targets: -1, orderable: false, searchable: false, responsivePriority: 6 },
    ],
    language: {
      search: "",
      searchPlaceholder: "Search orders",
      lengthMenu: "_MENU_ per page",
      info: "Showing _START_–_END_ of _TOTAL_ orders",
      infoEmpty: "No orders",
      infoFiltered: "(filtered from _MAX_)",
      zeroRecords: "No orders match the search",
    },
    // Icons in rows that DataTables adds later (responsive details) are drawn after each draw
    drawCallback: () => window.ArchitectUI?.refresh(table),
  });
})();

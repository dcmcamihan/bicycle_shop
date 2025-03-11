// Define an initialization function for the return/exchange page
function initReturnExchange() {
  let currentPage = 1;
  const rowsPerPage = 10;

  // DOM Elements
  const tbody = document.getElementById("returnExchangeTbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const searchInput = document.getElementById("searchInput");
  const filterCriteria = document.getElementById("filterCriteria");

  // Modal Elements
  const returnModal = document.getElementById("returnModal");
  const btnAddReturn = document.getElementById("btnAddReturn");
  const closeReturnModal = document.getElementById("closeReturnModal");
  const returnForm = document.getElementById("returnForm");
  const returnModalTitle = document.getElementById("returnModalTitle");

  // This variable tracks which record is being edited (null means add new)
  let editReturnIndex = null;

  // Sample Data – in practice, fetch this from a server or store it globally.
  let returnExchangeData = [
    {
      id: "RE001",
      date: "2025-04-01",
      customer: "Alice Johnson",
      type: "Return",
      reason: "Defective product",
      totalValue: "$150",
      status: "Pending",
      details: [
        { productName: "Brake Pads", quantity: 2, condition: "Unused", refundValue: "$150" }
      ]
    },
    {
      id: "RE002",
      date: "2025-04-02",
      customer: "Bob Smith",
      type: "Exchange",
      reason: "Wrong size",
      totalValue: "$300",
      status: "Approved",
      details: [
        { productName: "Handlebar", quantity: 1, condition: "Used", refundValue: "$300" }
      ]
    },
    {
      id: "RE003",
      date: "2025-04-03",
      customer: "Charlie Davis",
      type: "Return",
      reason: "Changed mind",
      totalValue: "$50",
      status: "Rejected",
      details: [
        { productName: "Chain", quantity: 1, condition: "New", refundValue: "$50" }
      ]
    }
  ];

  // --- Modal Event Listeners ---
  btnAddReturn.addEventListener("click", () => {
    returnModalTitle.textContent = "Add Return/Exchange";
    returnForm.reset();
    editReturnIndex = null;
    returnModal.style.display = "block";
  });

  closeReturnModal.addEventListener("click", () => {
    returnModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === returnModal) {
      returnModal.style.display = "none";
    }
  });

  // --- Form Submission Handler ---
  returnForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = document.getElementById("returnDate").value;
    const customer = document.getElementById("returnCustomer").value.trim();
    const type = document.getElementById("returnType").value;
    const reason = document.getElementById("returnReason").value.trim();
    const totalValue = document.getElementById("returnTotal").value;

    if (editReturnIndex === null) {
      const newId = "RE" + String(returnExchangeData.length + 1).padStart(3, "0");
      // For simplicity, new records get status "Pending" and no details.
      returnExchangeData.push({
        id: newId,
        date,
        customer,
        type,
        reason,
        totalValue: "$" + totalValue,
        status: "Pending",
        details: []
      });
    } else {
      returnExchangeData[editReturnIndex] = {
        ...returnExchangeData[editReturnIndex],
        date,
        customer,
        type,
        reason,
        totalValue: "$" + totalValue
      };
    }
    returnModal.style.display = "none";
    returnForm.reset();
    renderTable();
  });

  // --- Pagination Event Listeners ---
  function updatePagination() {
    const totalRows = filterSearchData().length;
    const maxPage = Math.ceil(totalRows / rowsPerPage) || 1;
    pageNumberSpan.textContent = currentPage;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= maxPage;
  }

  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });

  nextPageBtn.addEventListener("click", () => {
    const totalRows = filterSearchData().length;
    const maxPage = Math.ceil(totalRows / rowsPerPage) || 1;
    if (currentPage < maxPage) {
      currentPage++;
      renderTable();
    }
  });

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
  });
  
  if (filterCriteria) {
    filterCriteria.addEventListener("change", () => {
      currentPage = 1;
      renderTable();
    });
  }

  // --- Render the Return/Exchange Table ---
  function renderTable() {
    const filtered = filterSearchData();
    const totalRows = filtered.length;
    const maxPage = Math.ceil(totalRows / rowsPerPage) || 1;
    if (currentPage > maxPage) currentPage = maxPage;
    updatePagination();

    const startIndex = (currentPage - 1) * rowsPerPage;
    const pageData = filtered.slice(startIndex, startIndex + rowsPerPage);
    tbody.innerHTML = "";

    pageData.forEach((record, idx) => {
      // Create Parent Row
      const parentRow = document.createElement("tr");
      parentRow.classList.add("parent-row");
      parentRow.innerHTML = `
        <td class="toggle-cell">
          <i class="fa-solid fa-chevron-right toggle-btn"></i>
        </td>
        <td>${record.id}</td>
        <td>${record.date}</td>
        <td>${record.customer}</td>
        <td>${record.type}</td>
        <td>${record.reason}</td>
        <td>${record.totalValue}</td>
        <td>${record.status}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-return"></i>
          <i class="fa-solid fa-trash delete-return"></i>
        </td>
      `;
      tbody.appendChild(parentRow);

      // Create Child Row for Item Details
      const childRow = document.createElement("tr");
      childRow.classList.add("child-row");
      let detailsHTML = `<div class="child-content"><h3>Item Details</h3>`;
      if (record.details && record.details.length > 0) {
        detailsHTML += `<table class="detail-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Condition</th>
              <th>Refund/Exchange Value</th>
            </tr>
          </thead>
          <tbody>`;
        record.details.forEach(detail => {
          detailsHTML += `
            <tr>
              <td>${detail.productName}</td>
              <td>${detail.quantity}</td>
              <td>${detail.condition}</td>
              <td>${detail.refundValue}</td>
            </tr>
          `;
        });
        detailsHTML += `</tbody></table>`;
      } else {
        detailsHTML += `<p>No item details.</p>`;
      }
      detailsHTML += `</div>`;
      childRow.innerHTML = `<td colspan="9">${detailsHTML}</td>`;
      tbody.appendChild(childRow);

      // Toggle functionality for collapsible rows
      const toggleBtn = parentRow.querySelector(".toggle-btn");
      toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("rotated");
        childRow.style.display = (childRow.style.display === "table-row") ? "none" : "table-row";
      });

      // Edit functionality
      const editIcon = parentRow.querySelector(".edit-return");
      editIcon.addEventListener("click", () => {
        editReturnIndex = startIndex + idx;
        returnModalTitle.textContent = "Edit Return/Exchange";
        document.getElementById("returnDate").value = record.date;
        document.getElementById("returnCustomer").value = record.customer;
        document.getElementById("returnType").value = record.type;
        document.getElementById("returnReason").value = record.reason;
        document.getElementById("returnTotal").value = record.totalValue.replace("$", "");
        returnModal.style.display = "block";
      });

      // Delete functionality
      const deleteIcon = parentRow.querySelector(".delete-return");
      deleteIcon.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this record?")) {
          returnExchangeData.splice(startIndex + idx, 1);
          renderTable();
        }
      });
    });
  }

  // --- Filter & Search Function ---
  function filterSearchData() {
    const searchVal = searchInput.value.toLowerCase().trim();
    let filteredData = returnExchangeData.filter(record => {
      const text = record.id + record.date + record.customer + record.type + record.reason + record.totalValue + record.status;
      return text.toLowerCase().includes(searchVal);
    });
    if (filterCriteria && filterCriteria.value !== "all") {
      const criteria = filterCriteria.value;
      filteredData = filteredData.filter(record => {
        if (criteria === "customer") return record.customer.toLowerCase().includes(searchVal);
        if (criteria === "date") return record.date.toLowerCase().includes(searchVal);
        if (criteria === "type") return record.type.toLowerCase().includes(searchVal);
        if (criteria === "status") return record.status.toLowerCase().includes(searchVal);
        return true;
      });
    }
    return filteredData;
  }

  // Initial render
  renderTable();
}

window.initReturnExchange = initReturnExchange;

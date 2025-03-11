// Define an initialization function for the sale details page
function initSaleDetails() {
  let currentPage = 1;
  const rowsPerPage = 10;

  // Ensure your <tbody> in sale-detail.html has id="saleTbody"
  const saleTbody = document.querySelector(".collapsible-table tbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");

  // Filter & Search elements
  const filterCriteria = document.getElementById("filterCriteria");
  const searchInput = document.getElementById("searchInput");

  // Modal elements for adding and editing Sales
  const addSaleModal = document.getElementById("addSaleModal");
  const btnAddSale = document.getElementById("btnAddSale");
  const closeAddSaleModal = document.getElementById("closeAddSaleModal");
  const addSaleForm = document.getElementById("addSaleForm");

  const editSaleModal = document.getElementById("editSaleModal");
  const closeEditSaleModal = document.getElementById("closeEditSaleModal");
  const editSaleForm = document.getElementById("editSaleForm");
  let editSaleIndex = null;

  // Modal elements for editing Sale Details
  const editSaleDetailModal = document.getElementById("editSaleDetailModal");
  const closeEditSaleDetailModal = document.getElementById("closeEditSaleDetailModal");
  const editSaleDetailForm = document.getElementById("editSaleDetailForm");
  let editSaleDetailIndex = null;

  // Sample data (replace with actual data fetching logic)
  let salesData = [
    {
      saleID: "S001",
      date: "2025-03-10",
      customer: "Alice Johnson",
      cashier: "Bob Smith",
      paymentMethod: "Cash",
      totalAmount: 1200,
      details: [
        { productName: "Bicycle", quantity: 1, pricePerUnit: 800 },
        { productName: "Helmet", quantity: 1, pricePerUnit: 200 },
        { productName: "Gloves", quantity: 2, pricePerUnit: 100 },
      ],
    },
    {
      saleID: "S002",
      date: "2025-03-11",
      customer: "Charlie Davis",
      cashier: "Diana Evans",
      paymentMethod: "Card",
      totalAmount: 450,
      details: [
        { productName: "Bicycle", quantity: 1, pricePerUnit: 450 },
      ],
    },
  ];

  // --- Modal Event Listeners ---
  if (btnAddSale) {
    btnAddSale.addEventListener("click", () => {
      addSaleModal.style.display = "block";
    });
  }
  if (closeAddSaleModal) {
    closeAddSaleModal.addEventListener("click", () => {
      addSaleModal.style.display = "none";
    });
  }
  window.addEventListener("click", (e) => {
    if (e.target === addSaleModal) {
      addSaleModal.style.display = "none";
    }
  });

  if (closeEditSaleModal) {
    closeEditSaleModal.addEventListener("click", () => {
      editSaleModal.style.display = "none";
    });
  }
  window.addEventListener("click", (e) => {
    if (e.target === editSaleModal) {
      editSaleModal.style.display = "none";
    }
  });

  if (closeEditSaleDetailModal) {
    closeEditSaleDetailModal.addEventListener("click", () => {
      editSaleDetailModal.style.display = "none";
    });
  }
  window.addEventListener("click", (e) => {
    if (e.target === editSaleDetailModal) {
      editSaleDetailModal.style.display = "none";
    }
  });

  // --- Form Submission Handlers ---
  if (addSaleForm) {
    addSaleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const customer = document.getElementById("saleCustomer").value.trim();
      const date = document.getElementById("saleDate").value;
      const cashier = document.getElementById("saleCashier").value.trim();
      const paymentMethod = document.getElementById("salePayment").value.trim();
      const totalAmount = parseFloat(document.getElementById("saleTotal").value);

      const newSale = {
        saleID: "S" + String(salesData.length + 1).padStart(3, "0"),
        date,
        customer,
        cashier,
        paymentMethod,
        totalAmount,
        details: [],
      };
      salesData.push(newSale);
      addSaleModal.style.display = "none";
      addSaleForm.reset();
      renderTable();
    });
  }

  if (editSaleForm) {
    editSaleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editSaleIndex === null) return;
      salesData[editSaleIndex].customer = document.getElementById("editSaleCustomer").value.trim();
      salesData[editSaleIndex].date = document.getElementById("editSaleDate").value;
      salesData[editSaleIndex].cashier = document.getElementById("editSaleCashier").value.trim();
      salesData[editSaleIndex].paymentMethod = document.getElementById("editSalePayment").value.trim();
      salesData[editSaleIndex].totalAmount = parseFloat(document.getElementById("editSaleTotal").value);
      editSaleModal.style.display = "none";
      editSaleForm.reset();
      editSaleIndex = null;
      renderTable();
    });
  }

  if (editSaleDetailForm) {
    editSaleDetailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editSaleIndex === null || editSaleDetailIndex === null) return;
      const detail = salesData[editSaleIndex].details[editSaleDetailIndex];
      detail.productName = document.getElementById("editProductName").value.trim();
      detail.quantity = parseInt(document.getElementById("editQuantitySold").value, 10);
      detail.pricePerUnit = parseFloat(document.getElementById("editPricePerUnit").value);
      editSaleDetailModal.style.display = "none";
      editSaleDetailForm.reset();
      editSaleDetailIndex = null;
      renderTable();
    });
  }

  // --- Pagination Logic ---
  function updatePagination() {
    const totalRows = filterSearchData().length;
    const maxPage = Math.ceil(totalRows / rowsPerPage);
    pageNumberSpan.textContent = currentPage;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= maxPage;
  }

  if (prevPageBtn) {
    prevPageBtn.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }
  if (nextPageBtn) {
    nextPageBtn.addEventListener("click", () => {
      const totalRows = filterSearchData().length;
      const maxPage = Math.ceil(totalRows / rowsPerPage);
      if (currentPage < maxPage) {
        currentPage++;
        renderTable();
      }
    });
  }

  filterCriteria.addEventListener("change", () => {
    currentPage = 1;
    renderTable();
  });
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
  });

  // --- Render the Sales Table ---
  function renderTable() {
    const filtered = filterSearchData();
    const totalRows = filtered.length;
    const maxPage = Math.ceil(totalRows / rowsPerPage);
    if (currentPage > maxPage && maxPage !== 0) {
      currentPage = maxPage;
    }
    updatePagination();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const pageData = filtered.slice(startIndex, endIndex);

    saleTbody.innerHTML = "";

    pageData.forEach((sale, idx) => {
      const parentRow = document.createElement("tr");
      parentRow.classList.add("parent-row");
      parentRow.innerHTML = `
        <td class="toggle-cell">
          <i class="fa-solid fa-chevron-right toggle-btn"></i>
        </td>
        <td>${sale.saleID}</td>
        <td>${sale.date}</td>
        <td>${sale.customer}</td>
        <td>${sale.cashier}</td>
        <td>$${sale.totalAmount}</td>
        <td>${sale.paymentMethod}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-sale"></i>
          <i class="fa-solid fa-trash delete-sale"></i>
        </td>
      `;

      const childRow = document.createElement("tr");
      childRow.classList.add("child-row");
      let detailsHTML = `
        <table class="sale-detail-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity Sold</th>
              <th>Price Per Unit</th>
              <th>Subtotal</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
      `;
      sale.details.forEach((detail, dIdx) => {
        const subtotal = detail.quantity * detail.pricePerUnit;
        detailsHTML += `
          <tr>
            <td>${detail.productName}</td>
            <td>${detail.quantity}</td>
            <td>$${detail.pricePerUnit}</td>
            <td>$${subtotal}</td>
            <td>
              <i class="fa-solid fa-pen-to-square edit-sale-detail"></i>
              <i class="fa-solid fa-trash delete-sale-detail"></i>
            </td>
          </tr>
        `;
      });
      detailsHTML += `
          </tbody>
        </table>
      `;
      childRow.innerHTML = `<td colspan="8">${detailsHTML}</td>`;

      saleTbody.appendChild(parentRow);
      saleTbody.appendChild(childRow);

      // Toggle Child Row
      const toggleBtn = parentRow.querySelector(".toggle-btn");
      toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("rotated");
        childRow.style.display = (childRow.style.display === "table-row") ? "none" : "table-row";
      });

      // Edit Sale
      const editSaleIcon = parentRow.querySelector(".edit-sale");
      editSaleIcon.addEventListener("click", () => {
        openEditSaleModal(sale, startIndex + idx);
      });

      // Delete Sale
      const deleteSaleIcon = parentRow.querySelector(".delete-sale");
      deleteSaleIcon.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this sale?")) {
          salesData.splice(startIndex + idx, 1);
          renderTable();
        }
      });

      // Sale Detail Edit and Delete
      const editSaleDetailIcons = childRow.querySelectorAll(".edit-sale-detail");
      editSaleDetailIcons.forEach((icon, dIdx) => {
        icon.addEventListener("click", () => {
          openEditSaleDetailModal(sale, startIndex + idx, dIdx);
        });
      });
      const deleteSaleDetailIcons = childRow.querySelectorAll(".delete-sale-detail");
      deleteSaleDetailIcons.forEach((icon, dIdx) => {
        icon.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this sale detail?")) {
            salesData[startIndex + idx].details.splice(dIdx, 1);
            renderTable();
          }
        });
      });
    });
  }

  // --- Filter & Search Function ---
  function filterSearchData() {
    const criteria = filterCriteria.value;
    const searchVal = searchInput.value.toLowerCase().trim();
    return salesData.filter(sale => {
      let textToSearch = "";
      switch (criteria) {
        case "all":
          textToSearch = sale.saleID + sale.date + sale.customer + sale.cashier + sale.paymentMethod;
          break;
        case "customer":
          textToSearch = sale.customer;
          break;
        case "date":
          textToSearch = sale.date;
          break;
        case "payment":
          textToSearch = sale.paymentMethod;
          break;
        default:
          textToSearch = sale.saleID + sale.date + sale.customer + sale.cashier + sale.paymentMethod;
      }
      return textToSearch.toLowerCase().includes(searchVal);
    });
  }

  // --- Modal Functions ---
  function openEditSaleModal(sale, rowIndex) {
    editSaleIndex = rowIndex;
    document.getElementById("editSaleID").value = sale.saleID;
    document.getElementById("editSaleCustomer").value = sale.customer;
    document.getElementById("editSaleDate").value = sale.date;
    document.getElementById("editSaleCashier").value = sale.cashier;
    document.getElementById("editSalePayment").value = sale.paymentMethod;
    document.getElementById("editSaleTotal").value = sale.totalAmount;
    editSaleModal.style.display = "block";
  }

  function openEditSaleDetailModal(sale, saleIndex, detailIndex) {
    editSaleIndex = saleIndex;
    editSaleDetailIndex = detailIndex;
    const detail = salesData[saleIndex].details[detailIndex];
    document.getElementById("editProductName").value = detail.productName;
    document.getElementById("editQuantitySold").value = detail.quantity;
    document.getElementById("editPricePerUnit").value = detail.pricePerUnit;
    editSaleDetailModal.style.display = "block";
  }

  // Initial render
  renderTable();
}

// Expose the initialization function so it can be called externally
window.initSaleDetails = initSaleDetails;
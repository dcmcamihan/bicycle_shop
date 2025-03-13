// Define an initialization function for the sale details page
function initSaleDetails() {
  let currentPage = 1;
  const rowsPerPage = 10;

  // DOM Elements
  const saleTbody = document.querySelector(".collapsible-table tbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const filterCriteria = document.getElementById("filterCriteria");
  const searchInput = document.getElementById("searchInput");

  // Modals & Forms
  const addSaleModal = document.getElementById("addSaleModal");
  const btnAddSale = document.getElementById("btnAddSale");
  const closeAddSaleModal = document.getElementById("closeAddSaleModal");
  const addSaleForm = document.getElementById("addSaleForm");

  const editSaleModal = document.getElementById("editSaleModal");
  const closeEditSaleModal = document.getElementById("closeEditSaleModal");
  const editSaleForm = document.getElementById("editSaleForm");
  let editSaleIndex = null;

  const editSaleDetailModal = document.getElementById("editSaleDetailModal");
  const closeEditSaleDetailModal = document.getElementById("closeEditSaleDetailModal");
  const editSaleDetailForm = document.getElementById("editSaleDetailForm");
  let editSaleDetailIndex = null;

  // Local data storage
  let salesData = [];

  // Fetch sales data from the API
  fetchSalesData();

  function fetchSalesData() {
    fetch('http://localhost:3000/api/sales')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched sales data:', data); // Log the data to debug
        // Group sales by sale_id
        const salesMap = new Map();
        data.forEach(sale => {
          if (!salesMap.has(sale.sale_id)) {
            salesMap.set(sale.sale_id, {
              saleID: sale.sale_id,
              date: new Date(sale.sale_date).toLocaleDateString(),
              customer: `${sale.customer_first_name} ${sale.customer_last_name}`,
              cashier: `${sale.cashier_first_name} ${sale.cashier_last_name}`,
              paymentMethod: sale.payment_method_description || "N/A",
              totalAmount: 0,
              details: []
            });
          }
          const saleEntry = salesMap.get(sale.sale_id);
          saleEntry.details.push({
            productName: sale.product_name,
            quantity: sale.quantity_sold,
            pricePerUnit: sale.price_per_unit,
            saleDetailID: sale.sale_detail_id
          });
          saleEntry.totalAmount += sale.quantity_sold * sale.price_per_unit;
        });
        salesData = Array.from(salesMap.values());
        renderTable();
      })
      .catch(error => console.error('Error fetching sales data:', error));
  }

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
      editSaleDetailModal.style.display = "none";}
  });

  // --- Form Submission Handlers ---

  // Adding a Sale
  if (addSaleForm) {
    addSaleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Collect form values.
      const customerId = parseInt(document.getElementById("saleCustomer").value.trim(), 10);
      const saleDate = document.getElementById("saleDate").value;
      const cashierId = parseInt(document.getElementById("saleCashier").value.trim(), 10);
      const paymentMethod = document.getElementById("salePayment").value.trim();
      const totalAmount = parseFloat(document.getElementById("saleTotal").value);

      // Build the payload using the backend model field names.
      const newSalePayload = {
        customer_id: customerId,
        sale_date: saleDate,
        cashier: cashierId,
        manager: cashierId, // Example: setting manager to cashier; adjust as needed.
        payment_method: paymentMethod,
        total_amount: totalAmount,
        details: [] // Initially empty; you can add details later.
      };

      fetch('http://localhost:3000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSalePayload)
      })
        .then(response => response.json())
        .then(data => {
          // Map the returned sale to the local format.
          const mappedSale = {
            saleID: data.sale_id,
            date: new Date(data.sale_date).toLocaleDateString(),
            customer: `${data.customer_first_name} ${data.customer_last_name}`,
            cashier: `${data.cashier_first_name} ${data.cashier_last_name}`,
            paymentMethod: data.payment_method_code || "N/A",
            totalAmount: data.total_amount,
            details: data.details.map(detail => ({
              productName: detail.product_name,
              quantity: detail.quantity_sold,
              pricePerUnit: detail.price_per_unit,
              saleDetailID: detail.sale_detail_id
            }))
          };
          salesData.push(mappedSale);
          addSaleModal.style.display = "none";
          addSaleForm.reset();
          renderTable();
        })
        .catch(error => console.error('Error adding sale:', error));
    });
  }

  // Editing a Sale
  if (editSaleForm) {
    editSaleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editSaleIndex === null) return;
      const sale = salesData[editSaleIndex];
      // Update local sale object from form inputs.
      sale.customer = document.getElementById("editSaleCustomer").value.trim();
      sale.date = document.getElementById("editSaleDate").value;
      sale.cashier = document.getElementById("editSaleCashier").value.trim();
      sale.paymentMethod = document.getElementById("editSalePayment").value.trim();
      sale.totalAmount = parseFloat(document.getElementById("editSaleTotal").value);

      const updatedSalePayload = {
        customer_id: sale.customer_id,
        sale_date: sale.date,
        cashier: sale.cashier,
        payment_method: sale.paymentMethod,
        total_amount: sale.totalAmount
      };

      fetch(`http://localhost:3000/api/sales/${sale.saleID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSalePayload)
      })
        .then(response => response.json())
        .then(data => {
          salesData[editSaleIndex] = {
            saleID: data.sale_id,
            date: new Date(data.sale_date).toLocaleDateString(),
            customer: `${data.customer_first_name} ${data.customer_last_name}`,
            cashier: `${data.cashier_first_name} ${data.cashier_last_name}`,
            paymentMethod: data.payment_method_code || "N/A",
            totalAmount: data.total_amount,
            details: data.details.map(detail => ({
              productName: detail.product_name,
              quantity: detail.quantity_sold,
              pricePerUnit: detail.price_per_unit,
              saleDetailID: detail.sale_detail_id
            }))
          };
          editSaleModal.style.display = "none";
          editSaleForm.reset();
          editSaleIndex = null;
          renderTable();
        })
        .catch(error => console.error('Error updating sale:', error));
    });
  }

  // Editing a Sale Detail
  if (editSaleDetailForm) {
    editSaleDetailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editSaleIndex === null || editSaleDetailIndex === null) return;
      const detail = salesData[editSaleIndex].details[editSaleDetailIndex];
      detail.productName = document.getElementById("editProductName").value.trim();
      detail.quantity = parseInt(document.getElementById("editQuantitySold").value, 10);
      detail.pricePerUnit = parseFloat(document.getElementById("editPricePerUnit").value);

      const updatedDetailPayload = {
        product_id: detail.product_id,
        quantity_sold: detail.quantity,
        price_per_unit: detail.pricePerUnit
      };

      fetch(`http://localhost:3000/api/sale-details/${detail.saleDetailID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDetailPayload)
      })
        .then(response => response.json())
        .then(data => {
          salesData[editSaleIndex].details[editSaleDetailIndex] = {
            productName: data.product_name,
            quantity: data.quantity_sold,
            pricePerUnit: data.price_per_unit,
            saleDetailID: data.sale_detail_id
          };
          editSaleDetailModal.style.display = "none";
          editSaleDetailForm.reset();
          editSaleDetailIndex = null;
          renderTable();
        })
        .catch(error => console.error('Error updating sale detail:', error));
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
        <td>P${sale.totalAmount}</td>
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
            <td>P${detail.pricePerUnit}</td>
            <td>P${subtotal}</td>
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
          fetch(`http://localhost:3000/api/sales/${sale.saleID}`, {
            method: 'DELETE',
          })
            .then(() => {
              salesData.splice(startIndex + idx, 1);
              renderTable();
            })
            .catch(error => console.error('Error deleting sale:', error));
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
            const detail = salesData[startIndex + idx].details[dIdx];
            fetch(`http://localhost:3000/api/sale-details/${detail.saleDetailID}`, {
              method: 'DELETE',
            })
              .then(() => {
                salesData[startIndex + idx].details.splice(dIdx, 1);
                renderTable();
              })
              .catch(error => console.error('Error deleting sale detail:', error));
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
      return textToSearch && textToSearch.toLowerCase().includes(searchVal);
    });
  }

  // --- Modal Functions ---
  function openEditSaleModal(sale, rowIndex) {
    editSaleIndex = rowIndex;
// filepath: /Users/diannaclairemarieamihan/Workspace/nodejs/bicycle_shop/frontend/panel/sales/sale-details.js
// Define an initialization function for the sale details page
function initSaleDetails() {
  let currentPage = 1;
  const rowsPerPage = 10;

  // DOM Elements
  const saleTbody = document.querySelector(".collapsible-table tbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const filterCriteria = document.getElementById("filterCriteria");
  const searchInput = document.getElementById("searchInput");

  // Modals & Forms
  const addSaleModal = document.getElementById("addSaleModal");
  const btnAddSale = document.getElementById("btnAddSale");
  const closeAddSaleModal = document.getElementById("closeAddSaleModal");
  const addSaleForm = document.getElementById("addSaleForm");

  const editSaleModal = document.getElementById("editSaleModal");
  const closeEditSaleModal = document.getElementById("closeEditSaleModal");
  const editSaleForm = document.getElementById("editSaleForm");
  let editSaleIndex = null;

  const editSaleDetailModal = document.getElementById("editSaleDetailModal");
  const closeEditSaleDetailModal = document.getElementById("closeEditSaleDetailModal");
  const editSaleDetailForm = document.getElementById("editSaleDetailForm");
  let editSaleDetailIndex = null;

  // Local data storage
  let salesData = [];

  // Fetch sales data from the API
  fetchSalesData();

  function fetchSalesData() {
    fetch('http://localhost:3000/api/sales')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched sales data:', data); // Log the data to debug
        // Group sales by sale_id
        const salesMap = new Map();
        data.forEach(sale => {
          if (!salesMap.has(sale.sale_id)) {
            salesMap.set(sale.sale_id, {
              saleID: sale.sale_id,
              date: new Date(sale.sale_date).toLocaleDateString(),
              customer: `${sale.customer_first_name} ${sale.customer_last_name}`,
              cashier: `${sale.cashier_first_name} ${sale.cashier_last_name}`,
              paymentMethod: sale.payment_method_code || "N/A",
              totalAmount: 0,
              details: []
            });
          }
          const saleEntry = salesMap.get(sale.sale_id);
          saleEntry.details.push({
            productName: sale.product_name,
            quantity: sale.quantity_sold,
            pricePerUnit: sale.price_per_unit,
            saleDetailID: sale.sale_detail_id
          });
          saleEntry.totalAmount += sale.quantity_sold * sale.price_per_unit;
        });
        salesData = Array.from(salesMap.values());
        renderTable();
      })
      .catch(error => console.error('Error fetching sales data:', error));
  }

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
      editSaleDetailModal.style.display = "none";}
  });

  // --- Form Submission Handlers ---

  // Adding a Sale
  if (addSaleForm) {
    addSaleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Collect form values.
      const customerId = parseInt(document.getElementById("saleCustomer").value.trim(), 10);
      const saleDate = document.getElementById("saleDate").value;
      const cashierId = parseInt(document.getElementById("saleCashier").value.trim(), 10);
      const paymentMethod = document.getElementById("salePayment").value.trim();
      const totalAmount = parseFloat(document.getElementById("saleTotal").value);

      // Build the payload using the backend model field names.
      const newSalePayload = {
        customer_id: customerId,
        sale_date: saleDate,
        cashier: cashierId,
        manager: cashierId, // Example: setting manager to cashier; adjust as needed.
        payment_method: paymentMethod,
        total_amount: totalAmount,
        details: [] // Initially empty; you can add details later.
      };

      fetch('http://localhost:3000/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSalePayload)
      })
        .then(response => response.json())
        .then(data => {
          // Map the returned sale to the local format.
          const mappedSale = {
            saleID: data.sale_id,
            date: new Date(data.sale_date).toLocaleDateString(),
            customer: `${data.customer_first_name} ${data.customer_last_name}`,
            cashier: `${data.cashier_first_name} ${data.cashier_last_name}`,
            paymentMethod: data.payment_method_code || "N/A",
            totalAmount: data.total_amount,
            details: data.details.map(detail => ({
              productName: detail.product_name,
              quantity: detail.quantity_sold,
              pricePerUnit: detail.price_per_unit,
              saleDetailID: detail.sale_detail_id
            }))
          };
          salesData.push(mappedSale);
          addSaleModal.style.display = "none";
          addSaleForm.reset();
          renderTable();
        })
        .catch(error => console.error('Error adding sale:', error));
    });
  }

  // Editing a Sale
  if (editSaleForm) {
    editSaleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editSaleIndex === null) return;
      const sale = salesData[editSaleIndex];
      // Update local sale object from form inputs.
      sale.customer = document.getElementById("editSaleCustomer").value.trim();
      sale.date = document.getElementById("editSaleDate").value;
      sale.cashier = document.getElementById("editSaleCashier").value.trim();
      sale.paymentMethod = document.getElementById("editSalePayment").value.trim();
      sale.totalAmount = parseFloat(document.getElementById("editSaleTotal").value);

      const updatedSalePayload = {
        customer_id: sale.customer_id,
        sale_date: sale.date,
        cashier: sale.cashier,
        payment_method: sale.paymentMethod,
        total_amount: sale.totalAmount
      };

      fetch(`http://localhost:3000/api/sales/${sale.saleID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSalePayload)
      })
        .then(response => response.json())
        .then(data => {
          salesData[editSaleIndex] = {
            saleID: data.sale_id,
            date: new Date(data.sale_date).toLocaleDateString(),
            customer: `${data.customer_first_name} ${data.customer_last_name}`,
            cashier: `${data.cashier_first_name} ${data.cashier_last_name}`,
            paymentMethod: data.payment_method_code || "N/A",
            totalAmount: data.total_amount,
            details: data.details.map(detail => ({
              productName: detail.product_name,
              quantity: detail.quantity_sold,
              pricePerUnit: detail.price_per_unit,
              saleDetailID: detail.sale_detail_id
            }))
          };
          editSaleModal.style.display = "none";
          editSaleForm.reset();
          editSaleIndex = null;
          renderTable();
        })
        .catch(error => console.error('Error updating sale:', error));
    });
  }

  // Editing a Sale Detail
  if (editSaleDetailForm) {
    editSaleDetailForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editSaleIndex === null || editSaleDetailIndex === null) return;
      const detail = salesData[editSaleIndex].details[editSaleDetailIndex];
      detail.productName = document.getElementById("editProductName").value.trim();
      detail.quantity = parseInt(document.getElementById("editQuantitySold").value, 10);
      detail.pricePerUnit = parseFloat(document.getElementById("editPricePerUnit").value);

      const updatedDetailPayload = {
        product_id: detail.product_id,
        quantity_sold: detail.quantity,
        price_per_unit: detail.pricePerUnit
      };

      fetch(`http://localhost:3000/api/sale-details/${detail.saleDetailID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedDetailPayload)
      })
        .then(response => response.json())
        .then(data => {
          salesData[editSaleIndex].details[editSaleDetailIndex] = {
            productName: data.product_name,
            quantity: data.quantity_sold,
            pricePerUnit: data.price_per_unit,
            saleDetailID: data.sale_detail_id
          };
          editSaleDetailModal.style.display = "none";
          editSaleDetailForm.reset();
          editSaleDetailIndex = null;
          renderTable();
        })
        .catch(error => console.error('Error updating sale detail:', error));
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
        <td>P${sale.totalAmount}</td>
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
            <td>P${detail.pricePerUnit}</td>
            <td>P${subtotal}</td>
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
          fetch(`http://localhost:3000/api/sales/${sale.saleID}`, {
            method: 'DELETE',
          })
            .then(() => {
              salesData.splice(startIndex + idx, 1);
              renderTable();
            })
            .catch(error => console.error('Error deleting sale:', error));
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
            const detail = salesData[startIndex + idx].details[dIdx];
            fetch(`http://localhost:3000/api/sale-details/${detail.saleDetailID}`, {
              method: 'DELETE',
            })
              .then(() => {
                salesData[startIndex + idx].details.splice(dIdx, 1);
                renderTable();
              })
              .catch(error => console.error('Error deleting sale detail:', error));
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
      return textToSearch && textToSearch.toLowerCase().includes(searchVal);
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

  // Initial render of the table
  renderTable();
}

// Expose the initialization function so it can be called externally
window.initSaleDetails = initSaleDetails;
  }
}

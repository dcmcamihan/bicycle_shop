// Define an initialization function for the payment types page
function initPaymentTypes() {
  let currentPage = 1;
  const rowsPerPage = 10;

  // Ensure your <tbody> in payment-types.html has id="paymentTbody"
  const paymentTbody = document.querySelector(".payment-types-table tbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");

  // Filter & Search elements
  const searchInput = document.getElementById("searchInput");

  // Modal elements for adding and editing payment types
  const paymentModal = document.getElementById("paymentModal");
  const btnAddPayment = document.getElementById("btnAddPayment");
  const closePaymentModal = document.getElementById("closePaymentModal");
  const paymentForm = document.getElementById("paymentForm");
  const paymentModalTitle = document.getElementById("paymentModalTitle");

  let editPaymentIndex = null;

  // Sample data (replace with actual data fetching logic)
  let paymentTypesData = [
    { id: "PT001", method: "Cash", description: "Payment in cash" },
    { id: "PT002", method: "Card", description: "Credit/Debit Card Payment" },
    { id: "PT003", method: "Online", description: "Payment via online gateway" },
  ];

  // --- Modal Event Listeners ---
  if (btnAddPayment) {
    btnAddPayment.addEventListener("click", () => {
      paymentModalTitle.textContent = "Add Payment Type";
      paymentForm.reset();
      editPaymentIndex = null;
      paymentModal.style.display = "block";
    });
  }
  if (closePaymentModal) {
    closePaymentModal.addEventListener("click", () => {
      paymentModal.style.display = "none";
    });
  }
  window.addEventListener("click", (e) => {
    if (e.target === paymentModal) {
      paymentModal.style.display = "none";
    }
  });

  // --- Form Submission Handler ---
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const method = document.getElementById("paymentMethod").value.trim();
      const description = document.getElementById("paymentDescription").value.trim();

      if (editPaymentIndex === null) {
        // Add new payment type
        const newPaymentType = {
          id: "PT" + String(paymentTypesData.length + 1).padStart(3, "0"),
          method,
          description,
        };
        paymentTypesData.push(newPaymentType);
      } else {
        // Edit existing payment type
        paymentTypesData[editPaymentIndex].method = method;
        paymentTypesData[editPaymentIndex].description = description;
      }

      paymentModal.style.display = "none";
      paymentForm.reset();
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

  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
  });

  // --- Render the Payment Types Table ---
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

    paymentTbody.innerHTML = "";

    pageData.forEach((payment, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${payment.id}</td>
        <td>${payment.method}</td>
        <td>${payment.description}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-payment"></i>
          <i class="fa-solid fa-trash delete-payment"></i>
        </td>
      `;

      paymentTbody.appendChild(row);

      // Attach edit functionality
      const editIcon = row.querySelector(".edit-payment");
      editIcon.addEventListener("click", () => {
        openEditModal(payment, startIndex + idx);
      });

      // Attach delete functionality
      const deleteIcon = row.querySelector(".delete-payment");
      deleteIcon.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this payment type?")) {
          paymentTypesData.splice(startIndex + idx, 1);
          renderTable();
        }
      });
    });
  }

  // --- Filter & Search Function ---
  function filterSearchData() {
    const searchVal = searchInput.value.toLowerCase().trim();
    return paymentTypesData.filter(payment => {
      const textToSearch = payment.id + payment.method + payment.description;
      return textToSearch.toLowerCase().includes(searchVal);
    });
  }

  // --- Modal Functions ---
  function openEditModal(payment, rowIndex) {
    editPaymentIndex = rowIndex;
    paymentModalTitle.textContent = "Edit Payment Type";
    document.getElementById("paymentMethod").value = payment.method;
    document.getElementById("paymentDescription").value = payment.description;
    paymentModal.style.display = "block";
  }

  // Initial render
  renderTable();
}

// Expose the initialization function so it can be called externally
window.initPaymentTypes = initPaymentTypes;
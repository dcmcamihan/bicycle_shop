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

  // Replace static data with an empty array
  let paymentTypesData = [];

  // Fetch payment types data from the API
  function fetchPaymentTypes() {
    fetch("http://127.0.0.1:3000/api/payment-methods") // Replace with your API endpoint
      .then((response) => response.json())
      .then((data) => {
        paymentTypesData = data.map((payment) => ({
          method: payment.payment_method_code, // Use the code as the method name
          description: payment.description,
        }));
        renderTable();
      })
      .catch((error) => console.error("Error fetching payment types:", error));
  }

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
          payment_method_code: method,
          description,
        };

        // Send POST request to create a new payment method
        fetch("http://127.0.0.1:3000/api/payment-methods", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPaymentType),
        })
          .then((response) => response.json())
          .then((data) => {
            paymentTypesData.push({
              method: data.payment_method_code,
              description: data.description,
            });
            paymentModal.style.display = "none";
            paymentForm.reset();
            renderTable();
          })
          .catch((error) => console.error("Error adding payment type:", error));
      } else {
        // Edit existing payment type
        const updatedPaymentType = {
          payment_method_code: paymentTypesData[editPaymentIndex].method,
          description,
        };

        // Send PUT request to update the payment method
        console.log(JSON.stringify(updatedPaymentType));
        fetch(`http://127.0.0.1:3000/api/payment-methods/${paymentTypesData[editPaymentIndex].method}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPaymentType),
        })
          .then((response) => response.json())
          .then((data) => {
            paymentTypesData[editPaymentIndex].payment_method_code = method;
            paymentTypesData[editPaymentIndex].description = description;
            paymentModal.style.display = "none";
            paymentForm.reset();
            renderTable();
          })
          .catch((error) => console.error("Error updating payment type:", error));
      }
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
          fetch(`http://127.0.0.1:3000/api/payment-methods/${payment.method}`, {
            method: "DELETE",
          })
            .then(() => {
              paymentTypesData.splice(startIndex + idx, 1);
              renderTable();
            })
            .catch((error) => console.error("Error deleting payment type:", error));
        }
      });
    });
  }

  // --- Filter & Search Function ---
  function filterSearchData() {
    const searchVal = searchInput.value.toLowerCase().trim();
    return paymentTypesData.filter((payment) => {
      const textToSearch = payment.method + payment.description;
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

  // Initial fetch of payment types data
  fetchPaymentTypes();
}

// Expose the initialization function so it can be called externally
window.initPaymentTypes = initPaymentTypes;
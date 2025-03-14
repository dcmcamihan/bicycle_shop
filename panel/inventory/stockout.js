// Define an initialization function for the stockouts page
function initStockouts() {
  let currentPage = 1;
  const rowsPerPage = 10;

  // Ensure your <tbody> in stockout.html has the correct class or ID
  const stockoutTbody = document.querySelector(".collapsible-table tbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");

  // Filter & Search elements
  const filterCriteria = document.getElementById("filterCriteria");
  const searchInput = document.getElementById("searchInput");

  // Modal elements for adding and editing stockouts
  const addStockoutModal = document.getElementById("addStockoutModal");
  const btnAddStockoutTop = document.getElementById("btnAddStockoutTop");
  const btnAddStockoutBottom = document.getElementById("btnAddStockoutBottom");
  const closeAddStockoutModal = document.getElementById("closeAddStockoutModal");
  const addStockoutForm = document.getElementById("addStockoutForm");

  const editStockoutModal = document.getElementById("editStockoutModal");
  const closeEditStockoutModal = document.getElementById("closeEditStockoutModal");
  const editStockoutForm = document.getElementById("editStockoutForm");
  let editStockoutIndex = null;

  // Sample data (replace with actual data fetching logic)
  let stockoutsData = [
    {
      id: "SO001",
      date: "2025-04-01",
      product: "Brake Pads",
      brand: "Shimano",
      quantity: 10,
      reason: "Damaged",
      details: "Reorder recommended. Stock level below threshold.",
    },
    {
      id: "SO002",
      date: "2025-04-03",
      product: "Mountain Bike",
      brand: "Giant",
      quantity: 5,
      reason: "Sold Out",
      details: "High demand led to rapid depletion. Reorder immediately.",
    },
    {
      id: "SO003",
      date: "2025-04-05",
      product: "Helmet",
      brand: "Giro",
      quantity: 15,
      reason: "Expired",
      details: "Items expired. Removed from inventory.",
    },
  ];

  // --- Modal Event Listeners ---
  if (btnAddStockoutTop) {
    btnAddStockoutTop.addEventListener("click", () => {
      addStockoutModal.style.display = "block";
    });
  }
  if (btnAddStockoutBottom) {
    btnAddStockoutBottom.addEventListener("click", () => {
      addStockoutModal.style.display = "block";
    });
  }
  if (closeAddStockoutModal) {
    closeAddStockoutModal.addEventListener("click", () => {
      addStockoutModal.style.display = "none";
    });
  }
  window.addEventListener("click", (e) => {
    if (e.target === addStockoutModal) {
      addStockoutModal.style.display = "none";
    }
  });

  if (closeEditStockoutModal) {
    closeEditStockoutModal.addEventListener("click", () => {
      editStockoutModal.style.display = "none";
    });
  }
  window.addEventListener("click", (e) => {
    if (e.target === editStockoutModal) {
      editStockoutModal.style.display = "none";
    }
  });

  // --- Form Submission Handlers ---
  if (addStockoutForm) {
    addStockoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const product = document.getElementById("stockoutProduct").value.trim();
      const brand = document.getElementById("stockoutBrand").value.trim();
      const date = document.getElementById("stockoutDate").value;
      const quantity = parseInt(document.getElementById("stockoutQuantity").value, 10);
      const reason = document.getElementById("stockoutReason").value.trim();

      const newStockout = {
        id: "SO" + String(stockoutsData.length + 1).padStart(3, "0"),
        date,
        product,
        brand,
        quantity,
        reason,
        details: "No additional details provided.",
      };
      stockoutsData.push(newStockout);
      addStockoutModal.style.display = "none";
      addStockoutForm.reset();
      renderTable();
    });
  }

  if (editStockoutForm) {
    editStockoutForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editStockoutIndex === null) return;
      stockoutsData[editStockoutIndex].product = document.getElementById("editStockoutProduct").value.trim();
      stockoutsData[editStockoutIndex].brand = document.getElementById("editStockoutBrand").value.trim();
      stockoutsData[editStockoutIndex].date = document.getElementById("editStockoutDate").value;
      stockoutsData[editStockoutIndex].quantity = parseInt(document.getElementById("editStockoutQuantity").value, 10);
      stockoutsData[editStockoutIndex].reason = document.getElementById("editStockoutReason").value.trim();
      editStockoutModal.style.display = "none";
      editStockoutForm.reset();
      editStockoutIndex = null;
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

  // --- Render the Stockouts Table ---
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

    stockoutTbody.innerHTML = "";

    pageData.forEach((stockout, idx) => {
      const parentRow = document.createElement("tr");
      parentRow.classList.add("parent-row");
      parentRow.innerHTML = `
        <td class="toggle-cell">
          <i class="fa-solid fa-chevron-right toggle-btn"></i>
        </td>
        <td>${stockout.id}</td>
        <td>${stockout.date}</td>
        <td>${stockout.product}</td>
        <td>${stockout.brand}</td>
        <td>${stockout.quantity}</td>
        <td>${stockout.reason}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-stockout"></i>
          <i class="fa-solid fa-trash delete-stockout"></i>
        </td>
      `;

      const childRow = document.createElement("tr");
      childRow.classList.add("child-row");
      childRow.innerHTML = `
        <td colspan="8">
          <div class="child-content">
            <h3>Details</h3>
            <p>${stockout.details}</p>
          </div>
        </td>
      `;

      stockoutTbody.appendChild(parentRow);
      stockoutTbody.appendChild(childRow);

      // Toggle Child Row
      const toggleBtn = parentRow.querySelector(".toggle-btn");
      toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("rotated");
        childRow.style.display = (childRow.style.display === "table-row") ? "none" : "table-row";
      });

      // Edit Stockout
      const editStockoutIcon = parentRow.querySelector(".edit-stockout");
      editStockoutIcon.addEventListener("click", () => {
        openEditModal(stockout, startIndex + idx);
      });

      // Delete Stockout
      const deleteStockoutIcon = parentRow.querySelector(".delete-stockout");
      deleteStockoutIcon.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this stockout?")) {
          stockoutsData.splice(startIndex + idx, 1);
          renderTable();
        }
      });
    });
  }

  // --- Filter & Search Function ---
  function filterSearchData() {
    const criteria = filterCriteria.value;
    const searchVal = searchInput.value.toLowerCase().trim();
    return stockoutsData.filter(stockout => {
      let textToSearch = "";
      switch (criteria) {
        case "all":
          textToSearch = stockout.id + stockout.date + stockout.product + stockout.brand + stockout.reason;
          break;
        case "product":
          textToSearch = stockout.product;
          break;
        case "brand":
          textToSearch = stockout.brand;
          break;
        case "date":
          textToSearch = stockout.date;
          break;
        case "reason":
          textToSearch = stockout.reason;
          break;
        default:
          textToSearch = stockout.id + stockout.date + stockout.product + stockout.brand + stockout.reason;
      }
      return textToSearch.toLowerCase().includes(searchVal);
    });
  }

  // --- Modal Functions ---
  function openEditModal(stockout, rowIndex) {
    editStockoutIndex = rowIndex;
    document.getElementById("editStockoutID").value = stockout.id;
    document.getElementById("editStockoutProduct").value = stockout.product;
    document.getElementById("editStockoutBrand").value = stockout.brand;
    document.getElementById("editStockoutDate").value = stockout.date;
    document.getElementById("editStockoutQuantity").value = stockout.quantity;
    document.getElementById("editStockoutReason").value = stockout.reason;
    editStockoutModal.style.display = "block";
  }

  // Initial render
  renderTable();
}

// Expose the initialization function so it can be called externally
window.initStockouts = initStockouts;
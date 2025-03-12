function initSupplierList() {
  // DOM Elements
  const searchInput = document.getElementById("searchInput");
  const filterCriteria = document.getElementById("filterCriteria");
  const supplierTbody = document.getElementById("supplierTbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const btnAddSupplier = document.getElementById("btnAddSupplier");
  const btnAddSupplierBottom = document.getElementById("btnAddSupplierBottom");
  const addSupplierModal = document.getElementById("addSupplierModal");
  const closeAddSupplierModal = document.getElementById("closeAddSupplierModal");
  const addSupplierForm = document.getElementById("addSupplierForm");
  const editSupplierModal = document.getElementById("editSupplierModal");
  const closeEditSupplierModal = document.getElementById("closeEditSupplierModal");
  const editSupplierForm = document.getElementById("editSupplierForm");

  // Pagination variables
  let currentPage = 1;
  const rowsPerPage = 10;

  // Render supplier table
  function renderTable() {
    const filteredData = filterSearchData();
    const totalRows = filteredData.length;
    const maxPage = Math.ceil(totalRows / rowsPerPage) || 1;
    if (currentPage > maxPage) currentPage = maxPage;
    pageNumberSpan.textContent = currentPage;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= maxPage;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const pageData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    supplierTbody.innerHTML = "";
    pageData.forEach((supplier, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${supplier.supplier_id}</td>
        <td>${supplier.supplier_name}</td>
        <td>${supplier.city}</td>
        <td>${supplier.primary_contact}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-supplier"></i>
          <i class="fa-solid fa-trash delete-supplier"></i>
        </td>
      `;
      // Attach edit event
      row.querySelector(".edit-supplier").addEventListener("click", () => {
        openEditModal(supplier, startIndex + idx);
      });
      // Attach delete event
      row.querySelector(".delete-supplier").addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this supplier?")) {
          supplierData.splice(startIndex + idx, 1);
          renderTable();
        }
      });
      supplierTbody.appendChild(row);
    });
  }

  // Filter and search function
  function filterSearchData() {
    const criteria = filterCriteria.value;
    const searchVal = searchInput.value.toLowerCase().trim();
    return supplierData.filter(supplier => {
      let textToSearch = "";
      switch (criteria) {
        case "all":
          textToSearch = `${supplier.supplier_id} ${supplier.supplier_name} ${supplier.city} ${supplier.primary_contact}`;
          break;
        case "name":
          textToSearch = supplier.supplier_name;
          break;
        case "city":
          textToSearch = supplier.city;
          break;
        case "contact":
          textToSearch = supplier.primary_contact;
          break;
        default:
          textToSearch = `${supplier.supplier_id} ${supplier.supplier_name}`;
      }
      return textToSearch.toLowerCase().includes(searchVal);
    });
  }

  // Modal handling for adding supplier
  btnAddSupplier.addEventListener("click", () => {
    addSupplierModal.style.display = "block";
  });
  closeAddSupplierModal.addEventListener("click", () => {
    addSupplierModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === addSupplierModal) {
      addSupplierModal.style.display = "none";
    }
  });

  addSupplierForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const supplierName = document.getElementById("supplierName").value.trim();
    const supplierCity = document.getElementById("supplierCity").value.trim();
    const supplierContact = document.getElementById("supplierContact").value.trim();
    const newID = supplierData.length ? Math.max(...supplierData.map(s => s.supplier_id)) + 1 : 1;
    const newSupplier = {
      supplier_id: newID,
      supplier_name: supplierName,
      city: supplierCity,
      primary_contact: supplierContact
    };
    supplierData.push(newSupplier);
    renderTable();
    addSupplierForm.reset();
    addSupplierModal.style.display = "none";
  });

  // Modal handling for editing supplier
  function openEditModal(supplier, index) {
    document.getElementById("editSupplierIndex").value = index;
    document.getElementById("editSupplierID").value = supplier.supplier_id;
    document.getElementById("editSupplierName").value = supplier.supplier_name;
    document.getElementById("editSupplierCity").value = supplier.city;
    document.getElementById("editSupplierContact").value = supplier.primary_contact;
    editSupplierModal.style.display = "block";
  }
  closeEditSupplierModal.addEventListener("click", () => {
    editSupplierModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === editSupplierModal) {
      editSupplierModal.style.display = "none";
    }
  });
  editSupplierForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const index = document.getElementById("editSupplierIndex").value;
    supplierData[index].supplier_name = document.getElementById("editSupplierName").value.trim();
    supplierData[index].city = document.getElementById("editSupplierCity").value.trim();
    supplierData[index].primary_contact = document.getElementById("editSupplierContact").value.trim();
    renderTable();
    editSupplierForm.reset();
    editSupplierModal.style.display = "none";
  });

  // Pagination controls
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderTable();
    }
  });
  nextPageBtn.addEventListener("click", () => {
    const totalRows = filterSearchData().length;
    const maxPage = Math.ceil(totalRows / rowsPerPage);
    if (currentPage < maxPage) {
      currentPage++;
      renderTable();
    }
  });

  // Attach search & filter events
  searchInput.addEventListener("input", () => {
    currentPage = 1;
    renderTable();
  });
  filterCriteria.addEventListener("change", () => {
    currentPage = 1;
    renderTable();
  });

  // Initial render
  renderTable();
}

window.initSupplierList = initSupplierList;

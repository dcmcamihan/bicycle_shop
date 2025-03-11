function initSupplierContact() {
  // DOM Elements
  const searchInput = document.getElementById("searchInput");
  const filterCriteria = document.getElementById("filterCriteria");
  const supplierContactTbody = document.getElementById("supplierContactTbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const btnAddSupplierContact = document.getElementById("btnAddSupplierContact");
  const btnAddSupplierContactBottom = document.getElementById("btnAddSupplierContactBottom");
  const addSupplierContactModal = document.getElementById("addSupplierContactModal");
  const closeAddSupplierContactModal = document.getElementById("closeAddSupplierContactModal");
  const addSupplierContactForm = document.getElementById("addSupplierContactForm");
  const editSupplierContactModal = document.getElementById("editSupplierContactModal");
  const closeEditSupplierContactModal = document.getElementById("closeEditSupplierContactModal");
  const editSupplierContactForm = document.getElementById("editSupplierContactForm");

  // Pagination variables
  let currentPage = 1;
  const rowsPerPage = 10;

  // Render table function
  function renderTable() {
    const filteredData = filterSearchData();
    const totalRows = filteredData.length;
    const maxPage = Math.ceil(totalRows / rowsPerPage);
    if (currentPage > maxPage && maxPage !== 0) currentPage = maxPage;
    pageNumberSpan.textContent = currentPage;
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= maxPage;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const pageData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    supplierContactTbody.innerHTML = "";
    pageData.forEach((record, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${record.supplier_contact_id}</td>
        <td>${record.supplier_name}</td>
        <td>${record.contact_type}</td>
        <td>${record.contact_value}</td>
        <td>${record.is_primary === "Y" ? "Yes" : "No"}</td>
        <td>${record.is_active === "Y" ? "Yes" : "No"}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-contact"></i>
          <i class="fa-solid fa-trash delete-contact"></i>
        </td>
      `;
      // Edit event
      row.querySelector(".edit-contact").addEventListener("click", () => {
        openEditModal(record, startIndex + idx);
      });
      // Delete event
      row.querySelector(".delete-contact").addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this contact?")) {
          supplierContactData.splice(startIndex + idx, 1);
          renderTable();
        }
      });
      supplierContactTbody.appendChild(row);
    });
  }

  // Filter & search function
  function filterSearchData() {
    const criteria = filterCriteria.value;
    const searchVal = searchInput.value.toLowerCase().trim();
    return supplierContactData.filter((record) => {
      let textToSearch = "";
      switch (criteria) {
        case "all":
          textToSearch = `${record.supplier_contact_id} ${record.supplier_name} ${record.contact_type} ${record.contact_value}`;
          break;
        case "supplier":
          textToSearch = record.supplier_name;
          break;
        case "type":
          textToSearch = record.contact_type;
          break;
        case "value":
          textToSearch = record.contact_value;
          break;
        default:
          textToSearch = `${record.supplier_contact_id} ${record.supplier_name}`;
      }
      return textToSearch.toLowerCase().includes(searchVal);
    });
  }

  // Modal handling for Add Supplier Contact
  btnAddSupplierContact.addEventListener("click", () => {
    addSupplierContactModal.style.display = "block";
  });
  closeAddSupplierContactModal.addEventListener("click", () => {
    addSupplierContactModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === addSupplierContactModal) {
      addSupplierContactModal.style.display = "none";
    }
  });

  addSupplierContactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const supplierName = document.getElementById("contactSupplier").value.trim();
    const contactType = document.getElementById("contactType").value.trim();
    const contactValue = document.getElementById("contactValue").value.trim();
    const isPrimary = document.getElementById("isPrimary").value;
    const isActive = document.getElementById("isActive").value;
    const newID = supplierContactData.length ? Math.max(...supplierContactData.map((r) => r.supplier_contact_id)) + 1 : 1;
    const newRecord = {
      supplier_contact_id: newID,
      supplier_name: supplierName,
      contact_type: contactType,
      contact_value: contactValue,
      is_primary: isPrimary,
      is_active: isActive,
    };
    supplierContactData.push(newRecord);
    renderTable();
    addSupplierContactForm.reset();
    addSupplierContactModal.style.display = "none";
  });

  // Modal handling for Edit Supplier Contact
  function openEditModal(record, index) {
    document.getElementById("editSupplierContactIndex").value = index;
    document.getElementById("editContactID").value = record.supplier_contact_id;
    document.getElementById("editContactSupplier").value = record.supplier_name;
    document.getElementById("editContactType").value = record.contact_type;
    document.getElementById("editContactValue").value = record.contact_value;
    document.getElementById("editIsPrimary").value = record.is_primary;
    document.getElementById("editIsActive").value = record.is_active;
    editSupplierContactModal.style.display = "block";
  }
  closeEditSupplierContactModal.addEventListener("click", () => {
    editSupplierContactModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === editSupplierContactModal) {
      editSupplierContactModal.style.display = "none";
    }
  });
  editSupplierContactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const index = document.getElementById("editSupplierContactIndex").value;
    supplierContactData[index].supplier_name = document.getElementById("editContactSupplier").value.trim();
    supplierContactData[index].contact_type = document.getElementById("editContactType").value.trim();
    supplierContactData[index].contact_value = document.getElementById("editContactValue").value.trim();
    supplierContactData[index].is_primary = document.getElementById("editIsPrimary").value;
    supplierContactData[index].is_active = document.getElementById("editIsActive").value;
    renderTable();
    editSupplierContactForm.reset();
    editSupplierContactModal.style.display = "none";
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

  // Search and Filter events
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

// Expose the initialization function so it can be called externally
window.initSupplierContact = initSupplierContact;
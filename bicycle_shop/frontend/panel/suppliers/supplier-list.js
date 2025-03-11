function initSupplierList() {
  // DOM Elements
  const searchInput = document.getElementById("searchInput");
  const filterCriteria = document.getElementById("filterCriteria");
  const supplierTbody = document.getElementById("supplierTbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const btnAddSupplier = document.getElementById("btnAddSupplier");
  const addSupplierModal = document.getElementById("addSupplierModal");
  const closeAddSupplierModal = document.getElementById("closeAddSupplierModal");
  const addSupplierForm = document.getElementById("addSupplierForm");
  const editSupplierModal = document.getElementById("editSupplierModal");
  const closeEditSupplierModal = document.getElementById("closeEditSupplierModal");
  const editSupplierForm = document.getElementById("editSupplierForm");

  // Pagination variables
  let currentPage = 1;
  const rowsPerPage = 10;
  
  // Global array for supplier data loaded from API
  let supplierData = [];

  // Helper: Load suppliers from API and process contacts to extract primary contact info
  function loadSuppliers() {
    fetch('http://127.0.0.1:3000/api/suppliers')
      .then(response => response.json())
      .then(data => {
        supplierData = data.map(supplier => {
          let primary_contact = "N/A";
          if (supplier.contacts && supplier.contacts.length > 0) {
            // Look for the contact marked as primary
            const primary = supplier.contacts.find(contact => contact.is_primary);
            if (primary) {
              primary_contact = `${primary.contact_type_desc}: ${primary.contact}`;
            } else {
              // Fallback: use the first contact available
              primary_contact = `${supplier.contacts[0].contact_type_desc}: ${supplier.contacts[0].contact}`;
            }
          }
          return { ...supplier, primary_contact };
        });
        renderTable();
      })
      .catch(error => console.error("Error fetching suppliers:", error));
  }

  // Render supplier table (with pagination)
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
      // Attach edit event listener
      row.querySelector(".edit-supplier").addEventListener("click", () => {
        openEditModal(supplier, startIndex + idx);
      });
      // Attach delete event listener
      row.querySelector(".delete-supplier").addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this supplier?")) {
          supplierData.splice(startIndex + idx, 1);
          renderTable();
        }
      });
      supplierTbody.appendChild(row);
    });
  }

  // Filter and search function based on selected criteria
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
    const supplierContactInput = document.getElementById("supplierContact").value.trim();
    // For simplicity, assume new supplier contact is primary and default its type to "Mobile"
    const primary_contact = `Mobile: ${supplierContactInput}`;
    const newID = supplierData.length ? Math.max(...supplierData.map(s => s.supplier_id)) + 1 : 1;
    const newSupplier = {
      supplier_id: newID,
      supplier_name: supplierName,
      city: supplierCity,
      primary_contact: primary_contact,
      contacts: [{ contact: supplierContactInput, is_primary: true, contact_type_desc: "Mobile" }]
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
    // Assume primary_contact is in format "Type: value"
    document.getElementById("editSupplierContact").value = supplier.primary_contact.split(": ")[1] || "";
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
    const updatedContact = document.getElementById("editSupplierContact").value.trim();
    // Update primary_contact field and the contacts array (defaulting to Mobile)
    supplierData[index].primary_contact = `Mobile: ${updatedContact}`;
    if (supplierData[index].contacts && supplierData[index].contacts.length > 0) {
      supplierData[index].contacts = supplierData[index].contacts.map(contact => {
        if (contact.is_primary) {
          return { ...contact, contact: updatedContact };
        }
        return contact;
      });
    }
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

  // NEW: Load suppliers from the API on initial load
  loadSuppliers();
}

window.initSupplierList = initSupplierList;

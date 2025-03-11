function initCustomerContact() {
  // DOM elements
  const searchInput = document.getElementById("searchInput");
  const filterCriteria = document.getElementById("filterCriteria");
  const contactTbody = document.getElementById("contactTbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const btnAddContact = document.getElementById("btnAddContact");
  const btnAddContactBottom = document.getElementById("btnAddContactBottom");
  const addContactModal = document.getElementById("addContactModal");
  const closeAddContactModal = document.getElementById("closeAddContactModal");
  const addContactForm = document.getElementById("addContactForm");
  const editContactModal = document.getElementById("editContactModal");
  const closeEditContactModal = document.getElementById("closeEditContactModal");
  const editContactForm = document.getElementById("editContactForm");

  // Pagination variables
  let currentPage = 1;
  const rowsPerPage = 10;

  // Render the contact table
  function renderTable() {
    const filteredData = filterSearchData();
    const totalRows = filteredData.length;
    const maxPage = Math.ceil(totalRows / rowsPerPage) || 1;
    if (currentPage > maxPage) currentPage = maxPage;
    pageNumberSpan.textContent = currentPage.toString();
    prevPageBtn.disabled = currentPage <= 1;
    nextPageBtn.disabled = currentPage >= maxPage;

    const startIndex = (currentPage - 1) * rowsPerPage;
    const pageData = filteredData.slice(startIndex, startIndex + rowsPerPage);

    contactTbody.innerHTML = "";
    pageData.forEach((contact, idx) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${contact.contact_id}</td>
        <td>${contact.customer_id}</td>
        <td>${contact.contact_type}</td>
        <td>${contact.contact_value}</td>
        <td>${contact.is_primary === "Y" ? "Yes" : "No"}</td>
        <td>${contact.is_active === "Y" ? "Yes" : "No"}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-contact"></i>
          <i class="fa-solid fa-trash delete-contact"></i>
        </td>
      `;
      // Attach edit functionality
      const editIcon = row.querySelector(".edit-contact");
      editIcon.addEventListener("click", () => {
        openEditModal(contact, startIndex + idx);
      });
      // Attach delete functionality
      const deleteIcon = row.querySelector(".delete-contact");
      deleteIcon.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this contact?")) {
          contactData.splice(startIndex + idx, 1);
          renderTable();
        }
      });
      contactTbody.appendChild(row);
    });
  }

  // Filtering function
  function filterSearchData() {
    const criteria = filterCriteria.value;
    const searchVal = searchInput.value.toLowerCase().trim();
    return contactData.filter(contact => {
      let textToSearch = "";
      switch (criteria) {
        case "all":
          textToSearch = `${contact.contact_id} ${contact.customer_id} ${contact.contact_type} ${contact.contact_value} ${contact.is_primary} ${contact.is_active}`;
          break;
        case "customer":
          textToSearch = contact.customer_id;
          break;
        case "type":
          textToSearch = contact.contact_type;
          break;
        case "value":
          textToSearch = contact.contact_value;
          break;
        default:
          textToSearch = `${contact.contact_id} ${contact.customer_id} ${contact.contact_type} ${contact.contact_value}`;
      }
      return textToSearch.toString().toLowerCase().includes(searchVal);
    });
  }

  // Modal handling for Add Contact
  btnAddContact.addEventListener("click", () => {
    addContactModal.style.display = "block";
  });
  closeAddContactModal.addEventListener("click", () => {
    addContactModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === addContactModal) {
      addContactModal.style.display = "none";
    }
  });

  // Add Contact Form submission
  addContactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const customer_id = document.getElementById("contactCustomerID").value.trim();
    const contact_type = document.getElementById("contactType").value;
    const contact_value = document.getElementById("contactValue").value.trim();
    const is_primary = document.getElementById("isPrimary").value;
    const is_active = document.getElementById("isActive").value;
    // Auto-generate new contact ID
    const newID = contactData.length ? Math.max(...contactData.map(c => c.contact_id)) + 1 : 201;
    const newContact = {
      contact_id: newID,
      customer_id,
      contact_type,
      contact_value,
      is_primary,
      is_active
    };
    contactData.push(newContact);
    renderTable();
    addContactForm.reset();
    addContactModal.style.display = "none";
  });

  // Modal handling for Edit Contact
  function openEditModal(contact, index) {
    document.getElementById("editContactIndex").value = index;
    document.getElementById("editContactCustomerID").value = contact.customer_id;
    document.getElementById("editContactType").value = contact.contact_type;
    document.getElementById("editContactValue").value = contact.contact_value;
    document.getElementById("editIsPrimary").value = contact.is_primary;
    document.getElementById("editIsActive").value = contact.is_active;
    editContactModal.style.display = "block";
  }
  closeEditContactModal.addEventListener("click", () => {
    editContactModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === editContactModal) {
      editContactModal.style.display = "none";
    }
  });
  editContactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const index = document.getElementById("editContactIndex").value;
    contactData[index].customer_id = document.getElementById("editContactCustomerID").value.trim();
    contactData[index].contact_type = document.getElementById("editContactType").value;
    contactData[index].contact_value = document.getElementById("editContactValue").value.trim();
    contactData[index].is_primary = document.getElementById("editIsPrimary").value;
    contactData[index].is_active = document.getElementById("editIsActive").value;
    renderTable();
    editContactForm.reset();
    editContactModal.style.display = "none";
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

window.initCustomerContact = initCustomerContact;

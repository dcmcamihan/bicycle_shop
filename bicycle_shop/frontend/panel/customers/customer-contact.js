function initCustomerContact() {
  // DOM elements
  const searchInput = document.getElementById("searchInput");
  const filterCriteria = document.getElementById("filterCriteria");
  const contactTbody = document.getElementById("contactTbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const btnAddContact = document.getElementById("btnAddContact");
  const addContactModal = document.getElementById("addContactModal");
  const closeAddContactModal = document.getElementById("closeAddContactModal");
  const addContactForm = document.getElementById("addContactForm");
  const editContactModal = document.getElementById("editContactModal");
  const closeEditContactModal = document.getElementById("closeEditContactModal");
  const editContactForm = document.getElementById("editContactForm");

  // Pagination variables
  let currentPage = 1;
  const rowsPerPage = 10;

  // Local data storage
  let contactData = [];

  // Fetch customer contacts data from the API
  function fetchCustomerContacts() {
    fetch('http://localhost:3000/api/customer-contacts')
      .then(response => response.json())
      .then(data => {
        contactData = data;
        renderTable();
      })
      .catch(error => console.error('Error fetching customer contacts:', error));
  }

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
      const parentRow = document.createElement("tr");
      parentRow.classList.add("parent-row");
      parentRow.innerHTML = `
        <td class="toggle-cell">
          <i class="fa-solid fa-chevron-right toggle-btn"></i>
        </td>
        <td>${contact.customer_id}</td>
        <td>${contact.customer_name}</td>
        <td>${contact.contact_type}</td>
        <td>${contact.contact_value}</td>
        <td>${contact.is_primary === "Y" ? "Yes" : "No"}</td>
        <td>${contact.is_active === "Y" ? "Yes" : "No"}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-contact"></i>
          <i class="fa-solid fa-trash delete-contact"></i>
        </td>
      `;

      const childRow = document.createElement("tr");
      childRow.classList.add("child-row");
      childRow.innerHTML = `
        <td colspan="8">
          <h3 style="color: #ab0d07;">Other Contacts</h3>
          <table class="contact-detail-table">
            <thead>
              <tr>
                <th>Contact Type</th>
                <th>Contact Value</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              ${contactData
                .filter(c => c.customer_id === contact.customer_id && c.customer_contact_id !== contact.customer_contact_id)
                .map(c => `
                  <tr>
                    <td>${c.contact_type}</td>
                    <td>${c.contact_value}</td>
                    <td>${c.is_active === "Y" ? "Yes" : "No"}</td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
        </td>
      `;


      contactTbody.appendChild(parentRow);
      contactTbody.appendChild(childRow);

      // Toggle Child Row
      const toggleBtn = parentRow.querySelector(".toggle-btn");
      toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("rotated");
        childRow.style.display = (childRow.style.display === "table-row") ? "none" : "table-row";
      });

      // Attach edit functionality
      const editIcon = parentRow.querySelector(".edit-contact");
      editIcon.addEventListener("click", () => {
        openEditModal(contact, startIndex + idx);
      });

      // Attach delete functionality
      const deleteIcon = parentRow.querySelector(".delete-contact");
      deleteIcon.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this contact?")) {
          fetch(`http://localhost:3000/api/customer-contacts/${contact.customer_contact_id}`, {
            method: 'DELETE',
          })
            .then(() => {
              contactData.splice(startIndex + idx, 1);
              renderTable();
            })
            .catch(error => console.error('Error deleting contact:', error));
        }
      });
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
          textToSearch = `${contact.customer_id} ${contact.customer_name} ${contact.contact_type} ${contact.contact_value} ${contact.is_primary} ${contact.is_active}`;
          break;
        case "customer":
          textToSearch = contact.customer_name;
          break;
        case "type":
          textToSearch = contact.contact_type;
          break;
        case "value":
          textToSearch = contact.contact_value;
          break;
        default:
          textToSearch = `${contact.customer_id} ${contact.customer_name} ${contact.contact_type} ${contact.contact_value}`;
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

    const newContact = {
      customer_id,
      contact_type_code: contact_type,
      contact_value,
      is_primary,
      is_active
    };

    fetch('http://localhost:3000/api/customer-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact)
    })
      .then(response => response.json())
      .then(data => {
        contactData.push(data);
        renderTable();
        addContactForm.reset();
        addContactModal.style.display = "none";
      })
      .catch(error => console.error('Error adding contact:', error));
  });

  // Modal handling for Edit Contact
  function openEditModal(contact, index) {
    document.getElementById("editContactIndex").value = index;
    document.getElementById("editContactCustomerID").value = contact.customer_id;
    document.getElementById("editContactType").value = contact.contact_type_code;
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
    const updatedContact = {
      customer_id: document.getElementById("editContactCustomerID").value.trim(),
      contact_type_code: document.getElementById("editContactType").value,
      contact_value: document.getElementById("editContactValue").value.trim(),
      is_primary: document.getElementById("editIsPrimary").value,
      is_active: document.getElementById("editIsActive").value
    };

    fetch(`http://localhost:3000/api/customer-contacts/${contactData[index].customer_contact_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedContact)
    })
      .then(response => response.json())
      .then(data => {
        contactData[index] = data;
        renderTable();
        editContactForm.reset();
        editContactModal.style.display = "none";
      })
      .catch(error => console.error('Error updating contact:', error));
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

  // Initial fetch and render
  fetchCustomerContacts();
}

window.initCustomerContact = initCustomerContact;
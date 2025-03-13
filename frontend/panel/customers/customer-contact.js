function initCustomerContact() {
  // DOM elements
  const searchInput = document.getElementById("searchInput");
  const filterCriteria = document.getElementById("filterCriteria");
  const contactTbody = document.getElementById("contactTbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const addContactModal = document.getElementById("addContactModal");
  const closeAddContactModal = document.getElementById("closeAddContactModal");
  const addContactForm = document.getElementById("addContactForm");
  const editContactModal = document.getElementById("editContactModal");
  const closeEditContactModal = document.getElementById("closeEditContactModal");
  const editContactForm = document.getElementById("editContactForm");
  const contactTypeSelect = document.getElementById("contactType");
  const editContactTypeSelect = document.getElementById("editContactType");

  // Pagination variables
  let currentPage = 1;
  const rowsPerPage = 10;

  // Local data storage
  let contactData = [];
  let customers = [];
  let contactTypes = {};

  // Fetch data from APIs
  async function fetchData() {
    try {
      const [customerRes, contactRes, typeRes] = await Promise.all([
        fetch('http://127.0.0.1:3000/api/customers'),
        fetch('http://127.0.0.1:3000/api/customer-contacts'),
        fetch('http://127.0.0.1:3000/api/contact-types')
      ]);

      customers = await customerRes.json();
      contactData = await contactRes.json();
      const types = await typeRes.json();
      contactTypes = types.reduce((map, type) => {
        map[type.contact_type_code] = type.description;
        return map;
      }, {});

      populateContactTypeDropdowns(types);
      renderTable();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Populate contact type dropdowns
  function populateContactTypeDropdowns(types) {
    contactTypeSelect.innerHTML = types.map(type => `<option value="${type.contact_type_code}">${type.description}</option>`).join('');
    editContactTypeSelect.innerHTML = types.map(type => `<option value="${type.contact_type_code}">${type.description}</option>`).join('');
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
    pageData.forEach((customer, idx) => {
      const parentRow = document.createElement("tr");
      parentRow.classList.add("parent-row");
      parentRow.innerHTML = `
        <td class="toggle-cell">
          <i class="fa-solid fa-chevron-right toggle-btn"></i>
        </td>
        <td>${customer.customer_id}</td>
        <td>${customer.first_name} ${customer.middle_name} ${customer.last_name}</td>
        <td>${customer.gender === 'F' ? 'Female' : 'Male'}</td>
      `;

      const childRow = document.createElement("tr");
      childRow.classList.add("child-row");
      childRow.innerHTML = `
        <td colspan="4">
          <h3 style="color: #ab0d07;">Contacts</h3>
          <table class="contact-detail-table">
            <thead>
              <tr>
                <th>Contact Type</th>
                <th>Contact Value</th>
                <th>Primary</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${contactData
                .filter(c => c.customer_id === customer.customer_id)
                .map(c => `
                  <tr>
                    <td>${contactTypes[c.contact_type_code] || c.contact_type_code}</td>
                    <td>${c.contact_value}</td>
                    <td>${c.is_primary === "Y" ? "Yes" : "No"}</td>
                    <td>${c.is_active === "Y" ? "Yes" : "No"}</td>
                    <td>
                      <i class="fa-solid fa-pen-to-square edit-contact" data-id="${c.customer_contact_id}"></i>
                      <i class="fa-solid fa-trash delete-contact" data-id="${c.customer_contact_id}"></i>
                    </td>
                  </tr>
                `).join('')}
            </tbody>
          </table>
          <button class="btn-add-contact" data-customer-id="${customer.customer_id}">Add Contact</button>
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
      const editIcons = childRow.querySelectorAll(".edit-contact");
      editIcons.forEach(icon => {
        icon.addEventListener("click", () => {
          const contactId = icon.getAttribute("data-id");
          const contact = contactData.find(c => c.customer_contact_id == contactId);
          openEditModal(contact);
        });
      });

      // Attach delete functionality
      const deleteIcons = childRow.querySelectorAll(".delete-contact");
      deleteIcons.forEach(icon => {
        icon.addEventListener("click", () => {
          const contactId = icon.getAttribute("data-id");
          if (confirm("Are you sure you want to delete this contact?")) {
            fetch(`http://127.0.0.1:3000/api/customer-contacts/${contactId}`, {
              method: 'DELETE',
            })
              .then(() => {
                contactData = contactData.filter(c => c.customer_contact_id != contactId);
                renderTable();
              })
              .catch(error => console.error('Error deleting contact:', error));
          }
        });
      });

      // Attach add contact functionality
      const addContactBtn = childRow.querySelector(".btn-add-contact");
      addContactBtn.addEventListener("click", () => {
        const customerId = addContactBtn.getAttribute("data-customer-id");
        document.getElementById("contactCustomerID").value = customerId;
        addContactModal.style.display = "block";
      });
    });
  }

  // Filtering function
  function filterSearchData() {
    const criteria = filterCriteria.value;
    const searchVal = searchInput.value.toLowerCase().trim();
    return customers.filter(customer => {
      let textToSearch = "";
      switch (criteria) {
        case "all":
          textToSearch = `${customer.customer_id} ${customer.first_name} ${customer.middle_name} ${customer.last_name} ${customer.gender}`;
          break;
        case "customer":
          textToSearch = `${customer.first_name} ${customer.middle_name} ${customer.last_name}`;
          break;
        default:
          textToSearch = `${customer.customer_id} ${customer.first_name} ${customer.middle_name} ${customer.last_name} ${customer.gender}`;
      }
      return textToSearch.toString().toLowerCase().includes(searchVal);
    });
  }

  // Modal handling for Add Contact
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

    fetch('http://127.0.0.1:3000/api/customer-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact)
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.customer_contact_id) {
          contactData.push(data);
          renderTable();
          addContactForm.reset();
          addContactModal.style.display = "none";
        } else {
          console.error('Error adding contact:', data);
        }
      })
      .catch(error => console.error('Error adding contact:', error));
  });

  // Modal handling for Edit Contact
  function openEditModal(contact) {
    document.getElementById("editContactCustomerID").value = contact.customer_id;
    document.getElementById("editContactType").value = contact.contact_type_code;
    document.getElementById("editContactValue").value = contact.contact_value;
    document.getElementById("editIsPrimary").value = contact.is_primary;
    document.getElementById("editIsActive").value = contact.is_active;
    document.getElementById("editContactID").value = contact.customer_contact_id; // Store the contact ID
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
    const contactId = document.getElementById("editContactID").value; // Retrieve the contact ID
    const updatedContact = {
      customer_id: document.getElementById("editContactCustomerID").value.trim(),
      contact_type_code: document.getElementById("editContactType").value,
      contact_value: document.getElementById("editContactValue").value.trim(),
      is_primary: document.getElementById("editIsPrimary").value,
      is_active: document.getElementById("editIsActive").value
    };

    fetch(`http://127.0.0.1:3000/api/customer-contacts/${contactId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedContact)
    })
      .then(response => response.json())
      .then(data => {
        const index = contactData.findIndex(c => c.customer_contact_id == contactId);
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
  fetchData();
}

window.initCustomerContact = initCustomerContact;
document.addEventListener('DOMContentLoaded', () => {
  function initCustomerList() {
    fetchCustomers()
      .then(customers => {
        customerData = customers;
        renderTable();
      })
      .catch(error => {
        console.error('Error fetching customers:', error);
      });

    // Fetch customer data from the API
    function fetchCustomers() {
      return fetch('http://127.0.0.1:3000/api/customers')
        .then(response => response.json())
        .catch(error => {
          console.error('Error fetching customers:', error);
          throw error;
        });
    }

    // Populate the customer table with data
    function populateCustomerTable(customers) {
      const customerTbody = document.getElementById('customerTbody');
      customerTbody.innerHTML = ''; // Clear existing rows

      customers.forEach(customer => {
        const gender = customer.gender === 'M' ? 'Male' : customer.gender === 'F' ? 'Female' : 'Other';
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${customer.customer_id}</td>
          <td>${customer.first_name} ${customer.middle_name ? customer.middle_name + ' ' : ''}${customer.last_name}</td>
          <td>${gender}</td>
          <td>
            <i class="fa-solid fa-pen-to-square edit-customer"></i>
            <i class="fa-solid fa-trash delete-customer"></i>
          </td>
        `;
        customerTbody.appendChild(row);

        // Attach edit functionality
        const editIcon = row.querySelector(".edit-customer");
        editIcon.addEventListener("click", () => {
          openEditModal(customer);
        });

        // Attach delete functionality
        const deleteIcon = row.querySelector(".delete-customer");
        deleteIcon.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this customer?")) {
            deleteCustomer(customer.customer_id);
          }
        });
      });
    }

    // Function to open the edit modal and populate it with customer data
    function openEditModal(customer) {
      document.getElementById("editCustomerID").value = customer.customer_id;
      document.getElementById("editCustomerFirstName").value = customer.first_name;
      document.getElementById("editCustomerMiddleName").value = customer.middle_name;
      document.getElementById("editCustomerLastName").value = customer.last_name;
      document.getElementById("editCustomerGender").value = customer.gender;
      editCustomerModal.style.display = "block";
    }

    // Function to delete a customer
    function deleteCustomer(customerId) {
      fetch(`http://127.0.0.1:3000/api/customers/${customerId}`, {
        method: 'DELETE',
      })
        .then(() => {
          customerData = customerData.filter(customer => customer.customer_id !== customerId);
          renderTable();
        })
        .catch(error => console.error('Error deleting customer:', error));
    }

    // DOM elements
    const searchInput = document.getElementById("searchInput");
    const filterCriteria = document.getElementById("filterCriteria");
    const customerTbody = document.getElementById("customerTbody");
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageNumberSpan = document.getElementById("pageNumber");
    const btnAddCustomer = document.getElementById("btnAddCustomer");
    const addCustomerModal = document.getElementById("addCustomerModal");
    const closeAddCustomerModal = document.getElementById("closeAddCustomerModal");
    const addCustomerForm = document.getElementById("addCustomerForm");
    const editCustomerModal = document.getElementById("editCustomerModal");
    const closeEditCustomerModal = document.getElementById("closeEditCustomerModal");
    const editCustomerForm = document.getElementById("editCustomerForm");

    // Pagination variables
    let currentPage = 1;
    const rowsPerPage = 10;

    // Render table based on filtered data and pagination
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

      customerTbody.innerHTML = "";
      pageData.forEach((cust, idx) => {
        const fullName = `${cust.first_name} ${cust.middle_name ? cust.middle_name + " " : ""}${cust.last_name}`;
        const gender = cust.gender === 'M' ? 'Male' : cust.gender === 'F' ? 'Female' : 'Other';
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${cust.customer_id}</td>
          <td>${fullName}</td>
          <td>${gender}</td>
          <td>
            <i class="fa-solid fa-pen-to-square edit-customer"></i>
            <i class="fa-solid fa-trash delete-customer"></i>
          </td>
        `;
        customerTbody.appendChild(row);

        // Attach edit functionality
        const editIcon = row.querySelector(".edit-customer");
        editIcon.addEventListener("click", () => {
          openEditModal(cust);
        });

        // Attach delete functionality
        const deleteIcon = row.querySelector(".delete-customer");
        deleteIcon.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this customer?")) {
            deleteCustomer(cust.customer_id);
          }
        });
      });
    }

    // Filtering function – returns customers that match search criteria
    function filterSearchData() {
      const criteria = filterCriteria.value;
      const searchVal = searchInput.value.toLowerCase().trim();
      return customerData.filter(cust => {
        let textToSearch = `${cust.customer_id} ${cust.first_name} ${cust.middle_name} ${cust.last_name} ${cust.gender}`;
        if (criteria !== 'all') {
          return textToSearch.toLowerCase().includes(searchVal) && cust.gender === criteria;
        }
        return textToSearch.toLowerCase().includes(searchVal);
      });
    }

    // Modal handling for adding customer
    btnAddCustomer.addEventListener("click", () => {
      addCustomerModal.style.display = "block";
    });
    closeAddCustomerModal.addEventListener("click", () => {
      addCustomerModal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === addCustomerModal) {
        addCustomerModal.style.display = "none";
      }
    });

    // Add Customer Form submit
    addCustomerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstName = document.getElementById("customerFirstName").value.trim();
      const middleName = document.getElementById("customerMiddleName").value.trim();
      const lastName = document.getElementById("customerLastName").value.trim();
      const gender = document.getElementById("customerGender").value;

      const newCustomer = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        gender: gender
      };

      fetch('http://127.0.0.1:3000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCustomer)
      })
        .then(response => response.json())
        .then(data => {
          if (data && data.customer_id) {
            customerData.push(data);
            renderTable();
            addCustomerForm.reset();
            addCustomerModal.style.display = "none";
          } else {
            console.error('Error adding customer:', data);
          }
        })
        .catch(error => console.error('Error adding customer:', error));
    });

    // Modal handling for editing customer
    function openEditModal(cust) {
      document.getElementById("editCustomerID").value = cust.customer_id;
      document.getElementById("editCustomerFirstName").value = cust.first_name;
      document.getElementById("editCustomerMiddleName").value = cust.middle_name;
      document.getElementById("editCustomerLastName").value = cust.last_name;
      document.getElementById("editCustomerGender").value = cust.gender;
      editCustomerModal.style.display = "block";
    }

    closeEditCustomerModal.addEventListener("click", () => {
      editCustomerModal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === editCustomerModal) {
        editCustomerModal.style.display = "none";
      }
    });

    editCustomerForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const customerId = document.getElementById("editCustomerID").value;
      const updatedCustomer = {
        customer_id: customerId,
        first_name: document.getElementById("editCustomerFirstName").value.trim(),
        middle_name: document.getElementById("editCustomerMiddleName").value.trim(),
        last_name: document.getElementById("editCustomerLastName").value.trim(),
        gender: document.getElementById("editCustomerGender").value
      };

      fetch(`http://127.0.0.1:3000/api/customers/${customerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCustomer)
      })
        .then(response => response.json())
        .then(data => {
          const index = customerData.findIndex(c => c.customer_id == customerId);
          customerData[index] = data;
          renderTable();
          editCustomerForm.reset();
          editCustomerModal.style.display = "none";
        })
        .catch(error => console.error('Error updating customer:', error));
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

  // Expose the initialization function so it can be called from dashboard.js
  window.initCustomerList = initCustomerList;
});
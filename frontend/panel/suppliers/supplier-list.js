document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://127.0.0.1:3000/api/suppliers';
  const addressApiUrl = 'http://127.0.0.1:3000/api/supplier-addresses';
  let supplierData = [];
  let supplierAddresses = [];

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

    // Fetch and render suppliers
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        supplierData = data;
        renderTable();
      })
      .catch(error => console.error('Error fetching suppliers:', error));

    // Fetch and render supplier addresses
    fetch(addressApiUrl)
      .then(response => response.json())
      .then(data => {
        supplierAddresses = data;
      })
      .catch(error => console.error('Error fetching supplier addresses:', error));

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
          <td class="toggle-cell">
            <i class="fa-solid fa-chevron-right toggle-addresses"></i>
          </td>
          <td>${supplier.supplier_id}</td>
          <td>${supplier.supplier_name}</td>
        `;
        // Attach toggle addresses event
        row.querySelector(".toggle-addresses").addEventListener("click", () => {
          toggleAddresses(row, supplier.supplier_id);
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
            textToSearch = `${supplier.supplier_id} ${supplier.supplier_name}`;
            break;
          case "name":
            textToSearch = supplier.supplier_name;
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
      const newID = supplierData.length ? Math.max(...supplierData.map(s => s.supplier_id)) + 1 : 1;
      const newSupplier = {
        supplier_id: newID,
        supplier_name: supplierName
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

    // Toggle supplier addresses
    function toggleAddresses(row, supplierId) {
      const addressRows = row.nextElementSibling;
      if (addressRows && addressRows.classList.contains('address-rows')) {
        addressRows.remove();
      } else {
        const addresses = supplierAddresses.filter(address => address.supplier_id === supplierId);
        const addressRow = document.createElement('tr');
        addressRow.classList.add('address-rows');
        addressRow.innerHTML = `
          <td colspan="3">
            <table class="address-table">
              <thead>
                <tr>
                  <th>Country</th>
                  <th>Zip Code</th>
                  <th>Province</th>
                  <th>City</th>
                  <th>Barangay</th>
                  <th>Street</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${addresses.map((address, idx) => `
                  <tr>
                    <td>${address.country}</td>
                    <td>${address.zip_code}</td>
                    <td>${address.province}</td>
                    <td>${address.city}</td>
                    <td>${address.barangay}</td>
                    <td>${address.street}</td>
                    <td>
                      <i class="fa-solid fa-pen-to-square edit-supplier" data-index="${idx}" data-supplier-id="${supplierId}"></i>
                      <i class="fa-solid fa-trash delete-supplier" data-index="${idx}" data-supplier-id="${supplierId}"></i>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </td>
        `;
        row.insertAdjacentElement('afterend', addressRow);

        // Attach edit and delete events for the sub-table
        addressRow.querySelectorAll('.edit-supplier').forEach(button => {
          button.addEventListener('click', (e) => {
            const supplierId = e.target.dataset.supplierId;
            const index = e.target.dataset.index;
            const supplier = supplierData.find(s => s.supplier_id == supplierId);
            openEditModal(supplier, index);
          });
        });

        addressRow.querySelectorAll('.delete-supplier').forEach(button => {
          button.addEventListener('click', (e) => {
            const supplierId = e.target.dataset.supplierId;
            const index = e.target.dataset.index;
            if (confirm("Are you sure you want to delete this address?")) {
              supplierAddresses = supplierAddresses.filter((_, idx) => idx != index || _.supplier_id != supplierId);
              toggleAddresses(row, supplierId); // Re-render addresses
            }
          });
        });
      }
    }

    // Initial render
    renderTable();
  }

  window.initSupplierList = initSupplierList;
});
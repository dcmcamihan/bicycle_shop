function initSupplyOrders() {
  // DOM elements
  const searchInput = document.getElementById("searchInput");
  const filterCriteria = document.getElementById("filterCriteria");
  const supplyTbody = document.getElementById("supplyTbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const addSupplyModal = document.getElementById("addSupplyModal");
  const closeAddSupplyModal = document.getElementById("closeAddSupplyModal");
  const addSupplyForm = document.getElementById("addSupplyForm");
  const editSupplyModal = document.getElementById("editSupplyModal");
  const closeEditSupplyModal = document.getElementById("closeEditSupplyModal");
  const editSupplyForm = document.getElementById("editSupplyForm");

  // Pagination variables
  let currentPage = 1;
  const rowsPerPage = 10;

  // Local data storage
  let supplyData = [];
  let suppliers = {};
  let employees = {};
  let paymentMethods = {};
  let products = {};

  // Fetch data from APIs
  async function fetchData() {
    try {
      const [supplyRes, supplierRes, employeeRes, paymentMethodRes, productRes] = await Promise.all([
        fetch('http://127.0.0.1:3000/api/supplies'),
        fetch('http://127.0.0.1:3000/api/suppliers'),
        fetch('http://127.0.0.1:3000/api/employees'),
        fetch('http://127.0.0.1:3000/api/payment-methods'),
        fetch('http://127.0.0.1:3000/api/products')
      ]);

      supplyData = await supplyRes.json();
      const supplierData = await supplierRes.json();
      const employeeData = await employeeRes.json();
      const paymentMethodData = await paymentMethodRes.json();
      const productData = await productRes.json();

      suppliers = supplierData.reduce((map, supplier) => {
        map[supplier.supplier_id] = supplier.supplier_name;
        return map;
      }, {});

      employees = employeeData.reduce((map, employee) => {
        map[employee.employee_id] = `${employee.first_name} ${employee.middle_name} ${employee.last_name}`;
        return map;
      }, {});

      paymentMethods = paymentMethodData.reduce((map, method) => {
        map[method.payment_method_code] = method.description;
        return map;
      }, {});

      products = productData.reduce((map, product) => {
        map[product.product_id] = product;
        return map;
      }, {});

      // Populate the filter dropdown with suppliers
      populateSupplierDropdown(supplierData);

      // Fetch supply details for each supply
      await Promise.all(supplyData.map(async (supply) => {
        const supplyDetailsRes = await fetch(`http://127.0.0.1:3000/api/supply-details/supply/${supply.supply_id}`);
        supply.supply_details = await supplyDetailsRes.json();
      }));

      renderTable();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  // Populate the supplier dropdown
  function populateSupplierDropdown(supplierData) {
    supplierData.forEach(supplier => {
      const option = document.createElement('option');
      option.value = supplier.supplier_id;
      option.textContent = supplier.supplier_name;
      filterCriteria.appendChild(option);
    });
  }

  // Render the supply table
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

    supplyTbody.innerHTML = "";
    pageData.forEach((supply, idx) => {
      // Ensure supply.supply_details is an array
      if (!Array.isArray(supply.supply_details)) {
        supply.supply_details = [];
      }

      // Calculate total cost
      const totalCost = supply.supply_details.reduce((sum, detail) => {
        const product = products[detail.product_id];
        return sum + (product ? parseFloat(product.price) * detail.quantity_supplied : 0);
      }, 0);

      const parentRow = document.createElement("tr");
      parentRow.classList.add("parent-row");
      parentRow.innerHTML = `
        <td class="toggle-cell">
          <i class="fa-solid fa-chevron-right toggle-btn"></i>
        </td>
        <td>${supply.supply_id}</td>
        <td>${new Date(supply.supply_date).toLocaleDateString()}</td>
        <td class="supplier">${suppliers[supply.supplier_id] || supply.supplier_id}</td>
        <td>${employees[supply.sale_attendant] || supply.sale_attendant}</td>
        <td>${employees[supply.manager] || supply.manager}</td>
        <td>${paymentMethods[supply.payment_method_code] || supply.payment_method_code}</td>
        <td>${totalCost.toFixed(2)}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-supply" data-id="${supply.supply_id}"></i>
          <i class="fa-solid fa-trash delete-supply" data-id="${supply.supply_id}"></i>
        </td>
      `;

      const childRow = document.createElement("tr");
      childRow.classList.add("child-row");
      childRow.innerHTML = `
        <td colspan="9">
          <h3 style="color: #ab0d07;">Supply Details</h3>
          <table class="supply-detail-table">
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Quantity Supplied</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${supply.supply_details.map(detail => {
        const product = products[detail.product_id];
        return `
                  <tr>
                    <td>${detail.product_id}</td>
                    <td>${product ? product.product_name : 'Unknown'}</td>
                    <td>${product ? parseFloat(product.price).toFixed(2) : 'N/A'}</td>
                    <td>${detail.quantity_supplied}</td>
                    <td>
                      <i class="fa-solid fa-pen-to-square edit-supply-detail" data-id="${detail.supply_details_id}"></i>
                      <i class="fa-solid fa-trash delete-supply-detail" data-id="${detail.supply_details_id}"></i>
                    </td>
                  </tr>
                `;
      }).join('')}
            </tbody>
          </table>
          <button class="btn-add-supply-detail" data-supply-id="${supply.supply_id}">Add Supply Detail</button>
        </td>
      `;

      supplyTbody.appendChild(parentRow);
      supplyTbody.appendChild(childRow);

      // Toggle Child Row
      const toggleBtn = parentRow.querySelector(".toggle-btn");
      toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("rotated");
        childRow.style.display = (childRow.style.display === "table-row") ? "none" : "table-row";
      });

      // Attach edit functionality for supply
      const editSupplyIcon = parentRow.querySelector(".edit-supply");
      editSupplyIcon.addEventListener("click", () => {
        const supplyId = editSupplyIcon.getAttribute("data-id");
        const supply = supplyData.find(s => s.supply_id == supplyId);
        openEditSupplyModal(supply);
      });

      // Attach delete functionality for supply
      const deleteSupplyIcon = parentRow.querySelector(".delete-supply");
      deleteSupplyIcon.addEventListener("click", () => {
        const supplyId = deleteSupplyIcon.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this supply?")) {
          fetch(`http://127.0.0.1:3000/api/supplies/${supplyId}`, {
            method: 'DELETE',
          })
            .then(() => {
              supplyData = supplyData.filter(s => s.supply_id != supplyId);
              renderTable();
            })
            .catch(error => console.error('Error deleting supply:', error));
        }
      });

      // Attach edit functionality for supply details
      const editIcons = childRow.querySelectorAll(".edit-supply-detail");
      editIcons.forEach(icon => {
        icon.addEventListener("click", () => {
          const detailId = icon.getAttribute("data-id");
          const detail = supply.supply_details.find(d => d.supply_details_id == detailId);
          openEditModal(detail);
        });
      });

      // Attach delete functionality for supply details
      const deleteIcons = childRow.querySelectorAll(".delete-supply-detail");
      deleteIcons.forEach(icon => {
        icon.addEventListener("click", () => {
          const detailId = icon.getAttribute("data-id");
          if (confirm("Are you sure you want to delete this supply detail?")) {
            fetch(`http://127.0.0.1:3000/api/supply-details/${detailId}`, {
              method: 'DELETE',
            })
              .then(() => {
                supply.supply_details = supply.supply_details.filter(d => d.supply_details_id != detailId);
                renderTable();
              })
              .catch(error => console.error('Error deleting supply detail:', error));
          }
        });
      });

      // Attach add supply detail functionality
      const addSupplyDetailBtn = childRow.querySelector(".btn-add-supply-detail");
      addSupplyDetailBtn.addEventListener("click", () => {
        const supplyId = addSupplyDetailBtn.getAttribute("data-supply-id");
        document.getElementById("supplyID").value = supplyId;
        addSupplyModal.style.display = "block";
      });
    });
  }

  // Filtering function
  function filterSearchData() {
    const criteria = filterCriteria.value;
    const searchVal = searchInput.value.toLowerCase().trim();
    return supplyData.filter(supply => {
      let textToSearch = "";
      if (criteria === "all") {
        textToSearch = `${supply.supply_id} ${suppliers[supply.supplier_id]} ${new Date(supply.supply_date).toLocaleDateString()} ${supply.supply_details.map(detail => products[detail.product_id]?.product_name).join(' ')}`;
      } else {
        textToSearch = suppliers[supply.supplier_id];
      }
      return textToSearch.toString().toLowerCase().includes(searchVal) && (criteria === "all" || supply.supplier_id === criteria);
    });
  }

  // Modal handling for Add Supply
  closeAddSupplyModal.addEventListener("click", () => {
    addSupplyModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === addSupplyModal) {
      addSupplyModal.style.display = "none";
    }
  });

  // Add Supply Form submission
  addSupplyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const supply_id = document.getElementById("supplyID").value.trim();
    const product_id = document.getElementById("productID").value;
    const quantity_supplied = document.getElementById("quantitySupplied").value.trim();

    const newSupplyDetail = {
      supply_id,
      product_id,
      quantity_supplied
    };

    fetch('http://127.0.0.1:3000/api/supply-details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSupplyDetail)
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.supply_details_id) {
          const supply = supplyData.find(s => s.supply_id == supply_id);
          supply.supply_details.push(data);
          renderTable();
          addSupplyForm.reset();
          addSupplyModal.style.display = "none";
        } else {
          console.error('Error adding supply detail:', data);
        }
      })
      .catch(error => console.error('Error adding supply detail:', error));
  });

  // Modal handling for Edit Supply
  function openEditSupplyModal(supply) {
    document.getElementById("editSupplyID").value = supply.supply_id;
    document.getElementById("editSupplierID").value = supply.supplier_id;
    document.getElementById("editSupplyDate").value = new Date(supply.supply_date).toISOString().slice(0, 10);
    document.getElementById("editPaymentMethod").value = supply.payment_method_code;
    document.getElementById("editSaleAttendant").value = supply.sale_attendant;
    document.getElementById("editManager").value = supply.manager;
    editSupplyModal.style.display = "block";
  }

  closeEditSupplyModal.addEventListener("click", () => {
    editSupplyModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === editSupplyModal) {
      editSupplyModal.style.display = "none";
    }
  });

  editSupplyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const supplyId = document.getElementById("editSupplyID").value;
    const updatedSupply = {
      supplier_id: document.getElementById("editSupplierID").value,
      supply_date: document.getElementById("editSupplyDate").value,
      payment_method_code: document.getElementById("editPaymentMethod").value,
      sale_attendant: document.getElementById("editSaleAttendant").value,
      manager: document.getElementById("editManager").value
    };

    fetch(`http://127.0.0.1:3000/api/supplies/${supplyId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedSupply)
    })
      .then(response => response.json())
      .then(data => {
        const index = supplyData.findIndex(s => s.supply_id == supplyId);
        supplyData[index] = data;
        renderTable();
        editSupplyForm.reset();
        editSupplyModal.style.display = "none";
      })
      .catch(error => console.error('Error updating supply:', error));
  });

  // Modal handling for Edit Supply Detail
  function openEditModal(detail) {
    document.getElementById("editSupplyID").value = detail.supply_id;
    document.getElementById("editProductID").value = detail.product_id;
    document.getElementById("editQuantitySupplied").value = detail.quantity_supplied;
    document.getElementById("editSupplyDetailID").value = detail.supply_details_id; // Store the supply detail ID
    editSupplyModal.style.display = "block";
  }

  closeEditSupplyModal.addEventListener("click", () => {
    editSupplyModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === editSupplyModal) {
      editSupplyModal.style.display = "none";
    }
  });

  editSupplyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const detailId = document.getElementById("editSupplyDetailID").value; // Retrieve the supply detail ID
    const updatedDetail = {
      supply_id: document.getElementById("editSupplyID").value.trim(),
      product_id: document.getElementById("editProductID").value,
      quantity_supplied: document.getElementById("editQuantitySupplied").value.trim()
    };

    fetch(`http://127.0.0.1:3000/api/supply-details/${detailId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedDetail)
    })
      .then(response => response.json())
      .then(data => {
        const supply = supplyData.find(s => s.supply_id == updatedDetail.supply_id);
        const index = supply.supply_details.findIndex(d => d.supply_details_id == detailId);
        supply.supply_details[index] = data;
        renderTable();
        editSupplyForm.reset();
        editSupplyModal.style.display = "none";
      })
      .catch(error => console.error('Error updating supply detail:', error));
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

window.initSupplyOrders = initSupplyOrders;
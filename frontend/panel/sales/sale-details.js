// Define an initialization function for the sale details page
function initSaleDetails() {
  let currentPage = 1;
  const rowsPerPage = 10;

  // DOM Elements
  const saleTbody = document.querySelector(".collapsible-table tbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");
  const filterCriteria = document.getElementById("filterCriteria");
  const searchInput = document.getElementById("searchInput");

  // Local data storage
  let salesData = [];

  // Fetch sales data from the API
  fetchSalesData();

  function fetchSalesData() {
    fetch('http://localhost:3000/api/sales')
      .then(response => response.json())
      .then(data => {
        console.log('Fetched sales data:', data); // Log the data to debug
        // Group sales by sale_id
        const salesMap = new Map();
        const customerPromises = [];
        const employeePromises = [];
        const paymentMethodPromises = [];
        const saleDetailsPromises = [];

        data.forEach(sale => {
          if (!salesMap.has(sale.sale_id)) {
            salesMap.set(sale.sale_id, {
              saleID: sale.sale_id,
              date: new Date(sale.sale_date).toLocaleDateString(),
              customerID: sale.customer_id,
              cashierID: sale.cashier_id,
              paymentMethod: "N/A",
              totalAmount: 0,
              details: []
            });
          }
          const saleEntry = salesMap.get(sale.sale_id);

          // Fetch customer data
          const customerPromise = fetch(`http://127.0.0.1:3000/api/customers/${sale.customer_id}`)
            .then(response => response.json())
            .then(customerData => {
              saleEntry.customer = `${customerData.first_name} ${customerData.last_name}`;
            })
            .catch(error => console.error('Error fetching customer data:', error));

          customerPromises.push(customerPromise);

          // Fetch cashier data
          const cashierPromise = fetch(`http://127.0.0.1:3000/api/employees/${sale.cashier}`)
            .then(response => response.json())
            .then(cashierData => {
              saleEntry.cashier = `${cashierData.first_name} ${cashierData.last_name}`;
            })
            .catch(error => console.error('Error fetching cashier data:', error));

          employeePromises.push(cashierPromise);

          // Fetch payment method data
          const paymentMethodPromise = fetch(`http://127.0.0.1:3000/api/sale-payment-types/sale/${sale.sale_id}`)
            .then(response => response.json())
            .then(paymentTypeData => {
              return fetch(`http://127.0.0.1:3000/api/payment-methods/${paymentTypeData.payment_method_code}`)
                .then(response => response.json())
                .then(paymentMethodData => {
                  saleEntry.paymentMethod = paymentMethodData.description;
                });
            })
            .catch(error => console.error('Error fetching payment method data:', error));

          paymentMethodPromises.push(paymentMethodPromise);

          // Fetch sale details data
          const saleDetailsPromise = fetch(`http://127.0.0.1:3000/api/sale-details/sale/${sale.sale_id}`)
            .then(response => response.json())
            .then(detailsData => {
              console.log('Fetched sale details data:', detailsData); // Log the data to debug

              const productPromises = detailsData.map(detail => {
                return fetch(`http://127.0.0.1:3000/api/products/${detail.product_id}`)
                  .then(response => response.json())
                  .then(productData => {
                    const subtotal = detail.quantity_sold * productData.price;
                    saleEntry.details.push({
                      productName: productData.product_name,
                      quantity: detail.quantity_sold,
                      pricePerUnit: productData.price,
                      saleDetailID: detail.sale_detail_id,
                      subtotal: subtotal
                    });
                    saleEntry.totalAmount += subtotal;
                  })
                  .catch(error => console.error('Error fetching product data:', error));
              });

              return Promise.all(productPromises);
            })
            .catch(error => console.error('Error fetching sale details:', error));

          saleDetailsPromises.push(saleDetailsPromise);
        });

        Promise.all([...customerPromises, ...employeePromises, ...paymentMethodPromises, ...saleDetailsPromises]).then(() => {
          salesData = Array.from(salesMap.values());
          renderTable();
        });
      })
      .catch(error => console.error('Error fetching sales data:', error));
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

  // --- Render the Sales Table ---
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

    saleTbody.innerHTML = "";

    pageData.forEach((sale, idx) => {
      const parentRow = document.createElement("tr");
      parentRow.classList.add("parent-row");
      parentRow.innerHTML = `
        <td class="toggle-cell">
          <i class="fa-solid fa-chevron-right toggle-btn"></i>
        </td>
        <td>${sale.saleID}</td>
        <td>${sale.date}</td>
        <td>${sale.customer}</td>
        <td>${sale.cashier}</td>
        <td>P${sale.totalAmount}</td>
        <td>${sale.paymentMethod}</td>
      `;

      const childRow = document.createElement("tr");
      childRow.classList.add("child-row");
      let detailsHTML = `
        <table class="sale-detail-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity Sold</th>
              <th>Price Per Unit</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
      `;
      sale.details.forEach((detail, dIdx) => {
        const subtotal = detail.quantity * detail.pricePerUnit;
        detailsHTML += `
          <tr>
            <td>${detail.productName}</td>
            <td>${detail.quantity}</td>
            <td>P${detail.pricePerUnit}</td>
            <td>P${subtotal}</td>
          </tr>
        `;
      });
      detailsHTML += `
          </tbody>
        </table>
      `;
      childRow.innerHTML = `<td colspan="7">${detailsHTML}</td>`;

      saleTbody.appendChild(parentRow);
      saleTbody.appendChild(childRow);

      // Toggle Child Row
      const toggleBtn = parentRow.querySelector(".toggle-btn");
      toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("rotated");
        childRow.style.display = (childRow.style.display === "table-row") ? "none" : "table-row";
      });
    });
  }

  // --- Filter & Search Function ---
  function filterSearchData() {
    const searchVal = searchInput.value.toLowerCase().trim();
    return salesData.filter(sale => {
      const customerMatch = sale.customer.toLowerCase().includes(searchVal);
      const cashierMatch = sale.cashier.toLowerCase().includes(searchVal);
      const productMatch = sale.details.some(detail => detail.productName.toLowerCase().includes(searchVal));
      return customerMatch || cashierMatch || productMatch;
    });
  }

  // Initial render of the table
  renderTable();
}

// Expose the initialization function so it can be called externally
window.initSaleDetails = initSaleDetails;
// Toggle Sidebar Collapsing
const toggleBtn = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const logoImg = document.getElementById("jolensLogo");
const collapsibleItems = document.querySelectorAll(".sidebar-nav li.collapsible");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
  if (sidebar.classList.contains("collapsed")) {
    collapsibleItems.forEach(item => item.classList.remove("active"));
  }
});

// Theme toggle
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("light-mode")) {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
    logoImg.src = "img/logo-dark.png";
  } else {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
    logoImg.src = "img/logo.png";
  }
});

// Collapsible Menu functionality
const collapsibleHeaders = document.querySelectorAll('.sidebar-nav li.collapsible > .collapsible-header');
collapsibleHeaders.forEach(header => {
  header.addEventListener('click', () => {
    if (sidebar.classList.contains('collapsed')) return;
    header.parentElement.classList.toggle('active');
  });
});

// Dynamic page loading
const navLinks = document.querySelectorAll(".nav-link");
const defaultDashboard = document.getElementById("defaultDashboard");
const mainContentDiv = document.getElementById("mainContent");

function loadPage(pageUrl) {
  fetch(pageUrl)
    .then(response => response.text())
    .then(html => {
      mainContentDiv.innerHTML = html;
      defaultDashboard.style.display = "none";
      mainContentDiv.style.display = "block";

      // Call module-specific initialization functions
      if (pageUrl.includes('products.html') && typeof initProducts === 'function') {
        initProducts();
      }
      if (pageUrl.includes('sale-details.html') && typeof initSaleDetails === 'function') {
        initSaleDetails();
      }
      if (pageUrl.includes('payment-types.html') && typeof initPaymentTypes === 'function') {
        initPaymentTypes();
      }
      if (pageUrl.includes('return-exchange.html') && typeof initReturnExchange === 'function') {
        initReturnExchange();
      }
      if (pageUrl.includes('brands-categories.html') && typeof initBrandsCategories === 'function') {
        initBrandsCategories();
      }
      if (pageUrl.includes('stockout.html') && typeof initStockouts === 'function') {
        initStockouts();
      }
      if (pageUrl.includes('employees.html') && typeof initEmployeeList === 'function') {
        initEmployeeList();
      }
      if (pageUrl.includes('attendance.html') && typeof initAttendance === 'function') {
        initAttendance();
      }
      if (pageUrl.includes('role-history.html') && typeof initRoleHistory === 'function') {
        initRoleHistory();
      }
      if (pageUrl.includes('customer-list.html') && typeof initCustomerList === 'function') {
        initCustomerList();
      }
      if (pageUrl.includes('customer-contact.html') && typeof initCustomerContact === 'function') {
        initCustomerContact();
      }
      if (pageUrl.includes('supplier-list.html') && typeof initSupplierList === 'function') {
        initSupplierList();
      }
      if (pageUrl.includes('supplier-contact.html') && typeof initSupplierContact === 'function') {
        initSupplierContact();
      }
      if (pageUrl.includes('sales-overview.html') && typeof initSalesOverview === 'function') {
        initSalesOverview();
      }
      if (pageUrl.includes('supply-orders.html') && typeof initSupplyOrders === 'function') {
        initSupplyOrders();
      }
    })
    .catch(err => console.error("Failed to load page:", err));
}

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    navLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const pageUrl = link.getAttribute("data-page");
    if (pageUrl) {
      console.log(`Loading page: ${pageUrl}`); // Log the page URL being loaded
      loadPage(pageUrl);
    } else {
      defaultDashboard.style.display = "";
      mainContentDiv.style.display = "none";
    }
  });
});
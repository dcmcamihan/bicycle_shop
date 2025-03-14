document.addEventListener('DOMContentLoaded', async () => {
  const sessionToken = localStorage.getItem('sessionToken');
  if (sessionToken) {
    try {
      console.log('Session Token:', sessionToken); // Debugging statement
      const response = await fetch('http://127.0.0.1:3000/api/employees/validate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionToken })
      });

      const validationResult = document.getElementById('validationResult');
      const validationMessage = document.getElementById('validationMessage');

      const responseText = await response.text(); // Await the response text

      if (response.ok) {
        const result = JSON.parse(responseText); // Parse the response text as JSON
        if (validationResult) {
          validationResult.style.display = 'none'; // Hide validation result if session is valid
        }

        // Extract employee ID from session token
        const employeeId = sessionToken.split(':')[0];

        // Fetch user details
        const userResponse = await fetch(`http://127.0.0.1:3000/api/employees/${employeeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionToken}`
          }
        });

        if (userResponse.ok) {
          const user = await userResponse.json();
          const welcomeMessage = document.querySelector('.topbar-left h1');
          if (welcomeMessage) {
            welcomeMessage.textContent = `Welcome to Jolens Dashboard, ${user.first_name}!`;
          }
        } else {
          console.error('Failed to fetch user details.');
        }
      } else {
        console.error('Failed to validate session. Response:', responseText);
        if (validationMessage && validationResult) {
          validationMessage.textContent = `Failed to validate session. Response: ${responseText}`;
          validationResult.style.display = 'block';
        }
        window.location.href = 'login.html'; // Redirect to login page
        return; // Stop further execution
      }
    } catch (error) {
      console.error('Error validating session:', error);
      const validationResult = document.getElementById('validationResult');
      const validationMessage = document.getElementById('validationMessage');
      if (validationMessage && validationResult) {
        validationMessage.textContent = `Error validating session: ${error.message}`;
        validationResult.style.display = 'block';
      }
      window.location.href = 'login.html'; // Redirect to login page
      return; // Stop further execution
    }
  } else {
    const validationResult = document.getElementById('validationResult');
    const validationMessage = document.getElementById('validationMessage');
    if (validationMessage && validationResult) {
      validationMessage.textContent = 'No session token found.';
      validationResult.style.display = 'block';
    }
    window.location.href = 'login.html'; // Redirect to login page
    return; // Stop further execution
  }

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

  // Logout button functionality
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Perform logout actions here
      console.log("Logout button clicked");
      // Redirect to login page or perform other logout actions
      localStorage.clear();
      window.location.href = "login.html";
    });
  }
});
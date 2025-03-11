function initEmployees() {
  // Modal elements
  const editEmployeeModal = document.getElementById("editEmployeeModal");
  const closeEditModal = document.querySelector(".close-modal");
  const editEmployeeForm = document.getElementById("editEmployeeForm");
  const editEmpImageInput = document.getElementById("editEmpImage");

  let currentEditingEmployee = null; // Tracks the employee row being edited
  let employeeData = []; // Stores employees fetched from API
  let statusMap = {}; // Maps status codes to descriptions

  // Fetch all statuses from the API and store in statusMap
  function loadStatuses() {
    return fetch("http://127.0.0.1:3000/api/statuses")
      .then(response => response.json())
      .then(data => {
        statusMap = data.reduce((map, status) => {
          map[status.status_code] = status.description;
          return map;
        }, {});
      })
      .catch(error => console.error("Error fetching statuses:", error));
  }

  // Fetch employees and process their data
  function loadEmployees() {
    fetch("http://127.0.0.1:3000/api/employees")
      .then(response => response.json())
      .then(data => {
        employeeData = data.map(emp => {
          // Concatenate names to form fullName
          let fullName = `${emp.first_name} ${emp.middle_name ? emp.middle_name + " " : ""}${emp.last_name}`;
          let primaryContact = "N/A";
          if (emp.contacts && emp.contacts.length > 0) {
            const primary = emp.contacts.find(c => c.is_primary === "Y" || c.is_primary === true);
            if (primary) {
              primaryContact = `${primary.contact_type_desc}: ${primary.contact_value}`;
            } else {
              primaryContact = `${emp.contacts[0].contact_type_desc}: ${emp.contacts[0].contact_value}`;
            }
          }
          // Convert status code to description using statusMap
          const statusDesc = statusMap[emp.employee_status] || emp.employee_status;
          // Use provided photo or fallback image
          const photo = emp.photo || "panel/employees/employees-img/employee.png";
          return {
            employee_id: emp.employee_id,
            fullName,
            gender: emp.gender,
            status: statusDesc,
            primaryContact,
            photo
          };
        });
        renderTable();
      })
      .catch(error => console.error("Error fetching employees:", error));
  }

  // Render employees table dynamically
  function renderTable() {
    const tbody = document.querySelector(".employees-table tbody");
    tbody.innerHTML = "";
    employeeData.forEach(employee => {
      // Determine status class based on status text (case-insensitive)
      let statusClass = "";
      switch (employee.status.toLowerCase()) {
        case "active":
          statusClass = "active";
          break;
        case "probationary":
          statusClass = "probationary";
          break;
        case "part-time":
          statusClass = "part-time";
          break;
        case "full-time":
          statusClass = "full-time";
          break;
        case "terminated":
          statusClass = "terminated";
          break;
        case "resigned":
          statusClass = "resigned";
          break;
        case "retired":
          statusClass = "retired";
          break;
        case "on leave":
          statusClass = "on-leave";
          break;
        default:
          statusClass = "";
      }
      const tr = document.createElement("tr");
      tr.setAttribute("data-emp-id", employee.employee_id);
      tr.innerHTML = `
        <td><img src="${employee.photo}" alt="Employee Photo" class="employee-photo"></td>
        <td>${employee.fullName}</td>
        <td>${employee.gender}</td>
        <td><span class="emp-status ${statusClass}">${employee.status}</span></td>
        <td>${employee.primaryContact}</td>
        <td><i class="fa-solid fa-eye view-icon"></i></td>
      `;
      // Attach event listener to open edit modal when view icon is clicked
      tr.querySelector(".view-icon").addEventListener("click", () => {
        openEditModal(tr);
      });
      tbody.appendChild(tr);
    });
  }

  // Open edit modal and populate fields with employee row data
  function openEditModal(employeeRow) {
    currentEditingEmployee = employeeRow;
    // Column order: 0 = Picture, 1 = Full Name, 2 = Gender, 3 = Status, 4 = Contact
    const empName = employeeRow.cells[1].textContent;
    const empGender = employeeRow.cells[2].textContent;
    const empStatus = employeeRow.cells[3].querySelector(".emp-status").textContent;
    const empContact = employeeRow.cells[4].textContent;

    document.getElementById("editEmpName").value = empName;
    document.getElementById("editEmpGender").value = empGender;
    document.getElementById("editEmpStatus").value = empStatus;
    document.getElementById("editEmpContact").value = empContact;

    editEmployeeModal.style.display = "block";
  }

  // Close the edit modal when clicking the close button or outside the modal
  closeEditModal.addEventListener("click", () => {
    editEmployeeModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === editEmployeeModal) {
      editEmployeeModal.style.display = "none";
    }
  });

  // Handle form submission for editing employee details
  if (editEmployeeForm) {
    editEmployeeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!currentEditingEmployee) return;

      // Update the employee row with new data from the modal
      currentEditingEmployee.cells[1].textContent = document.getElementById("editEmpName").value;
      currentEditingEmployee.cells[2].textContent = document.getElementById("editEmpGender").value;
      
      // Update status text and reapply the corresponding class
      const newStatus = document.getElementById("editEmpStatus").value;
      let newStatusClass = "";
      switch (newStatus.toLowerCase()) {
        case "active":
          newStatusClass = "active";
          break;
        case "probationary":
          newStatusClass = "probationary";
          break;
        case "part-time":
          newStatusClass = "part-time";
          break;
        case "full-time":
          newStatusClass = "full-time";
          break;
        case "terminated":
          newStatusClass = "terminated";
          break;
        case "resigned":
          newStatusClass = "resigned";
          break;
        case "retired":
          newStatusClass = "retired";
          break;
        case "on leave":
          newStatusClass = "on-leave";
          break;
        default:
          newStatusClass = "";
      }
      const statusSpan = currentEditingEmployee.cells[3].querySelector(".emp-status");
      statusSpan.textContent = newStatus;
      statusSpan.className = `emp-status ${newStatusClass}`;

      currentEditingEmployee.cells[4].textContent = document.getElementById("editEmpContact").value;

      // If a new image is selected, update the employee photo
      if (editEmpImageInput.files && editEmpImageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(event) {
          currentEditingEmployee.cells[0].querySelector(".employee-photo").src = event.target.result;
        };
        reader.readAsDataURL(editEmpImageInput.files[0]);
      }

      editEmployeeModal.style.display = "none";
      editEmployeeForm.reset();
    });
  }

  // Handle image upload preview in the edit modal (optional)
  if (editEmpImageInput) {
    editEmpImageInput.addEventListener("change", function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
          // Optional: update an image preview element if desired.
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Load statuses first, then load employees
  loadStatuses().then(loadEmployees);
}

window.initEmployees = initEmployees;

document.addEventListener('DOMContentLoaded', () => {
  let statusMap = {};

  function initEmployeeList() {
    fetchStatuses()
      .then(statuses => {
        statusMap = statuses.reduce((map, status) => {
          map[status.status_code] = status.description;
          return map;
        }, {});
        return fetchEmployees();
      })
      .then(employees => {
        employeeData = employees;
        renderTable();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });

    // Fetch employee data from the API
    function fetchEmployees() {
      return fetch('http://127.0.0.1:3000/api/employees')
        .then(response => response.json())
        .catch(error => {
          console.error('Error fetching employees:', error);
          throw error;
        });
    }

    // Fetch status descriptions from the API
    function fetchStatuses() {
      return fetch('http://127.0.0.1:3000/api/statuses/reference/EMPLSTAT')
        .then(response => response.json())
        .catch(error => {
          console.error('Error fetching statuses:', error);
          throw error;
        });
    }

    // Populate the employee table with data
    function populateEmployeeTable(employees) {
      const employeeTbody = document.getElementById('employeeTbody');
      employeeTbody.innerHTML = ''; // Clear existing rows

      employees.forEach((employee, index) => {
        const gender = employee.gender === 'M' ? 'Male' : employee.gender === 'F' ? 'Female' : 'Other';
        const status = statusMap[employee.employee_status] || 'Unknown';
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><img src="panel/employees/employees-img/employee.png" alt="Employee" class="employee-photo"></td>
          <td>${employee.username}</td>
          <td>${employee.first_name} ${employee.middle_name ? employee.middle_name + ' ' : ''}${employee.last_name}</td>
          <td>${employee.birth_date}</td>
          <td>${gender}</td>
          <td><span class="emp-status ${status.toLowerCase().replace(' ', '-')}">${status}</span></td>
          <td>
            <i class="fa-solid fa-pen-to-square edit-employee"></i>
            <i class="fa-solid fa-trash delete-employee"></i>
          </td>
        `;
        employeeTbody.appendChild(row);

        // Attach edit functionality
        const editIcon = row.querySelector(".edit-employee");
        editIcon.addEventListener("click", () => {
          openEditModal(employee, index);
        });

        // Attach delete functionality
        const deleteIcon = row.querySelector(".delete-employee");
        deleteIcon.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this employee?")) {
            deleteEmployee(index);
          }
        });
      });
    }

    // Function to open the edit modal and populate it with employee data
    function openEditModal(employee, index) {
      document.getElementById("editEmployeeIndex").value = index;
      document.getElementById("editEmployeeFirstName").value = employee.first_name;
      document.getElementById("editEmployeeMiddleName").value = employee.middle_name;
      document.getElementById("editEmployeeLastName").value = employee.last_name;
      document.getElementById("editEmployeeGender").value = employee.gender;
      document.getElementById("editEmployeeBirthDate").value = employee.birth_date;
      document.getElementById("editEmployeeUsername").value = employee.username;
      document.getElementById("editEmployeeStatus").value = employee.employee_status;
      document.getElementById("editEmployeeModal").style.display = "block";
    }

    // Function to delete an employee
    function deleteEmployee(index) {
      employeeData.splice(index, 1);
      renderTable();
    }

    // DOM elements
    const searchInput = document.getElementById("searchInput");
    const filterCriteria = document.getElementById("filterCriteria");
    const employeeTbody = document.getElementById('employeeTbody');
    const prevPageBtn = document.getElementById("prevPage");
    const nextPageBtn = document.getElementById("nextPage");
    const pageNumberSpan = document.getElementById("pageNumber");
    const btnAddEmployee = document.getElementById("btnAddEmployee");
    const addEmployeeModal = document.getElementById("addEmployeeModal");
    const closeAddEmployeeModal = document.getElementById("closeAddEmployeeModal");
    const addEmployeeForm = document.getElementById("addEmployeeForm");
    const editEmployeeModal = document.getElementById("editEmployeeModal");
    const closeEditEmployeeModal = document.getElementById("closeEditEmployeeModal");
    const editEmployeeForm = document.getElementById("editEmployeeForm");

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

      employeeTbody.innerHTML = "";
      pageData.forEach((emp, idx) => {
        const fullName = `${emp.first_name} ${emp.middle_name ? emp.middle_name + " " : ""}${emp.last_name}`;
        const gender = emp.gender === 'M' ? 'Male' : emp.gender === 'F' ? 'Female' : 'Other';
        const status = statusMap[emp.employee_status] || 'Unknown';
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><img src="panel/employees/employees-img/employee.png" alt="Employee" class="employee-photo"></td>
          <td>${emp.username}</td>
          <td>${fullName}</td>
          <td>${emp.birth_date}</td>
          <td>${gender}</td>
          <td><span class="emp-status ${status.toLowerCase().replace(' ', '-')}">${status}</span></td>
          <td>
            <i class="fa-solid fa-pen-to-square edit-employee"></i>
            <i class="fa-solid fa-trash delete-employee"></i>
          </td>
        `;
        employeeTbody.appendChild(row);

        // Attach edit functionality
        const editIcon = row.querySelector(".edit-employee");
        editIcon.addEventListener("click", () => {
          openEditModal(emp, startIndex + idx);
        });

        // Attach delete functionality
        const deleteIcon = row.querySelector(".delete-employee");
        deleteIcon.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this employee?")) {
            employeeData.splice(startIndex + idx, 1);
            renderTable();
          }
        });
      });
    }

    // Filtering function – returns employees that match search criteria
    function filterSearchData() {
      const criteria = filterCriteria.value;
      const searchVal = searchInput.value.toLowerCase().trim();
      return employeeData.filter(emp => {
        let textToSearch = `${emp.first_name} ${emp.middle_name} ${emp.last_name} ${emp.gender} ${emp.username}`;
        if (criteria !== 'all') {
          return textToSearch.toLowerCase().includes(searchVal) && emp.gender === criteria;
        }
        return textToSearch.toLowerCase().includes(searchVal);
      });
    }

    // Modal handling for adding employee
    btnAddEmployee.addEventListener("click", () => {
      addEmployeeModal.style.display = "block";
    });
    closeAddEmployeeModal.addEventListener("click", () => {
      addEmployeeModal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === addEmployeeModal) {
        addEmployeeModal.style.display = "none";
      }
    });

    // Add Employee Form submit
    addEmployeeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstName = document.getElementById("employeeFirstName").value.trim();
      const middleName = document.getElementById("employeeMiddleName").value.trim();
      const lastName = document.getElementById("employeeLastName").value.trim();
      const gender = document.getElementById("employeeGender").value;
      const birthDate = document.getElementById("employeeBirthDate").value;
      const username = document.getElementById("employeeUsername").value.trim();
      const status = document.getElementById("employeeStatus").value;

      const newEmployee = {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        gender: gender,
        birth_date: birthDate,
        username: username,
        employee_status: status
      };
      employeeData.push(newEmployee);
      renderTable();
      addEmployeeForm.reset();
      addEmployeeModal.style.display = "none";
    });

    // Modal handling for editing employee
    function openEditModal(emp, index) {
      document.getElementById("editEmployeeIndex").value = index;
      document.getElementById("editEmployeeFirstName").value = emp.first_name;
      document.getElementById("editEmployeeMiddleName").value = emp.middle_name;
      document.getElementById("editEmployeeLastName").value = emp.last_name;
      document.getElementById("editEmployeeGender").value = emp.gender;
      document.getElementById("editEmployeeBirthDate").value = emp.birth_date;
      document.getElementById("editEmployeeUsername").value = emp.username;
      document.getElementById("editEmployeeStatus").value = emp.employee_status;
      editEmployeeModal.style.display = "block";
    }

    closeEditEmployeeModal.addEventListener("click", () => {
      editEmployeeModal.style.display = "none";
    });
    window.addEventListener("click", (e) => {
      if (e.target === editEmployeeModal) {
        editEmployeeModal.style.display = "none";
      }
    });

    editEmployeeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const index = document.getElementById("editEmployeeIndex").value;
      employeeData[index].first_name = document.getElementById("editEmployeeFirstName").value.trim();
      employeeData[index].middle_name = document.getElementById("editEmployeeMiddleName").value.trim();
      employeeData[index].last_name = document.getElementById("editEmployeeLastName").value.trim();
      employeeData[index].gender = document.getElementById("editEmployeeGender").value;
      employeeData[index].birth_date = document.getElementById("editEmployeeBirthDate").value;
      employeeData[index].username = document.getElementById("editEmployeeUsername").value.trim();
      employeeData[index].employee_status = document.getElementById("editEmployeeStatus").value;
      renderTable();
      editEmployeeForm.reset();
      editEmployeeModal.style.display = "none";
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
  window.initEmployeeList = initEmployeeList;
});
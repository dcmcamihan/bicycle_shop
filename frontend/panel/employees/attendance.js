// Define an initialization function for the attendance page
function initAttendance() {
  let currentPage = 1;
  const rowsPerPage = 10;

  // Ensure your <tbody> in attendance.html has id="attendanceTbody"
  const attendanceTbody = document.getElementById("attendanceTbody");
  const prevPageBtn = document.getElementById("prevPage");
  const nextPageBtn = document.getElementById("nextPage");
  const pageNumberSpan = document.getElementById("pageNumber");

  // Filter & Search elements
  const filterCriteria = document.getElementById("filterCriteria");
  const searchInput = document.getElementById("searchInput");

  // Modal elements for adding and editing attendance
  const addAttendanceModal = document.getElementById("addAttendanceModal");
  const btnAddAttendance = document.getElementById("btnAddAttendance");
  const closeAddModal = document.getElementById("closeAddModal");
  const addAttendanceForm = document.getElementById("addAttendanceForm");

  const editAttendanceModal = document.getElementById("editAttendanceModal");
  const closeEditModal = document.getElementById("closeEditModal");
  const editAttendanceForm = document.getElementById("editAttendanceForm");
  let editAttendanceIndex = null;

  let attendanceData = [];
  let totalEmployees = 0;
  let attendanceStatuses = {};
  let employees = {};
  let attendanceDetails = {};

  // Fetch attendance statuses from the API
  function fetchAttendanceStatuses() {
    return fetch('http://127.0.0.1:3000/api/statuses/reference/ATTNSTAT')
      .then(response => response.json())
      .then(data => {
        data.forEach(status => {
          attendanceStatuses[status.status_code] = status.description;
        });
      })
      .catch(error => {
        console.error('Error fetching attendance statuses:', error);
      });
  }

  // Fetch employee data from the API
  function fetchEmployees() {
    return fetch('http://127.0.0.1:3000/api/employees')
      .then(response => response.json())
      .then(data => {
        data.forEach(employee => {
          employees[employee.employee_id] = employee;
        });
      })
      .catch(error => {
        console.error('Error fetching employees:', error);
      });
  }

  // Fetch attendance details from the API
  function fetchAttendanceDetails() {
    return fetch('http://127.0.0.1:3000/api/attendance-details')
      .then(response => response.json())
      .then(data => {
        data.forEach(detail => {
          if (!attendanceDetails[detail.attendance_id]) {
            attendanceDetails[detail.attendance_id] = [];
          }
          attendanceDetails[detail.attendance_id].push(detail);
        });
      })
      .catch(error => {
        console.error('Error fetching attendance details:', error);
      });
  }

  // Fetch attendance data from the API
  function fetchAttendanceData() {
    return fetch('http://127.0.0.1:3000/api/employee-attendances')
      .then(response => response.json())
      .then(data => {
        attendanceData = data.map(attendance => ({
          ...attendance,
          attendance_status: attendanceStatuses[attendance.attendance_status] || attendance.attendance_status,
          first_name: employees[attendance.employee_id]?.first_name || '',
          last_name: employees[attendance.employee_id]?.last_name || '',
          employee_status: employees[attendance.employee_id]?.employee_status || '',
          details: attendanceDetails[attendance.attendance_id] || []
        }));

        // Sort attendanceData in descending order
        attendanceData.sort((a, b) => {
          if (a.date < b.date) return 1;
          if (a.date > b.date) return -1;
          return 0;
        });

        renderTable();
        updateSummaryBoxes();
      })
      .catch(error => {
        console.error('Error fetching attendance data:', error);
      });
  }

  // Fetch total employees data from the API
  function fetchTotalEmployees() {
    return fetch('http://127.0.0.1:3000/api/employees')
      .then(response => response.json())
      .then(data => {
        totalEmployees = data.length;
        updateSummaryBoxes();
      })
      .catch(error => {
        console.error('Error fetching total employees:', error);
      });
  }

  // Add Attendance Modal
  if (btnAddAttendance) {
    btnAddAttendance.addEventListener("click", () => {
      addAttendanceModal.style.display = "block";
    });
  }

  if (closeAddModal) {
    closeAddModal.addEventListener("click", () => {
      addAttendanceModal.style.display = "none";
    });
  }

  // Edit Attendance Modal
  if (closeEditModal) {
    closeEditModal.addEventListener("click", () => {
      editAttendanceModal.style.display = "none";
    });
  }

  // --- Utility Functions ---
  function computeHoursWorked(timeIn, timeOut) {
    if (!timeIn || !timeOut) return "0.00";
    let [inH, inM] = timeIn.split(":").map(Number);
    let [outH, outM] = timeOut.split(":").map(Number);
    let start = inH * 60 + inM;
    let end = outH * 60 + outM;
    let diff = end - start;
    if (diff < 0) diff += 24 * 60; // handle overnight shifts
    return (diff / 60).toFixed(2);
  }

  function getEmployeeStatusColor(status) {
    const colors = {
      Active: "#2ecc71",
      Probationary: "#3498db",
      "Part-Time": "#9b59b6",
      "Full-Time": "#1abc9c",
      Terminated: "#e74c3c",
      Resigned: "#95a5a6",
      Retired: "#7f8c8d",
    };
    return colors[status] || "#cccccc";
  }

  function getAttendanceColor(status) {
    const colors = {
      Present: "#2cae74",
      "Leave of Absence": "#c0392b",
      Suspended: "#f39c12",
      Furloughed: "#9b59b6",
      "Medical Leave": "#3498db",
      "Parental Leave": "#f1c40f",
    };
    return colors[status] || "#cccccc";
  }

  // --- Render the Attendance Table ---
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

    attendanceTbody.innerHTML = "";

    pageData.forEach((attendance, idx) => {
      const parentRow = document.createElement("tr");
      parentRow.classList.add("parent-row");
      parentRow.innerHTML = `
        <td class="toggle-cell">
          <i class="fa-solid fa-chevron-right toggle-btn"></i>
        </td>
        <td>${attendance.employee_id}</td>
        <td>${attendance.first_name} ${attendance.last_name}</td>
        <td>
          <span class="att-status" style="color: ${getAttendanceColor(attendance.attendance_status)};">
            ${attendance.attendance_status}
          </span>
        </td>
        <td>${attendance.date}</td>
        <td>
          <button class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="delete-btn">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      `;

      const childRow = document.createElement("tr");
      childRow.classList.add("child-row");
      childRow.innerHTML = `
        <td colspan="6">
          <div class="child-content">
            <h3>Details</h3>
            <table class="child-inner-table">
              <thead>
                <tr>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Hours Worked</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${attendance.details.map(detail => `
                  <tr>
                    <td>${detail.time_in || ''}</td>
                    <td>${detail.time_out || ''}</td>
                    <td>${computeHoursWorked(detail.time_in, detail.time_out)}</td>
                    <td>${detail.remarks || ''}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </td>
      `;

      attendanceTbody.appendChild(parentRow);
      attendanceTbody.appendChild(childRow);

      // Toggle Child Row
      const toggleBtn = parentRow.querySelector(".toggle-btn");
      toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("rotated");
        childRow.style.display = (childRow.style.display === "table-row") ? "none" : "table-row";
      });

      // Edit Attendance
      const editBtn = parentRow.querySelector(".edit-btn");
      editBtn.addEventListener("click", () => {
        openEditModal(startIndex + idx);
      });

      // Delete Attendance
      const deleteBtn = parentRow.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this attendance record?")) {
          deleteAttendance(startIndex + idx);
        }
      });
    });
  }

  // --- Filter & Search Function ---
  function filterSearchData() {
    const criteria = filterCriteria.value;
    const searchVal = searchInput.value.toLowerCase().trim();
    return attendanceData.filter(attendance => {
      let textToSearch = "";
      switch (criteria) {
        case "all":
          textToSearch = attendance.employee_id + attendance.first_name + attendance.last_name + attendance.employee_status + attendance.attendance_status;
          break;
        case "attendance":
          textToSearch = attendance.attendance_status;
          break;
        case "empstatus":
          textToSearch = attendance.employee_status;
          break;
        case "name":
          textToSearch = attendance.first_name + " " + attendance.last_name;
          break;
        case "hours":
          textToSearch = computeHoursWorked(attendance.time_in, attendance.time_out).toString();
          break;
        default:
          textToSearch = attendance.employee_id + attendance.first_name + attendance.last_name + attendance.employee_status + attendance.attendance_status;
      }
      return textToSearch.toLowerCase().includes(searchVal);
    });
  }

  // --- Update Summary Boxes ---
  function updateSummaryBoxes() {
    let counts = {
      Present: 0,
      Absent: 0,
      Suspended: 0,
      Furloughed: 0,
      "Medical Leave": 0,
      "Parental Leave": 0,
    };
    const uniquePresentEmployees = new Set();
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    attendanceData.forEach(attendance => {
      if (attendance.date === currentDate && attendance.attendance_status === "Present") {
        uniquePresentEmployees.add(attendance.employee_id);
        if (counts.hasOwnProperty(attendance.attendance_status)) {
          counts[attendance.attendance_status]++;
        }
      }
    });

    const presentCount = uniquePresentEmployees.size;
    const absentCount = totalEmployees - presentCount;

    document.getElementById("presentCount").textContent = presentCount;
    document.getElementById("absentCount").textContent = absentCount;
    document.getElementById("otherCount").textContent =
      counts["Suspended"] + counts["Furloughed"] + counts["Medical Leave"] + counts["Parental Leave"];
    document.getElementById("totalEmployees").textContent = totalEmployees;
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

  // --- Modal Functions ---
  function openEditModal(index) {
    editAttendanceIndex = index;
    const attendance = attendanceData[index];
    document.getElementById("editEmpID").value = attendance.employee_id;
    document.getElementById("editEmpFirstName").value = attendance.first_name;
    document.getElementById("editEmpMiddleName").value = attendance.middle_name;
    document.getElementById("editEmpLastName").value = attendance.last_name;
    document.getElementById("editEmpStatus").value = attendance.employee_status;
    document.getElementById("editAttendanceStatus").value = attendance.attendance_status;
    document.getElementById("editDate").value = attendance.date;
    document.getElementById("editTimeIn").value = attendance.details[0]?.time_in || '';
    document.getElementById("editTimeOut").value = attendance.details[0]?.time_out || '';
    document.getElementById("editRemarks").value = attendance.details[0]?.remarks || '';
    editAttendanceModal.style.display = "block";
  }

  // --- Form Submission Handlers ---
  if (addAttendanceForm) {
    addAttendanceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newAttendance = {
        employee_id: document.getElementById("addEmpID").value.trim(),
        first_name: document.getElementById("addEmpFirstName").value.trim(),
        middle_name: document.getElementById("addEmpMiddleName").value.trim(),
        last_name: document.getElementById("addEmpLastName").value.trim(),
        employee_status: document.getElementById("addEmpStatus").value,
        attendance_status: document.getElementById("addAttendanceStatus").value,
        date: document.getElementById("addDate").value,
        time_in: document.getElementById("addTimeIn").value,
        time_out: document.getElementById("addTimeOut").value,
        remarks: document.getElementById("addRemarks").value.trim(),
      };

      fetch('http://127.0.0.1:3000/api/employee-attendances', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAttendance)
      })
      .then(response => response.json())
      .then(data => {
        attendanceData.push(data);
        addAttendanceModal.style.display = "none";
        addAttendanceForm.reset();
        renderTable();
        updateSummaryBoxes();
      })
      .catch(error => {
        console.error('Error adding attendance:', error);
      });
    });
  }

  if (editAttendanceForm) {
    editAttendanceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editAttendanceIndex === null) return;
      const updatedAttendance = {
        employee_id: document.getElementById("editEmpID").value.trim(),
        first_name: document.getElementById("editEmpFirstName").value.trim(),
        middle_name: document.getElementById("editEmpMiddleName").value.trim(),
        last_name: document.getElementById("editEmpLastName").value.trim(),
        employee_status: document.getElementById("editEmpStatus").value,
        attendance_status: document.getElementById("editAttendanceStatus").value,
        date: document.getElementById("editDate").value,
        time_in: document.getElementById("editTimeIn").value,
        time_out: document.getElementById("editTimeOut").value,
        remarks: document.getElementById("editRemarks").value.trim(),
      };

      fetch(`http://127.0.0.1:3000/api/employee-attendances/${attendanceData[editAttendanceIndex].attendance_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAttendance)
      })
      .then(response => response.json())
      .then(data => {
        attendanceData[editAttendanceIndex] = data;
        editAttendanceModal.style.display = "none";
        editAttendanceForm.reset();
        renderTable();
        updateSummaryBoxes();
      })
      .catch(error => {
        console.error('Error updating attendance:', error);
      });
    });
  }

  function deleteAttendance(index) {
    fetch(`http://127.0.0.1:3000/api/employee-attendances/${attendanceData[index].attendance_id}`, {
      method: 'DELETE'
    })
    .then(() => {
      attendanceData.splice(index, 1);
      renderTable();
      updateSummaryBoxes();
    })
    .catch(error => {
      console.error('Error deleting attendance:', error);
    });
  }

  // --- Initial Render ---
  fetchAttendanceStatuses()
    .then(fetchEmployees)
    .then(fetchAttendanceDetails)
    .then(fetchAttendanceData)
    .then(fetchTotalEmployees);
}

// Expose the initialization function so it can be called externally
window.initAttendance = initAttendance;
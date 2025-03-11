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

  // Sample data (replace with actual data fetching logic)
  let attendanceData = [
    {
      empID: "E001",
      firstName: "Savannah",
      middleName: "",
      lastName: "Nguyen",
      employeeStatus: "Active",
      attendanceStatus: "Present",
      date: "2025-03-10",
      timeIn: "08:00",
      timeOut: "17:00",
      remarks: "On time",
    },
    {
      empID: "E002",
      firstName: "Michael",
      middleName: "",
      lastName: "Johnson",
      employeeStatus: "Probationary",
      attendanceStatus: "Leave of Absence",
      date: "2025-03-10",
      timeIn: "--:--",
      timeOut: "--:--",
      remarks: "Family emergency",
    },
    {
      empID: "E003",
      firstName: "Erin",
      middleName: "",
      lastName: "Stone",
      employeeStatus: "Part-Time",
      attendanceStatus: "Suspended",
      date: "2025-03-10",
      timeIn: "10:00",
      timeOut: "18:00",
      remarks: "Late multiple times",
    },
  ];

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
        <td>${attendance.empID}</td>
        <td>${attendance.firstName} ${attendance.lastName}</td>
        <td>
          <span class="att-status" style="color: ${getAttendanceColor(attendance.attendanceStatus)};">
            ${attendance.attendanceStatus}
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
                  <th>Employee Status</th>
                  <th>Time In</th>
                  <th>Time Out</th>
                  <th>Hours Worked</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span class="emp-status" style="background-color: ${getEmployeeStatusColor(attendance.employeeStatus)};">
                      ${attendance.employeeStatus}
                    </span>
                  </td>
                  <td>${attendance.timeIn}</td>
                  <td>${attendance.timeOut}</td>
                  <td>${computeHoursWorked(attendance.timeIn, attendance.timeOut)}</td>
                  <td>${attendance.remarks}</td>
                </tr>
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
          attendanceData.splice(startIndex + idx, 1);
          renderTable();
          updateSummaryBoxes();
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
          textToSearch = attendance.empID + attendance.firstName + attendance.lastName + attendance.employeeStatus + attendance.attendanceStatus;
          break;
        case "attendance":
          textToSearch = attendance.attendanceStatus;
          break;
        case "empstatus":
          textToSearch = attendance.employeeStatus;
          break;
        case "name":
          textToSearch = attendance.firstName + " " + attendance.lastName;
          break;
        case "hours":
          textToSearch = computeHoursWorked(attendance.timeIn, attendance.timeOut).toString();
          break;
        default:
          textToSearch = attendance.empID + attendance.firstName + attendance.lastName + attendance.employeeStatus + attendance.attendanceStatus;
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
    attendanceData.forEach(attendance => {
      if (counts.hasOwnProperty(attendance.attendanceStatus)) {
        counts[attendance.attendanceStatus]++;
      }
    });
    document.getElementById("presentCount").textContent = counts["Present"];
    document.getElementById("absentCount").textContent = counts["Absent"];
    document.getElementById("otherCount").textContent =
      counts["Suspended"] + counts["Furloughed"] + counts["Medical Leave"] + counts["Parental Leave"];
    document.getElementById("totalEmployees").textContent = attendanceData.length;
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
    document.getElementById("editEmpID").value = attendance.empID;
    document.getElementById("editEmpFirstName").value = attendance.firstName;
    document.getElementById("editEmpMiddleName").value = attendance.middleName;
    document.getElementById("editEmpLastName").value = attendance.lastName;
    document.getElementById("editEmpStatus").value = attendance.employeeStatus;
    document.getElementById("editAttendanceStatus").value = attendance.attendanceStatus;
    document.getElementById("editDate").value = attendance.date;
    document.getElementById("editTimeIn").value = attendance.timeIn;
    document.getElementById("editTimeOut").value = attendance.timeOut;
    document.getElementById("editRemarks").value = attendance.remarks;
    editAttendanceModal.style.display = "block";
  }

  // --- Form Submission Handlers ---
  if (addAttendanceForm) {
    addAttendanceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newAttendance = {
        empID: document.getElementById("addEmpID").value.trim(),
        firstName: document.getElementById("addEmpFirstName").value.trim(),
        middleName: document.getElementById("addEmpMiddleName").value.trim(),
        lastName: document.getElementById("addEmpLastName").value.trim(),
        employeeStatus: document.getElementById("addEmpStatus").value,
        attendanceStatus: document.getElementById("addAttendanceStatus").value,
        date: document.getElementById("addDate").value,
        timeIn: document.getElementById("addTimeIn").value,
        timeOut: document.getElementById("addTimeOut").value,
        remarks: document.getElementById("addRemarks").value.trim(),
      };
      attendanceData.push(newAttendance);
      addAttendanceModal.style.display = "none";
      addAttendanceForm.reset();
      renderTable();
      updateSummaryBoxes();
    });
  }

  if (editAttendanceForm) {
    editAttendanceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editAttendanceIndex === null) return;
      attendanceData[editAttendanceIndex] = {
        empID: document.getElementById("editEmpID").value.trim(),
        firstName: document.getElementById("editEmpFirstName").value.trim(),
        middleName: document.getElementById("editEmpMiddleName").value.trim(),
        lastName: document.getElementById("editEmpLastName").value.trim(),
        employeeStatus: document.getElementById("editEmpStatus").value,
        attendanceStatus: document.getElementById("editAttendanceStatus").value,
        date: document.getElementById("editDate").value,
        timeIn: document.getElementById("editTimeIn").value,
        timeOut: document.getElementById("editTimeOut").value,
        remarks: document.getElementById("editRemarks").value.trim(),
      };
      editAttendanceModal.style.display = "none";
      editAttendanceForm.reset();
      renderTable();
      updateSummaryBoxes();
    });
  }

  // --- Initial Render ---
  renderTable();
  updateSummaryBoxes();
}

// Expose the initialization function so it can be called externally
window.initAttendance = initAttendance;
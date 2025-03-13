function initRoleHistory() {
  // Sample data – replace with actual data fetching if needed.
  let roleHistoryData = [
    {
      empName: "Jane Doe",
      roleTitle: "Sales Associate",
      department: "Sales",
      startDate: "2023-01-01",
      endDate: "2023-06-30",
      remarks: "Promoted to Manager",
      approvedBy: "John Manager",
    },
    {
      empName: "John Smith",
      roleTitle: "Technician",
      department: "Maintenance",
      startDate: "2022-05-15",
      endDate: "Current",
      remarks: "Currently on probation",
      approvedBy: "Mary Supervisor",
    },
    {
      empName: "Emily Brown",
      roleTitle: "Customer Service Rep",
      department: "Support",
      startDate: "2021-09-01",
      endDate: "2022-03-31",
      remarks: "Transferred to Sales",
      approvedBy: "Peter Director",
    },
  ];

  // DOM Elements
  const roleHistoryTbody = document.getElementById("roleHistoryTbody");
  const searchInput = document.getElementById("searchInput");
  const filterCriteria = document.getElementById("filterCriteria");
  const btnAddRole = document.getElementById("btnAddRole");
  const btnAddRoleBottom = document.getElementById("btnAddRoleBottom");
  const addRoleModal = document.getElementById("addRoleModal");
  const closeAddRoleModal = document.getElementById("closeAddRoleModal");
  const addRoleForm = document.getElementById("addRoleForm");
  const editRoleModal = document.getElementById("editRoleModal");
  const closeEditRoleModal = document.getElementById("closeEditRoleModal");
  const editRoleForm = document.getElementById("editRoleForm");
  let editRoleIndex = null;

  function renderTable() {
    const filteredData = filterSearchData();
    roleHistoryTbody.innerHTML = "";

    filteredData.forEach((role, index) => {
      const parentRow = document.createElement("tr");
      parentRow.classList.add("parent-row");
      parentRow.innerHTML = `
        <td class="toggle-cell">
          <i class="fa-solid fa-chevron-right toggle-btn"></i>
        </td>
        <td>${role.empName}</td>
        <td>${role.roleTitle}</td>
        <td>${role.department}</td>
        <td>${role.startDate}</td>
        <td>${role.endDate}</td>
        <td>${role.remarks}</td>
        <td>${role.approvedBy}</td>
        <td>
          <i class="fa-solid fa-pen-to-square edit-role"></i>
          <i class="fa-solid fa-trash delete-role"></i>
        </td>
      `;

      const childRow = document.createElement("tr");
      childRow.classList.add("child-row");
      childRow.innerHTML = `
        <td colspan="9">
          <div class="child-content">
            <h3>Additional Details</h3>
            <p>Further information about the role change can go here.</p>
          </div>
        </td>
      `;
      roleHistoryTbody.appendChild(parentRow);
      roleHistoryTbody.appendChild(childRow);

      // Toggle child row
      const toggleBtn = parentRow.querySelector(".toggle-btn");
      toggleBtn.addEventListener("click", () => {
        toggleBtn.classList.toggle("rotated");
        childRow.style.display = (childRow.style.display === "table-row") ? "none" : "table-row";
      });

      // Edit role history
      const editBtn = parentRow.querySelector(".edit-role");
      editBtn.addEventListener("click", () => {
        openEditModal(index);
      });

      // Delete role history
      const deleteBtn = parentRow.querySelector(".delete-role");
      deleteBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this role history record?")) {
          roleHistoryData.splice(index, 1);
          renderTable();
        }
      });
    });
  }

  function filterSearchData() {
    const criteria = filterCriteria.value;
    const searchVal = searchInput.value.toLowerCase().trim();
    return roleHistoryData.filter(role => {
      let textToSearch = "";
      switch (criteria) {
        case "all":
          textToSearch = role.empName + role.roleTitle + role.department + role.startDate + role.endDate + role.remarks + role.approvedBy;
          break;
        case "role":
          textToSearch = role.roleTitle;
          break;
        case "department":
          textToSearch = role.department;
          break;
        case "date":
          textToSearch = role.startDate + role.endDate;
          break;
        default:
          textToSearch = role.empName + role.roleTitle + role.department + role.startDate + role.endDate + role.remarks + role.approvedBy;
      }
      return textToSearch.toLowerCase().includes(searchVal);
    });
  }

  function openEditModal(index) {
    editRoleIndex = index;
    const role = roleHistoryData[index];
    document.getElementById("editRoleEmpName").value = role.empName;
    document.getElementById("editRoleTitle").value = role.roleTitle;
    document.getElementById("editRoleDepartment").value = role.department;
    document.getElementById("editRoleStartDate").value = role.startDate;
    document.getElementById("editRoleEndDate").value = role.endDate;
    document.getElementById("editRoleRemarks").value = role.remarks;
    document.getElementById("editRoleApprovedBy").value = role.approvedBy;
    editRoleModal.style.display = "block";
  }

  // Event Listeners for modals
  if (btnAddRole) {
    btnAddRole.addEventListener("click", () => {
      addRoleModal.style.display = "block";
    });
  }
  if (btnAddRoleBottom) {
    btnAddRoleBottom.addEventListener("click", () => {
      addRoleModal.style.display = "block";
    });
  }
  if (closeAddRoleModal) {
    closeAddRoleModal.addEventListener("click", () => {
      addRoleModal.style.display = "none";
    });
  }
  if (closeEditRoleModal) {
    closeEditRoleModal.addEventListener("click", () => {
      editRoleModal.style.display = "none";
    });
  }
  window.addEventListener("click", (e) => {
    if (e.target === addRoleModal) {
      addRoleModal.style.display = "none";
    }
    if (e.target === editRoleModal) {
      editRoleModal.style.display = "none";
    }
  });

  if (addRoleForm) {
    addRoleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newRole = {
        empName: document.getElementById("roleEmpName").value.trim(),
        roleTitle: document.getElementById("roleTitle").value.trim(),
        department: document.getElementById("roleDepartment").value.trim(),
        startDate: document.getElementById("roleStartDate").value,
        endDate: document.getElementById("roleEndDate").value,
        remarks: document.getElementById("roleRemarks").value.trim(),
        approvedBy: document.getElementById("roleApprovedBy").value.trim(),
      };
      roleHistoryData.push(newRole);
      addRoleModal.style.display = "none";
      addRoleForm.reset();
      renderTable();
    });
  }

  if (editRoleForm) {
    editRoleForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (editRoleIndex === null) return;
      roleHistoryData[editRoleIndex] = {
        empName: document.getElementById("editRoleEmpName").value.trim(),
        roleTitle: document.getElementById("editRoleTitle").value.trim(),
        department: document.getElementById("editRoleDepartment").value.trim(),
        startDate: document.getElementById("editRoleStartDate").value,
        endDate: document.getElementById("editRoleEndDate").value,
        remarks: document.getElementById("editRoleRemarks").value.trim(),
        approvedBy: document.getElementById("editRoleApprovedBy").value.trim(),
      };
      editRoleModal.style.display = "none";
      editRoleForm.reset();
      renderTable();
    });
  }

  renderTable();
}

window.initRoleHistory = initRoleHistory;

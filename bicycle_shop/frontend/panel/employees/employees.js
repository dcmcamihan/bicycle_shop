// Define an initialization function for the employees page
function initEmployees() {
    // --- Modal Handling ---
    const editEmployeeModal = document.getElementById("editEmployeeModal");
    const closeEditModal = document.querySelector(".close-modal");
    const editEmployeeForm = document.getElementById("editEmployeeForm");
    const editEmpImageInput = document.getElementById("editEmpImage");
  
    let currentEditingEmployee = null; // Tracks the employee being edited
  
    // Function to open the edit modal for an employee
    function openEditModal(employeeRow) {
      currentEditingEmployee = employeeRow;
      const empName = employeeRow.cells[1].textContent;
      const empGender = employeeRow.cells[2].textContent;
      const empStatus = employeeRow.cells[3].querySelector(".emp-status").textContent;
      const empContact = employeeRow.cells[4].textContent;
  
      // Populate the edit modal with employee data
      document.getElementById("editEmpName").value = empName;
      document.getElementById("editEmpGender").value = empGender;
      document.getElementById("editEmpStatus").value = empStatus;
      document.getElementById("editEmpContact").value = empContact;
  
      // Open the modal
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
  
    // Handle form submission for editing an employee
    if (editEmployeeForm) {
      editEmployeeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!currentEditingEmployee) return;
  
        // Update the employee row with the new data
        currentEditingEmployee.cells[1].textContent = document.getElementById("editEmpName").value;
        currentEditingEmployee.cells[2].textContent = document.getElementById("editEmpGender").value;
        currentEditingEmployee.cells[3].querySelector(".emp-status").textContent = document.getElementById("editEmpStatus").value;
        currentEditingEmployee.cells[4].textContent = document.getElementById("editEmpContact").value;
  
        // Handle image upload (if a new image is selected)
        if (editEmpImageInput.files && editEmpImageInput.files[0]) {
          const reader = new FileReader();
          reader.onload = function (event) {
            currentEditingEmployee.cells[0].querySelector(".employee-photo").src = event.target.result;
          };
          reader.readAsDataURL(editEmpImageInput.files[0]);
        }
  
        // Close the modal and reset the form
        editEmployeeModal.style.display = "none";
        editEmployeeForm.reset();
      });
    }
  
    // Attach event listeners to the "View" icons for editing employees
    const viewIcons = document.querySelectorAll(".view-icon");
    viewIcons.forEach(icon => {
      icon.addEventListener("click", () => {
        const employeeRow = icon.closest("tr");
        openEditModal(employeeRow);
      });
    });
  
    // Handle image upload preview in the edit modal
    if (editEmpImageInput) {
      editEmpImageInput.addEventListener("change", function (e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            // Update the image preview in the modal (if needed)
            // You can add an image preview element in the modal if required.
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }
  
  // Expose the initialization function so it can be called externally
  window.initEmployees = initEmployees;
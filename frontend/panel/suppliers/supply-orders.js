function initSupplyOrders() {
    // Toggle child rows for collapsible table
    const toggleButtons = document.querySelectorAll('.collapsible-table .toggle-btn');
    toggleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('rotated');
        const parentRow = btn.closest('.parent-row');
        const childRow = parentRow.nextElementSibling;
        childRow.style.display = (childRow.style.display === 'table-row') ? 'none' : 'table-row';
      });
    });
  
    // Handle Add Supply Order Modal
    const btnAddSupplyTop = document.getElementById("btnAddSupply");
    const addSupplyModal = document.getElementById("addSupplyModal");
    const closeAddSupplyModal = document.getElementById("closeAddSupplyModal");
  
    if (btnAddSupplyTop) {
      btnAddSupplyTop.addEventListener("click", () => {
        addSupplyModal.style.display = "block";
      });
    }
    if (closeAddSupplyModal) {
      closeAddSupplyModal.addEventListener("click", () => {
        addSupplyModal.style.display = "none";
      });
    }
    window.addEventListener("click", (e) => {
      if (e.target === addSupplyModal) {
        addSupplyModal.style.display = "none";
      }
    });
  
    // (Optional) Attach event listeners for edit and delete actions for supply orders
    const editIcons = document.querySelectorAll(".edit-supply");
    editIcons.forEach(icon => {
      icon.addEventListener("click", () => {
        // Call your edit supply order function here
        // e.g., openEditSupplyOrderModal(parentRow);
        console.log("Edit supply order clicked.");
      });
    });
  
    const deleteIcons = document.querySelectorAll(".delete-supply");
    deleteIcons.forEach(icon => {
      icon.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this supply order?")) {
          // Handle deletion here (e.g., remove row or update backend)
          console.log("Supply order deleted.");
        }
      });
    });
  }
  
  document.addEventListener("DOMContentLoaded", initSupplyOrders);  
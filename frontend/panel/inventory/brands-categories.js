// Define an initialization function for the brands and categories page
function initBrandsCategories() {
  // --- Tab Switching (existing code) ---
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      const tabName = btn.getAttribute("data-tab");
      document.getElementById(tabName).classList.add("active");
    });
  });

  // Functions to load brands and categories from your API endpoints

  function loadBrands() {
    fetch('http://127.0.0.1:3000/api/brands')
      .then(response => response.json())
      .then(brands => {
        const brandList = document.querySelector(".brand-list");
        // Clear any static data (remove example brand cards)
        brandList.innerHTML = "";
        brands.forEach(brand => {
          const brandCard = document.createElement("div");
          brandCard.classList.add("brand-card");
          brandCard.innerHTML = `
            <div class="brand-avatar">
              <div class="default-avatar">${brand.brand_name.substring(0, 2).toUpperCase()}</div>
            </div>
            <h3>${brand.brand_name}</h3>
            <p>Origin: ${brand.origin}</p>
            <div class="card-actions">
              <i class="fa-solid fa-pen-to-square edit-brand"></i>
              <i class="fa-solid fa-trash delete-brand"></i>
            </div>
          `;
          // Attach event listener for editing this brand
          brandCard.querySelector(".edit-brand").addEventListener("click", () => {
            openModal("brand", brandCard);
          });
          // Attach event listener for deleting this brand
          brandCard.querySelector(".delete-brand").addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this brand?")) {
              // Optionally, perform an API call to delete on the backend here
              brandCard.remove();
            }
          });
          brandList.appendChild(brandCard);
        });
      })
      .catch(error => console.error("Error loading brands:", error));
  }

  function loadCategories() {
    fetch('http://127.0.0.1:3000/api/categories')
      .then(response => response.json())
      .then(categories => {
        const tableBody = document.querySelector(".categories-table tbody");
        // Clear any static data (remove example category rows)
        tableBody.innerHTML = "";
        categories.forEach(category => {
          const tr = document.createElement("tr");
          tr.setAttribute("data-cat-code", category.category_code);
          tr.innerHTML = `
            <td>${category.category_code}</td>
            <td>${category.category_name}</td>
            <td>
              <i class="fa-solid fa-pen-to-square edit-category"></i>
              <i class="fa-solid fa-trash delete-category"></i>
            </td>
          `;
          // Attach event listener for editing this category
          tr.querySelector(".edit-category").addEventListener("click", () => {
            openModal("category", tr);
          });
          // Attach event listener for deleting this category
          tr.querySelector(".delete-category").addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this category?")) {
              // Optionally, perform an API call to delete on the backend here
              tr.remove();
            }
          });
          tableBody.appendChild(tr);
        });
      })
      .catch(error => console.error("Error loading categories:", error));
  }

  // --- Modal Handling for Brands & Categories (existing code) ---
  const bcModal = document.getElementById("bcModal");
  const closeModal = document.querySelector(".close-modal");
  const addBrandBtn = document.getElementById("addBrandBtn");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const bcForm = document.getElementById("bcForm");
  const brandGroup = document.getElementById("brandGroup");
  const categoryGroup = document.getElementById("categoryGroup");
  const modalTitle = document.getElementById("modalTitle");

  let currentEditing = null; // Tracks the current item being edited (brand or category)

  // Open modal for adding or editing; type is "brand" or "category"
  // element is the DOM element to be edited (if applicable)
  function openModal(type, element = null) {
    currentEditing = { type, element };
    bcModal.style.display = "block";
    if (type === "brand") {
      modalTitle.textContent = element ? "Edit Brand" : "Add Brand";
      brandGroup.style.display = "block";
      categoryGroup.style.display = "none";
      if (element) {
        // For a brand card, read its content
        document.getElementById("brandName").value = element.querySelector("h3").textContent;
        const originText = element.querySelector("p").textContent.replace("Origin: ", "");
        document.getElementById("brandOrigin").value = originText;
      } else {
        bcForm.reset();
      }
    } else if (type === "category") {
      modalTitle.textContent = element ? "Edit Category" : "Add Category";
      brandGroup.style.display = "none";
      categoryGroup.style.display = "block";
      if (element) {
        // For a category row, read the first two cells
        document.getElementById("categoryCode").value = element.cells[0].textContent;
        document.getElementById("categoryName").value = element.cells[1].textContent;
      } else {
        bcForm.reset();
      }
    }
  }

  // Close modal when clicking the close button or outside the modal
  closeModal.addEventListener("click", () => {
    bcModal.style.display = "none";
  });
  window.addEventListener("click", (e) => {
    if (e.target === bcModal) {
      bcModal.style.display = "none";
    }
  });

  // Attach event listeners to the Add buttons
  if (addBrandBtn) {
    addBrandBtn.addEventListener("click", () => {
      openModal("brand");
    });
  }
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener("click", () => {
      openModal("category");
    });
  }

  // Handle form submission for both brands and categories (existing code)
  bcForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!currentEditing) return;

    if (currentEditing.type === "brand") {
      const newBrandName = document.getElementById("brandName").value;
      const newOrigin = document.getElementById("brandOrigin").value;
      if (currentEditing.element) {
        // Edit existing brand card
        currentEditing.element.querySelector("h3").textContent = newBrandName;
        currentEditing.element.querySelector("p").textContent = "Origin: " + newOrigin;
      } else {
        // Create a new brand card and append it to the brand list
        const brandList = document.querySelector(".brand-list");
        const brandCard = document.createElement("div");
        brandCard.classList.add("brand-card");
        brandCard.innerHTML = `
          <div class="brand-avatar">
            <div class="default-avatar">${newBrandName.charAt(0).toUpperCase()}</div>
          </div>
          <h3>${newBrandName}</h3>
          <p>Origin: ${newOrigin}</p>
          <div class="card-actions">
            <i class="fa-solid fa-pen-to-square edit-brand"></i>
            <i class="fa-solid fa-trash delete-brand"></i>
          </div>
        `;
        brandList.appendChild(brandCard);

        // Attach event listener for edit on the new card
        brandCard.querySelector(".edit-brand").addEventListener("click", () => {
          openModal("brand", brandCard);
        });

        // Attach event listener for delete on the new card
        brandCard.querySelector(".delete-brand").addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this brand?")) {
            // Optionally, add API delete call here
            brandCard.remove();
          }
        });
      }
    } else if (currentEditing.type === "category") {
      const newCategoryCode = document.getElementById("categoryCode").value;
      const newCategoryName = document.getElementById("categoryName").value;
      if (currentEditing.element) {
        // Edit existing category row
        currentEditing.element.cells[0].textContent = newCategoryCode;
        currentEditing.element.cells[1].textContent = newCategoryName;
      } else {
        // Create a new row in the categories table
        const tableBody = document.querySelector(".categories-table tbody");
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
          <td>${newCategoryCode}</td>
          <td>${newCategoryName}</td>
          <td>
            <i class="fa-solid fa-pen-to-square edit-category"></i>
            <i class="fa-solid fa-trash delete-category"></i>
          </td>
        `;
        tableBody.appendChild(newRow);

        // Attach event listener for edit on the new row
        newRow.querySelector(".edit-category").addEventListener("click", () => {
          openModal("category", newRow);
        });

        // Attach event listener for delete on the new row
        newRow.querySelector(".delete-category").addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this category?")) {
            // Optionally, add API delete call here
            newRow.remove();
          }
        });
      }
    }
    bcModal.style.display = "none";
    bcForm.reset();
  });

  // --- Attach event listeners for existing static data ---
  // (These may no longer be needed if you remove the static examples from your HTML.)
  const existingEditBrands = document.querySelectorAll(".edit-brand");
  existingEditBrands.forEach(icon => {
    icon.addEventListener("click", () => {
      const brandCard = icon.closest(".brand-card");
      openModal("brand", brandCard);
    });
  });

  const existingDeleteBrands = document.querySelectorAll(".delete-brand");
  existingDeleteBrands.forEach(icon => {
    icon.addEventListener("click", () => {
      const brandCard = icon.closest(".brand-card");
      if (confirm("Are you sure you want to delete this brand?")) {
        brandCard.remove();
      }
    });
  });

  const existingEditCategories = document.querySelectorAll(".edit-category");
  existingEditCategories.forEach(icon => {
    icon.addEventListener("click", () => {
      const categoryRow = icon.closest("tr");
      openModal("category", categoryRow);
    });
  });

  const existingDeleteCategories = document.querySelectorAll(".delete-category");
  existingDeleteCategories.forEach(icon => {
    icon.addEventListener("click", () => {
      const categoryRow = icon.closest("tr");
      if (confirm("Are you sure you want to delete this category?")) {
        categoryRow.remove();
      }
    });
  });

  // --- NEW: Call the API Loading Functions ---
  // Add these calls at the end of the initBrandsCategories function so the data is loaded on page load.
  loadBrands();
  loadCategories();
}

// Expose the initialization function so it can be called externally
window.initBrandsCategories = initBrandsCategories;
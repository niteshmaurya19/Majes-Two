// Admin Configuration
const CONFIG = {
  whatsappNumber: "919648525366", // Replace with actual business WhatsApp number (include country code, e.g., 91 for India)
  web3FormsKey: CONFIG.WEB3FORMS_KEY // Paste Web3Forms Access Key here to enable email notifications
};

document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const header = document.querySelector("header");
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");
  const productGrid = document.getElementById("productGrid");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const navLinks = document.querySelectorAll(".nav-link");
  
  // Modal Elements
  const modal = document.getElementById("productModal");
  const modalClose = document.getElementById("modalClose");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalMaterials = document.getElementById("modalMaterials");
  const modalDesc = document.getElementById("modalDesc");
  const modalFeatures = document.getElementById("modalFeatures");
  const modalMeesho = document.getElementById("modalMeesho");
  const modalFlipkart = document.getElementById("modalFlipkart");
  const modalWhatsapp = document.getElementById("modalWhatsapp");

  // Custom Request Form
  const customForm = document.getElementById("customRequestForm");
  const submitWhatsappBtn = document.getElementById("submitWhatsapp");
  const submitEmailBtn = document.getElementById("submitEmail");

  // Toast Element
  const toast = document.getElementById("toast");
  const toastMessage = document.getElementById("toastMessage");

  // --- 1. Sticky Header ---
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    
    // Highlight nav link on scroll
    spyScroll();
  });

  // --- 2. Mobile Navigation Menu ---
  menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking nav link
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active");
      navMenu.classList.remove("active");
      
      // Update active class
      navLinks.forEach(l => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // --- 3. Scroll Spy (Active Nav Link) ---
  const sections = document.querySelectorAll("section[id]");
  function spyScroll() {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute("id");
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.add("active");
      } else {
        document.querySelector(`.nav-link[href*=${sectionId}]`)?.classList.remove("active");
      }
    });
  }

  // --- 4. Render Products in Grid ---
  function renderProducts(categoryFilter = "all") {
    productGrid.innerHTML = "";
    
    const filteredProducts = categoryFilter === "all" 
      ? PRODUCTS 
      : PRODUCTS.filter(p => p.category === categoryFilter);

    if (filteredProducts.length === 0) {
      productGrid.innerHTML = `<div class="no-products">No products found in this category.</div>`;
      return;
    }

    filteredProducts.forEach(product => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.setAttribute("data-aos", "fade-up");
      
      card.innerHTML = `
        <div class="product-img-container">
          <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
          <span class="product-category-tag">${product.category}</span>
        </div>
        <div class="product-info">
          <h3 class="product-name" data-id="${product.id}">${product.name}</h3>
          <span class="product-materials">Materials: ${product.materials}</span>
          <p class="product-card-desc">${product.description}</p>
          <div class="product-links">
            <a href="${product.meeshoUrl}" target="_blank" class="btn btn-meesho">Meesho</a>
            <a href="${product.flipkartUrl}" target="_blank" class="btn btn-flipkart">Flipkart</a>
          </div>
          <button class="product-quick-view" data-id="${product.id}">Quick View & Features</button>
        </div>
      `;
      productGrid.appendChild(card);
    });

    // Wire up Quick View listeners after rendering
    document.querySelectorAll(".product-quick-view, .product-name").forEach(element => {
      element.addEventListener("click", (e) => {
        const productId = parseInt(e.currentTarget.getAttribute("data-id"));
        openProductModal(productId);
      });
    });
  }

  // Initialize Showcase Catalog
  renderProducts();

  // --- 5. Catalog Category Filtering ---
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove("active"));
      // Add active class to clicked button
      btn.classList.add("active");
      
      const filterValue = btn.getAttribute("data-filter");
      renderProducts(filterValue);
    });
  });

  // --- 6. Modal Functions ---
  function openProductModal(id) {
    const product = PRODUCTS.find(p => p.id === id);
    if (!product) return;

    modalImg.src = product.image;
    modalImg.alt = product.name;
    modalTitle.textContent = product.name;
    modalMaterials.textContent = `Materials: ${product.materials}`;
    modalDesc.textContent = product.description;
    
    // Render features list
    modalFeatures.innerHTML = "";
    product.features.forEach(feature => {
      const li = document.createElement("li");
      li.textContent = feature;
      modalFeatures.appendChild(li);
    });

    // Setup URLs
    modalMeesho.href = product.meeshoUrl;
    modalFlipkart.href = product.flipkartUrl;
    
    // Construct pre-filled WhatsApp message for query
    const message = `Hello Majes Two! I am interested in purchasing/inquiring about your "${product.name}". (ID: ${product.id}). Could you please share more details?`;
    modalWhatsapp.href = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Show modal
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // Prevent background scroll
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.style.overflow = ""; // Re-enable scroll
  }

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Close modal on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  // --- 7. Toast Notification Handler ---
  function showToast(message, type = "success") {
    toastMessage.textContent = message;
    toast.style.borderLeftColor = type === "success" ? "var(--secondary)" : "var(--primary)";
    toast.classList.add("show");
    
    setTimeout(() => {
      toast.classList.remove("show");
    }, 4000);
  }

  // --- 8. Custom Product Request Form Handlers ---
  
  // Submit via WhatsApp
  submitWhatsappBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const details = document.getElementById("custDetails").value.trim();

    const text = `Hello Majes Two! 🌸\n\nI would like to request a Custom Resin Piece:\n\n*Name:* ${name}\n*Contact:* ${phone}\n*Request Details:* ${details}`;
    
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
    
    // Open in new tab
    window.open(whatsappUrl, "_blank");
    showToast("Opening WhatsApp to send your request!");
    customForm.reset();
  });

  // Submit via Email (Web3Forms Integration)
  submitEmailBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const details = document.getElementById("custDetails").value.trim();

    if (CONFIG.web3FormsKey === "YOUR_ACCESS_KEY_HERE" || !CONFIG.web3FormsKey) {
      showToast("Email submission is not configured by admin yet. Redirecting you to WhatsApp instead...", "warning");
      setTimeout(() => {
        submitWhatsappBtn.click();
      }, 2000);
      return;
    }

    submitEmailBtn.disabled = true;
    submitEmailBtn.textContent = "Sending Request...";

    try {
      const formData = new FormData();
      formData.append("access_key", CONFIG.web3FormsKey);
      formData.append("subject", `New Custom Resin Request from ${name}`);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("details", details);
      formData.append("from_name", "Majes Two Website");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const result = await response.json();
      if (result.success) {
        showToast("Custom request submitted successfully! We will email/call you soon.");
        customForm.reset();
      } else {
        showToast("Email submission failed. Redirecting to WhatsApp...", "warning");
        setTimeout(() => {
          submitWhatsappBtn.click();
        }, 1500);
      }
    } catch (error) {
      console.error("Submission error:", error);
      showToast("Something went wrong. Opening WhatsApp instead...", "warning");
      setTimeout(() => {
        submitWhatsappBtn.click();
      }, 1500);
    } finally {
      submitEmailBtn.disabled = false;
      submitEmailBtn.textContent = "Submit via Email";
    }
  });

  // Simple Form Validation
  function validateForm() {
    const name = document.getElementById("custName").value.trim();
    const phone = document.getElementById("custPhone").value.trim();
    const details = document.getElementById("custDetails").value.trim();

    if (!name) {
      showToast("Please enter your name.", "error");
      document.getElementById("custName").focus();
      return false;
    }
    if (!phone) {
      showToast("Please enter your contact number.", "error");
      document.getElementById("custPhone").focus();
      return false;
    }
    if (phone.length < 10) {
      showToast("Please enter a valid contact number.", "error");
      document.getElementById("custPhone").focus();
      return false;
    }
    if (!details) {
      showToast("Please describe what custom resin product you want.", "error");
      document.getElementById("custDetails").focus();
      return false;
    }
    return true;
  }
});

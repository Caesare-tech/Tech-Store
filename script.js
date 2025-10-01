/* script.js - handles UI interactions: alert, description modal, transaction modal, theme picker */
(function () {
  const alertEl = document.getElementById("global-alert"),
    alertText = alertEl?.querySelector(".alert-text"),
    alertClose = alertEl?.querySelector(".alert-close");
  const modal = document.getElementById("desc-modal"),
    modalTitle = document.getElementById("modal-title"),
    modalBody = document.getElementById("modal-body"),
    modalClose = modal?.querySelector(".modal-close");
  const transModal = document.getElementById("transaction-modal"),
    transForm = document.getElementById("transaction-form");
  const productPriceEl = document.getElementById("product-price"),
    shippingCostEl = document.getElementById("shipping-cost"),
    totalCostEl = document.getElementById("total-cost");
  const shippingRates = { lagos: 5, abuja: 7, portharcourt: 6, other: 10 };
  let currentProduct = { name: "", price: 0 };
  function showSuccess(productName) {
    if (!alertEl || !alertText) return;
    alertText.textContent = `You have successfully bought a product (${productName})`;
    alertEl.hidden = false;
    alertEl.classList.add("show");
    clearTimeout(alertEl._timeout);
    alertEl._timeout = setTimeout(() => {
      hideAlert();
    }, 1200);
    setTimeout(() => {
      const name = prompt("Enter your full name:");
      const account = prompt("Enter your account number:");
      const address = prompt("Enter your shipping address:");
      const location = prompt("Enter your location (for shipping cost):");
      const shippingCost = location?.toLowerCase().includes("lagos") ? 10 : 20;

      alert(`Summary:\n\nProduct: ${product}\nName: ${name}\nAccount: ${account}\nAddress: ${address}\nLocation: ${location}\nShipping: $${shippingCost}`);
    }, 500);
  };
  function hideAlert() {
    if (!alertEl) return;
    alertEl.classList.remove("show");
    setTimeout(() => {
      if (alertEl) alertEl.hidden = true;
    }, 180);
  }
  if (alertClose) alertClose.addEventListener("click", hideAlert);
  function openModal(title, bodyHtml) {
    if (!modal) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = bodyHtml;
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    if (!modal) return;
    modal.setAttribute("aria-hidden", "true");
  }
  if (modalClose) modalClose.addEventListener("click", closeModal);
  modal?.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  function openTransaction(productName, productPrice) {
    if (!transModal) return;
    currentProduct = { name: productName, price: productPrice };
    productPriceEl.textContent = `$${productPrice}`;
    shippingCostEl.textContent = "$0";
    totalCostEl.textContent = `$${productPrice}`;
    transForm?.reset();
    transModal.setAttribute("aria-hidden", "false");
  }
  function closeTransaction() {
    if (!transModal) return;
    transModal.setAttribute("aria-hidden", "true");
  }
  transModal?.addEventListener("click", (e) => {
    if (e.target === transModal) closeTransaction();
  });
  transModal
    ?.querySelectorAll(".modal-close")
    .forEach((btn) => btn.addEventListener("click", closeTransaction));
  transForm?.location?.addEventListener("change", (e) => {
    const shipping = shippingRates[e.target.value] || 0;
    shippingCostEl.textContent = `$${shipping}`;
    totalCostEl.textContent = `$${(currentProduct.price || 0) + shipping}`;
  });
  transForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(transForm);
    const details = Object.fromEntries(data.entries());
    console.log("Purchase:", details, currentProduct);
    alert(
      `n Purchase confirmed for ${currentProduct.name}.\nThank you, ${details.fullname}!`
    );
    closeTransaction();
  });
  document.querySelectorAll(".card").forEach((card) => {
    const nameEl = card.querySelector(".name");
    const productName = nameEl ? nameEl.textContent.trim() : "Product";
    const priceText = card.querySelector(".price")?.textContent || "$0";
    const productPrice = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 0;
    const addBtn = card.querySelector(".btn-add");
    if (addBtn) {
      addBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showSuccess(productName);
        setTimeout(() => {
          openTransaction(productName, productPrice);
        }, 1200);
      });
    }
    const descBtn = card.querySelector(".btn-desc");
    if (descBtn) {
      const desc =
        descBtn.dataset.desc ||
        card.querySelector(".long-desc")?.innerHTML ||
        "No description provided.";
      descBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(productName, desc);
      });
    }
  });
  // theme picker
  (function () {
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeMenu = document.getElementById("theme-menu");
    const themeOptions = document.querySelectorAll(".theme-option");
    const THEME_KEY = "techstore_theme";
    const body = document.body;
    function openMenu() {
      themeMenu.hidden = false;
      themeToggleBtn.setAttribute("aria-expanded", "true");
      themeOptions[0]?.focus();
    }
    function closeMenu() {
      themeMenu.hidden = true;
      themeToggleBtn.setAttribute("aria-expanded", "false");
    }
    function toggleMenu() {
      if (themeMenu.hidden) openMenu();
      else closeMenu();
    }
    document.addEventListener("click", (e) => {
      if (!themeToggleBtn.contains(e.target) && !themeMenu.contains(e.target))
        closeMenu();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
    themeToggleBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMenu();
    });
    function applyTheme(name) {
      body.classList.remove("theme-cyan", "theme-violet", "theme-amber");
      if (name === "cyan") body.classList.add("theme-cyan");
      if (name === "violet") body.classList.add("theme-violet");
      if (name === "amber") body.classList.add("theme-amber");
      try {
        localStorage.setItem(THEME_KEY, name);
      } catch (e) {}
    }
    themeOptions.forEach((btn) => {
      btn.addEventListener("click", () => {
        applyTheme(btn.dataset.theme);
        closeMenu();
      });
      btn.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          btn.click();
        }
      });
    });
    (function initTheme() {
      let saved = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch (e) {
        saved = null;
      }
      if (saved) {
        applyTheme(saved);
        return;
      }
      applyTheme("cyan");
    })();
  })();
})();

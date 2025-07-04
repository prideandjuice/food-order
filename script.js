
let cart = [];

document.addEventListener('DOMContentLoaded', function () {
  // ===== ELEMENT SELECTORS =====
  const searchWrapper = document.querySelector('.search-wrapper');
  const searchInputContainer = document.getElementById('search-input-container');
  const searchInput = document.getElementById('search-input');
  const searchCloseBtn = document.getElementById('search-close');
  const lihatMenuBtn = document.getElementById('lihat-menu-btn');
  const foodGrid = document.querySelector('.food-grid');
  const cartIcon = document.querySelector('.cart-wrapper');
  const modal = document.getElementById('cart-modal');

  // ===== DATA DENGAN DETAIL LENGKAP =====
  const foodData = [
    {
      name: 'Nasi Uduk Telur',
      price: 'Rp 17.500',
      originalPrice: 17500,
      discount: 0,
      description: 'Nasi gurih dengan santan, telur goreng, dan sambal'
    },
    {
      name: 'Lontong Sayur Komplit',
      price: 'Rp 17.500',
      originalPrice: 17500,
      discount: 0,
      description: 'Lontong dengan kuah santan dan sayur labu'
    },
    {
      name: 'Nasi Uduk Ayam Goreng',
      price: 'Rp 20.500',
      originalPrice: 20500,
      discount: 0,
      description: 'Nasi uduk dengan ayam goreng rempah khas'
    },
    {
      name: 'Ayam Bakar',
      price: 'Rp 16.000',
      originalPrice: 20000,
      discount: 20,
      description: 'Ayam bakar dengan bumbu spesial'
    }
  ];

  // ===== SEARCH FUNCTIONALITY =====
  function initializeSearch() {
    if (!searchWrapper || !searchInputContainer) return;

    searchWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
      searchInputContainer.style.display = 'flex';
      searchInputContainer.style.width = '0px';
      searchInputContainer.style.opacity = '0';
      setTimeout(() => {
        searchInputContainer.style.width = '250px';
        searchInputContainer.style.opacity = '1';
        searchInput.focus();
      }, 10);
      createSearchDropdown();
    });

    if (searchCloseBtn) {
      searchCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeSearch();
      });
    }

    document.addEventListener('click', (e) => {
      if (
        !searchInputContainer.contains(e.target) &&
        !searchWrapper.contains(e.target)
      ) {
        closeSearch();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && searchInputContainer.style.display === 'flex') {
        closeSearch();
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', performInlineSearch);
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          performInlineSearch();
        }
      });
    }

    function closeSearch() {
      searchInputContainer.style.width = '0px';
      searchInputContainer.style.opacity = '0';
      setTimeout(() => {
        searchInputContainer.style.display = 'none';
        searchInput.value = '';
        removeSearchDropdown();
      }, 300);
    }

    function createSearchDropdown() {
      removeSearchDropdown();
      const dropdown = document.createElement('div');
      dropdown.className = 'search-results-dropdown';
      dropdown.id = 'search-dropdown';
      dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #eee;
        border-radius: 8px;
        margin-top: 5px;
        max-height: 300px;
        overflow-y: auto;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 999;
        display: none;
      `;
      searchInputContainer.appendChild(dropdown);
    }

    function removeSearchDropdown() {
      const existingDropdown = document.getElementById('search-dropdown');
      if (existingDropdown) existingDropdown.remove();
    }

    function performInlineSearch() {
      const query = searchInput.value.toLowerCase().trim();
      const dropdown = document.getElementById('search-dropdown');
      if (!query) {
        if (dropdown) dropdown.style.display = 'none';
        return;
      }
      const results = foodData.filter(food =>
        food.name.toLowerCase().includes(query)
      );
      displayInlineSearchResults(results, query, dropdown);
    }

    function displayInlineSearchResults(results, query, dropdown) {
      if (!dropdown) return;
      if (results.length === 0) {
        dropdown.innerHTML = `
          <div style="padding: 20px; text-align: center; color: #666; font-size: 14px;">
            Tidak ada hasil untuk "${query}"
          </div>
        `;
        dropdown.style.display = 'block';
        return;
      }
      const resultsHTML = results
        .map(
          food => `
        <div onclick="selectInlineFood('${food.name}')" style="
          padding: 12px 15px;
          border-bottom: 1px solid #f5f5f5;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.2s ease;
        " onmouseover="this.style.background='#f9f9f9'" onmouseout="this.style.background='white'">
          <div>
            <div style="font-weight: 500; color: #333; font-size: 14px;">${food.name}</div>
            <div style="color: #f4c430; font-weight: 600; font-size: 12px;">${food.price}</div>
          </div>
          <span class="material-icons" style="color: #f4c430; font-size: 18px;">add_shopping_cart</span>
        </div>
      `
        )
        .join('');
      dropdown.innerHTML = resultsHTML;
      dropdown.style.display = 'block';
    }

    window.selectInlineFood = function (foodName) {
      closeSearch();
      if (foodGrid) foodGrid.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const foodCards = document.querySelectorAll('.food-card h3');
        foodCards.forEach(card => {
          if (card.textContent === foodName) {
            const foodCard = card.closest('.food-card');
            foodCard.style.transition = 'all 0.5s ease';
            foodCard.style.boxShadow = '0 10px 30px rgba(244, 196, 48, 0.5)';
            foodCard.style.transform = 'scale(1.05)';
            setTimeout(() => {
              foodCard.style.boxShadow = '';
              foodCard.style.transform = '';
            }, 2000);
          }
        });
      }, 500);
      showNotification(`Menampilkan ${foodName}`);
    };
  }

  // ===== NAVIGATION =====
  function initializeNavigation() {
    if (!lihatMenuBtn || !foodGrid) return;
    lihatMenuBtn.addEventListener('click', e => {
      e.preventDefault();
      foodGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // ===== UNIVERSAL ORDER SYSTEM (UNTUK SEMUA MAKANAN) =====
  function initializeOrderSystem() {
    // 1. Event listener untuk tombol "Tambah" pada setiap makanan
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', function (e) {
        e.preventDefault();
        const foodCard = button.closest('.food-card');
        const itemName = foodCard.querySelector('h3').textContent;
        const itemPrice = foodCard.querySelector('.price').textContent;
        showModal(itemName, itemPrice);
      });
    });

    // 2. Event listener untuk tombol "Pesan Sekarang" di section special offer (Ayam Bakar)
    const orderNowBtn = document.querySelector('.order-now-btn');
    if (orderNowBtn) {
      orderNowBtn.addEventListener('click', function (e) {
        e.preventDefault();
        directOrder('Ayam Bakar');
      });
    }

    // Modal event listeners
    document.getElementById('cancel-modal')?.addEventListener('click', closeModal);
    modal?.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }

  // ===== UNIVERSAL DIRECT ORDER FUNCTION =====
  function directOrder(itemName) {
    const foodItem = foodData.find(food => food.name === itemName);
    if (!foodItem) {
      showNotification('Makanan tidak ditemukan!', 'error');
      return;
    }
    const originalPrice = foodItem.originalPrice;
    const discount = foodItem.discount || 0;
    const discountAmount = originalPrice * (discount / 100);
    const finalPrice = originalPrice - discountAmount;
    const formatRupiah = amount =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);

    let confirmMessage = `🍽️ ${itemName.toUpperCase()} 🍽️\n\n`;
    confirmMessage += `${foodItem.description}\n\n`;
    confirmMessage += `Harga Normal: ${formatRupiah(originalPrice)}\n`;
    if (discount > 0) {
      confirmMessage += `Diskon ${discount}%: -${formatRupiah(discountAmount)}\n`;
      confirmMessage += `═════════════════════\n`;
      confirmMessage += `Harga Final: ${formatRupiah(finalPrice)}\n\n`;
      confirmMessage += `Hemat ${formatRupiah(discountAmount)}! 🎉\n\n`;
    } else {
      confirmMessage += `═════════════════════\n`;
      confirmMessage += `Total: ${formatRupiah(finalPrice)}\n\n`;
    }
    confirmMessage += `Apakah Anda ingin memesan sekarang?`;
    if (confirm(confirmMessage)) {
      const cartItem = discount > 0 ? `${itemName} (Diskon ${discount}%)` : itemName;
      cart.push(cartItem);
      updateCartBadge();
      if (discount > 0) {
        showOrderNotification(itemName, originalPrice, discount, discountAmount, finalPrice, foodItem.description);
      } else {
        showOrderNotification(itemName, originalPrice, 0, 0, finalPrice, foodItem.description);
      }
      // Animasi tombol jika ada
      const button = document.querySelector('.order-now-btn');
      if (button && itemName === 'Ayam Bakar') {
        animateOrderButton(button);
      }
    }
  }

  function showModal(itemName, itemPrice) {
    document.getElementById('modal-item-name').textContent = itemName;
    document.getElementById('modal-item-price').textContent = `Harga: ${itemPrice}`;
    modal.style.display = 'flex';
    document.getElementById('add-to-cart-confirm').onclick = () => addToCart(itemName);
    document.getElementById('order-now-confirm').onclick = () => {
      closeModal();
      directOrder(itemName);
    };
  }

  function addToCart(itemName) {
    cart.push(itemName);
    updateCartBadge();
    closeModal();
    showNotification(`${itemName} ditambahkan ke keranjang!`);
  }

  function updateCartBadge() {
    let badge = cartIcon.querySelector('.cart-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'cart-badge';
      badge.style.cssText = `
        position: absolute;
        top: -8px;
        right: -8px;
        background: #ff4444;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        transition: transform 0.2s ease;
      `;
      cartIcon.appendChild(badge);
    }
    badge.textContent = cart.length;
    badge.style.transform = 'scale(1.3)';
    setTimeout(() => (badge.style.transform = 'scale(1)'), 200);
  }

  function closeModal() {
    modal.style.display = 'none';
  }

  function animateOrderButton(button) {
    button.style.transform = 'scale(0.95)';
    const originalHTML = button.innerHTML;
    const originalBG = button.style.background;
    button.innerHTML = `
      <span class="material-icons">check_circle</span>
      Berhasil Dipesan!
    `;
    button.style.background = '#4CAF50';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
      button.innerHTML = originalHTML;
      button.style.background = originalBG;
    }, 2000);
  }

  // ===== NOTIFICATIONS =====
  function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
      <span class="material-icons">${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}</span>
      <span>${message}</span>
    `;
    notification.style.cssText = `
      position: fixed;
      top: 100px;
      right: 20px;
      background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 10px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10001;
      transform: translateX(400px);
      transition: transform 0.3s ease;
      font-family: 'Poppins', sans-serif;
    `;
    document.body.appendChild(notification);
    setTimeout(() => (notification.style.transform = 'translateX(0)'), 100);
    setTimeout(() => {
      notification.style.transform = 'translateX(400px)';
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ===== SPECIAL ORDER NOTIFICATION =====
  function showOrderNotification(itemName, originalPrice, discount, discountAmount, finalPrice, description) {
    const formatRupiah = amount =>
      new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
      }).format(amount);

    const notification = document.createElement('div');
    notification.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
        <span class="material-icons" style="color: #4CAF50; font-size: 28px;">check_circle</span>
        <h3 style="margin: 0; color: #333; font-size: 18px;">Pesanan Berhasil!</h3>
      </div>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
        <h4 style="margin: 0 0 5px 0; color: #333;">🍽️ ${itemName}</h4>
        <p style="margin: 0 0 10px 0; color: #666; font-size: 13px; font-style: italic;">${description}</p>
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
          <span>Harga Normal:</span>
          <span>${formatRupiah(originalPrice)}</span>
        </div>
        ${discount > 0
          ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 5px; color: #e74c3c;">
          <span>Diskon ${discount}%:</span>
          <span>-${formatRupiah(discountAmount)}</span>
        </div>`
          : ''}
        <hr style="margin: 10px 0; border: 1px solid #ddd;">
        <div style="display: flex; justify-content: space-between; font-weight: bold; color: #4CAF50; font-size: 16px;">
          <span>Total Bayar:</span>
          <span>${formatRupiah(finalPrice)}</span>
        </div>
      </div>
      ${
        discount > 0
          ? `
      <div style="text-align: center; color: #666; font-size: 14px;">
        💰 Anda hemat ${formatRupiah(discountAmount)}!
      </div>`
          : `
      <div style="text-align: center; color: #666; font-size: 14px;">
        🍽️ Terima kasih atas pesanan Anda!
      </div>`
      }
    `;
    notification.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.8);
      background: white;
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      z-index: 10002;
      min-width: 350px;
      max-width: 90vw;
      font-family: 'Poppins', sans-serif;
      border: 3px solid #4CAF50;
      opacity: 0;
      transition: all 0.3s ease;
    `;
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10001;
    `;
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 100);
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
      setTimeout(() => {
        notification.remove();
        overlay.remove();
      }, 300);
    }, 5000);
    overlay.addEventListener('click', () => {
      notification.style.opacity = '0';
      notification.style.transform = 'translate(-50%, -50%) scale(0.8)';
      setTimeout(() => {
        notification.remove();
        overlay.remove();
      }, 300);
    });
  }

  // ===== GLOBAL FUNCTIONS =====
  window.addToCartAndCloseModal = function () {
    updateCartBadge();
    closeModal();
  };

  // ===== INITIALIZE ALL =====
  initializeSearch();
  initializeNavigation();
  initializeOrderSystem();

  // Welcome message
  setTimeout(() => showNotification('Selamat datang di SarapanPagiMasBro! 🍽️'), 1000);
});

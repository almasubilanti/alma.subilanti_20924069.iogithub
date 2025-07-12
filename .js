document.addEventListener('DOMContentLoaded', function () {
  // Fungsi scroll halus saat klik link navbar
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetEl = document.querySelector(targetId);

      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Tombol scroll ke atas dari "Beranda"
  const shopNowBtn = document.getElementById('shop-now-btn');
  if (shopNowBtn) {
    shopNowBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const berandaLink = document.querySelector('.nav-links a[href="#hero"]');
      if (berandaLink) {
        navLinks.forEach(l => l.classList.remove('active'));
        berandaLink.classList.add('active');
      }
    });
  }

  // Fungsi menampilkan jumlah item di keranjang
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countEl = document.querySelector('.cart-count');
    if (countEl) countEl.textContent = cart.length;
  }

  // Fungsi hapus item dari keranjang
  function removeFromCart(itemName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== itemName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCart();
  }

  // Fungsi tampilkan isi keranjang belanja dalam modal
  function showCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let cartHTML = '<div class="cart-modal">';
    cartHTML += '<h3>Keranjang Belanja</h3>';

    if (cartItems.length === 0) {
      cartHTML += '<p>Keranjang Anda masih kosong</p>';
    } else {
      cartItems.forEach(item => {
        cartHTML += `
          <div class="cart-item">
            <span>${item.name}</span>
            <span>Rp ${item.price}</span>
            <button class="remove-item" data-name="${item.name}">&times;</button>
          </div>`;
      });

      const total = cartItems.reduce((sum, item) => sum + item.price, 0);
      cartHTML += `
        <div class="cart-total">
          <span>Total:</span>
          <span>Rp ${total}</span>
        </div>
        <button class="checkout-btn">Checkout</button>`;
    }

    cartHTML += '</div>';

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = cartHTML;
    document.body.appendChild(modalOverlay);

    // Event hapus item
    modalOverlay.querySelectorAll('.remove-item').forEach(btn => {
      btn.addEventListener('click', function () {
        const itemName = this.getAttribute('data-name');
        removeFromCart(itemName);
      });
    });

    // Tutup modal saat klik luar
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) {
        document.body.removeChild(modalOverlay);
      }
    });
  }

  // Event klik ikon keranjang
  const cartBtn = document.getElementById('cart-btn');
  if (cartBtn) {
    cartBtn.addEventListener('click', showCart);
  }

  // Fungsi tombol "Tambah ke Keranjang"
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', function () {
      const product = this.closest('.product-card');
      const name = product.querySelector('.product-title').textContent;
      const priceText = product.querySelector('.product-price').textContent;
      const price = parseInt(priceText.replace(/\D/g, ''), 10);

      let cart = JSON.parse(localStorage.getItem('cart')) || [];
      cart.push({ name, price });
      localStorage.setItem('cart', JSON.stringify(cart));

      updateCartCount();
      alert(`${name} telah ditambahkan ke keranjang!`);
    });
  });

  // Inisialisasi jumlah keranjang saat halaman dibuka
  updateCartCount();
});

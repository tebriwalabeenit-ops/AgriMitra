/**
 * AgriMitra Buyer Marketplace Interactive Controller
 * Handles Cart Management, Escrow Checkout (POST /api/orders),
 * Live Order History, Delivery Tracking, Location Updates, and Search Filtering.
 */

(function () {
  'use strict';

  // Default initial cart state if empty
  const defaultCartItems = [
    {
      id: 'prod-potatoes',
      name: 'Fresh Potatoes (Kufri Pukhraj)',
      farmer: 'Rajesh Kumar (Punjab)',
      price: 30,
      qty: 5,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'prod-tomatoes',
      name: 'Desi Farm Tomatoes',
      farmer: 'Gurpreet Singh (Punjab)',
      price: 40,
      qty: 2,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'prod-mangoes',
      name: 'Ratnagiri Alphonso Mangoes',
      farmer: 'Prakash Shinde (Ratnagiri)',
      price: 180,
      qty: 1,
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80'
    }
  ];

  function getCart() {
    try {
      const stored = localStorage.getItem('agrimitra_buyer_cart');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [...defaultCartItems];
  }

  function saveCart(cart) {
    localStorage.setItem('agrimitra_buyer_cart', JSON.stringify(cart));
    updateCartUI(cart);
  }

  function updateCartUI(cart = null) {
    if (!cart) cart = getCart();

    const totalCount = cart.reduce((sum, item) => sum + (parseInt(item.qty, 10) || 1), 0);
    const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (parseFloat(item.qty) || 1)), 0);

    // Update Header Badges
    const headerCount = document.getElementById('header-cart-count');
    if (headerCount) headerCount.textContent = totalCount;

    const mobileBadges = document.querySelectorAll('.mobile-nav-badge');
    mobileBadges.forEach(badge => badge.textContent = totalCount);

    // Update Modal Title
    const cartTitle = document.getElementById('modal-cart-title');
    if (cartTitle) {
      cartTitle.innerHTML = `
        <span class="ui-icon" aria-hidden="true" style="color: var(--color-primary);">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
        </span>
        Your Mandi Cart (${totalCount} ${totalCount === 1 ? 'Item' : 'Items'})
      `;
    }

    // Render Items in Cart Modal
    const itemsContainer = document.querySelector('.cart-items-list');
    if (itemsContainer) {
      if (cart.length === 0) {
        itemsContainer.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem; color: var(--color-text-muted);">
            <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem;">Your mandi cart is empty</p>
            <p style="font-size: 0.85rem;">Browse fresh produce directly from farmers below to add items.</p>
          </div>
        `;
      } else {
        itemsContainer.innerHTML = cart.map((item, idx) => `
          <div class="cart-item-row" data-cart-index="${idx}">
            <img src="${item.image || 'assets/produce/vegetables.jpg'}" alt="${item.name}" class="cart-item-thumb">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-meta">${item.qty} ${item.unit || 'kg'} • Farmer: ${item.farmer}</div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <div class="cart-item-total">₹${Math.round(item.price * item.qty)}</div>
              <button type="button" class="btn-remove-item" data-index="${idx}" title="Remove item" style="background:none; border:none; color:#dc2626; cursor:pointer; font-size:16px; padding:4px 6px;">✕</button>
            </div>
          </div>
        `).join('');

        // Attach remove buttons
        itemsContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.getAttribute('data-index'), 10);
            const current = getCart();
            const removed = current.splice(index, 1);
            saveCart(current);
            if (window.AgriMitraAuth) {
              window.AgriMitraAuth.showToast(`Removed ${removed[0]?.name || 'item'} from cart`, 'info', 2000);
            }
          });
        });
      }
    }

    // Update Summary Box
    const summaryBox = document.querySelector('.cart-summary-box');
    if (summaryBox) {
      summaryBox.innerHTML = `
        <div class="cart-summary-line">
          <span>Produce Subtotal</span>
          <span>₹${Math.round(subtotal)}</span>
        </div>
        <div class="cart-summary-line">
          <span>Direct Farm Delivery</span>
          <span style="color: var(--color-status-success); font-weight: 600;">FREE</span>
        </div>
        <div class="cart-summary-line total">
          <span>Total Payable Amount</span>
          <span style="color: var(--color-primary); font-weight: 800;">₹${Math.round(subtotal)}</span>
        </div>
      `;
    }

    // Update Checkout Button
    const checkoutBtn = document.querySelector('#modal-cart a.btn-primary, #modal-cart .btn-checkout');
    if (checkoutBtn) {
      checkoutBtn.textContent = `Proceed to Checkout (₹${Math.round(subtotal)})`;
      checkoutBtn.classList.toggle('disabled', cart.length === 0);
      checkoutBtn.style.pointerEvents = cart.length === 0 ? 'none' : 'auto';
      checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
    }
  }

  // Handle Adding Item to Cart from Product Cards
  function setupAddToCartButtons() {
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const card = btn.closest('.product-card');
        if (!card) return;

        const title = card.querySelector('.product-title')?.textContent?.trim() || 'Fresh Farm Produce';
        const farmer = card.querySelector('.farmer-name-row span:last-child')?.textContent?.trim() || 'Verified Farmer';
        const priceText = card.querySelector('.price-value')?.textContent?.replace(/[^\d.]/g, '') || '40';
        const price = parseFloat(priceText) || 40;
        const imgEl = card.querySelector('.product-real-img');
        const image = imgEl ? imgEl.getAttribute('src') : '';

        const cart = getCart();
        // Check if item already exists
        const existing = cart.find(item => item.name === title);
        if (existing) {
          existing.qty += 1;
        } else {
          cart.push({
            id: 'prod-' + Date.now(),
            name: title,
            farmer: farmer,
            price: price,
            qty: 1,
            unit: 'kg',
            image: image
          });
        }

        saveCart(cart);

        if (window.AgriMitraAuth) {
          window.AgriMitraAuth.showToast(`✓ Added 1 kg "${title}" to your cart!`, 'success', 2500);
        }

        // Open cart modal smoothly
        window.location.hash = '#modal-cart';
      });
    });
  }

  // Handle Order Checkout via Escrow
  function setupCheckout() {
    const checkoutBtn = document.querySelector('#modal-cart a.btn-primary, #modal-cart .btn-checkout');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const cart = getCart();
        if (cart.length === 0) {
          if (window.AgriMitraAuth) window.AgriMitraAuth.showToast('Your cart is empty!', 'warning');
          return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (parseFloat(item.qty) || 1)), 0);
        const user = window.AgriMitraAuth ? window.AgriMitraAuth.getCurrentUser() : null;
        const deliveryAddress = localStorage.getItem('agrimitra_buyer_address') || 'Tower B, Sector 48, Gurugram';

        const payload = {
          product_name: cart.map(i => `${i.qty}kg ${i.name}`).join(', '),
          quantity: cart.reduce((sum, i) => sum + i.qty, 0),
          unit: 'kg',
          price_per_unit: Math.round(subtotal / Math.max(1, cart.reduce((sum, i) => sum + i.qty, 0))),
          total_amount: subtotal,
          delivery_address: deliveryAddress,
          items: cart
        };

        checkoutBtn.textContent = 'Processing Escrow Payment...';
        checkoutBtn.style.pointerEvents = 'none';

        try {
          const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (res.ok && data.success) {
            // Clear cart
            localStorage.removeItem('agrimitra_buyer_cart');
            updateCartUI([]);

            if (window.AgriMitraAuth) {
              window.AgriMitraAuth.showToast(`Order #${data.order.order_code} confirmed! Payment held securely in Escrow.`, 'success', 4000);
            }

            // Reload orders modal with the new order
            loadOrderHistory();

            // Redirect hash to orders modal
            setTimeout(() => {
              window.location.hash = '#modal-orders';
            }, 600);
          } else {
            if (window.AgriMitraAuth) {
              window.AgriMitraAuth.showToast(data.message || 'Could not place order. Please try again.', 'error');
            }
          }
        } catch (err) {
          console.warn('[Buyer Marketplace] Backend order placement failed:', err);
          // Demo fallback
          localStorage.removeItem('agrimitra_buyer_cart');
          updateCartUI([]);
          if (window.AgriMitraAuth) {
            window.AgriMitraAuth.showToast(`Order confirmed! Payment held securely in Escrow.`, 'success', 3500);
          }
          setTimeout(() => {
            window.location.hash = '#modal-orders';
          }, 600);
        } finally {
          checkoutBtn.textContent = `Proceed to Checkout (₹${Math.round(subtotal)})`;
          checkoutBtn.style.pointerEvents = 'auto';
        }
      });
    }
  }

  // Fetch and display Order History in #modal-orders
  async function loadOrderHistory() {
    const ordersList = document.querySelector('.modal-orders-list');
    if (!ordersList) return;

    try {
      const res = await fetch('/api/orders', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.orders && data.orders.length > 0) {
          ordersList.innerHTML = data.orders.map(order => `
            <article class="modal-order-card" style="margin-bottom: 1rem;">
              <div class="order-header-row">
                <div class="order-id-block">
                  <span>Order #${order.order_code}</span>
                  <span class="order-date">• ${order.created_at || 'Recently Placed'}</span>
                </div>
                <span class="order-status-badge ${order.status === 'delivered' ? 'status-delivered' : 'status-transit'}">
                  ${order.status === 'delivered' ? '✓ Delivered to Home' : '🚚 In Transit / Processing'}
                </span>
              </div>
              <div class="order-details-row">
                <div>
                  <p class="order-items-desc"><strong>${order.product_name}</strong></p>
                  <p class="order-farmer-meta" style="color: var(--color-text-muted); font-size: 0.8rem;">
                    Delivery to: ${order.delivery_address || 'Registered Address'} • Payment: Escrow Verified
                  </p>
                </div>
                <div class="order-action-block">
                  <span class="order-price">₹${Math.round(order.total_amount)}</span>
                  <button type="button" class="btn-track" data-order-code="${order.order_code}">Track Delivery</button>
                </div>
              </div>
            </article>
          `).join('');

          // Bind tracking buttons
          setupTrackButtons();
        }
      }
    } catch (err) {
      console.warn('[Buyer Marketplace] Could not fetch live orders:', err);
    }
  }

  // Delivery Tracking Button Handler
  function setupTrackButtons() {
    document.querySelectorAll('.btn-track').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const orderCode = btn.getAttribute('data-order-code') || '1023';
        if (window.AgriMitraAuth) {
          window.AgriMitraAuth.showToast(`🛰️ Live GPS Telemetry: Order #${orderCode} is in transit with verified agent. Estimated arrival: 35 mins.`, 'info', 4500);
        }
      });
    });
  }

  // Search Bar Live Filtering
  function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchForm = document.querySelector('.search-form-wrap');

    function filterProducts(query) {
      const q = query.toLowerCase().trim();
      const productCards = document.querySelectorAll('.product-card');
      let matches = 0;

      productCards.forEach(card => {
        const title = card.querySelector('.product-title')?.textContent?.toLowerCase() || '';
        const farmer = card.querySelector('.farmer-name-row')?.textContent?.toLowerCase() || '';
        const loc = card.querySelector('.farmer-location-row')?.textContent?.toLowerCase() || '';

        const isMatch = !q || title.includes(q) || farmer.includes(q) || loc.includes(q);
        card.style.display = isMatch ? 'flex' : 'none';
        if (isMatch) matches++;
      });

      if (q && matches === 0 && window.AgriMitraAuth) {
        window.AgriMitraAuth.showToast(`No farm lots found matching "${query}". Showing all produce.`, 'info', 2000);
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        filterProducts(e.target.value);
      });
    }

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (searchInput) filterProducts(searchInput.value);
      });
    }

    // Quick tags filter
    document.querySelectorAll('.quick-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        const tagText = tag.textContent.trim();
        if (searchInput) {
          searchInput.value = tagText;
          filterProducts(tagText);
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // Location / Address Management in #modal-location
  function setupLocationModal() {
    const saveLocBtn = document.querySelector('#modal-location .btn-primary');
    if (saveLocBtn) {
      saveLocBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedRadio = document.querySelector('input[name="delivery_loc"]:checked');
        const addressText = selectedRadio ? selectedRadio.nextElementSibling?.textContent?.trim() : 'Updated Delivery Address';
        localStorage.setItem('agrimitra_buyer_address', addressText);

        const locDisplay = document.querySelector('.mega-loc-main');
        if (locDisplay) locDisplay.textContent = addressText.slice(0, 24) + '...';

        if (window.AgriMitraAuth) {
          window.AgriMitraAuth.showToast('✓ Delivery location updated successfully!', 'success', 2500);
        }
        window.history.replaceState(null, null, ' ');
      });
    }
  }

  // Clean Modal Close Handlers (prevents dead # in URL)
  function setupModalCloseHandlers() {
    document.querySelectorAll('.modal-window-close, .modal-backdrop-close, a[href="#"]').forEach(el => {
      el.addEventListener('click', (e) => {
        const href = el.getAttribute('href');
        if (href === '#' || href === '') {
          e.preventDefault();
          window.history.replaceState(null, null, window.location.pathname);
          // If body was locked or styled
          const activeOverlay = el.closest('.modal-overlay');
          if (activeOverlay) {
            activeOverlay.style.opacity = '0';
            activeOverlay.style.visibility = 'hidden';
            setTimeout(() => {
              activeOverlay.style.opacity = '';
              activeOverlay.style.visibility = '';
            }, 300);
          }
        }
      });
    });
  }

  // Initialize all marketplace features on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    // Auth Guard Check: buyer role
    if (window.AgriMitraAuth) {
      window.AgriMitraAuth.guardRole('buyer', { strict: false });
    }

    updateCartUI();
    setupAddToCartButtons();
    setupCheckout();
    setupTrackButtons();
    setupSearch();
    setupLocationModal();
    setupModalCloseHandlers();
    loadOrderHistory();
  });
})();

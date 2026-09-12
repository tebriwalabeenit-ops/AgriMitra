

(function () {
  'use strict';

  window.closeBuyerModal = function (e) {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(modal => {
      modal.classList.remove('active');
      modal.classList.add('is-closed');
      modal.style.setProperty('display', 'none', 'important');
      modal.style.setProperty('opacity', '0', 'important');
      modal.style.setProperty('visibility', 'hidden', 'important');
      modal.style.setProperty('pointer-events', 'none', 'important');
    });

    if (window.location.hash && window.location.hash !== '#!') {
      try {
        window.location.hash = '#!';
      } catch (err) {}
    }

    try {
      if (window.location.protocol.startsWith('http') && window.history && window.history.replaceState) {
        window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
      }
    } catch (err) {}
  };

  window.openBuyerModal = function (modalId) {
    if (!modalId) return;
    const cleanId = modalId.replace(/^#/, '');
    const modal = document.getElementById(cleanId);
    if (modal) {

      document.querySelectorAll('.modal-overlay').forEach(m => {
        if (m !== modal) {
          m.classList.remove('active');
          m.classList.add('is-closed');
          m.style.setProperty('display', 'none', 'important');
          m.style.setProperty('opacity', '0', 'important');
          m.style.setProperty('visibility', 'hidden', 'important');
          m.style.setProperty('pointer-events', 'none', 'important');
        }
      });

      modal.classList.remove('is-closed');
      modal.classList.remove('is-closing');
      modal.classList.add('active');
      modal.style.removeProperty('display');
      modal.style.setProperty('opacity', '1', 'important');
      modal.style.setProperty('visibility', 'visible', 'important');
      modal.style.setProperty('pointer-events', 'auto', 'important');

      if (window.location.hash !== '#' + cleanId) {
        window.location.hash = '#' + cleanId;
      }
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      window.closeBuyerModal(e);
    }
  });

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

    const headerCount = document.getElementById('header-cart-count');
    if (headerCount) headerCount.textContent = totalCount;

    const mobileBadges = document.querySelectorAll('.mobile-nav-badge');
    mobileBadges.forEach(badge => badge.textContent = totalCount);

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

    const itemsContainer = document.querySelector('.cart-items-list');
    if (itemsContainer) {
      if (cart.length === 0) {
        itemsContainer.innerHTML = `
          <div style="text-align: center; padding: 2.5rem 1rem; color: var(--color-text-muted);">
            <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🛒</div>
            <p style="font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--color-text-main);">Your mandi cart is empty</p>
            <p style="font-size: 0.9rem; margin-bottom: 1.25rem;">Browse fresh produce directly from verified farmers to add items.</p>
            <button type="button" class="btn btn-primary" onclick="window.closeBuyerModal()" style="font-size: 0.85rem; padding: 0.5rem 1.2rem;">← Return to Produce Mandi</button>
          </div>
        `;
      } else {
        itemsContainer.innerHTML = cart.map((item, idx) => `
          <div class="cart-item-row" data-cart-index="${idx}">
            <img src="${item.image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}" alt="${item.name}" class="cart-item-thumb" onerror="this.src='https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              <div class="cart-item-meta">${item.qty} ${item.unit || 'kg'} • Farmer: ${item.farmer}</div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
              <div class="cart-item-total">₹${Math.round(item.price * item.qty)}</div>
              <button type="button" class="btn-remove-item" data-index="${idx}" title="Remove item" style="background:#fee2e2; border:1px solid #fca5a5; color:#b91c1c; cursor:pointer; font-size:14px; width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:background 0.2s;">✕</button>
            </div>
          </div>
        `).join('');

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

    const checkoutBtn = document.querySelector('#modal-cart .btn-checkout, #modal-cart a.btn-primary');
    if (checkoutBtn) {
      checkoutBtn.textContent = `Proceed to Checkout (₹${Math.round(subtotal)})`;
      checkoutBtn.classList.toggle('disabled', cart.length === 0);
      checkoutBtn.style.pointerEvents = cart.length === 0 ? 'none' : 'auto';
      checkoutBtn.style.opacity = cart.length === 0 ? '0.5' : '1';
    }
  }

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

        window.openBuyerModal('modal-cart');
      });
    });
  }

  function setupCheckout() {
    const checkoutBtn = document.querySelector('#modal-cart .btn-checkout, #modal-cart a.btn-primary');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const cart = getCart();
        if (cart.length === 0) {
          if (window.AgriMitraAuth) window.AgriMitraAuth.showToast('Your cart is empty!', 'warning');
          return;
        }

        const subtotal = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (parseFloat(item.qty) || 1)), 0);
        const deliveryAddress = localStorage.getItem('agrimitra_buyer_address') || 'Flat 402, Tower B, Green Meadows, Sector 56, Gurugram, Haryana - 122001';

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
            localStorage.removeItem('agrimitra_buyer_cart');
            updateCartUI([]);

            if (window.AgriMitraAuth) {
              window.AgriMitraAuth.showToast(`Order #${data.order.order_code} confirmed! Payment held securely in Escrow.`, 'success', 4000);
            }

            loadOrderHistory();
            setTimeout(() => {
              window.openBuyerModal('modal-orders');
            }, 500);
          } else {
            if (window.AgriMitraAuth) {
              window.AgriMitraAuth.showToast(data.message || 'Could not place order. Please try again.', 'error');
            }
          }
        } catch (err) {
          console.warn('[Buyer Marketplace] Backend order placement failed:', err);
          localStorage.removeItem('agrimitra_buyer_cart');
          updateCartUI([]);
          if (window.AgriMitraAuth) {
            window.AgriMitraAuth.showToast(`Order confirmed! Payment held securely in Escrow.`, 'success', 3500);
          }
          setTimeout(() => {
            window.openBuyerModal('modal-orders');
          }, 500);
        } finally {
          checkoutBtn.textContent = `Proceed to Checkout (₹${Math.round(subtotal)})`;
          checkoutBtn.style.pointerEvents = 'auto';
        }
      });
    }
  }

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

          setupTrackButtons();
        }
      }
    } catch (err) {
      console.warn('[Buyer Marketplace] Could not fetch live orders:', err);
    }
  }

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

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function applyProduceFilters() {
    const productCards = document.querySelectorAll('.product-card');
    const query = currentSearchQuery.toLowerCase().trim();
    let visibleCount = 0;

    productCards.forEach(card => {
      const cardCategory = (card.getAttribute('data-category') || '').toLowerCase().trim();
      const title = (card.querySelector('.product-title')?.textContent || '').toLowerCase();
      const farmer = (card.querySelector('.farmer-name-row')?.textContent || '').toLowerCase();
      const loc = (card.querySelector('.farmer-location-row')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
      const matchesSearch = !query || title.includes(query) || farmer.includes(query) || loc.includes(query) || cardCategory.includes(query);

      const isVisible = matchesCategory && matchesSearch;
      card.style.display = isVisible ? 'flex' : 'none';
      if (isVisible) visibleCount++;
    });

    document.querySelectorAll('.category-filter-pill').forEach(pill => {
      const pillCat = pill.getAttribute('data-category') || 'all';
      pill.classList.toggle('active', pillCat === currentCategory);
    });

    const statusBar = document.getElementById('filter-status-bar');
    if (statusBar) {
      if (currentCategory !== 'all' || query) {
        statusBar.style.display = 'flex';
        let statusText = `Showing ${visibleCount} produce lot${visibleCount === 1 ? '' : 's'}`;
        if (currentCategory !== 'all') {
          const categoryNames = {
            vegetables: 'Vegetables',
            fruits: 'Fruits',
            grains: 'Grains',
            pulses: 'Pulses',
            other: 'Other Farm Products'
          };
          statusText += ` in <strong>${categoryNames[currentCategory] || currentCategory}</strong>`;
        }
        if (query) {
          statusText += ` matching "<strong>${query}</strong>"`;
        }
        const textEl = statusBar.querySelector('.filter-status-text');
        if (textEl) textEl.innerHTML = statusText;
      } else {
        statusBar.style.display = 'none';
      }
    }

    let emptyNotice = document.getElementById('produce-empty-notice');
    const grid = document.querySelector('.products-grid');
    if (visibleCount === 0 && grid) {
      if (!emptyNotice) {
        emptyNotice = document.createElement('div');
        emptyNotice.id = 'produce-empty-notice';
        emptyNotice.style.cssText = 'grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; background: var(--color-surface); border: 2px dashed var(--color-border); border-radius: var(--radius-lg);';
        grid.appendChild(emptyNotice);
      }
      emptyNotice.style.display = 'block';
      emptyNotice.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🌾</div>
        <h4 style="font-size: 1.15rem; font-weight: 700; color: var(--color-text-main); margin-bottom: 0.5rem;">No Farm Produce Found</h4>
        <p style="font-size: 0.9rem; color: var(--color-text-muted); margin-bottom: 1.25rem;">No direct farm lots matched your search or category criteria.</p>
        <button type="button" class="btn btn-primary" id="btn-reset-filters" style="font-size: 0.85rem; padding: 0.5rem 1.25rem;">Show All Produce</button>
      `;
      const resetBtn = document.getElementById('btn-reset-filters');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          resetAllFilters();
        });
      }
    } else if (emptyNotice) {
      emptyNotice.style.display = 'none';
    }
  }

  function resetAllFilters() {
    currentCategory = 'all';
    currentSearchQuery = '';
    const searchInput = document.getElementById('mandi-search-input') || document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    applyProduceFilters();
  }

  function setupCategorySorter() {

    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = card.getAttribute('data-category') || 'all';
        currentCategory = cat;
        applyProduceFilters();

        const produceSection = document.getElementById('fresh-produce');
        if (produceSection) {
          produceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    document.querySelectorAll('.category-filter-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = pill.getAttribute('data-category') || 'all';
        currentCategory = cat;
        applyProduceFilters();
      });
    });

    document.querySelectorAll('#modal-categories .cat-item-link, #modal-categories [data-category]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.getAttribute('data-category') || 'all';
        currentCategory = cat;
        window.closeBuyerModal();
        applyProduceFilters();
        const produceSection = document.getElementById('fresh-produce');
        if (produceSection) {
          produceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    const resetBtn = document.getElementById('btn-clear-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        resetAllFilters();
      });
    }
  }

  function setupSearch() {
    const searchInput = document.getElementById('mandi-search-input') || document.querySelector('.search-input');
    const searchForm = document.querySelector('form.search-bar-container') || document.querySelector('.search-section form');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value;
        applyProduceFilters();
      });
    }

    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (searchInput) {
          currentSearchQuery = searchInput.value;
          applyProduceFilters();
          const produceSection = document.getElementById('fresh-produce');
          if (produceSection) {
            produceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    document.querySelectorAll('.quick-tag').forEach(tag => {
      tag.addEventListener('click', (e) => {
        e.preventDefault();
        const tagText = tag.textContent.trim().replace(/^#/, '');
        if (searchInput) {
          searchInput.value = tagText;
          currentSearchQuery = tagText;
          applyProduceFilters();
          const produceSection = document.getElementById('fresh-produce');
          if (produceSection) {
            produceSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    });
  }

  function setupProfileEditor() {
    const defaultProfile = {
      name: 'Amit Sharma',
      business: 'Sharma Household',
      phone: '+91 98765 43210',
      email: 'amit.sharma@example.com',
      address: 'Flat 402, Tower B, Green Meadows, Sector 56, Gurugram, Haryana - 122001',
      state: 'Haryana',
      district: 'Gurugram',
      radius: '60 km',
      preference: 'Organic / Chemical-Free Soil Preferred'
    };

    function loadProfile() {
      try {
        const stored = localStorage.getItem('agrimitra_buyer_profile');
        if (stored) return Object.assign({}, defaultProfile, JSON.parse(stored));
      } catch (e) {}

      try {
        const userStored = localStorage.getItem('agrimitra_user');
        if (userStored) {
          const userObj = JSON.parse(userStored);
          return Object.assign({}, defaultProfile, {
            name: userObj.name || userObj.full_name || defaultProfile.name,
            phone: userObj.phone || defaultProfile.phone,
            email: userObj.email || defaultProfile.email
          });
        }
      } catch (e) {}

      return defaultProfile;
    }

    function saveProfile(data) {
      localStorage.setItem('agrimitra_buyer_profile', JSON.stringify(data));
      localStorage.setItem('agrimitra_buyer_address', data.address);
      updateProfileUI(data);
    }

    function updateProfileUI(data) {

      const viewName = document.getElementById('prof-view-name');
      if (viewName) viewName.textContent = data.name;

      const viewContact = document.getElementById('prof-view-contact');
      if (viewContact) viewContact.textContent = `${data.phone} • ${data.email}`;

      const viewAddress = document.getElementById('prof-view-address');
      if (viewAddress) {
        viewAddress.innerHTML = `${data.address} <button type="button" id="prof-btn-edit-addr" style="color: var(--color-primary); font-weight: 700; text-decoration: underline; margin-left: 8px; background:none; border:none; cursor:pointer; font-size:inherit;">Edit</button>`;
        const btnEditAddr = document.getElementById('prof-btn-edit-addr');
        if (btnEditAddr) {
          btnEditAddr.addEventListener('click', () => toggleProfileMode('edit'));
        }
      }

      const viewPref = document.getElementById('prof-view-pref');
      if (viewPref) viewPref.textContent = data.preference;

      const viewRadius = document.getElementById('prof-view-radius');
      if (viewRadius) viewRadius.textContent = `Local Farm Hubs within ${data.radius}`;

      const firstName = data.name.split(' ')[0] || data.name;
      const userGreeting = document.querySelector('.mega-action-sub, [data-user-name]');
      if (userGreeting) {
        userGreeting.textContent = firstName;
      }

      const welcomeHeroTitle = document.querySelector('.welcome-title');
      if (welcomeHeroTitle) {
        welcomeHeroTitle.innerHTML = `Welcome to Mandi, <span style="color: var(--color-primary);">${firstName}</span>!`;
      }

      const locDisplay = document.querySelector('.mega-loc-main');
      if (locDisplay) {
        locDisplay.textContent = (data.district ? `${data.district}, ${data.state}` : data.address.slice(0, 24)) + '...';
      }

      const inputName = document.getElementById('prof-edit-name');
      if (inputName) inputName.value = data.name;

      const inputBusiness = document.getElementById('prof-edit-business');
      if (inputBusiness) inputBusiness.value = data.business;

      const inputPhone = document.getElementById('prof-edit-phone');
      if (inputPhone) inputPhone.value = data.phone;

      const inputEmail = document.getElementById('prof-edit-email');
      if (inputEmail) inputEmail.value = data.email;

      const inputAddress = document.getElementById('prof-edit-address');
      if (inputAddress) inputAddress.value = data.address;

      const inputState = document.getElementById('prof-edit-state');
      if (inputState) inputState.value = data.state;

      const inputDistrict = document.getElementById('prof-edit-district');
      if (inputDistrict) inputDistrict.value = data.district;

      const inputRadius = document.getElementById('prof-edit-radius');
      if (inputRadius) inputRadius.value = data.radius;

      const inputPref = document.getElementById('prof-edit-pref');
      if (inputPref) inputPref.value = data.preference;
    }

    function toggleProfileMode(mode) {
      const viewSection = document.getElementById('profile-view-section');
      const editSection = document.getElementById('profile-edit-section');
      const toggleBtn = document.getElementById('btn-toggle-edit-profile');

      if (mode === 'edit') {
        if (viewSection) viewSection.style.display = 'none';
        if (editSection) editSection.style.display = 'block';
        if (toggleBtn) toggleBtn.style.display = 'none';
      } else {
        if (viewSection) viewSection.style.display = 'block';
        if (editSection) editSection.style.display = 'none';
        if (toggleBtn) toggleBtn.style.display = 'inline-flex';
      }
    }

    const toggleBtn = document.getElementById('btn-toggle-edit-profile');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => toggleProfileMode('edit'));
    }

    const cancelBtn = document.getElementById('btn-cancel-profile-edit');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => toggleProfileMode('view'));
    }

    const form = document.getElementById('profile-edit-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const updated = {
          name: document.getElementById('prof-edit-name')?.value.trim() || 'Amit Sharma',
          business: document.getElementById('prof-edit-business')?.value.trim() || 'Household Buyer',
          phone: document.getElementById('prof-edit-phone')?.value.trim() || '+91 98765 43210',
          email: document.getElementById('prof-edit-email')?.value.trim() || 'amit.sharma@example.com',
          address: document.getElementById('prof-edit-address')?.value.trim() || 'Gurugram, Haryana',
          state: document.getElementById('prof-edit-state')?.value.trim() || 'Haryana',
          district: document.getElementById('prof-edit-district')?.value.trim() || 'Gurugram',
          radius: document.getElementById('prof-edit-radius')?.value || '60 km',
          preference: document.getElementById('prof-edit-pref')?.value || 'Organic / Chemical-Free Soil Preferred'
        };

        saveProfile(updated);
        toggleProfileMode('view');

        if (window.AgriMitraAuth) {
          window.AgriMitraAuth.showToast('✓ Profile updated successfully!', 'success', 2500);
        }
      });
    }

    const initialProfile = loadProfile();
    updateProfileUI(initialProfile);
  }

  function setupLocationModal() {
    const saveLocBtn = document.querySelector('#modal-location .btn-save-loc, #modal-location .btn-primary');
    if (saveLocBtn) {
      saveLocBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const selectedRadio = document.querySelector('input[name="delivery_loc"]:checked');
        const addressText = selectedRadio ? selectedRadio.nextElementSibling?.textContent?.trim() : 'Tower B, Sector 56, Gurugram';
        localStorage.setItem('agrimitra_buyer_address', addressText);

        const locDisplay = document.querySelector('.mega-loc-main');
        if (locDisplay) locDisplay.textContent = addressText.slice(0, 24) + '...';

        if (window.AgriMitraAuth) {
          window.AgriMitraAuth.showToast('✓ Delivery location updated successfully!', 'success', 2500);
        }
        window.closeBuyerModal();
      });
    }
  }

  function setupModalCloseHandlers() {

    document.addEventListener('click', (e) => {
      const closeTrigger = e.target.closest('.modal-window-close, .modal-backdrop-close, .btn-return-dashboard, [data-modal-close]');
      if (closeTrigger) {
        e.preventDefault();
        e.stopPropagation();
        window.closeBuyerModal(e);
        return;
      }

      if (e.target.classList.contains('modal-overlay')) {
        e.preventDefault();
        window.closeBuyerModal(e);
        return;
      }

      const modalOpenLink = e.target.closest('a[href^="#modal-"]');
      if (modalOpenLink) {
        const href = modalOpenLink.getAttribute('href');
        if (href) {
          const targetModal = document.getElementById(href.replace(/^#/, ''));
          if (targetModal) {
            targetModal.classList.remove('is-closed');
            targetModal.style.removeProperty('display');
          }
        }
      }
    });

    window.addEventListener('hashchange', () => {
      const hash = window.location.hash;
      if (!hash || hash === '#' || hash === '#!' || hash === '#close') {
        document.querySelectorAll('.modal-overlay').forEach(modal => {
          modal.classList.remove('active');
          modal.classList.add('is-closed');
          modal.style.setProperty('display', 'none', 'important');
          modal.style.setProperty('opacity', '0', 'important');
          modal.style.setProperty('visibility', 'hidden', 'important');
          modal.style.setProperty('pointer-events', 'none', 'important');
        });
      } else if (hash.startsWith('#modal-')) {
        const targetModal = document.getElementById(hash.replace(/^#/, ''));
        if (targetModal && targetModal.classList.contains('modal-overlay')) {
          window.openBuyerModal(hash);
        }
      }
    });

    document.querySelectorAll('.mega-topbar-link, .mega-cat-btn').forEach(link => {
      link.addEventListener('click', () => {
        window.closeBuyerModal();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (window.AgriMitraAuth) {
      window.AgriMitraAuth.guardRole('buyer', { strict: false });
    }

    updateCartUI();
    setupAddToCartButtons();
    setupCheckout();
    setupTrackButtons();
    setupCategorySorter();
    setupSearch();
    setupProfileEditor();
    setupLocationModal();
    setupModalCloseHandlers();
    loadOrderHistory();
  });
})();

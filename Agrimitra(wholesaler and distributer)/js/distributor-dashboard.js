/* ==========================================================================
   AgriMitra Distributor Dashboard Controller
   Binds reactive state, unified modal interactions, procurement flow & chatbot
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // State Initialization
  // ------------------------------------------------------------------------
  let profile = window.AgriMitraStore ? window.AgriMitraStore.getProfile() : {};
  let requirements = window.AgriMitraStore ? window.AgriMitraStore.getRequirements() : [];
  let orders = window.AgriMitraStore ? window.AgriMitraStore.getOrders() : [];
  let inventory = window.AgriMitraStore ? window.AgriMitraStore.getInventory() : [];
  let supplyLots = window.AgriMitraStore ? window.AgriMitraStore.getSupplyLots() : [];
  let marketPrices = window.AgriMitraStore ? window.AgriMitraStore.getMarketPrices() : [];

  let selectedLotForPurchase = null;
  let purchaseQuantity = 1;

  // ------------------------------------------------------------------------
  // DOM Elements
  // ------------------------------------------------------------------------
  const headerBusinessNameEl = document.getElementById('header-business-name');
  const greetingBusinessNameEl = document.getElementById('greeting-business-name');
  const metricRequirementsCountEl = document.getElementById('metric-requirements-count');
  const metricOrdersCountEl = document.getElementById('metric-orders-count');
  const myRequirementsContainer = document.getElementById('my-requirements-list');
  const supplyLotsContainer = document.getElementById('supply-lots-grid');
  const recentOrdersContainer = document.getElementById('recent-orders-list');
  const inventoryTableBody = document.getElementById('inventory-table-body');
  const marketSnapshotContainer = document.getElementById('market-snapshot-list');

  // ------------------------------------------------------------------------
  // Initial Render
  // ------------------------------------------------------------------------
  renderHeaderAndGreeting();
  renderSummaryMetrics();
  renderRequirements();
  renderSupplyLots('all');
  renderRecentOrders();
  renderInventoryTable();
  renderMarketSnapshot();
  initSupplyFilters();
  initCreateRequirementForm();
  initChatbot();

  // ------------------------------------------------------------------------
  // Rendering Functions
  // ------------------------------------------------------------------------
  function renderHeaderAndGreeting() {
    const name = profile.businessName || 'MahaAgro Wholesale Dist.';
    if (headerBusinessNameEl) headerBusinessNameEl.textContent = name;
    if (greetingBusinessNameEl) greetingBusinessNameEl.textContent = name;
  }

  function renderSummaryMetrics() {
    if (metricRequirementsCountEl) {
      // Base count starts at 5 as requested in prompt, plus any user added requirements
      const count = requirements.length >= 2 ? requirements.length + 3 : 5;
      metricRequirementsCountEl.textContent = count;
    }
    if (metricOrdersCountEl) {
      const activeCount = orders.filter(o => o.currentStatus !== 'Delivered').length;
      metricOrdersCountEl.textContent = activeCount || 4;
    }
  }

  function renderRequirements() {
    if (!myRequirementsContainer) return;
    myRequirementsContainer.innerHTML = '';

    requirements.slice(0, 5).forEach(req => {
      const card = document.createElement('div');
      card.className = 'req-item-card';
      card.innerHTML = `
        <div class="req-item-main">
          <div class="req-crop-thumb">
            <img src="../../assets/images/${req.cropImage || 'produce-tomato.svg'}" alt="${req.crop}" onerror="this.src='../assets/images/${req.cropImage || 'produce-tomato.svg'}';">
          </div>
          <div>
            <div class="req-crop-name">${req.crop}</div>
            <div class="req-crop-meta">
              <span><strong>${req.quantity}</strong></span>
              <span>•</span>
              <span>${req.grade || 'Grade A'}</span>
              <span>•</span>
              <span>Up to ${req.maxPrice}</span>
              ${req.requiredBy ? `<span>•</span><span>Required by ${req.requiredBy}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="req-item-side">
          <span class="badge badge-green">${req.status || 'Open'}</span>
          <span class="btn btn-outline btn-sm" style="margin-top: 0.35rem;">View Details</span>
        </div>
      `;
      card.addEventListener('click', () => openRequirementDetailsModal(req));
      myRequirementsContainer.appendChild(card);
    });
  }

  function renderSupplyLots(filter = 'all') {
    if (!supplyLotsContainer) return;
    supplyLotsContainer.innerHTML = '';

    let lots = [...supplyLots];

    if (filter === 'price') {
      lots.sort((a, b) => a.pricePerKg - b.pricePerKg);
    } else if (filter === 'nearest') {
      lots.sort((a, b) => a.distanceKm - b.distanceKm);
    } else if (filter === 'largest') {
      lots.sort((a, b) => b.availableQty - a.availableQty);
    }

    lots.forEach(lot => {
      const lotCard = document.createElement('div');
      lotCard.className = 'supply-lot-card';
      lotCard.innerHTML = `
        <div>
          <div class="lot-top-row">
            <div>
              <div class="lot-title">${lot.crop}</div>
              <div class="lot-seller">Seller: ${lot.seller}</div>
            </div>
            <span class="badge badge-green">${lot.status}</span>
          </div>
          <div class="lot-details-grid">
            <div class="lot-detail-cell">
              <span class="lot-detail-label">Available</span>
              <span class="lot-detail-val">${lot.availableQty} ${lot.unit}</span>
            </div>
            <div class="lot-detail-cell">
              <span class="lot-detail-label">Grade</span>
              <span class="lot-detail-val">Grade ${lot.grade}</span>
            </div>
            <div class="lot-detail-cell">
              <span class="lot-detail-label">Farm Price</span>
              <span class="lot-detail-val">₹${lot.pricePerKg}/kg</span>
            </div>
            <div class="lot-detail-cell">
              <span class="lot-detail-label">Distance</span>
              <span class="lot-detail-val">${lot.distanceKm} km away</span>
            </div>
          </div>
        </div>
        <button class="btn btn-outline btn-sm btn-block btn-view-lot" type="button">
          View Lot
        </button>
      `;

      lotCard.querySelector('.btn-view-lot').addEventListener('click', (e) => {
        e.stopPropagation();
        openSupplyLotModal(lot);
      });

      supplyLotsContainer.appendChild(lotCard);
    });
  }

  function renderRecentOrders() {
    if (!recentOrdersContainer) return;
    recentOrdersContainer.innerHTML = '';

    orders.slice(0, 4).forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-mini-card';
      
      let badgeClass = 'badge-blue';
      if (order.currentStatus === 'Delivered') badgeClass = 'badge-green';
      if (order.currentStatus === 'In Transit') badgeClass = 'badge-amber';

      card.innerHTML = `
        <div class="order-mini-info">
          <span class="order-id-tag">${order.id}</span>
          <span class="order-crop-summary">${order.crop} — ${order.quantity}</span>
          <span class="order-supplier-name">Supplier: ${order.supplier}</span>
        </div>
        <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 0.35rem;">
          <span class="badge ${badgeClass}">${order.currentStatus}</span>
          <span style="font-size: var(--font-size-xs); font-weight: 700; color: var(--color-text-primary);">${order.pricePerKg}</span>
        </div>
      `;

      card.addEventListener('click', () => openOrderDetailsModal(order));
      recentOrdersContainer.appendChild(card);
    });
  }

  function renderInventoryTable() {
    if (!inventoryTableBody) return;
    inventoryTableBody.innerHTML = '';

    inventory.forEach(item => {
      const row = document.createElement('tr');
      row.style.cursor = 'pointer';
      row.innerHTML = `
        <td><strong>${item.crop}</strong></td>
        <td>${item.stock}</td>
        <td><span class="badge ${item.statusClass}">${item.status}</span></td>
      `;
      row.addEventListener('click', () => openCropInventoryModal(item));
      inventoryTableBody.appendChild(row);
    });
  }

  function renderMarketSnapshot() {
    if (!marketSnapshotContainer) return;
    marketSnapshotContainer.innerHTML = '';

    marketPrices.forEach(item => {
      const row = document.createElement('div');
      row.className = 'market-item-row';
      let trendClass = 'market-trend-stable';
      if (item.trendType === 'up') trendClass = 'market-trend-up';
      if (item.trendType === 'down') trendClass = 'market-trend-down';

      row.innerHTML = `
        <span class="market-crop-name">${item.crop}</span>
        <span class="market-crop-price">${item.price}</span>
        <span class="${trendClass}">${item.trend}</span>
      `;
      marketSnapshotContainer.appendChild(row);
    });
  }

  function initSupplyFilters() {
    const buttons = document.querySelectorAll('.filter-tab-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        renderSupplyLots(filter);
      });
    });
  }

  // ------------------------------------------------------------------------
  // MODAL LOGIC & BINDINGS
  // ------------------------------------------------------------------------

  // 1. Requirement Details Modal
  function openRequirementDetailsModal(req) {
    const modal = document.getElementById('modal-requirement-details');
    if (!modal) return;

    document.getElementById('modal-req-crop').textContent = req.crop;
    document.getElementById('modal-req-quantity').textContent = req.quantity;
    document.getElementById('modal-req-grade').textContent = req.grade || 'Grade A';
    document.getElementById('modal-req-maxprice').textContent = `Up to ${req.maxPrice}`;
    document.getElementById('modal-req-requiredby').textContent = req.requiredBy || 'Immediate';
    document.getElementById('modal-req-location').textContent = req.location || 'Within 50 km';
    document.getElementById('modal-req-status').textContent = req.status || 'Open';

    const btnFindSupply = document.getElementById('btn-req-find-supply');
    if (btnFindSupply) {
      btnFindSupply.onclick = () => {
        window.closeModal();
        setTimeout(() => openAvailableSupplyModal(req.crop), 200);
      };
    }

    window.openModal('modal-requirement-details');
  }

  // 2. Create Requirement Form
  function initCreateRequirementForm() {
    const form = document.getElementById('form-create-requirement');
    const formContainer = document.getElementById('create-req-form-wrap');
    const successContainer = document.getElementById('create-req-success-wrap');
    const btnDone = document.getElementById('btn-req-done');

    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const cropInput = document.getElementById('new-req-crop');
      const qtyInput = document.getElementById('new-req-qty');
      const gradeInput = document.getElementById('new-req-grade');
      const priceInput = document.getElementById('new-req-price');
      const dateInput = document.getElementById('new-req-date');
      const locationInput = document.getElementById('new-req-location');

      let isValid = true;
      if (!cropInput.value.trim()) {
        cropInput.classList.add('is-invalid');
        isValid = false;
      }
      if (!qtyInput.value.trim()) {
        qtyInput.classList.add('is-invalid');
        isValid = false;
      }
      if (!priceInput.value.trim()) {
        priceInput.classList.add('is-invalid');
        isValid = false;
      }

      if (!isValid) return;

      const newRequirement = {
        id: `REQ-${Date.now().toString().slice(-4)}`,
        crop: cropInput.value.trim(),
        quantity: `${qtyInput.value.trim()} tonnes`,
        grade: gradeInput.value || 'Grade A',
        maxPrice: `₹${priceInput.value.trim()}/kg`,
        priceNum: parseFloat(priceInput.value.trim()) || 30,
        requiredBy: dateInput.value.trim() || 'Flexible',
        location: locationInput.value.trim() || 'Within 50 km',
        status: 'Open',
        cropImage: getCropImage(cropInput.value.trim())
      };

      // Add to store
      if (window.AgriMitraStore) {
        requirements = window.AgriMitraStore.addRequirement(newRequirement);
      } else {
        requirements.unshift(newRequirement);
      }

      // Update UI
      renderRequirements();
      renderSummaryMetrics();

      // Show modal success state inside modal
      formContainer.style.display = 'none';
      successContainer.style.display = 'block';
    });

    if (btnDone) {
      btnDone.addEventListener('click', () => {
        window.closeModal();
        setTimeout(() => {
          // Reset form state
          form.reset();
          formContainer.style.display = 'block';
          successContainer.style.display = 'none';
        }, 250);
      });
    }
  }

  function getCropImage(cropName) {
    const name = cropName.toLowerCase();
    if (name.includes('tomato')) return 'produce-tomato.svg';
    if (name.includes('onion')) return 'produce-onion.svg';
    if (name.includes('potato')) return 'produce-potato.svg';
    if (name.includes('wheat') || name.includes('paddy')) return 'produce-paddy.svg';
    return 'produce-tomato.svg';
  }

  // 3. Supply Lot Modal & Ordering Stepper
  function openSupplyLotModal(lot) {
    selectedLotForPurchase = lot;
    purchaseQuantity = Math.min(1, lot.availableQty);

    document.getElementById('modal-lot-crop').textContent = lot.crop;
    document.getElementById('modal-lot-available').textContent = `${lot.availableQty} ${lot.unit}`;
    document.getElementById('modal-lot-grade').textContent = lot.grade;
    document.getElementById('modal-lot-price').textContent = `₹${lot.pricePerKg}/kg`;
    document.getElementById('modal-lot-distance').textContent = `${lot.distanceKm} km`;
    document.getElementById('modal-lot-seller').textContent = lot.seller;
    document.getElementById('modal-lot-transport').textContent = `₹${lot.transportCostPerKg.toFixed(2)}/kg`;
    document.getElementById('modal-lot-landed').textContent = `₹${lot.landedCostPerKg.toFixed(2)}/kg`;
    document.getElementById('modal-lot-status').textContent = lot.status;

    updateQuantityDisplay();

    // Wire Quantity Stepper
    const btnMinus = document.getElementById('btn-qty-minus');
    const btnPlus = document.getElementById('btn-qty-plus');

    btnMinus.onclick = () => {
      if (purchaseQuantity > 1) {
        purchaseQuantity -= 1;
        updateQuantityDisplay();
      }
    };

    btnPlus.onclick = () => {
      if (purchaseQuantity < lot.availableQty) {
        purchaseQuantity += 1;
        updateQuantityDisplay();
      }
    };

    // Wire Purchase Button
    const btnPurchase = document.getElementById('btn-purchase-lot');
    btnPurchase.onclick = () => {
      handleLotPurchase(lot, purchaseQuantity);
    };

    window.openModal('modal-supply-lot');
  }

  function updateQuantityDisplay() {
    const valEl = document.getElementById('lot-purchase-quantity-val');
    if (valEl) {
      valEl.textContent = `${purchaseQuantity} tonne${purchaseQuantity > 1 ? 's' : ''}`;
    }
  }

  function handleLotPurchase(lot, qty) {
    const totalAmount = Math.round(qty * 1000 * lot.pricePerKg);
    const orderId = `#A${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = {
      id: orderId,
      crop: `${lot.crop}s`,
      cropImage: lot.cropImage,
      quantity: `${qty} tonnes`,
      pricePerKg: `₹${lot.pricePerKg}/kg`,
      totalValue: `₹${totalAmount.toLocaleString('en-IN')}`,
      supplier: lot.seller,
      pickup: lot.location.split(',')[0],
      delivery: profile.city || 'Pune Central Warehouse',
      currentStatus: 'Offer Accepted',
      statusStep: 1,
      paymentStatus: 'Pending',
      deliveryAgent: 'AgriMitra Express Logistics',
      expectedArrival: '14 Sept, 12:00 PM'
    };

    if (window.AgriMitraStore) {
      orders = window.AgriMitraStore.addOrder(newOrder);
    } else {
      orders.unshift(newOrder);
    }

    renderRecentOrders();
    renderSummaryMetrics();

    window.closeModal();

    // Show Confirmation Modal
    setTimeout(() => {
      document.getElementById('confirm-order-id').textContent = newOrder.id;
      document.getElementById('confirm-order-crop').textContent = `${newOrder.quantity} of ${newOrder.crop}`;
      document.getElementById('confirm-order-total').textContent = newOrder.totalValue;
      window.openModal('modal-order-confirmed');
    }, 200);
  }

  // 4. Order Details Modal
  function openOrderDetailsModal(order) {
    document.getElementById('modal-order-id').textContent = order.id;
    document.getElementById('modal-order-crop').textContent = order.crop;
    document.getElementById('modal-order-quantity').textContent = order.quantity;
    document.getElementById('modal-order-price').textContent = order.pricePerKg;
    document.getElementById('modal-order-total').textContent = order.totalValue;
    document.getElementById('modal-order-supplier').textContent = order.supplier;
    document.getElementById('modal-order-pickup').textContent = order.pickup;
    document.getElementById('modal-order-delivery').textContent = order.delivery;
    document.getElementById('modal-order-payment').textContent = order.paymentStatus;
    document.getElementById('modal-order-agent').textContent = order.deliveryAgent;
    document.getElementById('modal-order-arrival').textContent = order.expectedArrival;

    // Update 4-step status tracker: Offer Accepted -> Pickup -> In Transit -> Delivered
    const steps = document.querySelectorAll('#order-details-stepper .order-step');
    steps.forEach((stepEl, idx) => {
      const stepIndex = idx + 1;
      stepEl.classList.remove('completed', 'current');
      if (stepIndex < order.statusStep) {
        stepEl.classList.add('completed');
      } else if (stepIndex === order.statusStep) {
        stepEl.classList.add('current');
      }
    });

    const btnTrack = document.getElementById('btn-track-order');
    if (btnTrack) {
      btnTrack.onclick = () => {
        alert(`Live tracking GPS signal active for agent: ${order.deliveryAgent}. Current location: Highway toll bypass.`);
      };
    }

    window.openModal('modal-order-details');
  }

  // 5. Crop Inventory Modal
  function openCropInventoryModal(item) {
    document.getElementById('modal-inv-crop').textContent = item.crop;
    document.getElementById('modal-inv-stock').textContent = item.stock;
    document.getElementById('modal-inv-incoming').textContent = item.incoming;
    document.getElementById('modal-inv-reserved').textContent = item.reserved;
    document.getElementById('modal-inv-available').textContent = item.available;

    const recentWrap = document.getElementById('modal-inv-recent-wrap');
    if (item.recentShipment) {
      document.getElementById('modal-inv-shipment-qty').textContent = item.recentShipment.qty;
      document.getElementById('modal-inv-shipment-supplier').textContent = item.recentShipment.supplier;
      document.getElementById('modal-inv-shipment-date').textContent = item.recentShipment.expected;
      recentWrap.style.display = 'block';
    } else {
      recentWrap.style.display = 'none';
    }

    window.openModal('modal-crop-inventory');
  }

  // 6. Available Supply Sourcing Modal
  function openAvailableSupplyModal(filterCrop = null) {
    const listContainer = document.getElementById('all-supply-modal-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    let lots = [...supplyLots];
    if (filterCrop) {
      const singular = filterCrop.toLowerCase().replace(/s$/, '');
      lots = lots.filter(l => l.crop.toLowerCase().includes(singular));
    }

    lots.forEach(lot => {
      const item = document.createElement('div');
      item.className = 'supply-lot-card';
      item.style.marginBottom = '0.75rem';
      item.innerHTML = `
        <div class="lot-top-row">
          <div>
            <div class="lot-title">${lot.crop} — ${lot.availableQty} tonnes (Grade ${lot.grade})</div>
            <div class="lot-seller">${lot.seller} • ${lot.distanceKm} km away</div>
          </div>
          <div style="text-align: right;">
            <span style="font-weight: 800; color: var(--color-primary); font-size: 1.125rem;">₹${lot.pricePerKg}/kg</span>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem;">
          <span style="font-size: var(--font-size-xs); color: var(--color-text-muted);">Est. Landed: ₹${lot.landedCostPerKg.toFixed(2)}/kg</span>
          <button class="btn btn-primary btn-sm btn-modal-view-lot">View Lot</button>
        </div>
      `;
      item.querySelector('.btn-modal-view-lot').onclick = () => {
        window.closeModal();
        setTimeout(() => openSupplyLotModal(lot), 200);
      };
      listContainer.appendChild(item);
    });

    window.openModal('modal-available-supply');
  }

  // 7. Profile Modal
  function openProfileModal() {
    document.getElementById('profile-business-name').textContent = profile.businessName || 'MahaAgro Wholesale Dist.';
    document.getElementById('profile-contact').textContent = profile.contactPerson || 'Rahul Deshmukh';
    document.getElementById('profile-phone').textContent = `+91 ${profile.phone || '9822019482'}`;
    document.getElementById('profile-type').textContent = profile.businessType || 'Wholesale & Distribution';
    document.getElementById('profile-location').textContent = `${profile.city || 'Market Yard, Pune'}, ${profile.district || 'Pune'}, ${profile.state || 'Maharashtra'}`;
    document.getElementById('profile-produce').textContent = Array.isArray(profile.mainProduce) ? profile.mainProduce.join(', ') : 'Tomato, Onion, Potato';
    document.getElementById('profile-capacity').textContent = profile.storageCapacity || 'Above 10 tonnes';

    window.openModal('modal-profile');
  }

  // Edit Profile Form Modal
  const btnEditProfile = document.getElementById('btn-edit-profile');
  if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
      window.closeModal();
      setTimeout(() => {
        document.getElementById('edit-prof-name').value = profile.businessName || '';
        document.getElementById('edit-prof-contact').value = profile.contactPerson || '';
        document.getElementById('edit-prof-phone').value = profile.phone || '';
        document.getElementById('edit-prof-city').value = profile.city || '';
        window.openModal('modal-edit-profile');
      }, 200);
    });
  }

  const formEditProfile = document.getElementById('form-edit-profile');
  if (formEditProfile) {
    formEditProfile.addEventListener('submit', (e) => {
      e.preventDefault();
      profile.businessName = document.getElementById('edit-prof-name').value.trim();
      profile.contactPerson = document.getElementById('edit-prof-contact').value.trim();
      profile.phone = document.getElementById('edit-prof-phone').value.trim();
      profile.city = document.getElementById('edit-prof-city').value.trim();

      if (window.AgriMitraStore) {
        window.AgriMitraStore.saveProfile(profile);
      }

      renderHeaderAndGreeting();
      window.closeModal();
      setTimeout(openProfileModal, 200);
    });
  }

  // ------------------------------------------------------------------------
  // Global Event Triggers for Dashboard
  // ------------------------------------------------------------------------
  // Recommended Procurement "View Supply" button
  const btnViewRecommended = document.getElementById('btn-view-recommended');
  if (btnViewRecommended) {
    btnViewRecommended.addEventListener('click', () => {
      // Open lot 904 (best match tomato)
      const bestLot = supplyLots.find(l => l.id === 'LOT-904') || supplyLots[0];
      openSupplyLotModal(bestLot);
    });
  }

  // Metric cards opening relevant modals
  const cardOpenReqs = document.getElementById('metric-card-requirements');
  if (cardOpenReqs) {
    cardOpenReqs.addEventListener('click', () => window.openModal('modal-all-requirements'));
  }

  const cardIncomingSupply = document.getElementById('metric-card-incoming');
  if (cardIncomingSupply) {
    cardIncomingSupply.addEventListener('click', () => window.openModal('modal-incoming-supply'));
  }

  const cardInventory = document.getElementById('metric-card-inventory');
  if (cardInventory) {
    cardInventory.addEventListener('click', () => window.openModal('modal-full-inventory'));
  }

  const cardOrders = document.getElementById('metric-card-orders');
  if (cardOrders) {
    cardOrders.addEventListener('click', () => window.openModal('modal-all-orders'));
  }

  // Header Nav & Profile Click
  const navProfileBtn = document.getElementById('header-profile-trigger');
  if (navProfileBtn) {
    navProfileBtn.addEventListener('click', openProfileModal);
  }

  // Quick Action Buttons
  const qaCreateReq = document.getElementById('qa-create-req');
  if (qaCreateReq) qaCreateReq.addEventListener('click', () => window.openModal('modal-create-requirement'));

  const qaFindSupply = document.getElementById('qa-find-supply');
  if (qaFindSupply) qaFindSupply.addEventListener('click', () => openAvailableSupplyModal());

  const qaViewInventory = document.getElementById('qa-view-inventory');
  if (qaViewInventory) qaViewInventory.addEventListener('click', () => window.openModal('modal-full-inventory'));

  const qaViewOrders = document.getElementById('qa-view-orders');
  if (qaViewOrders) qaViewOrders.addEventListener('click', () => window.openModal('modal-all-orders'));

  // ------------------------------------------------------------------------
  // CHATBOT: AgriMitra Assistant
  // ------------------------------------------------------------------------
  function initChatbot() {
    const triggerBtn = document.getElementById('chatbot-toggle-btn');
    const drawer = document.getElementById('chatbot-drawer');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const messagesWrap = document.getElementById('chatbot-messages');
    const chatForm = document.getElementById('chatbot-form');
    const chatInput = document.getElementById('chatbot-input');
    const promptButtons = document.querySelectorAll('.chat-action-btn');

    if (!triggerBtn || !drawer) return;

    triggerBtn.addEventListener('click', () => {
      drawer.classList.toggle('is-active');
      if (drawer.classList.contains('is-active')) {
        chatInput.focus();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('is-active');
      });
    }

    function appendMessage(sender, text, buttons = null) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${sender}`;

      let contentHtml = `<div class="chat-bubble">${text}</div>`;
      if (buttons && buttons.length > 0) {
        contentHtml += `<div class="chat-quick-actions">`;
        buttons.forEach(b => {
          contentHtml += `<button class="chat-action-btn" data-action="${b.action}">${b.label}</button>`;
        });
        contentHtml += `</div>`;
      }

      msgDiv.innerHTML = contentHtml;
      messagesWrap.appendChild(msgDiv);
      messagesWrap.scrollTop = messagesWrap.scrollHeight;

      // Handle chat button clicks
      msgDiv.querySelectorAll('.chat-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const act = btn.getAttribute('data-action');
          handleChatAction(act);
        });
      });
    }

    function handleChatAction(action) {
      if (action === 'view_supply') {
        openAvailableSupplyModal('Tomato');
      } else if (action === 'create_req') {
        window.openModal('modal-create-requirement');
      } else if (action === 'view_inventory') {
        window.openModal('modal-full-inventory');
      } else if (action === 'view_orders') {
        window.openModal('modal-all-orders');
      } else if (action === 'view_market') {
        window.openModal('modal-market-prices');
      }
    }

    function processUserInput(query) {
      const q = query.toLowerCase();
      appendMessage('user', query);

      setTimeout(() => {
        if (q.includes('onion') && (q.includes('tonne') || q.includes('need') || q.includes('buy'))) {
          appendMessage('bot', `I found 3 suitable supply options. Best match: 8 tonnes Grade A, ₹29/kg, 32 km away. You still need approximately 2 tonnes.`, [
            { label: 'View Supply', action: 'view_supply' },
            { label: 'Create Requirement', action: 'create_req' }
          ]);
        } else if (q.includes('tomato') && (q.includes('have') || q.includes('stock') || q.includes('how much'))) {
          appendMessage('bot', `You currently have 6.2 tonnes of tomatoes in inventory and 3 tonnes incoming.`, [
            { label: 'View Inventory', action: 'view_inventory' }
          ]);
        } else if (q.includes('find') && q.includes('tomato')) {
          appendMessage('bot', `Found 2 verified lots for Tomato: 6 tonnes from Nashik Farmers Collective (₹33/kg, 28 km) and 5.5 tonnes from Khadakwasla Group (₹33/kg, 24 km).`, [
            { label: 'View Supply Lots', action: 'view_supply' }
          ]);
        } else if (q.includes('inventory') || q.includes('stock')) {
          appendMessage('bot', `Current inventory: Tomatoes: 6.2 tonnes (Normal), Onions: 10.5 tonnes (High), Potatoes: 2.1 tonnes (Low). Total: 24.8 tonnes.`, [
            { label: 'Full Inventory', action: 'view_inventory' }
          ]);
        } else if (q.includes('order') || q.includes('incoming')) {
          appendMessage('bot', `You have 4 active orders. Order #A1048 (5 tonnes Tomatoes) is currently In Transit via Raj Transport, expected 12 Sept.`, [
            { label: 'View Orders', action: 'view_orders' }
          ]);
        } else if (q.includes('market') || q.includes('price')) {
          appendMessage('bot', `Current Mandi Prices: Tomato: ₹33/kg (↑ 4%), Onion: ₹29/kg (Stable), Potato: ₹24/kg (↓ 2%).`, [
            { label: 'Market Snapshot', action: 'view_market' }
          ]);
        } else {
          appendMessage('bot', `I can help you search verified produce lots, monitor wholesale inventory, or track pending deliveries. What would you like to check?`, [
            { label: 'Find Supply', action: 'view_supply' },
            { label: 'Check Inventory', action: 'view_inventory' },
            { label: 'View Orders', action: 'view_orders' }
          ]);
        }
      }, 400);
    }

    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const txt = chatInput.value.trim();
        if (!txt) return;
        chatInput.value = '';
        processUserInput(txt);
      });
    }

    promptButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.textContent.trim();
        processUserInput(text);
      });
    });
  }
});

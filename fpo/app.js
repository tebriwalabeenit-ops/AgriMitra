

const FPO_DATA = {
  organization: {
    name: "Nashik Farmers Collective",
    regNumber: "FPO #MH-NSK-401",
    location: "Nashik District, Maharashtra",
    farmersCount: 184,
    farmersMonthlyGrowth: 6,
    totalAvailableTonnes: 18.6,
    cropsCount: 4,
    activeLotsCount: 12,
    readyOffersCount: 4,
    buyerRequestsCount: 7,
    highPriorityRequests: 3
  },

  produce: [
    {
      id: "tomatoes",
      crop: "Tomatoes",
      quantityTonnes: 6.4,
      farmersCount: 23,
      grade: "Grade A",
      variety: "Abhinav Hybrid",
      location: "Nashik Central Hub Godown #2",
      harvestDate: "06 Sept 2026",
      farmers: [
        { name: "Ramesh Patil", village: "Dindori", qty: "420 kg", phone: "+91 98231 •••••" },
        { name: "Suresh Shinde", village: "Niphad", qty: "380 kg", phone: "+91 94222 •••••" },
        { name: "Dnyaneshwar Bhor", village: "Lasalgaon", qty: "510 kg", phone: "+91 98901 •••••" },
        { name: "Kishor Gaikwad", village: "Yeola", qty: "340 kg", phone: "+91 97633 •••••" },
        { name: "Ananda Jadhav", village: "Chandwad", qty: "450 kg", phone: "+91 99214 •••••" },
        { name: "Sunil Pawar", village: "Sinnar", qty: "290 kg", phone: "+91 98505 •••••" }
      ]
    },
    {
      id: "onions",
      crop: "Onions",
      quantityTonnes: 8.2,
      farmersCount: 31,
      grade: "Grade A",
      variety: "Garva Red Nasik",
      location: "Pimpalgaon Godown #4",
      harvestDate: "04 Sept 2026",
      farmers: [
        { name: "Balu Gaikwad", village: "Pimpalgaon", qty: "650 kg", phone: "+91 94211 •••••" },
        { name: "Eknath Chavan", village: "Lasalgaon", qty: "520 kg", phone: "+91 98224 •••••" },
        { name: "Shantaram More", village: "Niphad", qty: "480 kg", phone: "+91 97654 •••••" },
        { name: "Vitthal Sanap", village: "Sinnar", qty: "410 kg", phone: "+91 98907 •••••" }
      ]
    },
    {
      id: "potatoes",
      crop: "Potatoes",
      quantityTonnes: 4.0,
      farmersCount: 18,
      grade: "Grade B",
      variety: "Kufri Jyoti",
      location: "Dindori Storage Yard #1",
      harvestDate: "02 Sept 2026",
      farmers: [
        { name: "Prabhakar Deshmukh", village: "Dindori", qty: "550 kg", phone: "+91 98233 •••••" },
        { name: "Pandurang Kadam", village: "Trimbak", qty: "490 kg", phone: "+91 94200 •••••" }
      ]
    },
    {
      id: "wheat",
      crop: "Wheat",
      quantityTonnes: 2.1,
      farmersCount: 12,
      grade: "Grade A",
      variety: "Lokwan Sharbati",
      location: "Lasalgaon Silo #4",
      harvestDate: "28 Aug 2026",
      farmers: [
        { name: "Ramdas Thakare", village: "Kalwan", qty: "700 kg", phone: "+91 98501 •••••" },
        { name: "Gopal Joshi", village: "Deola", qty: "620 kg", phone: "+91 97622 •••••" }
      ]
    }
  ],

  buyers: {
    freshfoods: {
      name: "FreshFoods",
      crop: "Tomatoes",
      grade: "Grade A",
      quantityNeeded: "5 tonnes needed",
      quantityVal: 5.0,
      offer: "₹33/kg",
      offerRate: 33.0,
      requiredBy: "12 Sept",
      destination: "FreshFoods Cold Hub, 28 km",
      transportEst: "₹1.80/kg",
      transportRate: 1.80,
      netRealization: "₹31.20/kg",
      netRate: 31.20,
      matchType: "Strong Match",
      distanceKm: 28,
      terms: "100% Escrow secured. 30% on dispatch inspection, 70% on weighbridge acceptance.",
      totalExpectedPayout: "₹1,56,000"
    },
    retail_group: {
      name: "Maharashtra Retail Group",
      crop: "Onions",
      grade: "Grade A",
      quantityNeeded: "8 tonnes needed",
      quantityVal: 8.0,
      offer: "₹29/kg",
      offerRate: 29.0,
      requiredBy: "15 Sept",
      destination: "MRG Regional Logistics Center, 35 km",
      transportEst: "₹1.50/kg",
      transportRate: 1.50,
      netRealization: "₹27.50/kg",
      netRate: 27.50,
      matchType: "Good Match",
      distanceKm: 35,
      terms: "100% Escrow secured. Settlement within 24 hours of weighbridge confirmation.",
      totalExpectedPayout: "₹2,20,000"
    },
    hotel_supply: {
      name: "Hotel Supply Network",
      crop: "Potatoes",
      grade: "Grade A",
      quantityNeeded: "2 tonnes needed",
      quantityVal: 2.0,
      offer: "₹26/kg",
      offerRate: 26.0,
      requiredBy: "10 Sept",
      destination: "Nashik Urban Distribution Yard, 14 km",
      transportEst: "₹1.20/kg",
      transportRate: 1.20,
      netRealization: "₹24.80/kg",
      netRate: 24.80,
      matchType: "Standard Match",
      distanceKm: 14,
      terms: "Standard commercial credit escrow. Direct account NEFT on delivery.",
      totalExpectedPayout: "₹49,600"
    }
  },

  bulkLots: [
    {
      id: "FPO1048",
      crop: "Tomatoes",
      quantity: "5 tonnes",
      grade: "Grade A",
      farmersCount: 23,
      currentOffer: "₹33/kg",
      status: "Offer Received",
      statusClass: "status-offer-received",
      buyer: "FreshFoods"
    },
    {
      id: "FPO1047",
      crop: "Onions",
      quantity: "8 tonnes",
      grade: "Grade A",
      farmersCount: 31,
      currentOffer: "Awaiting offers",
      status: "Finding Buyers",
      statusClass: "status-finding-buyers",
      buyer: "None yet"
    }
  ]
};

let isLiveState = true;

document.addEventListener("DOMContentLoaded", () => {
  initMobileNavigation();
  initSidebarActiveLinks();
  initProduceFilters();
  initCreateLotModal();
});

function initMobileNavigation() {
  const menuBtn = document.getElementById("mobileMenuBtn");
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");

  if (!menuBtn || !sidebar || !backdrop) return;

  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    backdrop.classList.toggle("active");
  });

  backdrop.addEventListener("click", () => {
    sidebar.classList.remove("open");
    backdrop.classList.remove("active");
  });
}

function initSidebarActiveLinks() {
  const navItems = document.querySelectorAll(".sidebar-nav .nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", (e) => {
      const href = item.getAttribute("href");
      const section = item.getAttribute("data-section");

      if (href && !href.startsWith("#")) {
        window.location.href = href;
        return;
      }

      e.preventDefault();
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");

      handleSidebarNavigation(section);

      const sidebar = document.getElementById("sidebar");
      const backdrop = document.getElementById("sidebarBackdrop");
      if (sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        backdrop.classList.remove("active");
      }
    });
  });
}

function handleSidebarNavigation(section) {
  switch (section) {
    case "overview":
      window.scrollTo({ top: 0, behavior: "smooth" });
      showToast("Overview Dashboard view active");
      break;
    case "live-bidding":
    case "live-trading":
      const liveSec = document.getElementById("live-trading") || document.getElementById("live-bidding");
      if (liveSec) {
        liveSec.scrollIntoView({ behavior: "smooth", block: "start" });
        showToast("Displaying Live Bidding & Trading sessions");
      } else {
        window.location.href = "fpo-live-bidding.html";
      }
      break;
    case "farmers":
      scrollToElement("farmerActivitySection");
      showToast("Displaying 184 registered farmers & contributions");
      break;
    case "produce":
      scrollToElement("produceSection");
      showToast("Displaying 18.6 tonnes of available aggregated produce");
      break;
    case "buyers":
      scrollToElement("demandSection");
      showToast("Displaying 7 verified buyer procurement requests");
      break;
    case "orders":
      scrollToElement("ordersSection");
      showToast("Displaying active FPO fulfillment orders");
      break;
    case "payments":
      scrollToElement("paymentsSection");
      showToast("Displaying payments & escrow balances");
      break;
    case "profile":
      showToast("Nashik Farmers Collective · FPO #MH-NSK-401 (Verified)");
      break;
    default:
      break;
  }
}

function scrollToElement(id) {
  const el = document.getElementById(id);
  if (el) {
    const yOffset = -85;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

function handleMetricClick(type) {
  switch (type) {
    case "farmers":
      scrollToElement("farmerActivitySection");
      break;
    case "produce":
      scrollToElement("produceSection");
      break;
    case "lots":
      scrollToElement("lotsSection");
      break;
    case "buyers":
      scrollToElement("demandSection");
      break;
  }
}

function initProduceFilters() {
  const filterButtons = document.querySelectorAll("#produceFilterGroup .chip-filter");
  const tableRows = document.querySelectorAll("#produceTableBody tr");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const crop = btn.getAttribute("data-crop");
      tableRows.forEach(row => {
        if (crop === "all" || row.getAttribute("data-crop") === crop) {
          row.style.display = "";
        } else {
          row.style.display = "none";
        }
      });
    });
  });
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("open");
    document.body.style.overflow = "hidden";
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
  }
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-backdrop")) {
    e.target.classList.remove("open");
    document.body.style.overflow = "";
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal-backdrop.open").forEach(m => {
      m.classList.remove("open");
    });
    document.body.style.overflow = "";
  }
});

function initCreateLotModal() {
  const openBtn = document.getElementById("openCreateLotModalBtn");
  if (openBtn) {
    openBtn.addEventListener("click", openCreateLotModal);
  }
  updateLotFormCalculations();
}

function openCreateLotModal() {
  openModal("createLotModal");
  updateLotFormCalculations();
}

function updateLotFormCalculations() {
  const cropSelect = document.getElementById("lotCropSelect");
  const qtyInput = document.getElementById("lotQuantityInput");
  const priceInput = document.getElementById("lotReservePrice");

  if (!cropSelect || !qtyInput || !priceInput) return;

  const crop = cropSelect.value;
  const qty = parseFloat(qtyInput.value) || 1;
  const price = parseFloat(priceInput.value) || 20;

  let farmersPerTonne = 4;
  if (crop === "Tomatoes") farmersPerTonne = 4.6;
  if (crop === "Onions") farmersPerTonne = 3.9;
  if (crop === "Potatoes") farmersPerTonne = 4.5;
  if (crop === "Wheat") farmersPerTonne = 5.7;

  const estimatedFarmers = Math.min(Math.round(qty * farmersPerTonne), 35);
  const totalValuation = Math.round(qty * 1000 * price);

  const farmerCountEl = document.getElementById("calcFarmerCount");
  const lotValuationEl = document.getElementById("calcLotValuation");
  const matchBuyerEl = document.getElementById("calcMatchBuyer");

  if (farmerCountEl) farmerCountEl.textContent = `${estimatedFarmers} member farmers`;
  if (lotValuationEl) lotValuationEl.textContent = `₹${totalValuation.toLocaleString("en-IN")}`;

  if (matchBuyerEl) {
    if (crop === "Tomatoes" && price <= 33) {
      matchBuyerEl.textContent = "FreshFoods (5t @ ₹33/kg · Strong Match)";
      matchBuyerEl.className = "calc-val highlight";
    } else if (crop === "Onions" && price <= 29) {
      matchBuyerEl.textContent = "Maharashtra Retail Group (8t @ ₹29/kg · Good Match)";
      matchBuyerEl.className = "calc-val highlight";
    } else if (crop === "Potatoes" && price <= 26) {
      matchBuyerEl.textContent = "Hotel Supply Network (2t @ ₹26/kg)";
      matchBuyerEl.className = "calc-val highlight";
    } else {
      matchBuyerEl.textContent = "Will be listed to all 7 verified regional buyers";
      matchBuyerEl.className = "calc-val text-muted";
    }
  }
}

function handleCreateLotSubmit(event) {
  event.preventDefault();

  const crop = document.getElementById("lotCropSelect").value;
  const qty = document.getElementById("lotQuantityInput").value;
  const grade = document.getElementById("lotGradeSelect").value;
  const price = document.getElementById("lotReservePrice").value;

  const newLotId = "FPO1049";

  const newLot = {
    id: newLotId,
    crop: crop,
    quantity: `${qty} tonnes`,
    grade: grade,
    farmersCount: Math.round(parseFloat(qty) * 4),
    currentOffer: "Awaiting offers",
    status: "Finding Buyers",
    statusClass: "status-finding-buyers"
  };

  const lotsGrid = document.getElementById("lotsGrid");
  if (lotsGrid) {
    const lotCard = document.createElement("div");
    lotCard.className = "lot-card";
    lotCard.id = `lot-${newLotId}`;
    lotCard.innerHTML = `
      <div class="lot-header">
        <div>
          <div class="lot-id">Lot #${newLotId}</div>
          <div class="lot-crop-name">${newLot.crop}</div>
        </div>
        <span class="status-pill ${newLot.statusClass}">${newLot.status}</span>
      </div>
      <div class="lot-specs-list">
        <div class="lot-spec-row">
          <span class="lot-spec-name">Quantity</span>
          <span class="lot-spec-data font-bold">${newLot.quantity}</span>
        </div>
        <div class="lot-spec-row">
          <span class="lot-spec-name">Grade</span>
          <span class="lot-spec-data">${newLot.grade}</span>
        </div>
        <div class="lot-spec-row">
          <span class="lot-spec-name">Farmers</span>
          <span class="lot-spec-data">${newLot.farmersCount} farmers</span>
        </div>
        <div class="lot-spec-row">
          <span class="lot-spec-name">Target Price</span>
          <span class="lot-spec-data price">₹${price}/kg</span>
        </div>
      </div>
      <div class="lot-card-actions">
        <button class="secondary-btn sm-btn w-full" onclick="openLotDetail('${newLotId}')">
          View Lot
        </button>
      </div>
    `;

    lotsGrid.insertBefore(lotCard, lotsGrid.firstChild);
  }

  closeModal("createLotModal");
  showToast(`Bulk Lot #${newLotId} created with ${qty} tonnes of ${crop}. Listed to buyers.`);

  const metricCards = document.querySelectorAll(".metric-card .metric-value");
  if (metricCards[2]) {
    metricCards[2].textContent = "13";
  }
}

function openOpportunityDetail(buyerKey) {
  const buyer = FPO_DATA.buyers[buyerKey] || FPO_DATA.buyers.freshfoods;

  document.getElementById("oppModalTitle").textContent = `${buyer.name} — ${buyer.crop} Procurement Opportunity`;
  document.getElementById("oppModalSub").textContent = `Verified requirement · Delivery to ${buyer.destination}`;
  document.getElementById("oppModalMatchBadge").textContent = buyer.matchType;
  document.getElementById("oppModalCrop").textContent = `${buyer.crop} · ${buyer.grade}`;
  document.getElementById("oppModalQuantity").textContent = `${buyer.quantityVal}.0 tonnes`;
  document.getElementById("oppModalDate").textContent = `By ${buyer.requiredBy}`;
  document.getElementById("oppModalLocation").textContent = buyer.destination;
  document.getElementById("oppModalOffer").textContent = `${buyer.offer}`;
  document.getElementById("oppModalTransport").textContent = `- ${buyer.transportEst}`;
  document.getElementById("oppModalNet").textContent = `${buyer.netRealization}`;
  document.getElementById("oppModalTotalPayout").textContent = `${buyer.totalExpectedPayout}`;

  openModal("opportunityDetailModal");
}

function assignLotToOpportunity() {
  closeModal("opportunityDetailModal");
  showToast("Lot #FPO1048 formally assigned to FreshFoods procurement contract. Draft PO issued.");
}

function openProduceDetail(cropId) {
  const produceItem = FPO_DATA.produce.find(p => p.id === cropId) || FPO_DATA.produce[0];

  document.getElementById("produceModalTitle").textContent = `${produceItem.crop} Aggregated Stock`;
  document.getElementById("produceModalSub").textContent = `${produceItem.variety} · Stored at ${produceItem.location}`;
  document.getElementById("produceModalTotalQty").textContent = `${produceItem.quantityTonnes} tonnes`;
  document.getElementById("produceModalFarmers").textContent = `${produceItem.farmersCount} farmers`;
  document.getElementById("produceModalGrade").textContent = produceItem.grade;

  const contribList = document.getElementById("farmerContribList");
  if (contribList) {
    contribList.innerHTML = produceItem.farmers.map(f => `
      <div class="farmer-contrib-item">
        <div>
          <div class="font-bold text-primary">${f.name}</div>
          <div class="text-muted" style="font-size: 0.72rem;">${f.village} · ${f.phone}</div>
        </div>
        <span class="font-bold text-green">${f.qty}</span>
      </div>
    `).join("");
  }

  openModal("produceDetailModal");
}

function openLotDetail(lotId) {
  const lot = FPO_DATA.bulkLots.find(l => l.id === lotId) || {
    id: lotId,
    crop: "Aggregated Commodity",
    quantity: "5 tonnes",
    grade: "Grade A",
    farmersCount: 23,
    currentOffer: "Awaiting offer"
  };

  document.getElementById("lotDetailTitle").textContent = `Bulk Lot #${lot.id}`;
  document.getElementById("lotDetailCrop").textContent = `${lot.crop} · ${lot.quantity} · ${lot.grade}`;
  document.getElementById("lotDetailFarmers").textContent = `${lot.farmersCount} member farmers`;
  document.getElementById("lotDetailOffer").textContent = lot.currentOffer;

  openModal("lotDetailModal");
}

function openAllProduceView() {
  openModal("allProduceModal");
}

function openAllOrdersModal() {
  openModal("allOrdersModal");
}

function openAllPaymentsModal() {
  openModal("allPaymentsModal");
}

function openMarketPricesModal() {
  openModal("marketPricesModal");
}

const stateBtn = document.getElementById("toggleStateBtn");
const stateLabel = document.getElementById("stateModeLabel");

if (stateBtn) {
  stateBtn.addEventListener("click", () => {
    if (isLiveState) {
      simulateEmptyState();
    } else {
      resetStateToLive();
    }
  });
}

function simulateEmptyState() {
  isLiveState = false;
  if (stateLabel) stateLabel.textContent = "Empty State Demo";
  const dot = document.querySelector(".dot-indicator");
  if (dot) dot.classList.add("empty");

  const produceEmpty = document.getElementById("produceEmptyState");
  const produceTable = document.getElementById("produceTableContainer");
  if (produceEmpty && produceTable) {
    produceEmpty.classList.remove("hidden");
    produceTable.classList.add("hidden");
  }

  const demandEmpty = document.getElementById("demandEmptyState");
  const demandCards = document.getElementById("demandCardsGrid");
  if (demandEmpty && demandCards) {
    demandEmpty.classList.remove("hidden");
    demandCards.classList.add("hidden");
  }

  showToast("Demonstrating clean empty states for zero produce and zero buyer requests.");
}

function resetStateToLive() {
  isLiveState = true;
  if (stateLabel) stateLabel.textContent = "Live Data";
  const dot = document.querySelector(".dot-indicator");
  if (dot) dot.classList.remove("empty");

  const produceEmpty = document.getElementById("produceEmptyState");
  const produceTable = document.getElementById("produceTableContainer");
  if (produceEmpty && produceTable) {
    produceEmpty.classList.add("hidden");
    produceTable.classList.remove("hidden");
  }

  const demandEmpty = document.getElementById("demandEmptyState");
  const demandCards = document.getElementById("demandCardsGrid");
  if (demandEmpty && demandCards) {
    demandEmpty.classList.add("hidden");
    demandCards.classList.remove("hidden");
  }

  showToast("Reset to live data view with 18.6 tonnes of produce.");
}

function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `
    <span style="color: #10b981; font-weight: bold;">✓</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px)";
    toast.style.transition = "all 0.25s ease";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, 3200);
}

document.addEventListener('DOMContentLoaded', () => {
  try {
    const savedFpoName = localStorage.getItem('agriFpoName');
    if (savedFpoName) {
      const greetingEl = document.querySelector('.header-greeting');
      if (greetingEl) {
        greetingEl.textContent = `Good morning, ${savedFpoName}`;
      }
      const titleEl = document.querySelector('.fpo-title');
      if (titleEl) {
        titleEl.textContent = savedFpoName;
      }
      const avatarEl = document.querySelector('.header-avatar');
      if (avatarEl) {
        const initials = savedFpoName
          .split(' ')
          .map(w => w[0])
          .filter(Boolean)
          .slice(0, 2)
          .join('')
          .toUpperCase();
        if (initials) avatarEl.textContent = initials;
      }
    }
  } catch (err) {}
});

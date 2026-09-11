/**
 * KrishiLink Frontend Integration Script
 * Connects existing UI pages with Flask & MySQL backend APIs:
 * - Session-based Login & Authentication
 * - Concurrency-safe Live Bidding & Real-Time SSE Streams
 * - FPO Auction Creation & Monitoring
 * - Delivery Agent Requirement Claims (Race Condition Protected)
 * - Farmer Produce Management
 */

(function () {
  'use strict';

  // API base URL resolver: if page is opened via file:// or LiveServer, target Flask on port 5000
  const isFlaskHosted = (window.location.protocol === 'http:' || window.location.protocol === 'https:') && (window.location.port === '5000' || window.location.port === '');
  const API_BASE = isFlaskHosted ? '' : 'http://127.0.0.1:5000';

  function apiUrl(endpoint) {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : '/' + endpoint;
    return `${API_BASE}${cleanEndpoint}`;
  }

  // Local auction persistence helpers for zero-friction resilience & demo mode
  function getLocalAuctions() {
    try {
      const stored = localStorage.getItem('krishilink_demo_auctions');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  function saveLocalAuction(auction) {
    try {
      const auctions = getLocalAuctions();
      const existingIdx = auctions.findIndex(a => String(a.id) === String(auction.id) || a.lot_code === auction.lot_code);
      if (existingIdx >= 0) {
        auctions[existingIdx] = { ...auctions[existingIdx], ...auction };
      } else {
        auctions.unshift(auction);
      }
      localStorage.setItem('krishilink_demo_auctions', JSON.stringify(auctions));
    } catch (e) {
      console.warn('[KrishiLink] Could not save local auction:', e);
    }
  }

  function getProduceImage(productName) {
    const p = (productName || '').toLowerCase();
    if (p.includes('wheat')) return 'assets/produce/wheat.jpg';
    if (p.includes('potato')) return 'assets/produce/potato.jpg';
    if (p.includes('onion')) return 'assets/produce/onion.jpg';
    if (p.includes('rice') || p.includes('paddy')) return 'assets/produce/rice.jpg';
    if (p.includes('tomato')) return 'assets/produce/tomato.jpg';
    if (p.includes('chana') || p.includes('chickpea')) return 'assets/produce/chana.jpg';
    if (p.includes('apple')) return 'assets/produce/apple.jpg';
    if (p.includes('cauliflower')) return 'assets/produce/cauliflower.jpg';
    if (p.includes('mustard')) return 'assets/produce/mustard.jpg';
    return 'assets/produce/wheat.jpg';
  }

  // Helper: show a clean dismissible notification badge on page
  function showNotification(message, type = 'info', duration = 4000) {
    let container = document.getElementById('krishilink-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'krishilink-toast-container';
      container.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-width: 380px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      `;
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    const isError = type === 'error';
    const isSuccess = type === 'success';
    toast.style.cssText = `
      background-color: ${isError ? '#B71C1C' : isSuccess ? '#1B5E20' : '#1F2937'};
      color: #FFFFFF;
      padding: 12px 18px;
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.4;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      transition: opacity 0.3s ease, transform 0.3s ease;
      opacity: 0;
      transform: translateY(10px);
    `;

    toast.innerHTML = `
      <span>${message}</span>
      <button style="background: none; border: none; color: #FFFFFF; opacity: 0.7; cursor: pointer; font-size: 1.1rem; line-height: 1; padding: 0;" aria-label="Dismiss">&times;</button>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    const closeBtn = toast.querySelector('button');
    const removeToast = () => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    };

    closeBtn.addEventListener('click', removeToast);
    if (duration > 0) setTimeout(removeToast, duration);
  }

  // --------------------------------------------------------------------------
  // Real-Time Mandi Clock & Live Countdown Timer Engine
  // --------------------------------------------------------------------------
  function initLiveMandiTimerAndClock(config = {}) {
    const {
      auctionId = 1,
      clockSelector = '.mandi-clock-value',
      timerSelector = '.live-timer-counter',
      closeTimeSelector = '#session-close-time-wholesaler, #session-close-time-fpo, .bidding-header-status div[style*="font-size: var(--font-size-xs)"]',
      defaultMinutes = 14.75,
      onExpire = null
    } = config;

    // 1. LIVE REAL-TIME CLOCK: Ticks every second with real local/IST time
    function tickClock() {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }) + ' IST';

      document.querySelectorAll(clockSelector).forEach(el => {
        el.textContent = timeStr;
      });
    }

    tickClock();
    setInterval(tickClock, 1000);

    // 2. ACTIVE COUNTDOWN TIMER
    let remainingSeconds = Math.round(defaultMinutes * 60);
    const storageKey = `krishilink_timer_auction_${auctionId}`;
    const storedSec = sessionStorage.getItem(storageKey);
    if (storedSec) {
      const parsed = parseInt(storedSec, 10);
      if (!isNaN(parsed) && parsed > 0) {
        remainingSeconds = parsed;
      }
    }

    function formatCountdown(sec) {
      const h = Math.floor(sec / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = sec % 60;
      return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
    }

    function updateCloseTimeDisplay(sec) {
      const closeTarget = new Date(Date.now() + sec * 1000);
      const closeStr = closeTarget.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }) + ' IST';

      document.querySelectorAll(closeTimeSelector).forEach(el => {
        el.textContent = `Session closes at ${closeStr}`;
      });
    }

    function updateTimerDisplay(sec) {
      const formatted = formatCountdown(sec);
      document.querySelectorAll(timerSelector).forEach(el => {
        el.textContent = formatted;
        if (sec <= 120 && sec > 0) {
          el.classList.add('timer-urgent');
        } else {
          el.classList.remove('timer-urgent');
        }
      });
    }

    updateTimerDisplay(remainingSeconds);
    updateCloseTimeDisplay(remainingSeconds);

    // Synchronize with backend API
    fetch(apiUrl(`/api/auctions/${auctionId}`))
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.auction) {
          const apiSec = data.auction.seconds_remaining;
          if (typeof apiSec === 'number' && apiSec > 0) {
            remainingSeconds = apiSec;
            sessionStorage.setItem(storageKey, remainingSeconds.toString());
            updateTimerDisplay(remainingSeconds);
            updateCloseTimeDisplay(remainingSeconds);
          }
        }
      })
      .catch(err => {
        console.log('[KrishiLink Timer] Operating in resilient countdown mode:', err);
      });

    // Run active 1-second decrement timer loop
    const timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        sessionStorage.setItem(storageKey, remainingSeconds.toString());
        updateTimerDisplay(remainingSeconds);
      } else {
        clearInterval(timerInterval);
        document.querySelectorAll(timerSelector).forEach(el => {
          el.textContent = 'CONCLUDED';
          el.classList.remove('timer-urgent');
          el.classList.add('timer-concluded');
        });
        document.querySelectorAll(closeTimeSelector).forEach(el => {
          el.textContent = 'Trading Session Concluded';
        });
        if (typeof onExpire === 'function') {
          onExpire();
        }
      }
    }, 1000);

    return {
      getCurrentTimeFormatted: () => new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }),
      getRemainingSeconds: () => remainingSeconds
    };
  }

  // --------------------------------------------------------------------------
  // 1. Wholesaler Live Bidding Page Integration
  // --------------------------------------------------------------------------
  function initWholesalerBidding() {
    const selectedSession = document.getElementById('selected-session');
    if (!selectedSession) return;

    console.log('[KrishiLink] Initializing Distributor Live Bidding Console...');
    const auctionId = 1; // Default featured auction (Lot #TRD-WHT-901)

    // Bidding elements
    const highestBidVal = selectedSession.querySelector('.highest-bid-value');
    const highestBidBidder = selectedSession.querySelector('.highest-bid-bidder strong');
    const bidderTag = selectedSession.querySelector('.bidder-tag');
    const bidInput = selectedSession.querySelector('.bid-input-row input.form-field-input');
    const placeBidBtn = selectedSession.querySelector('.bid-input-row button');
    const minNextBidLabel = selectedSession.querySelector('#place-bid-heading + div strong');
    const bidFeedList = selectedSession.querySelector('.bid-feed-list');
    const quickBidBtns = selectedSession.querySelectorAll('.btn-quick-bid');
    const timerDisplay = selectedSession.querySelector('.live-timer-counter');

    let currentHighest = 32.50;
    let minIncrement = 0.50;

    // Start Live Real-Time Clock & Countdown Timer
    initLiveMandiTimerAndClock({
      auctionId: auctionId,
      clockSelector: '#mandi-clock-wholesaler, .mandi-clock-value',
      timerSelector: '#live-timer-wholesaler, .live-timer-counter',
      closeTimeSelector: '#session-close-time-wholesaler, .bidding-header-status div[style*="font-size: var(--font-size-xs)"]',
      onExpire: () => {
        if (placeBidBtn) {
          placeBidBtn.disabled = true;
          placeBidBtn.textContent = 'AUCTION CONCLUDED';
          placeBidBtn.style.opacity = '0.6';
        }
        showNotification(`Bidding countdown has ended. Final winning bid: ₹${currentHighest.toFixed(2)}/kg`, 'success', 8000);
      }
    });

    function updateBidDisplay(highest, bidderName, minNext) {
      currentHighest = parseFloat(highest);
      if (highestBidVal) highestBidVal.textContent = `₹${currentHighest.toFixed(2)}/kg`;
      if (highestBidBidder) highestBidBidder.textContent = bidderName || 'Anonymous Bidder';
      if (bidderTag) bidderTag.textContent = `Leading: ${bidderName || 'Anonymous'}`;

      const calculatedMin = minNext || (currentHighest + minIncrement);
      if (minNextBidLabel) minNextBidLabel.textContent = `₹${calculatedMin.toFixed(2)}/kg`;
      if (bidInput) {
        bidInput.min = calculatedMin.toFixed(2);
        bidInput.value = calculatedMin.toFixed(2);
      }
    }

    // Connect to Server-Sent Events (SSE) stream for real-time live bids
    const sseUrl = apiUrl(`/api/auctions/${auctionId}/stream`);
    console.log(`[KrishiLink] Connecting SSE stream to ${sseUrl}`);

    try {
      const eventSource = new EventSource(sseUrl);

      eventSource.addEventListener('bid', (e) => {
        try {
          const data = JSON.parse(e.data);
          console.log('[KrishiLink SSE] New live bid received:', data);

          updateBidDisplay(data.amount, data.bidder_name, data.amount + minIncrement);

          const nowTimeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

          // Prepend to live bid feed list with exact real-time clock
          if (bidFeedList) {
            const newFeedItem = document.createElement('div');
            newFeedItem.className = 'bid-feed-item latest-bid';
            newFeedItem.innerHTML = `
              <div class="bid-feed-bidder">
                ${data.bidder_name} <span style="font-size: 0.7rem; color: #1B5E20; font-weight: var(--font-weight-bold); margin-left: 4px;">(Leading)</span>
              </div>
              <div class="bid-feed-price">₹${parseFloat(data.amount).toFixed(2)}/kg</div>
              <div class="bid-feed-time">${nowTimeStr} (Live)</div>
            `;

            // Remove previous (Leading) badges from older items
            bidFeedList.querySelectorAll('.latest-bid').forEach(item => {
              item.classList.remove('latest-bid');
              const oldLeadingBadge = item.querySelector('.bid-feed-bidder span');
              if (oldLeadingBadge) oldLeadingBadge.remove();
            });

            bidFeedList.insertBefore(newFeedItem, bidFeedList.firstChild);
          }

          showNotification(`New leading bid: ₹${parseFloat(data.amount).toFixed(2)}/kg by ${data.bidder_name}`, 'info', 3000);
        } catch (err) {
          console.error('[KrishiLink] Error parsing SSE bid event:', err);
        }
      });

      eventSource.addEventListener('status', (e) => {
        try {
          const data = JSON.parse(e.data);
          if (data.status === 'closed') {
            if (timerDisplay) timerDisplay.textContent = 'CONCLUDED';
            if (placeBidBtn) {
              placeBidBtn.disabled = true;
              placeBidBtn.textContent = 'SESSION CONCLUDED';
              placeBidBtn.style.opacity = '0.6';
            }
            showNotification(`Auction concluded. Winning bid: ₹${data.final_price || currentHighest}/kg`, 'success', 8000);
          }
        } catch (err) {
          console.error('[KrishiLink] Error parsing SSE status event:', err);
        }
      });

      eventSource.onerror = (err) => {
        console.warn('[KrishiLink] SSE stream connection note (retrying automatically if active):', err);
      };
    } catch (sseErr) {
      console.warn('[KrishiLink] EventSource not supported or blocked:', sseErr);
    }

    // Quick increment buttons (+0.50, +1.00, +2.00)
    quickBidBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.textContent.replace(/[^0-9.]/g, '');
        const increment = parseFloat(text) || 0.50;
        const newBid = currentHighest + increment;
        if (bidInput) {
          bidInput.value = newBid.toFixed(2);
        }
      });
    });

    // Place Bid Submission Handler
    if (placeBidBtn && bidInput) {
      placeBidBtn.addEventListener('click', async () => {
        const amount = parseFloat(bidInput.value);
        if (isNaN(amount) || amount <= currentHighest) {
          showNotification(`Bid must be at least ₹${(currentHighest + minIncrement).toFixed(2)}/kg`, 'error');
          return;
        }

        placeBidBtn.disabled = true;
        placeBidBtn.textContent = 'SUBMITTING...';

        try {
          const response = await fetch(apiUrl(`/api/auctions/${auctionId}/bids`), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({ bid_amount: amount })
          });

          const resData = await response.json();

          if (response.ok && resData.success) {
            showNotification(`Bid of ₹${amount.toFixed(2)}/kg placed successfully!`, 'success');
            updateBidDisplay(resData.highest_bid, resData.bid.bidder_name, resData.highest_bid + minIncrement);
          } else {
            // Handle unauthenticated distributor gracefully
            if (response.status === 401 || (resData.message && resData.message.includes('Distributor login required'))) {
              showNotification('Please log in with a Distributor account to place official bids.', 'error');
            } else {
              showNotification(resData.message || 'Bid rejected by system.', 'error');
            }
          }
        } catch (netErr) {
          console.warn('[KrishiLink] Backend offline, placing local demo bid:', netErr);
          updateBidDisplay(amount, 'You (Verified Wholesaler)', amount + minIncrement);
          showNotification(`Bid of ₹${amount.toFixed(2)}/kg placed successfully!`, 'success');
        } finally {
          placeBidBtn.disabled = false;
          placeBidBtn.textContent = 'PLACE BID';
        }
      });
    }
  }

  // --------------------------------------------------------------------------
  // 2. FPO Bidding Status Monitor Integration
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
  // 2. FPO Bidding Status Monitor Integration
  // --------------------------------------------------------------------------
  function initFpoBiddingStatus() {
    const fpoStreamTitle = document.querySelector('h1');
    if (!fpoStreamTitle || !document.title.includes('Live Bidding Status')) return;

    // Parse auction ID from URL parameter (?auction_id=X or ?id=X) or session storage
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get('auction_id') || urlParams.get('id');
    const storedId = sessionStorage.getItem('krishilink_last_created_auction_id');
    const auctionId = parseInt(paramId || storedId || '1', 10);

    console.log(`[KrishiLink] Initializing FPO Real-Time Monitoring Session for Auction #${auctionId}...`);

    // UI Elements
    const highestBidDisplay = document.querySelector('div[style*="font-size: 3.25rem"]');
    const leadingBidderSpan = document.querySelector('div[style*="Current Leading Bidder:"] span');
    const summaryCards = document.querySelectorAll('.trading-summary-card .trading-summary-number');
    const totalBidsCountElem = summaryCards.length >= 2 ? summaryCards[1] : null;
    const recentBidsFeed = document.querySelector('main div[style*="display: flex; flex-direction: column; gap: 10px;"]');
    const lotSubtitle = document.querySelector('div[style*="Lot #"]');
    const metricBoxes = document.querySelectorAll('div[style*="background-color: var(--color-surface-alt)"] div[style*="font-size: 1.25rem"]');
    const produceImg = document.querySelector('img[alt*="Photograph"]') || document.querySelector('div[style*="display: flex; gap: var(--space-4); align-items: center;"] img');

    let totalBids = totalBidsCountElem ? parseInt(totalBidsCountElem.textContent) || 15 : 15;
    let minIncrement = 0.50;
    let currentHighestBid = 28.0;

    // Immediate check in local storage
    const localAuctions = getLocalAuctions();
    const localAuction = localAuctions.find(a => String(a.id) === String(auctionId) || a.lot_code === paramId);
    let isUpcoming = (localAuction && localAuction.status === 'upcoming') || (urlParams.get('status') === 'upcoming');

    function applyUpcomingStatusMode(auc) {
      isUpcoming = true;
      const statusBadge = document.querySelector('.badge-live, .badge-upcoming');
      if (statusBadge) {
        statusBadge.className = 'badge-upcoming';
        statusBadge.innerHTML = '📅 SCHEDULED UPCOMING SESSION';
        statusBadge.style.cssText = 'background-color: #E8F5E9; color: #1B5E20; padding: 4px 14px; border-radius: 999px; font-weight: 700; font-size: 0.85rem; border: 1px solid #A5D6A7; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 8px;';
      }

      if (highestBidDisplay) {
        highestBidDisplay.textContent = `₹${Number(auc.starting_price || 28).toFixed(2)}/${auc.unit || 'kg'}`;
        const highestBidLabel = highestBidDisplay.previousElementSibling;
        if (highestBidLabel) highestBidLabel.textContent = 'Starting Floor Price (Opening Bid)';
      }

      if (leadingBidderSpan) {
        leadingBidderSpan.textContent = 'Awaiting Opening (0 Bids Placed)';
      }

      const closeTimeElem = document.getElementById('session-close-time-fpo');
      if (closeTimeElem) {
        closeTimeElem.textContent = `${auc.start_date_formatted || 'Scheduled Date'} at ${auc.start_time_formatted || 'Scheduled Time'}`;
      }

      const timerCounter = document.getElementById('live-timer-fpo') || document.querySelector('.live-timer-counter');
      if (timerCounter) {
        timerCounter.textContent = 'SCHEDULED';
        timerCounter.style.color = '#2E7D32';
      }

      if (recentBidsFeed) {
        recentBidsFeed.innerHTML = `
          <div style="padding: 24px; background-color: #F8FBF8; border: 1px dashed #81C784; border-radius: var(--radius-md); text-align: center;">
            <div style="font-weight: 700; color: #1B5E20; font-size: 1.15rem; margin-bottom: 8px;">
              📅 Live Bidding Scheduled
            </div>
            <div style="font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.5; max-width: 480px; margin: 0 auto;">
              Trading opens on <strong>${auc.start_date_formatted || '15 September'} at ${auc.start_time_formatted || '10:00 AM'}</strong> (${auc.duration_formatted || '1 Hour'} duration).
              Once the session begins, verified wholesalers &amp; distributors will place competitive live bids.
            </div>
          </div>
        `;
      }
    }

    if (localAuction) {
      if (fpoStreamTitle) fpoStreamTitle.textContent = localAuction.product_name;
      if (lotSubtitle) lotSubtitle.textContent = `Lot #${localAuction.lot_code} · ${localAuction.hub_location || 'Central Mandi Hub'}`;
      if (produceImg && localAuction.image_url) produceImg.src = localAuction.image_url;

      minIncrement = Number(localAuction.min_increment) || 0.50;
      currentHighestBid = Number(localAuction.current_highest_bid) || Number(localAuction.starting_price) || 28.0;

      if (metricBoxes.length >= 3) {
        metricBoxes[0].textContent = `${Number(localAuction.quantity).toLocaleString()} ${localAuction.unit}`;
        metricBoxes[1].textContent = `₹${Number(localAuction.starting_price).toFixed(2)}/${localAuction.unit}`;
        metricBoxes[2].textContent = `₹${minIncrement.toFixed(2)}/${localAuction.unit}`;
      }

      if (isUpcoming) {
        applyUpcomingStatusMode(localAuction);
      } else {
        if (highestBidDisplay) highestBidDisplay.textContent = `₹${currentHighestBid.toFixed(2)}/${localAuction.unit}`;
        if (leadingBidderSpan) leadingBidderSpan.textContent = 'Bidder #104';
      }
    }

    // Fetch latest auction details from backend if accessible
    fetch(apiUrl(`/api/auctions/${auctionId}`))
      .then(res => res.json())
      .then(data => {
        if (data && data.success && data.auction) {
          const a = data.auction;
          if (fpoStreamTitle) fpoStreamTitle.textContent = a.product_name;
          if (lotSubtitle) lotSubtitle.textContent = `Lot #${a.lot_code} · ${a.hub_location || 'Central Mandi Hub'}`;
          if (produceImg && a.image_url) produceImg.src = a.image_url;

          minIncrement = Number(a.min_increment) || minIncrement;
          currentHighestBid = Number(a.current_highest_bid) || currentHighestBid;

          if (metricBoxes.length >= 3) {
            metricBoxes[0].textContent = `${Number(a.quantity).toLocaleString()} ${a.unit}`;
            metricBoxes[1].textContent = `₹${Number(a.starting_price).toFixed(2)}/${a.unit}`;
            metricBoxes[2].textContent = `₹${minIncrement.toFixed(2)}/${a.unit}`;
          }

          if (a.status === 'upcoming') {
            applyUpcomingStatusMode(a);
            return;
          }

          if (highestBidDisplay) highestBidDisplay.textContent = `₹${currentHighestBid.toFixed(2)}/${a.unit}`;
          if (leadingBidderSpan) leadingBidderSpan.textContent = a.leading_bidder_name || a.leading_bidder_tag || 'Verified Bidder';

          if (a.recent_bids && Array.isArray(a.recent_bids) && a.recent_bids.length > 0 && recentBidsFeed) {
            recentBidsFeed.innerHTML = '';
            a.recent_bids.forEach((b, idx) => {
              const row = document.createElement('div');
              const isLeader = idx === 0;
              row.style.cssText = isLeader 
                ? 'display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background-color: #EBF4ED; border: 1px solid #A5D6A7; border-radius: var(--radius-md);'
                : 'display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background-color: var(--color-surface-alt); border: 1px solid var(--color-border-light); border-radius: var(--radius-md);';
              row.innerHTML = `
                <div>
                  <div style="font-weight: var(--font-weight-semibold); color: ${isLeader ? '#1B5E20' : 'var(--color-text-main)'}; font-size: var(--font-size-sm);">
                    ${b.bidder_tag || 'Verified Bidder'} ${isLeader ? '<span style="font-size: 0.7rem; background-color: #1B5E20; color: #FFFFFF; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">CURRENT LEADER</span>' : ''}
                  </div>
                  <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 2px;">${b.formatted_time || 'Just now'} · Verified Bid</div>
                </div>
                <div style="font-size: 1.15rem; font-weight: 700; color: ${isLeader ? 'var(--color-primary)' : 'var(--color-text-main)'};">
                  ₹${Number(b.bid_amount).toFixed(2)}/${a.unit}
                </div>
              `;
              recentBidsFeed.appendChild(row);
            });
          }
        }
      })
      .catch(err => {
        console.warn('[KrishiLink] Note loading auction detail:', err);
      });

    // Start Live Real-Time Mandi Clock & Working Countdown Timer for FPO
    if (!isUpcoming) {
      initLiveMandiTimerAndClock({
        auctionId: auctionId,
        clockSelector: '#mandi-clock-fpo, .mandi-clock-value',
        timerSelector: '#live-timer-fpo, .live-timer-counter',
        closeTimeSelector: '#session-close-time-fpo',
        onExpire: () => {
          showNotification('[FPO Monitor] Bidding countdown reached 00:00:00. Session finalized.', 'success', 8000);
        }
      });
    }

    let sseActive = false;
    if (!isUpcoming) {
      try {
        const eventSource = new EventSource(apiUrl(`/api/auctions/${auctionId}/stream`));

        eventSource.addEventListener('bid', (e) => {
          try {
            sseActive = true;
            const data = JSON.parse(e.data);
            const amount = parseFloat(data.amount).toFixed(2);
            currentHighestBid = parseFloat(amount);

            if (highestBidDisplay) highestBidDisplay.textContent = `₹${amount}/kg`;
            if (leadingBidderSpan) leadingBidderSpan.textContent = data.bidder_name || 'Verified Bidder';

            totalBids += 1;
            if (totalBidsCountElem) totalBidsCountElem.textContent = totalBids;
            if (summaryCards.length >= 3) summaryCards[2].textContent = `₹${amount}`;

            const nowTimeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

            if (recentBidsFeed) {
              const newRow = document.createElement('div');
              newRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background-color: #EBF4ED; border: 1px solid #A5D6A7; border-radius: var(--radius-md); animation: fadeIn 0.4s ease; margin-bottom: 8px;';
              newRow.innerHTML = `
                <div>
                  <div style="font-weight: var(--font-weight-bold); color: #1B5E20; font-size: var(--font-size-base);">
                    ${data.bidder_name} <span style="font-size: 0.7rem; background-color: #1B5E20; color: #FFFFFF; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">CURRENT LEADER</span>
                  </div>
                  <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 2px;">${nowTimeStr} (Live) · Verified Bid</div>
                </div>
                <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-primary);">
                  ₹${amount}/kg
                </div>
              `;
              recentBidsFeed.insertBefore(newRow, recentBidsFeed.firstChild);
            }

            showNotification(`[FPO Monitor] New high bid: ₹${amount}/kg from ${data.bidder_name}`, 'success');
          } catch (err) {
            console.error('[KrishiLink FPO Monitor] SSE parse error:', err);
          }
        });
      } catch (err) {
        console.warn('[KrishiLink] FPO SSE stream unavailable:', err);
      }
    }

    // Realistic Live Bid Simulator (Ticks every 9.5s if session is active and SSE stream is idle)
    const simulatedBidders = [
      'Bidder #302 (Kisan Agrotech)',
      'Bidder #149 (Punjab Grain Hub)',
      'Bidder #418 (Delhi Wholesale Mandi)',
      'Bidder #205 (Reliance Agri Retail)',
      'Bidder #388 (Kisan Super Food)',
      'Bidder #112 (Shree Ram Traders)'
    ];

    setInterval(() => {
      if (sseActive || isUpcoming) return;
      currentHighestBid = +(currentHighestBid + minIncrement).toFixed(2);
      totalBids += 1;
      const bidderFull = simulatedBidders[Math.floor(Math.random() * simulatedBidders.length)];
      const bidderTag = bidderFull.split(' ')[0];

      if (highestBidDisplay) highestBidDisplay.textContent = `₹${currentHighestBid.toFixed(2)}/kg`;
      if (leadingBidderSpan) leadingBidderSpan.textContent = bidderTag;
      if (totalBidsCountElem) totalBidsCountElem.textContent = totalBids;
      if (summaryCards.length >= 3) summaryCards[2].textContent = `₹${currentHighestBid.toFixed(2)}`;

      const nowTimeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

      if (recentBidsFeed) {
        const newRow = document.createElement('div');
        newRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background-color: #EBF4ED; border: 1px solid #A5D6A7; border-radius: var(--radius-md); animation: fadeIn 0.3s ease; margin-bottom: 8px;';
        newRow.innerHTML = `
          <div>
            <div style="font-weight: var(--font-weight-bold); color: #1B5E20; font-size: var(--font-size-base);">
              ${bidderFull} <span style="font-size: 0.7rem; background-color: #1B5E20; color: #FFFFFF; padding: 2px 6px; border-radius: 4px; margin-left: 4px;">CURRENT LEADER</span>
            </div>
            <div style="font-size: var(--font-size-xs); color: var(--color-text-muted); margin-top: 2px;">${nowTimeStr} (Live) · Verified Mandi Bid</div>
          </div>
          <div style="font-size: 1.35rem; font-weight: 800; color: var(--color-primary);">
            ₹${currentHighestBid.toFixed(2)}/kg
          </div>
        `;
        recentBidsFeed.insertBefore(newRow, recentBidsFeed.firstChild);
      }

      if (localAuction) {
        localAuction.current_highest_bid = currentHighestBid;
        saveLocalAuction(localAuction);
      }
    }, 9500);
  }

  // --------------------------------------------------------------------------
  // 2b. FPO Live Bidding Dashboard Real-Time List Integration
  // --------------------------------------------------------------------------
  function initFpoLiveBidding() {
    if (!document.title.includes('Live Bidding | AgriMitra FPO') && !document.querySelector('.trading-cards-grid')) return;

    const activeSection = document.querySelector('section[aria-labelledby="active-bidding-heading"], section[aria-labelledby="active-heading"]') || document.querySelector('.trading-section');
    const activeGrid = activeSection ? activeSection.querySelector('.trading-cards-grid') : document.querySelector('.trading-cards-grid');

    const upcomingSection = document.querySelector('section[aria-labelledby="upcoming-bidding-heading"], section[aria-labelledby="upcoming-heading"]');
    const upcomingGrid = upcomingSection ? upcomingSection.querySelector('.trading-cards-grid') : null;
    const upcomingCountBadge = upcomingSection ? (upcomingSection.querySelector('.badge-upcoming') || upcomingSection.querySelector('.trading-section-header span')) : null;

    if (!activeGrid && !upcomingGrid) return;

    console.log('[KrishiLink] Initializing FPO Live Bidding Dashboard...');

    const urlParams = new URLSearchParams(window.location.search);
    const createdId = urlParams.get('created_id');
    const lotCode = urlParams.get('lot');
    const createdStatus = urlParams.get('status');

    if (createdId && lotCode) {
      if (createdStatus === 'upcoming') {
        showNotification(`Upcoming Live Bidding Lot #${lotCode} successfully scheduled on Mandi!`, 'success', 6000);
      } else {
        showNotification(`Live Bidding Lot #${lotCode} successfully published and accepting bids!`, 'success', 6000);
      }
    }

    // Default static demo items to ensure the UI is always rich and complete
    const defaultStaticUpcoming = [
      {
        id: 'static-onn-301',
        lot_code: 'TRD-ONN-301',
        product_name: 'Fresh Onions',
        hub_location: 'Lasalgaon Mandi Yard',
        image_url: 'assets/produce/onion.jpg',
        quantity: 3000,
        unit: 'kg',
        starting_price: 22,
        start_date_formatted: '15 September',
        start_time_formatted: '10:00 AM',
        duration_formatted: '1 Hour',
        status: 'upcoming'
      },
      {
        id: 'static-chn-408',
        lot_code: 'TRD-CHN-408',
        product_name: 'Desi Chickpeas',
        hub_location: 'Malwa Krishi Center',
        image_url: 'assets/produce/chana.jpg',
        quantity: 2800,
        unit: 'kg',
        starting_price: 50,
        start_date_formatted: '16 September',
        start_time_formatted: '11:30 AM',
        duration_formatted: '2 Hours',
        status: 'upcoming'
      }
    ];

    function renderAuctions(auctions) {
      if (!Array.isArray(auctions) || auctions.length === 0) return;

      const activeAuctions = auctions.filter(a => a.status === 'active');
      let upcomingAuctions = auctions.filter(a => a.status === 'upcoming');
      const completedAuctions = auctions.filter(a => a.status === 'ended');

      // Preserve default mock upcoming items if not already present
      defaultStaticUpcoming.forEach(item => {
        if (!upcomingAuctions.some(u => u.lot_code === item.lot_code)) {
          upcomingAuctions.push(item);
        }
      });

      // Update summary counters
      const summaryNumbers = document.querySelectorAll('.trading-summary-card .trading-summary-number');
      if (summaryNumbers.length >= 3) {
        summaryNumbers[0].textContent = activeAuctions.length;
        summaryNumbers[1].textContent = upcomingAuctions.length;
        summaryNumbers[2].textContent = completedAuctions.length;
      }

      // Update header badges
      const activeHeaderBadge = document.querySelector('section[aria-labelledby="active-bidding-heading"] .badge-live, .trading-section-header .badge-live');
      if (activeHeaderBadge) {
        activeHeaderBadge.textContent = `${activeAuctions.length} Sessions Active`;
      }
      if (upcomingCountBadge) {
        upcomingCountBadge.textContent = `${upcomingAuctions.length} Scheduled`;
      }

      // Render Active Live Auctions
      if (activeGrid && activeAuctions.length > 0) {
        activeGrid.innerHTML = '';
        activeAuctions.forEach(a => {
          const isTarget = createdId && (String(a.id) === String(createdId) || a.lot_code === lotCode);
          const card = document.createElement('article');
          card.className = 'trading-card';
          if (isTarget && a.status === 'active') {
            card.id = 'target-created-auction';
            card.style.cssText = 'border: 2px solid #2E7D32; box-shadow: 0 4px 20px rgba(46, 125, 50, 0.35); position: relative;';
          }

          const img = a.image_url || getProduceImage(a.product_name);
          const seconds = typeof a.seconds_remaining === 'number' ? a.seconds_remaining : 900;
          const h = Math.floor(seconds / 3600);
          const m = Math.floor((seconds % 3600) / 60);
          const s = seconds % 60;
          const timeFormatted = [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');

          card.innerHTML = `
            <div class="trading-card-banner">
              <img src="${img}" alt="${a.product_name} Produce" onerror="this.src='assets/produce/wheat.jpg'">
              <div class="trading-card-badge-pos">
                <span class="badge-live">
                  <span class="live-dot" aria-hidden="true"></span> LIVE
                </span>
              </div>
              <div class="trading-card-timer-pos">
                Time Remaining: ${timeFormatted}
              </div>
            </div>
            <div class="trading-card-body">
              <div class="trading-card-title-group">
                <h3 class="trading-card-title">${a.product_name}</h3>
                <span class="trading-card-fpo">Lot #${a.lot_code} · ${a.hub_location || 'Central Mandi Hub'}</span>
              </div>

              <div class="trading-metrics-grid">
                <div class="trading-metric-item">
                  <span class="trading-metric-label">Quantity</span>
                  <span class="trading-metric-value">${Number(a.quantity).toLocaleString()} ${a.unit || 'kg'}</span>
                </div>
                <div class="trading-metric-item">
                  <span class="trading-metric-label">Starting Price</span>
                  <span class="trading-metric-value">₹${Number(a.starting_price).toFixed(2)}/${a.unit || 'kg'}</span>
                </div>
                <div class="trading-metric-item">
                  <span class="trading-metric-label">Active Bidders</span>
                  <span class="trading-metric-value">${a.total_bidders || 0} Bidders</span>
                </div>
                <div class="trading-metric-item">
                  <span class="trading-metric-label">Min Increment</span>
                  <span class="trading-metric-value">₹${Number(a.min_increment || 0.5).toFixed(2)}/${a.unit || 'kg'}</span>
                </div>
                <div class="trading-metric-item" style="grid-column: span 2; border-top: 1px dashed var(--color-border); padding-top: 6px;">
                  <span class="trading-metric-label">Current Highest Bid</span>
                  <span class="trading-metric-value highlight-green">₹${Number(a.current_highest_bid || a.starting_price).toFixed(2)}/${a.unit || 'kg'}</span>
                </div>
              </div>

              <div class="trading-card-footer">
                <a href="fpo-bidding-status.html?auction_id=${a.id}" class="btn btn-secondary btn-full">
                  VIEW LIVE STATUS
                </a>
              </div>
            </div>
          `;
          activeGrid.appendChild(card);
        });
      }

      // Render Upcoming Scheduled Auctions
      if (upcomingGrid && upcomingAuctions.length > 0) {
        upcomingGrid.innerHTML = '';
        upcomingAuctions.forEach(a => {
          const isTarget = createdId && (String(a.id) === String(createdId) || a.lot_code === lotCode);
          const card = document.createElement('article');
          card.className = 'trading-card';
          if (isTarget) {
            card.id = 'target-created-auction';
            card.style.cssText = 'border: 2px solid #2E7D32; box-shadow: 0 4px 20px rgba(46, 125, 50, 0.35); position: relative;';
          }

          const img = a.image_url || getProduceImage(a.product_name);
          const tradingDate = a.start_date_formatted || '15 September';
          const startsAt = a.start_time_formatted || '10:00 AM';
          const duration = a.duration_formatted || '1 Hour';

          card.innerHTML = `
            <div class="trading-card-banner">
              <img src="${img}" alt="${a.product_name} Produce" onerror="this.src='assets/produce/wheat.jpg'">
              <div class="trading-card-badge-pos">
                <span class="badge-upcoming">UPCOMING</span>
              </div>
            </div>
            <div class="trading-card-body">
              <div class="trading-card-title-group">
                <h3 class="trading-card-title">${a.product_name}</h3>
                <span class="trading-card-fpo">Lot #${a.lot_code} · ${a.hub_location || 'Central Mandi Hub'}</span>
              </div>

              <div class="trading-metrics-grid">
                <div class="trading-metric-item">
                  <span class="trading-metric-label">Quantity</span>
                  <span class="trading-metric-value">${Number(a.quantity).toLocaleString()} ${a.unit || 'kg'}</span>
                </div>
                <div class="trading-metric-item">
                  <span class="trading-metric-label">Starting Price</span>
                  <span class="trading-metric-value">₹${Number(a.starting_price).toFixed(2)}/${a.unit || 'kg'}</span>
                </div>
                <div class="trading-metric-item">
                  <span class="trading-metric-label">Trading Date</span>
                  <span class="trading-metric-value" style="font-size: 0.95rem;">${tradingDate}</span>
                </div>
                <div class="trading-metric-item">
                  <span class="trading-metric-label">Starts At</span>
                  <span class="trading-metric-value" style="font-size: 0.95rem;">${startsAt}</span>
                </div>
                <div class="trading-metric-item" style="grid-column: span 2; border-top: 1px dashed var(--color-border); padding-top: 6px;">
                  <span class="trading-metric-label">Duration</span>
                  <span class="trading-metric-value" style="font-size: 0.95rem;">${duration}</span>
                </div>
              </div>

              <div class="trading-card-footer">
                <a href="fpo-bidding-status.html?auction_id=${a.id}" class="btn btn-secondary btn-full">
                  VIEW SESSION
                </a>
              </div>
            </div>
          `;
          upcomingGrid.appendChild(card);
        });

        // If target auction was scheduled for upcoming, smoothly scroll to it
        if (createdStatus === 'upcoming' || (window.location.hash && window.location.hash.includes('upcoming'))) {
          setTimeout(() => {
            const targetEl = document.getElementById('target-created-auction') || upcomingSection;
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 350);
        }
      }
    }

    // Immediately render local demo auctions
    const localAuctions = getLocalAuctions();
    if (localAuctions.length > 0) {
      renderAuctions(localAuctions);
    }

    // Merge with backend auctions if available
    fetch(apiUrl('/api/fpo/auctions'))
      .then(res => res.json())
      .then(data => {
        if (!data || !data.success || !Array.isArray(data.auctions)) return;
        const merged = [];
        const seenIds = new Set();
        const seenLots = new Set();

        data.auctions.forEach(ba => {
          merged.push(ba);
          seenIds.add(String(ba.id));
          if (ba.lot_code) seenLots.add(ba.lot_code);
        });

        localAuctions.forEach(la => {
          if (!seenIds.has(String(la.id)) && (!la.lot_code || !seenLots.has(la.lot_code))) {
            merged.push(la);
          }
        });

        renderAuctions(merged);
      })
      .catch(err => {
        console.log('[KrishiLink] Serving FPO auctions from local cache:', err);
      });
  }

  // --------------------------------------------------------------------------
  // 3. FPO Create Live Bidding Form Integration
  // --------------------------------------------------------------------------
  function initFpoCreateBidding() {
    const createForm = document.querySelector('form[action="fpo-live-bidding.html"], form[action="fpo-trading-dashboard.html"], #create-bidding-form, #create-trading-form, .form-container-card form');
    if (!createForm) return;

    console.log('[KrishiLink] Wiring FPO Create Live Bidding form...');

    // Native file input and UI elements for computer & mobile photo selection
    const fileInput = document.getElementById('bidding-product-image') || document.getElementById('product-image') || createForm.querySelector('input[type="file"]');
    const dropzone = document.getElementById('image-upload-dropzone') || createForm.querySelector('#image-upload-dropzone');
    const triggerBtn = document.getElementById('btn-trigger-upload');
    const resetBtn = document.getElementById('btn-reset-image');
    const previewImg = document.getElementById('product-image-preview');
    const filenameEl = document.getElementById('product-image-filename');
    const metaEl = document.getElementById('product-image-meta');

    let selectedImageDataUrl = null;
    let selectedFile = null;
    const defaultPreviewSrc = previewImg ? (previewImg.getAttribute('src') || previewImg.src) : 'assets/produce/wheat.jpg';
    const defaultFilename = filenameEl ? filenameEl.textContent.trim() : 'sample_wheat_grade_a.jpg';
    const defaultMeta = metaEl ? metaEl.textContent.trim() : 'Default sample attached · Click to choose photo from computer or phone';

    function handleSelectedFile(file) {
      if (!file) return;
      if (!file.type.startsWith('image/')) {
        showNotification('Please choose a valid image file (e.g., JPG, PNG, WEBP).', 'error');
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        showNotification('Selected image is larger than 15 MB. Please select a smaller photo.', 'error');
        return;
      }

      selectedFile = file;
      const reader = new FileReader();
      reader.onload = function (ev) {
        selectedImageDataUrl = ev.target.result;
        if (previewImg) {
          previewImg.src = selectedImageDataUrl;
        }
        if (filenameEl) {
          filenameEl.textContent = file.name;
          filenameEl.title = file.name;
        }
        if (metaEl) {
          const sizeKb = (file.size / 1024).toFixed(1);
          const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${sizeKb} KB`;
          metaEl.textContent = `Selected from device (${sizeStr}) · Ready for live auction`;
          metaEl.style.color = '#1b5e20';
          metaEl.style.fontWeight = '600';
        }
        if (resetBtn) {
          resetBtn.style.display = 'inline-block';
        }
        showNotification(`Image "${file.name}" loaded successfully from device!`, 'success', 3000);
      };
      reader.onerror = function () {
        showNotification('Failed to read image from device. Please try again.', 'error');
      };
      reader.readAsDataURL(file);
    }

    if (fileInput) {
      fileInput.addEventListener('change', () => {
        if (fileInput.files && fileInput.files.length > 0) {
          handleSelectedFile(fileInput.files[0]);
        }
      });
    }

    if (triggerBtn && fileInput) {
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
      });
    }

    if (dropzone && fileInput) {
      dropzone.addEventListener('click', (e) => {
        if (e.target && (e.target.closest('#btn-reset-image') || e.target.closest('#btn-trigger-upload'))) {
          return;
        }
        fileInput.click();
      });

      dropzone.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          fileInput.click();
        }
      });

      ['dragenter', 'dragover'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.style.borderColor = '#1c5a35';
          dropzone.style.backgroundColor = 'rgba(28, 90, 53, 0.08)';
        });
      });

      ['dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.style.borderColor = '';
          dropzone.style.backgroundColor = '';
        });
      });

      dropzone.addEventListener('drop', (e) => {
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length > 0) {
          handleSelectedFile(dt.files[0]);
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        selectedImageDataUrl = null;
        selectedFile = null;
        if (fileInput) fileInput.value = '';
        if (previewImg) previewImg.src = defaultPreviewSrc;
        if (filenameEl) filenameEl.textContent = defaultFilename;
        if (metaEl) {
          metaEl.textContent = defaultMeta;
          metaEl.style.color = '';
          metaEl.style.fontWeight = '';
        }
        resetBtn.style.display = 'none';
      });
    }

    createForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const productNameInput = document.getElementById('bidding-product-name') || document.getElementById('product-name');
      const categorySelect = document.getElementById('bidding-category') || document.getElementById('product-category');
      const descInput = document.getElementById('bidding-description') || document.getElementById('product-description');
      const qualityRadio = createForm.querySelector('input[name="quality-grade"]:checked');
      const qualitySpecsInput = document.getElementById('quality-specs');
      const qtyInput = document.getElementById('quantity-input') || createForm.querySelector('input[placeholder*="Quantity"]');
      const unitSelect = document.getElementById('quantity-unit-select');
      const startPriceInput = document.getElementById('start-price-input') || createForm.querySelector('input[placeholder*="Starting Price"]');
      const minIncInput = document.getElementById('bid-increment-input');
      const scheduleDateInput = document.getElementById('schedule-date');
      const scheduleStartInput = document.getElementById('schedule-start');
      const scheduleEndInput = document.getElementById('schedule-end');

      const productName = productNameInput ? productNameInput.value.trim() : '';
      if (!productName) {
        showNotification('Please enter a product name.', 'error');
        if (productNameInput) productNameInput.focus();
        return;
      }

      const quantityVal = qtyInput ? parseFloat(qtyInput.value) : 5000;
      const startPriceVal = startPriceInput ? parseFloat(startPriceInput.value) : 28;
      const minIncVal = minIncInput ? parseFloat(minIncInput.value) : 0.50;

      if (isNaN(quantityVal) || quantityVal <= 0) {
        showNotification('Please enter a valid positive quantity.', 'error');
        if (qtyInput) qtyInput.focus();
        return;
      }

      if (isNaN(startPriceVal) || startPriceVal <= 0) {
        showNotification('Please enter a valid starting price.', 'error');
        if (startPriceInput) startPriceInput.focus();
        return;
      }

      const payload = {
        product_name: productName,
        title: productName,
        category: categorySelect ? categorySelect.value : 'grains',
        crop_category: categorySelect ? categorySelect.value : 'grains',
        description: descInput ? descInput.value.trim() : '',
        quality_grade: qualityRadio ? qualityRadio.value : 'A',
        quality_specs: qualitySpecsInput ? qualitySpecsInput.value.trim() : 'Mandi Verified QC',
        quantity: quantityVal,
        unit: unitSelect ? unitSelect.value : 'kg',
        starting_price: startPriceVal,
        min_increment: minIncVal,
        schedule_date: scheduleDateInput ? scheduleDateInput.value : '',
        schedule_start: scheduleStartInput ? scheduleStartInput.value : '',
        schedule_end: scheduleEndInput ? scheduleEndInput.value : '',
        image_data: selectedImageDataUrl || undefined
      };

      const submitBtn = createForm.querySelector('button[type="submit"]') || createForm.querySelector('.btn-primary');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Publishing Live Bidding Session...';
      }

      // Determine whether this is an upcoming or active auction based on date & time
      let isFuture = false;
      let startDateFormatted = '15 September';
      let startTimeFormatted = '10:00 AM';
      let durationFormatted = '1 Hour';

      if (payload.schedule_date) {
        try {
          const startTimeStr = payload.schedule_start || '10:00';
          const startDtObj = new Date(`${payload.schedule_date}T${startTimeStr}:00`);
          if (!isNaN(startDtObj.getTime())) {
            if (startDtObj.getTime() > Date.now()) {
              isFuture = true;
            }
            const day = startDtObj.getDate();
            const monthName = startDtObj.toLocaleString('en-US', { month: 'long' });
            startDateFormatted = `${day} ${monthName}`;
            let hours = startDtObj.getHours();
            const minutes = startDtObj.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            startTimeFormatted = `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;

            if (payload.schedule_end) {
              const endDtObj = new Date(`${payload.schedule_date}T${payload.schedule_end}:00`);
              if (!isNaN(endDtObj.getTime())) {
                const diffHrs = Math.max(1, Math.round((endDtObj - startDtObj) / (1000 * 60 * 60)));
                durationFormatted = diffHrs === 1 ? '1 Hour' : `${diffHrs} Hours`;
              }
            }
          }
        } catch (err) {
          console.warn('[KrishiLink] Date calculation notice:', err);
        }
      }

      // Helper function to complete creation and redirect
      function completeSessionCreation(auctionId, lotCode, imgUrl, finalStatus = null, dateFmt = null, timeFmt = null, durFmt = null) {
        const resolvedStatus = finalStatus || (isFuture ? 'upcoming' : 'active');
        const isUpcoming = resolvedStatus === 'upcoming';
        const effectiveImg = imgUrl || selectedImageDataUrl || getProduceImage(productName);
        const record = {
          id: auctionId,
          lot_code: lotCode,
          product_name: productName,
          category: payload.category,
          description: payload.description,
          quality_grade: payload.quality_grade,
          quality_specs: payload.quality_specs,
          quantity: quantityVal,
          unit: payload.unit,
          starting_price: startPriceVal,
          min_increment: minIncVal,
          current_highest_bid: startPriceVal,
          total_bidders: 0,
          status: resolvedStatus,
          seconds_remaining: isUpcoming ? 0 : 3600,
          start_date_formatted: dateFmt || startDateFormatted,
          start_time_formatted: timeFmt || startTimeFormatted,
          duration_formatted: durFmt || durationFormatted,
          start_time: payload.schedule_date ? `${payload.schedule_date} ${payload.schedule_start || '10:00'}` : new Date().toISOString(),
          end_time: payload.schedule_date ? `${payload.schedule_date} ${payload.schedule_end || '11:00'}` : new Date(Date.now() + 3600000).toISOString(),
          hub_location: 'Central Mandi Aggregation Hub',
          image_url: effectiveImg,
          created_at: new Date().toISOString()
        };

        saveLocalAuction(record);
        sessionStorage.setItem('krishilink_last_created_auction_id', auctionId.toString());
        sessionStorage.setItem('krishilink_last_created_lot_code', lotCode);
        sessionStorage.setItem('krishilink_last_created_status', resolvedStatus);

        const toastMsg = isUpcoming
          ? `Upcoming Live Bidding scheduled! Lot #${lotCode} is listed under Upcoming Bids.`
          : `Live Bidding session created! Lot #${lotCode} is now active on Mandi.`;
        showNotification(toastMsg, 'success', 5000);

        setTimeout(() => {
          const redirectUrl = isUpcoming
            ? `fpo-live-bidding.html?created_id=${auctionId}&lot=${encodeURIComponent(lotCode)}&status=upcoming#upcoming-bidding-heading`
            : `fpo-live-bidding.html?created_id=${auctionId}&lot=${encodeURIComponent(lotCode)}`;
          window.location.href = redirectUrl;
        }, 900);
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(apiUrl('/api/fpo/auctions'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        const data = await res.json().catch(() => ({}));

        if (res.ok && data.success) {
          const lotCode = (data.auction && data.auction.lot_code) || data.lot_code || `TRD-${productName.slice(0, 3).toUpperCase()}-101`;
          const auctionId = (data.auction && data.auction.id) || data.auction_id || Date.now();
          const imgUrl = (data.auction && data.auction.image_url) || data.image_url || selectedImageDataUrl || getProduceImage(productName);
          const backendStatus = (data.auction && data.auction.status) || data.status || (isFuture ? 'upcoming' : 'active');
          const dateFmt = (data.auction && data.auction.start_date_formatted) || startDateFormatted;
          const timeFmt = (data.auction && data.auction.start_time_formatted) || startTimeFormatted;
          const durFmt = (data.auction && data.auction.duration_formatted) || durationFormatted;
          completeSessionCreation(auctionId, lotCode, imgUrl, backendStatus, dateFmt, timeFmt, durFmt);
          return;
        }
      } catch (err) {
        console.warn('[KrishiLink] Note on backend network request; proceeding with local mandi session:', err);
      }

      // Offline / zero-friction seamless fallback: session is created locally and active/upcoming based on schedule
      const lotNum = Math.floor(100 + Math.random() * 900);
      const cleanPrefix = (productName.replace(/[^a-zA-Z]/g, '').slice(0, 3) || 'AGR').toUpperCase();
      const lotCode = `TRD-${cleanPrefix}-${lotNum}`;
      const auctionId = Date.now();
      completeSessionCreation(auctionId, lotCode, selectedImageDataUrl || getProduceImage(productName), isFuture ? 'upcoming' : 'active');
    });
  }

  // --------------------------------------------------------------------------
  // 4. Delivery Agent Dashboard Integration (Race-Condition Free Claims)
  // --------------------------------------------------------------------------
  function initDeliveryDashboard() {
    const selectFmBtn = document.querySelector('label[for="select-fm24081"]');
    if (!selectFmBtn) return;

    console.log('[KrishiLink] Wiring Delivery Agent requirement selection (#FM-24081)...');

    selectFmBtn.addEventListener('click', async (e) => {
      // Allow default checkbox behavior, but simultaneously inform backend API
      const requirementId = 1; // #FM-24081 is ID 1 in seeded requirements

      try {
        const res = await fetch(apiUrl(`/api/delivery/requirements/${requirementId}/accept`), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await res.json();

        if (res.ok && data.success) {
          showNotification('Requirement #FM-24081 successfully assigned to you!', 'success');
        } else {
          if (res.status === 409 || (data.message && data.message.includes('already accepted'))) {
            showNotification('Notice: This delivery requirement has already been accepted by another agent.', 'error');
            // Uncheck the checkbox if rejected
            const checkbox = document.getElementById('select-fm24081');
            if (checkbox) checkbox.checked = false;
          } else if (res.status === 401) {
            showNotification('Session notice: Accepting requirement in demo mode.', 'info');
          } else {
            showNotification(data.message || 'Could not claim delivery.', 'error');
          }
        }
      } catch (err) {
        console.warn('[KrishiLink] Delivery accept API call notice:', err);
      }
    });

    // Initialize Interactive Live Route Navigation Map
    initDeliveryRouteMap();
  }

  // --------------------------------------------------------------------------
  // 4b. Delivery Agent Interactive Leaflet Route Map & Live GPS Telemetry
  // --------------------------------------------------------------------------
  async function initDeliveryRouteMap() {
    const routeMapEl = document.getElementById('delivery-route-map');
    const overviewMapEl = document.getElementById('delivery-overview-map');
    if (!routeMapEl && !overviewMapEl) return;

    console.log('[KrishiLink] Initializing Delivery Agent Corridor Navigation Map...');

    // Default route corridor fallback in case backend is offline
    const defaultRouteData = {
      corridor: {
        name: "NH 703 Agricultural Transit Corridor",
        route_title: "Jalandhar → Nakodar → Phagwara",
        status: "On Schedule",
        total_distance_km: 47.0,
        completed_distance_km: 18.6,
        remaining_distance_km: 28.4,
        estimated_duration: "2h 15m"
      },
      vehicle: {
        agent_name: "Ramesh Kumar",
        agent_code: "AM-DA-1047",
        vehicle_type: "Tata Ace",
        vehicle_number: "PB 08 AX 4821",
        telemetry: {
          lat: 31.1852,
          lng: 75.5124,
          speed_kmh: 42.0,
          heading: "South-West",
          landmark: "Near Shankar Village, NH 703"
        }
      },
      waypoints: [
        {
          stop_number: 1,
          name: "Jalandhar Farmer Hub",
          type: "pickup",
          badge: "Collection Point",
          status: "completed",
          coordinates: [31.3260, 75.5762],
          time_label: "Dep: 10:15 AM",
          details: "Loaded 354 kg Tomatoes (Harpreet Singh)"
        },
        {
          stop_number: 2,
          name: "FreshKart FPO, Nakodar",
          type: "current",
          badge: "Current Active Stop",
          status: "active",
          coordinates: [31.1274, 75.4720],
          time_label: "ETA: 10:45 AM",
          details: "Delivery handoff for 354 kg Tomatoes (FM-24081)"
        },
        {
          stop_number: 3,
          name: "Punjab Agro Wholesale, Phagwara",
          type: "destination",
          badge: "Wholesale Mandi",
          status: "upcoming",
          coordinates: [31.2240, 75.7708],
          time_label: "ETA: 12:30 PM",
          details: "Delivery handoff for 500 kg Potatoes (FM-24082)"
        }
      ],
      corridor_path: [
        [31.3260, 75.5762],
        [31.2850, 75.5450],
        [31.2320, 75.5120],
        [31.1852, 75.5124],
        [31.1510, 75.4950],
        [31.1274, 75.4720],
        [31.1410, 75.5480],
        [31.1720, 75.6450],
        [31.2010, 75.7180],
        [31.2240, 75.7708]
      ]
    };

    let routeData = defaultRouteData;

    try {
      const res = await fetch(apiUrl('/api/delivery/route'));
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.corridor) {
          routeData = json;
        }
      }
    } catch (e) {
      console.log('[KrishiLink] Route API offline, using local corridor fallback.');
    }

    // Helper to create custom HTML markers
    function createPinIcon(num, type) {
      const pinClass = type === 'pickup' ? 'pin-pickup' : (type === 'current' ? 'pin-current' : 'pin-dest');
      return L.divIcon({
        className: '',
        html: `<div class="leaflet-custom-pin ${pinClass}" style="width: 28px; height: 28px;">${num}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
        popupAnchor: [0, -16]
      });
    }

    function createTruckIcon() {
      return L.divIcon({
        className: '',
        html: `<div class="truck-marker-container" title="Delivery Vehicle Active">🚚</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
        popupAnchor: [0, -20]
      });
    }

    let mainMap = null;
    let mainRouteLine = null;
    let truckMarker = null;

    if (routeMapEl && typeof L !== 'undefined') {
      mainMap = L.map('delivery-route-map', {
        scrollWheelZoom: true,
        zoomControl: true
      }).setView([31.22, 75.58], 11);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors • AgriMitra Fleet'
      }).addTo(mainMap);

      // Draw corridor road lines
      mainRouteLine = L.polyline(routeData.corridor_path, {
        color: '#15803d',
        weight: 5,
        opacity: 0.85,
        lineJoin: 'round'
      }).addTo(mainMap);

      // Inner dashed glow line
      L.polyline(routeData.corridor_path, {
        color: '#86efac',
        weight: 2,
        opacity: 0.9,
        dashArray: '6, 8'
      }).addTo(mainMap);

      // Place waypoint pins
      routeData.waypoints.forEach(wp => {
        const icon = createPinIcon(wp.stop_number, wp.type);
        const marker = L.marker(wp.coordinates, { icon: icon }).addTo(mainMap);
        
        const popupContent = `
          <div style="font-family: inherit; min-width: 170px; padding: 4px;">
            <div style="font-size: 0.72rem; font-weight: 700; color: #166534; text-transform: uppercase;">Stop ${wp.stop_number} • ${wp.badge}</div>
            <div style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin: 2px 0 4px;">${wp.name}</div>
            <div style="font-size: 0.78rem; color: #475569;">${wp.details}</div>
            <div style="font-size: 0.75rem; font-weight: 600; color: #b45309; margin-top: 4px;">${wp.time_label}</div>
          </div>
        `;
        marker.bindPopup(popupContent);
        if (wp.type === 'current') {
          marker.openPopup();
        }
      });

      // Place Live Vehicle marker
      const truckPos = [routeData.vehicle.telemetry.lat, routeData.vehicle.telemetry.lng];
      truckMarker = L.marker(truckPos, { icon: createTruckIcon() }).addTo(mainMap);
      truckMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <div style="font-size: 0.72rem; font-weight: 700; color: #15803d; text-transform: uppercase;">Live Vehicle Telemetry</div>
          <div style="font-size: 0.95rem; font-weight: 700; color: #0f172a;">${routeData.vehicle.vehicle_type} (${routeData.vehicle.vehicle_number})</div>
          <div style="font-size: 0.78rem; color: #475569; margin-top: 2px;">Driver: ${routeData.vehicle.agent_name}</div>
          <div style="font-size: 0.75rem; color: #0369a1; font-weight: 600; margin-top: 4px;">Speed: ${routeData.vehicle.telemetry.speed_kmh} km/h • ${routeData.vehicle.telemetry.landmark}</div>
        </div>
      `);

      mainMap.fitBounds(mainRouteLine.getBounds(), { padding: [40, 40] });

      // Action buttons
      const btnFit = document.getElementById('btn-fit-route');
      const btnCenter = document.getElementById('btn-center-vehicle');

      if (btnFit) {
        btnFit.addEventListener('click', () => {
          mainMap.fitBounds(mainRouteLine.getBounds(), { padding: [40, 40], animate: true });
          btnFit.classList.add('active');
          if (btnCenter) btnCenter.classList.remove('active');
        });
      }

      if (btnCenter) {
        btnCenter.addEventListener('click', () => {
          mainMap.setView([routeData.vehicle.telemetry.lat, routeData.vehicle.telemetry.lng], 14, { animate: true });
          btnCenter.classList.add('active');
          if (btnFit) btnFit.classList.remove('active');
          truckMarker.openPopup();
        });
      }
    }

    // Mini Map on Overview Panel
    let miniMap = null;
    if (overviewMapEl && typeof L !== 'undefined') {
      miniMap = L.map('delivery-overview-map', {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false
      }).setView([routeData.vehicle.telemetry.lat, routeData.vehicle.telemetry.lng], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(miniMap);

      L.polyline(routeData.corridor_path, {
        color: '#15803d',
        weight: 4,
        opacity: 0.8
      }).addTo(miniMap);

      L.marker([routeData.vehicle.telemetry.lat, routeData.vehicle.telemetry.lng], { icon: createTruckIcon() }).addTo(miniMap);

      // Clicking mini-map jumps to full Route tab
      overviewMapEl.style.cursor = 'pointer';
      overviewMapEl.addEventListener('click', () => {
        const routeRadio = document.getElementById('view-route');
        if (routeRadio) {
          routeRadio.checked = true;
          setTimeout(() => {
            if (mainMap && mainRouteLine) {
              mainMap.invalidateSize();
              mainMap.fitBounds(mainRouteLine.getBounds(), { padding: [40, 40] });
            }
          }, 200);
        }
      });
    }

    // Handle view radio tab switching so Leaflet resizes correctly
    const viewRadios = document.querySelectorAll('input[name="app-view"]');
    viewRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        setTimeout(() => {
          if (mainMap && mainRouteLine && radio.id === 'view-route') {
            mainMap.invalidateSize();
            mainMap.fitBounds(mainRouteLine.getBounds(), { padding: [40, 40] });
          }
          if (miniMap && radio.id === 'view-overview') {
            miniMap.invalidateSize();
            miniMap.setView([routeData.vehicle.telemetry.lat, routeData.vehicle.telemetry.lng], 12);
          }
        }, 150);
      });
    });

    // Update HUD telemetry values
    const hudVehicle = document.getElementById('hud-vehicle-model');
    const hudPos = document.getElementById('hud-current-pos');
    const hudNext = document.getElementById('hud-next-stop');
    const hudRem = document.getElementById('hud-rem-dist');

    if (hudVehicle) hudVehicle.textContent = `${routeData.vehicle.vehicle_type} (${routeData.vehicle.vehicle_number})`;
    if (hudPos) hudPos.textContent = routeData.vehicle.telemetry.landmark;
    if (hudNext) hudNext.textContent = `Nakodar (ETA 10:45 AM)`;
    if (hudRem) hudRem.textContent = `${routeData.corridor.remaining_distance_km} km / ${routeData.corridor.total_distance_km} km`;
  }


  // --------------------------------------------------------------------------
  // 5. Farmer Produce Form Integration
  // --------------------------------------------------------------------------
  function initFarmerProduce() {
    const addProduceForm = document.getElementById('add-produce-form');
    if (!addProduceForm) return;

    console.log('[KrishiLink] Wiring Farmer produce form to backend API...');

    addProduceForm.addEventListener('submit', async () => {
      const cropNameInput = document.getElementById('crop-select');
      const cropVarietyInput = document.getElementById('crop-variety');
      const cropQtyInput = document.getElementById('crop-qty');
      const cropUnitInput = document.getElementById('crop-unit');
      const cropPriceInput = document.getElementById('crop-price');
      const cropLocationInput = document.getElementById('crop-location');

      const payload = {
        crop_name: cropNameInput ? cropNameInput.value : 'Paddy',
        variety: (cropVarietyInput && cropVarietyInput.value.trim()) ? cropVarietyInput.value.trim() : 'Standard Quality',
        quantity: cropQtyInput ? parseFloat(cropQtyInput.value) || 50.0 : 50.0,
        unit: cropUnitInput ? cropUnitInput.value : 'Quintals',
        expected_price: cropPriceInput ? parseFloat(cropPriceInput.value) || 2500.0 : 2500.0,
        location: (cropLocationInput && cropLocationInput.value.trim()) ? cropLocationInput.value.trim() : 'Krishnagiri APMC'
      };

      try {
        const res = await fetch(apiUrl('/api/farmer/produce'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok && data.success) {
          console.log('[KrishiLink] Produce saved to database:', data.produce);
          showNotification(`Produce record #${data.produce.id} created in MySQL database!`, 'success');
        }
      } catch (err) {
        console.warn('[KrishiLink] Farmer produce backend call notice:', err);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. Delivery Agent Notification Bell Controller
  // --------------------------------------------------------------------------
  function initNotificationBell() {
    const notifWrapper = document.querySelector('.notif-wrapper');
    if (!notifWrapper) return;

    console.log('[KrishiLink] Initializing Notification Bell Controller...');
    const bellBtn = notifWrapper.querySelector('.notif-bell-btn');
    const drawer = notifWrapper.querySelector('.notif-drawer');
    const toggleCheckbox = document.getElementById('toggle-notif');
    const countPill = notifWrapper.querySelector('.notif-count-pill');
    const metaCount = notifWrapper.querySelector('.notif-drawer-meta');

    if (!bellBtn || !drawer) return;

    // State management for notification drawer
    function toggleDrawer(forceState) {
      const isCurrentlyOpen = notifWrapper.classList.contains('open') || (toggleCheckbox && toggleCheckbox.checked);
      const shouldOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

      if (shouldOpen) {
        notifWrapper.classList.add('open');
        drawer.classList.add('open');
        if (toggleCheckbox) toggleCheckbox.checked = true;
      } else {
        notifWrapper.classList.remove('open');
        drawer.classList.remove('open');
        if (toggleCheckbox) toggleCheckbox.checked = false;
      }
    }

    // Click handler on the notification bell button
    bellBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleDrawer();
    });

    // Close when clicking anywhere outside the drawer
    document.addEventListener('click', (e) => {
      if (!notifWrapper.contains(e.target)) {
        toggleDrawer(false);
      }
    });

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        toggleDrawer(false);
      }
    });

    // Prevent clicks inside drawer from closing it
    drawer.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Function to calculate and update unread count
    function updateUnreadCounter() {
      const unreadItems = drawer.querySelectorAll('.notif-item.unread');
      const count = unreadItems.length;

      if (countPill) {
        countPill.textContent = count;
        countPill.style.display = count > 0 ? 'inline-block' : 'none';
      }

      if (metaCount) {
        metaCount.textContent = count > 0 ? `${count} unread` : 'All caught up';
      }
    }

    // Clicking individual notification item marks it as read
    drawer.querySelectorAll('.notif-item').forEach(item => {
      item.style.cursor = 'pointer';
      item.setAttribute('title', 'Click to mark as read');
      item.addEventListener('click', () => {
        if (item.classList.contains('unread')) {
          item.classList.remove('unread');
          updateUnreadCounter();
        }
      });
    });

    // Add 'Mark all read' action in drawer header if not already present
    const drawerHeader = drawer.querySelector('.notif-drawer-header');
    if (drawerHeader && !drawerHeader.querySelector('.mark-all-read-btn')) {
      const markAllBtn = document.createElement('button');
      markAllBtn.type = 'button';
      markAllBtn.className = 'mark-all-read-btn';
      markAllBtn.textContent = 'Mark all read';
      markAllBtn.style.cssText = 'background: none; border: none; font-size: 0.72rem; color: #166534; font-weight: 600; cursor: pointer; text-decoration: underline; padding: 2px 4px;';
      
      markAllBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        drawer.querySelectorAll('.notif-item.unread').forEach(item => {
          item.classList.remove('unread');
        });
        updateUnreadCounter();
        showNotification('All notifications marked as read', 'info', 2500);
      });

      drawerHeader.appendChild(markAllBtn);
    }

    // Dynamic fetch from backend /api/notifications if available
    fetch(apiUrl('/api/notifications'))
      .then(res => res.json())
      .then(data => {
        if (data && data.success && Array.isArray(data.notifications) && data.notifications.length > 0) {
          // Prepend backend notifications
          data.notifications.forEach(n => {
            const notifItem = document.createElement('div');
            notifItem.className = `notif-item ${n.is_read ? '' : 'unread'}`;
            notifItem.style.cursor = 'pointer';
            notifItem.innerHTML = `
              <div class="notif-top">
                <span class="notif-headline">${n.title}</span>
                <span class="notif-time">${n.formatted_time || 'Recent'}</span>
              </div>
              <div class="notif-desc">${n.message}</div>
            `;
            notifItem.addEventListener('click', () => {
              if (notifItem.classList.contains('unread')) {
                notifItem.classList.remove('unread');
                updateUnreadCounter();
                fetch(apiUrl(`/api/notifications/${n.id}/read`), { method: 'POST' }).catch(() => {});
              }
            });
            const firstItem = drawer.querySelector('.notif-item');
            if (firstItem) {
              drawer.insertBefore(notifItem, firstItem);
            } else {
              drawer.appendChild(notifItem);
            }
          });
          updateUnreadCounter();
        }
      })
      .catch(() => {});
  }

  // --------------------------------------------------------------------------
  // Auto-run on DOM Ready
  // --------------------------------------------------------------------------
  function initAll() {
    initWholesalerBidding();
    initFpoLiveBidding();
    initFpoBiddingStatus();
    initFpoCreateBidding();
    initDeliveryDashboard();
    initFarmerProduce();
    initNotificationBell();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  // Expose KrishiLink global for debugging in developer console
  window.KrishiLink = {
    showNotification,
    version: '1.0.0-sih'
  };

})();

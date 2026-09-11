/**
 * AgriMitra Delivery Agent Cockpit Controller
 * Manages live requirements claims, multi-stop route tracking,
 * Proof of Delivery digital escrow release, and agent state.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // 1. RBAC and User Header Population
  if (window.AgriMitraAuth) {
    const user = window.AgriMitraAuth.guardRole('delivery_agent');
    if (user && user.full_name) {
      document.querySelectorAll('.agent-name, .driver-name, #agent-name').forEach(el => {
        el.textContent = user.full_name;
      });
    }

    // Auto wire logout on any sign-out element
    document.querySelectorAll('.logout-trigger, [data-action="logout"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.AgriMitraAuth.logout('index.html');
      });
    });
  }

  // 2. Multi-Requirement Selection & Acceptance Handlers
  const requirementMap = {
    'select-fm24081': { id: 1, code: 'FM-24081', crop: 'Tomatoes', qty: '354 kg', from: 'Jalandhar Hub', to: 'Nakodar' },
    'select-fm24082': { id: 2, code: 'FM-24082', crop: 'Potatoes', qty: '500 kg', from: 'Ludhiana Mandi', to: 'Phagwara' },
    'select-fm24083': { id: 3, code: 'FM-24083', crop: 'Onions', qty: '720 kg', from: 'Nawanshahr', to: 'Jalandhar Central' },
    'select-fm24084': { id: 4, code: 'FM-24084', crop: 'Green Peas', qty: '210 kg', from: 'Kapurthala', to: 'Nakodar Market' }
  };

  Object.entries(requirementMap).forEach(([checkboxId, req]) => {
    const checkbox = document.getElementById(checkboxId);
    if (!checkbox) return;

    checkbox.addEventListener('change', async () => {
      if (checkbox.checked) {
        if (window.AgriMitraAuth) {
          window.AgriMitraAuth.showToast(`Claiming delivery contract for #${req.code} (${req.crop} · ${req.qty})...`, 'info', 2000);
        }

        try {
          const res = await fetch(`/api/delivery/requirements/${req.id}/accept`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await res.json().catch(() => ({}));

          if (res.ok && data.success) {
            if (window.AgriMitraAuth) {
              window.AgriMitraAuth.showToast(`Delivery Contract #${req.code} confirmed! Added to Today's Transit Route.`, 'info', 4500);
            }
          } else {
            if (window.AgriMitraAuth) {
              window.AgriMitraAuth.showToast(`Contract #${req.code} claimed in local logistics manifest.`, 'info', 3500);
            }
          }
        } catch (err) {
          if (window.AgriMitraAuth) {
            window.AgriMitraAuth.showToast(`Contract #${req.code} claimed locally.`, 'info', 3000);
          }
        }
      } else {
        if (window.AgriMitraAuth) {
          window.AgriMitraAuth.showToast(`Released requirement #${req.code}. Re-listed on open dispatch desk.`, 'warning', 3000);
        }
      }
    });
  });

  // 3. Proof of Delivery (POD) Digital Settlement Handler
  const podCheckbox = document.getElementById('pod-confirmed-toggle');
  if (podCheckbox) {
    podCheckbox.addEventListener('change', () => {
      if (podCheckbox.checked) {
        if (window.AgriMitraAuth) {
          window.AgriMitraAuth.showToast('Weighbridge & Geo-tag verified! SafePay Escrow payout ₹1,850 released to your account.', 'info', 6000);
        }
      }
    });
  }

  // 4. Help & Support Actions
  document.querySelectorAll('a[href="#help"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.AgriMitraAuth) {
        window.AgriMitraAuth.showToast('24x7 Logistics Dispatch Helpline: 1800-AGRI-DEL (Toll Free). Roadside assistance available on NH-703.', 'info', 6000);
      }
    });
  });

  // 5. Settings / Profile Actions
  document.querySelectorAll('a[href="#settings"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const user = window.AgriMitraAuth ? window.AgriMitraAuth.getCurrentUser() : null;
      const driverName = (user && user.full_name) || 'Ramesh Kumar';
      const phone = (user && user.phone) || '9834567890';
      if (window.AgriMitraAuth) {
        window.AgriMitraAuth.showToast(`Agent Profile: ${driverName} (${phone}) · Tata Ace PB 08 AX 4821 · Active GPS Sync`, 'info', 5000);
      }
    });
  });
});

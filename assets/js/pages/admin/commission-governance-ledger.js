/**
 * Page behaviour: Admin Commission Governance Ledger | Tos-Team KH
 * Used by: commission-governance-ledger
 * Moved verbatim out of the inline <script> of the generated page.
 */
function toggleMoTPanel() {
    const content = document.getElementById('motPanelContent');
    const arrow = document.getElementById('panelArrow');
    const statusText = document.getElementById('panelStatusText');

    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      arrow.style.transform = 'rotate(0deg)';
      statusText.textContent = 'Collapse Ledger';
    } else {
      content.classList.add('hidden');
      arrow.style.transform = 'rotate(180deg)';
      statusText.textContent = 'Expand Ledger';
    }
  }

  function settleRow(btn, partnerName, balanceAmount) {
    const tr = btn.closest('tr');
    if (!tr) return;

    // Update the row state
    tr.setAttribute('data-status', 'settled');
    
    // Update the Paid cell & Balance cell
    const cells = tr.querySelectorAll('td');
    if (cells.length >= 8) {
      const chargeText = cells[4].textContent.trim();
      cells[5].textContent = chargeText;
      cells[5].className = 'py-space-md px-space-md text-right font-medium text-[#15803D]';
      
      cells[6].textContent = '$0.00';
      cells[6].className = 'py-space-md px-space-md text-right font-medium text-outline';
      
      // Replace button with badge
      cells[7].innerHTML = `
        <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] font-label-md text-label-md font-semibold animate-pulse">
          <span class="material-symbols-outlined text-[14px]">check</span>
          <span>Settled</span>
        </span>
      `;
    }
  }

  function filterLedger() {
    const searchVal = document.getElementById('ledgerSearch').value.toLowerCase().trim();
    const typeVal = document.getElementById('typeFilter').value;
    const statusVal = document.getElementById('statusFilter').value;

    const rows = document.querySelectorAll('.ledger-row');

    rows.forEach(row => {
      const name = (row.getAttribute('data-name') || '').toLowerCase();
      const type = row.getAttribute('data-type');
      const status = row.getAttribute('data-status');

      const matchesSearch = !searchVal || name.includes(searchVal);
      const matchesType = typeVal === 'all' || type === typeVal;
      const matchesStatus = statusVal === 'all' || status === statusVal;

      if (matchesSearch && matchesType && matchesStatus) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  document.getElementById('ledgerSearch').addEventListener('input', filterLedger);
  document.getElementById('typeFilter').addEventListener('change', filterLedger);
  document.getElementById('statusFilter').addEventListener('change', filterLedger);

  function resetFilters() {
    document.getElementById('ledgerSearch').value = '';
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    filterLedger();
  }

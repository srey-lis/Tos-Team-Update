/**
 * Page behaviour: Admin Accounts Banking Settlement | Tos-Team KH
 * Used by: accounts-banking-settlement
 * Moved verbatim out of the inline <script> of the generated page.
 */
function runPingTest() {
    const btn = document.getElementById('pingButton');
    const statusText = document.getElementById('pingStatusText');
    
    btn.disabled = true;
    btn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">progress_activity</span><span>Resolving with Bakong Gateway...</span>';
    statusText.innerText = 'Handshaking with Bakong Switch...';
    statusText.className = 'text-primary font-semibold';

    setTimeout(() => {
      btn.disabled = false;
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">done_all</span><span>Ping Verified (0.84s)</span>';
      statusText.innerText = 'Success: 200 OK • Latency: 84ms • Signature Valid';
      statusText.className = 'text-[#15803D] font-semibold';
      
      setTimeout(() => {
        btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">network_check</span><span>Execute Instant Test-Ping</span>';
      }, 4000);
    }, 900);
  }

  (function initAccountsLedger() {
    const table = document.getElementById('accounts-ledger-table');
    if (!table) return;

    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const search = document.getElementById('account-search');
    const typeFilter = document.getElementById('partner-type-filter');
    const statusFilter = document.getElementById('settlement-status-filter');
    const bankFilter = document.getElementById('partner-bank-filter');
    const count = document.getElementById('account-result-count');

    function filterRows() {
      const query = search.value.trim().toLowerCase();
      const type = typeFilter.value === 'All Partner Types' ? '' : typeFilter.value.toLowerCase();
      const status = statusFilter.value === 'Settlement Status: All' ? '' : statusFilter.value.toLowerCase();
      const bank = bankFilter.value === 'All Partner Banks' ? '' : bankFilter.value.toLowerCase();
      const typeAliases = {
        'tour guides': 'guide',
        'hotels & eco-stays': 'hotel',
        'bus operators': 'operator',
        'community heritage funds': 'fund'
      };
      const typeQuery = typeAliases[type] || type;
      let visible = 0;

      rows.forEach((row) => {
        const cells = row.cells;
        const text = row.textContent.toLowerCase();
        const matches = text.includes(query)
          && (!typeQuery || cells[1].textContent.toLowerCase().includes(typeQuery))
          && (!status || cells[8].textContent.toLowerCase().includes(status.split(' / ')[0]))
          && (!bank || cells[3].textContent.toLowerCase().includes(bank));
        row.hidden = !matches;
        if (matches) visible += 1;
      });

      count.textContent = `${visible} of ${rows.length}`;
    }

    function toCsv(rowSet) {
      const headers = Array.from(table.querySelectorAll('thead th'), (cell) => cell.textContent.trim());
      const records = rowSet.map((row) => Array.from(row.cells, (cell) => cell.textContent.trim().replace(/\s+/g, ' ')));
      return [headers, ...records]
        .map((record) => record.map((value) => `"${value.replace(/"/g, '""')}"`).join(','))
        .join('\r\n');
    }

    function downloadCsv(filename, rowSet) {
      const blob = new Blob([toCsv(rowSet)], { type: 'text/csv;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }

    [search, typeFilter, statusFilter, bankFilter].forEach((control) => {
      control.addEventListener(control.tagName === 'INPUT' ? 'input' : 'change', filterRows);
    });

    document.getElementById('reset-account-filters').addEventListener('click', () => {
      search.value = '';
      typeFilter.selectedIndex = 0;
      statusFilter.selectedIndex = 0;
      bankFilter.selectedIndex = 0;
      filterRows();
      search.focus();
    });

    document.getElementById('export-ledger-button').addEventListener('click', () => {
      downloadCsv('nbc-clearing-ledger.csv', rows.filter((row) => !row.hidden));
    });

    table.querySelectorAll('tbody tr').forEach((row) => {
      const partner = row.cells[0].textContent.trim().replace(/\s+/g, ' ');
      row.querySelectorAll('[title="Download Statement"]').forEach((button) => {
        button.setAttribute('aria-label', `Download statement for ${partner}`);
        button.addEventListener('click', () => {
          downloadCsv(`${partner.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-statement.csv`, [row]);
        });
      });
    });

    filterRows();
  })();

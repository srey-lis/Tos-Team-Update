/**
 * Page behaviour: Admin Users Management | Tos-Team KH
 * Used by: users-management
 * Moved verbatim out of the inline <script> of the generated page.
 */
function openUserDossier(name, role, country, email, spent) {
    document.getElementById('dossier-name').textContent = name;
    document.getElementById('dossier-role').textContent = role;
    document.getElementById('dossier-country').textContent = country;
    document.getElementById('dossier-email').textContent = email;
    document.getElementById('dossier-spent').textContent = spent;
    document.getElementById('dossier-modal').classList.remove('hidden');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('user-search-input');
    const roleTabs = document.querySelectorAll('.role-tab');
    const countryFilter = document.getElementById('country-filter');
    const resetBtn = document.getElementById('reset-filters');
    const rows = document.querySelectorAll('#users-table-body tr');
    let currentRole = 'all';

    function filterTable() {
      const searchVal = searchInput.value.toLowerCase().trim();
      const countryVal = countryFilter.value;

      rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const role = row.getAttribute('data-role');
        const country = row.getAttribute('data-country');

        const matchesSearch = !searchVal || text.includes(searchVal);
        const matchesRole = currentRole === 'all' || role === currentRole;
        const matchesCountry = countryVal === 'all' || country === countryVal;

        if (matchesSearch && matchesRole && matchesCountry) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    }

    roleTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        roleTabs.forEach(t => {
          t.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
          t.classList.add('bg-surface-container', 'text-on-surface-variant');
        });
        tab.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
        tab.classList.remove('bg-surface-container', 'text-on-surface-variant');
        currentRole = tab.getAttribute('data-role');
        filterTable();
      });
    });

    searchInput.addEventListener('input', filterTable);
    countryFilter.addEventListener('change', filterTable);

    resetBtn.addEventListener('click', () => {
      searchInput.value = '';
      countryFilter.value = 'all';
      currentRole = 'all';
      roleTabs[0].click();
      filterTable();
    });

    document.getElementById('btn-export-csv').addEventListener('click', () => {
      alert('Generating consolidated Ministry of Tourism user export in CSV format...');
    });
  });

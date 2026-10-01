/**
 * Page behaviour: Travel Tips Cultural Guide | Tos-Team KH
 * Used by: travel-tips-cultural-guide
 * Moved verbatim out of the inline <script> of the generated page.
 */
// Filter and Category Management
  const searchInput = document.getElementById('tips-search-input');
  const clearBtn = document.getElementById('clear-search-btn');
  const filterPills = document.querySelectorAll('.filter-pill');
  const sections = document.querySelectorAll('[data-section-category]');

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm', 'active');
        p.classList.add('bg-surface-container', 'text-on-surface-variant');
      });
      pill.classList.remove('bg-surface-container', 'text-on-surface-variant');
      pill.classList.add('bg-primary', 'text-on-primary', 'shadow-sm', 'active');

      const selectedCategory = pill.getAttribute('data-category');
      
      sections.forEach(sec => {
        const secCat = sec.getAttribute('data-section-category');
        if (selectedCategory === 'all' || secCat === selectedCategory) {
          sec.style.display = 'block';
        } else {
          sec.style.display = 'none';
        }
      });
    });
  });

  // Search filter
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length > 0) {
      clearBtn.classList.remove('hidden');
    } else {
      clearBtn.classList.add('hidden');
    }

    sections.forEach(sec => {
      const text = sec.textContent.toLowerCase();
      if (text.includes(query) || query === '') {
        sec.style.display = 'block';
      } else {
        sec.style.display = 'none';
      }
    });
  });

  clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearBtn.classList.add('hidden');
    sections.forEach(sec => sec.style.display = 'block');
  });

  // Packing Checklist Counter
  function updatePackCounter() {
    const checkboxes = document.querySelectorAll('#packing-checklist-grid input[type="checkbox"]');
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const counter = document.getElementById('pack-counter');
    if (counter) {
      counter.innerText = `${checked} / ${checkboxes.length} Packed`;
      if (checked === checkboxes.length) {
        counter.classList.add('text-primary');
        counter.classList.remove('text-secondary');
      } else {
        counter.classList.add('text-secondary');
        counter.classList.remove('text-primary');
      }
    }
  }

  function resetPackingList() {
    const checkboxes = document.querySelectorAll('#packing-checklist-grid input[type="checkbox"]');
    checkboxes.forEach(cb => cb.checked = false);
    updatePackCounter();
  }

  // Simulated Code PDF Download Feedback
  function downloadCodePdf() {
    alert("APSARA Visitor Rulebook (Official 2025 Edition PDF) downloaded to your device.");
  }

  // Save to Plan Action
  function saveToChecklist(btn) {
    const label = document.getElementById('save-btn-text');
    if (label) {
      label.innerText = 'Saved to My Plan ✓';
      btn.classList.add('bg-primary-fixed', 'text-on-primary-fixed');
      setTimeout(() => {
        label.innerText = 'Save to My Plan';
        btn.classList.remove('bg-primary-fixed', 'text-on-primary-fixed');
      }, 3000);
    }
  }

  // Hospital modal toggle
  function toggleHospitalModal() {
    const modal = document.getElementById('hospital-modal');
    if (modal) {
      modal.classList.toggle('hidden');
    }
  }

/**
 * Page behaviour: Admin Guide Approvals | Tos-Team KH
 * Used by: guide-approvals
 * Moved verbatim out of the inline <script> of the generated page.
 */
// Tab switching interaction
    const filterTabs = document.querySelectorAll('.tab-btn');
    const candidateCards = document.querySelectorAll('[data-candidate]');

    filterTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        filterTabs.forEach(t => {
          t.classList.remove('bg-primary', 'text-on-primary');
          t.classList.add('text-on-surface-variant');
        });
        btn.classList.remove('text-on-surface-variant');
        btn.classList.add('bg-primary', 'text-on-primary');

        const filter = btn.getAttribute('data-filter');
        candidateCards.forEach(card => {
          if (filter === 'all') {
            card.style.display = 'flex';
          } else if (filter === 'priority') {
            card.style.display = card.getAttribute('data-candidate') === '1' ? 'flex' : 'none';
          } else if (filter === 'docs') {
            card.style.display = card.getAttribute('data-candidate') === '2' ? 'flex' : 'none';
          } else if (filter === 'preapproved') {
            card.style.display = card.getAttribute('data-candidate') === '3' ? 'flex' : 'none';
          }
        });
      });
    });

    // PDF Preview Modal
    const previewBtn = document.querySelector('.dossier-preview-btn');
    const pdfModal = document.getElementById('pdfModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeModalBottomBtn = document.getElementById('closeModalBottomBtn');

    if (previewBtn && pdfModal) {
      previewBtn.addEventListener('click', () => {
        pdfModal.classList.remove('hidden');
      });
    }

    const hideModal = () => {
      if (pdfModal) pdfModal.classList.add('hidden');
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', hideModal);
    if (closeModalBottomBtn) closeModalBottomBtn.addEventListener('click', hideModal);
    if (pdfModal) {
      pdfModal.addEventListener('click', (e) => {
        if (e.target === pdfModal) hideModal();
      });
    }

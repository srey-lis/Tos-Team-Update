/**
 * Page behaviour: Admin Guide Directory | Tos-Team KH
 * Used by: guide-directory
 * Moved verbatim out of the inline <script> of the generated page.
 */
// Micro-interaction handlers for preview modal
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const modal = document.getElementById('modal-guide-detail');
        if (modal) modal.classList.add('hidden');
      }
    });

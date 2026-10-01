/**
 * Page behaviour: Licensed Tour Guides Local Experts | Tos-Team KH
 * Used by: licensed-tour-guides-local-experts
 * Moved verbatim out of the inline <script> of the generated page.
 */
// Simple micro-interactions for filters and bookmark toggles
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', function() {
      // visual feedback for list filters
      console.log('Filter adjusted:', this.parentNode.innerText.trim(), this.checked);
    });
  });

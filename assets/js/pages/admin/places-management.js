/**
 * Page behaviour: Admin Places Management | Tos-Team KH
 * Used by: places-management
 * Moved verbatim out of the inline <script> of the generated page.
 */
document.addEventListener("DOMContentLoaded", () => {
      const activeNav = document.querySelector('aside nav a[data-path="places"]');
      if (activeNav) {
        document.querySelectorAll('aside nav a').forEach(el => {
          el.className = "flex items-center gap-space-md px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors";
        });
        activeNav.className = "flex items-center gap-space-md px-space-md py-space-sm rounded-lg bg-primary-container text-on-primary font-title-md shadow-sm";
      }
    });

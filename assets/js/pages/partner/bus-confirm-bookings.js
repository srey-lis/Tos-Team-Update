/**
 * Page behaviour: Bus Confirm Bookings | Tos-Team KH
 * Used by: bus-confirm-bookings
 * Moved verbatim out of the inline <script> of the generated page.
 */
function issueTicket(buttonEl, bookingCode) {
    buttonEl.disabled = true;
    const originalText = buttonEl.innerHTML;
    buttonEl.innerHTML = `<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span><span>Issuing...</span>`;
    
    setTimeout(() => {
      buttonEl.innerHTML = `<span class="material-symbols-outlined text-[20px]">done_all</span><span>Tickets Issued</span>`;
      buttonEl.classList.remove('bg-primary', 'hover:bg-primary-container');
      buttonEl.classList.add('bg-surface-container', 'text-on-surface-variant');

      // Show Toast Notification
      const toast = document.getElementById('toastNotification');
      document.getElementById('toastTitle').textContent = `Booking ${bookingCode} Confirmed`;
      document.getElementById('toastMessage').textContent = 'Digital passes and Bakong escrow receipts issued.';
      toast.classList.remove('translate-y-32');

      setTimeout(() => {
        toast.classList.add('translate-y-32');
      }, 4000);
    }, 900);
  }

  function triggerPrintManifest() {
    window.print();
  }

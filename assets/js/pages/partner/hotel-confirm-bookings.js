/**
 * Page behaviour: Hotel Confirm Bookings | Tos-Team KH
 * Used by: hotel-confirm-bookings
 * Moved verbatim out of the inline <script> of the generated page.
 */
function confirmReservation(cardId, guestName, roomNumber) {
      const card = document.getElementById(cardId);
      if (!card) return;
      
      // Animate card dismissal
      card.style.opacity = '0.5';
      card.style.pointerEvents = 'none';
      card.style.transform = 'scale(0.99)';

      // Trigger toast
      const toast = document.getElementById('toast');
      const toastTitle = document.getElementById('toast-title');
      const toastDesc = document.getElementById('toast-desc');
      
      toastTitle.textContent = `Confirmed: ${guestName}`;
      toastDesc.textContent = `${roomNumber} allocated. Bakong smart escrow locked into property vault.`;
      
      toast.classList.remove('translate-y-32');
      
      setTimeout(() => {
        card.style.transition = 'all 0.4s ease';
        card.style.maxHeight = '0px';
        card.style.padding = '0px';
        card.style.margin = '0px';
        card.style.opacity = '0';
        card.style.overflow = 'hidden';
      }, 700);

      setTimeout(() => {
        toast.classList.add('translate-y-32');
      }, 4000);
    }

    function printKeyCard(guest, room) {
      const toast = document.getElementById('toast');
      const toastTitle = document.getElementById('toast-title');
      const toastDesc = document.getElementById('toast-desc');

      toastTitle.textContent = `Key Pass Queued: Room #${room}`;
      toastDesc.textContent = `Issuing RFID eco-wooden card for ${guest} at Front Desk Reader #1.`;

      toast.classList.remove('translate-y-32');
      setTimeout(() => {
        toast.classList.add('translate-y-32');
      }, 3500);
    }

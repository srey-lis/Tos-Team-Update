/**
 * Page behaviour: Confirm Bookings | Tos-Team KH
 * Used by: confirm-bookings
 * Moved verbatim out of the inline <script> of the generated page.
 */
// Confirmation handler
  function handleConfirm(bookingId, travelerName) {
    const card = document.getElementById('card-' + bookingId);
    if (card) {
      card.style.opacity = '0.5';
      card.style.transform = 'scale(0.98)';
      setTimeout(() => {
        card.remove();
        showToast('Booking #' + bookingId + ' Confirmed', 'Official notice sent to ' + travelerName + '. Bakong escrow moved to authorized queue.');
      }, 300);
    }
  }

  // Decline handler
  function handleDecline(bookingId) {
    const reason = prompt('Please enter reason or new date proposal for booking #' + bookingId + ':', 'Operator schedule conflict; proposing alternative morning slot');
    if (reason) {
      const card = document.getElementById('card-' + bookingId);
      if (card) {
        card.style.opacity = '0.4';
        setTimeout(() => {
          card.remove();
          showToast('Reschedule Request Sent', 'Notification forwarded to traveler with proposed revisions.');
        }, 300);
      }
    }
  }

  // Chat launcher
  function openChat(name, phone) {
    showToast('Direct Message Channel', 'Opening direct encrypted WhatsApp / Telegram bridge to ' + name + ' (' + phone + ').');
  }

  // Manifest modal triggers
  function openManifestModal(bookingId, name, tour, pax, hotel, escrow) {
    document.getElementById('modalBookingId').innerText = '#' + bookingId;
    document.getElementById('modalTravelerName').innerText = name;
    document.getElementById('modalTourName').innerText = tour;
    document.getElementById('modalPax').innerText = 'Party Size: ' + pax;
    document.getElementById('modalHotel').innerText = 'Pickup Point: ' + hotel;
    document.getElementById('modalEscrow').innerText = escrow + ' (Guaranteed)';
    const modal = document.getElementById('manifestModal');
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  }

  function closeManifestModal() {
    const modal = document.getElementById('manifestModal');
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }

  function printModalManifest() {
    closeManifestModal();
    window.print();
  }

  // Collapsible recent section
  function toggleRecentSection() {
    const container = document.getElementById('recentBookingsContainer');
    const icon = document.getElementById('toggleIcon');
    const btn = document.getElementById('toggleRecentBtn');
    
    if (container.classList.contains('hidden')) {
      container.classList.remove('hidden');
      icon.innerText = 'expand_less';
      btn.querySelector('span:first-child').innerText = 'Collapse Preview';
    } else {
      container.classList.add('hidden');
      icon.innerText = 'expand_more';
      btn.querySelector('span:first-child').innerText = 'Expand Preview';
    }
  }

  // Dynamic toast display
  function showToast(title, msg) {
    const toast = document.getElementById('actionToast');
    document.getElementById('toastTitle').innerText = title;
    document.getElementById('toastMessage').innerText = msg;
    
    toast.classList.remove('translate-y-32', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('translate-y-32', 'opacity-0');
    }, 4000);
  }

  // Live filter search for bookings
  document.getElementById('manifestSearch')?.addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('#pendingBookingList article');
    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      if (text.includes(query)) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  });

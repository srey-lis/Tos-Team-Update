/**
 * Page behaviour: Bus Seat Booking Checkout | Tos-Team KH
 * Used by: bus-seat-booking-checkout
 * Moved verbatim out of the inline <script> of the generated page.
 */
// Simple countdown timer for Bakong QR escrow freshness
  (function initTimer() {
    let secondsLeft = 14 * 60 + 32;
    const timerElem = document.getElementById('khqrTimer');
    if (!timerElem) return;

    setInterval(() => {
      if (secondsLeft <= 0) {
        timerElem.textContent = 'Payment window expired. Refresh QR.';
        return;
      }
      secondsLeft--;
      const mins = Math.floor(secondsLeft / 60);
      const secs = secondsLeft % 60;
      timerElem.textContent = `Payment window: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }, 1000);
  })();

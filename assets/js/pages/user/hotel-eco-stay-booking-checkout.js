/**
 * Page behaviour: Hotel Eco Stay Booking Checkout | Tos-Team KH
 * Used by: hotel-eco-stay-booking-checkout
 * Moved verbatim out of the inline <script> of the generated page.
 */
// Countdown Timer Micro-interaction
  (function() {
    let timeLeft = 14 * 60 + 59;
    const timerDisplay = document.getElementById('escrow-timer');
    if (!timerDisplay) return;

    const interval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(interval);
        timerDisplay.textContent = '00:00 min';
        return;
      }
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`;
    }, 1000);

    const payBtn = document.getElementById('confirm-pay-btn');
    if (payBtn) {
      payBtn.addEventListener('click', () => {
        payBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span> Verifying Bakong Escrow Node...';
        payBtn.disabled = true;
        setTimeout(() => {
          payBtn.className = 'w-full py-3.5 px-space-md rounded-lg bg-surface-container text-primary font-label-lg text-label-lg font-bold shadow-sm transition-all flex items-center justify-center gap-2';
          payBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] text-primary">check_circle</span> Escrow Confirmed! Issuing Concierge Pass...';
        }, 1800);
      });
    }
  })();

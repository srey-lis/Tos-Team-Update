/**
 * Page behaviour: Hotels Eco Stays | Tos-Team KH
 * Used by: hotels-eco-stays
 * Moved verbatim out of the inline <script> of the generated page.
 */
let myPlanCount = 2;

    function triggerNotification(message, icon = 'check_circle') {
      const toast = document.getElementById('toast');
      const toastMsg = document.getElementById('toast-msg');
      const toastIcon = document.getElementById('toast-icon');
      
      toastMsg.innerText = message;
      toastIcon.innerText = icon;
      
      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 3500);
    }

    function addToMyPlan(hotelName, price, region) {
      myPlanCount++;
      const label = document.getElementById('plan-counter-label');
      if (label) {
        label.innerText = `Review My Plan (${myPlanCount})`;
      }
      triggerNotification(`Saved ${hotelName} (${price}/night) to My Plan (${myPlanCount})`);
    }

    function openBookingModal(hotelName, ratePerNight) {
      const modal = document.getElementById('booking-modal');
      const title = document.getElementById('modal-hotel-name');
      const nightCalc = document.getElementById('modal-night-calc');
      const tariffSum = document.getElementById('modal-tariff-sum');
      const totalUsd = document.getElementById('modal-total-usd');
      const totalKhr = document.getElementById('modal-total-khr');

      const nights = 4;
      const subtotal = ratePerNight * nights;
      const total = subtotal + 4; // Including MoT $4 fee
      const khr = Math.round(total * 4085).toLocaleString();

      title.innerText = hotelName;
      nightCalc.innerText = `Room tariff ($${ratePerNight} × ${nights} nights)`;
      tariffSum.innerText = `$${subtotal.toFixed(2)}`;
      totalUsd.innerText = `$${total.toFixed(2)}`;
      totalKhr.innerText = `~${khr} ៛`;

      modal.classList.remove('hidden');
    }

    function closeBookingModal() {
      const modal = document.getElementById('booking-modal');
      modal.classList.add('hidden');
    }

    function confirmBakongPayment() {
      closeBookingModal();
      triggerNotification('Bakong Escrow Confirmed! Check voucher sent to your Khmer ID/Passport', 'verified_user');
    }

    // Wishlist Toggle Logic
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const icon = this.querySelector('span');
        if (icon.getAttribute('style')?.includes('FILL')) {
          icon.removeAttribute('style');
          this.classList.remove('text-secondary');
          triggerNotification('Removed from Saved Expeditions', 'favorite_border');
        } else {
          icon.setAttribute('style', "font-variation-settings: 'FILL' 1;");
          this.classList.add('text-secondary');
          triggerNotification('Saved to Your Khmer Heritage Wishlist ❤️', 'favorite');
        }
      });
    });

    // Province Chip Active State Switcher
    document.querySelectorAll('.region-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.region-chip').forEach(c => {
          c.classList.remove('bg-primary', 'text-on-primary', 'font-semibold', 'shadow-sm');
          c.classList.add('bg-surface-container-lowest', 'text-on-surface');
        });
        this.classList.remove('bg-surface-container-lowest', 'text-on-surface');
        this.classList.add('bg-primary', 'text-on-primary', 'font-semibold', 'shadow-sm');
        triggerNotification(`Filtered by: ${this.innerText.trim()}`, 'filter_alt');
      });
    });

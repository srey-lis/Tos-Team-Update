/**
 * Page behaviour: Bus Transit Operator Dashboard | Tos-Team KH
 * Used by: bus-transit-operator-dashboard
 * Moved verbatim out of the inline <script> of the generated page.
 */
const confirmUrgentBtn = document.getElementById('confirmUrgentBtn');
    const urgentBanner = document.getElementById('urgentBanner');
    const toastNotification = document.getElementById('toastNotification');
    const dispatchConfirmBtn = document.getElementById('dispatchConfirmBtn');
    const reviewPendingBtn = document.getElementById('reviewPendingBtn');
    const viewQueueBtn = document.getElementById('viewQueueBtn');

    if (confirmUrgentBtn && urgentBanner && toastNotification) {
      confirmUrgentBtn.addEventListener('click', () => {
        confirmUrgentBtn.disabled = true;
        confirmUrgentBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Issuing...';
        
        setTimeout(() => {
          urgentBanner.classList.add('opacity-50', 'pointer-events-none');
          confirmUrgentBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span> Confirmed';
          
          toastNotification.classList.remove('translate-y-32', 'opacity-0');
          setTimeout(() => {
            toastNotification.classList.add('translate-y-32', 'opacity-0');
          }, 4500);
        }, 800);
      });
    }

    if (dispatchConfirmBtn) {
      dispatchConfirmBtn.addEventListener('click', () => {
        const originalText = dispatchConfirmBtn.innerHTML;
        dispatchConfirmBtn.innerHTML = '<span class="material-symbols-outlined animate-spin text-[18px]">sync</span> Publishing...';
        setTimeout(() => {
          dispatchConfirmBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span> Added to Fleet!';
          setTimeout(() => {
            dispatchConfirmBtn.innerHTML = originalText;
          }, 2500);
        }, 600);
      });
    }

    if (reviewPendingBtn) {
      reviewPendingBtn.addEventListener('click', () => {
        urgentBanner?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        urgentBanner?.classList.add('ring-2', 'ring-secondary');
        setTimeout(() => {
          urgentBanner?.classList.remove('ring-2', 'ring-secondary');
        }, 2000);
      });
    }

    if (viewQueueBtn) {
      viewQueueBtn.addEventListener('click', () => {
        alert('Displaying 3 Pending Seat Batches:\n1. #BK-BUS-7741 (Elena Rostova - 4 VIP Berths)\n2. #BK-BUS-7744 (Kim Chhay - 2 Mini Van Seats)\n3. #BK-BUS-7748 (Marcus Weber - 1 Sleeper Berth)');
      });
    }

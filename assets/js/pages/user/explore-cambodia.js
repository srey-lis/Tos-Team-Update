/**
 * Page behaviour: Explore Cambodia | Tos-Team KH
 * Used by: explore-cambodia
 * Moved verbatim out of the inline <script> of the generated page.
 */
(function initExploreInteractions() {
      let currentPlanCount = 2;
      const cards = Array.from(document.querySelectorAll('.destination-card'));
      const toast = document.getElementById('toast-notification');
      const toastText = document.getElementById('toast-text');
      const cardCountDisplay = document.getElementById('cardCountDisplay');
      const planBadge = document.getElementById('myPlanBadgeCount');
      
      const regionButtons = document.querySelectorAll('#regionPillsContainer .filter-pill');
      const catButtons = document.querySelectorAll('#categoryPillsContainer .cat-pill');
      const searchInput = document.getElementById('searchInput');
      const provinceDropdown = document.getElementById('provinceDropdown');
      const budgetToggle = document.getElementById('budgetToggle');
      const certifiedToggle = document.getElementById('certifiedToggle');

      const params = new URLSearchParams(window.location.hash.slice(1) || window.location.search);
      const requestedRegion = params.get('region');
      const requestedCategory = params.get('category');
      let activeRegion = Array.from(regionButtons).some(btn => btn.dataset.filter === requestedRegion) ? requestedRegion : 'all';
      let activeCategory = Array.from(catButtons).some(btn => btn.dataset.cat === requestedCategory) ? requestedCategory : 'all';

      // Update Card Visibility
      function filterCards() {
        const query = (searchInput.value || '').toLowerCase().trim();
        const budgetOnly = budgetToggle.checked;
        const certifiedOnly = certifiedToggle.checked;
        let visibleCount = 0;

        cards.forEach(card => {
          const prov = card.dataset.province;
          const cat = card.dataset.category;
          const cost = parseFloat(card.dataset.cost || '0');
          const isCertified = card.dataset.certified === 'true';
          const cardText = card.textContent.toLowerCase();

          const matchesRegion = (activeRegion === 'all' || prov === activeRegion);
          const matchesCat = (activeCategory === 'all' || cat === activeCategory);
          const matchesQuery = !query || cardText.includes(query);
          const matchesBudget = !budgetOnly || cost <= 20;
          const matchesCertified = !certifiedOnly || isCertified;

          if (matchesRegion && matchesCat && matchesQuery && matchesBudget && matchesCertified) {
            card.style.display = 'flex';
            visibleCount++;
          } else {
            card.style.display = 'none';
          }
        });

        if (cardCountDisplay) {
          cardCountDisplay.textContent = visibleCount;
        }
      }

      // Region Filter Click
      regionButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          regionButtons.forEach(b => {
            b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
            b.classList.add('bg-surface-container-low', 'text-on-surface');
          });
          btn.classList.remove('bg-surface-container-low', 'text-on-surface');
          btn.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');

          activeRegion = btn.dataset.filter;
          if (provinceDropdown) {
            provinceDropdown.value = activeRegion;
          }
          filterCards();
        });
      });

      // Category Filter Click
      catButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          catButtons.forEach(b => {
            b.classList.remove('bg-surface-container-highest', 'text-on-surface', 'font-semibold');
            b.classList.add('bg-surface-container-lowest', 'text-on-surface-variant');
          });
          btn.classList.remove('bg-surface-container-lowest', 'text-on-surface-variant');
          btn.classList.add('bg-surface-container-highest', 'text-on-surface', 'font-semibold');

          activeCategory = btn.dataset.cat;
          filterCards();
        });
      });

      // Dropdown Sync
      if (provinceDropdown) {
        provinceDropdown.addEventListener('change', (e) => {
          activeRegion = e.target.value;
          regionButtons.forEach(b => {
            if (b.dataset.filter === activeRegion) {
              b.classList.remove('bg-surface-container-low', 'text-on-surface');
              b.classList.add('bg-primary', 'text-on-primary', 'shadow-sm');
            } else {
              b.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm');
              b.classList.add('bg-surface-container-low', 'text-on-surface');
            }
          });
          filterCards();
        });
      }

      // Input & Checkbox listeners
      if (searchInput) searchInput.addEventListener('input', filterCards);
      if (budgetToggle) budgetToggle.addEventListener('change', filterCards);
      if (certifiedToggle) certifiedToggle.addEventListener('change', filterCards);

      const initialRegion = Array.from(regionButtons).find(btn => btn.dataset.filter === activeRegion);
      const initialCategory = Array.from(catButtons).find(btn => btn.dataset.cat === activeCategory);
      if (initialRegion) initialRegion.click();
      if (initialCategory) initialCategory.click();
      if (searchInput) searchInput.value = params.get('q') || '';
      filterCards();

      // Add to Plan Interaction
      document.querySelectorAll('.add-plan-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const itemName = btn.dataset.item || 'Destination';
          const isAdded = btn.getAttribute('data-added') === 'true';

          if (!isAdded) {
            btn.setAttribute('data-added', 'true');
            btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check</span><span>Added to Day 1</span>';
            btn.classList.remove('bg-surface-container', 'text-primary');
            btn.classList.add('bg-primary', 'text-on-primary');

            currentPlanCount++;
            if (planBadge) planBadge.textContent = currentPlanCount;

            showToast(`Added "${itemName}" to Day 1 of your trip plan!`);
          } else {
            btn.setAttribute('data-added', 'false');
            btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">add</span><span>Add to My Plan</span>';
            btn.classList.remove('bg-primary', 'text-on-primary');
            btn.classList.add('bg-surface-container', 'text-primary');

            currentPlanCount = Math.max(0, currentPlanCount - 1);
            if (planBadge) planBadge.textContent = currentPlanCount;

            showToast(`Removed "${itemName}" from plan.`);
          }
        });
      });

      // Favorite toggle
      document.querySelectorAll('.fav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const icon = btn.querySelector('.material-symbols-outlined');
          const isFavorited = icon.style.fontVariationSettings?.includes('FILL 1') || icon.classList.contains('text-secondary');
          if (!isFavorited) {
            icon.classList.add('text-secondary');
            icon.style.fontVariationSettings = "'FILL' 1";
            showToast('Saved to your Cambodia wishlist');
          } else {
            icon.classList.remove('text-secondary');
            icon.style.fontVariationSettings = "'FILL' 0";
          }
        });
      });

      function showToast(message) {
        if (!toast || !toastText) return;
        toastText.textContent = message;
        toast.classList.remove('translate-y-20', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');

        setTimeout(() => {
          toast.classList.remove('translate-y-0', 'opacity-100');
          toast.classList.add('translate-y-20', 'opacity-0');
        }, 2600);
      }
    })();

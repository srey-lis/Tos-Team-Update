/**
 * Page behaviour: Discover Cambodia | Tos-Team KH
 * Used by: discover-cambodia-landing-explore
 * Moved verbatim out of the inline <script> of the generated page.
 */
(function() {
      const slider = document.getElementById('gems-slider');
      const prevBtn = document.getElementById('gem-prev');
      const nextBtn = document.getElementById('gem-next');

      if (slider && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
          slider.scrollBy({ left: -340, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
          slider.scrollBy({ left: 340, behavior: 'smooth' });
        });
      }

      const searchForm = document.getElementById('trip-search-form');
      if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
          event.preventDefault();
          const destination = searchForm.querySelector('select')?.value || 'all';
          const regionByDestination = {
            'siem-reap': 'siem-reap',
            'phnom-penh': 'phnom-penh',
            battambang: 'battambang',
            kampot: 'kampot-kep',
            'koh-kong': 'eco-provinces',
            ratanakiri: 'eco-provinces',
            all: 'all'
          };
          const url = new URL('pages/user/explore-cambodia.html', window.location.href);
          url.hash = new URLSearchParams({ region: regionByDestination[destination] || 'all' }).toString();
          window.location.assign(url.href);
        });
      }

      document.querySelectorAll('[data-category]').forEach((button) => {
        button.addEventListener('click', () => {
          if (button.dataset.category === 'guides') {
            window.location.assign('pages/user/licensed-tour-guides-local-experts.html');
            return;
          }
          const url = new URL('pages/user/explore-cambodia.html', window.location.href);
          url.hash = new URLSearchParams({ category: button.dataset.category }).toString();
          window.location.assign(url.href);
        });
      });
    })();

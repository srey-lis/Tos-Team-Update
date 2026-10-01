/**
 * Page behaviour: AI Trip Planner Itinerary Generator | Tos-Team KH
 * Used by: ai-trip-planner-itinerary-generator
 * Moved verbatim out of the inline <script> of the generated page.
 */
function setPrompt(text) {
      const input = document.getElementById('aiPromptInput');
      input.value = text;
      input.focus();
    }

    function clearPrompt() {
      const input = document.getElementById('aiPromptInput');
      input.value = '';
      input.focus();
    }

    let currentDays = 4;
    function adjustDuration(delta) {
      currentDays = Math.max(1, Math.min(14, currentDays + delta));
      const nights = Math.max(0, currentDays - 1);
      document.getElementById('durationDisplay').innerText = `${currentDays} Days / ${nights} Nights`;
    }

    function selectPace(button) {
      const buttons = document.querySelectorAll('.pace-btn');
      buttons.forEach(btn => {
        btn.classList.remove('bg-primary', 'text-on-primary', 'shadow-sm', 'font-semibold');
        btn.classList.add('text-on-surface-variant');
      });
      button.classList.add('bg-primary', 'text-on-primary', 'shadow-sm', 'font-semibold');
      button.classList.remove('text-on-surface-variant');
    }

    function updateBudgetPreset(val) {
      const label = document.getElementById('budgetValueLabel');
      if (val === '1') {
        label.innerText = 'Eco-Backpacker ($25-$45/day)';
      } else if (val === '2') {
        label.innerText = 'Authentic Explorer ($50-$100/day)';
      } else {
        label.innerText = 'Luxury Sanctuary ($150+/day)';
      }
    }

    function toggleChip(checkbox) {
      const parent = checkbox.closest('.interest-chip');
      if (checkbox.checked) {
        parent.classList.add('bg-primary-container', 'text-on-primary');
        parent.classList.remove('bg-surface', 'text-on-surface-variant');
      } else {
        parent.classList.remove('bg-primary-container', 'text-on-primary');
        parent.classList.add('bg-surface', 'text-on-surface-variant');
      }
    }

    function triggerAiSynthesis() {
      const loading = document.getElementById('aiLoadingIndicator');
      const results = document.getElementById('itineraryResultSection');
      const button = document.getElementById('generateButton');
      
      loading.classList.remove('hidden');
      results.classList.add('opacity-40');
      button.disabled = true;

      setTimeout(() => {
        loading.classList.add('hidden');
        results.classList.remove('opacity-40');
        button.disabled = false;
        results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 700);
    }

    function addToMyPlan(btn) {
      btn.innerHTML = '<span class="material-symbols-outlined text-[18px]">check_circle</span><span>Added to Plan (2)</span>';
      btn.classList.remove('bg-secondary');
      btn.classList.add('bg-primary-container', 'text-on-primary');
    }

/**
 * Page behaviour: Admin Activity Log Telemetry | Tos-Team KH
 * Used by: activity-log-telemetry
 * Moved verbatim out of the inline <script> of the generated page.
 */
const streamToggleBtn = document.getElementById('streamToggleBtn');
  const streamDot = document.getElementById('streamDot');
  const streamText = document.getElementById('streamText');
  let isLive = true;

  if (streamToggleBtn) {
    streamToggleBtn.addEventListener('click', () => {
      isLive = !isLive;
      if (isLive) {
        streamDot.className = 'w-2.5 h-2.5 rounded-full bg-[#15803D] animate-ping';
        streamText.textContent = 'Live Stream: Active';
        streamToggleBtn.classList.remove('opacity-75');
      } else {
        streamDot.className = 'w-2.5 h-2.5 rounded-full bg-outline';
        streamText.textContent = 'Live Stream: Paused';
        streamToggleBtn.classList.add('opacity-75');
      }
    });
  }

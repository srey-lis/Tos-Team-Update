/**
 * Tos-Team KH - global behaviour, loaded on every page (after the components).
 *
 * 1. Dashboard drawer  - admin/partner pages: hamburger + off-canvas sidebar below 1024px.
 * 2. Mobile header menu - public pages: wires the existing "menu" icon button to a dropdown
 *                         built from the desktop navigation links.
 *
 * Desktop layouts are not touched by either feature. Page-specific logic lives in
 * assets/js/pages/<section>/<page>.js.
 */
(function () {
  "use strict";

  var DESKTOP_MIN_WIDTH = 1024; // Tailwind `lg`

  /* ------------------------------------------------------------------ *
   * 1. Dashboard drawer (body[data-layout="dashboard"])
   * ------------------------------------------------------------------ */
  function initDashboardDrawer() {
    var body = document.body;
    if (body.dataset.layout !== "dashboard") return;

    // The layout sidebar is the <aside> that is not nested inside <main>.
    var sidebar = Array.prototype.find.call(document.querySelectorAll("aside"), function (el) {
      return !el.closest("main");
    });
    var header = document.querySelector("header");
    if (!sidebar || !header) return;

    sidebar.id = sidebar.id || "app-sidebar";

    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "sidebar-toggle";
    toggle.setAttribute("aria-controls", sidebar.id);
    toggle.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">menu</span>';

    var backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    backdrop.setAttribute("aria-hidden", "true");

    body.appendChild(toggle);
    body.appendChild(backdrop);

    /** Vertically centre the button inside whatever header height this page uses. */
    function placeToggle() {
      var height = header.getBoundingClientRect().height;
      toggle.style.top = Math.max(0, (height - 40) / 2) + "px";
    }

    function setOpen(open) {
      body.classList.toggle("sidebar-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      toggle.firstChild.textContent = open ? "close" : "menu";
      // When open, tuck the close button into the drawer's top-right corner.
      toggle.style.left = open ? sidebar.offsetWidth - 52 + "px" : "";
    }

    toggle.addEventListener("click", function () {
      setOpen(!body.classList.contains("sidebar-open"));
    });
    backdrop.addEventListener("click", function () { setOpen(false); });
    sidebar.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", function () {
      placeToggle();
      if (window.innerWidth >= DESKTOP_MIN_WIDTH) setOpen(false);
    });

    placeToggle();
    setOpen(false);
  }

  /* ------------------------------------------------------------------ *
   * 2. Mobile header menu (public site)
   * ------------------------------------------------------------------ */
  function initMobileHeaderMenu() {
    if (document.body.dataset.layout === "dashboard") return;

    var header = document.querySelector("header");
    var nav = header && header.querySelector("nav");
    if (!nav) return;

    // Reuse a supplied menu button, or add one when a page hides its nav on small screens.
    var button = Array.prototype.find.call(header.querySelectorAll("button"), function (b) {
      return b.textContent.trim() === "menu";
    });
    if (!button) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "site-nav-toggle";
      button.setAttribute("aria-label", "Open navigation menu");
      button.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">menu</span>';
      nav.parentNode.insertBefore(button, nav);
    }

    var panel = document.createElement("div");
    panel.className = "mobile-nav-panel";
    panel.id = "mobile-nav-panel";

    Array.prototype.forEach.call(nav.querySelectorAll("a"), function (link) {
      var item = link.cloneNode(true);
      item.removeAttribute("class");
      item.className = "mobile-nav-link" + (link.hasAttribute("aria-current") ? " is-active" : "");
      panel.appendChild(item);
    });
    header.appendChild(panel);

    button.setAttribute("aria-controls", panel.id);
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Toggle navigation menu");

    function updateToggleVisibility() {
      button.hidden = window.getComputedStyle(nav).display !== "none";
    }

    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      button.setAttribute("aria-expanded", String(open));
    }

    button.addEventListener("click", function (event) {
      event.stopPropagation();
      setOpen(!panel.classList.contains("is-open"));
    });
    document.addEventListener("click", function (event) {
      if (!panel.contains(event.target)) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setOpen(false);
    });
    window.addEventListener("resize", updateToggleVisibility);
    updateToggleVisibility();
  }

  function initSharedHeaderControls() {
    var root = document.documentElement;
    var themeButtons = document.querySelectorAll(
      'button[aria-label*="theme" i], button[aria-label*="appearance" i], button[aria-label*="dark mode" i]'
    );
    var notificationButtons = document.querySelectorAll('button[aria-label*="notification" i]');
    var notice;

    try {
      root.classList.toggle("dark", localStorage.getItem("tos-theme") === "dark");
    } catch (error) {
      root.classList.remove("dark");
    }

    themeButtons.forEach(function (button) {
      function updateButton() {
        var dark = root.classList.contains("dark");
        var icon = button.querySelector(".material-symbols-outlined");
        button.setAttribute("aria-pressed", String(dark));
        button.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        if (icon) icon.textContent = dark ? "dark_mode" : "light_mode";
      }

      button.addEventListener("click", function () {
        var dark = !root.classList.contains("dark");
        root.classList.toggle("dark", dark);
        try {
          localStorage.setItem("tos-theme", dark ? "dark" : "light");
        } catch (error) {
          // Theme still applies for this page when storage is unavailable.
        }
        themeButtons.forEach(updateButton);
      });
      updateButton();
    });

    if (notificationButtons.length) {
      notice = document.createElement("div");
      notice.className = "site-notice";
      notice.setAttribute("role", "status");
      notice.setAttribute("aria-live", "polite");
      notice.textContent = "You're all caught up.";
      document.body.appendChild(notice);

      notificationButtons.forEach(function (button) {
        button.addEventListener("click", function () {
          notice.classList.add("is-visible");
          var indicator = button.querySelector(".bg-secondary");
          if (indicator) indicator.hidden = true;
          window.clearTimeout(notice.hideTimer);
          notice.hideTimer = window.setTimeout(function () {
            notice.classList.remove("is-visible");
          }, 2600);
        });
      });
    }
  }

  initDashboardDrawer();
  initMobileHeaderMenu();
  initSharedHeaderControls();
})();

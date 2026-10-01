/**
 * Tos-Team KH - authentication (front-end demo, no backend).
 *
 * Load after components/site.js and before script.js, on every public page:
 *   <script src="../../assets/js/auth.js" defer></script>
 *
 * Rules enforced here:
 *   - Visitors who are not signed in can browse and scroll every public page.
 *   - They cannot book (Book Room / Book Guide / Book Tour / Reserve Stay / Select Seats / pay / confirm)
 *     and cannot use the AI planner (Generate / Regenerate / Open AI ...). Those clicks open a "please sign in" prompt.
 *   - Checkout pages (<body data-auth-guard="booking">) redirect to the login page.
 *   - Any element can opt in with data-requires-auth="booking|ai".
 *
 * The session lives in localStorage ("remember me") or sessionStorage. Only name/email are stored, never a password.
 * Replace login()/register() with real API calls when a backend exists.
 *
 * Public API: window.TosAuth = { isLoggedIn, getUser, login, logout, requireLogin, loginUrl }
 */
(function () {
  "use strict";

  var KEY = "tos-auth";
  var script = document.currentScript;
  var src = (script && script.src) || "";
  var ROOT = src.indexOf("assets/js/auth.js") > -1 ? src.slice(0, src.indexOf("assets/js/auth.js")) : "";
  var LOGIN_URL = ROOT + "pages/user/desktop-login-partner-portal.html";
  var HOME_URL = ROOT + "index.html";

  /* ------------------------------- roles ------------------------------- */
  var ROLES = {
    traveler: { label: "Traveler", home: "index.html", area: null },
    admin: { label: "Administrator", home: "pages/admin/executive-dashboard.html", area: "pages/admin/" },
    tour: { label: "Tour manager", home: "pages/partner/tour-manager-dashboard.html", area: "pages/partner/" },
    hotel: { label: "Hotel manager", home: "pages/partner/hotel-eco-stay-manager-dashboard.html", area: "pages/partner/" },
    bus: { label: "Bus operator", home: "pages/partner/bus-transit-operator-dashboard.html", area: "pages/partner/" },
  };

  function roleOf(user) {
    return user && ROLES[user.role] ? user.role : "traveler";
  }

  function homeFor(user) {
    return ROOT + ROLES[roleOf(user)].home;
  }

  /** Where a user may land: their own area only. Staff never end up in the traveler site by default. */
  function destinationFor(user, next) {
    var role = roleOf(user);
    var target = next ? safeNext(next) : "";
    if (!target || target === HOME_URL) return homeFor(user);
    var inAdmin = target.indexOf(ROOT + "pages/admin/") === 0;
    var inPartner = target.indexOf(ROOT + "pages/partner/") === 0;
    if (role === "traveler") return inAdmin || inPartner ? HOME_URL : target;
    return ROLES[role].area && target.indexOf(ROOT + ROLES[role].area) === 0 ? target : homeFor(user);
  }

  /* ------------------------------ session ------------------------------ */
  function readStore(store) {
    try {
      var raw = store.getItem(KEY);
      var user = raw && JSON.parse(raw);
      return user && user.email ? user : null;
    } catch (error) {
      return null;
    }
  }

  function getUser() {
    return readStore(window.localStorage) || readStore(window.sessionStorage);
  }

  function isLoggedIn() {
    return !!getUser();
  }

  function clearSession() {
    try { window.localStorage.removeItem(KEY); } catch (error) { /* storage unavailable */ }
    try { window.sessionStorage.removeItem(KEY); } catch (error) { /* storage unavailable */ }
  }

  function login(user, remember) {
    clearSession();
    var record = JSON.stringify({ name: user.name, email: user.email, role: roleOf(user), at: Date.now() });
    try {
      (remember ? window.localStorage : window.sessionStorage).setItem(KEY, record);
    } catch (error) {
      return false;
    }
    refreshUi();
    return true;
  }

  var SIGN_OUT_MS = 1600; // deliberate pause so the sign-out feels intentional, not accidental

  function signOutNow() {
    clearSession();
    refreshUi();
  }

  /** Only follow ?next= when it stays on this site. */
  function safeNext(next) {
    try {
      var url = new URL(next, window.location.href);
      return url.protocol === window.location.protocol && url.host === window.location.host ? url.href : HOME_URL;
    } catch (error) {
      return HOME_URL;
    }
  }

  function loginUrl(mode, next) {
    return LOGIN_URL + "?next=" + encodeURIComponent(next || window.location.href) + (mode === "signup" ? "#signup" : "");
  }

  /* ------------------------------ header ------------------------------ */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function icon(name) {
    return el("span", "material-symbols-outlined text-[20px]", name);
  }

  function renderHeaderSlots() {
    var user = getUser();
    document.querySelectorAll("[data-auth-slot]").forEach(function (slot) {
      slot.textContent = "";

      if (!user) {
        var logIn = el("a", "px-3 py-2 rounded-lg font-label-lg text-label-lg text-on-surface hover:bg-surface-container-high transition-colors", "Log in");
        logIn.href = loginUrl("login");
        var signUp = el("a", "hidden sm:inline-flex px-3 py-2 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors", "Sign up");
        signUp.href = loginUrl("signup");
        slot.appendChild(logIn);
        slot.appendChild(signUp);
        return;
      }

      var avatar = el("div", "w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-lg text-label-lg font-bold", (user.name || user.email).charAt(0).toUpperCase());
      var name = el("span", "hidden md:inline-block font-label-md text-label-md text-on-surface font-semibold", user.name || user.email);
      if (roleOf(user) !== "traveler") {
        var dash = el("a", "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors");
        dash.href = homeFor(user);
        dash.appendChild(icon("dashboard"));
        dash.appendChild(el("span", "hidden sm:inline", "Dashboard"));
        slot.appendChild(dash);
      }
      var out = el("button", "w-9 h-9 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors");
      out.type = "button";
      out.setAttribute("aria-label", "Log out");
      out.title = "Log out";
      out.appendChild(icon("logout"));
      out.addEventListener("click", requestLogout);
      slot.appendChild(avatar);
      slot.appendChild(name);
      slot.appendChild(out);
    });

    // The "My plan" counter belongs to a signed-in traveler.
    document.querySelectorAll("[data-plan-badge]").forEach(function (badge) { badge.hidden = !user; });
  }

  function refreshUi() {
    renderHeaderSlots();
    document.documentElement.classList.toggle("is-authenticated", isLoggedIn());
  }

  /* ------------------------------ gating ------------------------------ */
  var BOOKING_TEXT = /\b(book (room|tour|guide|now|stay)|reserve stay|select (seats|berths)|confirm escrow booking|confirm (booking|payment)|pay (via|with))\b/i;
  var AI_TEXT = /\b(generate itinerary|regenerate|open ai|ai itinerary|plan trip with ai|ai trip planner)\b/i;
  var BOOKING_IDS = ["confirm-pay-btn"];
  var AI_IDS = ["generateButton"];

  function labelOf(node) {
    var clone = node.cloneNode(true);
    clone.querySelectorAll(".material-symbols-outlined").forEach(function (i) { i.remove(); });
    return clone.textContent.replace(/\s+/g, " ").trim();
  }

  /** Returns "booking", "ai" or null for a clicked element. */
  function protectedKind(node) {
    if (node.closest("header, footer, [data-auth-ui]")) return null;
    if (node.hasAttribute("data-requires-auth")) return node.getAttribute("data-requires-auth") || "booking";
    if (BOOKING_IDS.indexOf(node.id) > -1) return "booking";
    if (AI_IDS.indexOf(node.id) > -1) return "ai";
    if (node.tagName === "A" && /checkout/i.test(node.getAttribute("href") || "")) return "booking";
    var text = labelOf(node);
    if (BOOKING_TEXT.test(text)) return "booking";
    if (AI_TEXT.test(text)) return "ai";
    return null;
  }

  var COPY = {
    booking: {
      title: "Sign in to book",
      body: "Create a free account or log in to book hotels, buses, tours and guides. You can keep browsing without one.",
    },
    ai: {
      title: "Sign in to use the AI planner",
      body: "The CamTrip AI itinerary tools are for signed-in travelers. Log in or create a free account to continue.",
    },
  };

  var dialog = null;
  var lastFocus = null;

  function closePrompt() {
    if (!dialog) return;
    dialog.remove();
    dialog = null;
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  /** Shared modal shell: bottom sheet on phones, centred card from `sm` up. */
  function openOverlay(label, dismissible) {
    closePrompt();
    lastFocus = document.activeElement;
    dialog = el("div", "tos-overlay fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-space-md bg-on-surface/40 backdrop-blur-sm");
    dialog.setAttribute("data-auth-ui", "");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-label", label);
    var card = el("div", "tos-sheet w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl bg-surface-container-lowest p-space-lg pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-xl flex flex-col gap-space-md text-center items-center max-h-[90vh] overflow-y-auto");
    dialog.appendChild(card);
    if (dismissible) dialog.addEventListener("click", function (event) { if (event.target === dialog) closePrompt(); });
    document.body.appendChild(dialog);
    return card;
  }

  function badge(name, tone) {
    var wrap = el("div", "w-12 h-12 rounded-full flex items-center justify-center " + (tone || "bg-primary-container text-on-primary"));
    wrap.appendChild(el("span", "material-symbols-outlined", name));
    return wrap;
  }

  function actionLink(label, href, primary) {
    var a = el("a", "flex-1 h-11 rounded-xl font-label-lg text-label-lg flex items-center justify-center transition-colors " + (primary ? "bg-primary text-on-primary hover:bg-primary-container" : "bg-surface-container text-on-surface hover:bg-surface-container-high"), label);
    a.href = href;
    return a;
  }

  function showPrompt(kind) {
    var copy = COPY[kind] || COPY.booking;
    var card = openOverlay(copy.title, true);
    card.appendChild(badge("lock"));
    card.appendChild(el("h2", "font-headline-sm text-headline-sm text-on-surface", copy.title));
    card.appendChild(el("p", "font-body-md text-body-md text-on-surface-variant", copy.body));

    var actions = el("div", "flex flex-col-reverse sm:flex-row gap-space-sm w-full");
    var signIn = actionLink("Log in", loginUrl("login"), true);
    actions.appendChild(actionLink("Create account", loginUrl("signup"), false));
    actions.appendChild(signIn);
    card.appendChild(actions);

    var later = el("button", "font-label-md text-label-md text-on-surface-variant hover:text-on-surface py-1", "Keep browsing");
    later.type = "button";
    later.addEventListener("click", closePrompt);
    card.appendChild(later);
    signIn.focus();
  }

  /* ---------------------------- logout flow ---------------------------- */
  var signingOut = false;

  function toast(message) {
    var node = el("div", "site-notice", message);
    node.setAttribute("role", "status");
    node.setAttribute("aria-live", "polite");
    document.body.appendChild(node);
    window.requestAnimationFrame(function () { node.classList.add("is-visible"); });
    window.setTimeout(function () { node.classList.remove("is-visible"); }, 2800);
    window.setTimeout(function () { node.remove(); }, 3200);
  }

  function requestLogout() {
    if (signingOut || !isLoggedIn()) return;
    var user = getUser();
    var card = openOverlay("Log out", true);
    card.appendChild(badge("logout", "bg-secondary-fixed text-on-secondary-fixed"));
    card.appendChild(el("h2", "font-headline-sm text-headline-sm text-on-surface", "Log out of Tos-Team?"));
    card.appendChild(el("p", "font-body-md text-body-md text-on-surface-variant", "You're signed in as " + (user.email || user.name) + (roleOf(user) === "traveler" ? ". You can keep browsing after you log out, but booking and the AI planner will be locked." : " (" + ROLES[roleOf(user)].label + "). You'll need to sign in again to reach your dashboard.")));

    var actions = el("div", "flex flex-col-reverse sm:flex-row gap-space-sm w-full");
    var cancel = el("button", "flex-1 h-11 rounded-xl bg-surface-container text-on-surface font-label-lg text-label-lg hover:bg-surface-container-high transition-colors", "Stay signed in");
    cancel.type = "button";
    cancel.addEventListener("click", closePrompt);
    var confirm = el("button", "flex-1 h-11 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg hover:bg-primary-container transition-colors", "Log out");
    confirm.type = "button";
    confirm.addEventListener("click", function () { runSignOut(card); });
    actions.appendChild(cancel);
    actions.appendChild(confirm);
    card.appendChild(actions);
    cancel.focus();
  }

  function runSignOut(card) {
    signingOut = true;
    dialog.setAttribute("aria-busy", "true");
    dialog.onclick = null;
    card.textContent = "";

    var spinner = el("span", "material-symbols-outlined text-[32px] tos-spin", "progress_activity");
    var ring = el("div", "w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center");
    ring.appendChild(spinner);
    card.appendChild(ring);
    card.appendChild(el("h2", "font-headline-sm text-headline-sm text-on-surface", "Signing you out…"));
    card.appendChild(el("p", "font-body-md text-body-md text-on-surface-variant", "Clearing your session and saved sign-in on this device."));
    var track = el("div", "w-full h-1.5 rounded-full bg-surface-container overflow-hidden");
    var bar = el("div", "tos-progress h-full rounded-full bg-primary");
    bar.style.animationDuration = SIGN_OUT_MS + "ms";
    track.appendChild(bar);
    card.appendChild(track);

    window.setTimeout(function () {
      signOutNow();
      signingOut = false;
      closePrompt();
      toast("You've been signed out. See you soon!");
      var guard = document.body.dataset.authGuard;
      if (guard) window.setTimeout(function () { window.location.replace(guard === "booking" ? HOME_URL : LOGIN_URL); }, 1200);
    }, SIGN_OUT_MS);
  }

  /** Run `action` when signed in, otherwise show the sign-in prompt. */
  function requireLogin(kind, action) {
    if (isLoggedIn()) {
      if (action) action();
      return true;
    }
    showPrompt(kind);
    return false;
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    var node = target && target.closest ? target.closest("[data-requires-auth], button, a") : null;
    if (!node || isLoggedIn()) return;
    var kind = protectedKind(node);
    if (!kind) return;
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
    showPrompt(kind);
  }, true);

  document.addEventListener("submit", function (event) {
    var form = event.target;
    if (isLoggedIn() || !form || !form.matches) return;
    if (form.id === "aiPlannerForm" || form.hasAttribute("data-requires-auth")) {
      event.preventDefault();
      event.stopImmediatePropagation();
      showPrompt(form.id === "aiPlannerForm" ? "ai" : form.getAttribute("data-requires-auth") || "booking");
    }
  }, true);

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && !signingOut) closePrompt();
  });

  // Keep several open tabs in sync.
  window.addEventListener("storage", function (event) { if (event.key === KEY) refreshUi(); });

  /* Page guards: <body data-auth-guard="booking|admin|partner">. Wrong role -> that role's own home. */
  function enforceGuard() {
    var guard = document.body.dataset.authGuard;
    if (!guard) return true;
    var user = getUser();
    var role = roleOf(user);
    var allowed = guard === "booking" ? !!user
      : guard === "admin" ? role === "admin"
      : role === "tour" || role === "hotel" || role === "bus";
    if (allowed) return true;
    document.documentElement.style.visibility = "hidden"; // no flash of a page the visitor may not see
    window.location.replace(user && guard !== "booking" ? homeFor(user) : loginUrl("login"));
    return false;
  }
  if (!enforceGuard()) return;

  /* Dashboards: show who is signed in and give them a log out button (sidebar bottom). */
  function mountDashboardAccount() {
    var user = getUser();
    if (!user || document.body.dataset.layout !== "dashboard") return;
    var asides = Array.prototype.slice.call(document.querySelectorAll("aside"));
    // Most pages: the sidebar sits outside <main>. A few admin pages nest it inside, as the first fixed-width column.
    var aside = asides.find(function (a) { return !a.closest("main"); }) || asides.find(function (a) { return a.classList.contains("shrink-0"); });
    if (!aside || aside.querySelector("[data-auth-ui]")) return;
    var host = aside.lastElementChild || aside;
    var box = el("div", "mt-3 p-2.5 rounded-xl bg-surface-container-low flex items-center gap-2");
    box.setAttribute("data-auth-ui", "");
    box.appendChild(el("div", "w-8 h-8 shrink-0 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-lg text-label-lg font-bold", (user.name || user.email).charAt(0).toUpperCase()));
    var text = el("div", "min-w-0 flex-1");
    text.appendChild(el("div", "font-label-md text-label-md text-on-surface font-semibold truncate", user.name || user.email));
    text.appendChild(el("div", "font-label-caps text-label-caps text-on-surface-variant truncate", ROLES[roleOf(user)].label));
    box.appendChild(text);
    var out = el("button", "w-9 h-9 shrink-0 rounded-lg flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors");
    out.type = "button";
    out.title = "Log out";
    out.setAttribute("aria-label", "Log out");
    out.appendChild(icon("logout"));
    out.addEventListener("click", requestLogout);
    box.appendChild(out);
    host.appendChild(box);
  }
  document.addEventListener("DOMContentLoaded", mountDashboardAccount);

  window.TosAuth = {
    isLoggedIn: isLoggedIn,
    getUser: getUser,
    login: login,
    logout: requestLogout,
    requireLogin: requireLogin,
    loginUrl: loginUrl,
    safeNext: safeNext,
    roles: ROLES,
    roleOf: roleOf,
    homeFor: homeFor,
    destinationFor: destinationFor,
    homeUrl: HOME_URL,
  };

  /* Phones: put Log in / Log out inside the dropdown menu that script.js builds. */
  function syncMobilePanel() {
    var panel = document.getElementById("mobile-nav-panel");
    if (!panel) return;
    var old = panel.querySelector("[data-auth-mobile]");
    if (old) old.remove();
    var row = el("div", "mobile-auth-row");
    row.setAttribute("data-auth-mobile", "");
    if (isLoggedIn()) {
      var out = el("button", "mobile-nav-link w-full text-left", "Log out");
      out.type = "button";
      out.addEventListener("click", function () { panel.classList.remove("is-open"); requestLogout(); });
      row.appendChild(out);
    } else {
      var a = el("a", "mobile-nav-link", "Log in");
      a.href = loginUrl("login");
      var b = el("a", "mobile-nav-link", "Create account");
      b.href = loginUrl("signup");
      row.appendChild(a);
      row.appendChild(b);
    }
    panel.appendChild(row);
  }

  var baseRefresh = refreshUi;
  refreshUi = function () { baseRefresh(); syncMobilePanel(); };
  document.addEventListener("DOMContentLoaded", syncMobilePanel);

  refreshUi();
})();

/**
 * Page behaviour: Login / Create account | Tos-Team KH
 * Used by: desktop-login-partner-portal
 * Front-end demo: validates the form, then starts a session through TosAuth (assets/js/auth.js).
 * Swap the two TosAuth.login(...) calls for real API requests when a backend exists.
 */
(function () {
  "use strict";

  var params = new URLSearchParams(window.location.search);
  var next = params.get("next");

  var tabs = {
    login: document.getElementById("tabLogin"),
    signup: document.getElementById("tabSignup"),
  };
  var forms = {
    login: document.getElementById("loginForm"),
    signup: document.getElementById("signupForm"),
  };
  var copy = {
    login: ["Log in to Tos-Team KH", "Book hotels, buses and guides, and use the AI trip planner."],
    signup: ["Create your free account", "One account for bookings, saved plans and the AI trip planner."],
  };
  /* Demo staff accounts (front-end only). Replace with a server lookup: the server must decide the role. */
  var DEMO = {
    admin: { email: "admin@tos-team.kh", password: "admin123", name: "Dara Sovann" },
    tour: { email: "tour@tos-team.kh", password: "tour123", name: "Vicheka Seng" },
    hotel: { email: "hotel@tos-team.kh", password: "hotel123", name: "Vannak Rathana" },
    bus: { email: "bus@tos-team.kh", password: "bus123", name: "Sokha Pich" },
  };
  var role = "traveler";
  var ROLE_ON = "bg-primary text-on-primary font-bold shadow-sm";
  var ROLE_OFF = "bg-surface-container-low text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high";
  var ACTIVE = "bg-surface-container-lowest text-primary shadow-sm";
  var IDLE = "text-on-surface-variant hover:text-on-surface";

  function destination(user) {
    return window.TosAuth ? window.TosAuth.destinationFor(user || window.TosAuth.getUser(), next) : "../../index.html";
  }

  function setRole(value) {
    role = value;
    document.querySelectorAll(".role-btn").forEach(function (b) {
      var on = b.getAttribute("data-role") === value;
      b.setAttribute("aria-pressed", String(on));
      ROLE_ON.split(" ").forEach(function (c) { b.classList.toggle(c, on); });
      ROLE_OFF.split(" ").forEach(function (c) { b.classList.toggle(c, !on); });
    });
    var hint = document.getElementById("demoHint");
    var demo = DEMO[value];
    hint.classList.toggle("hidden", !demo);
    hint.classList.toggle("flex", !!demo);
    if (demo) document.getElementById("demoHintText").textContent = "Demo: " + demo.email + " / " + demo.password;
    showError("loginError", "");
  }

  function setMode(mode) {
    Object.keys(tabs).forEach(function (key) {
      var active = key === mode;
      tabs[key].setAttribute("aria-selected", String(active));
      ACTIVE.split(" ").forEach(function (c) { tabs[key].classList.toggle(c, active); });
      IDLE.split(" ").forEach(function (c) { tabs[key].classList.toggle(c, !active); });
      forms[key].classList.toggle("hidden", !active);
      forms[key].classList.toggle("flex", active);
    });
    document.getElementById("authTitle").textContent = copy[mode][0];
    document.getElementById("authSubtitle").textContent = copy[mode][1];
  }

  function showError(id, message) {
    var node = document.getElementById(id);
    node.textContent = message;
    node.classList.toggle("hidden", !message);
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function nameFromEmail(email) {
    return email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function finish(user, remember, button) {
    if (!window.TosAuth || !window.TosAuth.login(user, remember)) {
      return false;
    }
    button.disabled = true;
    button.querySelector("span").textContent = user.role === "traveler" ? "Signed in. Redirecting..." : "Opening your dashboard...";
    window.setTimeout(function () { window.location.assign(destination(user)); }, 600);
    return true;
  }

  Object.keys(tabs).forEach(function (key) {
    tabs[key].addEventListener("click", function () { setMode(key); });
  });

  /** Which demo staff role (if any) owns this email? */
  function staffRoleForEmail(email) {
    var found = null;
    Object.keys(DEMO).forEach(function (k) { if (DEMO[k].email === email.toLowerCase()) found = k; });
    return found;
  }

  // Typing a staff email switches the picker for you, so the role can't be forgotten.
  document.getElementById("loginEmail").addEventListener("input", function (event) {
    var match = staffRoleForEmail(event.target.value.trim());
    if (match && match !== role) setRole(match);
  });

  forms.login.addEventListener("submit", function (event) {
    event.preventDefault();
    var email = document.getElementById("loginEmail").value.trim();
    var password = document.getElementById("loginPassword").value.trim();
    if (!validEmail(email)) return showError("loginError", "Enter a valid email address.");
    if (password.length < 6) return showError("loginError", "Password must be at least 6 characters.");

    var staffRole = staffRoleForEmail(email);
    var account;
    if (staffRole) {
      var demo = DEMO[staffRole];
      if (password !== demo.password) {
        return showError("loginError", "Wrong password for " + demo.email + ". Demo password: " + demo.password);
      }
      account = { name: demo.name, email: demo.email, role: staffRole };
    } else if (role !== "traveler") {
      var expected = DEMO[role];
      return showError("loginError", "That email isn't the " + window.TosAuth.roles[role].label.toLowerCase() + " account. Demo login: " + expected.email + " / " + expected.password);
    } else {
      account = { name: nameFromEmail(email), email: email, role: "traveler" };
    }
    showError("loginError", "");
    var ok = finish(account, document.getElementById("loginRemember").checked, event.submitter || forms.login.querySelector("button[type=submit]"));
    if (!ok) showError("loginError", "Could not start a session. Check that browser storage is enabled.");
  });

  forms.signup.addEventListener("submit", function (event) {
    event.preventDefault();
    var name = document.getElementById("signupName").value.trim();
    var email = document.getElementById("signupEmail").value.trim();
    var password = document.getElementById("signupPassword").value;
    if (name.length < 2) return showError("signupError", "Enter your full name.");
    if (!validEmail(email)) return showError("signupError", "Enter a valid email address.");
    if (password.length < 6) return showError("signupError", "Password must be at least 6 characters.");
    if (!document.getElementById("signupTerms").checked) return showError("signupError", "Please accept the Terms of Service to continue.");
    showError("signupError", "");
    var ok = finish({ name: name, email: email }, true, event.submitter || forms.signup.querySelector("button[type=submit]"));
    if (!ok) showError("signupError", "Could not start a session. Check that browser storage is enabled.");
  });

  document.querySelectorAll(".role-btn").forEach(function (b) {
    b.addEventListener("click", function () { setRole(b.getAttribute("data-role")); });
  });
  document.getElementById("demoFill").addEventListener("click", function () {
    var demo = DEMO[role];
    document.getElementById("loginEmail").value = demo.email;
    document.getElementById("loginPassword").value = demo.password;
  });

  document.querySelectorAll("[data-toggle-password]").forEach(function (button) {
    button.addEventListener("click", function () {
      var input = document.getElementById(button.getAttribute("data-toggle-password"));
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      button.setAttribute("aria-label", show ? "Hide password" : "Show password");
      button.querySelector(".material-symbols-outlined").textContent = show ? "visibility_off" : "visibility";
    });
  });

  /* Arrived from a blocked action: say why. */
  if (next) {
    var notice = document.getElementById("authNotice");
    notice.textContent = "Please sign in to continue. Booking, the AI planner and dashboards need an account.";
    notice.classList.remove("hidden");
  }

  setMode(window.location.hash === "#signup" ? "signup" : "login");
  setRole("traveler");

  /* Already signed in: nothing to do here. */
  if (window.TosAuth && window.TosAuth.isLoggedIn()) window.location.replace(destination());
})();

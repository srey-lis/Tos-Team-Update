# Tos-Team KH

Static, framework-free front end for the Tos-Team KH travel platform: public site, admin portal and partner
(hotel / bus / tour) portals. Styling is Tailwind via the Play CDN, so an internet connection is required.

## Run it

Open `index.html` directly, or serve the folder (`npm run dev`, or any static server). No build step.

## Structure

```
tos-team-kh/
├── index.html                  Landing page (Discover Cambodia)
├── pages/
│   ├── user/                   Public site: explore, hotels, bus, guides, tips, trip planner, checkouts, login
│   ├── admin/                  Admin portal: dashboards, users, places, guides, reviews, banking, commission
│   └── partner/                Partner portals: tour manager, hotel manager, bus operator, booking confirmations
├── assets/
│   ├── css/
│   │   └── styles.css          Global styles: base reset, dashboard drawer, mobile menu, responsive helpers
│   └── js/
│       ├── tailwind-config.js  Design tokens (colours, type scale, spacing, radii) - single source of truth
│       ├── script.js           Global behaviour: dashboard drawer + mobile header menu
│       ├── auth.js             Login session + access rules (booking and AI need an account)
│       ├── components/         Reusable layout components (custom elements)
│       │   ├── define-component.js   Tiny helper that registers a component
│       │   ├── admin.js              admin sidebars / headers / footers
│       │   ├── partner.js            partner sidebars / headers
│       │   └── site.js               public-site header / footer variants
│       └── pages/{user,admin,partner}/   One file per page that needs its own behaviour
└── docs/
    ├── design-system.md        "Warm Heritage Expedition" design spec
    └── reference-screens/      Original screenshots, used as the visual baseline
```

## Conventions

- **Load order** (end of each page): `define-component.js` -> component file(s) -> `script.js` -> page script, all `defer`.
- **Components** are used like `<tos-admin-sidebar-operations active="users"></tos-admin-sidebar-operations>`.
  `active` is the `data-path` of the current nav item. The element replaces itself with plain markup on load.
- **Page scripts** are classic scripts (not ES modules) because the markup uses inline `onclick="..."` handlers and
  because modules cannot be loaded from `file://`.
- **Design tokens** live only in `assets/js/tailwind-config.js`. Add or change a colour there, not in a page.
- `<body data-layout="dashboard|site">` selects the responsive behaviour (drawer sidebar vs. public header menu).
- **Navigation** uses real relative links (works from `file://` and any static server). `data-path` still only
  drives the active-item highlight. Component templates in `assets/js/components/` are rendered into
  `pages/<section>/`, so their hrefs are relative to that folder.
- `<tos-partner-sidebar-...>` is shared by the bus and hotel portals, so a page can override links with
  `hrefs="data-path=url,data-path=url"` (see `hotel-confirm-bookings.html`).
- Links that still point to `#` have no page yet: Privacy, Terms, Help, Contact, Our Mission, Press, AI Ethics, plus
  card-level buttons ("Details", "View Coordinates", "Manage All", ...). Add the page, then replace the `#`.

## Login and access rules

- `assets/js/auth.js` is loaded on every public page (after `site.js`). Visitors who are not signed in can browse and
  scroll everything, but **Book / Reserve / Select Seats / Pay / Confirm** and the **AI planner** (Generate, Regenerate,
  Open AI ...) open a "please sign in" prompt instead.
- Checkout pages carry `<body data-auth-guard="booking">` and redirect to the login page when signed out.
- Mark any extra element with `data-requires-auth="booking"` or `data-requires-auth="ai"` to protect it.
- The login / create-account form is `pages/user/desktop-login-partner-portal.html`. It is a front-end demo: it validates
  the fields and stores only name + email in `localStorage` ("keep me signed in") or `sessionStorage`. Replace the
  `TosAuth.login(...)` calls in `assets/js/pages/user/desktop-login-partner-portal.js` with real API calls for production,
  and enforce the same rules on the server, since client-side checks can be bypassed.
- The header is the shared `<tos-user-site-header>` on every public page including `index.html`
  (`<tos-user-site-header active="home" root>`; the `root` attribute rebases its links for the project root).
- **Logout** asks for confirmation, then shows a "Signing you out..." state (about 1.6 s, `SIGN_OUT_MS` in `auth.js`)
  before the session is cleared and a toast confirms it. On phones it is also in the hamburger menu. Dialogs are bottom
  sheets below 640px and centred cards above.

## Roles (admin / partner / traveler)

- The login form has a **Sign in as** picker. After login each role lands in its own area: Admin -> `pages/admin/`,
  Tour / Hotel / Bus partner -> their dashboard in `pages/partner/`, Traveler -> the public site.
- Admin and partner pages carry `data-auth-guard="admin"` / `"partner"`. Signed-out visitors go to the login page; a
  signed-in user with the wrong role is sent back to their own home. Staff see a **Dashboard** button in the public header.
- Dashboards show the signed-in name, role and a log out button at the bottom of the sidebar.
- Demo staff accounts (front-end only; `DEMO` in `assets/js/pages/user/desktop-login-partner-portal.js`):
  `admin@tos-team.kh / admin123`, `tour@tos-team.kh / tour123`, `hotel@tos-team.kh / hotel123`, `bus@tos-team.kh / bus123`.
  Remove these and let the server decide the role before going live. Client-side guards only hide pages.

/**
 * Tos-Team KH - Tailwind design tokens ("Warm Heritage Expedition").
 *
 * Single source of truth for colours, typography, spacing and radii.
 * Previously this ~4 KB object was pasted inline into all 27 pages
 * (15 slightly different formattings of the same values).
 *
 * Must load right AFTER the Tailwind CDN script and BEFORE the page body,
 * so it is a plain (non-deferred) classic script. See docs/design-system.md.
 */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
    // ---- Colour roles (Material-3 style) ----
    colors: {
      // Surface & background
      "background": "#fdf8f5",
      "surface": "#fdf8f5",
      "surface-lowest": "#ffffff",
      "surface-dim": "#ddd9d6",
      "surface-bright": "#fdf8f5",
      "surface-variant": "#e6e2de",
      "surface-tint": "#206963",
      "surface-container-lowest": "#ffffff",
      "surface-container-low": "#f7f3ef",
      "surface-container": "#f2ede9",
      "surface-container-high": "#ece7e4",
      "surface-container-highest": "#e6e2de",
      "inverse-surface": "#32302e",
      "inverse-on-surface": "#f5f0ec",
      "on-background": "#1c1b19",
      "on-surface": "#1c1b19",
      "on-surface-variant": "#3f4947",
      "outline": "#6f7977",
      "outline-variant": "#bec9c7",
      // Primary (deep teal)
      "primary": "#004541",
      "on-primary": "#ffffff",
      "primary-container": "#0f5e59",
      "on-primary-container": "#90d5ce",
      "inverse-primary": "#8fd3cc",
      "primary-fixed": "#aaefe8",
      "primary-fixed-dim": "#8fd3cc",
      "on-primary-fixed": "#00201e",
      "on-primary-fixed-variant": "#00504b",
      // Secondary (terracotta)
      "secondary": "#a33d17",
      "on-secondary": "#ffffff",
      "secondary-container": "#fc7f53",
      "on-secondary-container": "#6c1e00",
      "secondary-fixed": "#ffdbd0",
      "secondary-fixed-dim": "#ffb59d",
      "on-secondary-fixed": "#390c00",
      "on-secondary-fixed-variant": "#832600",
      // Tertiary (gold)
      "tertiary": "#533700",
      "on-tertiary": "#ffffff",
      "tertiary-container": "#714d00",
      "on-tertiary-container": "#ffbc49",
      "tertiary-fixed": "#ffdeae",
      "tertiary-fixed-dim": "#ffba3e",
      "on-tertiary-fixed": "#281900",
      "on-tertiary-fixed-variant": "#604100",
      // Feedback
      "error": "#ba1a1a",
      "on-error": "#ffffff",
      "error-container": "#ffdad6",
      "on-error-container": "#93000a"
    },
    borderRadius: {
      "DEFAULT": "0.25rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "full": "9999px",
      "2xl": "1rem"
    },
    spacing: {
      "gutter-mobile": "1rem",
      "margin-mobile": "1.25rem",
      "margin": "3rem",
      "space-md": "1rem",
      "margin-tablet": "2rem",
      "space-sm": "0.5rem",
      "space-lg": "1.5rem",
      "space-xs": "0.25rem",
      "gutter": "1.5rem",
      "space-xl": "2.5rem"
    },
    fontFamily: {
      "display-hero": [
        "Playfair Display",
        "serif"
      ],
      "display-hero-mobile": [
        "Playfair Display",
        "serif"
      ],
      "label-caps": [
        "Plus Jakarta Sans",
        "sans-serif"
      ],
      "headline-lg": [
        "Playfair Display",
        "serif"
      ],
      "label-lg": [
        "Plus Jakarta Sans",
        "sans-serif"
      ],
      "body-lg": [
        "Plus Jakarta Sans",
        "sans-serif"
      ],
      "headline-sm": [
        "Playfair Display",
        "serif"
      ],
      "headline-md": [
        "Playfair Display",
        "serif"
      ],
      "headline-lg-mobile": [
        "Playfair Display",
        "serif"
      ],
      "title-md": [
        "Plus Jakarta Sans",
        "sans-serif"
      ],
      "body-sm": [
        "Plus Jakarta Sans",
        "sans-serif"
      ],
      "body-md": [
        "Plus Jakarta Sans",
        "sans-serif"
      ],
      "label-md": [
        "Plus Jakarta Sans",
        "sans-serif"
      ],
      "title-lg": [
        "Plus Jakarta Sans",
        "sans-serif"
      ]
    },
    fontSize: {
      "display-hero": [
        "56px",
        {
          "lineHeight": "64px",
          "letterSpacing": "-0.02em",
          "fontWeight": "700"
        }
      ],
      "display-hero-mobile": [
        "36px",
        {
          "lineHeight": "44px",
          "letterSpacing": "-0.01em",
          "fontWeight": "700"
        }
      ],
      "label-caps": [
        "11px",
        {
          "lineHeight": "14px",
          "letterSpacing": "0.08em",
          "fontWeight": "700"
        }
      ],
      "headline-lg": [
        "40px",
        {
          "lineHeight": "48px",
          "letterSpacing": "-0.01em",
          "fontWeight": "600"
        }
      ],
      "label-lg": [
        "14px",
        {
          "lineHeight": "20px",
          "letterSpacing": "0.01em",
          "fontWeight": "600"
        }
      ],
      "body-lg": [
        "18px",
        {
          "lineHeight": "28px",
          "fontWeight": "400"
        }
      ],
      "headline-sm": [
        "22px",
        {
          "lineHeight": "30px",
          "fontWeight": "600"
        }
      ],
      "headline-md": [
        "28px",
        {
          "lineHeight": "36px",
          "fontWeight": "600"
        }
      ],
      "headline-lg-mobile": [
        "28px",
        {
          "lineHeight": "36px",
          "fontWeight": "600"
        }
      ],
      "title-md": [
        "16px",
        {
          "lineHeight": "24px",
          "fontWeight": "600"
        }
      ],
      "body-sm": [
        "13px",
        {
          "lineHeight": "20px",
          "fontWeight": "400"
        }
      ],
      "body-md": [
        "15px",
        {
          "lineHeight": "24px",
          "fontWeight": "400"
        }
      ],
      "label-md": [
        "12px",
        {
          "lineHeight": "16px",
          "letterSpacing": "0.02em",
          "fontWeight": "600"
        }
      ],
      "title-lg": [
        "18px",
        {
          "lineHeight": "26px",
          "fontWeight": "600"
        }
      ]
    },
    },
  },
};

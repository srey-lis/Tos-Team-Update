/**
 * Tiny helper for "HTML include" style components (no framework, no build step).
 *
 *   TosComponents.define('tos-admin-footer', { html, anchors })
 *
 * - `html` holds the markup; nav links use {{c:PATH#n}} (class) and
 *   {{a:PATH#n}} (aria-current) placeholders.
 * - `anchors` lists, per link, the inactive (`off`) and active (`on`) classes.
 * - `<tos-... active="a,b">` marks links whose data-path is listed as active.
 * - `<tos-... hrefs="path=url,path=url">` overrides the default href of the link with that data-path
 *   (URLs are relative to the current page). Used where one shared sidebar serves several portals.
 * - `<tos-... root>` rebases the relative links for a page that lives at the project root (index.html).
 * The element replaces itself with the rendered markup (no wrapper element
 * is left behind, so layout and CSS selectors behave exactly as before).
 */
(function (global) {
  "use strict";

  var registry = {};

  /** Turn a component definition + list of active data-paths into an HTML string. */
  function render(def, activePaths) {
    var active = activePaths || [];
    return def.html.replace(/\{\{([ca]):([^#}]*)#(\d+)\}\}/g, function (_, kind, path, index) {
      var link = def.anchors[path + "#" + index];
      var isActive = active.indexOf(path) !== -1;
      if (kind === "c") return isActive ? link.on : link.off;
      return isActive && link.current ? ' aria-current="page"' : "";
    });
  }

  /** Apply `hrefs="data-path=url,..."` overrides to a rendered HTML string. */
  function applyHrefs(html, spec) {
    (spec || "").split(",").forEach(function (pair) {
      var i = pair.indexOf("=");
      if (i < 1) return;
      var path = pair.slice(0, i).trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var url = pair.slice(i + 1).trim();
      html = html.replace(new RegExp('(data-path="' + path + '"[^>]*?href=")[^"]*(")', "g"), function (_, a, b) { return a + url + b; });
    });
    return html;
  }

  /** For pages at the project root (index.html): ../../x -> x, page.html -> pages/user/page.html. */
  function rebaseHrefs(html) {
    return html.replace(/href="([^"]*)"/g, function (match, url) {
      if (!url || /^(#|\/|[a-z][a-z0-9+.-]*:)/i.test(url)) return match;
      if (url.indexOf("../../") === 0) return 'href="' + url.slice(6) + '"';
      return 'href="pages/user/' + url + '"';
    });
  }

  function define(tag, def) {
    registry[tag] = def;
    if (!global.customElements || global.customElements.get(tag)) return;

    global.customElements.define(
      tag,
      class extends HTMLElement {
        connectedCallback() {
          var active = (this.getAttribute("active") || "")
            .split(",")
            .map(function (s) { return s.trim(); })
            .filter(Boolean);
          var html = applyHrefs(render(def, active), this.getAttribute("hrefs"));
          if (this.hasAttribute("root")) html = rebaseHrefs(html);
          this.insertAdjacentHTML("afterend", html);
          this.remove();
        }
      }
    );
  }

  global.TosComponents = {
    define: define,
    render: function (tag, active) { return render(registry[tag], active); },
    registry: registry,
  };
})(typeof window !== "undefined" ? window : globalThis);

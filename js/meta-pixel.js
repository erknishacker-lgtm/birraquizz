/**
 * Meta Pixel — evento PageView em todas as páginas / telas.
 * ID: 1692279998539511
 *
 * O <head> já faz init + PageView da carga.
 * Este arquivo só expõe PageView extra (ex.: telas do quiz SPA).
 */
(function () {
  function trackPageView(contentName) {
    if (typeof fbq !== "function") return;
    fbq("track", "PageView", {
      content_name: contentName || document.body.getAttribute("data-page") || document.title || "page",
    });
  }

  window.metaTrackPageView = trackPageView;
})();

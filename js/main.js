/* ==========================================================================
   Las Vegas Warehouse — shared site behavior
   Injects header/footer partials, wires nav + mobile menu + lightbox +
   review carousel + stubbed forms.
   ========================================================================== */

(function () {
  "use strict";

  var PHONE = "1-800-806-4119";
  var PHONE_DIGITS = "18008064119";
  // Google Ads click-to-call conversion tracking (gtag_report_conversion is
  // defined per-page in <head>, right after the Google tag).
  var CALL_ONCLICK = ' onclick="return gtag_report_conversion(\'tel:' + PHONE_DIGITS + '\');"';

  var NAV = [
    { label: "Home", href: "index.html" },
    {
      label: "Warehouse Services",
      href: "warehouse-services.html",
      children: [
        { label: "Small Local Moves and Storage", href: "small-local-moves-and-storage.html" }
      ]
    },
    {
      label: "What We Do",
      href: "#",
      children: [
        { label: "Safe Secure Art Storage", href: "safe-secure-art-storage.html" },
        { label: "Convention Storage", href: "convention-storage.html" },
        { label: "Antiques & Auctions", href: "antiques-and-auctions.html" },
        { label: "Cross Docking", href: "cross-docking.html" }
      ]
    },
    { label: "Fine Art Installation / Removal", href: "fine-art-installation-removal.html" },
    { label: "Our History", href: "our-history.html" },
    { label: "Careers", href: "careers.html" },
    { label: "Contact Us", href: "contact.html" },
    { label: "Request Quote", href: "get-started.html" }
  ];

  function navHTML() {
    var desktop = NAV.map(function (item) {
      var hasKids = item.children && item.children.length;
      var sub = hasKids
        ? '<ul class="dropdown">' +
          item.children.map(function (c) {
            return '<li><a href="' + c.href + '" data-nav-href="' + c.href + '">' + c.label + "</a></li>";
          }).join("") +
          "</ul>"
        : "";
      return (
        '<li data-nav-item="' + item.href + '">' +
        '<a href="' + item.href + '" data-nav-href="' + item.href + '"' +
        (hasKids ? ' aria-haspopup="true" aria-expanded="false"' : "") + ">" + item.label +
        (hasKids ? '<span class="plus">+</span>' : "") +
        "</a>" + sub +
        "</li>"
      );
    }).join("");

    var mobile = NAV.map(function (item, i) {
      var hasKids = item.children && item.children.length;
      var sub = hasKids
        ? '<ul class="mobile-sub" id="mobile-sub-' + i + '">' +
          item.children.map(function (c) {
            return '<li><a href="' + c.href + '" data-nav-href="' + c.href + '">' + c.label + "</a></li>";
          }).join("") +
          "</ul>"
        : "";
      return (
        "<li>" +
        '<a href="' + item.href + '" data-nav-href="' + item.href + '"' +
        (hasKids ? ' data-mobile-toggle="mobile-sub-' + i + '" aria-haspopup="true" aria-expanded="false" aria-controls="mobile-sub-' + i + '"' : "") + ">" +
        item.label + (hasKids ? '<span class="plus">+</span>' : "") +
        "</a>" + sub +
        "</li>"
      );
    }).join("");

    return (
      '<div class="utility-bar">' +
        '<div class="container">' +
          '<div class="u-addr">4640 Polaris Ave. Las Vegas, NV 89103</div>' +
          '<div class="u-right">' +
            '<a class="u-call" href="tel:' + PHONE_DIGITS + '"' + CALL_ONCLICK + ">Call Us : " + PHONE + "</a>" +
            '<div class="u-sep"></div>' +
            '<a class="u-contact" href="contact.html">Contact Us</a>' +
          "</div>" +
        "</div>" +
      "</div>" +
      '<nav class="site-nav">' +
        '<div class="container">' +
          '<a href="index.html" class="logo-link"><img src="assets/lvw-logo.webp" alt="Las Vegas Warehouse"></a>' +
          '<div class="main-nav" aria-label="Primary">' +
            "<ul>" + desktop + "</ul>" +
          "</div>" +
          '<div class="scroll-cta">' +
            '<div class="scroll-rating">' +
              '<svg width="16" height="16" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"></path><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"></path><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"></path><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"></path></svg>' +
              '<span class="scroll-rating-stars">' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>' +
                '<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>' +
              "</span>" +
            "</div>" +
            '<a href="get-started.html" class="btn btn-primary btn-sm">Request Quote</a>' +
            '<a href="tel:' + PHONE_DIGITS + '" class="btn btn-primary btn-sm"' + CALL_ONCLICK + ">" + PHONE + "</a>" +
          "</div>" +
          '<button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false" aria-controls="mobileNav"><span></span><span></span><span></span></button>' +
        "</div>" +
      "</nav>" +
      '<div class="nav-scrim" id="navScrim"></div>' +
      '<div class="mobile-sticky-cta">' +
        '<a href="get-started.html" class="btn btn-primary">Request Quote</a>' +
        '<a href="tel:' + PHONE_DIGITS + '" class="btn btn-primary"' + CALL_ONCLICK + ">" + PHONE + "</a>" +
      "</div>" +
      '<aside class="mobile-nav" id="mobileNav">' +
        '<button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">&times;</button>' +
        '<nav aria-label="Mobile"><ul>' + mobile + "</ul></nav>" +
        '<a class="btn btn-primary btn-block mobile-nav-cta" href="contact.html">Talk With Us</a>' +
      "</aside>"
    );
  }

  function footerHTML() {
    return (
      '<div class="container">' +
        '<div class="footer-grid">' +
          "<div>" +
            '<img class="footer-logo" src="assets/lvw-logo-white.webp" alt="Las Vegas Warehouse" loading="lazy">' +
            '<p class="f-blurb">Full-service warehouse storage, packing, and 3PL fulfillment out of Las Vegas, NV.</p>' +
            '<div class="footer-social">' +
              '<a href="#" aria-label="Facebook"><img src="images/social-facebook.webp" alt="" width="18" height="18" loading="lazy"></a>' +
              '<a href="https://x.com/lasvwarehouse" target="_blank" rel="noopener noreferrer" aria-label="X"><img src="images/social-x.webp" alt="" width="18" height="18" loading="lazy"></a>' +
              '<a href="https://www.linkedin.com/company/101277738" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><img src="images/social-linkedin.webp" alt="" width="18" height="18" loading="lazy"></a>' +
            "</div>" +
          "</div>" +
          "<div>" +
            "<h3>Explore</h3>" +
            '<nav class="footer-links" aria-label="Explore">' +
              '<a href="our-history.html">Our History</a>' +
              '<a href="warehouse-services.html">What We Do</a>' +
              '<a href="get-started.html">Get Started</a>' +
              '<a href="careers.html">Careers</a>' +
            "</nav>" +
          "</div>" +
          "<div>" +
            "<h3>Support</h3>" +
            '<nav class="footer-links" aria-label="Support">' +
              '<a href="contact.html">Contact Us</a>' +
              '<a href="mailto:Contact@LasVegasWarehouse.com">Contact@LasVegasWarehouse.com</a>' +
              '<a href="privacy-policy.html">Privacy Policy</a>' +
            "</nav>" +
          "</div>" +
          "<div>" +
            "<h3>Address</h3>" +
            "<address>4640 Polaris Ave<br>Las Vegas, NV 89103</address>" +
          "</div>" +
        "</div>" +
        '<hr class="footer-hr">' +
        '<div class="footer-bottom">&copy; Las Vegas Warehouse. All rights reserved.</div>' +
      "</div>"
    );
  }

  function injectPartials() {
    var h = document.getElementById("site-header");
    var f = document.getElementById("site-footer");
    if (h) h.innerHTML = navHTML();
    if (f) f.innerHTML = footerHTML();
  }

  function markActive() {
    var current = document.body.getAttribute("data-page") || "index.html";
    document.querySelectorAll("[data-nav-href]").forEach(function (a) {
      if (a.getAttribute("data-nav-href") === current) {
        var li = a.closest("li");
        if (!li) return;
        li.classList.add("active");
        var group = li.closest(".dropdown, .mobile-sub");
        if (group) {
          var parentLi = group.closest("li");
          if (parentLi) parentLi.classList.add("active");
        }
      }
    });
  }

  function wireHeaderScroll() {
    var header = document.getElementById("site-header");
    if (!header) return;
    var ticking = false;
    function update() {
      var scrolled = window.scrollY > 40;
      header.classList.toggle("is-scrolled", scrolled);
      document.body.classList.toggle("is-scrolled", scrolled);
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    });
    update();
  }

  function wireDropdowns() {
    document.querySelectorAll('.main-nav > ul > li > a[href="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var open = a.closest("li").classList.toggle("open");
        a.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });
  }

  function wireMobileNav() {
    var toggle = document.getElementById("navToggle");
    var close = document.getElementById("mobileNavClose");
    var panel = document.getElementById("mobileNav");
    var scrim = document.getElementById("navScrim");
    function open() {
      panel.classList.add("open"); scrim.classList.add("open"); document.body.style.overflow = "hidden";
      if (toggle) toggle.setAttribute("aria-expanded", "true");
    }
    function shut() {
      panel.classList.remove("open"); scrim.classList.remove("open"); document.body.style.overflow = "";
      if (toggle) toggle.setAttribute("aria-expanded", "false");
    }
    if (toggle) toggle.addEventListener("click", open);
    if (close) close.addEventListener("click", shut);
    if (scrim) scrim.addEventListener("click", shut);
    document.querySelectorAll("[data-mobile-toggle]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var sub = document.getElementById(a.getAttribute("data-mobile-toggle"));
        if (sub) {
          var isOpen = sub.classList.toggle("open");
          a.setAttribute("aria-expanded", isOpen ? "true" : "false");
        }
      });
    });
  }

  /* ---- Portfolio lightbox ---- */
  function wireLightbox() {
    var lightbox = document.querySelector("[data-lightbox]");
    if (!lightbox) return;
    var img = lightbox.querySelector("img");
    function open(src, alt) {
      img.src = src;
      img.alt = alt || "";
      lightbox.classList.add("open");
    }
    function close() { lightbox.classList.remove("open"); }
    document.querySelectorAll("[data-lightbox-trigger]").forEach(function (el) {
      el.addEventListener("click", function () {
        open(el.getAttribute("data-lightbox-trigger"), el.getAttribute("data-lightbox-title"));
      });
    });
    lightbox.addEventListener("click", close);
    lightbox.querySelector(".lightbox-close").addEventListener("click", function (e) {
      e.stopPropagation();
      close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---- Draggable, auto-scrolling client logo marquee ---- */
  function wireLogoMarquee() {
    document.querySelectorAll("[data-logo-marquee]").forEach(function (wrap) {
      var track = wrap.querySelector(".logo-marquee-track");
      if (!track) return;
      var pos = 0;
      var setWidth = 0;
      var paused = false;
      var dragging = false;
      var pointerId = null;
      var startX = 0;
      var startPos = 0;
      var moved = 0;
      var resumeTimer = null;

      function measure() {
        setWidth = track.scrollWidth / 2;
      }
      function apply() {
        track.style.transform = "translateX(" + pos + "px)";
      }
      function tick() {
        if (!paused && !dragging && setWidth) {
          pos -= 0.6;
          if (pos <= -setWidth) pos += setWidth;
          apply();
        }
        requestAnimationFrame(tick);
      }

      // Deferred to next frame: injectPartials() just wrote innerHTML on the
      // header, invalidating layout. Reading scrollWidth synchronously right
      // after that forces the browser to do an unscheduled layout pass; a
      // rAF callback runs after the browser's own layout/paint step instead.
      requestAnimationFrame(measure);
      window.addEventListener("resize", measure);
      requestAnimationFrame(tick);

      wrap.addEventListener("mouseenter", function () { paused = true; });
      wrap.addEventListener("mouseleave", function () { paused = false; });

      function resumeSoon() {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () { paused = false; }, 800);
      }

      function onDown(e) {
        dragging = true;
        paused = true;
        pointerId = e.pointerId;
        moved = 0;
        wrap.classList.add("dragging");
        wrap.setPointerCapture(pointerId);
        startX = e.clientX;
        startPos = pos;
      }
      function onMove(e) {
        if (!dragging || e.pointerId !== pointerId || !setWidth) return;
        moved = Math.abs(e.clientX - startX);
        pos = startPos + (e.clientX - startX);
        if (pos > 0) pos -= setWidth;
        if (pos <= -setWidth) pos += setWidth;
        apply();
      }
      function onUp(e) {
        if (!dragging || e.pointerId !== pointerId) return;
        dragging = false;
        wrap.classList.remove("dragging");
        resumeSoon();
      }
      // Swallow the click that follows a real drag so clickable slides
      // (e.g. photo marquees wired to the lightbox) don't open on release.
      wrap.addEventListener("click", function (e) {
        if (moved > 6) {
          e.preventDefault();
          e.stopPropagation();
          moved = 0;
        }
      }, true);

      wrap.addEventListener("pointerdown", onDown);
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerup", onUp);
      wrap.addEventListener("pointercancel", onUp);
    });
  }

  /* ---- Google review carousel ---- */
  function wireReviews() {
    var wrap = document.querySelector("[data-reviews]");
    if (!wrap) return;
    var track = wrap.querySelector(".review-track");
    var reviews = JSON.parse(wrap.getAttribute("data-reviews"));
    var mobileQuery = window.matchMedia("(max-width: 640px)");
    var index = 0;
    var expanded = {};

    function getPerPage() {
      return mobileQuery.matches ? 1 : 3;
    }

    function starSVG() {
      return '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>';
    }
    function googleG() {
      return '<svg width="15" height="15" viewBox="0 0 48 48"><path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"></path><path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"></path><path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"></path><path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"></path></svg>';
    }

    function render() {
      var html = "";
      var perPage = getPerPage();
      for (var i = 0; i < perPage; i++) {
        var rev = reviews[(index + i) % reviews.length];
        var isLong = rev.quote.length > 220;
        var isExpanded = !!expanded[rev.name + i];
        var display = isLong && !isExpanded ? rev.quote.slice(0, 220).trim() + "…" : rev.quote;
        html +=
          '<div class="review-card">' +
            '<div class="review-quote-mark">&ldquo;</div>' +
            '<div class="review-stars"><div class="stars">' + starSVG().repeat(5) + "</div>" + googleG() + "</div>" +
            '<p class="review-body">' + display + "</p>" +
            (isLong ? '<button class="review-toggle" data-toggle="' + i + '">' + (isExpanded ? "Show less" : "See full review") + "</button>" : "") +
            '<div class="review-attrib"><div class="r-name">' + rev.name + '</div><div class="r-meta">' + rev.meta + "</div></div>" +
          "</div>";
      }
      track.innerHTML = html;
      track.querySelectorAll("[data-toggle]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var i = btn.getAttribute("data-toggle");
          var rev = reviews[(index + Number(i)) % reviews.length];
          var key = rev.name + i;
          expanded[key] = !expanded[key];
          render();
        });
      });
    }

    var prev = wrap.querySelector("[data-review-prev]");
    var next = wrap.querySelector("[data-review-next]");
    if (prev) prev.addEventListener("click", function () { index = (index - 1 + reviews.length) % reviews.length; render(); });
    if (next) next.addEventListener("click", function () { index = (index + 1) % reviews.length; render(); });
    mobileQuery.addEventListener("change", render);
    render();
  }

  /* ---- Forms ----
     On submit, any existing lead webhook (e.g. GoHighLevel) keeps firing as
     before. Alongside it — never instead of it — we also POST the form data
     to the send-lead-notification function so the team gets an email alert.
     Both calls run in parallel and are fire-and-forget: a failure on either
     one is logged only and never blocks navigation. keepalive lets them
     finish even though we navigate to /thank-you.html right after firing. */
  var LEAD_NOTIFICATION_ENDPOINT = "/api/send-lead-notification";
  // Extensionless: Cloudflare Pages 308-redirects /thank-you.html here anyway,
  // so navigating straight to the final URL skips a redundant redirect hop.
  var THANK_YOU_PATH = "/thank-you";

  /* ---- Lead source attribution ----
     Captured once per browser session (first-touch: an ad click that lands,
     then browses a few more pages before submitting, should still be
     attributed to that first click, not whatever page the form is on).
     Google Ads and tagged campaigns (utm_source/utm_medium) are unambiguous.
     A bare Google referrer is NOT: Google Business Profile "Website" button
     clicks and organic search results both show referrer=google.com with no
     way to tell them apart client-side. To get a clean GBP bucket, tag the
     GBP listing's website link with e.g. ?utm_source=gbp&utm_medium=organic. */
  var ATTRIBUTION_STORAGE_KEY = "lvw_attribution";

  function classifySource(params, referrer) {
    var gclid = params.get("gclid");
    var utmSource = params.get("utm_source");
    var utmMedium = params.get("utm_medium");
    var utmCampaign = params.get("utm_campaign") || "";

    if (gclid || (utmSource && /google/i.test(utmSource) && utmMedium && /cpc|ppc|paid/i.test(utmMedium))) {
      return { source: "Google Ads", campaign: utmCampaign };
    }
    if (utmSource) {
      var KNOWN_ACRONYMS = { gbp: "GBP", seo: "SEO", ppc: "PPC" };
      var label = KNOWN_ACRONYMS[utmSource.toLowerCase()] || (utmSource.charAt(0).toUpperCase() + utmSource.slice(1));
      if (utmMedium) label += " (" + utmMedium + ")";
      return { source: label, campaign: utmCampaign };
    }
    if (!referrer) {
      return { source: "Direct", campaign: "" };
    }
    var host;
    try {
      host = new URL(referrer).hostname.replace(/^www\./, "");
    } catch (e) {
      host = referrer;
    }
    if (host === window.location.hostname) {
      return { source: "Direct", campaign: "" };
    }
    if (/^google\./i.test(host)) {
      return { source: "Google (Organic or GBP)", campaign: "" };
    }
    if (/^(bing|yahoo|duckduckgo)\./i.test(host)) {
      return { source: "Organic Search (" + host + ")", campaign: "" };
    }
    return { source: "Referral (" + host + ")", campaign: "" };
  }

  function getAttribution() {
    try {
      var stored = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {}

    var result = classifySource(new URLSearchParams(window.location.search), document.referrer);

    try {
      sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(result));
    } catch (e) {}

    return result;
  }

  function serializeForm(form) {
    var data = {};
    var attribution = getAttribution();
    if (attribution.source) data.source = attribution.source;
    if (attribution.campaign) data.campaign = attribution.campaign;
    new FormData(form).forEach(function (value, key) {
      if (typeof value === "string" && value.trim() !== "") {
        data[key] = value;
      }
    });
    return data;
  }

  function sendLeadNotification(data) {
    fetch(LEAD_NOTIFICATION_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    })
      .then(function (res) {
        if (!res.ok) {
          console.error("Lead notification email failed with status " + res.status);
        }
      })
      .catch(function (err) {
        console.error("Lead notification email failed:", err);
      });
  }

  function fireExistingWebhook(form, data) {
    var webhookUrl = form.getAttribute("data-webhook-url");
    if (!webhookUrl) return;
    fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      keepalive: true,
    }).catch(function (err) {
      console.error("Lead webhook failed:", err);
    });
  }

  function wireForms() {
    document.querySelectorAll("[data-contact-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var formData = serializeForm(form);

        // Fire in parallel; neither call blocks the other or the redirect below.
        fireExistingWebhook(form, formData);
        sendLeadNotification(formData);

        window.location.href = THANK_YOU_PATH;
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectPartials();
    markActive();
    wireHeaderScroll();
    wireDropdowns();
    wireMobileNav();
    wireLightbox();
    wireLogoMarquee();
    wireReviews();
    wireForms();
    // Capture attribution on every pageview, not lazily on submit — the
    // UTM params / referrer that identify the source are only present on
    // the page someone actually landed on, which may not be the page they
    // eventually fill out the form on.
    getAttribution();
  });
})();

/* ==========================================================================
   Las Vegas Warehouse — shared site behavior
   Injects header/footer partials, wires nav + mobile menu + lightbox +
   review carousel + stubbed forms.
   ========================================================================== */

(function () {
  "use strict";

  var PHONE = "1-800-806-4119";
  var PHONE_DIGITS = "18008064119";

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
        '<a href="' + item.href + '" data-nav-href="' + item.href + '">' + item.label +
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
        (hasKids ? ' data-mobile-toggle="mobile-sub-' + i + '"' : "") + ">" +
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
            '<a class="u-call" href="tel:' + PHONE_DIGITS + '">Call Us : ' + PHONE + "</a>" +
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
            '<a href="tel:' + PHONE_DIGITS + '" class="btn btn-primary btn-sm">' + PHONE + "</a>" +
          "</div>" +
          '<button class="nav-toggle" id="navToggle" aria-label="Open menu"><span></span><span></span><span></span></button>' +
        "</div>" +
      "</nav>" +
      '<div class="nav-scrim" id="navScrim"></div>' +
      '<div class="mobile-sticky-cta">' +
        '<a href="get-started.html" class="btn btn-primary">Request Quote</a>' +
        '<a href="tel:' + PHONE_DIGITS + '" class="btn btn-primary">' + PHONE + "</a>" +
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
            '<img class="footer-logo" src="assets/lvw-logo-white.webp" alt="Las Vegas Warehouse">' +
            '<p class="f-blurb">Full-service warehouse storage, packing, and 3PL fulfillment out of Las Vegas, NV.</p>' +
            '<div class="footer-social">' +
              '<a href="#" aria-label="Facebook"><img src="images/social-facebook.webp" alt="" width="18" height="18"></a>' +
              '<a href="https://x.com/lasvwarehouse" target="_blank" rel="noopener noreferrer" aria-label="X"><img src="images/social-x.webp" alt="" width="18" height="18"></a>' +
              '<a href="https://www.linkedin.com/company/101277738" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><img src="images/social-linkedin.webp" alt="" width="18" height="18"></a>' +
            "</div>" +
          "</div>" +
          "<div>" +
            "<h4>Explore</h4>" +
            '<div class="footer-links">' +
              '<a href="our-history.html">Our History</a>' +
              '<a href="warehouse-services.html">What We Do</a>' +
              '<a href="get-started.html">Get Started</a>' +
              '<a href="careers.html">Careers</a>' +
            "</div>" +
          "</div>" +
          "<div>" +
            "<h4>Support</h4>" +
            '<div class="footer-links">' +
              '<a href="contact.html">Contact Us</a>' +
              '<a href="mailto:Contact@LasVegasWarehouse.com">Contact@LasVegasWarehouse.com</a>' +
              '<a href="privacy-policy.html">Privacy Policy</a>' +
            "</div>" +
          "</div>" +
          "<div>" +
            "<h4>Address</h4>" +
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
        a.closest("li").classList.toggle("open");
      });
    });
  }

  function wireMobileNav() {
    var toggle = document.getElementById("navToggle");
    var close = document.getElementById("mobileNavClose");
    var panel = document.getElementById("mobileNav");
    var scrim = document.getElementById("navScrim");
    function open() { panel.classList.add("open"); scrim.classList.add("open"); document.body.style.overflow = "hidden"; }
    function shut() { panel.classList.remove("open"); scrim.classList.remove("open"); document.body.style.overflow = ""; }
    if (toggle) toggle.addEventListener("click", open);
    if (close) close.addEventListener("click", shut);
    if (scrim) scrim.addEventListener("click", shut);
    document.querySelectorAll("[data-mobile-toggle]").forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var sub = document.getElementById(a.getAttribute("data-mobile-toggle"));
        if (sub) sub.classList.toggle("open");
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

  /* ---- Sliding photo carousel ---- */
  function wirePhotoCarousel() {
    document.querySelectorAll("[data-photo-carousel]").forEach(function (car) {
      var track = car.querySelector(".carousel-track");
      var slides = Array.prototype.slice.call(car.querySelectorAll(".carousel-slide"));
      var dotsWrap = car.querySelector(".carousel-dots");
      var prev = car.querySelector("[data-carousel-prev]");
      var next = car.querySelector("[data-carousel-next]");
      if (!track || !slides.length) return;
      var index = 0;
      var timer;

      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "carousel-dot";
        dot.setAttribute("aria-label", "Go to photo " + (i + 1));
        dot.addEventListener("click", function () { goTo(i); });
        if (dotsWrap) dotsWrap.appendChild(dot);
      });
      var dots = dotsWrap ? Array.prototype.slice.call(dotsWrap.children) : [];

      function update() {
        track.style.transform = "translateX(-" + index * 100 + "%)";
        dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
      }
      function goTo(i) {
        index = (i + slides.length) % slides.length;
        update();
        restart();
      }
      function restart() {
        clearInterval(timer);
        timer = setInterval(function () { goTo(index + 1); }, 5000);
      }
      if (prev) prev.addEventListener("click", function () { goTo(index - 1); });
      if (next) next.addEventListener("click", function () { goTo(index + 1); });
      car.addEventListener("mouseenter", function () { clearInterval(timer); });
      car.addEventListener("mouseleave", restart);
      update();
      restart();
    });
  }

  /* ---- Draggable, auto-scrolling client logo marquee ---- */
  function wireLogoMarquee() {
    var wrap = document.querySelector("[data-logo-marquee]");
    if (!wrap) return;
    var track = wrap.querySelector(".logo-marquee-track");
    var pos = 0;
    var setWidth = 0;
    var paused = false;
    var dragging = false;
    var pointerId = null;
    var startX = 0;
    var startPos = 0;
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

    measure();
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
      wrap.classList.add("dragging");
      wrap.setPointerCapture(pointerId);
      startX = e.clientX;
      startPos = pos;
    }
    function onMove(e) {
      if (!dragging || e.pointerId !== pointerId || !setWidth) return;
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

    wrap.addEventListener("pointerdown", onDown);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerup", onUp);
    wrap.addEventListener("pointercancel", onUp);
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

  /* ---- Stubbed forms ----
     TODO(resend): replace the setTimeout stub below with a real fetch() call
     to a Resend-backed endpoint once that's wired up server-side. */
  function wireForms() {
    document.querySelectorAll("[data-contact-form]").forEach(function (form) {
      var status = form.querySelector(".form-status");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var submitBtn = form.querySelector('button[type="submit"], a.btn[type="submit"]');
        setTimeout(function () {
          if (status) {
            status.textContent = "Thanks — your message has been received. A member of our team will reach out shortly.";
            status.classList.add("show", "success");
          }
          form.reset();
        }, 600);
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
    wirePhotoCarousel();
    wireLogoMarquee();
    wireReviews();
    wireForms();
  });
})();

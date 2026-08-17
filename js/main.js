/* ==========================================================================
   Las Vegas Warehouse — shared site behavior
   Injects the header/footer partials, wires up nav + mobile menu + forms.
   ========================================================================== */

(function () {
  "use strict";

  var NAV = [
    { label: "Home", href: "index.html" },
    {
      label: "Warehouse Services",
      href: "warehouse-services.html",
      children: [
        { label: "Small Local Moves and Storage", href: "small-local-moves-and-storage.html" }
      ]
    },
    { label: "Get Started", href: "get-started.html" },
    {
      label: "What We Do",
      href: "#",
      children: [
        { label: "Safe & Secure Art Storage", href: "safe-secure-art-storage.html" },
        { label: "Convention Storage", href: "convention-storage.html" },
        { label: "Antiques & Auctions", href: "antiques-and-auctions.html" },
        { label: "Cross Docking", href: "cross-docking.html" }
      ]
    },
    { label: "Fine Art Installation / Removal", href: "fine-art-installation-removal.html" },
    { label: "Our History", href: "our-history.html" },
    { label: "Careers", href: "careers.html" },
    {
      label: "Contact Us",
      href: "contact.html",
      children: [
        { label: "Privacy Policy", href: "privacy-policy.html" }
      ]
    }
  ];

  function headerHTML() {
    var desktopItems = NAV.map(function (item) {
      var hasKids = item.children && item.children.length;
      var sub = hasKids
        ? '<ul class="dropdown">' +
          item.children.map(function (c) {
            return '<li><a href="' + c.href + '" data-nav-href="' + c.href + '">' + c.label + "</a></li>";
          }).join("") +
          "</ul>"
        : "";
      return (
        '<li class="' + (hasKids ? "has-dropdown" : "") + '" data-nav-item="' + item.href + '">' +
        '<a href="' + item.href + '" data-nav-href="' + item.href + '">' + item.label +
        (hasKids ? '<span class="caret">&#9662;</span>' : "") +
        "</a>" + sub +
        "</li>"
      );
    }).join("");

    var mobileItems = NAV.map(function (item, i) {
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
        item.label + (hasKids ? '<span class="caret">&#9662;</span>' : "") +
        "</a>" + sub +
        "</li>"
      );
    }).join("");

    return (
      '<div class="utility-bar">' +
        '<div class="container">' +
          '<a class="u-call" href="tel:18008064119">Call Us : <span>1-800-806-4119</span></a>' +
          '<div class="u-social">' +
            '<a href="#" aria-label="Facebook">f</a>' +
            '<a href="#" aria-label="Twitter / X">x</a>' +
            '<a href="#" aria-label="LinkedIn">in</a>' +
          "</div>" +
        "</div>" +
      "</div>" +
      '<header class="site-header">' +
        '<div class="container">' +
          '<a href="index.html" class="logo">Las Vegas <span>Warehouse</span><small>Storage &middot; Fulfillment &middot; 3PL</small></a>' +
          '<nav class="main-nav" aria-label="Primary">' +
            "<ul>" + desktopItems + "</ul>" +
          "</nav>" +
          '<div class="header-cta">' +
            '<a class="btn btn-primary btn-sm" href="contact.html">Talk With Us</a>' +
            '<button class="nav-toggle" id="navToggle" aria-label="Open menu"><span></span><span></span><span></span></button>' +
          "</div>" +
        "</div>" +
      "</header>" +
      '<div class="nav-scrim" id="navScrim"></div>' +
      '<aside class="mobile-nav" id="mobileNav">' +
        '<button class="mobile-nav-close" id="mobileNavClose" aria-label="Close menu">&times;</button>' +
        '<nav aria-label="Mobile"><ul>' + mobileItems + "</ul></nav>" +
        '<a class="btn btn-primary btn-block mobile-nav-cta" href="contact.html">Talk With Us</a>' +
      "</aside>"
    );
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    return (
      '<div class="container">' +
        '<div class="footer-grid">' +
          "<div>" +
            '<a href="index.html" class="logo" style="margin-bottom:14px;">Las Vegas <span>Warehouse</span></a>' +
            '<p class="footer-blurb">Full-service warehouse storage, fulfillment, and 3PL logistics in Las Vegas, NV &mdash; trusted with fine art, conventions, antiques, and high-value assets for 20+ years.</p>' +
            '<div class="footer-social">' +
              '<a href="#" aria-label="Facebook">f</a>' +
              '<a href="#" aria-label="Twitter / X">x</a>' +
              '<a href="#" aria-label="LinkedIn">in</a>' +
            "</div>" +
          "</div>" +
          "<div>" +
            "<h4>Explore</h4>" +
            "<ul>" +
              '<li><a href="our-history.html">Our History</a></li>' +
              '<li><a href="warehouse-services.html">Warehouse Services</a></li>' +
              '<li><a href="get-started.html">Get Started</a></li>' +
              '<li><a href="careers.html">Careers</a></li>' +
            "</ul>" +
          "</div>" +
          "<div>" +
            "<h4>What We Do</h4>" +
            "<ul>" +
              '<li><a href="safe-secure-art-storage.html">Art Storage</a></li>' +
              '<li><a href="convention-storage.html">Convention Storage</a></li>' +
              '<li><a href="antiques-and-auctions.html">Antiques &amp; Auctions</a></li>' +
              '<li><a href="cross-docking.html">Cross Docking</a></li>' +
            "</ul>" +
          "</div>" +
          "<div>" +
            "<h4>Stay in the Loop</h4>" +
            '<p style="font-size:0.88rem;">Occasional updates on capacity, services, and storage tips. No spam.</p>' +
            '<form class="newsletter-form" data-newsletter-form>' +
              '<input type="email" placeholder="Email address" required aria-label="Email address">' +
              '<button type="submit" class="btn btn-primary btn-sm">Join</button>' +
            "</form>" +
          "</div>" +
        "</div>" +
        '<div class="footer-bottom">' +
          '<span>&copy; ' + year + " Las Vegas Warehouse. All rights reserved. &middot; 4640 Polaris Ave, Las Vegas, NV 89103</span>" +
          '<ul><li><a href="privacy-policy.html">Privacy Policy</a></li><li><a href="contact.html">Contact</a></li></ul>' +
        "</div>" +
      "</div>"
    );
  }

  function injectPartials() {
    var headerMount = document.getElementById("site-header");
    var footerMount = document.getElementById("site-footer");
    if (headerMount) headerMount.innerHTML = headerHTML();
    if (footerMount) footerMount.innerHTML = footerHTML();
  }

  function markActiveLinks() {
    var current = (document.body.getAttribute("data-page") || "index.html");
    document.querySelectorAll("[data-nav-href]").forEach(function (a) {
      if (a.getAttribute("data-nav-href") === current) {
        a.closest("li").classList.add("active");
      }
    });
  }

  function wireDesktopDropdowns() {
    document.querySelectorAll(".main-nav .has-dropdown > a").forEach(function (a) {
      a.addEventListener("click", function (e) {
        if (a.getAttribute("href") === "#") {
          e.preventDefault();
          var li = a.closest("li");
          li.classList.toggle("dropdown-open");
        }
      });
    });
  }

  function wireMobileNav() {
    var toggle = document.getElementById("navToggle");
    var close = document.getElementById("mobileNavClose");
    var panel = document.getElementById("mobileNav");
    var scrim = document.getElementById("navScrim");

    function open() {
      panel.classList.add("open");
      scrim.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function shut() {
      panel.classList.remove("open");
      scrim.classList.remove("open");
      document.body.style.overflow = "";
    }
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

  /* ---- Stat counters ---- */
  function animateCounters() {
    var counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    var seen = new WeakSet();
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        var el = entry.target;
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var suffix = el.getAttribute("data-suffix") || "";
        var start = 0;
        var duration = 1200;
        var startTime = null;
        function tick(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var value = Math.floor(start + (target - start) * (1 - Math.pow(1 - progress, 3)));
          el.textContent = value + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (c) { observer.observe(c); });
  }

  /* ---- Testimonial carousel ---- */
  function wireTestimonials() {
    var wrap = document.querySelector("[data-testimonials]");
    if (!wrap) return;
    var slides = wrap.querySelectorAll(".testimonial-slide");
    var dotsWrap = wrap.querySelector(".testimonial-dots");
    if (!slides.length) return;
    var index = 0;

    slides.forEach(function (s, i) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", function () { show(i); });
      dotsWrap.appendChild(dot);
    });

    function show(i) {
      slides[index].classList.remove("active");
      dotsWrap.children[index].classList.remove("active");
      index = (i + slides.length) % slides.length;
      slides[index].classList.add("active");
      dotsWrap.children[index].classList.add("active");
    }

    setInterval(function () { show(index + 1); }, 6000);
  }

  /* ---- Stubbed forms ----
     TODO(resend): replace the setTimeout stub below with a real fetch() call
     to a Resend-backed endpoint (e.g. POST /api/contact) once that's wired
     up server-side. Keep the client-side validation + status UI as-is. */
  function wireStubbedForms() {
    document.querySelectorAll("[data-contact-form]").forEach(function (form) {
      var status = form.querySelector(".form-status");
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }
        var submitBtn = form.querySelector('button[type="submit"]');
        var originalText = submitBtn ? submitBtn.textContent : "";
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = "Sending...";
        }
        // Stubbed submission — no email is actually sent yet.
        setTimeout(function () {
          if (status) {
            status.textContent = "Thanks — your message has been received. A member of our team will reach out shortly.";
            status.classList.remove("error");
            status.classList.add("success", "show");
          }
          form.reset();
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }, 700);
      });
    });

    document.querySelectorAll("[data-newsletter-form]").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var input = form.querySelector("input");
        if (input) input.value = "Thanks for subscribing!";
        setTimeout(function () { form.reset(); }, 2500);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    injectPartials();
    markActiveLinks();
    wireDesktopDropdowns();
    wireMobileNav();
    animateCounters();
    wireTestimonials();
    wireStubbedForms();
  });
})();

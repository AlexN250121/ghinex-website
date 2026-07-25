/* =====================================================================
   GHINEX — Website 2 interactions
   ===================================================================== */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Nav + progress */
  var nav = document.getElementById("nav");
  var progress = document.getElementById("progress");
  function onScroll() {
    var s = window.scrollY;
    if (nav) nav.classList.toggle("scrolled", s > 20);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (s / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  var burger = document.getElementById("burger");
  var menu = document.getElementById("menu");
  function setMenu(open) {
    if (!menu || !burger) return;
    menu.classList.toggle("open", open);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (burger && menu) {
    burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
    menu.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });
  }

  /* Reveals */
  var reveals = document.querySelectorAll(".r:not(.in)");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("in"); });
  } else {
    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* Count-up */
  var counters = document.querySelectorAll("[data-count]");
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suf = el.getAttribute("data-suffix") || "";
    var inner = el.querySelector(".u");
    function render(v) { if (inner) inner.textContent = v; else el.textContent = v + suf; }
    if (reduce || isNaN(target)) { render(target); return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      render(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
    // Guarantee the final value even if rAF is throttled (e.g. background tab)
    setTimeout(function () { render(target); }, dur + 250);
  }
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (es, o) {
      es.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); o.unobserve(en.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { cio.observe(c); });
  } else { counters.forEach(countUp); }

  /* How-it-works timeline: fill line + light up steps on scroll */
  var steps = document.getElementById("steps");
  var fill = document.getElementById("stepsFill");
  if (steps) {
    var stepEls = [].slice.call(steps.querySelectorAll(".step"));
    function updateSteps() {
      var r = steps.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = Math.min(Math.max((vh * 0.75 - r.top) / (r.height + vh * 0.2), 0), 1);
      if (fill) fill.style.width = (p * 88) + "%";
      var lit = Math.round(p * stepEls.length);
      stepEls.forEach(function (s, i) { s.classList.toggle("on", i < Math.max(lit, p > 0 ? 1 : 0)); });
    }
    if (reduce) { stepEls.forEach(function (s) { s.classList.add("on"); }); if (fill) fill.style.width = "88%"; }
    else { window.addEventListener("scroll", updateSteps, { passive: true }); window.addEventListener("resize", updateSteps); updateSteps(); }
  }

  /* Accordion */
  document.querySelectorAll(".acc__item").forEach(function (item) {
    var head = item.querySelector(".acc__head");
    if (head) head.addEventListener("click", function () {
      var open = item.classList.toggle("open");
      head.setAttribute("aria-expanded", String(open));
    });
  });
  function openFromHash() {
    var id = location.hash.replace("#", "");
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.classList.contains("acc__item") && !el.classList.contains("open")) {
      el.classList.add("open");
      var h = el.querySelector(".acc__head"); if (h) h.setAttribute("aria-expanded", "true");
    }
  }
  openFromHash();
  window.addEventListener("hashchange", openFromHash);

  /* Contact form → cosec@ghinex.com (FormSubmit, with mailto fallback) */
  var CONTACT_EMAIL = "cosec@ghinex.com";
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
  var form = document.getElementById("leadForm");
  var note = document.getElementById("formNote");
  function setNote(m, k) { if (note) { note.textContent = m; note.className = "form__note" + (k ? " " + k : ""); } }
  function mailtoFallback(d) {
    var subject = "Enquiry — " + (d.service || "General") + " — " + d.name;
    var body = "Name: " + d.name + "\nCompany: " + (d.company || "-") + "\nEmail: " + d.email +
      "\nPhone: " + (d.phone || "-") + "\nInterested in: " + (d.service || "-") + "\n\nMessage:\n" + (d.message || "-") + "\n";
    window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    setNote("Opening your email app so you can send it to " + CONTACT_EMAIL + "…", "ok");
  }
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = Object.fromEntries(new FormData(form).entries());
      if (d._honey) return;
      if (!d.name || !d.email) { setNote("Please add your name and email so we can reply.", "err"); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { setNote("That email address doesn't look quite right.", "err"); return; }
      var btn = form.querySelector('button[type="submit"]');
      if (btn) btn.disabled = true;
      setNote("Sending…");
      var payload = { name: d.name, company: d.company || "", email: d.email, phone: d.phone || "", service: d.service || "", message: d.message || "", _subject: "New enquiry from ghinex.com — " + (d.service || "General"), _template: "table", _captcha: "false" };
      fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) })
        .then(function (r) { return r.json().catch(function () { return {}; }); })
        .then(function (json) {
          if (btn) btn.disabled = false;
          if (json && (json.success === true || json.success === "true")) { form.reset(); setNote("Thank you — your enquiry is on its way. We'll be in touch shortly.", "ok"); }
          else mailtoFallback(d);
        })
        .catch(function () { if (btn) btn.disabled = false; mailtoFallback(d); });
    });
  }
})();

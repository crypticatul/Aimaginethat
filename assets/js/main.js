/* AImagineThat — interactions */
(() => {
  "use strict";

  /* ---------- Sticky nav ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Theme toggle ---------- */
  const themeBtn = document.querySelector(".theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("aimt-theme", next);
    });
  }

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll(".nav__links a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Dashboard activity feed ---------- */
  const log = document.getElementById("agent-log");
  if (log) {
    const script = [
      { t: "9:41 AM", dot: "green", title: "Answered call from Maria S.", sub: "Booked a cleaning · Tue 2:30 PM" },
      { t: "9:48 AM", dot: "blue", title: "Missed call rescued", sub: "Texted John back within 8 seconds" },
      { t: "10:02 AM", dot: "violet", title: "New lead from your website", sub: "Called back in 22 seconds · quote requested" },
      { t: "10:15 AM", dot: "green", title: "Appointment reminder sent", sub: "3 patients confirmed for tomorrow" },
      { t: "10:31 AM", dot: "amber", title: "Review request sent", sub: "Sarah left you 5 stars on Google" },
      { t: "10:47 AM", dot: "blue", title: "Rescheduled Mike T.", sub: "Moved Thursday 4 PM → Friday 11 AM" },
      { t: "11:03 AM", dot: "violet", title: "Follow-up sequence started", sub: "Day 1 of 7 · new patient welcome" },
      { t: "11:20 AM", dot: "green", title: "Invoice reminder sent", sub: "Payment link texted to 2 customers" },
      { t: "11:38 AM", dot: "blue", title: "After-hours call handled", sub: "Emergency triaged · Dr. Lee notified" },
      { t: "11:52 AM", dot: "green", title: "Insurance question answered", sub: "Coverage confirmed from your FAQ" },
    ];

    const MAX_ITEMS = 5;
    let idx = 0;

    const addLine = () => {
      const item = script[idx % script.length];
      const row = document.createElement("div");
      row.className = "feed-item";
      row.innerHTML =
        `<span class="feed-item__dot feed-item__dot--${item.dot}"></span>` +
        `<div><b>${item.title}</b><span>${item.sub}</span></div>` +
        `<time>${item.t}</time>`;
      log.appendChild(row);
      while (log.children.length > MAX_ITEMS) log.removeChild(log.firstChild);
      idx++;
    };

    if (reducedMotion) {
      script.slice(0, MAX_ITEMS).forEach((_, i) => { idx = i; addLine(); });
    } else {
      for (let i = 0; i < 4; i++) addLine();
      setInterval(addLine, 3200);
    }
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".stat-num[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const decimals = (String(el.dataset.count).split(".")[1] || "").length;
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = prefix + (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window && !reducedMotion) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            animateCount(e.target);
            cio.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  /* ---------- Contact form: validation shake + success ---------- */
  const form = document.querySelector(".contact__form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = [...form.querySelectorAll("[required]")].filter((f) => !f.checkValidity());
      if (invalid.length) {
        invalid.forEach((f) => {
          f.classList.remove("is-invalid");
          void f.offsetWidth; // restart shake
          f.classList.add("is-invalid");
          f.addEventListener("input", () => f.classList.remove("is-invalid"), { once: true });
        });
        invalid[0].focus();
        return;
      }
      const btn = form.querySelector("button[type=submit]");
      btn.classList.add("is-success");
      btn.textContent = "✓ Inquiry received — we'll reply within 4 hours";
      btn.disabled = true;
    });
  }
})();

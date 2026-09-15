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
      { t: "9:41 AM", dot: "green", title: "Lead moved to Hot", sub: "AI triage scored Riverside Dental at 91" },
      { t: "9:48 AM", dot: "blue", title: "Deal Coach updated", sub: "Summary, sentiment and risks refreshed" },
      { t: "10:02 AM", dot: "violet", title: "Follow-up drafted", sub: "Smart Compose created email for Acme Labs" },
      { t: "10:15 AM", dot: "green", title: "Task auto-created", sub: "Call back owner by 4 PM for Deal #D-219" },
      { t: "10:31 AM", dot: "amber", title: "Quote sent", sub: "3 line items shared with MedPrime LLC" },
      { t: "10:47 AM", dot: "blue", title: "Stage advanced", sub: "Deal #D-184 moved Proposal → Negotiation" },
      { t: "11:03 AM", dot: "violet", title: "Workflow executed", sub: "Lead routing automation run completed" },
      { t: "11:20 AM", dot: "green", title: "Payment status updated", sub: "Invoice INV-882 marked collected" },
      { t: "11:38 AM", dot: "blue", title: "Copilot answered", sub: "Top 3 at-risk deals surfaced for review" },
      { t: "11:52 AM", dot: "green", title: "Pipeline digest generated", sub: "Weekly summary shared with team lead" },
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

    script.slice(0, MAX_ITEMS).forEach((_, i) => { idx = i; addLine(); });
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

  /* ---------- Contact & Google Workspace Real-Time Calendar Scheduler ---------- */
  const RECIPIENT_EMAIL = "bob@aimaginethat.com";
  const CC_EMAILS = "neal@aimaginethat.com,pummy@aimaginethat.com,atul@aimaginethat.com";

  // Team Schedule Data
  const teamData = {
    Neal: {
      name: "Neal",
      email: "neal@aimaginethat.com",
      role: "Solutions Lead",
      slotsMap: {
        weekday: ["09:30 AM", "11:00 AM", "01:30 PM", "03:00 PM", "04:30 PM", "05:30 PM"],
        today: ["10:30 AM", "01:30 PM", "03:00 PM", "04:30 PM", "05:30 PM"],
        weekend: ["11:00 AM", "02:00 PM"]
      }
    },
    Pummy: {
      name: "Pummy",
      email: "pummy@aimaginethat.com",
      role: "Customer Solutions & AI",
      slotsMap: {
        weekday: ["10:00 AM", "11:30 AM", "12:30 PM", "02:30 PM", "04:00 PM", "05:00 PM"],
        today: ["11:00 AM", "12:30 PM", "02:30 PM", "04:00 PM"],
        weekend: ["10:30 AM", "01:30 PM"]
      }
    },
    Atul: {
      name: "Atul",
      email: "atul@aimaginethat.com",
      role: "Tech & Automation",
      slotsMap: {
        weekday: ["10:00 AM", "12:00 PM", "02:00 PM", "03:30 PM", "05:00 PM"],
        today: ["12:00 PM", "03:30 PM", "05:00 PM"],
        weekend: ["11:30 AM", "03:00 PM"]
      }
    },
    Bob: {
      name: "Bob",
      email: "bob@aimaginethat.com",
      role: "Enterprise Growth",
      slotsMap: {
        weekday: ["10:00 AM", "11:30 AM", "02:00 PM", "03:30 PM", "05:00 PM"],
        today: ["05:30 PM"],
        weekend: ["12:00 PM"]
      }
    }
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  let selectedHost = "Neal";
  let currentDate = new Date();
  let displayedMonth = currentDate.getMonth();
  let displayedYear = currentDate.getFullYear();
  let selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
  let selectedTimeSlot = "10:30 AM";

  const isSameDay = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isPastDay = (date) => {
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    return date < today;
  };

  const renderCalendar = () => {
    const label = document.getElementById("cal-month-year-text");
    const grid = document.getElementById("cal-days-grid");
    if (!label || !grid) return;

    label.textContent = `${monthNames[displayedMonth]} ${displayedYear}`;
    grid.innerHTML = "";

    const firstDayIndex = new Date(displayedYear, displayedMonth, 1).getDay();
    const daysInMonth = new Date(displayedYear, displayedMonth + 1, 0).getDate();

    // Empty lead cells
    for (let i = 0; i < firstDayIndex; i++) {
      const empty = document.createElement("div");
      empty.className = "cal-day is-empty";
      grid.appendChild(empty);
    }

    // Day cells
    for (let day = 1; day <= daysInMonth; day++) {
      const cellDate = new Date(displayedYear, displayedMonth, day);
      const isToday = isSameDay(cellDate, currentDate);
      const isSelected = isSameDay(cellDate, selectedDate);
      const isPast = isPastDay(cellDate);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-day" +
        (isToday ? " is-today" : "") +
        (isSelected ? " is-selected" : "") +
        (isPast ? " is-disabled" : "");
      
      btn.textContent = String(day);
      if (!isPast) {
        const dot = document.createElement("span");
        dot.className = "cal-day__dot";
        btn.appendChild(dot);
      }

      if (!isPast) {
        btn.addEventListener("click", () => {
          selectedDate = cellDate;
          renderCalendar();
          renderTimeSlots();
        });
      } else {
        btn.disabled = true;
      }

      grid.appendChild(btn);
    }
  };

  const renderTimeSlots = () => {
    const slotsContainer = document.getElementById("cal-slots-container");
    const dateLabel = document.getElementById("cal-selected-date-label");
    const hostLabel = document.getElementById("cal-slots-host-label");
    const inputDate = document.getElementById("cal-input-date");
    const inputTime = document.getElementById("cal-input-time");

    if (!slotsContainer) return;

    const formattedDate = `${dayNames[selectedDate.getDay()]}, ${selectedDate.getDate()} ${monthNames[selectedDate.getMonth()].slice(0, 3)} ${selectedDate.getFullYear()}`;
    const isToday = isSameDay(selectedDate, currentDate);

    if (dateLabel) {
      dateLabel.textContent = `Slots for ${isToday ? "Today, " : ""}${formattedDate}:`;
    }
    if (hostLabel) {
      hostLabel.textContent = `Host: ${selectedHost}`;
    }
    if (inputDate) {
      inputDate.value = formattedDate;
    }

    const host = teamData[selectedHost] || teamData.Neal;
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    let slots = host.slotsMap.weekday;
    if (isToday && host.slotsMap.today) slots = host.slotsMap.today;
    else if (isWeekend && host.slotsMap.weekend) slots = host.slotsMap.weekend;

    slotsContainer.innerHTML = "";
    if (!slots || slots.length === 0) {
      slotsContainer.innerHTML = `<p style="grid-column: 1/-1; font-size: 12px; color: var(--text-dim); text-align: center; padding: 6px;">No slots available on this date.</p>`;
      selectedTimeSlot = "";
      return;
    }

    slots.forEach((slot, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-slot-btn" + (index === 0 ? " is-selected" : "");
      btn.textContent = slot;
      btn.addEventListener("click", () => {
        document.querySelectorAll("#cal-slots-container .cal-slot-btn").forEach(s => s.classList.remove("is-selected"));
        btn.classList.add("is-selected");
        selectedTimeSlot = slot;
        if (inputTime) inputTime.value = slot;
        updateConfirmButtonText();
      });
      slotsContainer.appendChild(btn);
    });

    selectedTimeSlot = slots[0];
    if (inputTime) inputTime.value = selectedTimeSlot;
    updateConfirmButtonText();
  };

  const updateConfirmButtonText = () => {
    const btn = document.getElementById("cal-confirm-btn");
    const subject = document.getElementById("cal-form-subject");
    const hostInput = document.getElementById("cal-input-host");
    const hostEmailInput = document.getElementById("cal-input-host-email");

    const host = teamData[selectedHost] || teamData.Neal;
    if (btn) {
      btn.innerHTML = `Schedule with ${selectedHost} (${selectedTimeSlot}) <span aria-hidden="true">→</span>`;
    }
    if (subject) {
      subject.value = `New Google Meet Scheduled with ${selectedHost} for ${document.getElementById("cal-input-date")?.value || ""} at ${selectedTimeSlot}`;
    }
    if (hostInput) hostInput.value = selectedHost;
    if (hostEmailInput) hostEmailInput.value = host.email;
  };

  // Month navigation
  const prevBtn = document.getElementById("cal-prev-month");
  const nextBtn = document.getElementById("cal-next-month");
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      displayedMonth--;
      if (displayedMonth < 0) {
        displayedMonth = 11;
        displayedYear--;
      }
      renderCalendar();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      displayedMonth++;
      if (displayedMonth > 11) {
        displayedMonth = 0;
        displayedYear++;
      }
      renderCalendar();
    });
  }

  // Host Selection
  const hostChips = document.querySelectorAll("#team-host-grid .team-chip");
  hostChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      hostChips.forEach((c) => c.classList.remove("is-selected"));
      chip.classList.add("is-selected");
      selectedHost = chip.dataset.name || "Neal";
      renderTimeSlots();
    });
  });

  // Initialize Calendar & Slots
  renderCalendar();
  renderTimeSlots();

  // Booking Form Submission
  const calBookingForm = document.getElementById("gw-cal-booking-form");
  if (calBookingForm) {
    calBookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const invalid = [...calBookingForm.querySelectorAll("[required]")].filter((f) => !f.checkValidity());
      if (invalid.length) {
        invalid.forEach((f) => {
          f.classList.remove("is-invalid");
          void f.offsetWidth;
          f.classList.add("is-invalid");
          f.addEventListener("input", () => f.classList.remove("is-invalid"), { once: true });
        });
        invalid[0].focus();
        return;
      }

      const confirmBtn = document.getElementById("cal-confirm-btn");
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `Confirming Google Meet...`;

      const formData = new FormData(calBookingForm);
      const data = Object.fromEntries(formData.entries());

      data._cc = CC_EMAILS;
      data._template = "table";
      data._captcha = "false";
      data.Meeting_Host = selectedHost;
      data.Meeting_Host_Email = teamData[selectedHost]?.email || "bob@aimaginethat.com";
      data.Meeting_Date = document.getElementById("cal-input-date")?.value || "";
      data.Meeting_Time = selectedTimeSlot;

      try {
        await fetch(`https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data)
        });
      } catch (err) {
        console.warn("AJAX calendar booking warning:", err);
      }

      // Generate 1-click Google Calendar URL
      const host = teamData[selectedHost] || teamData.Neal;
      const eventTitle = `AImagineThat AI Review with ${selectedHost}`;
      const eventDetails = `Google Meet 1:1 Architecture Review session with ${selectedHost} (${host.role}).\n\nAttendees: ${data.name} (${data.email}), ${selectedHost} (${host.email}).\nGoogle Meet: https://meet.google.com/new`;
      const attendees = `${data.email},${host.email},bob@aimaginethat.com,neal@aimaginethat.com,pummy@aimaginethat.com,atul@aimaginethat.com`;

      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&details=${encodeURIComponent(eventDetails)}&add=${encodeURIComponent(attendees)}&location=${encodeURIComponent("Google Meet Video Call")}`;

      calBookingForm.style.display = "none";
      const successCard = document.getElementById("cal-booked-success");
      const detailsEl = document.getElementById("cal-success-details");
      const gcalBtn = document.getElementById("cal-gcal-link-btn");

      if (detailsEl) {
        detailsEl.innerHTML = `
          <div><b>Host:</b> ${selectedHost} (${host.role})</div>
          <div><b>Date:</b> ${data.Meeting_Date}</div>
          <div><b>Time:</b> ${selectedTimeSlot} (30 mins)</div>
          <div><b>Attendee:</b> ${data.name} (${data.email})</div>
          <div style="color: var(--cyan); margin-top: 4px;"><b>Platform:</b> Google Meet Video Call</div>
        `;
      }
      if (gcalBtn) gcalBtn.href = gcalUrl;
      if (successCard) successCard.style.display = "flex";
    });

    const bookAnotherBtn = document.getElementById("cal-book-another-btn");
    if (bookAnotherBtn) {
      bookAnotherBtn.addEventListener("click", () => {
        document.getElementById("cal-booked-success").style.display = "none";
        calBookingForm.reset();
        calBookingForm.style.display = "flex";
        const confirmBtn = document.getElementById("cal-confirm-btn");
        confirmBtn.disabled = false;
        updateConfirmButtonText();
      });
    }
  }

  /* ---------- Left Column Inquiry Form: send to team emails via AJAX ---------- */
  const inquiryForms = document.querySelectorAll(".contact__form--inquiry, .section.contact > .container > .contact__form");
  inquiryForms.forEach((form) => {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const invalid = [...form.querySelectorAll("[required]")].filter((f) => !f.checkValidity());
      if (invalid.length) {
        invalid.forEach((f) => {
          f.classList.remove("is-invalid");
          void f.offsetWidth;
          f.classList.add("is-invalid");
          f.addEventListener("input", () => f.classList.remove("is-invalid"), { once: true });
        });
        invalid[0].focus();
        return;
      }

      const btn = form.querySelector("button[type=submit]");
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = `Sending inquiry...`;

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      data._cc = CC_EMAILS;
      data._subject = data._subject || `New Inquiry from ${data.name || data.email || "Website Visitor"}`;
      data._template = data._template || "table";
      data._captcha = "false";

      try {
        const actionAttr = form.getAttribute("action") || "";
        const endpoint = actionAttr.startsWith("http")
          ? (actionAttr.includes("/ajax/") ? actionAttr : actionAttr.replace("https://formsubmit.co/", "https://formsubmit.co/ajax/"))
          : `https://formsubmit.co/ajax/${RECIPIENT_EMAIL}`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          btn.classList.add("is-success");
          btn.innerHTML = "✓ Inquiry sent to all 4 emails!";
          form.reset();
        } else {
          throw new Error("Submission error: " + response.status);
        }
      } catch (err) {
        console.warn("AJAX form submission fallback:", err);
        try {
          form.submit();
        } catch (submitErr) {
          btn.classList.remove("is-success");
          btn.disabled = false;
          btn.innerHTML = originalText;
          alert("Unable to send inquiry automatically. Please email us directly at hello@aimaginethat.com");
        }
      }
    });
  });
})();

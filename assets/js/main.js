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
  // Bookings and inquiries go to the CRM, which emails only the selected team member
  // (plus a hidden copy for the admin) and books the host's own Google Calendar.
  const CRM_API_BASE = String(window.AIMT_CRM_API_BASE || "https://app.aimaginethat.com").replace(/\/$/, "");
  // Used only if the CRM can't be reached: a separate submission per recipient,
  // so neither the host nor the visitor ever sees the admin copy.
  const FALLBACK_COPY_EMAIL = "atul@aimaginethat.com";
  const formSubmitEndpoint = (email) => `https://formsubmit.co/ajax/${email}`;

  // Team Schedule Data
  const teamData = {
    Neal: {
      key: "neal",
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
      key: "pummy",
      name: "Pummy",
      email: "pummy@aimaginethat.com",
      role: "Customer Solutions & AI",
      slotsMap: {
        weekday: ["10:00 AM", "11:30 AM", "12:30 PM", "02:30 PM", "04:00 PM", "05:00 PM"],
        today: ["11:00 AM", "12:30 PM", "02:30 PM", "04:00 PM"],
        weekend: ["10:30 AM", "01:30 PM"]
      }
    },
    Bob: {
      key: "bob",
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
  const hostByKey = (key) => Object.values(teamData).find((h) => h.key === key);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const newRequestId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") return window.crypto.randomUUID();
    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  };

  // Slots booked from this browser, so they disable instantly even before the CRM refreshes.
  const BOOKINGS_KEY = "aimt_bookings_v1";
  const loadBookings = () => {
    try {
      return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || [];
    } catch {
      return [];
    }
  };
  const saveBookings = (list) => {
    try {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
    } catch {
      /* storage unavailable */
    }
  };
  const getDateKey = (date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const addBooking = (host, dateKey, time) => {
    const list = loadBookings();
    list.push({ host, dateKey, time });
    saveBookings(list);
  };
  // Slot times are the team's office hours (Plymouth, MI).
  const TEAM_TIMEZONE = "America/Detroit";
  const TEAM_TIMEZONE_LABEL = "ET";
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const toGcalStamp = (date, h, m) =>
    `${getDateKey(date).replace(/-/g, "")}T${String(h).padStart(2, "0")}${String(m).padStart(2, "0")}00`;
  const parseSlot = (slot) => {
    const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(String(slot).trim());
    if (!match) return null;
    let hour = Number(match[1]) % 12;
    if (match[3].toUpperCase() === "PM") hour += 12;
    return { hour, minute: Number(match[2]) };
  };
  const to24h = (slot) => {
    const parsed = parseSlot(slot);
    return parsed ? `${String(parsed.hour).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")}` : "";
  };
  const getSlotRange = (date, slot, durationMins = 30) => {
    const parsed = parseSlot(slot);
    if (!parsed) return "";
    const startMins = parsed.hour * 60 + parsed.minute;
    const endMins = startMins + durationMins;
    return `${toGcalStamp(date, parsed.hour, parsed.minute)}/${toGcalStamp(date, Math.floor(endMins / 60), endMins % 60)}`;
  };
  // Wall-clock slot in the team timezone -> epoch ms (handles daylight saving).
  const tzOffsetMs = (instant) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: TEAM_TIMEZONE, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    }).formatToParts(new Date(instant));
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    return Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")) - instant;
  };
  const slotStartMs = (date, slot) => {
    const parsed = parseSlot(slot);
    if (!parsed) return NaN;
    const wall = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), parsed.hour, parsed.minute);
    const first = wall - tzOffsetMs(wall);
    return wall - tzOffsetMs(first);
  };
  const buildGcalUrl = ({ title, details, dates, guests }) => {
    const params = new URLSearchParams({ action: "TEMPLATE", text: title, details, ctz: TEAM_TIMEZONE });
    if (dates) params.set("dates", dates);
    const guestList = (guests || []).filter(Boolean).join(",");
    if (guestList) params.set("add", guestList);
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Live busy ranges from each host's Google Calendar, via the CRM.
  const remoteBusy = new Map();
  const pendingBusy = new Map();
  const fetchBusy = (hostName, date) => {
    const host = teamData[hostName];
    const dateKey = getDateKey(date);
    const cacheKey = `${hostName}|${dateKey}`;
    if (!host || remoteBusy.has(cacheKey)) return Promise.resolve();
    if (pendingBusy.has(cacheKey)) return pendingBusy.get(cacheKey);
    const request = fetch(`${CRM_API_BASE}/api/public/website-booking/availability?host=${host.key}&date=${dateKey}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const busy = data && Array.isArray(data.busy)
          ? data.busy.map((b) => ({ start: Date.parse(b.start), end: Date.parse(b.end) })).filter((b) => b.start < b.end)
          : [];
        remoteBusy.set(cacheKey, busy);
      })
      .catch(() => remoteBusy.set(cacheKey, []))
      .finally(() => pendingBusy.delete(cacheKey));
    pendingBusy.set(cacheKey, request);
    return request;
  };

  const isSlotBooked = (hostName, date, time) => {
    const dateKey = getDateKey(date);
    if (loadBookings().some((b) => b.host === hostName && b.dateKey === dateKey && b.time === time)) return true;
    const start = slotStartMs(date, time);
    if (!Number.isFinite(start) || start < Date.now() + 15 * 60_000) return true;
    const end = start + 30 * 60_000;
    return (remoteBusy.get(`${hostName}|${dateKey}`) || []).some((b) => b.start < end && b.end > start);
  };

  const getSlotsForDate = (host, date) => {
    const isToday = isSameDay(date, currentDate);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    if (isToday && host.slotsMap.today) return host.slotsMap.today;
    if (isWeekend && host.slotsMap.weekend) return host.slotsMap.weekend;
    return host.slotsMap.weekday;
  };

  // Reflects real bookings: a host shows Busy only once every slot for the day is taken
  const updateTeamChipsAvailability = () => {
    hostChips.forEach((chip) => {
      const name = chip.dataset.name;
      const host = teamData[name];
      const tagEl = chip.querySelector(".team-chip__tag");
      if (!host || !tagEl) return;

      const todaySlots = getSlotsForDate(host, currentDate);
      const freeCount = todaySlots.filter((t) => !isSlotBooked(name, currentDate, t)).length;

      if (todaySlots.length === 0 || freeCount === 0) {
        tagEl.textContent = "🔴 Busy Today";
        tagEl.className = "team-chip__tag team-chip__tag--busy";
      } else {
        tagEl.textContent = `🟢 Free Today (${freeCount} slot${freeCount > 1 ? "s" : ""})`;
        tagEl.className = "team-chip__tag team-chip__tag--free";
      }
    });
  };

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
    const slots = getSlotsForDate(host, selectedDate);

    const busyKey = `${selectedHost}|${getDateKey(selectedDate)}`;
    if (!remoteBusy.has(busyKey)) {
      const forHost = selectedHost;
      const forDate = selectedDate;
      fetchBusy(forHost, forDate).then(() => {
        if (selectedHost === forHost && isSameDay(selectedDate, forDate)) renderTimeSlots();
      });
    }

    slotsContainer.innerHTML = "";
    if (!slots || slots.length === 0) {
      slotsContainer.innerHTML = `<p style="grid-column: 1/-1; font-size: 12px; color: var(--text-dim); text-align: center; padding: 6px;">No slots available on this date.</p>`;
      selectedTimeSlot = "";
      updateConfirmButtonText();
      return;
    }

    const keepCurrent = selectedTimeSlot && slots.includes(selectedTimeSlot) && !isSlotBooked(selectedHost, selectedDate, selectedTimeSlot);
    const firstFreeSlot = keepCurrent ? selectedTimeSlot : slots.find((slot) => !isSlotBooked(selectedHost, selectedDate, slot));

    slots.forEach((slot) => {
      const booked = isSlotBooked(selectedHost, selectedDate, slot);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cal-slot-btn" + (booked ? " is-busy" : slot === firstFreeSlot ? " is-selected" : "");
      btn.textContent = booked ? `${slot} · Busy` : slot;
      if (booked) {
        btn.disabled = true;
        btn.title = "Not available";
      } else {
        btn.addEventListener("click", () => {
          document.querySelectorAll("#cal-slots-container .cal-slot-btn").forEach(s => s.classList.remove("is-selected"));
          btn.classList.add("is-selected");
          selectedTimeSlot = slot;
          if (inputTime) inputTime.value = slot;
          updateConfirmButtonText();
        });
      }
      slotsContainer.appendChild(btn);
    });

    if (!firstFreeSlot) {
      const note = document.createElement("p");
      note.style.cssText = "grid-column: 1/-1; font-size: 12px; color: var(--text-dim); text-align: center; padding: 6px;";
      note.textContent = "All slots are taken on this date. Please pick another day.";
      slotsContainer.appendChild(note);
    }

    selectedTimeSlot = firstFreeSlot || "";
    if (inputTime) inputTime.value = selectedTimeSlot;
    updateConfirmButtonText();
  };

  const updateConfirmButtonText = () => {
    const btn = document.getElementById("cal-confirm-btn");
    if (btn && !btn.disabled) {
      btn.innerHTML = selectedTimeSlot
        ? `Schedule with ${escapeHtml(selectedHost)} (${escapeHtml(selectedTimeSlot)} ${TEAM_TIMEZONE_LABEL}) <span aria-hidden="true">→</span>`
        : `Pick an available time <span aria-hidden="true">→</span>`;
    }
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
  if (document.getElementById("calendar-booking-widget")) {
    renderCalendar();
    renderTimeSlots();
    updateTeamChipsAvailability();
    Promise.all(Object.keys(teamData).map((name) => fetchBusy(name, currentDate))).then(() => {
      updateTeamChipsAvailability();
      renderTimeSlots();
    });
  }

  // Posts JSON to the CRM. Returns { ok, result } on success, { rejected, error, status }
  // for a definite validation/conflict answer, or { unreachable } when a fallback is needed.
  const postToCrm = async (path, payload) => {
    try {
      const res = await fetch(`${CRM_API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json().catch(() => null);
      if (res.ok && result && result.ok) return { ok: true, result };
      if ([400, 409, 429].includes(res.status) && result && result.error) {
        return { rejected: true, status: res.status, error: result.error };
      }
      return { unreachable: true };
    } catch {
      return { unreachable: true };
    }
  };

  const sendViaFormSubmit = async (email, data) => {
    try {
      const res = await fetch(formSubmitEndpoint(email), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ _template: "table", _captcha: "false", ...data })
      });
      const result = await res.json().catch(() => null);
      return Boolean(res.ok && result && result.success !== false && result.success !== "false");
    } catch {
      return false;
    }
  };

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
      if (!selectedTimeSlot) {
        alert("All slots for this day are booked. Please pick another date or team member.");
        return;
      }

      const confirmBtn = document.getElementById("cal-confirm-btn");
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `Booking your Google Meet...`;

      const hostName = selectedHost;
      const host = teamData[hostName] || teamData.Neal;
      const bookedDate = selectedDate;
      const bookedSlot = selectedTimeSlot;
      const meetingDate = document.getElementById("cal-input-date")?.value || "";
      const formData = new FormData(calBookingForm);
      const attendeeName = String(formData.get("name") || "").trim();
      const attendeeEmail = String(formData.get("email") || "").trim();
      const whenText = `${meetingDate} at ${bookedSlot} ${TEAM_TIMEZONE_LABEL}`;

      const outcome = await postToCrm("/api/public/website-booking", {
        requestId: newRequestId(),
        host: host.key,
        name: attendeeName,
        email: attendeeEmail,
        date: getDateKey(bookedDate),
        time: to24h(bookedSlot),
        website: String(formData.get("website") || "")
      });

      const restoreButton = () => {
        confirmBtn.disabled = false;
        updateConfirmButtonText();
      };

      if (outcome.rejected) {
        if (outcome.status === 409) {
          addBooking(hostName, getDateKey(bookedDate), bookedSlot);
          remoteBusy.delete(`${hostName}|${getDateKey(bookedDate)}`);
          renderTimeSlots();
          updateTeamChipsAvailability();
        }
        restoreButton();
        alert(outcome.error);
        return;
      }

      let mode = "crm";
      let gcalUrl = "";
      if (outcome.unreachable) {
        // CRM unavailable: email the selected host directly, and send the admin copy separately.
        mode = "fallback";
        const slotDates = getSlotRange(bookedDate, bookedSlot);
        gcalUrl = buildGcalUrl({
          title: `AImagineThat AI Review with ${hostName}`,
          details: `30-min Google Meet architecture review with ${hostName} (${host.role}).\nBooked by: ${attendeeName} <${attendeeEmail}>`,
          dates: slotDates,
          guests: [host.email]
        });
        const details = {
          Booked_By_Name: attendeeName,
          Booked_By_Email: attendeeEmail,
          Meeting_Host: hostName,
          Meeting_Date: meetingDate,
          Meeting_Time: `${bookedSlot} ${TEAM_TIMEZONE_LABEL}`,
          Platform: "Google Meet (30 Mins)"
        };
        const hostSent = await sendViaFormSubmit(host.email, {
          ...details,
          _subject: `New booking: ${attendeeName} (${attendeeEmail}) with ${hostName} - ${whenText}`,
          _replyto: attendeeEmail,
          Add_To_My_Calendar: buildGcalUrl({
            title: `AImagineThat AI Review: ${attendeeName} with ${hostName}`,
            details: `30-min Google Meet architecture review booked from aimaginethat.com.\nAttendee: ${attendeeName} <${attendeeEmail}>`,
            dates: slotDates,
            guests: [attendeeEmail]
          }),
          _autoresponse: `Hi ${attendeeName},\n\nYour 30-min Google Meet with ${hostName} (${host.role}) is requested for ${whenText}.\n\nAdd it to your Google Calendar here (this also invites ${hostName}): ${gcalUrl}\n\n${hostName} will send the Google Meet link in the calendar invite.\n\n— AImagineThat Team`
        });
        const copySent = await sendViaFormSubmit(FALLBACK_COPY_EMAIL, {
          ...details,
          _subject: `New booking: ${attendeeName} with ${hostName} - ${whenText}`
        });
        if (!hostSent && !copySent) {
          restoreButton();
          alert("We couldn't book your meeting right now. Please try again in a minute or email us directly.");
          return;
        }
      }

      addBooking(hostName, getDateKey(bookedDate), bookedSlot);
      remoteBusy.delete(`${hostName}|${getDateKey(bookedDate)}`);
      updateTeamChipsAvailability();

      calBookingForm.style.display = "none";
      const successCard = document.getElementById("cal-booked-success");
      const titleEl = document.getElementById("cal-success-title");
      const messageEl = document.getElementById("cal-success-message");
      const detailsEl = document.getElementById("cal-success-details");
      const gcalBtn = document.getElementById("cal-gcal-link-btn");
      const meetLink = mode === "crm" ? outcome.result.meetLink : null;

      if (titleEl) titleEl.textContent = mode === "crm" ? "Meeting Booked!" : "Meeting Requested!";
      if (messageEl) {
        messageEl.textContent = mode === "crm"
          ? `The meeting is booked with ${hostName}. A calendar invite has been sent to ${attendeeEmail}.`
          : `${hostName} has your details. Add the event to your Google Calendar so ${hostName} receives the invite.`;
      }
      if (detailsEl) {
        detailsEl.innerHTML = `
          <div><b>Host:</b> ${escapeHtml(hostName)} (${escapeHtml(host.role)})</div>
          <div><b>Date:</b> ${escapeHtml(meetingDate)}</div>
          <div><b>Time:</b> ${escapeHtml(bookedSlot)} ${TEAM_TIMEZONE_LABEL} (30 mins)</div>
          <div><b>Attendee:</b> ${escapeHtml(attendeeName)} (${escapeHtml(attendeeEmail)})</div>
          <div style="color: var(--cyan); margin-top: 4px;"><b>Google Meet:</b> ${
            meetLink && /^https:\/\//.test(meetLink)
              ? `<a href="${escapeHtml(meetLink)}" target="_blank" rel="noopener noreferrer">${escapeHtml(meetLink)}</a>`
              : `Link will be in your calendar invite`
          }</div>
        `;
      }
      if (gcalBtn) {
        gcalBtn.style.display = mode === "fallback" ? "" : "none";
        if (mode === "fallback") gcalBtn.href = gcalUrl;
      }
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
        renderTimeSlots();
      });
    }
  }

  /* ---------- Inquiry Forms: send only to the selected team member ---------- */
  const inquiryForms = document.querySelectorAll(".contact__form--inquiry");
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
      btn.classList.remove("is-success");
      btn.innerHTML = `Sending inquiry...`;

      const formData = new FormData(form);
      const field = (name) => String(formData.get(name) || "").trim();
      const host = hostByKey(field("host"));
      const page = form.dataset.page === "offerings" ? "offerings" : "home";
      const label = page === "offerings" ? "Pricing Review Request" : "Inquiry";

      const fail = (message) => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        alert(message);
      };
      if (!host) {
        fail("Please choose who you'd like to talk to.");
        return;
      }

      const outcome = await postToCrm("/api/public/website-inquiry", {
        requestId: newRequestId(),
        host: host.key,
        name: field("name"),
        email: field("email"),
        company: field("company"),
        plan: field("plan"),
        message: field("message"),
        page,
        website: field("website")
      });

      if (outcome.rejected) {
        fail(outcome.error);
        return;
      }
      if (outcome.unreachable) {
        const details = {
          Name: field("name"),
          Email: field("email"),
          Company: field("company"),
          Plan: field("plan"),
          Message: field("message"),
          Sent_To: host.name
        };
        const subject = `New ${label} from ${field("name") || field("email")}`;
        const hostSent = await sendViaFormSubmit(host.email, { ...details, _subject: subject, _replyto: field("email") });
        const copySent = await sendViaFormSubmit(FALLBACK_COPY_EMAIL, { ...details, _subject: `${subject} (for ${host.name})` });
        if (!hostSent && !copySent) {
          fail("Unable to send inquiry automatically. Please email us directly at hello@aimaginethat.com");
          return;
        }
      }

      btn.classList.add("is-success");
      btn.innerHTML = `✓ Inquiry sent to ${escapeHtml(host.name)}!`;
      form.reset();
      setTimeout(() => {
        btn.disabled = false;
        btn.classList.remove("is-success");
        btn.innerHTML = originalText;
      }, 6000);
    });
  });
})();

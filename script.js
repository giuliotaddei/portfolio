/* DATA IMPORT */
import { STACK } from "./data/stack.js";
import { PROJECTS_EN, PROJECTS_IT } from "./data/projects.js";
import { CERTS } from "./data/certs.js";
import { TIMELINE_EN, TIMELINE_IT } from "./data/timeline.js";
import { CONTACT_INFO } from "./data/contact.js";

/* i18n */
import { I18N } from "./data/i18n.js";

let currentLang = "it";

function applyI18n(lang) {
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (I18N[lang][key] !== undefined) {
      // preserve child spans
      if (el.querySelector("span.gradient-text")) {
        const parts = I18N[lang][key].split(/<span[^>]*>|<\/span>/);
        if (parts.length > 1) {
          el.innerHTML =
            parts[0] +
            `<span class="gradient-text">${parts[1]}</span>` +
            (parts[2] || "");
        } else {
          el.firstChild.textContent = I18N[lang][key] + " ";
        }
      } else {
        el.textContent = I18N[lang][key];
      }
    }
  });
  // re-render gradient titles
  document.querySelectorAll(".section-title").forEach((el) => {
    const key = el.dataset.i18n;
    if (!key) return;
    const val = I18N[lang][key];
    if (!val) return;
    el.innerHTML = val;
  });
  const gradientTitles = {
    "stack.title": { key: "stack.title", grad: "tecnologico|tech stack" },
    "projects.title": {
      key: "projects.title",
      grad: "selezionati|Selected",
    },
    "certs.title": { key: "certs.title", grad: "Riconoscimenti|Awards" },
    "exp.title": { key: "exp.title", grad: "professionale|Journey" },
    "contact.title": { key: "contact.title", grad: "qualcosa|talk" },
  };
  Object.values(gradientTitles).forEach(({ key }) => {
    const el = document.querySelector(`[data-i18n="${key}"]`);
    if (!el) return;
    const raw = I18N[lang][key];
    // last word gets gradient
    const words = raw.split(" ");
    const last = words.pop();
    el.innerHTML =
      words.join(" ") + ' <span class="gradient-text">' + last + "</span>";
  });
  renderTimeline(lang);
  renderContactInfo(lang);
  document.getElementById("lang-label").textContent =
    lang === "it" ? "EN" : "IT";
  document.documentElement.lang = lang;
}

/* ======================================================
     RENDER HELPERS
  ====================================================== */
function renderStack() {
  const grid = document.getElementById("stack-grid");
  grid.innerHTML = STACK.map(
    (s, i) => `
      <div class="stack-card" style="transition-delay:${i * 60}ms">
        <div class="stack-icon">
      ${
        s.img
          ? `<img src="${s.img}" alt="${s.name}" style="width:36px;height:36px;object-fit:contain;" />`
          : s.icon
      }
      </div>
        <div class="stack-name">${s.name}</div>
        <div class="stack-tag">${s.tag}</div>
        <div class="stack-bar-wrap">
          <div class="stack-bar" style="width:${s.level * 100}%"></div>
        </div>
      </div>`,
  ).join("");
}

function renderProjects(lang) {
  const grid = document.getElementById("projects-grid");
  const data = lang === "it" ? PROJECTS_IT : PROJECTS_EN;
  const gh = I18N[lang]["projects.github"];
  const lv = I18N[lang]["projects.live"];
  grid.innerHTML = data
    .map(
      (p, i) => `
      <div class="project-card" style="transition-delay:${i * 80}ms">
        <div class="project-thumb" style="background:${p.bg}">${p.emoji}</div>
        <div class="project-body">
          <div class="project-tags">${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}</div>
          <div class="project-title">${p.name}</div>
          <div class="project-desc">${p.desc}</div>
          <div class="project-footer">
          ${
            p.github
              ? `
              <a href="${p.github}" class="project-link" target="_blank" rel="noopener noreferrer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
                ${gh}
              </a>`
              : ""
          }
            ${
              p.live
                ? `
                <a href="${p.live}" class="project-link" target="_blank" rel="noopener noreferrer">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  ${lv} →
                </a>`
                : ""
            }
          </div>
        </div>
      </div>`,
    )
    .join("");

  setTimeout(() => {
    grid
      .querySelectorAll(".project-card")
      .forEach((el) => cardObserver.observe(el));
  }, 50);
}

function renderCerts() {
  document.getElementById("certs-grid").innerHTML = CERTS.map(
    (c, i) => `
      <div class="cert-card" style="transition-delay:${i * 60}ms">
        <div class="cert-icon">
        ${
          c.img
            ? `<img src="${c.img}" alt="${c.title}" style="width:24px;height:24px;object-fit:contain;filter:brightness(0) invert(1);" />`
            : c.icon
        }
      </div>
        <div class="cert-info">
          <div class="cert-title">${c.title}</div>
          <div class="cert-org">${c.org}</div>
          <div class="cert-date">${c.date}</div>
        </div>
      </div>`,
  ).join("");
}

function renderTimeline(lang) {
  const data = lang === "it" ? TIMELINE_IT : TIMELINE_EN;
  document.getElementById("timeline").innerHTML = data
    .map(
      (t, i) => `
      <div class="timeline-item" style="transition-delay:${i * 100}ms">
        <div class="timeline-date">${t.date}</div>
        <div class="timeline-role">${t.role}</div>
        <div class="timeline-company">${t.company}</div>
        <div class="timeline-desc">${t.desc}</div>
      </div>`,
    )
    .join("");
  // re-observe new items
  document
    .querySelectorAll(".timeline-item")
    .forEach((el) => cardObserver.observe(el));
}

function renderContactInfo(lang) {
  document.getElementById("contact-info").innerHTML = CONTACT_INFO.map((c) => {
    const inner = `
      <div class="contact-item-icon">${c.icon}</div>
      <div>
        <div class="contact-item-label">${lang === "it" ? c.label_it : c.label_en}</div>
        <div class="contact-item-value">${c.value}</div>
      </div>`;

    return c.href
      ? `<a href="${c.href}" target="_blank" rel="noopener noreferrer" class="contact-item">${inner}</a>`
      : `<div class="contact-item">${c.value === "Italia 🇮🇹" ? inner.replace(c.value, "Italia 🇮🇹") : inner}</div>`;
  }).join("");
}

/* ======================================================
     PARTICLES
  ====================================================== */
function initParticles() {
  const canvas = document.getElementById("particle-canvas");
  const ctx = canvas.getContext("2d");
  let W,
    H,
    particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const N = Math.min(
    60,
    Math.floor((window.innerWidth * window.innerHeight) / 18000),
  );
  for (let i = 0; i < N; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.documentElement.dataset.theme !== "light";
    const dotColor = isDark ? "rgba(108,99,255," : "rgba(108,99,255,";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor + ".7)";
      ctx.fill();
    });

    // connect close dots
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = dotColor + (1 - dist / 120) * 0.25 + ")";
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
}

/* ======================================================
     TYPEWRITER
  ====================================================== */
function typewriter(el, text, speed = 90) {
  el.textContent = "";
  let i = 0;
  function next() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(next, speed);
    }
  }
  setTimeout(next, 600);
}

/* ======================================================
     INTERSECTION OBSERVER
  ====================================================== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in-view");
      }
    });
  },
  { threshold: 0.12 },
);

const cardObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in-card");
      }
    });
  },
  { threshold: 0.08 },
);

/* ======================================================
     THEME
  ====================================================== */
function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.getElementById("icon-moon").style.display =
    theme === "dark" ? "" : "none";
  document.getElementById("icon-sun").style.display =
    theme === "light" ? "" : "none";
  localStorage.setItem("theme", theme);
}
document.getElementById("theme-btn").addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  setTheme(current === "dark" ? "light" : "dark");
});

/* ======================================================
     LANGUAGE
  ====================================================== */
document.getElementById("lang-btn").addEventListener("click", () => {
  currentLang = currentLang === "it" ? "en" : "it";
  applyI18n(currentLang);
  renderProjects(currentLang);
});

/* ======================================================
     CONTACT FORM
  ====================================================== */
async function handleContact(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const originalHTML = btn.innerHTML;

  btn.innerHTML = `<span>Invio in corso...</span>`;
  btn.disabled = true;

  try {
    const response = await fetch("https://formspree.io/f/meewnlzv", {
      // ← il tuo endpoint
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(e.target),
    });

    if (response.ok) {
      btn.innerHTML = `✓ ${currentLang === "it" ? "Inviato!" : "Sent!"}`;
      btn.style.background = "linear-gradient(135deg,#1db954,#1aa34a)";
      e.target.reset();
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.background = "";
        btn.disabled = false;
      }, 3000);
    } else {
      throw new Error();
    }
  } catch {
    btn.innerHTML = `✗ ${currentLang === "it" ? "Errore, riprova" : "Error, try again"}`;
    btn.style.background = "linear-gradient(135deg,#e74c3c,#c0392b)";
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = "";
      btn.disabled = false;
    }, 3000);
  }
}

/* ======================================================
     INIT
  ====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // theme from storage
  const savedTheme = localStorage.getItem("theme") || "dark";
  setTheme(savedTheme);

  // render all content
  renderStack();
  renderProjects(currentLang);
  renderCerts();
  renderTimeline(currentLang);
  renderContactInfo(currentLang);
  applyI18n(currentLang);

  // footer year
  document.getElementById("footer-year").textContent = new Date().getFullYear();

  // typewriter on name
  typewriter(document.getElementById("typewriter-name"), "Giulio Taddei", 100);

  // particles
  initParticles();

  // observe sections
  document
    .querySelectorAll(".reveal")
    .forEach((el) => revealObserver.observe(el));
  // observe cards (with delay after render)
  setTimeout(() => {
    document
      .querySelectorAll(
        ".stack-card, .project-card, .cert-card, .timeline-item",
      )
      .forEach((el) => cardObserver.observe(el));
  }, 100);
});

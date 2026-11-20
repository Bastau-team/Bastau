(function () {
  const dict = window.BASTAU_I18N;
  const langs = ["kk", "ru", "en"];
  let current = "kk";

  // ---------- Тіл ауыстыру ----------
  function t(key) {
    return (dict[current] && dict[current][key]) || dict.kk[key] || key;
  }

  function applyLang(lang) {
    if (!langs.includes(lang)) lang = "kk";
    current = lang;
    document.documentElement.lang = lang;
    document.title = t("meta.title");
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", t("meta.desc"));

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });

    nav.setAttribute("aria-label", t("nav.menu"));
    burger.setAttribute("aria-label", t("nav.menu"));
    status.textContent = "";

    try { localStorage.setItem("bastau-lang", lang); } catch (e) {}
  }

  // ---------- Мобильді мәзір ----------
  const burger = document.querySelector(".burger");
  const nav = document.getElementById("nav");

  function closeNav() {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  burger.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });

  // ---------- Өтінім формасы ----------
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const TO = "bastauteam@gmail.com";

  function setError(input, msg) {
    input.setAttribute("aria-invalid", "true");
    status.textContent = msg;
    status.className = "form__status is-error";
    input.focus();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));

    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const email = form.elements.email.value.trim();
    const select = form.elements.service;
    const service = select.options[select.selectedIndex].textContent;
    const message = form.elements.message.value.trim();

    if (!name) return setError(form.elements.name, t("form.err.name"));
    if (!phone && !email) return setError(form.elements.phone, t("form.err.contact"));
    if (email && !emailRe.test(email)) return setError(form.elements.email, t("form.err.email"));

    const body = [
      `${t("form.name")}: ${name}`,
      `${t("form.phone")}: ${phone || "—"}`,
      `Email: ${email || "—"}`,
      `${t("form.service")} ${service}`,
      "",
      `${t("form.msg")}:`,
      message || "—"
    ].join("\n");

    window.location.href =
      `mailto:${TO}?subject=${encodeURIComponent(t("form.subject"))}&body=${encodeURIComponent(body)}`;

    status.textContent = t("form.ok");
    status.className = "form__status is-ok";
  });

  // ---------- Іске қосу ----------
  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  let saved = null;
  try { saved = localStorage.getItem("bastau-lang"); } catch (e) {}
  applyLang(saved || "kk"); // әдепкі тіл — қазақша

  document.getElementById("year").textContent = new Date().getFullYear();
})();

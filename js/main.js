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

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.dataset.lang === lang));
    });

    try { localStorage.setItem("bastau-lang", lang); } catch (e) {}
  }

  document.querySelectorAll("[data-lang]").forEach((btn) => {
    btn.addEventListener("click", () => applyLang(btn.dataset.lang));
  });

  let saved = null;
  try { saved = localStorage.getItem("bastau-lang"); } catch (e) {}
  applyLang(saved || "kk"); // әдепкі тіл — қазақша

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

  // ---------- Тіркелу формасы ----------
  const form = document.getElementById("signupForm");
  const status = document.getElementById("formStatus");
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(input, msg) {
    input.setAttribute("aria-invalid", "true");
    status.textContent = msg;
    status.className = "form__status is-error";
    input.focus();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const email = form.email.value.trim();
    const service = form.service.options[form.service.selectedIndex].textContent;
    const message = form.message.value.trim();

    if (!name) return setError(form.name, t("form.err.name"));
    if (!phone && !email) return setError(form.phone, t("form.err.contact"));
    if (email && !emailRe.test(email)) return setError(form.email, t("form.err.email"));

    const body = [
      `${t("form.name")}: ${name}`,
      `${t("form.phone")}: ${phone || "—"}`,
      `Email: ${email || "—"}`,
      `${t("form.service")} ${service}`,
      "",
      message
    ].join("\n");

    // Кейін Telegram бот дайын болғанда, осы жерде өтінімді ботқа жіберуге болады.
    window.location.href =
      "mailto:bastauteam@gmail.com" +
      "?subject=" + encodeURIComponent(t("mail.subject")) +
      "&body=" + encodeURIComponent(body);

    status.textContent = t("form.ok");
    status.className = "form__status is-ok";
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();

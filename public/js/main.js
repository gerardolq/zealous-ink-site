// =========================
// PAGE FADE-IN
// =========================
window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});

// =========================
// SCROLL FADE-INS
// =========================
// Page fade in
window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");
});

// Safer fade-in observer
const faders = document.querySelectorAll(".fade-in");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  faders.forEach(el => observer.observe(el));
} else {
  // Fallback for older browsers
  faders.forEach(el => el.classList.add("visible"));
}

// =========================
// PAGE TRANSITIONS
// =========================
document.querySelectorAll("a").forEach(link => {
  if (link.hostname === window.location.hostname) {
    link.addEventListener("click", e => {
      e.preventDefault();
      const href = link.href;

      document.body.classList.remove("loaded");

      setTimeout(() => {
        window.location.href = href;
      }, 400);
    });
  }
});

// =========================
// THEME TOGGLE
// =========================
const toggleBtn = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
  document.documentElement.setAttribute("data-theme", savedTheme);
}

toggleBtn?.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// =========================
// DAY / NIGHT LIGHTING
// =========================
const hour = new Date().getHours();

// Softer light during day, deeper at night
const lightingOpacity = hour >= 7 && hour <= 18 ? 0.35 : 0.75;
document.body.style.setProperty("--lighting-opacity", lightingOpacity);

// =========================
// PARALLAX TYPOGRAPHY
// =========================
const parallaxElements = document.querySelectorAll(".parallax-text");

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  parallaxElements.forEach(el => {
    const speed = el.dataset.speed || 0.2;
    el.style.transform = `translateY(${scrollY * speed}px)`;
  });
});

// =========================
// BOOKING FORM VALIDATION
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const termsCheckbox = form.querySelector('input[name="terms"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const ideaInput = form.querySelector('textarea[name="idea"]');

  // ------------------------
  // Real-time submit enable
  // ------------------------
  function checkFormReady() {
    const requiredFields = form.querySelectorAll("[required]");
    const allFilled = Array.from(requiredFields).every(f => f.value.trim() !== "");
    submitBtn.disabled = !(allFilled && termsCheckbox.checked);
  }

  form.addEventListener("input", checkFormReady);
  termsCheckbox.addEventListener("change", checkFormReady);
  checkFormReady();

  // ------------------------
  // Submit validation
  // ------------------------
  form.addEventListener("submit", e => {
    let valid = true;

    const name = form.querySelector('input[name="name"]');
    const email = form.querySelector('input[name="email"]');
    const phone = form.querySelector('input[name="phone"]');
    const idea = form.querySelector('textarea[name="idea"]');
    const size = form.querySelector('input[name="size"]');
    const placement = form.querySelector('input[name="placement"]');
    const contactMethods = form.querySelectorAll(
      'input[name="contact_method"]:checked'
    );
    const terms = form.querySelector('input[name="terms"]');
    const honeypot = form.querySelector('input[name="company"]');

    clearErrors(form);

    // ------------------------
    // Honeypot spam check
    // ------------------------
    if (honeypot && honeypot.value.trim() !== "") {
      e.preventDefault();
      return;
    }

    // Name
    if (name.value.trim().length < 2) {
      showError(name, "Please enter your full name.");
      valid = false;
    }

    // Email
    if (!email.value.includes("@")) {
      showError(email, "Please enter a valid email address.");
      valid = false;
    }

    // Tattoo Idea
    if (idea.value.trim().length < 15) {
      showError(idea, "Please provide more detail about your tattoo idea (15+ characters).");
      valid = false;
    }

    // Size
    if (size.value.trim().length < 2) {
      showError(size, "Please specify an approximate size.");
      valid = false;
    }

    // Placement
    if (placement.value.trim().length < 2) {
      showError(placement, "Please specify tattoo placement.");
      valid = false;
    }

    // Contact Method
    if (contactMethods.length === 0) {
      showError(form.querySelector("fieldset"), "Please select at least one contact method.");
      valid = false;
    }

    // Phone/Text required if "Text" selected
    if ([...contactMethods].some(m => m.value === "phone") && phone.value.trim().length < 7) {
      showError(phone, "Please provide a text number.");
      valid = false;
    }

    // Terms
    if (!terms.checked) {
      showError(terms.parentElement, "You must agree to the terms to submit.");
      valid = false;
    }

    if (!valid) e.preventDefault();
  });

  // ------------------------
  // Error display helpers
  // ------------------------
  function clearErrors(form) {
    form.querySelectorAll(".form-error").forEach(el => el.remove());
    form.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
  }

  function showError(element, message) {
    if (element.tagName === "FIELDSET") {
      const error = document.createElement("div");
      error.className = "form-error";
      error.textContent = message;
      element.appendChild(error);
      return;
    }
    element.classList.add("error");
    const error = document.createElement("div");
    error.className = "form-error";
    error.textContent = message;
    element.after(error);
  }
});

// =========================
// MOBILE DEV
// =========================
const menuBtn = document.querySelector(".menu-btn");
const navRight = document.querySelector(".nav-right");
const navList = navRight ? navRight.querySelector("ul") : null;

if (!menuBtn || !navList || !navRight) {
  console.error("Mobile nav JS not initialized");
} else {
  // Toggle menu
  menuBtn.addEventListener("click", (e) => {
    navList.classList.toggle("active");
    menuBtn.classList.toggle("active");
  });

  // Close menu when clicking a link
  navList.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      navList.classList.remove("active");
      menuBtn.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      navList.classList.contains("active") &&
      !navRight.contains(e.target)
    ) {
      navList.classList.remove("active");
      menuBtn.classList.remove("active");
    }
  });
}

/* AKR Infra home page — gallery filtering + project lightbox.
   No dependencies. The page works without JS; this only adds filters
   and the detail dialog. */

(() => {
  "use strict";

  const grid = document.getElementById("project-grid");
  const status = document.getElementById("filter-status");
  const filters = Array.from(document.querySelectorAll(".filter"));
  const items = Array.from(grid.querySelectorAll(".project-item"));

  const dialog = document.getElementById("project-dialog");
  const dialogImg = document.getElementById("lightbox-img");
  const dialogMeta = document.getElementById("lightbox-meta");
  const dialogTitle = document.getElementById("lightbox-title");
  const dialogDesc = document.getElementById("lightbox-desc");

  const total = items.length;
  let lastFocused = null;
  let lastTrigger = null;

  /* ---------- Filtering ---------- */

  function applyFilter(value, label) {
    let shown = 0;

    items.forEach((item) => {
      const matches = value === "all" || item.dataset.category === value;
      item.hidden = !matches;
      if (matches) shown += 1;
    });

    status.textContent =
      value === "all"
        ? `Showing all ${total} projects`
        : `Showing ${shown} of ${total} projects — ${label}`;
  }

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((other) =>
        other.setAttribute("aria-pressed", String(other === button))
      );
      applyFilter(button.dataset.filter, button.textContent.trim());
    });
  });

  /* ---------- Project dialog ---------- */

  function openDialog(card) {
    dialogImg.src = card.dataset.image;
    dialogImg.alt = card.dataset.alt;
    dialogMeta.textContent = card.dataset.meta;
    dialogTitle.textContent = card.dataset.title;
    dialogDesc.textContent = card.dataset.desc;

    lastTrigger = card;
    lastFocused = document.activeElement;
    document.body.classList.add("is-locked");
    dialog.showModal();
  }

  grid.addEventListener("click", (event) => {
    const card = event.target.closest(".project-card");
    if (card) openDialog(card);
  });

  dialog.addEventListener("click", (event) => {
    /* Click outside the panel (on the backdrop) closes it. */
    if (event.target === dialog) dialog.close();
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("is-locked");
    dialogImg.removeAttribute("src");
    dialogImg.alt = "";

    const target = lastTrigger || lastFocused;
    if (target && typeof target.focus === "function") target.focus();
  });

  dialog.querySelector("[data-close]").addEventListener("click", () => {
    dialog.close();
  });

  /* ---------- Contact form → Firestore ---------- */

  const form = document.getElementById("contact-form");

  if (form) {
    const status = document.getElementById("form-status");
    const submitButton = form.querySelector('button[type="submit"]');
    let firestorePromise = null;

    /* Load the SDK only on first submit, so the page stays fast. */
    function loadFirestore() {
      if (!firestorePromise) {
        firestorePromise = (async () => {
          const [appModule, firestore] = await Promise.all([
            import("https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"),
            import("https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"),
          ]);

          if (!window.firebaseConfig) {
            throw new Error("Firebase config missing (firebase-config.js)");
          }

          const app = appModule.initializeApp(window.firebaseConfig);
          return { db: firestore.getFirestore(app), firestore };
        })();

        firestorePromise.catch(() => {
          firestorePromise = null;
        });
      }

      return firestorePromise;
    }

    function showStatus(text, state) {
      status.textContent = text;
      status.dataset.state = state;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        showStatus("", "idle");
        return;
      }

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const message = document.getElementById("message").value.trim();

      /* Whitespace-only values pass the HTML check but fail the rules. */
      if (!name || !message) {
        showStatus("Please add your name and a short project note.", "error");
        return;
      }

      submitButton.disabled = true;
      showStatus("Sending…", "pending");

      try {
        const { db, firestore } = await loadFirestore();

        await firestore.addDoc(
          firestore.collection(db, window.firebaseCollection || "messages"),
          {
            name,
            email,
            message,
            createdAt: firestore.serverTimestamp(),
          }
        );

        form.reset();
        showStatus(
          "Thanks — your message is saved. We will get back to you within two working days.",
          "success"
        );
      } catch (error) {
        console.error("Firestore write failed:", error);
        showStatus(
          "Your message could not be saved. Check your connection and try again" +
            (error && error.code ? ` (${error.code})` : "") +
            ".",
          "error"
        );
      } finally {
        submitButton.disabled = false;
      }
    });
  }
})();

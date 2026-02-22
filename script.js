(() => {
  const scroller = document.querySelector(".snap");
  const sections = [...document.querySelectorAll(".section")];

  if (!scroller || sections.length === 0) return;

  let locked = false;

  function currentIndex() {
    const y = scroller.scrollTop;
    const h = window.innerHeight || 1;
    return Math.round(y / h);
  }

  function goToIndex(i) {
    const clamped = Math.max(0, Math.min(sections.length - 1, i));
    locked = true;
    sections[clamped].scrollIntoView({ behavior: "smooth" });
    setTimeout(() => (locked = false), 650);
  }

  function activeSection() {
    return sections[currentIndex()] || sections[0];
  }

  function getInnerScroller(section) {
    if (!section) return null;
    if (!section.classList.contains("is-scrollable")) return null;
    return section.querySelector(".container");
  }

  function canScroll(inner, dir) {
    if (!inner) return false;
    const top = inner.scrollTop;
    const max = inner.scrollHeight - inner.clientHeight;

    if (dir > 0) return top < max - 1;
    return top > 1;
  }

  scroller.addEventListener(
    "wheel",
    (e) => {
      const dir = e.deltaY > 0 ? 1 : -1;

      if (locked) {
        e.preventDefault();
        return;
      }

      const section = activeSection();
      const inner = getInnerScroller(section);

      if (inner && canScroll(inner, dir)) {
        e.preventDefault();
        inner.scrollTop += e.deltaY;
        return;
      }

      e.preventDefault();
      const i = currentIndex();
      goToIndex(i + dir);
    },
    { passive: false },
  );

  window.addEventListener("keydown", (e) => {
    if (locked) return;

    const i = currentIndex();
    if (e.key === "ArrowDown" || e.key === "PageDown") goToIndex(i + 1);
    if (e.key === "ArrowUp" || e.key === "PageUp") goToIndex(i - 1);

    if (e.key === "Home") goToIndex(0);
    if (e.key === "End") goToIndex(sections.length - 1);
  });
})();

(() => {
  const blocks = document.querySelectorAll(".reveal");
  if (!blocks.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
        }
      }
    },
    { threshold: 0.25 },
  );

  blocks.forEach((b) => io.observe(b));
})();

(() => {
  const drawer = document.getElementById("placeDrawer");
  const backdrop = document.getElementById("drawerBackdrop");
  const closeBtn = document.getElementById("drawerClose");

  const titleEl = document.getElementById("drawerTitle");
  const kickerEl = document.getElementById("drawerKicker");
  const imgEl = document.getElementById("drawerImage");
  const badgesEl = document.getElementById("drawerBadges");
  const contentEl = document.getElementById("drawerContent");

  if (!drawer || !backdrop) return;

  const PLACES = {
    "mount-cook": {
      title: "Mount Cook (Aoraki)",
      image: "assets/places/mount-cook.jpg",
      badges: ["Mountains", "Scenic flight", "Best: Nov–Apr"],
      blocks: [
        [
          "Where to go",
          "Join a scenic flight to get the most dramatic views of Aoraki / Mount Cook.",
        ],
        [
          "How to go",
          "Take a small plane or helicopter sightseeing tour (glacier views are the highlight).",
        ],
        [
          "When to go",
          "November to April is ideal for clear weather and outdoor exploration.",
        ],
      ],
    },
    tongariro: {
      title: "Tongariro National Park",
      image: "assets/places/tongariro.jpg",
      badges: ["Volcanoes", "Landscapes", "Scenic flight"],
      blocks: [
        [
          "Where to go",
          "A sightseeing trip is a great way to see Tongariro National Park from above.",
        ],
        [
          "How to go",
          "Choose a small plane or helicopter tour for a wide, cinematic view of the park.",
        ],
        [
          "What to see",
          "One of the most varied and spectacular sequences of landscapes in New Zealand.",
        ],
      ],
    },
    "southern-alps": {
      title: "Southern Alps",
      image: "assets/places/southern-alps.png",
      badges: ["Breathtaking views", "Balloon ride"],
      blocks: [
        [
          "What to see",
          "A hot-air balloon ride reveals breathtaking panoramic views across the Southern Alps.",
        ],
        [
          "How to go",
          "Book a sunrise hot-air balloon flight for the calmest air and best light.",
        ],
      ],
    },
    "whanganui-river": {
      title: "Whanganui River",
      image: "assets/places/WhanganuiRiver.jpg",
      badges: ["5-day trip", "Canoe / Kayak", "Great Walks"],
      blocks: [
        [
          "Where to go",
          "One of New Zealand’s Great Walks is actually a river journey — on the Whanganui River.",
        ],
        [
          "How to go",
          "Take the 145 km, five-day canoe or kayak adventure down the river.",
        ],
        [
          "What to do",
          "Tramping is a great way to experience New Zealand’s natural beauty first-hand.",
        ],
      ],
    },
    "kawarau-bridge": {
      title: "Kawarau Bridge",
      image: "assets/places/kawarau-bridge.jpg",
      badges: ["Adrenaline", "Bungy jump", "Safety first"],
      blocks: [
        [
          "What to do",
          "Bungy jumping from the Kawarau Bridge delivers a serious adrenaline rush.",
        ],
        [
          "Safety",
          "Jumper safety is treated as paramount — operators follow strict procedures and checks.",
        ],
      ],
    },
    kaikoura: {
      title: "Kaikoura",
      image: "assets/places/kaikoura.jpg",
      badges: ["Wildlife", "Whales", "Dolphins & seals"],
      blocks: [
        ["What to do", "Whale watching is the main attraction in Kaikoura."],
        [
          "What you may see",
          "Migrating blue whales, humpbacks, and southern right whales can be spotted.",
        ],
        [
          "Also",
          "Swimming with dolphins and seals is also possible in Kaikoura.",
        ],
      ],
    },
    "poor-knights": {
      title: "Poor Knights Islands",
      image: "assets/places/poor knights islands.jpg",
      badges: ["Scuba diving", "Top 10 worldwide"],
      blocks: [
        [
          "What to do",
          "Some of the best scuba diving in New Zealand is near the Poor Knights Islands.",
        ],
        ["Why famous", "Often rated among the world’s top ten diving spots."],
      ],
    },
    "marlborough-sounds": {
      title: "Marlborough Sounds",
      image: "assets/places/marlborough sounds.jpg",
      badges: ["Dives", "Shipwreck"],
      blocks: [
        [
          "What to do",
          "The Marlborough Sounds offer several interesting dive sites.",
        ],
        [
          "Highlight",
          "Dive the Mikhail Lermontov- one of the largest diveable cruise-ship wrecks in the world.",
        ],
      ],
    },
    "stewart-island": {
      title: "Stewart Island (Rakiura)",
      image: "assets/places/stewart island.jpg",
      badges: ["Outer island", "Kiwi in the wild"],
      blocks: [
        [
          "Where to go",
          "New Zealand’s largest outer island - remote, quiet, and deeply natural.",
        ],
        [
          "Why unusual",
          "One of the few places where you can spot kiwi birds in the wild.",
        ],
      ],
    },
    "sky-tower": {
      title: "Sky Tower (Auckland)",
      image: "assets/places/sky-tower.jpg",
      badges: ["328 m", "Auckland landmark"],
      blocks: [
        [
          "What to see",
          "The Sky Tower is impossible to miss   -at 328 m, it’s the tallest structure in the Southern Hemisphere.",
        ],
        ["Where", "Auckland, New Zealand."],
      ],
    },
  };

  function openDrawer(key) {
    const data = PLACES[key];
    if (!data) return;

    kickerEl.textContent = "Unusual place";
    titleEl.textContent = data.title;

    imgEl.src = data.image;
    imgEl.alt = data.title;

    badgesEl.innerHTML = "";
    (data.badges || []).forEach((t) => {
      const b = document.createElement("span");
      b.className = "badge";
      b.textContent = t;
      badgesEl.appendChild(b);
    });

    contentEl.innerHTML = "";
    (data.blocks || []).forEach(([h, p]) => {
      const box = document.createElement("div");
      box.className = "detail stagger";
      box.innerHTML = `<h4>${h}</h4><p>${p}</p>`;
      contentEl.appendChild(box);
    });

    backdrop.hidden = false;
    requestAnimationFrame(() => {
      backdrop.classList.add("is-open");
      drawer.classList.add("is-open");
      drawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("drawer-open");
      contentEl.scrollTop = 0;
    });
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("drawer-open");

    setTimeout(() => {
      backdrop.hidden = true;
    }, 260);
  }

  document.addEventListener("click", (e) => {
    const card = e.target.closest(".place[data-place]");
    if (!card) return;
    e.preventDefault();
    openDrawer(card.dataset.place);
  });

  closeBtn?.addEventListener("click", closeDrawer);
  backdrop.addEventListener("click", closeDrawer);

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });
})();

(() => {
  const loader = document.getElementById("appLoader");
  const progress = document.getElementById("loaderProgress");

  if (!loader || !progress) return;

  let value = 0;

  function fakeLoad() {
    value += Math.random() * 12;

    if (value >= 100) {
      value = 100;
      progress.style.width = "100%";

      setTimeout(() => {
        loader.classList.add("is-hidden");

        setTimeout(() => {
          loader.remove();
        }, 700);
      }, 400);

      return;
    }

    progress.style.width = value + "%";
    requestAnimationFrame(fakeLoad);
  }

  window.addEventListener("load", () => {
    fakeLoad();
  });
})();

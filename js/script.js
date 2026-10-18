/* Storybook — one external JavaScript file
   Features: 1) Dark/Light mode  2) Like button  3) Show/Hide synopsis
             4) Reading progress bar  5) Library search + genre filter */
document.addEventListener("DOMContentLoaded", function () {

  /* 1) Dark / light mode (remembered between pages) */
  var body = document.body;
  var themeBtn = document.getElementById("theme-toggle");
  var saved = null;
  try { saved = localStorage.getItem("storybook-theme"); } catch (e) {}
  if (saved === "dark" || (!saved && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    body.classList.add("dark-mode");
  }
  if (themeBtn) {
    themeBtn.setAttribute("aria-pressed", body.classList.contains("dark-mode"));
    themeBtn.addEventListener("click", function () {
      var dark = body.classList.toggle("dark-mode");
      themeBtn.setAttribute("aria-pressed", dark);
      try { localStorage.setItem("storybook-theme", dark ? "dark" : "light"); } catch (e) {}
    });
  }

  /* 2) Like button (count saved per story) */
  var likeBtn = document.getElementById("like-btn");
  var likeCount = document.getElementById("like-count");
  if (likeBtn && likeCount) {
    var key = "storybook-like-" + location.pathname.split("/").pop();
    var liked = false, count = 0;
    try {
      liked = localStorage.getItem(key) === "1";
    } catch (e) {}
    count = liked ? 1 : 0;
    var icon = likeBtn.querySelector(".like-icon");
    function paint() {
      likeBtn.classList.toggle("liked", liked);
      likeBtn.setAttribute("aria-pressed", liked);
      likeCount.textContent = count;
      if (icon) icon.innerHTML = liked ? "&#9829;" : "&#9825;";
    }
    paint();
    likeBtn.addEventListener("click", function () {
      liked = !liked;
      count = liked ? count + 1 : Math.max(0, count - 1);
      try { localStorage.setItem(key, liked ? "1" : "0"); } catch (e) {}
      paint();
    });
  }

  /* 3) Show / hide synopsis */
  var synBtn = document.getElementById("synopsis-toggle");
  var syn = document.getElementById("synopsis");
  if (synBtn && syn) {
    synBtn.addEventListener("click", function () {
      var hide = !syn.hidden;
      syn.hidden = hide;
      synBtn.setAttribute("aria-expanded", !hide);
      synBtn.textContent = hide ? "Show Synopsis" : "Hide Synopsis";
    });
  }

  /* 4) Reading progress bar */
  var bar = document.getElementById("reading-progress-bar");
  if (bar) {
    function updateBar() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", updateBar, { passive: true });
    window.addEventListener("resize", updateBar);
    updateBar();
  }

  /* 5) Library: search + genre filter */
  var cards = document.querySelectorAll("#library-grid .book-card");
  if (cards.length) {
    var search = document.getElementById("search");
    var buttons = document.querySelectorAll(".btn--filter");
    var countEl = document.getElementById("result-count");
    var none = document.getElementById("no-results");
    var genre = "All";
    function applyFilter() {
      var q = search ? search.value.trim().toLowerCase() : "";
      var shown = 0;
      cards.forEach(function (card) {
        var okGenre = genre === "All" || card.getAttribute("data-genre") === genre;
        var okText = !q || card.textContent.toLowerCase().indexOf(q) !== -1;
        var show = okGenre && okText;
        card.hidden = !show;
        if (show) shown++;
      });
      if (countEl) countEl.textContent = "Showing " + shown + " of " + cards.length + " stories";
      if (none) none.hidden = shown !== 0;
    }
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        genre = btn.getAttribute("data-filter");
        buttons.forEach(function (b) { b.classList.toggle("active", b === btn); });
        applyFilter();
      });
    });
    if (search) search.addEventListener("input", applyFilter);
    var hash = decodeURIComponent(location.hash.replace("#", ""));
    buttons.forEach(function (b) { if (hash && b.getAttribute("data-filter") === hash) b.click(); });
  }
});

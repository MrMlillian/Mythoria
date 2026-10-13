document.addEventListener("DOMContentLoaded", function () {
  var body = document.body;
  var themeToggle = document.getElementById("theme-toggle");

  try {
    if (localStorage.getItem("theme") === "dark") {
      body.classList.add("dark-mode");
    }
  } catch (e) {}

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      body.classList.toggle("dark-mode");
      try {
        localStorage.setItem("theme", body.classList.contains("dark-mode") ? "dark" : "light");
      } catch (e) {}
    });
  }

  var likeBtn = document.getElementById("like-btn");
  var likeCount = document.getElementById("like-count");

  if (likeBtn && likeCount) {
    var storyKey = "likes-" + window.location.pathname;
    var liked = false;
    var count = 0;

    try {
      var saved = JSON.parse(localStorage.getItem(storyKey));
      if (saved) {
        liked = saved.liked;
        count = saved.count;
      }
    } catch (e) {}

    function renderLike() {
      likeCount.textContent = count;
      likeBtn.classList.toggle("liked", liked);
      likeBtn.setAttribute("aria-pressed", liked ? "true" : "false");
    }

    renderLike();

    likeBtn.addEventListener("click", function () {
      liked = !liked;
      count = liked ? count + 1 : Math.max(0, count - 1);
      renderLike();
      try {
        localStorage.setItem(storyKey, JSON.stringify({ liked: liked, count: count }));
      } catch (e) {}
    });
  }

  var synopsisToggle = document.getElementById("synopsis-toggle");
  var synopsis = document.getElementById("synopsis");

  if (synopsisToggle && synopsis) {
    synopsisToggle.addEventListener("click", function () {
      var isHidden = synopsis.classList.toggle("hidden");
      synopsisToggle.textContent = isHidden ? "Show Synopsis" : "Hide Synopsis";
      synopsisToggle.setAttribute("aria-expanded", isHidden ? "false" : "true");
    });
  }

  var progressBar = document.getElementById("reading-progress-bar");

  if (progressBar) {
    window.addEventListener("scroll", function () {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var height = document.documentElement.scrollHeight - window.innerHeight;
      var percent = height > 0 ? (scrollTop / height) * 100 : 0;
      progressBar.style.width = percent + "%";
    });
  }
});

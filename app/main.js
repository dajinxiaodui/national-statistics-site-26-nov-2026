// NationScope boot: a tiny hash router. Routes:
//   #/                 home — charts and the full table
//   #/country/<code>   one country's profile
//   #/compare          side-by-side comparison
//   #/rankings         leaderboards by indicator
//   #/about            method and sources
// No network requests are made at any point; all content is in data.js.

function currentParts() {
  const hash = window.location.hash || "#/";
  const path = hash.replace(/^#\/?/, "");
  return path === "" ? [""] : path.split("/");
}

function setActiveNav(parts) {
  const page = parts[0] || "";
  document.querySelectorAll("nav a").forEach((a) => {
    const target = a.getAttribute("data-page");
    a.classList.toggle("active", target === page);
  });
}

function route() {
  const parts = currentParts();
  setActiveNav(parts);
  renderRoute(parts);
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", route);
document.addEventListener("DOMContentLoaded", route);

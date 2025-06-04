document.addEventListener("DOMContentLoaded", () => {
  // Theme toggle
  const toggleBtn = document.getElementById("theme-toggle");
  toggleBtn?.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
  });

  // Apply saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }

  // Load projects if on projects.html
  if (window.location.pathname.includes("projects.html")) {
    fetch("data/projects.json")
      .then(res => res.json())
      .then(projects => {
        const container = document.getElementById("projects-container");
        container.innerHTML = projects.map(p => `
          <div class="project-card">
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <small>${p.tech.join(", ")}</small>
          </div>
        `).join("");
      });
  }
});

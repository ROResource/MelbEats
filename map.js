// 🌍 Initialise Leaflet map centered on Melbourne CBD
const map = L.map('map').setView([-37.813394, 144.9686092], 16);

// 🗺️ Add Carto Light tile layer
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; OpenStreetMap & CartoDB',
  subdomains: 'abcd',
  maxZoom: 19
}).addTo(map);

// 📌 Global panel toggle + scroll function (used by markers)
function showPanel(name) {
  const panels = document.querySelectorAll("details");
  const target = document.getElementById(name);

  if (!target) return;

  // Close other open panels
  panels.forEach(panel => {
    if (panel !== target && panel.hasAttribute("open")) {
      panel.removeAttribute("open");
    }
  });

  // Open the target panel
  if (!target.hasAttribute("open")) {
    target.setAttribute("open", "");
  }

  // Scroll to center
  target.scrollIntoView({
    behavior: "smooth",
    block: "center"
  });
}

marker.bindTooltip(
  `<div class="tooltip-box">
     <strong>${r.Name}</strong><br>
     <em>${r.Style}</em>
   </div>`,
  { direction: 'top', permanent: false }
);


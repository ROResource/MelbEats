document.addEventListener('DOMContentLoaded', () => {
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
fetch('restaurant_data.json')
  .then(res => res.json())
  .then(restaurantData => {
    restaurantData.forEach(r => {
      const rating = r.rating;
      let color;

      if (rating >= 85) color = '#27ae60';         // green
      else if (rating >= 75) color = '#f1c40f';    // yellow
      else if (rating >= 68) color = '#f39c12';    // orange
      else color = '#c0392b';                      // red

      if (!r.latitude || !r.longitude) return; // skip if missing coords

      const marker = L.marker([r.latitude, r.longitude], {
        icon: L.divIcon({
          className: 'rating-icon',
          html: `<div class='rating-circle' style="background:${color}">${rating}</div>`
        })
      }).addTo(map);

      marker.bindTooltip(`${r.name} (${r.style})`, { permanent: false });

      marker.on("click", () => showPanel(r.name));
    });
  })
  .catch(err => {
    console.error("Failed to load restaurant_data.json:", err);
  });
});

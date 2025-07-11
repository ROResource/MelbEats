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
  const allMarkers = []; // Store all markers globally

  fetch('restaurant_data.json')
    .then(res => res.json())
    .then(restaurantData => {
      restaurantData.forEach(r => {
        const rating = r.rating;
        let color;

        if (rating >= 85) color = '#27ae60';
        else if (rating >= 75) color = '#f1c40f';
        else if (rating >= 68) color = '#f39c12';
        else color = '#c0392b';

        if (!r.latitude || !r.longitude) return;

        const marker = L.marker([r.latitude, r.longitude], {
          icon: L.divIcon({
            className: 'rating-icon',
            html: `<div class='rating-circle' style="background:${color}">${rating}</div>`
          })
        }).addTo(map);

        marker.bindTooltip(`${r.name} (${r.style})`, { permanent: false });
        marker.restaurantData = r; // Attach restaurant info to marker
        allMarkers.push(marker);   // Add to list

        marker.on("click", () => showPanel(r.name));
      });
    })
    .catch(err => {
      console.error("Failed to load restaurant_data.json:", err);
    });
  });

function updateMarkers() {
  const selectedStyles = getCheckedValues("style");
  const selectedOccasions = getCheckedValues("occasion");
  const selectedPrices = getCheckedValues("price");
  const selectedRatings = getCheckedValues("rating");

  allMarkers.forEach(marker => {
    const r = marker.restaurantData;

    const matchStyle = selectedStyles.length === 0 || selectedStyles.includes(r.style);
    const matchOccasion = selectedOccasions.length === 0 || selectedOccasions.includes(r.occasion);
    const matchPrice = selectedPrices.length === 0 || selectedPrices.includes(r.price);
    const matchRating = selectedRatings.length === 0 || selectedRatings.some(range => {
      const [low, high] = range.split("–").map(Number);
      return r.rating >= low && r.rating <= high;
    });

    const visible = matchStyle && matchOccasion && matchPrice && matchRating;

    if (visible) {
      if (!map.hasLayer(marker)) marker.addTo(map);
    } else {
      if (map.hasLayer(marker)) marker.remove();
    }
  });
}

function getCheckedValues(filterName) {
  return Array.from(document.querySelectorAll(`input[name="${filterName}"]:checked`)).map(cb => cb.value);
}
window.updateMarkers = updateMarkers;
window.getCheckedValues = getCheckedValues;
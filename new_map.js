const allMarkers = [];
let map = null;

// Init map once — call this from main.js first
function initMap() {
  map = L.map('map').setView([-37.813394, 144.9686092], 16);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap & CartoDB',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);
}
// Function to create markers from data
function createMarkers(restaurantData) {
  console.log("✅ createMarkers() called with", restaurantData.length, "restaurants");

  restaurantData.forEach(r => {
    // 🔎 Check lat/lng presence
    if (!r.latitude || !r.longitude) {
      console.warn("⚠️ Skipping due to missing lat/lng:", r.name);
      return;
    }

    // 🔢 Colour logic
    const rating = r.rating;
    let color;
    if (rating >= 85) color = '#27ae60';
    else if (rating >= 75) color = '#f1c40f';
    else if (rating >= 68) color = '#f39c12';
    else color = '#c0392b';

    // 📌 Create marker
    const marker = L.marker([r.latitude, r.longitude], {
      icon: L.divIcon({
        className: 'rating-icon',
        html: `<div class='rating-circle' style="background:${color}">${rating}</div>`
      })
    }).addTo(map);

    console.log("📍 Added marker for:", r.name, r.latitude, r.longitude); // ✅ Add this

    marker.bindTooltip(`${r.name} (${r.style})`, { permanent: false });
    marker.restaurantData = r;
    allMarkers.push(marker);

    marker.on("click", () => showPanel(r.name));
  });

  window.updateMarkers(); // ✅ Filter after creating all markers
}
function showPanel(name) {
  const target = document.getElementById(name);
  const overlay = document.getElementById("restaurant-overlay");
  if (!target || !overlay) return;

  // Clone the restaurant panel
  const clone = target.cloneNode(true);
  clone.setAttribute("open", "");

  // Clear overlay and insert clone FIRST
  overlay.innerHTML = "";
  overlay.appendChild(clone);
  overlay.classList.remove("hidden");

  // Now fix IDs + mount Glide AFTER insertion
  const glideEls = clone.querySelectorAll('.glide');
  glideEls.forEach((glideEl, index) => {
    // Generate a unique ID for the cloned glide element
    const newId = `glide-overlay-${name.replace(/\s+/g, '_')}-${index}`;
    glideEl.id = newId;

    // ✅ Now safely mount Glide
    new Glide(`#${newId}`, {
      type: 'carousel',
      perView: 1,
      focusAt: 'center',
      gap: 1,
    }).mount();
  });

  // Close on clicking outside
  overlay.addEventListener("click", e => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
    }
  });
}


function showPanelold(name) {
  const panels = document.querySelectorAll("details.restaurants");
  const target = document.getElementById(name);
  if (!target) return;

  // 🔁 Open all parent <details> (recursive)
  let parent = target.parentElement;
  while (parent) {
    if (parent.tagName.toLowerCase() === "details") {
      parent.setAttribute("open", "");
    }
    parent = parent.parentElement;
  }

  // ❌ Close other restaurant panels (but not parents)
  panels.forEach(panel => {
    if (panel !== target && panel.hasAttribute("open")) {
      panel.removeAttribute("open");
    }
  });

  // ✅ Open the target panel itself
  if (!target.hasAttribute("open")) target.setAttribute("open", "");

  // 🔽 Scroll to it
  target.scrollIntoView({ behavior: "smooth", block: "center" });
}

function updateMarkers() {
  const selectedStyles = getCheckedValues("style");
  const selectedOccasions = getCheckedValues("occasion");
  const selectedPrices = getCheckedValues("price");
  const selectedRatings = getCheckedValues("rating");

  const allEmpty =
    selectedStyles.length === 0 &&
    selectedOccasions.length === 0 &&
    selectedPrices.length === 0 &&
    selectedRatings.length === 0;

  allMarkers.forEach(marker => {
    const r = marker.restaurantData;

    const matchStyle = selectedStyles.length === 0 || selectedStyles.includes(r.style);
    const matchOccasion = selectedOccasions.length === 0 || selectedOccasions.includes(r.occasion);
    const matchPrice = selectedPrices.length === 0 || selectedPrices.includes(String(r.price));
    const matchRating = selectedRatings.length === 0 || selectedRatings.some(range => {
      const [low, high] = range.split("–").map(Number);
      return r.rating >= low && r.rating <= high;
    });

    // ✅ Master control: only show if some filters are selected
    const visible = !allEmpty && matchStyle && matchOccasion && matchPrice && matchRating;

    if (visible && !map.hasLayer(marker)) marker.addTo(map);
    if (!visible && map.hasLayer(marker)) marker.remove();
  });
}



function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
}

// Expose functions globally
window.initMap = initMap;
window.createMarkers = createMarkers;
window.updateMarkers = updateMarkers;
window.getCheckedValues = getCheckedValues;
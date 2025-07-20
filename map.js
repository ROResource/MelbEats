const allMarkers = [];
let map = null;
let showOccasionIcons = false;

const occasionIcons = {
  "Fine Dining": "💲",
  "Dinner": "🍴",
  "Brunch": "🍳",
  "Cafe": "☕️",
  "Bar": "🍺",
  "Cocktails": "🍸",
  "Wine": "🍷",
  "Lunch": "🥪",
  "Quick Eats": "🍔",
  "Ramen": "🍜",
  "Sushi": "🍣",
};

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

    // 🔢 Colour logic (for rating-based markers)
    const rating = r.rating;
    let color;
    if (rating >= 85) color = '#27ae60';
    else if (rating >= 75) color = '#f1c40f';
    else if (rating >= 68) color = '#f39c12';
    else color = '#c0392b';

    // 🎭 Occasion emoji logic


    // 🧩 Decide icon mode based on global toggle
    let iconHTML, className;

    if (showOccasionIcons) {
      const occasion = r.occasion;
      let emoji = occasionIcons[occasion] || "❓"; // <-- use `let` here
      iconHTML = `<div class='icon-marker' data-occasion="${occasion}">${emoji}</div>`;
      className = 'icon-marker-wrapper';
    } else {
      iconHTML = `<div class='rating-circle' style="background:${color}">${rating}</div>`;
      className = 'rating-icon';
    }


    // 📌 Create marker
    const marker = L.marker([r.latitude, r.longitude], {
      icon: L.divIcon({
        className,
        html: iconHTML
      })
    }).addTo(map);

    console.log("📍 Added marker for:", r.name, r.latitude, r.longitude);

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

  const resetBtn = document.getElementById("reset-filters");
  resetBtn.style.display = allEmpty ? "none" : "block";
    
  allMarkers.forEach(marker => {
    const r = marker.restaurantData;

    const matchStyle = selectedStyles.length === 0 || selectedStyles.includes(r.style);
    const matchOccasion = selectedOccasions.length === 0 || selectedOccasions.includes(r.occasion);
    const matchPrice = selectedPrices.length === 0 || selectedPrices.includes(String(r.price));
    const matchRating = selectedRatings.length === 0 || selectedRatings.some(range => {
      const [low, high] = range.split("–").map(Number);
      return r.rating >= low && r.rating <= high;
    });

   

   const visible = allEmpty || (matchStyle && matchOccasion && matchPrice && matchRating);
    if (visible && !map.hasLayer(marker)) marker.addTo(map);
    if (!visible && map.hasLayer(marker)) marker.remove();
  });
}
function getCheckedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map(cb => cb.value);
}
function setupResetFiltersButton() {
  const resetBtn = document.getElementById("reset-filters");

  if (!resetBtn) {
    console.warn("⚠️ reset-filters button not found in DOM.");
    return;
  }

  resetBtn.addEventListener("click", () => {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
    updateMarkers();
  });
}
function setupMarkerToggleButton() {
  const toggleBtn = document.getElementById("marker-toggle");

  if (!toggleBtn) {
    console.warn("⚠️ marker-toggle button not found in DOM.");
    return;
  }

  toggleBtn.addEventListener("click", () => {
    if (!window.restaurantData) {
      console.warn("⚠️ No restaurant data loaded.");
      return;
    }

    showOccasionIcons = !showOccasionIcons;
    toggleBtn.textContent = showOccasionIcons ? "Show Ratings" : "Show Icons";

    allMarkers.forEach(m => map.removeLayer(m));
    allMarkers.length = 0;
    createMarkers(window.restaurantData);
  });
}

// Expose functions globally
window.initMap = initMap;
window.createMarkers = createMarkers;
window.updateMarkers = updateMarkers;
window.getCheckedValues = getCheckedValues;
window.setupResetFiltersButton = setupResetFiltersButton;
window.setupMarkerToggleButton = setupMarkerToggleButton;
document.addEventListener('DOMContentLoaded', () => {
  window.initMap();
  fetch("restaurant_data.json")
    .then(res => res.json())
    .then(data => {
      renderRestaurants(data);
      populateFilters(data);
      window.createMarkers(data);
      window.updateMarkers();
      listoverlay();
    })
    .catch(err => {
      console.error("Failed to load restaurant data:", err);
    });
});


// === RENDER RESTAURANTS ===
function renderRestaurants(data) {
  const container = document.getElementById("restaurant-list");

  data.forEach(restaurant => {
    const { name, rating, style, comment, map, images = [] } = restaurant;

    const safeName = name.replace(/\s+/g, "_");
    const glideId = `gallery-${safeName}`;
    const mapLink = map
      ? `<a href="${map}" target="_blank" class="map-link">View on Google Maps</a>`
      : "";

    let html = `
  <details class="restaurants" id="${name}">
    <summary>
      <div class="restaurant_name">${name}</div>
      <div class="rating">${rating ?? ""}</div>
    </summary>
    <div class="restaurant_info">
      <div class="type_of_cusine">${style}</div>
      <div class="link">${mapLink}</div>
    </div>
    <div class="comment">"${comment}"</div>
  `;

      if (images.length > 0) {
        html += `
    <div class="glide" id="${glideId}">
      <div class="glide__track" data-glide-el="track">
        <ul class="glide__slides">
  `;

      images.forEach(imgPath => {
        html += `<li class="glide__slide"><img src="${imgPath}" alt="${name} photo"></li>\n`;
      });

      html += `
      </ul>
    </div>
    <div class="glide__arrows" data-glide-el="controls">
      <button class="glide__arrow glide__arrow--left" data-glide-dir="<">‹</button>
      <button class="glide__arrow glide__arrow--right" data-glide-dir=">">›</button>
    </div>
  </div>
  `;
      }

      html += `</details>\n\n`;
      container.insertAdjacentHTML("beforeend", html);
    });

  document.querySelectorAll('.glide').forEach((el) => {
  const instance = new Glide(`#${el.id}`, {
    type: 'carousel',
    perView: 1,
    focusAt: 'center',
    gap: 1,
  });

  instance.mount();
  el._glideInstance = instance; // 🔑 Save instance directly on the element
  });

  document.querySelectorAll("details.restaurants").forEach((panel) => {
    panel.addEventListener("toggle", () => {
      if (panel.open) {
        document.querySelectorAll("details.restaurants").forEach((other) => {
          if (other !== panel && other.open) {
            other.removeAttribute("open");
          }
        });
        panel.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
}
// === POPULATE FILTERS ===
function populateFilters(data) {
  const styleSet = new Set();
  const occasionSet = new Set();
  const priceSet = new Set();
  const ratingRanges = {
    "60–69": [],
    "70–79": [],
    "80–89": [],
    "90–100": []
  };

  data.forEach(r => {
    if (r.style) styleSet.add(r.style);
    if (r.occasion) occasionSet.add(r.occasion);
    if (r.price) priceSet.add(r.price);

    const rating = Number(r.rating);
    if (!isNaN(rating)) {
      if (rating >= 60 && rating < 70) ratingRanges["60–69"].push(r);
      else if (rating >= 70 && rating < 80) ratingRanges["70–79"].push(r);
      else if (rating >= 80 && rating < 90) ratingRanges["80–89"].push(r);
      else if (rating >= 90) ratingRanges["90–100"].push(r);
    }
  });

  createGroupedCheckboxes("style", data);
  createCheckboxes("occasion", [...occasionSet].sort());
  createCheckboxes("price", [...priceSet].sort((a, b) => a - b));
  createCheckboxes("rating", Object.keys(ratingRanges));

  // ✅ Only one filter panel open at a time
  document.querySelectorAll("details.fltr").forEach((panel) => {
    panel.addEventListener("toggle", () => {
      if (panel.open) {
        document.querySelectorAll("details.fltr").forEach((other) => {
          if (other !== panel && other.open) {
            other.removeAttribute("open");
          }
        });
        panel.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });
}

function createCheckboxes(containerId, values) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  // === Create 'Select All' checkbox ===
  const selectAllLabel = document.createElement("label");
  const selectAllCheckbox = document.createElement("input");
  selectAllCheckbox.type = "checkbox";
  selectAllCheckbox.name = `${containerId}-select-all`;
  selectAllCheckbox.classList.add("select-all");
  selectAllCheckbox.checked = true;

  selectAllLabel.appendChild(selectAllCheckbox);
  selectAllLabel.append(" Select All");
  container.appendChild(selectAllLabel);

  // === Select All logic
  selectAllCheckbox.addEventListener("change", () => {
    const checkboxes = container.querySelectorAll(`input[type="checkbox"]:not(.select-all)`);
    checkboxes.forEach(cb => {
      cb.checked = selectAllCheckbox.checked;
    });
    if (window.updateMarkers) window.updateMarkers();
  });

  // === Create individual checkboxes
  values.forEach(value => {
    const label = document.createElement("label");
    const checkbox = document.createElement("input");

    checkbox.type = "checkbox";
    checkbox.name = containerId;
    checkbox.value = value;
    checkbox.checked = true;

    label.appendChild(checkbox);
    label.append(` ${value}`);
    container.appendChild(label);
  });

  // ✅ Add change listeners to individual checkboxes
  container.querySelectorAll(`input[type="checkbox"]:not(.select-all)`).forEach(cb => {
    cb.addEventListener("change", () => {
      if (window.updateMarkers) window.updateMarkers();
    });
  });
}

function createGroupedCheckboxes(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  // Create filter-group wrapper if needed
  const grid = document.createElement("div");
  grid.classList.add("filter-group");
  container.appendChild(grid);

  // Master Select All
  const masterWrapper = document.createElement("div");
  masterWrapper.classList.add("filter-master");

  const masterLabel = document.createElement("label");
  const masterCheckbox = document.createElement("input");
  masterCheckbox.type = "checkbox";
  masterCheckbox.classList.add("select-all-master");
  masterCheckbox.checked = true;

  masterLabel.appendChild(masterCheckbox);
  masterLabel.append(" Select All Styles");

  masterWrapper.appendChild(masterLabel);
  grid.appendChild(masterWrapper); // ✅ append to grid!


  // Group styles by region
  const regionMap = {};
  const allCheckboxes = [];
  const regionSelectAlls = [];

  data.forEach(r => {
    if (!regionMap[r.region]) regionMap[r.region] = new Set();
    if (r.style) regionMap[r.region].add(r.style);
  });

  // For each region, create a subgroup
  for (const region of Object.keys(regionMap).sort()) {
    const regionContainer = document.createElement("div");
    regionContainer.classList.add("filter-subgroup");

    const regionTitle = document.createElement("strong");
    regionTitle.textContent = region;
    regionContainer.appendChild(regionTitle);

    // Create Select All for this region
    const selectAllLabel = document.createElement("label");
    const selectAllCheckbox = document.createElement("input");
    selectAllCheckbox.type = "checkbox";
    selectAllCheckbox.classList.add("select-all-region");
    selectAllCheckbox.checked = true;
    selectAllLabel.appendChild(selectAllCheckbox);
    selectAllLabel.append(" Select All");
    regionContainer.appendChild(selectAllLabel);
    
    regionSelectAlls.push(selectAllCheckbox); // ✅ track region-level boxes


    // Add styles under this region
    const styles = [...regionMap[region]].sort();
    styles.forEach(style => {
      const label = document.createElement("label");
      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.name = containerId;
      checkbox.value = style;
      checkbox.checked = true;
      allCheckboxes.push(checkbox);

      label.appendChild(checkbox);
      label.append(` ${style}`);
      regionContainer.appendChild(label);
    });

    // Handle select-all toggle for the region
    selectAllCheckbox.addEventListener("change", () => {
      const checkboxes = regionContainer.querySelectorAll(`input[type="checkbox"][name="${containerId}"]`);
      checkboxes.forEach(cb => cb.checked = selectAllCheckbox.checked);
      if (window.updateMarkers) window.updateMarkers();
    });

    // Add change listener for individual boxes
    regionContainer.querySelectorAll(`input[type="checkbox"][name="${containerId}"]`).forEach(cb => {
      cb.addEventListener("change", () => {
        if (window.updateMarkers) window.updateMarkers();
      });
    });

    grid.appendChild(regionContainer); // for each region

  }

masterCheckbox.addEventListener("change", () => {
  const checked = masterCheckbox.checked;
  allCheckboxes.forEach(cb => cb.checked = checked);
  regionSelectAlls.forEach(cb => cb.checked = checked); // ✅ sync subgroup selects
  if (window.updateMarkers) window.updateMarkers();
});
}

function listoverlay() {
  const overlay = document.getElementById("list_container");
  const trigger = document.getElementById("see_full_list");

  if (!overlay || !trigger) return;

  trigger.addEventListener("click", () => {
    overlay.classList.remove("hidden");
    overlay.style.display = "flex";


    // Delay to allow overlay to render
    setTimeout(() => {
      document.querySelectorAll('.glide').forEach((el) => {
        if (el._glideInstance) {
          el._glideInstance.update();
        }
      });
    }, 100);
  });

  // Close when clicking outside content
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.classList.add("hidden");
      overlay.style.display = "none"; // ✅ Reset display
    }
  });
}

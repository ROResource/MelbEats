document.addEventListener('DOMContentLoaded', () => {
  window.initMap();

  fetch('restaurant_data.json')
    .then(res => res.json())
    .then(data => {
      window.restaurantData = data;

      renderRestaurants(data);
      populateFilters(data);
      window.createMarkers(data);
      listoverlay();

      window.setupResetFiltersButton();
      window.setupMarkerToggleButton();
    })
    .catch(err => {
      console.error('Failed to load restaurant data:', err);
      const errorEl = document.getElementById('load-error');
      if (errorEl) errorEl.classList.remove('hidden');
    });
});

// === RENDER RESTAURANTS ===
function renderRestaurants(data) {
  const container = document.getElementById('restaurant-list');

  data.forEach(restaurant => {
    const { name, rating, style, comment, map, images = [] } = restaurant;

    const safeName = name.replace(/\s+/g, '_');
    const glideId = `gallery-${safeName}`;
    const mapLink = map
      ? `<a href="${map}" target="_blank" rel="noopener noreferrer" class="map-link">View on Google Maps</a>`
      : '';

    let html = `
  <details class="restaurants" id="${name}">
    <summary>
      <div class="restaurant_name">${name}</div>
      <div class="rating">${rating ?? ''}</div>
    </summary>
    <div class="details-content">
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
        html += `<li class="glide__slide"><div class="zoom-container"><img src="${imgPath}" alt="Photo of ${name}" loading="lazy" decoding="async"></div></li>\n`;
      });

      html += `
        </ul>
      </div>
      <div class="glide__arrows" data-glide-el="controls">
        <button class="glide__arrow glide__arrow--left" data-glide-dir="<">&#8249;</button>
        <button class="glide__arrow glide__arrow--right" data-glide-dir=">">&#8250;</button>
      </div>
    </div>
      `;
    }

    html += `</div></details>\n`;
    container.insertAdjacentHTML('beforeend', html);
  });

  // Mount Glide instances
  document.querySelectorAll('.glide').forEach(el => {
    const instance = new Glide(`#${el.id}`, {
      type: 'carousel',
      perView: 1,
      focusAt: 'center',
      gap: 1,
    });
    instance.mount();
    el._glideInstance = instance;
    setupPanzoomWithSwipeToggle(el);
  });

  // Accordion + panzoom visibility — single unified listener
  document.querySelectorAll('details.restaurants').forEach(panel => {
    panel.addEventListener('toggle', () => {
      if (!panel.open) return;

      // Close other open panels
      document.querySelectorAll('details.restaurants').forEach(other => {
        if (other !== panel && other.open) other.removeAttribute('open');
      });

      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Update glide visibility and init panzoom
      const glideEl = panel.querySelector('.glide');
      if (glideEl) {
        document.querySelectorAll('.glide').forEach(g => g.classList.remove('glide--visible'));
        glideEl.classList.add('glide--visible');
        setupPanzoomWithSwipeToggle(glideEl);
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
    '60\u201369': [],
    '70\u201379': [],
    '80\u201389': [],
    '90\u2013100': []
  };

  data.forEach(r => {
    if (r.style) styleSet.add(r.style);
    if (r.occasion) occasionSet.add(r.occasion);
    if (r.price) priceSet.add(r.price);

    const rating = Number(r.rating);
    if (!isNaN(rating)) {
      if (rating >= 60 && rating < 70) ratingRanges['60\u201369'].push(r);
      else if (rating >= 70 && rating < 80) ratingRanges['70\u201379'].push(r);
      else if (rating >= 80 && rating < 90) ratingRanges['80\u201389'].push(r);
      else if (rating >= 90) ratingRanges['90\u2013100'].push(r);
    }
  });

  createGroupedCheckboxes('style', data);
  createCheckboxes('occasion', [...occasionSet].sort());
  createCheckboxes('price', [...priceSet].sort((a, b) => a - b));
  createCheckboxes('rating', Object.keys(ratingRanges));

  // Only one filter panel open at a time
  document.querySelectorAll('details.fltr').forEach(panel => {
    panel.addEventListener('toggle', () => {
      if (!panel.open) return;
      document.querySelectorAll('details.fltr').forEach(other => {
        if (other !== panel && other.open) other.removeAttribute('open');
      });
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function createCheckboxes(containerId, values) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  const selectAllLabel = document.createElement('label');
  const selectAllCheckbox = document.createElement('input');
  selectAllCheckbox.type = 'checkbox';
  selectAllCheckbox.name = `${containerId}-select-all`;
  selectAllCheckbox.classList.add('select-all');
  selectAllCheckbox.checked = false;
  selectAllLabel.classList.add('select-all-label');
  selectAllLabel.appendChild(selectAllCheckbox);
  selectAllLabel.append(' Select All');
  container.appendChild(selectAllLabel);

  selectAllCheckbox.addEventListener('change', () => {
    const checkboxes = container.querySelectorAll('input[type="checkbox"]:not(.select-all)');
    checkboxes.forEach(cb => { cb.checked = selectAllCheckbox.checked; });
    window.updateMarkers();
  });

  values.forEach(value => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = containerId;
    checkbox.value = value;
    checkbox.addEventListener('change', () => {
      const all = container.querySelectorAll('input[type="checkbox"]:not(.select-all)');
      const checked = container.querySelectorAll('input[type="checkbox"]:not(.select-all):checked');
      selectAllCheckbox.checked = all.length === checked.length;
      window.updateMarkers();
    });
    label.appendChild(checkbox);
    label.append(` ${value}`);
    container.appendChild(label);
  });
}

function createGroupedCheckboxes(containerId, data) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';

  // Group restaurants by region
  const regionMap = {};
  data.forEach(r => {
    const region = r.region || 'Other';
    const style = r.style;
    if (!style) return;
    if (!regionMap[region]) regionMap[region] = new Set();
    regionMap[region].add(style);
  });

  const allStyles = [...new Set(data.map(r => r.style).filter(Boolean))].sort();

  // Master select-all
  const masterLabel = document.createElement('div');
  masterLabel.classList.add('filter-master');
  const masterCheckbox = document.createElement('input');
  masterCheckbox.type = 'checkbox';
  masterCheckbox.classList.add('select-all');
  masterCheckbox.name = 'style-select-all-master';
  const masterLabelText = document.createElement('label');
  masterLabelText.appendChild(masterCheckbox);
  masterLabelText.append(' Select All');
  masterLabel.appendChild(masterLabelText);
  container.appendChild(masterLabel);

  masterCheckbox.addEventListener('change', () => {
    container.querySelectorAll('input[type="checkbox"]:not(.select-all)').forEach(cb => {
      cb.checked = masterCheckbox.checked;
    });
    window.updateMarkers();
  });

  // Per-region subgroups
  const sortedRegions = Object.keys(regionMap).sort();
  sortedRegions.forEach(region => {
    const subgroup = document.createElement('div');
    subgroup.classList.add('filter-subgroup');

    const title = document.createElement('strong');
    title.textContent = region;
    subgroup.appendChild(title);

    [...regionMap[region]].sort().forEach(style => {
      const label = document.createElement('label');
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.name = 'style';
      checkbox.value = style;
      checkbox.addEventListener('change', () => window.updateMarkers());
      label.appendChild(checkbox);
      label.append(` ${style}`);
      subgroup.appendChild(label);
    });

    container.appendChild(subgroup);
  });
}

function listoverlay() {
  const btn = document.getElementById('see_full_list');
  const overlay = document.getElementById('list_container');
  const closeBtn = document.getElementById('listbtn');

  if (!btn || !overlay || !closeBtn) return;

  btn.addEventListener('click', () => {
    overlay.style.display = 'flex';
    closeBtn.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    closeBtn.style.display = 'none';
  });

  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.style.display = 'none';
      closeBtn.style.display = 'none';
    }
  });
}

function setupPanzoomWithSwipeToggle(glideEl) {
  if (glideEl._panzoomInitialised) return;
  glideEl._panzoomInitialised = true;

  const slides = glideEl.querySelectorAll('.zoom-container');
  slides.forEach(container => {
    const img = container.querySelector('img');
    if (!img) return;

    const pz = Panzoom(img, {
      maxScale: 4,
      contain: 'outside',
    });

    let isPanzoomed = false;

    img.addEventListener('dblclick', () => {
      if (isPanzoomed) {
        pz.reset();
        isPanzoomed = false;
        if (glideEl._glideInstance) glideEl._glideInstance.enable();
      } else {
        pz.zoomIn();
        isPanzoomed = true;
        if (glideEl._glideInstance) glideEl._glideInstance.disable();
      }
    });

    img.parentElement.addEventListener('wheel', pz.zoomWithWheel);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch("restaurant_data.json")
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("restaurant-list");

      data.forEach(restaurant => {
        const {
          name,
          rating,
          style,
          comment,
          map,
          images = []
        } = restaurant;

        const safeName = name.replace(/\s+/g, "_");
        const glideId = `gallery-${safeName}`;
        const mapLink = map
          ? `<a href="${map}" target="_blank" class="map-link">View on Google Maps</a>`
          : "";

        let html = `
<details id="${name}">
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
            html += `        <li class="glide__slide"><img src="${imgPath}" alt="${name} photo"></li>\n`;
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

      // ✅ Initialise Glide carousels *after* injecting them
      document.querySelectorAll('.glide').forEach((el) => {
        new Glide(`#${el.id}`, {
          type: 'carousel',
          perView: 1,
          focusAt: 'center',
          gap: 1,
        }).mount();
      });

      // ✅ Ensure only one <details> is open at a time
      document.querySelectorAll("details").forEach((panel) => {
        panel.addEventListener("toggle", () => {
          if (panel.open) {
            document.querySelectorAll("details").forEach((other) => {
              if (other !== panel && other.open) {
                other.removeAttribute("open");
              }
            });
            panel.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      });
    })
    .catch(err => {
      console.error("Failed to load restaurant data:", err);
    });
});



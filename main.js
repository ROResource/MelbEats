document.addEventListener('DOMContentLoaded', () => {
  fetch('restaurant_panels.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('restaurant-list').innerHTML = data;

      // ✅ Mount Glide viewers after HTML is injected
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
            document.querySelectorAll("details").forEach((otherPanel) => {
              if (otherPanel !== panel && otherPanel.open) {
                otherPanel.removeAttribute("open");
              }
            });
          }
        });
      });
    })
    .catch(error => {
      console.error('Error loading restaurant list:', error);
    });

});

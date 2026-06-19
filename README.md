# MelbEats 🍽️

A personal map-based guide to the best restaurants in Melbourne, filterable by cuisine style, occasion, rating, and price.

## What it is

- An interactive Leaflet map with colour-coded rating markers (or occasion emoji icons)
- Filter dropdowns for Style, Occasion, Rating, and Price
- A full scrollable restaurant list with image galleries, comments, and Google Maps links
- Built with plain HTML, CSS, and JavaScript — no framework, no build step

## Project structure

```
.
├── index.html                  # Main page
├── style.css                   # All styles
├── main.js                     # UI logic (filters, list, gallery)
├── map.js                      # Leaflet map + markers
├── restaurant_data.json        # Generated — do not edit manually
├── restaurants.xlsx            # Source of truth — edit this to add/update restaurants
├── create_restaurant_list.py   # Converts xlsx → restaurant_data.json
├── create_image_folders.py     # Creates a pics/<name>/ folder for each restaurant
└── pics/
    └── <Restaurant Name>/      # Drop .jpg/.png/.webp images here
```

## How to add or update a restaurant

1. Edit `restaurants.xlsx` — add a new row or update an existing one
2. Run the data script to regenerate the JSON:
   ```bash
   python create_restaurant_list.py
   ```
3. To add photos, drop image files into `pics/<Restaurant Name>/`
   - If the folder doesn't exist yet, run:
     ```bash
     python create_image_folders.py
     ```

## How to run locally

Because the page fetches `restaurant_data.json` via `fetch()`, you need a local server (browsers block file:// fetches).

```bash
# Python 3
python -m http.server 8000
# Then open http://localhost:8000
```

Or use the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code.

## Dependencies (all via CDN — no install needed)

| Library | Purpose |
|---|---|
| [Leaflet](https://leafletjs.com/) | Interactive map |
| [Glide.js](https://glidejs.com/) | Image carousel |
| [Panzoom](https://github.com/timmywil/panzoom) | Pinch/zoom on images |
| [Inter](https://fonts.google.com/specimen/Inter) | Body font |
| [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) | Display/header font |

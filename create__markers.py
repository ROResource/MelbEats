import pandas as pd
import json

# === Configuration ===
input_file = "restaurants.xlsx"           # Excel file with header row
output_file = "restaurant_markers.js"     # Output JavaScript file
required_columns = ['Name', 'Style', 'Rating', 'Latitude', 'Longitude']

# === Step 1: Read and validate Excel file ===
df = pd.read_excel(input_file)

# Ensure required columns are present
missing = [col for col in required_columns if col not in df.columns]
if missing:
    raise ValueError(f"Missing required columns: {missing}")

# Keep only the necessary columns
df = df[required_columns]

# === Step 2: Convert data to list of dicts ===
restaurant_data = df.to_dict(orient='records')

# === Step 3: Build JavaScript content ===

# Data array
js = "const restaurantData = " + json.dumps(restaurant_data, indent=2) + ";\n\n"

js += """
restaurantData.forEach(r => {
  const rating = r.Rating;
  let color;

  if (rating >= 85) color = '#27ae60';         // green
  else if (rating >= 75) color = '#f1c40f';    // yellow
  else if (rating >= 68) color = '#f39c12';    // orange
  else color = '#c0392b';                      // red

  const marker = L.marker([r.Latitude, r.Longitude], {
    icon: L.divIcon({
      className: 'rating-icon',
      html: `<div class='rating-circle' style="background:${color}">${rating}</div>`
    })
  }).addTo(map);

  marker.bindTooltip(`${r.Name} (${r.Style})`, { permanent: false });

  marker.on("click", () => showPanel(r.Name));
});
"""

# === Step 4: Save to file ===
with open(output_file, "w", encoding="utf-8") as f:
    f.write(js)

print(f"✅ JS markers file generated: {output_file}")


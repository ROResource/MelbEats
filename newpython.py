import pandas as pd
import os

# === Paths ===
script_dir = os.path.dirname(os.path.abspath(__file__))
excel_file = os.path.join(script_dir, "restaurants.xlsx")
pics_dir = os.path.join(script_dir, "pics")
output_file = os.path.join(script_dir, "restaurant_panels.html")

# === Load Excel ===
df = pd.read_excel(excel_file, header=0, usecols=[0, 1, 2, 3])  # Name, Rating, Type, Comment

# === Build HTML ===
html = ""

for index, row in df.iterrows():
    name = str(row["Name"]).strip()
    rating = str(row["Rating"]).strip()
    type_of_cuisine = str(row["Type of Cuisine"]).strip()
    comment = str(row["Comment"]).strip()

    folder_path = os.path.join(pics_dir, name)
    image_files = []

    if os.path.exists(folder_path):
        image_files = [
            f for f in os.listdir(folder_path)
            if f.lower().endswith((".jpg", ".jpeg", ".png", ".webp", ".Heic"))
        ]

    glide_id = f"gallery-{name.replace(' ', '_')}"

    html += f"""
<details id="{name}">
  <summary>
    <div class="restaurant_name">{name}</div>
    <div class="rating">{rating}</div>
  </summary>
  <div class="type_of_cusine">{type_of_cuisine}</div>
  <div class="comment">"{comment}"</div>
"""

    if image_files:
        html += f"""
  <div class="glide" id="{glide_id}">
    <div class="glide__track" data-glide-el="track">
      <ul class="glide__slides">
"""
        for filename in sorted(image_files):
            image_path = f"pics/{name}/{filename}"
            html += f'        <li class="glide__slide"><img src="{image_path}" alt="{name} photo"></li>\n'

        html += """      </ul>
    </div>
    <div class="glide__arrows" data-glide-el="controls">
      <button class="glide__arrow glide__arrow--left" data-glide-dir="<">‹</button>
      <button class="glide__arrow glide__arrow--right" data-glide-dir=">">›</button>
    </div>
  </div>
"""

    html += "</details>\n\n"

# === Save Output ===
with open(output_file, "w", encoding="utf-8") as f:
    f.write(html)

print(f"✅ HTML saved to: {output_file}")

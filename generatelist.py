import pandas as pd
import os

# Ensure we’re in the same directory as the script
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# Load Excel with no headers
df = pd.read_excel("restaurants.xlsx", header=0, usecols=[0, 1, 2, 3])

# Generate HTML
html = ""

for index, row in df.iterrows():
    name = str(row["Name"]).strip()
    rating = str(row["Rating"]).strip()
    type_of_cusine = str(row["Type of Cuisine"]).strip()     # Avoid using `type` (a reserved word)
    comment = str(row["Comment"]).strip()
    
    glide_id = f"gallery-{name.replace(' ', '_')}"
    html += f"""

<details>
  <summary>
  <div class="restaurant_name"> {name}</div>
  <div class="rating"> {rating}</div>
  </summary>
  <div class="type_of_cusine">{type_of_cusine}</div>
  <div class="comment">"{comment}"</div>
  <div class="glide" id="{glide_id}">
    <div class="glide__track" data-glide-el="track">
      <ul class="glide__slides">
      </ul>
    </div>
    <div class="glide__arrows" data-glide-el="controls">
      <button class="glide__arrow glide__arrow--left" data-glide-dir="<">‹</button>
      <button class="glide__arrow glide__arrow--right" data-glide-dir=">">›</button>
    </div>
  </div>
</details>
"""

# Save output
with open("restaurant_panels.html", "w", encoding="utf-8") as f:
    f.write(html)

print("✅ HTML saved as restaurant_panels.html")


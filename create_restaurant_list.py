import pandas as pd
import json
import os


def to_python_type(val):
    """Converts numpy/pandas types to native Python types for JSON serialisation."""
    if pd.isna(val):
        return None
    if isinstance(val, (pd.Timestamp, pd.Timedelta)):
        return str(val)
    if isinstance(val, (int, float, str, bool)):
        return val
    return val.item() if hasattr(val, 'item') else str(val)


# === CONFIGURATION ===
script_dir = os.path.dirname(os.path.abspath(__file__))
input_excel = os.path.join(script_dir, 'restaurants.xlsx')
output_json = os.path.join(script_dir, 'restaurant_data.json')
pics_dir = os.path.join(script_dir, 'pics')

# === LOAD DATA ===
df = pd.read_excel(input_excel, header=0, usecols=range(10))
df.columns = [str(col).strip().lower().replace(' ', '_') for col in df.columns]
group_key = df.columns[0]

# === BUILD JSON ===
restaurants = []

for name, group in df.groupby(group_key):
    row = group.iloc[0]
    restaurant = {col: to_python_type(row[col]) for col in df.columns}

    # Attach image paths if a matching folder exists
    folder_path = os.path.join(pics_dir, name)
    if os.path.exists(folder_path):
        image_files = sorted(
            f for f in os.listdir(folder_path)
            if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp', '.heic'))
        )
        restaurant['images'] = [f'pics/{name}/{f}' for f in image_files]

    restaurants.append(restaurant)

# === EXPORT JSON ===
with open(output_json, 'w', encoding='utf-8') as f:
    json.dump(restaurants, f, indent=2, ensure_ascii=False)

print(f'✅ Exported {len(restaurants)} restaurants to {output_json}')

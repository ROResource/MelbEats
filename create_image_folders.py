import os
import pandas as pd


# === CONFIGURATION ===
script_dir = os.path.dirname(os.path.abspath(__file__))
input_excel = os.path.join(script_dir, 'restaurants.xlsx')
pics_dir = os.path.join(script_dir, 'pics')

# === LOAD DATA ===
df = pd.read_excel(input_excel, header=0)
df.columns = [str(col).strip().lower().replace(' ', '_') for col in df.columns]
name_col = df.columns[0]

# === CREATE FOLDERS ===
os.makedirs(pics_dir, exist_ok=True)

created = 0
for name in df[name_col].dropna().unique():
    folder = os.path.join(pics_dir, str(name))
    if not os.path.exists(folder):
        os.makedirs(folder)
        print(f'  Created: {folder}')
        created += 1

print(f'\n✅ Done. {created} new folder(s) created in {pics_dir}')

import pandas as pd
import os

# Get the directory of this script
script_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(script_dir)

# Define the path to the Excel file and the "pics" folder
excel_file = "restaurants.xlsx"
pics_dir = os.path.join(script_dir, "pics")

# Create "pics" directory if it doesn't exist
os.makedirs(pics_dir, exist_ok=True)

# Load Excel (assumes first row is header, column 0 = "Name")
df = pd.read_excel(excel_file, header=0, usecols=[0])

# Create a folder for each unique restaurant name
for index, row in df.iterrows():
    name = str(row["Name"]).strip()
    if name == "" or pd.isna(name):
        continue  # Skip blank rows

    folder_path = os.path.join(pics_dir, name)

    if not os.path.exists(folder_path):
        os.makedirs(folder_path)
        print(f"📁 Created folder: {folder_path}")
    else:
        print(f"✅ Already exists: {folder_path}")

print("\n✅ All image folders checked.")

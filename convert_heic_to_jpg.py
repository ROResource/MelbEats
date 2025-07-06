import os
from PIL import Image
import pillow_heif

# Register HEIF support
pillow_heif.register_heif_opener()

def convert_heic_to_jpg(folder_path):
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith(".heic"):
                heic_path = os.path.join(root, file)
                jpg_path = os.path.splitext(heic_path)[0] + ".jpg"

                try:
                    with Image.open(heic_path) as img:
                        img = img.convert("RGB")  # Ensure no alpha channel
                        img.save(jpg_path, "JPEG", quality=95)
                    
                    if os.path.exists(jpg_path):
                        os.remove(heic_path)

                    print(f"Converted: {heic_path} -> {jpg_path}")
                except Exception as e:
                    print(f"Failed to convert {heic_path}: {e}")

convert_heic_to_jpg("./pics")

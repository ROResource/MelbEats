import os
from PIL import Image

# === CONFIGURATION ===
QUALITY = 70              # JPEG quality (1–95)
MAX_WIDTH = 1600          # Resize if width > this (set to None to disable)
REPLACE_ORIGINAL = True   # Set to False to save to new 'compressed/' folder

def compress_image(path, save_path):
    try:
        img = Image.open(path)
        img = img.convert("RGB")

        # Resize if too wide
        if MAX_WIDTH and img.width > MAX_WIDTH:
            ratio = MAX_WIDTH / float(img.width)
            new_height = int(img.height * ratio)
            img = img.resize((MAX_WIDTH, new_height), Image.LANCZOS)

        # Save compressed
        img.save(save_path, optimize=True, quality=QUALITY)
        print(f"✓ Compressed: {path}")
    except Exception as e:
        print(f"✗ Failed to process {path}: {e}")

def compress_all_jpgs(base_dir):
    for root, _, files in os.walk(base_dir):
        for file in files:
            if file.lower().endswith(".jpg"):
                src_path = os.path.join(root, file)
                dst_path = src_path if REPLACE_ORIGINAL else os.path.join("compressed", os.path.relpath(src_path, base_dir))
                
                # Create destination folders if saving to new dir
                if not REPLACE_ORIGINAL:
                    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
                
                compress_image(src_path, dst_path)

if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    compress_all_jpgs(base)

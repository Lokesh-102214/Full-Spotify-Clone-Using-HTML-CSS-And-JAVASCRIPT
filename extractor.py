import os
import json
from mutagen.mp3 import MP3
from mutagen.id3 import ID3, TIT2, TPE1, APIC

# Path to the folder containing MP3 files
mp3_folder = "music\ExtractedTopPunjabi2_25"  # Change to your folder
output_json = "music\ExtractedTopPunjabi2_25\songs_metadata.json"
output_assets_folder = "music\ExtractedTopPunjabi2_25"

# Create assets folder if not exists
os.makedirs(output_assets_folder, exist_ok=True)

songs_data = []

# Loop through all files in the folder
for filename in os.listdir(mp3_folder):
    if filename.lower().endswith(".mp3"):
        file_path = os.path.join(mp3_folder, filename)
        try:
            audio = MP3(file_path, ID3=ID3)
            tags = audio.tags

            title = tags.get("TIT2")
            artist = tags.get("TPE1")
            title_text = title.text[0] if title else os.path.splitext(filename)[0]
            artist_text = artist.text[0] if artist else ""

            # Save album art if exists
            apic_frames = [tag for tag in tags.values() if isinstance(tag, APIC)]
            image_filename = None
            if apic_frames:
                image_filename = os.path.splitext(filename)[0] + ".png"
                image_path = os.path.join(output_assets_folder, image_filename)
                with open(image_path, "wb") as img_out:
                    img_out.write(apic_frames[0].data)

            # Append song metadata
            songs_data.append({
                "title": title_text,
                "artist": artist_text,
                "file": f"{output_assets_folder}/{filename}",
                "image": f"{output_assets_folder}/{image_filename}" if image_filename else ""
            })

        except Exception as e:
            print(f"Error processing {filename}: {e}")

# Write to JSON
with open(output_json, "w", encoding="utf-8") as f:
    json.dump(songs_data, f, indent=2, ensure_ascii=False)

print(f"Metadata for {len(songs_data)} songs saved to {output_json}")

import os
import subprocess
import requests
import uuid
import tempfile
from dotenv import load_dotenv

load_dotenv()

AUDD_API_KEY = os.getenv("AUDD_API_KEY")

class MusicRecognitionViewModel:
    def identify_music(self, url: str) -> dict:
        temp_id = str(uuid.uuid4())
        # To avoid ffmpeg dependency issues if it's missing on Windows, 
        # let's try just downloading the best audio without recoding if possible,
        # but -x typically requires ffmpeg. Let's assume ffmpeg is available or 
        # fallback if needed. We'll use download_sections if possible, or just download bestaudio
        # and limit filesize to avoid huge downloads.
        
        output_tmpl = os.path.join(tempfile.gettempdir(), f"{temp_id}.%(ext)s")
        
        # yt-dlp arguments
        cmd = [
            "yt-dlp",
            # Get best audio format available
            "-f", "bestaudio/best",
            # We don't force -x (extract audio) strictly if ffmpeg is missing, 
            # but it's okay, AudD can often parse mp4 audio too. Let's just download it directly.
            # Limit download size if possible using max-filesize to save logic.
            "--max-filesize", "20M",
            "--output", output_tmpl,
            url
        ]
        
        file_path = None
        try:
            # Let's run yt-dlp
            print("Running yt-dlp command:", " ".join(cmd))
            proc = subprocess.run(cmd, capture_output=True, text=True)
            
            if proc.returncode != 0:
                print("yt-dlp error:", proc.stderr)
                return {"status": "error", "error_message": "Failed to extract audio from URL. Please ensure it is a public un-geoblocked link."}
                
            # yt-dlp output template means the file extension could be anything (webm, m4a, mp4)
            # Find the file that matches the UUID in the temp dir
            downloaded_files = [f for f in os.listdir(tempfile.gettempdir()) if f.startswith(temp_id)]
            
            if not downloaded_files:
                return {"status": "error", "error_message": "Audio file not found after download."}
                
            file_path = os.path.join(tempfile.gettempdir(), downloaded_files[0])
            
            # Send to AudD
            print("Sending to AudD API...")
            data = {
                'api_token': AUDD_API_KEY,
                'return': 'apple_music,spotify',
            }
            files = {
                'file': open(file_path, 'rb'),
            }
            # The API allows uploading video/audio files directly, so even if it's m4a/webm it should work
            response = requests.post('https://api.audd.io/', data=data, files=files)
            result = response.json()
            
            if result.get("status") == "success" and result.get("result"):
                music_data = result["result"]
                
                # Try to extract a cover URL
                cover = None
                if music_data.get("spotify") and music_data["spotify"].get("album") and music_data["spotify"]["album"].get("images"):
                    cover = music_data["spotify"]["album"]["images"][0].get("url")
                if not cover and music_data.get("apple_music") and music_data["apple_music"].get("artwork"):
                    # apple music artwork url is templated: {w}x{h}
                    cover_tmpl = music_data["apple_music"]["artwork"].get("url")
                    if cover_tmpl:
                        cover = cover_tmpl.replace("{w}", "400").replace("{h}", "400")
                
                return {
                    "status": "success",
                    "title": music_data.get("title"),
                    "artist": music_data.get("artist"),
                    "album": music_data.get("album"),
                    "cover_url": cover,
                    "links": {
                        "spotify": music_data.get("spotify", {}).get("external_urls", {}).get("spotify"),
                        "apple_music": music_data.get("apple_music", {}).get("url"),
                        "songlink": music_data.get("song_link")
                    }
                }
            elif result.get("status") == "success" and not result.get("result"):
                return {"status": "not_found", "error_message": "No music detected."}
            else:
                return {"status": "error", "error_message": result.get("error", {}).get("error_message", "AudD API Error")}
                
        except Exception as e:
            print("Exception:", str(e))
            return {"status": "error", "error_message": "An unexpected error occurred during processing."}
            
        finally:
            # Cleanup temp file
            if file_path and os.path.exists(file_path):
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Failed to delete temp file {file_path}: {e}")

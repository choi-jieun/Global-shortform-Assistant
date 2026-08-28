import yt_dlp

url = "https://www.youtube.com/watch?v=mbboeAgaur8"

with yt_dlp.YoutubeDL({"quiet": True}) as ydl:
    info = ydl.extract_info(url, download=False)

print("title:", info["title"])
print("duration:", info["duration"])
print("thumbnail:", info["thumbnail"])
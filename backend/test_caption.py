from youtube_transcript_api import YouTubeTranscriptApi

video_id = "mbboeAgaur8"

ytt_api = YouTubeTranscriptApi()
transcript = ytt_api.fetch(video_id, languages=['ko'])

raw = transcript.to_raw_data()
print(len(raw), "개 자막 줄")
print(raw[:5])
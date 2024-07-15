from googleapiclient.discovery import build
import os

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "services/Project.json"

def get_similar_videos(title, max_results=10):
        
        youtube = build("youtube", "v3")
        # , credentials=credentials
        request = youtube.search().list(
            part="snippet",
            maxResults=max_results,
            type="video",
            order="relevance",
            q=title)
        response = request.execute()
        return response['items']

Data = get_similar_videos("Python")
Data = [{'url' : f"https://www.youtube.com/watch?v={item['id']['videoId']}",
             'title' : item['snippet']['title'],
             'image' : item['snippet']['thumbnails']['high']['url']
             } for item in Data]

print(Data)